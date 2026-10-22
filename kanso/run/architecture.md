---
title: Architecture
description: Understand how Kanso is built — one binary, PostgreSQL as the only truth, one transaction per write — so you can run it, size it and reason about its failure modes.
---

Kanso is a modular monolith: one Go binary running in two modes (`web` and `worker`), an embedded React UI that is a client of the same public API every other client gets, and PostgreSQL as the only source of truth. Every domain write is one PostgreSQL transaction, and asynchronous work is enqueued inside that same transaction. This page explains what you are running, where state lives, and what happens when a part of it fails.

## One binary, two modes

The product is a single Go binary, packaged as a distroless static image:

- **`KANSO_MODE=web`** (the default) — serves the REST API, the embedded React UI, and the OpenAPI contract itself at `GET /api/v1/openapi.yaml`. It also runs the job workers in-process, so one web process is the complete product.
- **`KANSO_MODE=worker`** — drains the River job queue (webhooks, asynchronous post-functions). Use it to scale job processing separately from the web tier.

Both modes are stateless; everything stateful lives in external services Kanso connects to as a plain client. All configuration is environment variables (`KANSO_*`) — there are no config files in the image. Without `KANSO_DATABASE_URL` the binary performs a degraded boot (health and the served contract only), which lets the Helm chart come up before the database is wired. SQL migrations are embedded and applied in filename order at boot. See [Install](install.md) and [Configuration](configuration.md).

```
        React + TypeScript UI (embedded in the binary)
                          |
                          |  REST /api/v1
                          v
  +---------------- one Go binary, two modes ----------------+
  |  KANSO_MODE=web     REST API, UI, served spec, workers   |
  |  KANSO_MODE=worker  drains the River job queue           |
  +----------------------------------------------------------+
          |                                      |
          | ONE transaction per write;           | HMAC-signed webhooks
          | jobs enqueued in that same tx        v
          v                              your webhook receivers
  PostgreSQL — the only truth
  issues, fields, workflows,
  changelog, River job queue

  S3-compatible store (optional) — attachment bytes
```

### The UI is a client, not a mode

The React + TypeScript UI is embedded at build time and compiled against a client **generated from the OpenAPI spec** — there is no second route table and no private endpoints. Anything the UI can do, a script, an integration or an AI agent can do, because there is nowhere else for the UI to call. Hot paths (drag, inline edit) render optimistically and roll back on server rejection; there is no local-first store and no sync engine.

MCP follows the same rule. The web mode serves it at `/api/v1/mcp`, and every MCP tool runs the same code path as its REST equivalent, with the caller's credential — never a privileged backdoor. See [Connect an agent](../agents/connect.md).

## The extension surface

Two mechanisms, deliberately different, and neither is a container.

**Connectors** carry facts in. A versioned document of CEL rules maps an inbound provider payload to issue **records**, over the record kinds the server's catalog serves. Data, not code. A connector asserts facts and can never act — no transition, no comment, no field write — so a provider can never move an issue past the workflow that governs it. Bindings are per space and named; each has its own address, signing secret and delivery log.

**Apps** carry logic. One document — capabilities, triggers, steps, inputs — is stored byte-immutably and executed under the install's own identity, on an event or a schedule. A dry run reports what an app *would* do against a real past event, applying nothing, and every execution leaves a ledger.

An app's `script` steps run in the Kanso worker under **wazero**, a WebAssembly sandbox with no ambient host access, and every operation a script may call is generated from the API spec together with the capability that operation requires. Third-party logic therefore runs in-process but not in-privilege: it cannot reach a table, a socket or a file — only the typed surface its declared capabilities open, enforced as database predicates rather than screens. That is what lets an integration be a document instead of a container someone has to deploy.

Outbound tokens are **sealed credentials**: encrypted at rest, never served back by any read path, and presentable only to the hosts a credential names. A `secretRef` into a Kubernetes Secret is the hardened alternative for operators who would rather Kanso held nothing.

Both surfaces are fully reachable over MCP, so an agent can build an integration end to end — publish the mapping, bind it, seal the token, write and dry-run the app, then read the delivery log and run ledger. Each tool goes through the same handler a browser hits, under the same permissions. See [Webhooks and apps](../integrate/webhooks-and-apps.md) and [App development](../integrate/app-development.md).

## PostgreSQL is the only truth

> **PostgreSQL owns business truth. Everything else is a rebuildable projection.**

Caches and every derived store must be rebuildable from PostgreSQL. The failure boundaries follow directly:

- If a projection dies, writes keep committing and the projection catches up.
- If PostgreSQL dies, Kanso is down — deliberately, because it is the one system whose high availability and tested restores everything else already leans on.

With JQL compiling to PostgreSQL and the built-in attachment store living in PostgreSQL, the Kanso binary plus one database is the complete product, which is exactly what a default Helm install deploys.

### The write path

Every domain write is **one transaction**, and asynchronous work is enqueued *inside that same transaction* (a transactional outbox). There is no window in which the issue changed but the webhook was lost, or the webhook fired for a change that rolled back.

```
BEGIN
  check permission
  evaluate workflow guards (CEL, the issue's workflow version)
  UPDATE issue (status, version++)
  INSERT changelog event (with actor)
  apply sync post-functions (set_field)
  enqueue River jobs — webhooks (SAME tx)
COMMIT
   → worker drains the queue · at-least-once · idempotent via issue version
```

River lives in the same PostgreSQL — there is no broker to run, which is exactly what makes the enqueue transactional. Downstream delivery is at-least-once; the write side offers clients exactly-once through `Idempotency-Key`, and every resource carries a version honoured through `If-Match`.

## Batteries included — fallbacks, not requirements

Every external dependency has a built-in fallback, so `helm install kanso` (or a binary plus PostgreSQL) is a complete product. External services *upgrade* it.

| Dependency | Built-in fallback (default) | External upgrade (optional) |
|---|---|---|
| Database | Dev/eval-grade internal PostgreSQL, rendered by the **chart** only when no external database is configured | Any PostgreSQL via `KANSO_DATABASE_URL` — the app never knows the difference |
| Auth | Local accounts (username and password in Kanso's database), cookie sessions | Any standards-compliant OIDC provider; just-in-time registration; local login keeps working if the identity provider is down |
| Search | Full JQL compiled to PostgreSQL — grammar served at `GET /api/v1/jql/grammar` | None needed: JQL runs on PostgreSQL on every install |
| Attachments | Built-in store keeping bytes in PostgreSQL | Any S3-compatible endpoint via `KANSO_S3_*`; existing built-in attachments keep serving |
| Email | No mail is sent; everything else works | Any SMTP relay you name; Kanso runs no mail server |

Kanso never bundles, forks or modifies PostgreSQL, an identity provider or an object store — it connects to them. The one deliberate exception lives in the **chart**, not the app: the optional internal PostgreSQL above, which exists so `helm install` works out of the box.

## Built with

| Component | Role |
|---|---|
| Go 1.26 | One static binary in a distroless image |
| pgx v5 | PostgreSQL-native access, no ORM between the code and the transaction that matters |
| River | PostgreSQL-backed job queue — transactional enqueue is its headline feature |
| cel-go | Sandboxed, non-Turing-complete workflow guards and form conditions |
| ANTLR4 (Go target) | JQL — the served `.g4` grammar doubles as the published specification |
| wazero | WebAssembly sandbox for app `script` steps |
| React + TypeScript | The UI, with a client generated from the OpenAPI spec |

## What Kanso does not build

These are design choices, not gaps. Kanso does not include its own auth server or SAML stack, object store, full-text search engine, message broker, distributed scheduler, rich-text editor written from scratch, or multi-tenant function platform for plugins. It is not split into microservices, it does not express project permissions as identity-provider roles, it never treats a secondary store as authoritative, and its workflow core is not a generic BPM engine.

## What is in the product

- Projects and issues with a full changelog.
- The global field registry (text, number, select, multi-select, date, user and artifact fields).
- Issue types and versioned workflows with CEL guards, post-functions over the outbox, and declarative server-enforced forms.
- Resolutions, versions and components.
- Links and parent/child hierarchy.
- Boards and sprints with LexoRank ranking.
- Worklogs and the timesheet report.
- Attachments in the built-in PostgreSQL store or any S3-compatible store.
- JQL search against PostgreSQL with the served grammar.
- Local accounts, sessions, OIDC login and personal API tokens.
- The permission engine — permission schemes, project roles, groups, issue security levels and `permission-explain` — with guest accounts.
- Public spaces that anyone can read without an account, behind a publication gate that scans for secrets.
- Watchers, @mentions, the notification feed, and email through an SMTP relay.
- Public webhooks and the event catalog.
- Connectors and sealed credentials.
- Apps as documents on a sandboxed script runtime, with schedules, a run ledger and a bundled library.
- The MCP endpoint and the agent access policy.
- Questions on a ticket.
- The assess-first Jira importer, and export.
- `KansoProject` / `KansoWorkflow` resources reconciled from Kubernetes.
