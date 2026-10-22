---
title: App development
description: Write a Kanso app — one JSON document with capabilities, triggers, inputs and a script — then validate it, dry-run it against a real past event, publish, install and read its run ledger.
---

A Kanso app is **one text document that runs**. You POST it; it executes. There is no image to build, no registry to push to, no container to deploy and no `kubectl` anywhere in the flow. Kanso runs the document in-process, under the app's own identity, against the same public REST API you use — so an app can never do more than a person could, and everything it does is recorded.

```
   your document  ──POST /apps/artifacts──▶  Kanso
                                              │  runs it, in-process,
                                              │  under the app's OWN identity
                                              ▼
                             the same public REST API you use
```

Everything an author needs is served by your own instance, so nothing here can drift from what your version actually accepts:

| what | where |
|---|---|
| the document schema | `GET /api/v1/apps/schema` |
| every method an app may call | `GET /api/v1/apps/sdk` |
| the event catalog | `GET /api/v1/events` |
| the bundled library of working apps, with source | `GET /api/v1/apps/library` |
| the app developer guide, in-product | `GET /api/v1/apps/docs` |

**Start by reading one.** The bundled library is a set of complete apps, each short enough to read in a sitting and each doing something real. Copy the one closest to your job and edit it — that is a better starting point than any skeleton.

## The shape

```json
{
  "apiVersion": "kanso.io/v1",
  "kind": "App",
  "metadata": { "key": "my-app", "name": "My app", "icon": "✨",
                "description": "what it does, in one sentence" },
  "spec": {
    "runtimeVersion": 1,
    "capabilities": { "kanso": { "issues": ["read", "comment"] } },
    "triggers": [ { "id": "created", "type": "event", "event": "issue.created" } ],
    "inputs": { "greeting": { "type": "string", "default": "hello" } },
    "steps": [ { "id": "go", "kind": "script", "source": "…JavaScript…" } ]
  }
}
```

`metadata.key` is **permanent**. It is also the namespace for the app's state and for any record kinds it writes, so one app writes under one name everywhere.

### Connector namespaces are reserved — unless you pair

A namespace that is a connector's key — installed here, shipped in the bundled connector catalog, or belonging to a connector that was deleted — is *reserved*: only that connector's signed deliveries write there, so a requirement can trust that evidence under the `github` key came from that connector. An app whose key is such a namespace writes its records there only while it is **paired** with the connector: the version its install runs declares a connector grant that resolves to that key on that install — a key-form grant `{"key": "github", …}`, or a slot the install bound to `github`. Without one, every record write is refused `record_namespace_reserved` in the run trace (and named on the server's `evidence wall` log line at start-up). A paired app and its connector write the same rows by natural key; either may replace the other's.

Pairing is judged **now**, every time. Only a paired app's rows count as evidence for a requirement that names the namespace: moving the install to a version without the grant, binding the slot to another connector, or uninstalling the app makes its existing rows stop counting there — they stay on the issue, served `writer: app`. A namespace no connector holds is unaffected: your app writes its own key exactly as before.

## Capabilities

An app declares what it may do. An `effect` or `action` step the declaration does not cover is refused at publish, with a JSON Pointer at the step. A script's SDK calls are checked on every call, at the moment your code makes it: an operation you did not declare is refused right there, and the refusal is recorded in the run trace — so a dry run shows it before anyone is affected.

```json
"capabilities": { "kanso": { "issues": ["read", "edit", "comment"] } }
```

| group | verbs |
|---|---|
| `issues` | `read`, `create`, `edit`, `transition`, `comment`, `link`, `assign`, `delete` |
| `records` | `read`, `write` |
| `worklogs` | `add` |
| `attachments` | `read` |
| `components` | `manage` — a space's components (create, edit, delete) |
| `versions` | `manage` — a space's versions (create, edit, release, delete) |
| `boards` | `manage` — a space's sprints, sprint membership and board names |

Ranking issues (`rankIssues`) is `issues: ["edit"]` and is also gated by the board permission, so an app that ranks declares `boards: ["manage"]` too. A registry group acts inside a space the app can see, so declare `issues: ["read"]` beside it. There is no group for site administration, permissions, users, tokens, credentials, connectors, webhooks or apps — which is why an app cannot ask for them.

Declaring a capability is not the same as having permission. The app acts as its own identity, and the permission engine gates that identity exactly as it gates a person. An app can never do more than a user could.

## Triggers

```json
"triggers": [
  { "id": "created", "type": "event", "event": "issue.created" },
  { "id": "moved",   "type": "event", "event": "issue.transitioned",
    "jql": "project = ENG", "when": "issue.priority.id == 'high'" }
]
```

`jql` narrows by query; `when` is a CEL expression over the trigger. Both are optional and both are evaluated before your code runs, so a step that executes has already passed them.

**On a clock.** A schedule trigger is five cron fields, read in `timezone` (an IANA name, `UTC` when absent; an install may override it):

```json
{ "id": "minute", "type": "schedule", "schedule": "* * * * *", "timezone": "UTC" }
```

A scheduled run concerns no issue, so `input.issue` is absent and the app finds its own work. `input.trigger` carries `type: "schedule"`, the `trigger` id, `scheduled` (the minute this run is for, in UTC; use it as the run's clock, never the time it happens to execute), `lateSeconds`, and `project` when the install belongs to one space. A minute is the finest granularity, and runs of one install never overlap: a scheduled run that finds another one going is skipped as `throttled`.

`ignoreSelf` defaults to **true**: an app is not re-triggered by its own writes — by any install of it, so a site-wide and a per-space install of one app never trigger each other. Turning it off is how feedback loops start.

**Apps compose.** Your app's writes are ordinary events: they trigger every other installed app whose triggers match, exactly as a person's write would. A chain carries its depth — a run triggered by an app's write is one level deeper than the run that wrote — and stops at depth 5 with a run recorded `depth_exceeded`. Each run still acts only with its own install's grants.

**Every event is its own run.** Each comment, record, link, lease, question and acknowledgement triggers its own run even when the issue's version did not change. If two of your triggers match the same event, one runs and the other is recorded `skipped_duplicate`, naming the run.

**Runs of one install execute one at a time.** A run that finds another run of its install in flight waits and runs once the install is free — it is never dropped. Waiting runs resume in wake-up order, not in the order their events happened (a scheduled run that overlaps is skipped as `throttled`, as above). A run still waiting after an hour is closed `needs_attention` with a note. A run whose outcome cannot be recorded is closed `needs_attention` with a note and is never re-run, because its effects may already have applied.

## Steps: the script

```js
// `input` carries: trigger, issue, inputs, state, steps
const issue = await kanso.issues.getIssue({ issueKey: input.issue.key });

if ((issue.labels || []).includes("skip")) return { skipped: true };

const found = await kanso.search.searchJqlGet({
  jql: 'project = "' + issue.project + '" AND status = "To Do"',
  maxResults: 50,
});

for (const i of found.issues) {
  await kanso.comments.addComment({ issueKey: i.key, body: "seen" });
}
return { commented: found.issues.length };
```

Real JavaScript: loops, branches, `await`, whatever you need. It runs in a sandbox with a memory ceiling and a wall-clock deadline, and with no filesystem, no network and no clock beyond what the SDK gives it.

**Four globals** — `kanso`, `connectors`, `storage` and `retryOnConflict` — and nothing else:

| global | what it does |
|---|---|
| `kanso.<anything>.<operationId>(args)` | any operation from `GET /apps/sdk`. The namespace is decoration — `kanso.issues.getIssue` and `kanso.x.getIssue` are the same call |
| `connectors.<key>.<action>(inputs)` | one call out through a connector you were granted. **Your code never sees the credential** — the host attaches it |
| `storage.get/put/delete/list` | the app's own key–value state, per install |
| `retryOnConflict(fn)` | re-runs `fn` when a write is refused as stale. See below |
| `kanso.log.info/warn/error` | lands in the run trace |

### Writes are optimistic — handle it

Every write sends the version you read, and a concurrent write makes yours a conflict that **changed nothing**. Two apps reacting to the same event collide routinely. Because the refusal applied nothing, re-running the whole read → decide → write is correct:

```js
return await retryOnConflict(async () => {
  const issue = await kanso.issues.getIssue({ issueKey: key });
  await kanso.issues.updateIssue({
    issueKey: key,
    version: issue.version,        // sent as If-Match
    fields: { labels: [...(issue.labels || []), "triage"] },
  });
});
```

Pass `version` for `updateIssue`, `executeTransition` and `deleteIssue`. You never write a header; the runtime lifts it for you.

## Inputs

Configuration belongs in `inputs`, so the same document behaves differently in two spaces without republishing:

```json
"inputs": {
  "rules":  { "type": "string", "required": true, "default": "bug: crash, exception" },
  "notify": { "type": "boolean", "default": true }
}
```

Types are `string`, `number`, `boolean`, `issueKey`, `projectKey`, `statusName`, `userName` and `enum`. Defaults apply wherever an install does not override them, so publishing a better default reaches every install that never set it.

An input may **never** carry a secret. A secret belongs to a credential, which belongs to a connector, which the host attaches — see below.

## Reaching outside Kanso

An app has no HTTP primitive. Everything outbound goes through a **connector**, and the app must be granted it by name.

Declare a **slot** — a role, not an installation:

```json
"capabilities": {
  "kanso": { "issues": ["read", "comment"] },
  "connectors": [ { "slot": "forge", "actions": ["get_pull", "comment_on_pull"] } ]
}
```

```js
const pr = await connectors.forge.get_pull({ owner: "acme", repo: "web", number: 42 });
```

The operator names the instance when they install it:

```json
POST /apps/artifacts/<key>/installs
{ "projectKey": "ENG", "connectors": { "forge": "github-acme" } }
```

**Where the token goes.** A connector definition names a credential by handle, and that is the default. An install may name its own instead:

```json
{ "projectKey": "ENG",
  "connectors": { "forge": { "connector": "github", "credential": "gh-acme" } } }
```

So one published connector serves every organization you have: seal one credential per organization, and each install picks the one it belongs to — no forked connector, no forked app. The install screen offers the same choice beside the connector. The credential is sealed, write-only, and attached by the host at call time; your code never sees it, and neither does the run ledger.

Egress is still bounded by the credential's `allowHosts` intersected with the connector's declared `egress` — so naming a different credential can only narrow where a connector may reach, never widen it. A handle you have not sealed yet is accepted at install and fails at the first call, so installing before configuring stays legal.

**This is what makes an app portable.** The document says *"I need something that can comment on a pull request"*; it never says *whose* forge. Install it twice against two connectors and the two installs reach two different systems, with two different credentials, from one published artifact — and a document somebody hands you works on your instance without being rewritten. Rebinding later is a `PATCH /app-installs/{installId}` with the same `connectors` member; it takes effect on the next call and never re-asks for consent, because consent covers what the app may do and not where you pointed it.

The app listing (`GET /apps/artifacts`) and the library (`GET /apps/library`) answer what is still missing under `requires.slots`: each slot with the connectors published here that declare every action it needs, and whether each one's credential is sealed yet. The install screen renders exactly that list.

Inside the run, `input.connectors` says what each slot resolved to (`{"forge": "github-acme"}`). Your records always land in your app's own key — the server forces that namespace — so to keep two installs from stacking two systems' evidence on one issue, carry the resolved key in the record itself: in its `externalId` (`github-acme:pull/42`) or in its `data`.

A grant may instead name a literal `key`, which still works everywhere:

```json
"connectors": [ { "key": "github", "actions": ["get_pull"] } ]
```

A `key` is simply a slot that came pre-bound to itself: it needs no binding and cannot be rebound, so an app written that way is welded to one connector and is not portable. Prefer `slot` for anything you intend to share. Exactly one of `key` or `slot` — never both.

The destination is checked against the credential's allowed hosts after DNS resolves, and redirects are never followed. Granting one narrow action does not imply the connector's generic `http` action — that has to be granted by name too, because it would be a grant of everything.

## The loop

```
write  →  validate  →  dry run  →  publish  →  install  →  read the trace
            ↑                │
            └── the trace tells you what to change ──┘
```

- `POST /apps/artifacts/{key}/validate` — schema, every expression, and whether each effect and action step is covered by a declared capability. **Failures carry a JSON Pointer into the document you sent**, so an agent fixes the pointer it was handed.
- `POST /apps/artifacts/{key}/dryRun` — replays a **real past event** and applies nothing. Every step, every SDK call, every effect it *would* have produced, and zero writes. No install is needed: a script's reads are made as **you** — it sees what you can see — and its writes are not sent; each one answers the script with `{dryRun: true, applied: false, …}` and appears in the step's `calls` with `applied: false` and the `request` it would have sent. A connector is bound at install, so an uninstalled app's connector calls are refused by name. A dry run with a script step runs its sandbox in the server you called, so each server runs at most `KANSO_APP_DRYRUN_MAX` (default 4) at once; past that it answers `429 dry_run_limit`, naming the setting. Pass `inputs` to try a configuration before installing: each member overlays the declared default for this run only, and nothing is stored.
- `POST /apps/artifacts` — creates at version 1; `POST /apps/artifacts/{key}/versions` publishes the next. Versions are immutable, and each install runs one specific version.
- `POST /apps/artifacts/{key}/installs` — omit `projectKey` for a site-wide install covering every space, present and future.
- `GET /apps/artifacts/{key}/runs`, `GET /app-runs/{id}` — the run ledger: what ran, what it called, what it changed, why it stopped.

An install never auto-upgrades into a version that asks for more authority.

## Through MCP

The same loop, for an agent: `get_app_sdk`, `browse_app_library`, `validate_app`, `dry_run_app`, `create_app`, `install_app`, `install_library_app`, `list_apps`, `get_app_runs`. Nothing here is a private endpoint — the tools call the routes above. See [Connect an agent](../agents/connect.md).

## When you want your own service instead

Apps are the answer when the logic belongs to Kanso. When you already have a service, or you need something Kanso deliberately does not do inside itself, subscribe a **webhook** and let your own process act:

- `POST /api/v1/webhooks` with a name, a URL, the events you want and an optional JQL filter.
- Give the webhook a `secret` (16–200 characters; no read ever returns it) and every delivery is signed: `X-Kanso-Signature` is `sha256=<hmac>` over the **raw body**, keyed by that secret. Compare with a constant-time equality, and verify before parsing.
- `X-Kanso-Event` and `X-Kanso-Delivery` carry the event name and a stable delivery id (retries reuse it — dedupe on it); the body's `at` is the event time.
- Answer `2xx` quickly and do the work asynchronously. Failures are retried with backoff, and every attempt is visible under the webhook.

Then act through the same public REST API an app uses. That is the whole contract: no SDK, no plugin framework, no private endpoints. The full walkthrough is [Build your own service](building-apps.md); the event catalog and delivery semantics are in [Webhooks and apps](webhooks-and-apps.md).
