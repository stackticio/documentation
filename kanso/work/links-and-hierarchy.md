---
title: Links and hierarchy
description: Relate issues with typed, directional links and nest them into parent/child trees of any depth.
---

Kanso gives you two ways to structure work. **Issue links** relate any two issues through a named, directional relationship (Blocks, Duplicates, and so on). **Parent/child hierarchy** nests issues into a tree of any depth, built in. The two are deliberately different mechanisms: links are a subresource that never touches an issue's version, while `parent` is an ordinary versioned field on the issue itself.

## Issue links

### The link-type registry

Link types live in a registry at `/issue-link-types`. Every fresh Kanso comes seeded with four types:

| Name | Outward phrase | Inward phrase |
|---|---|---|
| Blocks | blocks | is blocked by |
| Duplicates | duplicates | is duplicated by |
| Clones | clones | is cloned by |
| Relates | relates to | relates to |

You can add your own (`POST /issue-link-types` with `name`, `inward`, `outward`; names are unique, and a duplicate is `409 link_type_name_taken`), rename a type or its phrases (`PATCH /issue-link-types/{linkTypeId}`), and delete an unused type (`DELETE`; a type any link references is refused with `409 link_type_in_use`).

Phrases are resolved from the registry **at read time**: renaming a type changes the wording everywhere immediately and rewrites nothing.

### Directional links

A link is one record: `(typeId, outwardIssue, inwardIssue)`. The type's two phrases describe each side. With the Blocks type, creating:

```json
{"typeId": "lt_1", "outwardIssue": "KAN-1", "inwardIssue": "KAN-2"}
```

means **"KAN-1 blocks KAN-2"**. KAN-1's link list shows `direction: outward, phrase: "blocks", other: KAN-2`; KAN-2's shows `direction: inward, phrase: "is blocked by", other: KAN-1`. Both sides carry the same link id: delete it once and it disappears from both lists atomically.

Creation rules (`POST /issue-links`):

- Both issues and the type must exist (`404`).
- An issue cannot link to itself (`422 self_link`).
- The exact triple `(typeId, outwardIssue, inwardIssue)` is unique (`409 duplicate_link`). A replayed create gets `409`, which callers may treat as success.
- The **reversed** pair is a distinct link and is allowed, even for symmetric types like Relates.

### Links are a subresource

Links are read from `GET /issues/{issueKey}/links` (ordered by id) and are **not embedded in the Issue object**. This is a deliberate difference from Jira's `fields.issuelinks`, and it keeps every search and list payload unchanged. A single link's raw row is available at `GET /issue-links/{linkId}`; `DELETE /issue-links/{linkId}` removes it from both issues.

Link operations are **version-exempt**: creating or deleting a link bumps neither issue's `version` and takes no `If-Match`, so linking two issues never conflicts with someone editing either one.

### Link history

Every link create and delete appends a changelog item to **both** issues, in the same transaction as the row change. Each side records its own phrasing: an item like `{fieldId: "link", from: null, to: "blocks KAN-2"}` on KAN-1, and `{fieldId: "link", from: null, to: "is blocked by KAN-1"}` on KAN-2. Deletion writes the mirrored `from`/`to`.

### Link examples

Assumes `KANSO=https://your-kanso.example.com/api/v1` and a session cookie in `cookies.txt` (see `POST /auth/login`).

```sh
# The registry — seeded types with both phrases
curl -b cookies.txt "$KANSO/issue-link-types"

# "KAN-1 blocks KAN-2" (use the Blocks type's id from the registry)
curl -b cookies.txt -X POST "$KANSO/issue-links" \
  -H 'Content-Type: application/json' \
  -d '{"typeId": "lt_1", "outwardIssue": "KAN-1", "inwardIssue": "KAN-2"}'
# 201 → {"id": "lnk_7", "typeId": "lt_1", "outwardIssue": "KAN-1", "inwardIssue": "KAN-2", "createdAt": "…"}

# Each side, resolved for that side
curl -b cookies.txt "$KANSO/issues/KAN-1/links"
# items[0]: direction "outward", phrase "blocks",        otherIssue.key "KAN-2"
curl -b cookies.txt "$KANSO/issues/KAN-2/links"
# items[0]: direction "inward",  phrase "is blocked by", otherIssue.key "KAN-1"

# Unlink — gone from both lists
curl -b cookies.txt -X DELETE "$KANSO/issue-links/lnk_7"   # 204
```

## Parent/child hierarchy

### `parent` is a normal field

`parent` is a system field written through the same `{fields}` envelope as `summary`, on create and on `PATCH /issues/{issueKey}`. This is the opposite choice from links, and it is intentional: reparenting changes what the issue *is* in the plan, so two people reparenting the same issue at the same time is a real conflict, and version checking must surface it. A parent change is therefore a normal versioned write: `If-Match` is honored, `version` increments by exactly one, and one changelog item `{fieldId: "parent", from: <old key|null>, to: <new key|null>}` is written in the same transaction, on the **child only**. Set `parent` to an issue key to nest, or to `null` to make the issue a root.

Every parent write is validated (`422` with a specific code):

- the parent must exist (`unknown_parent`),
- be in the same project (`cross_project_parent`; cross-project parents are not supported),
- differ from the issue itself (`self_parent`),
- and the resulting chain must stay acyclic (`hierarchy_cycle`).

There is no depth limit. Cycle detection runs inside the write transaction, so two concurrent writes that would jointly form a cycle are serialized and at most one commits.

The Issue payload carries `parent` as a resolved reference (key, summary, type, status) or `null`.

### Reading the tree

Three read endpoints, all derived from the same underlying parent relationship:

- `GET /issues/{issueKey}/children?depth=n`: descendants up to `depth` (default 1 = direct children). Returns full Issue objects, cursor-paged, ordered level by level (`depth ASC, rank ASC, id ASC`), so siblings appear in backlog rank order.
- `GET /issues/{issueKey}/ancestors`: the chain to the root, nearest first (parent, grandparent, …). Unpaged; empty for a root issue.
- `GET /issues/{issueKey}/tree`: the whole subtree as nested light nodes (key, summary, type, status; children in rank order), optionally limited with `?depth=`. At most 1000 nodes are returned; a larger subtree sets `truncated: true` rather than silently answering in part. Walk the `/children` pages instead.

### Presentation levels

Each project names its tree depths at `GET|PUT /projects/{projectKey}/hierarchy-levels`. New projects are seeded with **Epic (0) / Story (1) / Sub-task (2)**. `PUT` replaces the whole list: depths must be contiguous from 0 and unique, with at most 20 entries and names of 1–100 characters (`422` otherwise).

Levels are presentation only and constrain **nothing**. An issue can nest deeper than the last named level without error, any type can parent any type, and renaming levels rewrites no issues; the list is a lookup the web interface joins at read time.

### JQL

The `parent` field is part of the JQL vocabulary: `parent = KAN-1`, `parent != KAN-1`, `parent IN (KAN-1, KAN-2)`, `parent NOT IN (KAN-1, KAN-2)`, `parent IS EMPTY` (roots), `parent IS NOT EMPTY`. It is **non-recursive**: `parent = KAN-1` matches direct children only, never grandchildren. See [Search and JQL](search-jql.md).

### Hierarchy examples

```sh
# Create a child directly under KAN-1
curl -b cookies.txt -X POST "$KANSO/issues" \
  -H 'Content-Type: application/json' \
  -d '{"fields": {"project": "KAN", "summary": "Implement login form", "parent": "KAN-1"}}'

# Reparent KAN-3 under KAN-2 — a normal versioned write (If-Match = current version)
curl -b cookies.txt -X PATCH "$KANSO/issues/KAN-3" \
  -H 'Content-Type: application/json' \
  -H 'If-Match: 4' \
  -d '{"fields": {"parent": "KAN-2"}}'
# 200 → version 5; changelog on KAN-3: {fieldId: "parent", from: "KAN-1", to: "KAN-2"}

# Make it a root again
curl -b cookies.txt -X PATCH "$KANSO/issues/KAN-3" \
  -H 'Content-Type: application/json' \
  -H 'If-Match: 5' \
  -d '{"fields": {"parent": null}}'

# Direct children, in rank order
curl -b cookies.txt "$KANSO/issues/KAN-1/children"
# All descendants down to depth 3
curl -b cookies.txt "$KANSO/issues/KAN-1/children?depth=3"
# Chain to the root, nearest-first
curl -b cookies.txt "$KANSO/issues/KAN-5/ancestors"
# The whole subtree in one call
curl -b cookies.txt "$KANSO/issues/KAN-1/tree"

# The project's level names (seeded Epic/Story/Sub-task)
curl -b cookies.txt "$KANSO/projects/KAN/hierarchy-levels"
# Rename them — cosmetic only, constrains nothing
curl -b cookies.txt -X PUT "$KANSO/projects/KAN/hierarchy-levels" \
  -H 'Content-Type: application/json' \
  -d '{"items": [{"depth": 0, "name": "Initiative"}, {"depth": 1, "name": "Epic"}, {"depth": 2, "name": "Story"}, {"depth": 3, "name": "Task"}]}'

# JQL: direct children of KAN-1 (non-recursive), and all roots
curl -b cookies.txt --get "$KANSO/search/jql" --data-urlencode 'jql=parent = KAN-1'
curl -b cookies.txt --get "$KANSO/search/jql" --data-urlencode 'jql=project = KAN AND parent IS EMPTY'
```
