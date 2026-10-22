---
title: Core concepts
description: Learn the objects Kanso is built from, so you can reason about how projects, workflows, forms, questions, connectors and apps behave.
---

Kanso is an issue tracker that keeps the substance organisations buy Jira for — custom fields, versioned workflows, granular configuration, server-enforced forms — and removes the ceremony around it. This page explains the product principle and the core object model in plain language. Read it once and the rest of the documentation will read as detail on objects you already know.

## The kanso principle

**簡素 — *kanso*** is the Zen design principle of *simplicity through elimination*: clarity achieved by removing the non-essential, never by removing the substance.

That distinction is the product. Kanso keeps the power and deletes the ceremony. Custom fields, a workflow engine and permission models stay. Seven layers of screen schemes to put one field on one form do not.

The cut is aimed precisely. Granular permissions, configurable workflows and issue security levels are *why* organisations choose Jira over a simpler tool — that complexity carries weight, and Kanso keeps all of it. Every simplification is tested against one question: **does a 2,000-seat regulated organisation still get what it needs?**

### Who it is for

Kanso targets teams choosing a tracker now, organisations with a sovereignty or data-control mandate, and organisations feeling per-seat or plugin cost at large headcount.

## The core object model

### Projects and issues

Issues get `PROJ-<n>` keys — monotonic per project, unique, never reused. Every write appends changelog rows in the same transaction as the change; no code path mutates an issue without recording history. Every resource carries a version number, writes honour `If-Match`, and creates and transitions accept idempotency keys.

### The global field registry

Custom fields need no schema change: values live in one `jsonb` column keyed by immutable `cf_<n>` ids. Adding a field is one row in the registry — no `ALTER TABLE`, no downtime. Renames are free because values key on the id, never the display name; a type change mints a new id instead of corrupting old rows. System fields (`assignee`, `reporter`, `priority`, `labels`, `dueDate`) are first-class columns.

### Issue types and versioned workflows

A workflow is a JSON document of states and transitions. Published versions are **immutable**, and each issue stays on the version it was created or last transitioned under — changing a workflow can never retroactively invalidate history.

- **Guards** are sandboxed CEL expressions. CEL is not Turing-complete, so a guard cannot hang the server, and a guard that errors **denies** the transition: guards fail closed.
- **Post-functions** run either synchronously inside the transition transaction (`set_field`) or are enqueued in that same transaction for asynchronous delivery (`webhook`).
- **Removing a state** that issues still use requires an explicit status mapping, so no issue is ever orphaned.

See [Workflows](work/workflows.md).

### Forms — one artifact, three consumers

This is the direct answer to Jira's scheme labyrinth. There is one form definition per `(project, issueType, operation)` — flat resolution with an implicit default, no scheme graph. The same definition is:

- rendered by the UI,
- discovered by agents and API clients through `createmeta` / `editmeta`,
- **enforced by the server inside the write transaction**.

Required and read-only cannot be bypassed by any client, including a hand-rolled `curl` or an AI agent. Form conditions reuse the CEL engine and fail closed in the safe direction. See [Forms](work/forms.md).

### Boards, backlog and sprints

Board columns bind to `statusCategory` (`todo` / `in_progress` / `done`), never to hardcoded state names, so workflows can be renamed freely and the board keeps working. Backlog order is data on the issue (an opaque LexoRank string), and the query language is the read path — the backlog is `sprint IS EMPTY ORDER BY rank`. Re-ranking is deliberately exempt from optimistic concurrency, so dragging a card never conflicts with an edit in another tab. Sprints run `future → active → closed`, one active per board; closing a sprint atomically returns unfinished issues to the backlog with real history. See [Boards and sprints](work/boards-sprints.md).

### Search — JQL as a published grammar

The query language is a served contract: `GET /api/v1/jql/grammar` returns the exact ANTLR grammar the parser is generated from. JQL compiles to PostgreSQL, so full JQL works on every install with no search cluster, and a committed write is searchable the instant its response returns. A typo is an error with a position, never a silently empty board, and the grammar has no production for an unbounded query. Search never shows more than a direct read would: for every user and issue, search visibility equals direct-read visibility. See [Search and JQL](work/search-jql.md).

### Links and hierarchy

Issue links use a type registry (`lt_<n>`, seeded with Blocks, Duplicates, Clones and Relates), with directional links as a subresource and history written on both ends in one transaction. Parent/child hierarchy is an adjacency list with per-project, presentation-only levels (seeded Epic / Story / Sub-task); cycles are refused, and `parent` is a JQL field. Both exist to cover what Jira sells as marketplace plugins. See [Links and hierarchy](work/links-and-hierarchy.md).

### Attachments

Upload metadata, `PUT` the bytes to a short-lived capability URL, complete, download — the same flow whether bytes land in the built-in PostgreSQL store or any S3-compatible store, so a binary plus a database is still a complete product. Bytes never travel through the JSON API, and content is served only as a `nosniff` download. See [Attachments](work/attachments.md).

### Questions — a person's answer as data

A question is an object on one ticket that carries its own answer schema: a prompt, an optional detail, one to twenty ordered items, the ticket's own attachments the person should look at, and who should answer. Each item is one of six kinds: `choice`, `multi`, `text`, `number`, `yesno`, `file`.

- **Asking touches nothing global.** It is one call, gated like a comment (`comment_add`). No field is registered, no form stored, no workflow published, no issue type added, and the ticket's version, changelog and `If-Match` are untouched. The question row is the record, and the events `question.asked`, `question.answered`, `question.withdrawn` and `question.declined` carry the facts.
- **The answer is write-once and typed.** The person answers once, on a page with none of the tracker's vocabulary. The answer is canonical (the schema's ids in schema order, `null` for an unanswered optional item), attributed and timestamped. A file answer is a verified content address `{attachmentId, sha256}` whose digest the server computed at seal, and an attachment a question names cannot be deleted for the life of the ticket.
- **Four states, one citation.** A question goes `open` → `answered`, `open` → `withdrawn`, or `open` → `declined` (with a required reason), and nothing else. The row stays in every state, so the citation `KEY/q_<n>` names one answer forever.
- **No polling.** A system waits with one held read (`await`).

The person answering signs in with a Kanso account. See [Human answers](agents/human-answers.md).

### Webhooks and tracker-as-code

Webhooks are a public resource with a served event catalog, JQL event filters, transactional emission, HMAC signatures and an observable delivery log with redelivery — the way a service of your own reacts to Kanso. An optional reconciler converges declarative `KansoProject` / `KansoWorkflow` resources through the same operations as the public API; PostgreSQL stays the only runtime truth. See [Webhooks and apps](integrate/webhooks-and-apps.md) and [Tracker as code](integrate/tracker-as-code.md).

### Authentication

Local accounts with cookie sessions are the default — no identity provider is ever required. OIDC single sign-on works with any standards-compliant provider: users are auto-registered on first login, keyed by issuer and subject. An OIDC identity is never silently linked to an existing local account with the same email, which blocks account takeover by email claim. See [Users and authentication](run/users-and-auth.md).

### Connectors

Anything outside Kanso attaches to an issue as a **record**. Record kinds come from a served catalog: six built in (`commit`, `branch`, `pull_request`, `build`, `deployment`, `link`), plus any a published connector declares. A connector is the mapping that produces records: a versioned document whose CEL rules read an inbound payload and write records.

- **Data, not code.** No image, no process, no registry — covering a new provider is a file, not a deployment.
- **Facts, never actions.** A connector cannot transition an issue, comment or edit a field, so a git host can never move your ticket past your own workflow.
- **Named bindings per space.** One mapping serves many repositories, each with its own address, secret and delivery log.

### Apps

An app is **one text document that runs** — capabilities, triggers, steps and inputs, posted and stored byte-immutably, executing in the Kanso worker under the install's own identity. No container, no registry, no `kubectl`.

- Steps can loop, branch and call a typed SDK; triggers fire on events or on a schedule.
- Capabilities are database predicates rather than screens, so what an app may touch is enforced where the data is.
- A **dry run** reports what an app *would* do against a real past event without applying anything, and a **run ledger** records what each execution actually did.

See [App development](integrate/app-development.md).

### Credentials

An outbound step presents a token Kanso holds sealed — encrypted, never served back by any read path, and presentable only to the hosts its `allowHosts` names. A `secretRef` pointing at a Kubernetes Secret the operator controls is the hardened alternative.

### The AI surface

The whole loop above is reachable over MCP, not only from the UI: browse the connector catalog, publish a mapping, bind it and receive the address and secret, seal a credential, write and validate an app, dry-run it, install it, then read the delivery log and the run ledger to see what actually happened. Every step has a tool, and each tool goes through the same handler a browser hits, under the same permissions — never through a private door. See [Connect an agent](agents/connect.md).

### The Jira importer

The importer streams Jira's own backup (`entities.xml`) rather than the rate-limited REST API. `POST /import/assess` is a read-only dry run that produces a fidelity report *before* anything is written, and every construct the importer does not map is listed explicitly — nothing is dropped silently. Import is idempotent and resumable, preserves original timestamps and authors, and suppresses notifications entirely. See [Jira migration](migrate/jira-migration.md) and [Jira import](migrate/jira-import.md).

## Where to go next

- [How it works](how-it-works.mdx) — how agents pick up work, ask a person when they need one, and leave a record.
- [Architecture](run/architecture.md) — one binary, PostgreSQL as the only truth, and the write path.
- [Install](run/install.md) — a working instance with one `helm install`.
- [App development](integrate/app-development.md) — how to write an app document, with the SDK and worked examples.
