---
title: Search and JQL
description: Find issues with Kanso's Jira-style query language, sort and page the results, and read every query error precisely.
---

Kanso ships a Jira-style query language (JQL) for finding issues. It runs directly against PostgreSQL, the source of truth, so there is no separate index and no indexing lag: a write is searchable the moment its response returns. The grammar is part of the contract, and the server serves the exact grammar file it parses with, so you can always fetch the authoritative syntax.

All endpoints below live under the API base path `/api/v1` and, except for the grammar, require a session (log in via `POST /auth/login`, which sets the `kanso_session` cookie).

## Endpoints

| Endpoint | Purpose |
|---|---|
| `GET /search/jql?jql=...` | Run a query. Parameters: `jql` (required), `maxResults` (1–100, default 50), `nextPageToken`. |
| `POST /search/jql` | Identical semantics; the query goes in a JSON body (`{"jql": ..., "maxResults": ..., "nextPageToken": ...}`). Use it for long queries. |
| `POST /search/approximate-count` | Body `{"jql": ...}`. Returns `{"count": n}`. Same language and validation as search; `ORDER BY` is permitted and ignored. |
| `GET /jql/grammar` | Returns the ANTLR4 grammar file, byte-identical, as `text/plain`. Open: no session required. |

Despite the endpoint's name, the count Kanso returns is **exact**.

Search never writes anything, and it never returns an issue you could not fetch directly with `GET /issues/{key}`: what you can read directly and what search shows you are always the same.

## Syntax

The full syntax is defined by the served grammar; the essentials:

- A query is one or more comparisons combined with `AND`, `OR`, `NOT` and parentheses, optionally followed by `ORDER BY`. Precedence: `NOT` binds tightest, then `AND`, then `OR`.
- Keywords are case-insensitive (`and`, `AND`, `And` are all fine). Values are case-sensitive, except in `~`/`!~` matching.
- Operators: `=`, `!=`, `~`, `!~`, `<`, `<=`, `>`, `>=`, `IN (...)`, `NOT IN (...)`, `IS EMPTY`, `IS NOT EMPTY`.
- Bare (unquoted) values cover keys, usernames, ids and labels shaped like `[A-Za-z_][A-Za-z0-9_.-]*`. Anything else (dates, values with spaces or punctuation, or a value that collides with a keyword, such as a label named `empty`) must be quoted with `'...'` or `"..."` (backslash escapes).
- There is no query for "everything": an empty query or a bare `ORDER BY ...` is a parse error. Every query needs at least one restriction clause.

`~` is **case-insensitive substring containment**, a deliberate difference from Jira's fuzzy full-text matching. It is deterministic: `summary ~ "log"` matches any summary containing "log", "Log", "LOGIN", and so on. `!~` is its negation.

## Fields

Field names match case-insensitively. Custom fields are addressed by their registry `key` (renaming a key takes effect immediately; `cf_<n>` ids are the API's wire format, not JQL names).

| Field | Matches | Operators |
|---|---|---|
| `project` | project key | `=` `!=` `IN` `NOT IN` |
| `key` | issue key (numeric per-project ordering) | `=` `!=` `IN` `NOT IN` |
| `type` | issue type: `it_<n>` id or unique name | `=` `!=` `IN` `NOT IN` |
| `status` | state id of the issue's workflow version | `=` `!=` `IN` `NOT IN` |
| `statusCategory` | `todo` \| `in_progress` \| `done` | `=` `!=` `IN` `NOT IN` |
| `priority` | priority id (`highest`..`lowest`) | `=` `!=` `IN` `NOT IN` |
| `assignee` | username or `currentUser()` | `=` `!=` `IN` `NOT IN`, `IS [NOT] EMPTY` |
| `reporter` | username or `currentUser()` | `=` `!=` `IN` `NOT IN`, `IS [NOT] EMPTY` |
| `labels` | exact label (contains semantics, see below) | `=` `!=` `IN` `NOT IN`, `IS [NOT] EMPTY` |
| `summary` | text | `~` `!~` |
| `description` | text (empty string counts as EMPTY) | `~` `!~`, `IS [NOT] EMPTY` |
| `text` | summary OR description (shorthand) | `~` |
| `dueDate` | plain date | `=` `!=` `<` `<=` `>` `>=` `IN` `NOT IN`, `IS [NOT] EMPTY` |
| `created` / `updated` | createdAt / updatedAt timestamps | `=` `!=` `<` `<=` `>` `>=` |
| `sprint` | `s_<n>` id or exact sprint name (`IS EMPTY` = backlog) | `=` `!=` `IN` `NOT IN`, `IS [NOT] EMPTY` |
| `parent` | direct parent issue key (non-recursive: direct children only) | `=` `!=` `IN` `NOT IN`, `IS [NOT] EMPTY` |
| `fixVersion` | `ver_<n>` id or version name (contains semantics, like `labels`) | `=` `!=` `IN` `NOT IN`, `IS [NOT] EMPTY` |
| `component` | `cmp_<n>` id or component name (contains semantics, see below) | `=` `!=` `IN` `NOT IN`, `IS [NOT] EMPTY` |
| `resolution` | `res_<n>` id or resolution name (names match case-insensitively) | `=` `!=` `IN` `NOT IN`, `IS [NOT] EMPTY` |
| `resolved` | the resolvedAt timestamp | `=` `!=` `<` `<=` `>` `>=`, `IS [NOT] EMPTY` |
| `leasedBy` | holder of a live (unexpired) work lease: username or `currentUser()` | `=` `!=` `IN` `NOT IN`, `IS [NOT] EMPTY` |
| `level` | issue security level name | `=` `!=` `IN` `NOT IN`, `IS [NOT] EMPTY` |
| `record` | a record kind, or `kind:status`, attached to the issue | `=` `!=` `IN` `NOT IN`, `IS [NOT] EMPTY` |
| `changedBy` | an issue with at least one changelog group (the creation included) whose author is a value: username, `u_<n>` or `currentUser()` | `=` `!=` `IN` `NOT IN`, `IS [NOT] EMPTY` |
| `commentedBy` | an issue with at least one comment whose author is a value: username, `u_<n>` or `currentUser()` | `=` `!=` `IN` `NOT IN`, `IS [NOT] EMPTY` |
| `changedVia` | an issue with at least one changelog group made with a value: a kind (`session`, `session_mcp`, `token`, `app`, `connector`, `import`, `system`) or a credential id (`kat_<n>`, `ains_<n>`, `cbind_<n>`) | `=` `!=` `IN` `NOT IN`, `IS [NOT] EMPTY` |
| `commentedVia` | an issue with at least one comment created with a value (the `changedVia` values) | `=` `!=` `IN` `NOT IN`, `IS [NOT] EMPTY` |
| `<custom field key>` (text) | custom field value | `~` `!~`, `IS [NOT] EMPTY` |
| `<custom field key>` (number) | custom field value | `=` `!=` `<` `<=` `>` `>=` `IN` `NOT IN`, `IS [NOT] EMPTY` |
| `<custom field key>` (select) | option name of that field (case-insensitive) | `=` `!=` `IN` `NOT IN`, `IS [NOT] EMPTY` |
| `<custom field key>` (multi_select) | option name of that field (contains semantics, like `labels`) | `=` `!=` `IN` `NOT IN`, `IS [NOT] EMPTY` |
| `<custom field key>` (date) | `"YYYY-MM-DD"` | `=` `!=` `<` `<=` `>` `>=` `IN` `NOT IN`, `IS [NOT] EMPTY` |
| `<custom field key>` (user) | username or `currentUser()` | `=` `!=` `IN` `NOT IN`, `IS [NOT] EMPTY` |
| `<custom field key>` (artifact) | whether a file is set | `IS [NOT] EMPTY` |

Any (field, operator) pair outside this table is rejected with a `422`. `IS EMPTY` is only legal on fields that can actually be empty; on always-present fields it is an error, never a constant false.

Notes on semantics:

- **labels**: `=` means contains, `!=` means does not contain (an unlabeled issue matches `!=`), `IN` contains any, `NOT IN` contains none, `IS EMPTY` no labels. `fixVersion` and multi-select custom fields behave the same way.
- **component**: the field name is singular, as in Jira, even though an issue holds several components (the same as `fixVersion` and the issue's `fixVersions`). `=` means "has this component" and `!=` "does not have it", so an issue with **no** components matches `!=`, which is why `IS EMPTY` exists separately. Names resolve at query time and are valid when **any** project carries them; the query still matches only components of the issue's own project, because a component can only ever be attached inside its project. An unknown id or name is a `422` naming it. `ORDER BY component` is refused: a set has no order.
- **resolution / resolved**: an issue carries a resolution *exactly* while its status is in the done category, so `resolution IS EMPTY` reliably means "still open" and is equivalent to `statusCategory != done` and to `resolved IS EMPTY`. Like `labels`, `!=` also matches issues with no resolution at all, which is exactly why `IS EMPTY` exists as its own clause. Names are a **closed** vocabulary and are matched case-insensitively (`resolution = "won't do"` works), resolved at query time, so a rename takes effect on the next query and the old name is refused from then on. Ids stay exact. `ORDER BY resolution` sorts by the registry's rank, never alphabetically.
- **sprint**: if two sprints share a name, a query by name matches all of them; use the `s_<n>` id to be precise.
- **leasedBy**: only a lease that has not expired counts, so `leasedBy IS EMPTY` finds unclaimed work and `leasedBy != x` also matches issues nobody holds.
- **History fields** (`changedBy`, `commentedBy`, `changedVia`, `commentedVia`): filters over the issues you can already see; they never widen a result. Every write records the credential that made it (its *via*): a personal API token (`token`, `kat_<n>`), the session cookie (`session` on every route but `/mcp`, `session_mcp` on `/mcp`), an app (`app`, `ains_<n>`), a connector delivery (`connector`, `cbind_<n>`), the Jira importer (`import`) or Kanso itself (`system`, e.g. a workflow publish remapping issues). Kind keywords are case-insensitive and each matches only its own kind: `changedVia = session` never matches an `/mcp` write, and "any session" is `changedVia IN (session, session_mcp)`. A credential id is accepted only when you know it: one of your own tokens, or the via of something on an issue you can see. Any other id (a typo, a token that never wrote, or one that wrote only where you cannot look) gets the same `422` (`unknown credential "kat_7" at 1:14`). The comment fields search comment *creation* only; edits are not searched. The clauses are independent: `changedBy = alice AND changedVia = session` also matches an issue alice changed with a token and someone else changed in a browser. History written before Kanso 0.71 has no via: it matches no positive value, matches `!=`, and `changedVia IS EMPTY` finds issues whose whole history predates it. `ORDER BY` any of the four is a `422`. In a webhook `jqlFilter` and an app trigger's `jql` they are refused at save (`jql_type_mismatch`, "… is a history field"): an event filter sees the issue as it is now, not its history, so read the delivery's `via` member instead.
- **`currentUser()`** resolves to the logged-in user. It is the only function; anything else is a `422`.
- **Dates** are quoted strings interpreted in UTC. On timestamp fields (`created`, `updated`) a date-only literal like `"2026-08-19"` means the whole-day interval: `=` matches inside the day, `>` after it ends, `>=` from its start, `<` before its start, `<=` before it ends. An RFC3339 literal compares as an exact instant. `dueDate` is a plain date and compares directly.
- **Unknown values fail closed.** Values from closed vocabularies (project keys, types, priorities, statusCategory, usernames, sprints, versions, components, resolutions, security levels, record kinds, select options) are validated at query time: an unknown one is a `422` naming it, never a silently empty result. Open vocabularies (status ids, labels, and issue keys in a `key` clause) are not validated: no match simply means an empty result.

## ORDER BY

`ORDER BY` accepts one or more keys, each optionally `ASC` (default) or `DESC`:

- `created`, `updated`, `dueDate`
- `priority`: by urgency rank; `ASC` puts the most urgent first
- `resolution`: by the registry's rank order; `resolved`: by the instant the issue was resolved
- `key`: project, then issue number **numerically** (KAN-9 before KAN-10)
- `summary`: case-insensitive
- `rank`: the global backlog order (LexoRank; see [Boards and sprints](boards-sprints.md)). `rank` is ORDER BY-only: using it as a comparison field (`rank > 3`) is a `422`.
- custom fields: number fields sort numerically, text fields case-insensitively, date fields by date, select fields by option order, user fields by username

Fields that hold a set of values (`labels`, `fixVersion`, `component`, multi-select fields) and artifact fields cannot be sorted. Anything else is a `422`. Nulls sort last in both directions. Without an `ORDER BY`, results come back `created DESC`. Every ordering gets the issue id appended as a final tiebreaker, so the same data and query always produce the same order, across requests and across pages.

## Pagination

Responses carry `issues`, `isLast`, and (when more pages exist) `nextPageToken`. Pass the token back with the **byte-identical** `jql` string to get the next page; using it with any other query, or a corrupt token, is a `422`. `maxResults` is 1–100, default 50. While the data does not change, walking all pages covers the result set exactly: no overlaps, no gaps.

## Errors

Every rejected query is an HTTP `422` with `details[].path = "/jql"` and the position or construct in the message:

| Code | When |
|---|---|
| `jql_parse_error` | syntax error, empty query, bare `ORDER BY` |
| `jql_unknown_field` | field is neither a system field nor a custom-field key |
| `jql_unknown_value` | unknown closed-vocabulary value (project/type/priority/statusCategory/username/sprint/resolution/component, and the other closed vocabularies above) |
| `jql_unknown_function` | any function other than `currentUser()` |
| `jql_type_mismatch` | operator not allowed on that field (including illegal `IS EMPTY`) |
| `jql_invalid_order` | `ORDER BY` key not in the sortable set |
| `jql_bad_page_token` | corrupt token, or token used with a different jql string |

## Examples

```
project = KAN AND statusCategory != done ORDER BY priority ASC
```

```
assignee = currentUser() AND sprint IS EMPTY ORDER BY rank
```

```
summary ~ "login" OR description ~ "login"
```

```
text ~ crash ORDER BY updated DESC
```

```
labels IN (backend, urgent) AND NOT labels = wontfix
```

```
created >= "2026-08-01" AND created < "2026-09-01" ORDER BY created DESC
```

```
dueDate <= "2026-08-31" AND dueDate IS NOT EMPTY ORDER BY dueDate
```

```
(project = KAN OR project = OPS) AND assignee IS EMPTY
```

```
sprint = "Sprint 1" AND statusCategory = in_progress
```

```
parent = KAN-1 ORDER BY rank
```

Run one with curl, after logging in (see [Boards and sprints](boards-sprints.md) for a login example; `$KANSO_URL` is your Kanso server address):

```bash
curl -b cookies.txt --get "$KANSO_URL/api/v1/search/jql" \
  --data-urlencode 'jql=assignee = currentUser() AND statusCategory != done ORDER BY priority ASC' \
  --data-urlencode 'maxResults=20'
```

Count matches:

```bash
curl -b cookies.txt -X POST "$KANSO_URL/api/v1/search/approximate-count" \
  -H 'Content-Type: application/json' \
  -d '{"jql": "project = KAN AND labels = backend"}'
```

Fetch the grammar (no session needed):

```bash
curl "$KANSO_URL/api/v1/jql/grammar"
```
