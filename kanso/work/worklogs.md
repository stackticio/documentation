---
title: Worklogs and timesheets
description: Log time against issues and read a per-person timesheet computed straight from the logged entries.
---

Time tracking is built into Kanso; no add-on is needed. A worklog is a single record: who worked, on which issue, when they started, and for how long. The timesheet report is a sum over those records, computed at read time, so there is no second store that can drift out of step.

All endpoints live under `/api/v1` and require a session. `$KANSO_URL` below is your Kanso server address. Log in first:

```bash
curl -c cookies.txt -X POST "$KANSO_URL/api/v1/auth/login" \
  -H 'Content-Type: application/json' \
  -d '{"username": "alice", "password": "your-password"}'
```

## The model

One worklog carries:

| Field | Meaning |
|---|---|
| `id` | `wl_<n>`, minted by the server, immutable |
| `issueKey` | the issue the work was logged against |
| `author` | the session user at create; **immutable forever**, edits never move it |
| `startedAt` | when the work began (RFC 3339) |
| `timeSpentSeconds` | integer, 1 second to one year (31536000 seconds) |
| `description` | plain text, up to 10000 characters, defaults to empty |
| `createdAt` / `updatedAt` | record timestamps |

There are no estimates, approval states or billing flags. The row is the record.

**Worklogs behave like comments, not like fields.** Creating, editing or deleting a worklog bumps no issue version, writes no changelog entry, and takes no `If-Match` header. Time logged against an issue is not a property *of* the issue; the worklog list is its own history. In practice: logging work never returns `409` because someone is editing the issue, and an issue `PATCH` carrying the version from before the worklog still succeeds.

## Logging work

```bash
curl -b cookies.txt -X POST "$KANSO_URL/api/v1/issues/KAN-7/worklogs" \
  -H 'Content-Type: application/json' \
  -d '{"startedAt": "2026-08-20T09:00:00Z", "timeSpentSeconds": 5400, "description": "reviewed the importer"}'
```

`201` returns the worklog with `author` set to your session user. `startedAt` and `timeSpentSeconds` are required; violations are `422`, and an unknown issue is `404`.

## Listing

```bash
curl -b cookies.txt "$KANSO_URL/api/v1/issues/KAN-7/worklogs?startAt=0&maxResults=50"
```

Paged Jira-style (`startAt`/`maxResults`/`total`), oldest first. The response also carries `totalSeconds`: the sum over **all** the issue's worklogs, independent of the page window.

## Editing and deleting

```bash
curl -b cookies.txt -X PATCH "$KANSO_URL/api/v1/worklogs/wl_12" \
  -H 'Content-Type: application/json' \
  -d '{"timeSpentSeconds": 7200}'

curl -b cookies.txt -X DELETE "$KANSO_URL/api/v1/worklogs/wl_12"
```

`PATCH` accepts any of `startedAt`, `timeSpentSeconds` and `description` (at least one). There is **no author key**: sending one is a `422`, and the author never moves. Who may edit or delete is decided by the space's permissions: `worklog_edit_own` covers entries you authored and `worklog_edit_all` anyone's, checked after visibility. An issue you cannot see is a `404`; a missing permission is a `403`. `DELETE` returns `204`, and the entry drops out of every list total and timesheet immediately.

## The timesheet report

```bash
curl -b cookies.txt "$KANSO_URL/api/v1/reports/timesheet?user=u_3&from=2026-08-01&to=2026-08-31"
```

- `user`: `u_<n>`; omit it for **your own** timesheet. An unknown user is a `422`.
- `from` / `to`: inclusive dates; `to ≥ from`, and the window is at most 92 days.

Entries are bucketed by the **UTC calendar day of `startedAt`**: an entry started at `23:30Z` belongs to that UTC date for every viewer, regardless of anyone's time zone. The response lists days in ascending order (only days with entries), each with per-issue sums in issue-key order and a day total, plus the grand `totalSeconds`. Every worklog edit or delete is reflected in the very next report read; nothing is cached.

## In the web interface

The issue drawer has a **Work log** section: log time with Jira-style durations (`2h 30m`, `1d`, `45m`; a day is 8 hours), see the running total, and edit or remove entries. **Timesheet** in the sidebar opens the report: pick a person and a date window and get their days with per-issue breakdowns.

## Limits

Worklogs carry no estimates or remaining time. There are no running timers and no CSV export, and logged time cannot be queried with JQL. The Jira importer does not import worklogs; it lists them in the import report's `unmapped` entries, with their count. See [Importing from Jira](../migrate/jira-import.md).
