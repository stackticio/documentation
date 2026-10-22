---
title: Boards and sprints
description: Rank the backlog, plan work in sprints, and read every board view as a JQL query.
---

Every project gets a board, and you plan work in sprints on top of one globally ranked backlog. Ordering is data on the issue, and JQL is how you read it: the backlog and every board view are queries like `sprint IS EMPTY ORDER BY rank`, not special list endpoints. This page covers the board and sprint endpoints, how ranking works and why it never conflicts with edits, and the sprint lifecycle.

All endpoints live under `/api/v1` and require a session. `$KANSO_URL` below is your Kanso server address. Log in first:

```bash
curl -c cookies.txt -X POST "$KANSO_URL/api/v1/auth/login" \
  -H 'Content-Type: application/json' \
  -d '{"username": "alice", "password": "your-password"}'
```

## Boards

Every project has exactly one automatically created **default board**, named after the project. It is created in the same transaction that creates the project. Boards are read-only: there is no board create, edit or delete, and no column, swimlane or filter configuration.

- `GET /boards`: list all boards; `?project=KEY` filters to one project (`404` if the project does not exist).
- `GET /boards/{boardId}`: get one board. Board ids look like `b_1`.

A board carries `id`, `project`, `name` and `createdAt`.

## The backlog and ranking

Every issue carries a rank string. Its format is deliberately not part of the contract: treat it as opaque and only ever observe the **order**, via JQL `ORDER BY rank`. Ranks are globally unique and total (no two issues ever share one), the order is the same on every board, and new issues append at the end.

The backlog of a project is just a query:

```
project = KAN AND sprint IS EMPTY ORDER BY rank
```

### Re-ranking issues: `PUT /issues/rank`

To reorder, send up to 50 issue keys and exactly one anchor: `rankBeforeIssue` **or** `rankAfterIssue`, never both, never neither. The listed issues land contiguously, in list order, immediately before or after the anchor. Success is a `204` with no body.

Move KAN-7 so it sits directly before KAN-2:

```bash
curl -b cookies.txt -X PUT "$KANSO_URL/api/v1/issues/rank" \
  -H 'Content-Type: application/json' \
  -d '{"issues": ["KAN-7"], "rankBeforeIssue": "KAN-2"}'
```

Move three issues, in this order, directly after KAN-10:

```bash
curl -b cookies.txt -X PUT "$KANSO_URL/api/v1/issues/rank" \
  -H 'Content-Type: application/json' \
  -d '{"issues": ["KAN-4", "KAN-9", "KAN-1"], "rankAfterIssue": "KAN-10"}'
```

Errors: `422` for both anchors, neither anchor, an anchor that also appears in the list, or more than 50 issues; `404` if any listed issue or the anchor does not exist (the error details name the offender).

### Why ranking never conflicts with edits

Ranking is the one deliberate exception to Kanso's normal write rules: `PUT /issues/rank` bumps **no** issue version, writes **no** changelog entry, and requires **no** `If-Match` header. Reordering is not treated as an edit to the issues; only their position changes, and only for the listed issues. Instead of version checks, concurrent moves into the same gap are serialized by the database: either order of the two moves is a valid outcome, ranks stay distinct, and nothing is lost. Every other write on this page keeps the normal rules.

## Sprints

Sprint ids look like `s_1`. A sprint carries `id`, `boardId`, `name`, `goal`, `state` (`future` | `active` | `closed`), `startedAt`, `completedAt` and `createdAt`. Each issue's body carries a `sprint` field: `{id, name, state}`, or `null` for the backlog.

- `GET /boards/{boardId}/sprints`: all sprints of a board, newest first.
- `POST /sprints`: create a sprint (body: `boardId`, `name`, optional `goal`). It starts in state `future`.
- `GET /sprints/{sprintId}`: get one sprint.
- `PATCH /sprints/{sprintId}`: rename, change the goal, or move the sprint through its lifecycle.

### The lifecycle

Sprints move strictly `future → active → closed`, one step at a time. Skipping a state (`future → closed`) or moving backwards is a `422`. Only **one sprint per board** can be active; activating a second returns `409 sprint_active_exists`.

- **Activate** (`state: "active"`): stamps `startedAt`.
- **Close** (`state: "closed"`): stamps `completedAt` and, atomically in the same transaction, returns every incomplete issue (`statusCategory != done`) to the backlog. Each returned issue gets a normal write: a version bump plus a `"sprint"` changelog event. Done issues keep the closed sprint on their record.

### Closed sprints are immutable, in both directions

A closed sprint accepts only `name` and `goal` edits. Any state change, and any membership change (adding issues to it or pulling its issues out), is rejected with `409`. The only issues that leave a closed sprint are the incomplete ones the close itself returned to the backlog.

### Sprint membership

Membership is changed only through two endpoints. Putting a `sprint` key in an issue's `{fields}` envelope on create or PATCH is a `422`.

- `POST /sprints/{sprintId}/issues`: move issues into the sprint.
- `POST /backlog/issues`: return issues to the backlog.

Both take `{"issues": [...]}` with 1 to 50 keys and are **atomic**: one bad member (an unknown key, or an issue from a different project than the sprint's board) rejects the whole batch with `422`, with details naming each offender, and nothing changes. Unlike ranking, membership is a normal write: each issue that actually changes bumps its version by 1 and gets a `"sprint"` changelog event. Issues already in the target state are accepted as no-ops and bump nothing. Success is `204`.

### A full sprint walk-through

```bash
# 1. Find the project's default board
curl -b cookies.txt "$KANSO_URL/api/v1/boards?project=KAN"

# 2. Create a sprint on it (state: future)
curl -b cookies.txt -X POST "$KANSO_URL/api/v1/sprints" \
  -H 'Content-Type: application/json' \
  -d '{"boardId": "b_1", "name": "Sprint 1", "goal": "Ship search"}'

# 3. Pull issues in from the backlog (atomic; version +1 + changelog each)
curl -b cookies.txt -X POST "$KANSO_URL/api/v1/sprints/s_1/issues" \
  -H 'Content-Type: application/json' \
  -d '{"issues": ["KAN-1", "KAN-2", "KAN-3"]}'

# 4. Start the sprint (stamps startedAt; 409 if the board already has an active one)
curl -b cookies.txt -X PATCH "$KANSO_URL/api/v1/sprints/s_1" \
  -H 'Content-Type: application/json' \
  -d '{"state": "active"}'

# 5. See the sprint's issues, in rank order
curl -b cookies.txt --get "$KANSO_URL/api/v1/search/jql" \
  --data-urlencode 'jql=sprint = s_1 ORDER BY rank'

# 6. Change your mind about one issue mid-sprint
curl -b cookies.txt -X POST "$KANSO_URL/api/v1/backlog/issues" \
  -H 'Content-Type: application/json' \
  -d '{"issues": ["KAN-3"]}'

# 7. Close the sprint (stamps completedAt; incomplete issues return to the backlog)
curl -b cookies.txt -X PATCH "$KANSO_URL/api/v1/sprints/s_1" \
  -H 'Content-Type: application/json' \
  -d '{"state": "closed"}'
```

## The `sprint` field in JQL

`sprint` accepts an `s_<n>` id or an exact sprint name, with `=`, `!=`, `IN`, `NOT IN` and `IS [NOT] EMPTY` (`IS EMPTY` is exactly the backlog). An unknown sprint value is a `422 jql_unknown_value`; if two sprints share a name, the name matches all of them. `rank` works only as an `ORDER BY` key: comparing against it (`rank > 3`) is a `422`. See [Search and JQL](search-jql.md) for the full language.

```
sprint = "Sprint 1" AND statusCategory != done ORDER BY rank
```

```
project = KAN AND sprint IS EMPTY ORDER BY rank
```
