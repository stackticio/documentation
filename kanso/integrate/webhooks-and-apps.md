---
title: Webhooks and apps
description: React to what happens in Kanso — subscribe signed webhooks to the served event catalog, inspect and redeliver from the delivery log, or run an app inside Kanso on the same events.
---

Kanso offers two ways to react to what happens in it, both driven by one served event catalog. **Webhooks** are subscriptions: every write emits its event in the same transaction, deliveries are HMAC-signed, and the delivery log is a resource you can inspect and redeliver from — nothing is ever silently dropped. They are how *your own service* reacts to Kanso. **Apps** are documents Kanso runs itself, under their own identity, triggered by the same events or by a schedule (see [App development](app-development.md)).

All endpoints below live under `/api/v1` and sit behind the session wall — sign in first (see [API](api.md)). Webhooks are a site-admin surface: creating, changing, deleting, pinging and redelivering them, and reading their delivery logs, require a site admin.

## The served event catalog

`GET /events` returns every event name this server can emit. The catalog is the contract: a subscription naming anything else is rejected with 422 at write time, and names are permanent — never renamed or reused. Each catalog entry carries a `description` and its `payloadKeys` — which optional envelope keys that event fills.

The catalog only grows, and wildcards in subscriptions match events added later. Read the served copy rather than relying on a table; at this release it holds:

| Event | Extra payload keys |
|---|---|
| `issue.created` | `issue` |
| `issue.updated` | `issue`, `changes` |
| `issue.transitioned` | `issue`, `changes` |
| `issue.deleted` | `issue` |
| `issue.lease_acquired` | `issue`, `lease` |
| `issue.lease_released` | `issue`, `lease` |
| `comment.created` | `issue`, `comment` |
| `comment.updated` | `issue`, `comment` |
| `comment.deleted` | `issue`, `comment` |
| `link.created` | `issue` (the outward issue), `link` (with `outwardIssue` and `inwardIssue` keys) |
| `link.deleted` | `issue` (the outward issue), `link` (with `outwardIssue` and `inwardIssue` keys) |
| `record.created` | `issue`, `record` |
| `record.updated` | `issue`, `record` |
| `record.deleted` | `issue`, `record` |
| `question.asked` | `issue`, `question` |
| `question.answered` | `issue`, `question` |
| `question.withdrawn` | `issue`, `question` |
| `question.declined` | `issue`, `question` |
| `sprint.started` | `sprint` |
| `sprint.closed` | `sprint` |
| `sprint.deleted` | `sprint` |
| `project.deleted` | `project` |
| `project.public_read_changed` | `project`, `publicRead` |
| `publication.acknowledged` | `project`, `issue`, `rules` |
| `webhook.ping` | (envelope only) |

A few events need a word more:

- **Question events** carry the ordinary issue JSON (its version unchanged — a question never bumps it) and the question exactly as `GET /questions/{questionId}` serves it at emit time. `question.answered` fires exactly once per question and never for a decline, and no event fires on a refused write. See [Human answers](../agents/human-answers.md#events).
- **`project.public_read_changed`** — a site admin opened a space to anonymous reading or closed it. `project` has the `project.deleted` shape (`id`, `key`, `name`, `createdAt`) and `publicRead` is the new value. It fires once per change and never for a write that sets the current value (see [Public spaces](../run/users-and-auth.md#public-spaces)).
- **`publication.acknowledged`** — a person knowingly published text the publication gate flagged in a public space, by acknowledging every finding, or made a space public over its findings. `issue` is a reference (`id`, `key`, `project`) — never the issue JSON, whose text may be what was acknowledged — and null when the acknowledged object is not an issue; `rules` holds the keys of the matched publication rules, never the matched text. It fires once per acknowledged write, in that write's transaction, and never for a refused one (see [Public spaces: redact and retry](../agents/connect.md#public-spaces-redact-and-retry)).

## Subscriptions

A webhook is `{name, url, events, jqlFilter?, secret?, active}` (`POST /webhooks`, `PATCH`/`DELETE /webhooks/{id}`, `GET /webhooks` — registries are small, no paging).

- **`events`** accepts exact names, prefix wildcards (`issue.*`), and `*`.
- **`url`** must be http(s); self-hosted instances may use plain http. Any other scheme is 422.
- **`jqlFilter`** is unrestricted JQL — the same grammar as `/search/jql`, every field including custom fields. It compiles at *write* time (a filter that does not parse or names an unknown field is 422 with a `jql_*` code — a webhook can never be created broken), but evaluates at *delivery* time against the event-time issue snapshot, in memory, with no index lag. A runtime evaluation error fails closed: no POST, and the delivery is recorded as `skipped`. Events that carry no issue (`sprint.*`, `project.*`, `webhook.ping`) bypass the filter; `link.*` events evaluate against the outward issue.
- **`active: false`** pauses matching without deleting history.

## Transactional emission and the envelope

Every catalog event is enqueued through a transactional outbox in the same transaction as its write: a rolled-back write emits nothing; a committed write emits exactly one event, which fans out to every matching active webhook as one delivery record each.

Delivery is at-least-once HTTP POST, `Content-Type: application/json`, with headers `X-Kanso-Event` and `X-Kanso-Delivery` on every request. Deduplicate on the delivery id and order issue events on `issue.version` (the payload carries the full issue) — Kanso makes no cross-event ordering guarantee.

The body envelope is `{id, event, at, actor, via, ...payloadKeys}` where `id` is the `dlv_<n>` delivery id, `actor` is the acting user or null, `via` is how the act was made, and the per-event extra keys are the ones declared in the catalog.

`via` is the credential of the act the event reports, `{kind, id, name}`:

- `token` — `kat_<n>` and the token's name
- `session` — the session cookie on any route but `/mcp`
- `session_mcp` — the cookie on `/mcp`
- `app` — `ains_<n>` and the app's key (an app run's writes are delivered too)
- `connector` — `cbind_<n>` and the connector's key, for a delivery's `record.*` events
- `import` or `system` — Kanso acting with no actor, e.g. a lease that expired

So `actor: null` always comes with `system` or `connector`. Every user object in a payload — `actor`, a comment's `author`, the users inside `issue` — carries `kind`: `person` or `app`.

**The loop guard:** a runtime that writes back with its owner's token receives its own events with `actor` = the owner; it drops them by comparing `via.id` with its own token's id (the part of the token before the dot). A redelivery re-sends the stored body byte for byte, so a delivery recorded before `via` existed carries none.

The four history fields of JQL (`changedBy`, `commentedBy`, `changedVia`, `commentedVia`) are refused in a webhook's `jqlFilter` and in an app trigger's `jql` (422, "… is a history field"): a filter judges the issue as it is when the event fires, which has no history — read the delivery's `via` instead.

## Signatures (write-only secrets)

Set a `secret` (16–200 characters) on a webhook and every POST carries:

```
X-Kanso-Signature: sha256=<hex hmac-sha256(secret, body)>
```

signed over the exact bytes posted. The secret is write-only forever: no read ever returns it — `hasSecret` tells you one exists. `PATCH` with `"secret": null` removes it; a string replaces it.

## The delivery log

Every (event × matching active webhook) pair creates exactly one delivery record, visible at `GET /webhooks/{id}/deliveries` (newest first, `startAt`/`maxResults`/`total` paging, newest 1000 records retained per webhook). States:

- `pending` → `delivered` (a 2xx response)
- → `failed` — retried with backoff up to 10 attempts, then parked as a dead letter you can see (`responseStatus` shows the last attempt)
- → `skipped` — the jqlFilter did not match, or errored (fail closed); "why didn't my webhook fire?" is answerable from the log, never a mystery

Two operational verbs:

- `POST /webhooks/{id}/ping` → 202. Pushes a synthetic `webhook.ping` through the real pipeline, filter-exempt — wiring is testable in one call.
- `POST /webhooks/{id}/deliveries/{deliveryId}/redeliver` → 202. Re-enqueues the *same* record with the *same* payload bytes; attempts keep counting; 409 `delivery_pending` while the record is still pending.

## Apps

An app needs no server of yours. It is a `kanso.io/v1` App document — capabilities, triggers, inputs and script steps — published with `POST /apps/artifacts` and installed with `POST /apps/artifacts/{key}/installs`; Kanso runs it in-process under the install's own identity, and every run is recorded. A bundled library installs in one call (`GET /apps/library`, `POST /apps/library/{libKey}/install`). Event triggers use the same catalog as webhooks. The full guide, also served by every instance at `GET /api/v1/apps/docs`, is [App development](app-development.md).

Use a **webhook** when the logic belongs in a service you already run, or needs something Kanso deliberately does not do inside itself (see [Build your own service](building-apps.md)).

## Verified examples

Sign in once and reuse the cookie jar:

```sh
KANSO=https://kanso.example.com/api/v1
curl -s -c /tmp/kanso.jar -X POST "$KANSO/auth/login" \
  -H 'Content-Type: application/json' \
  -d '{"username": "admin", "password": "..."}'
```

**Create a subscription** — highest-priority issue events, signed:

```sh
curl -s -b /tmp/kanso.jar -X POST "$KANSO/webhooks" \
  -H 'Content-Type: application/json' \
  -d '{
    "name": "urgent-issues",
    "url": "https://receiver.example.com/hook",
    "events": ["issue.*", "comment.created"],
    "jqlFilter": "priority = highest",
    "secret": "0123456789abcdef0123456789abcdef"
  }'
# → 201 {"id": "wh_1", ..., "hasSecret": true}   (the secret is never echoed)
```

**Verify a signature** in the receiver — HMAC-SHA256 of the secret over the exact request body bytes, hex-encoded, compared to the header after the `sha256=` prefix:

```sh
# $body_file holds the raw request body, $sig the X-Kanso-Signature header value
expected="sha256=$(openssl dgst -sha256 -hmac "$WEBHOOK_SECRET" "$body_file" | awk '{print $NF}')"
[ "$sig" = "$expected" ] && echo ok || echo reject
```

Use `X-Kanso-Delivery` as your idempotency key: delivery is at-least-once.

**Test the wiring** — `POST "$KANSO/webhooks/wh_1/ping"` answers 202 and pushes a signed `webhook.ping` through the real pipeline; it shows up in `GET "$KANSO/webhooks/wh_1/deliveries"` with the receiver's response status.

## Relation to workflow post-function webhooks

Workflow `webhook` post-functions are a separate, transition-scoped mechanism inside a workflow definition (see [Workflows](../work/workflows.md)). The subscriptions on this page are the standing, self-service surface; the two are not unified.
