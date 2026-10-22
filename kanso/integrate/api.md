---
title: API
description: Call Kanso's public REST API directly — sign in, write safely under concurrency, page through results, search with JQL, ask people questions and read errors.
---

Everything Kanso does is reachable through one public REST API. The web UI is a client of that same API, with no private endpoints, and so is every integration — scripts, bundled apps, the MCP endpoint and the Kubernetes reconciler. This page covers what an integrator needs to know: how to sign in, how writes stay safe when several clients act at once, how paging and search work, and what an error looks like.

## The served contract

All endpoints live under `/api/v1`. Every running instance serves its own contract, so what you read always matches the version you are talking to:

- `GET /api/v1/openapi.yaml` — the OpenAPI 3.1 specification, describing exactly what the running binary does. Server stubs and the typed web client are generated from it. Read `info.version` from the served copy rather than from this page.
- `GET /api/v1/jql/grammar` — the JQL grammar (ANTLR4), served verbatim, so integrators and agents can read the language definition.
- `GET /api/v1/events` — the webhook event catalog (see [Webhooks and apps](webhooks-and-apps.md)). Unlike the two above, it requires a signed-in caller.

The specification and the grammar are open: no session is needed to read them. `GET /healthz` reports `{status, version}`.

## Sessions and auth

Every data endpoint sits behind a session wall; only health, the specification, the grammar and the auth entry points are open. The one exception is anonymous reading of a space a site admin has made public (see [Public spaces](../run/users-and-auth.md#public-spaces)).

The basic credential is a cookie session:

```sh
KANSO=https://kanso.example.com/api/v1
curl -s -c /tmp/kanso.jar -X POST "$KANSO/auth/login" \
  -H 'Content-Type: application/json' \
  -d '{"username": "admin", "password": "..."}'
# → 200 + Set-Cookie: kanso_session (HttpOnly). Reuse the jar with -b.
```

- `GET /auth/methods` (open) tells a client which sign-in methods the instance offers. Local accounts are always available; OIDC appears when configured.
- OIDC (`GET /auth/oidc/login` → provider → `GET /auth/oidc/callback`) is a browser flow that issues the *same* session cookie; the web UI never touches tokens.
- `GET /myself` returns the authenticated user; `POST /auth/logout` invalidates the session.
- A request without a valid credential gets 401.

For a script or a service, use a local account or a **personal API token** sent as `Authorization: Bearer <token>`. Tokens are minted from a signed-in session — a token cannot mint a token — and they expire and can be revoked; see [How tokens work](../agents/connect.md#how-tokens-work).

## Versioned writes and If-Match

Every issue carries a `version` number. Mutating writes use optimistic concurrency:

- `PATCH /issues/{issueKey}` **requires** `If-Match: <version>` (the integer version from your last read or write). A stale version is rejected with 409 and changes nothing; success increments the version by exactly 1.
- `POST /issues/{issueKey}/transitions` honors `If-Match` the same way (409 on stale, or when a guard rejects the transition).
- Deliberate exceptions, stated in the served contract: `PUT /issues/rank` bumps no version and takes no If-Match (concurrency is an advisory lock); comments, worklogs, attachments and issue links are subresources that do not bump the issue version.

Writes travel through one uniform `{fields}` envelope on create and update — system fields (`summary`, `assignee`, `priority`, `labels`, `dueDate`, `parent`, …) and custom fields (`cf_<n>`) in the same map, for people, agents and the importer alike.

## Idempotency keys

`POST /issues` accepts an optional `Idempotency-Key` header (a string, max 128 characters). The key is scoped to the caller and the project:

- Replaying with the same key, as the same user, into the same project returns the originally created issue with 200, as it reads now, instead of creating a duplicate (a fresh create returns 201). Bodies are not compared.
- The same key from another user, or into another project, is another create. An absent or empty header means no key. One person's session and API tokens share that person's keys.
- A key that is not valid UTF-8, or is longer than 128 characters (counted as characters, not bytes), is refused with 422 `validation_failed`, with a detail at path `""` naming the header.
- A replay runs after the space walls (404 `project_not_found`, 403 `permission_denied`). If you can no longer see the issue your key created, the replay answers 404 `issue_not_found`, exactly like a nonexistent issue.

On the webhook side, consumers get the same property from the `X-Kanso-Delivery` id. `POST /issues/{issueKey}/questions` accepts the same header, scoped to the issue in the path: a replay on the same issue returns the question as it reads now (200, bodies not compared); the same key on another issue is another question.

## Pagination

Two conventions, each stated per endpoint in the served contract:

- **Offset pages** on subresource lists (an issue's changelog, comments, a webhook's delivery log): `startAt` and `maxResults` query parameters, response `{startAt, maxResults, total, items}`.
- **Cursor pages** on search: `GET|POST /search/jql` returns `{issues, isLast, nextPageToken}`; pass `nextPageToken` back with the *byte-identical* JQL string (a mismatched token is 422 `jql_bad_page_token`).

## Questions

A question is an object on an issue that carries its own answer schema and, once answered, the one answer (see [Human answers](../agents/human-answers.md)). No registry row, form, workflow or issue type is involved, and the issue's version, changelog and `If-Match` are untouched by every question operation — the question row is the record.

Question visibility is issue visibility. Every `/questions/{questionId}` operation answers one byte-identical `404 question_not_found` for a malformed id, a nonexistent id and a question of an invisible issue, decided before anything else is examined; the issue-scoped paths answer the byte-identical `404 issue_not_found` of `GET /issues/{key}`. Every operation sits behind the 401 wall; the writes are additionally Origin-gated (`403 origin_forbidden`) and refused to a read-scope token (`403 insufficient_scope`), both checked before the 404.

| Operation | Method and path | Success | Refusals |
|---|---|---|---|
| `askQuestion` | `POST /issues/{issueKey}/questions` | `201 Question` — `200` on an `Idempotency-Key` replay (the key is scoped to the issue) | `404 issue_not_found`; `403 permission_denied` naming `comment_add`; `422 question_schema_invalid` (`/schema/<i>/<member>`), `question_context_invalid` (`/context/<i>`), `question_assignee_invalid` (`/assignee`), `validation_failed` (`/prompt`, `/detail`, mixed codes) — every detail listed, zero effect |
| `listQuestions` | `GET /issues/{issueKey}/questions[?includeWithdrawn=true]` | `200 {items}`, id ascending; withdrawn only when asked for | `404 issue_not_found`; `422 validation_failed` at `/includeWithdrawn` |
| `getQuestion` | `GET /questions/{questionId}` | `200 Question` — `answer` null while open or withdrawn; `citation` is `<issueKey>/q_<n>`, permanent | `404 question_not_found` |
| `answerQuestion` | `POST /questions/{questionId}/answer` | `200 Question`, `state: answered`, canonical `answer.values` (schema order, `null` for unanswered optionals, `multi` in options order) | `404 question_not_found`; `403 question_not_for_apps` (an installed app never answers, on any question); `403 question_not_yours`; `409 question_answered` / `question_withdrawn` / `question_declined` (decided before validation); `422 question_answer_invalid` at `/values/<id>`, or for a `file` item one of `artifact_malformed`, `artifact_attachment_unknown`, `artifact_attachment_foreign`, `artifact_attachment_unavailable`, `artifact_hash_mismatch` |
| `withdrawQuestion` | `DELETE /questions/{questionId}` | `204`; the row stays, `state: withdrawn` | `404 question_not_found`; `403 question_not_yours` (not the author, not a site admin); `409 question_answered` / `question_withdrawn` / `question_declined` |
| `declineQuestion` | `POST /questions/{questionId}/decline` with `{reason}` | `200 Question`, `state: declined`, `declineReason`, `declinedAt`, `declinedBy`; `answer` null | `404 question_not_found`; `403 question_not_for_apps` (an installed app never declines either); `403 question_not_yours`; `409 question_answered` / `question_withdrawn` / `question_declined`; `422 decline_reason_invalid` |
| `awaitQuestion` | `GET /questions/{questionId}/await?timeout=<0..60>` | always `200 {satisfied, question}` once admitted; `satisfied` ⟺ `state != open`; answered within a second of the commit or at the deadline with `satisfied: false` | `404 question_not_found` (before parameters, before any hold); `422 await_condition_unknown` (`/until`), `await_timeout_range` (`/timeout`), `await_since_invalid` (`/since`); `429 await_limit` + `Retry-After` under the hold caps (issue and question holds count together) |
| `listMyQuestions` | `GET /questions?assignee=me` with optional `state` = `open` (default), `answered`, `withdrawn`, `declined` or `all` | `200 {items}` — the inbox, `createdAt` then id ascending, invisible issues silently excluded | `422 validation_failed` at `/assignee` (must be exactly `me`) or `/state` |

The writes carry `x-kanso-capability: issues:comment` — asking is communication, gated by `comment_add` like a comment, never by `edit_issue`. Who may answer or decline is a rule, not a key: the assignee or a site admin, else anyone who can see the issue. The reads carry `issues:read`. Each write emits one catalog event — `question.asked`, `question.answered`, `question.withdrawn`, `question.declined` — with payload keys `issue` and `question`.

A **question group** asks several people at once: `POST /issues/{issueKey}/question-groups` with `assignees` creates one ordinary question per person in one transaction, `GET /question-groups/{groupId}` reads them back side by side, and `GET /question-groups/{groupId}/await` is one hold for the whole group (see [Human answers](../agents/human-answers.md)). `DELETE /attachments/{id}` is `409 attachment_in_use` while any question of the issue names the attachment in its context or in a file answer.

Over MCP the loop is `ask_question` → `await_question` → `get_question` (plus `list_questions`, and `get_question_group` / `await_question_group` for a group); there is deliberately no `answer_question` tool.

An ask tells the person asked — a `question_asked` row in their feed (`GET /notifications`) and, by default, a mail where the instance has a relay and their account an address, each as their own notification choices allow. An answer or decline tells the asker (`question_answered` / `question_declined`); a withdrawal tells nobody. Every `Question` carries `delivery` — `assignee_notified`, `assignee_cannot_see`, `no_assignee` or `asked_yourself` (null on questions asked before this field existed) — so an ask that reached nobody says so; the ask is never refused for it. A write through a Bearer API token tells its own owner for these kinds; a cookie session never does.

## The issue-level answer and await

For an issue that resolves through a transition form, two reads make the issue itself the question a person answers and a system consumes (see [An issue that resolves through a transition form](../agents/human-answers.md#an-issue-that-resolves-through-a-transition-form)). Questions, above, are the better fit for new work; this setup stays for workflows that already have such a form.

- `GET /issues/{issueKey}/answer` — the answer as one object: a pure function of the changelog, serving the *resolving group* (the group that carries a `status` item and a non-null `resolution` item), with `fields` as committed, `artifacts` (each `{fieldId, attachmentId, sha256}`) and a permanent `citation` of the form `KEY@version`. `?version=<n>` re-reads the group at that version forever, after any reopen or correction. `404 not_answered` while the issue is unresolved (a reopen un-answers it), `404 not_an_answer` when `version` names a group that did not resolve the issue; an invisible issue is the byte-identical `404 issue_not_found` before anything else is examined. Every response carries `Cache-Control: no-store`. Reading writes nothing.
- `GET /issues/{issueKey}/await?until=resolved|changed&timeout=<0..60>[&since=<version>]` — a held read, not a stream: always `200 {satisfied, issue}` once admitted, the issue re-read from PostgreSQL at return time, answered within a second of the satisfying commit or at the deadline with `satisfied: false` (call again). `404` first, before parameters are validated; `422` for the query (`await_condition_unknown`, `await_timeout_range`, `await_since_required`, `await_since_invalid`); `429 await_limit` with `Retry-After` when the caller's hold cap is reached (`KANSO_AWAIT_MAX_PER_CREDENTIAL` / `_PER_USER` / `_GLOBAL`). Nothing is written. A proxy in front of Kanso needs a read timeout of at least 90 s for a 60 s hold.

## Errors

Every error body is:

```json
{
  "code": "stable_machine_readable_code",
  "message": "human-readable explanation",
  "details": [ { "path": "/fields/cf_1", "message": "..." } ]
}
```

`code` is a stable machine-readable string (e.g. `project_key_taken`, `delivery_pending`, `managed_by_cr`, `session_required`, the `jql_*` family); `details` carries per-input validation problems with a JSON pointer into the request body, when applicable.

## Search and JQL

- `GET /search/jql?jql=...` (or `POST /search/jql` for long queries) executes JQL against the source of truth. Reads are transactional: a committed write is immediately searchable, and search never returns an issue the caller could not GET directly.
- A rejected query is a 422 with a precise `jql_*` code (`jql_parse_error`, `jql_unknown_field`, `jql_unknown_value`, `jql_unknown_function`, `jql_type_mismatch`, `jql_invalid_order`, `jql_bad_page_token`) — a typo is an error, never a silently empty result.
- `POST /search/approximate-count` counts matches with the same language and validation; the count is exact.
- The grammar itself is served at `/jql/grammar` — parse it, don't guess it.

See [Search and JQL](../work/search-jql.md) for the language.

## Agent integration

The built-in MCP endpoint is a pure client of the API above. Kanso ships the rails only, never an LLM dependency in its core:

- **The built-in MCP endpoint** (`POST /api/v1/mcp`, Streamable HTTP, JSON profile) — every instance serves it unless an operator turns it off. An agent connects with a personal API token and acts as the person who minted it. It serves 41 tools (22 to a read-scope token), including `describe_operation` and `call_operation`, which reach any operation of this API through the same walls; the tracker tools; and sixteen app, connector and credential tools. The instance's own `tools/list` is the authoritative list. Full guide: [Connect an agent](../agents/connect.md).

To drive your own agent runtime from Kanso events, subscribe a webhook (see [Webhooks and apps](webhooks-and-apps.md)) and act back through the API or MCP.
