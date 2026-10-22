---
title: Projects, issues and fields
description: Create projects, register custom fields, write issues safely under concurrency, and read every issue's complete change history.
---

Projects hold the work, issues are the work, and custom fields carry the data your team cares about. Every issue write is version-checked, so two people (or a person and an agent) can never silently overwrite each other, and every change lands in an append-only history in the same transaction as the write. Everything on this page goes through the public REST API; the web interface uses exactly the same endpoints.

## Authentication

Data endpoints require you to be signed in, apart from the anonymous reads a public space allows (see [Public spaces](../run/users-and-auth.md#public-spaces)). The examples on this page use a session cookie (`kanso_session`), obtained by logging in with a local account:

```bash
curl -c cookies.txt -X POST "$KANSO_URL/api/v1/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"username": "admin", "password": "secret"}'
```

All examples below assume you pass the cookie jar with `-b cookies.txt`. `$KANSO_URL` is your Kanso server address. Agents and scripts can authenticate with a personal API token (`Authorization: Bearer …`) instead; see [Connecting an agent](../agents/connect.md).

## Projects

A project is the container for issues. Its `key` is a short, immutable identifier: 2 to 10 characters, uppercase letters and digits, starting with a letter (for example `KAN`). It becomes the prefix of every issue key in the project.

Create a project:

```bash
curl -b cookies.txt -X POST "$KANSO_URL/api/v1/projects" \
  -H "Content-Type: application/json" \
  -d '{"key": "KAN", "name": "Kanso"}'
```

Response (`201`):

```json
{
  "id": "0b6f8f3e-…",
  "key": "KAN",
  "name": "Kanso",
  "createdAt": "2026-08-19T10:00:00Z"
}
```

Creating a project with a key that already exists returns `409` with the error code `project_key_taken`. A malformed key returns `422`.

Read and list:

```bash
curl -b cookies.txt "$KANSO_URL/api/v1/projects/KAN"          # one project, 404 if unknown
curl -b cookies.txt "$KANSO_URL/api/v1/projects?limit=50"      # paged list
```

The list response contains `items` and, when more pages exist, an opaque `nextCursor` you pass back as `?after=<cursor>`.

## The global custom-field registry

Custom fields live in one global registry. Registering a field mints an **immutable id** of the form `cf_<n>` (for example `cf_1`). Issue data is stored and addressed by this id forever; the `key` and `name` you supply are display aliases you can change. Ids are minted sequentially and never reused.

Why it matters: because values are keyed by an immutable id rather than a display name, renaming a field never touches issue data, and no issue can ever hold a field the registry doesn't know about or a value of the wrong type.

Define a custom field:

```bash
curl -b cookies.txt -X POST "$KANSO_URL/api/v1/fields" \
  -H "Content-Type: application/json" \
  -d '{"key": "story_points", "name": "Story points", "type": "number"}'
```

Response (`201`):

```json
{
  "id": "cf_1",
  "key": "story_points",
  "name": "Story points",
  "type": "number",
  "createdAt": "2026-08-19T10:01:00Z"
}
```

Rules:

- `key` must match `^[a-z][a-z0-9_]{1,63}$` (lowercase snake_case); a duplicate key returns `409`.
- `type` is one of `text`, `number`, `select`, `multi_select`, `date`, `user` or `artifact`, and it is fixed for the life of the field. The select kinds may inline their first `options` (`422 field_options_not_applicable` on any other type); `artifact` is a file whose digest the server vouches for. See [Human answers](../agents/human-answers.md).
- `GET /fields` lists all registered field definitions (no paging; registries are small).

## Issues

### Creating an issue

Issue writes use a single `{fields}` envelope: system fields (`project`, `summary`, `description`, `descriptionFormat`, `assignee`, `priority`, `labels`, `dueDate`, `parent`, and, on create only, `type`) and custom fields (`cf_<n>`) travel in the same map. One write path serves people, agents and importers alike.

**Descriptions are Markdown.** `description` is stored and served byte-for-byte; `descriptionFormat` (`plain` | `markdown`) says how a client should read it and is served on every issue. Send text without a format and it is `markdown`: write CommonMark with GFM tables, task lists and fenced code, and every client renders it. Send `"descriptionFormat": "plain"` to store text that must never be interpreted. A `PATCH` carrying only `descriptionFormat` re-tags the existing text unchanged, as a normal versioned write with its own changelog item. Text written before Kanso supported Markdown, and everything the Jira importer writes, reads `plain`. JQL `description ~` and `text ~` search the raw text, Markdown syntax included, and `@mentions` are read from the raw text the same way. Comments carry the same pair as `body` / `bodyFormat`.

```bash
curl -b cookies.txt -X POST "$KANSO_URL/api/v1/issues" \
  -H "Content-Type: application/json" \
  -H "Idempotency-Key: create-first-issue-1" \
  -d '{
    "fields": {
      "project": "KAN",
      "summary": "First issue",
      "cf_1": 5
    }
  }'
```

Response (`201`, abridged):

```json
{
  "id": "7c2a5f19-…",
  "key": "KAN-1",
  "project": "KAN",
  "summary": "First issue",
  "description": "",
  "descriptionFormat": "markdown",
  "status": "todo",
  "workflow": { "id": "wf_1", "version": 1 },
  "fields": { "cf_1": 5 },
  "version": 1,
  "createdAt": "2026-08-19T10:02:00Z",
  "updatedAt": "2026-08-19T10:02:00Z"
}
```

Guarantees you can rely on:

- **Issue keys are integral.** Keys are `<PROJECT>-<n>`, allocated per project in increasing order and never reused, even under concurrent creation.
- **The registry rules.** An unknown field key (say `sprint_name`, or an unminted `cf_99`) returns `422` with `details[0].path` pointing at the offending key, and nothing is written. A value of the wrong type (a string in a `number` field) is likewise rejected.
- **Idempotency.** The optional `Idempotency-Key` header (up to 128 characters) makes creation replay-safe: sending the same request twice creates exactly one issue. The replay returns `200` with the originally created issue, as it reads now, instead of a duplicate. A key belongs to you in one project: the same key sent by another user, or by you into another project, creates a new issue. Your session and all your API tokens share your keys. A key that is not valid UTF-8, or is longer than 128 characters, is refused with `422` and nothing is written.

### Reading and listing

```bash
curl -b cookies.txt "$KANSO_URL/api/v1/issues/KAN-1"
curl -b cookies.txt "$KANSO_URL/api/v1/issues?project=KAN&limit=50"
```

The list endpoint returns issues newest-first with the same `items`/`nextCursor` paging as projects. `GET /issues` is a simple convenience list; for querying, use [JQL search](search-jql.md).

## Components: which part of the system, and who owns it

Versions answer "which release"; components answer "which part". They are a **per-project** registry:

```bash
curl -b cookies.txt "$KANSO_URL/api/v1/projects/KAN/components"
curl -b cookies.txt -X POST "$KANSO_URL/api/v1/projects/KAN/components" \
  -H "Content-Type: application/json" \
  -d '{"name": "Search", "lead": "u_3"}'
```

- An issue holds **several** components, written through the ordinary envelope: `PATCH /issues/KAN-1 {"fields": {"components": ["cmp_7", "cmp_9"]}}` with `If-Match`. It is a set: duplicates are refused, `[]` clears, and leaving the key out leaves the associations alone. Every id must name a component of the issue's **own** project.
- The **lead** answers "who owns it" and assigns nobody. Kanso never auto-assigns work: Jira's per-component `assigneetype` rule is refused rather than simulated, and an import says so with a count instead of pretending.
- Renaming is an alias write; archiving refuses new associations while every issue already carrying the component keeps it; deleting is refused while any issue **or any stored form default** still references it, and the `409` names both counts.
- Registry writes need the `manage_components` permission. Upgrading an existing instance grants it automatically to everyone who already had `manage_versions`.
- JQL: `component = "Search"`, `component IN (...)`, `component IS EMPTY`. The field name is singular, as in Jira.

## Resolutions: how an issue ended

Status says *where* an issue is; the resolution says *why it left*. Kanso enforces one rule: an issue carries a resolution **exactly while its status is in the done category**, and at no other time. There is no "Done but unresolved" and no "reopened but still Fixed", so `resolution IS EMPTY` reliably means "still open".

The registry is global and seeded with four values (`Fixed`, the default, plus `Won't Do`, `Duplicate` and `Cannot Reproduce`):

```bash
curl -b cookies.txt "$KANSO_URL/api/v1/resolutions"
```

- A transition into a done state assigns a resolution automatically: whatever the workflow's `set_field` post-function or the transition's "Resolve" screen declared, otherwise the default row. A transition *out* of done clears it. A stock Kanso therefore resolves correctly with no configuration at all.
- Correcting one is an ordinary versioned write: `PATCH /issues/KAN-1 {"fields": {"resolution": "res_3"}}` with `If-Match`, one changelog item, no re-transition. It is refused (`422`) on an issue that is not done, and an explicit `null` on a done issue is refused too: clearing happens by leaving done. (An explicit `null` on an issue that is *not* done is always accepted; that is the repair path.)
- `resolution` is **not** writable on create: a new issue is open.
- Renaming a resolution is an alias write: one row changes and every issue shows the new name instantly. Archiving refuses new uses while every issue already carrying the value keeps it. Deleting is refused while any issue references it, and the default row cannot be deleted at all.
- Creating, renaming, archiving and deleting resolutions is a **site-admin** operation on a global vocabulary, so it deliberately has no project permission: API tokens, installed apps and MCP agents cannot do it.

## Issue versioning: the version envelope

Every issue carries a `version` number that increments by exactly 1 on every successful write. Updates **must** send the version you last saw in an `If-Match` header. If someone else changed the issue in the meantime, your write is rejected with `409` and changes nothing. There are no silent lost updates.

Update a field with the version envelope:

```bash
curl -b cookies.txt -X PATCH "$KANSO_URL/api/v1/issues/KAN-1" \
  -H "Content-Type: application/json" \
  -H "If-Match: 1" \
  -d '{"fields": {"summary": "Renamed", "cf_1": 8}}'
```

On success (`200`) the response is the updated issue with `version: 2`. Retrying with the now-stale `If-Match: 1` returns `409`.

Update semantics:

- Updates are partial merges: only the keys you send change.
- Setting a custom field to `null` clears it.
- `project` is not updatable (`422`); `type` is create-only.
- An empty envelope (`{"fields": {}}`) is rejected with `422`.

## The changelog

Every successful write appends its change events **in the same transaction as the write itself**, so history is complete from the issue's birth and can never disagree with the issue's state. The changelog is append-only: there is no way to edit or delete history.

Read it:

```bash
curl -b cookies.txt "$KANSO_URL/api/v1/issues/KAN-1/changelog?startAt=0&maxResults=100"
```

Response shape:

```json
{
  "startAt": 0,
  "maxResults": 100,
  "total": 2,
  "histories": [
    {
      "at": "…",
      "author": { "…": "…" },
      "items": [
        { "fieldId": "…", "from": "…", "fromString": "…", "to": "…", "toString": "…" }
      ]
    }
  ]
}
```

Groups are returned oldest-first; each group is the complete set of events from one write (one transaction, one group). Within an item, `fieldId` is a system field name (`summary`, `description`, `status`, `created`, …) or a `cf_<n>` id. `from`/`to` carry machine values and `fromString`/`toString` display values (for a status change, `from`/`to` are state ids and `fromString`/`toString` the state names); any of the four may be `null`. The very first group of every issue records its creation with `fieldId: "created"`. Page with `startAt`/`maxResults`; `total` is the full group count.
