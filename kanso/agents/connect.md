---
title: Connect an agent (MCP)
description: Connect an AI agent to Kanso over MCP with a personal API token, and know exactly what that token can and cannot do.
---

Every Kanso instance is an MCP server at `/api/v1/mcp`. Give an agent a personal API token and it works the same backlog your people do: it finds work, claims it, updates tickets, asks a person when it needs a decision, and records what it did. The agent acts as the person who minted the token, and everything it writes appears in the changelog under that person and the token's name — no sidecar, no extra binary, no bot account sharing a human's password.

AI is a user here, not a feature: there is no LLM in Kanso. The tracker is the interface; MCP is how an agent reaches it.

## Connect in one command

1. Sign in, open **Security** in the sidebar, and choose **Connect an agent**.
2. Name the token, pick **Read only** (the default) or **Read & write**, and create it. The name is shown next to everything the token writes, so name it after the agent — `triage agent`, not `laptop`.
3. Copy the command it shows you. It is complete:

```bash
claude mcp add --transport http https://kanso.example.com/api/v1/mcp \
  --header "Authorization: Bearer kat_1.<secret>"
```

Add `--scope user` to make it available in every project rather than the current directory. Any MCP client that speaks Streamable HTTP works the same way — the URL and the header are the whole configuration.

MCP servers attach when a client starts, so a newly added server appears in your **next** session, not the running one.

A token minted before Kanso 0.71 keeps its name private: its writes show its id (`kat_7`) instead, and the token list says so. Mint a new one to get a named token.

An agent can find the endpoint without anyone reading docs: `GET /api/v1/auth/methods` is open and returns `mcpEndpoint` when the instance knows its own public URL.

```json
{ "local": true, "oidc": { "enabled": true, "providerName": "Keycloak" },
  "mcpEndpoint": "https://kanso.example.com/api/v1/mcp" }
```

It advertises the URL and nothing else — never the tool list, never auth material.

## How tokens work

A personal API token is the credential an agent carries. It is not a password, not a service account and not a second identity: it is **you, delegated**, with a narrower blast radius.

### Shape and storage

The wire form is `kat_<id>.<secret>`:

| Part | Example | Purpose |
|---|---|---|
| `kat_<id>` | `kat_7` | Public identity. Appears in listings, logs and the revoke URL. Not secret. |
| `.` | | Separator |
| `<secret>` | 43 characters, base64url | 32 random bytes. Never stored. |

Kanso stores `sha256(secret)` and nothing else. The `kat_<id>` prefix makes verification a primary-key lookup plus one constant-time compare.

**The secret is displayed exactly once**, in the response that creates it. No endpoint, log line, error message or database column can give it back — not to you, and not to an administrator with direct database access. Lost it? Revoke it and mint another; that is the intended recovery path.

### Scope

Chosen at creation and fixed for life. There is no way to edit a token's scope — only to delete it and mint another.

| Scope | Can | Cannot |
|---|---|---|
| `read` (default) | Every `GET`; the 20 read tools, plus `describe_operation` and `call_operation` for any read | Any `POST`/`PUT`/`PATCH`/`DELETE`. The 19 write tools are not even listed to it, and `call_operation` refuses a write with `insufficient_scope` |
| `write` | Everything `read` can, plus creating, updating, commenting, transitioning, linking | The credential surface (below) |

`read` is the default when you omit `scope` — deliberately the weaker option. The write tools are invisible to a read token, and calling one anyway is refused `403 insufficient_scope` before anything is dispatched, with no effect.

The list is also shaped by the site's agent access policy and by your own permissions (see [What a token cannot do](#what-a-token-cannot-do)): a tool your account could never call is not listed at all. Under the default Standard policy:

| Token | Tools listed |
|---|---|
| A site admin's read token | 22 |
| A site admin's write token | 34 — the seven app, connector and credential writes wait for their switch |
| A member's read token | 18 |
| A member's write token | 29 |

Everything that is listed is callable.

### Lifetime

Every token expires. There is no "never expires" option and no setting that creates one.

- Default **90 days** (`KANSO_TOKEN_DEFAULT_DAYS`)
- Maximum **365 days** (`KANSO_TOKEN_MAX_DAYS`) — an operator can raise the ceiling, not remove it
- Asking for more than the ceiling is `422 validation_failed`, not a silent clamp

An expired token, a revoked token and a token whose user was deactivated are **indistinguishable on the wire**: all three answer `401 unauthenticated` on the next request. Nothing tells an attacker which of the three happened.

### What a token cannot do

A leaked token must not be able to entrench itself. These endpoints refuse Bearer authentication with `403 session_required` and need an interactive browser session:

- `POST /auth/password` — it cannot change your password
- `POST|GET /auth/tokens`, `PATCH|DELETE /auth/tokens/{id}` — it cannot mint a successor, list your other tokens, extend or shorten them, or revoke them
- `GET /tokens`, `PATCH|DELETE /tokens/{id}` — even a site admin's token cannot reach the instance-wide token list or manage other people's tokens
- `GET /auth/sessions`, `DELETE /auth/sessions/{id}` — it cannot see or end your browser sessions

Separately, every **write** (`POST`, `PUT`, `PATCH`, `DELETE`) to an operation that installed apps may never call is classified by the **agent access policy**. After the read-only check, one of three things happens to a token:

- **Hard — never, under any setting:** `403 session_required` with a detail at `/policy/hard`. People, groups, roles, permission and security schemes, resolutions, the importer, the SMTP settings, the policy itself, your own profile (`PATCH /myself`), your notification preferences, a space's publication, and every token or session operation. No preset or switch relaxes these.
- **A switch — when the site admin allows it:** the class is off by default and answers `403 policy_forbids_token_…` (for example `policy_forbids_token_app_admin`) with a detail at `/policy/<switch>` saying the value and where it comes from ("off — preset standard", "off — override (Settings → AI access)", or "off — set by KANSO_AGENT_…"). The classes are `tokenAppAdmin` (apps), `tokenConnectorAdmin` (connectors), `tokenCredentialAdmin` (stored credentials), `tokenConfigAdmin` (spaces, workflows, fields, forms, webhooks, export), `tokenWaivers`, and `tokenAttachments` — the last one is **on** in every preset. When a switch is on, the handler's own permission check still applies: a token never does what its user's session could not.
- **Admitted — no switch:** a few operations, such as `previewForm`, `materializeRequirementTask` and `validateApp` (a static check), pass like any other write.

`describe_operation` shows each operation's class as `agentPolicy`.

A site admin sets the policy under **Settings → AI access** — a preset (**Strict**, **Standard**, the default, or **Open**) plus per-switch overrides — or in the Helm chart's `agentPolicy` block, which then wins over the UI. Every preset keeps every agent↔human path open: issues, comments, questions (guests included), answers, awaits, leases and attachments. Standard adds one rule: nothing a token creates keeps acting after the token is revoked, so apps, connectors, credentials, configuration and waivers are opt-in. Strict also hides the optional MCP tool groups. `GET /myself` → `agentPolicy` tells you what your credential meets; `GET /settings/agent-policy` (site admin) serves the whole catalogue — which operations and MCP tools each switch governs, the hard wall and the presets — so nothing here needs to be memorised.

Three rules stay hard even under Open, because they depend on what the request says rather than which operation it is: a token never installs or administers a **site-wide** app install (give it a `projectKey`), never stores a credential by **`secretRef`** (it supplies the literal secret), and an install, version move, publish or replay it makes must stay within what its **own user holds** in that space (`403 token_install_exceeds_holder`, naming the missing permission). Two switches reach app principals too: `agentQuestionsToGuests` (`403 policy_forbids_agent_guest_questions`) and `leases: enforced` (`409 policy_lease_enforced` on an issue another holder has leased).

The policy applies to writes only. A token still reads what its scope and the permission engine allow: anyone's token reads `GET /resolutions`, and a site admin's token reads `GET /settings/smtp`. An agent sets an issue's resolution through the normal `{fields}` envelope; it just cannot add a new value to the shared list.

**Attachments.** A user's write token may start an upload (`POST /issues/{key}/attachments`), seal it (`POST /attachments/{id}/complete`) and delete an attachment (`DELETE /attachments/{id}`), under the same attachment permissions as the browser, while `tokenAttachments` is on (it is, in every preset). Installed apps may not upload or delete. A read-only token gets `403 insufficient_scope`.

**Over MCP** the same classification decides what `tools/list` shows. A tool whose switch is off, whose group the policy hides, whose write the read-only mode or a read token cannot make, or whose account-level check (`manage_apps`, `manage_connectors`, credentials) your own account fails is not listed — and calling it anyway is an HTTP 403 with the same code, before anything is dispatched. What is listed is callable.

So the worst a stolen token can do is act within its scope until you revoke it. It can never extend its own life or hide its own revocation.

**The two schemes never mix.** If a request carries `Authorization: Bearer`, the session cookie is ignored for that request. A bad token plus a valid cookie is `401`, not a quiet fallback to the cookie's authority.

### Revocation and rotation

| Event | Effect |
|---|---|
| `DELETE /auth/tokens/{id}` (or **Revoke** in the UI) | Immediate — the token fails on its very next request |
| `PATCH /auth/tokens/{id} {"expiresInDays": n}` (or **Expiry** in the UI) | The token now expires `n` days from today (1 to `KANSO_TOKEN_MAX_DAYS`), sooner or later than before. The secret is unchanged, so the agent keeps working. An expired token cannot be extended — mint a new one |
| A site admin revokes or re-times it under **Tokens** (`DELETE` / `PATCH /tokens/{id}`) | Same effects; the admin's action is logged, never with the secret. Your other tokens and sessions are untouched |
| Someone else's token id | `404 token_not_found`, never `403` (a 403 would confirm the id exists) |
| **You change your password** | **Every token you own is deleted**, in the same transaction as the password change |
| Your account is deactivated | All your tokens stop working |

The password row surprises people, and it is deliberate: changing your password is the break-glass action, so no credential minted before it survives it. Expect to mint new agent tokens after rotating your password.

`lastUsedAt` is updated at most once a minute — enough to spot a token that something you forgot about is still using.

### Rate ceiling

`tools/call` is capped per credential at **120 calls per rolling minute** (`KANSO_MCP_RATE`). Over the cap you get `429` with a `Retry-After` header that never overstates the wait. Two tokens belonging to the same person have independent ceilings.

### Doing it without the UI

```bash
# Mint (cookie session required — a token cannot mint a token)
curl -b cookies.txt -X POST "$KANSO_URL/api/v1/auth/tokens" \
  -H 'Content-Type: application/json' \
  -d '{"name": "triage agent", "scope": "write", "expiresInDays": 30}'

# {"id":"kat_7","name":"triage agent","scope":"write","createdAt":"...",
#  "expiresAt":"...","lastUsedAt":null,"nameOnWrites":true,"token":"kat_7.<secret>"}   <- once

curl -b cookies.txt "$KANSO_URL/api/v1/auth/tokens"          # list (no secrets)
curl -b cookies.txt -X DELETE "$KANSO_URL/api/v1/auth/tokens/kat_7"   # 204
```

## The tools

The endpoint carries **41** tools, 22 of them reads. What a given credential is shown depends on its scope, the agent access policy and its own permissions. The instance's own `tools/list` is the authoritative list, and everything it lists is callable.

### Issues, questions and leases

| Tool | Scope | What it does |
|---|---|---|
| `search_issues` | read | JQL search, paged: `maxResults` (1–100, default 25) per call, then `nextPageToken` until `isLast` is true — there is no total. The grammar is served at `/api/v1/jql/grammar` |
| `get_issue` | read | One issue in full: fields, links, the transitions actually available right now, the first 50 children (`childrenTruncated` says more exist), and the newest 50 comments (`commentsTotal`, `commentsStartAt`). A part that cannot be read fails the call; it is never served empty |
| `get_create_form` | read | The server-resolved create form — what a create needs, before attempting one |
| `list_projects` | read | Projects and their keys |
| `await_issue` | read | Block until an issue is `resolved` or has `changed` since a version (`key`, `until`, `timeout` 0–60 s, `since`) — one held request, answered within a second of the commit, or at the deadline with `satisfied:false`. The body is that of `GET /issues/{key}/await` |
| `get_answer` | read | The committed answer of a resolved issue — the `GET /issues/{key}/answer` body with its permanent `citation`; optional `version` re-reads a cited answer |
| `get_question` | read | One question on an issue, with its answer once answered — the `GET /questions/{id}` body: the values, typed and in schema order, and the permanent `citation` `KEY/q_<n>` |
| `await_question` | read | Block until a question is answered, declined or withdrawn (`id`, `timeout` 0–60 s) — one held request, `{satisfied, question}`, answered within a second of the commit or at the deadline with `satisfied:false`; charged once however long it holds |
| `get_question_group` | read | One question group (`qg_<n>`): every member question in `assignees` order with its own state and answer, and a summary counted on that read — the server computes no agreement |
| `await_question_group` | read | Block until every member of a group has ended (`id`, `timeout` 0–60 s) — one held request for the whole group, `{satisfied, group}` |
| `list_questions` | read | The issue's open and answered questions, oldest first — `GET /issues/{key}/questions` |
| `get_lease` | read | Who holds an issue's work lease: `holder`, `holderCredential`, `ttlSeconds`, `acquiredAt`, `expiresAt`, plus `heldByCaller` and `callerMayRelease` — `GET /issues/{key}/lease`. Refused `lease_not_found` when the issue is free |
| `create_issue` | write | Create, including custom `cf_n` fields. Requires `origin` (below) |
| `update_issue` | write | Field patch; pass `version` (from `get_issue`) to make it conditional on what you read |
| `add_comment` | write | Comment as the token's user |
| `transition_issue` | write | Execute a workflow transition by id or name; an optional `fields` object is forwarded to the transition's form, and an optional `version` makes it conditional on what you read |
| `link_issues` | write | Link two issues by link-type name |
| `ask_question` | write | Ask a question on an issue with its own answer schema (`key`, `prompt`, `schema`; optional `detail`, `context`, `assignee`) → `POST /issues/{key}/questions`. No field, form, workflow or issue type is involved; the result is the `Question` with its `citation`. With `assignees` (1–20 user ids, instead of `assignee`) it asks each of them under one group and returns the `QuestionGroup` |
| `claim_issue` | write | Claim an advisory work lease (`key`, optional `ttlSeconds` 60–14400, default 900) → `POST /issues/{key}/lease`. Claiming an issue you already hold renews it |
| `renew_lease` | write | The heartbeat: extend a lease you hold → `POST /issues/{key}/lease {renew: true}`. It never re-acquires a lease you lost (`lease_not_found`) |
| `release_issue` | write | Release a lease you hold → `DELETE /issues/{key}/lease`; returns `{issue, released: true}` |
| `claim_next_issue` | write | Claim ONE free issue matching a JQL query that you may edit (`jql`, optional `ttlSeconds`, `maxCandidates` 1–50, `idempotencyKey`) → `POST /leases/claim-next`. The issue comes back as its summary; `claimed:false` with `examined` / `notPermitted` / `contended` says why nothing was claimed |
| `check_publication` | write | Dry-run the publication gate: scan 1 to 20 texts of a space (`project`, `texts: [{field, text}]`, each at most 65,536 characters) against the effective rules → `POST /publication/check`, writing nothing; answers `{publicSpace, findings}`. It is a write tool because its REST sibling is a `POST`, so a read token is not shown it. See [Public spaces: redact and retry](#public-spaces-redact-and-retry) |

`get_issue`'s `issue` and `await_issue`'s `issue` carry the live work lease as `issue.lease` (null when the issue is free), and every issue summary — in `search_issues`, `create_issue`, `update_issue`, `transition_issue` and `claim_next_issue` results — carries a `lease` line `{holder, credential, expiresAt}` while someone holds one.

**Every ticket an agent opens says where it came from.** `create_issue` requires `origin`: your `session` (the id of the conversation, job or run you are in — whatever lets a person or another session find it) and a `context` sentence (what asked for the ticket: the person's request, the parent issue, the repository and branch). The tool writes it as the first line of the description — `` > **Agent origin** — session `<id>` — <context> `` — above whatever description you gave, so people read it on the ticket and other sessions find it with `search_issues` and `text ~ "<id>"`. A call without it is refused `origin_required` and writes nothing. Nothing is needed on REST: the line is the MCP tool's contract.

### Everything else: `describe_operation` and `call_operation`

The typed tools cover the daily loop. Everything else the API can do — create a space, publish a workflow, bind it, add a field or a form, pause or uninstall an app, bind a connector, set a webhook, export — is reachable through two generic tools that read the API contract itself.

- `describe_operation` lists every operation (filter with `search` and `method`) or shows one in full: its parameters, the body schema, the error codes each response names, and `callable` — whether **your** credential passes the scope, policy and token checks for it right now, and the code it would meet if not.
- `call_operation` performs it: `operationId`, then `path` and `query` parameters by name, a `body` (an object as JSON, a string verbatim — a YAML app or connector document stays byte-identical), `version` for If-Match and `idempotencyKey`. It answers `{status, body}`; a refusal carries the REST `code`, `message` and `details` in `structuredContent`, so read codes, not prose.

There is no way to pass headers, a method or a raw path: the tool can only name what the contract declares, and every call goes through the same checks as REST with your credential. An API token still never reaches people, roles, permission schemes, tokens, the agent policy or the importer, under any setting. The pair is the optional tool group `operations` (shown under Standard and Open, hidden under Strict). Prefer a typed tool where one exists: `get_issue` composes four reads and `search_issues` summarises.

### Apps, connectors and credentials

Sixteen tools manage apps, connectors and stored credentials — see [App development](../integrate/app-development.md#through-mcp).

| Scope | Tools |
|---|---|
| read | `browse_app_library`, `browse_connector_catalog`, `get_app_runs`, `get_app_sdk`, `get_connector_deliveries`, `list_apps`, `list_connectors`, `list_credentials` |
| write | `connect_connector`, `create_app`, `dry_run_app`, `install_app`, `install_connector`, `install_library_app`, `store_credential`, `validate_app` |

### Same rules as REST

Every tool runs the same code path as its REST equivalent, with your credential. There is no MCP-only query path and no MCP-only view — so an agent can never see an issue you cannot see, and a workflow guard that refuses your transition refuses the agent's with the same reason.

**Every write names the credential that made it.** Each changelog group, comment, worklog, record, question, attachment, waiver and feed row carries a `via` — `{kind, id, name}` — beside its author. A token's write reads `{"kind":"token","id":"kat_12","name":"ci-agent"}` on every transport (`/mcp` and plain REST), and people see `via token "ci-agent"` next to it. A session cookie is recorded by the route it was presented to: on `/mcp` it is `session_mcp` (people see `via MCP session`); on any other route it is `session`, exactly like the browser. Kanso records credentials and routes, never intentions: it cannot tell a person from a program holding the same credential — which is why an agent should hold a token, not a password.

An agent recognises its own writes without a call: its token's `via.id` is the part of its wire value before the dot (`kat_12` for `kat_12.<secret>`), so it compares `comment.via.id` — or a webhook delivery's `via.id` — with that prefix. Search what any agent did with `changedVia = token`, or one agent with `changedVia = kat_12` (see [Search and JQL](../work/search-jql.md)).

## Quick guide for the agent

*This section is written for the model on the other end of the connection. Paste it into your agent's system prompt, or point the agent at this page.*

You are talking to **Kanso**, an issue tracker. You are not a bot account — you are acting as a specific human, and every issue you create, comment you post and transition you execute is permanently attributed to them, via this token, by name, in the changelog. Behave accordingly.

**Orient before you act.**

1. `list_projects` — learn the project keys. Issue keys look like `PAY-31`.
2. `search_issues` with JQL to find work. Start narrow.
3. `get_issue` before changing anything — it returns the current state *and* the transitions that are legal right now.

**Never guess the shape of a create.** Call `get_create_form` for the target project first. It tells you which fields exist, which are required, and their types, including custom `cf_n` fields. Kanso projects differ from each other; a create that worked in one project can be invalid in the next. Every `create_issue` needs `origin`: your `session` id and a `context` sentence saying what asked for the ticket.

**JQL, briefly.** The grammar is served at `/api/v1/jql/grammar` — read it rather than guessing.

```
project = PAY AND statusCategory = in_progress ORDER BY created DESC
assignee = currentUser() AND statusCategory != done
labels = ai-triage AND created >= "2026-08-01"
text ~ "timeout" AND project IN (PAY, WEB)
parent = PAY-10
assignee IS EMPTY
```

Three things that trip agents up:

- `statusCategory` is one of `todo`, `in_progress`, `done`. Use it instead of hardcoding status names, which vary per workflow.
- **Dates are absolute and quoted.** There are no relative literals — `created >= -7d` is a syntax error. Compute the date yourself and quote it: `created >= "2026-08-01"`.
- **`currentUser()` is the only function.** Anything else returns `unknown function`. Bare values are fine for keys, usernames, ids and labels; anything with spaces or punctuation must be quoted.

**Transitions are not status writes.** You cannot set a status field. Call `get_issue`, read `transitions`, pick one whose `isAvailable` is true, then `transition_issue` with its name or id. If a transition is unavailable the response tells you why — a workflow guard rejected it. That reason is authoritative: do not retry the same transition hoping for a different answer, and do not try to route around it by editing fields.

**Writes are versioned — pass the version you read.** `get_issue` returns `issue.version`; send it as `version` to `update_issue` and `transition_issue`. If a human edited the issue since your read, nothing is written and the refusal is `stale_version`: re-read with `get_issue` and re-apply your change on top. Without `version` the tool writes against whatever version is current when it runs, so a human's edit made after your read is overwritten for every field you send. Never loop on a conflict without re-reading.

**Read the kinds of failure differently.**

| What you see | Meaning | What to do |
|---|---|---|
| A tool result with `isError: true` | A *domain* refusal — validation, a workflow guard, a missing issue | Read the reason. Adapt or explain to the human. This is normal. |
| HTTP `403 insufficient_scope` | Your token is read-only | Stop. Do not retry. Tell the human they need to mint a token with write access. |
| HTTP `401` | Your token is expired, revoked, or the account is deactivated | Stop. Tell the human to mint a new one. Retrying cannot help. |
| HTTP `429` | You exceeded the call ceiling | Wait for `Retry-After` seconds, then continue. Reduce your call rate. |
| A tool result with `isError: true` naming `secret_detected` | Your text would be published in a public space and matches a publication rule | Redact the named ranges and retry, or ask a person. See [Public spaces: redact and retry](#public-spaces-redact-and-retry). |

**Be economical.** `get_issue` returns comments, links, children and transitions in one call — do not fan out into separate calls for those. It serves the newest 50 comments and the first 50 children: `commentsStartAt` above 0 means older comments exist, and `childrenTruncated` means more children exist (list them with `search_issues` and `parent = <key>`). `search_issues` is paged — follow `nextPageToken` until `isLast` before you conclude something does not exist. Prefer one well-formed JQL query over many small ones. You have 120 tool calls a minute; a well-behaved agent rarely approaches that.

**Waiting on a human.** When a task needs a person's answer, ask it on the issue the work is about with `ask_question`: the prompt, the items the answer consists of (`choice`, `multi`, `text`, `number`, `yesno`, `file` — each with a label and help text written in the person's words), optionally the attachments they should look at (`context`) and who should answer (`assignee`, a `u_<n>`; omit it for anyone who can see the issue). Nothing has to be set up first and nothing outside the question changes.

Read the result's `delivery` first (each member's, when you asked several people with `assignees`):

- `assignee_notified` — the person can see the issue and the question is in their questions inbox, with a feed entry and mail as their own notification choices and the site's mail setup allow (by default a feed entry, and mail where the site can send it). You need not send the link.
- `assignee_cannot_see` — nobody was told, because they cannot see this issue: get them access, or withdraw and ask someone who can.
- `no_assignee` — nobody was named, so nobody was told.
- `asked_yourself` — you asked your own account through a password login, which reaches nobody: ask through an API token.

When nobody was told, tell the human the link the result implies — `/answer/q_<n>`. Then call `await_question` with a `timeout` up to 60: one call per minute of waiting, not a poll loop with `get_question`. `satisfied: false` at the deadline is normal: call again. `satisfied: true` with `state: "withdrawn"` means the asker took it back; `state: "declined"` means the person could not answer, and `declineReason` says why. When it is answered, `get_question` returns the values, typed and in schema order, with a `citation` (`KEY/q_<n>`); keep that string wherever you use the answer — it re-reads the same answer forever. Do not ask twice for the same thing: `list_questions` on the issue shows what is already open or answered. There is no tool to answer a question — that half belongs to the person. (The other shape, an issue that resolves through a transition form, is `create_issue` → `await_issue` with `until: "resolved"` → `get_answer`; it works where a workflow already has such a form.) The [human answers guide](./human-answers.md) has the full loop. Holds are capped per credential (8 by default; issue and question holds count together): an `await_limit` refusal carries a `Retry-After` — wait it out, do not open more.

**Working in a fleet: claim before you work.** When several agents take work from the same queue, a lease says "I am working on this, until then" — to the other agents and to the people watching the board, where it shows on the card. It is advisory: it stops other *claimers*, never other writers (unless the site admin enforces leases). The loop:

1. `claim_next_issue` with the queue's JQL and an `ORDER BY` (the default is newest first). It claims ONE free issue you may edit, or answers `claimed: false`. That is a normal answer, and the counts say why: `examined: 0, notPermitted: 0` is no free matching work; `notPermitted > 0` is free work you may not edit; `contended > 0` is others were faster — call again. Pass an `idempotencyKey` so a retried call returns the same lease instead of claiming a second issue. (To claim one specific issue, use `claim_issue`.)
2. While you work, `renew_lease` at least every third of the TTL (a 900 s lease: every 5 minutes). It never re-acquires a lease you lost.
3. **How you hear "stop".** A person can call off their own agent from the browser (a *recall*), and a space admin can force a lease off. Neither moves the issue's version, so `await_issue` does not wake on it — you hear it at your next `renew_lease`, which answers `lease_not_found`. Stop working, re-read the issue with `get_issue`, and claim it again only if it is still yours to do. (A system that must hear it within a second subscribes a webhook to `issue.lease_released`.)
4. `release_issue` as soon as you are done, so the next agent can take it.

**The holder is the credential, not the account.** Two tokens of one account exclude each other exactly as two accounts do: give each agent its own token. A refusal that says *your own account* means another of your own credentials holds the issue — a sibling token, or a browser session. A pool of agents that SHARES one token is one holder.

**Public spaces: check before you paste.** Every issue carries `publiclyReadable`. When it is true, what you write there is readable by anyone on the internet, and the server scans it for secrets first. Never paste a credential, a token or a private hostname into such an issue; when you quote logs or configuration, run them through `check_publication` first. A `secret_detected` refusal changed nothing: redact the ranges it names and retry, or ask a person ([details](#public-spaces-redact-and-retry)).

**Prefer commenting over acting** when you are unsure. A comment is cheap, visible, reversible, and reads naturally to the human reviewing it. A wrong transition on someone's board is none of those things.

**Say what you did.** When you finish a batch of changes, tell the human the issue keys you touched and what changed on each. They can see it in the changelog, but they should not have to go looking.

## Public spaces: redact and retry

A site admin can [make a space public](../run/users-and-auth.md#public-spaces): its issues without a security level are readable by anyone, without an account. Text written into such an issue — and into a public space's versions, components, sprints, board, hierarchy levels and name — is scanned for secrets **before** it is written. The rules are known credential formats (cloud and forge tokens, private-key headers, JWTs, `user:password@` URLs, `password=…` assignments, Kanso's own `kat_` tokens) plus the private terms and patterns a site admin adds.

**What an agent sees first.** Every issue body carries `publiclyReadable`: true when its space is public and it has no security level — exactly what the scan treats as published. Writes into a private space, or into an issue with a security level, are never scanned.

**The refusal.** A scanned write whose text matches is refused `422 secret_detected`, and nothing is written — no row, no event, no gap in issue numbers. On `/mcp` it is an in-band tool error. The text names the code and, per finding, the rule, the field (for example `/body` or `/fields/description`) and the code-point range:

```
secret_detected: this text would be published in a public space and matches 1 publication rule — aws-access-key-id at /body, characters 4–24. Redact the text at these ranges and retry, or ask a person.
```

The result's `structuredContent` is the REST error body, with the `publication` member: `{acknowledgeable, findings: [{rule, description, field, start, end, fingerprint}]}`. No response, error, log line or event ever carries the matched text, and a finding of an administrator's own rule says no more than "A private term or pattern set by your administrator".

**What to do.** Redact the named ranges (`[redacted]` is fine) and retry the same call. If the text must be published as written, stop and ask a person. An agent credential — an API token on REST or `/mcp`, or an app — can never acknowledge a finding; a person signed in through the browser can (the **Publish anyway** action), and that act is attributed, evented (`publication.acknowledged`) and logged. A person's session on `/mcp` cannot acknowledge either: `/mcp` forwards no acknowledgement.

**Pre-check with `check_publication`.** Pass the space key and the texts you are about to write — 1 to 20, each at most 65,536 characters — each with the `field` it would go in. It applies the same rules whether or not the space is public, writes nothing, and answers `{publicSpace, findings}`. A call that large is admitted although every other `/mcp` request is held to the 1 MiB body cap. Its fingerprints are informational: an acknowledgement uses the fingerprints of the write's own refusal.

The scan is a seatbelt, not a guarantee: it catches known formats and listed terms, not a secret described in prose, an encoded or split value, or one inside an image. Do not rely on it to decide what is safe to publish.

## Operator settings

| Variable | Default | Effect |
|---|---|---|
| `KANSO_MCP_ENABLED` | `true` | `false` removes the endpoint entirely — it 404s like any unknown path, with no hint the feature exists |
| `KANSO_MCP_RATE` | `120` | `tools/call` per rolling minute, per credential |
| `KANSO_TOKEN_DEFAULT_DAYS` | `90` | Lifetime when the caller does not ask for one |
| `KANSO_TOKEN_MAX_DAYS` | `365` | Ceiling on any requested lifetime |
| `KANSO_AWAIT_MAX_PER_CREDENTIAL` | `8` | Concurrent held awaits per credential — issue holds and question holds count together. `0` admits no hold, while instant checks (`timeout=0`) keep working; an invalid value keeps the default with a logged warning |
| `KANSO_AWAIT_MAX_PER_USER` | `16` | Concurrent held awaits per user, across all of that user's credentials |
| `KANSO_AWAIT_MAX_GLOBAL` | `256` | Concurrent held awaits per **process** — every web and worker replica counts its own. Size it against the database pool (a hold issues up to four narrow point reads per second) |

In the Helm chart these keep their defaults; override them through `extraEnv`. The chart never mints or stores a token — tokens belong to people, not to releases.

The transport is deliberately minimal: POST only, JSON only, stateless. No SSE, no `Mcp-Session-Id`, no JSON-RPC batching (an array body is refused `-32600`). Authentication is resolved *before* the request body is parsed, so there is no anonymous handshake that reveals the tool catalogue.

## Troubleshooting

| Symptom | Cause |
|---|---|
| `401` with a token you just made | You copied the display value including surrounding quotes, or only the `kat_7` part — the secret after the dot is required |
| `401` on a token that worked yesterday | Expired, revoked, or someone changed the owner's password (which revokes every token) |
| `403 session_required` | You pointed a token at `/auth/password`, `/auth/tokens*` or `/auth/sessions*`, or made a write the policy classifies as hard (people, groups, roles, schemes, resolutions, the importer, settings, `PATCH /myself`), or asked for a site-wide app install or a `secretRef`. Those need a browser session, by design — the detail at `/policy/hard` says so |
| `403 policy_forbids_token_…` | The write's class is off under the agent access policy. The detail at `/policy/<switch>` names the switch and its source; a site admin can turn it on under **Settings → AI access** (or in the chart's `agentPolicy` block) |
| `403 policy_mcp_off` / `policy_mcp_read_only` / `policy_mcp_tool_group_hidden` | The site admin turned the MCP endpoint off, made it read-only, or hid the app, connector or operations tool groups. REST with a token still works |
| `403 token_install_exceeds_holder` | Your token tried to give an app authority its own user does not hold in that space. The details name each missing permission |
| `409 policy_lease_enforced` | Leases are enforced here and another holder has leased the issue. Claim it, or wait for the lease to end |
| `403 insufficient_scope` | A read-only token attempted a write. Mint one with write scope |
| `secret_detected` on a write | The issue is `publiclyReadable` and the text matches a publication rule. Redact the named ranges and retry, or ask a person — an agent credential cannot acknowledge |
| `403 origin_forbidden` | A browser sent a cross-origin request. Non-browser clients send no `Origin` and are unaffected |
| `404` on `/api/v1/mcp` | The operator set `KANSO_MCP_ENABLED=false`, or the URL is missing the `/api/v1` prefix |
| `405` | You used `GET`. The endpoint is POST-only |
| Client shows no tools, or fewer than expected | Read-only tokens legitimately see only the reads; the agent access policy may hide the optional tool groups (Strict) or every write (read-only mode), and tools your account could never call are not listed. Otherwise check the header is `Authorization: Bearer <token>` |
| `issue_leased` naming *your own account* | Another of your credentials (a sibling token, or a browser session) holds the issue — wait until the `expiresAt` it names, or release it from a browser session of the account |
| `renew_lease` answers `lease_not_found` | Your lease ended — it expired, or a person recalled it or a space admin forced it. Re-read the issue before claiming it again |
| `await_issue` or `await_question` returns a transport error or a `504` with no Kanso body | A proxy in front of Kanso cut the hold: a 60 s hold needs a proxy read timeout of at least 90 s (ingress-nginx defaults to 60 — see [Install](../run/install.md)); a rollout also drops held connections. The call is idempotent and wrote nothing — issue it again |
