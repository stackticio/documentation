---
title: Configuration
description: Look up every environment variable the Kanso 0.77.0 server reads, with its default and what happens when it is unset or invalid.
---

All Kanso configuration is environment variables — there are no config files in the image. Every optional group has a built-in fallback, so a binary plus PostgreSQL is a complete product and each variable below only upgrades or tightens it. When you deploy with the Helm chart, most of these are set for you from chart values; see [Install](install.md) for the chart-level view.

## Core

| Variable | Required | Default | Description |
|---|---|---|---|
| `KANSO_DATABASE_URL` | Yes, for data endpoints | none | PostgreSQL connection URL (pgx/libpq format), e.g. `postgres://kanso:pass@host:5432/kanso`. Unset → degraded boot: only `/healthz`, the served OpenAPI spec and the JQL grammar respond; every data endpoint returns 404. When set, the server retries the connection for up to 90 s at boot, then exits if it is still unreachable. |
| `KANSO_LISTEN_ADDR` | No | `:8080` | Address the HTTP server listens on, in both modes. |
| `KANSO_MODE` | No | `web` | `web` = public API + embedded UI + job workers in-process. `worker` = job workers only, plus `/healthz` and the contract endpoints (`/api/v1/openapi.yaml`, `/api/v1/jql/grammar`). These are the two supported values. |
| `KANSO_ADMIN_PASSWORD` | No | generated | Password for the seeded local `admin` account. Read only in `web` mode, and only acted on when the user table is empty (first boot). Unset → a random password is generated and logged exactly once. Must be at least 8 characters, or the seed fails and the process exits. |
| `KANSO_PUBLIC_URL` | Only with OIDC | none | The instance's public base URL, e.g. `https://kanso.example.com`. Used to build the OIDC redirect URI (`<KANSO_PUBLIC_URL>/api/v1/auth/oidc/callback`), accepted as an allowed request origin, and — when https — turns Secure cookies and HSTS on. One of the four variables that must all be set for OIDC to turn on. |
| `KANSO_SECURE_COOKIES` | No | derived | `true`/`false` — force the Secure flag on every cookie plus `Strict-Transport-Security` on every response. Unset → derived: on when `KANSO_PUBLIC_URL` is https. Only enable it when TLS is actually terminated in front of Kanso. |
| `KANSO_LOGIN_THROTTLE_AFTER` | No | `5` | Consecutive failed logins per username before attempts are refused with 429. |
| `KANSO_LOGIN_THROTTLE_BASE` | No | `60` | First refusal window in seconds; doubles per subsequent failure, capped at 900. A successful login resets the counter. |
| `KANSO_SECRET_KEY` | No (the chart always sets it) | none | The instance signing key. Connector binding secrets are derived from it and never stored, and stored third-party credentials and the email relay password are sealed under a key derived from it — it lives in the environment, never in PostgreSQL. Unset → the server logs a warning, connector bindings can be neither minted nor verified, and nothing can be sealed (a credential or a relay password saved in the UI is refused). The chart generates one at install (`signingKey.*`). |
| `KANSO_ADMIN_USERS` | No | none | Comma-separated usernames made site admins at every `web`-mode boot — idempotent, never demotes anyone; the break-glass for a lockout. A failure exits the process. |
| `KANSO_SPACE_CREATION` | No | `all` | Who may create a space: `all` = any authenticated user, `admins` = site admins only. Any other value refuses to boot. |
| `KANSO_PUBLIC_RATE` | No | `1200` | Anonymous reads of public spaces per rolling minute, per `web` replica, counted in memory and site-wide (not per client). Only credential-less requests to the read-only list that reach a public space are counted; a request carrying a credential never is. Over the budget, anonymous readers get `429 rate_limited` with `Retry-After`; signed-in people are unaffected. `0` closes the anonymous path entirely — every anonymous request is `401`, while a space's public flag still grants `browse` to accounts. Must be an integer `>= 0`; anything else refuses to boot. Set through the chart's `extraEnv`. See [Public spaces](users-and-auth.md#public-spaces). |
| `KANSO_PUBLIC_CONCURRENCY` | No | `32` | Anonymous requests of public spaces that may run at once, per `web` replica. One more is refused at once with `429 rate_limited` and `Retry-After: 1` (it is not counted against `KANSO_PUBLIC_RATE`); a slot is held for the whole request and freed when it ends. This stops a minute's budget arriving in one second as slow readers that each hold a response open. A request carrying a credential never takes a slot. Must be an integer `>= 1`; anything else, `0` included, refuses to boot (`KANSO_PUBLIC_RATE=0` is the switch that closes the path). Set through the chart's `extraEnv`. |

## Auth and OIDC

OIDC is configured in `web` mode only. All four of `KANSO_OIDC_ISSUER_URL`, `KANSO_OIDC_CLIENT_ID`, `KANSO_OIDC_CLIENT_SECRET` and `KANSO_PUBLIC_URL` must be non-empty; otherwise OIDC stays off, and a warning about partial configuration is logged if the issuer URL, client secret or public URL was set (a bare client ID alone does not count as an attempt).

| Variable | Required | Default | Description |
|---|---|---|---|
| `KANSO_OIDC_ISSUER_URL` | For OIDC | none | Issuer URL of any standards-compliant OIDC provider, e.g. `https://keycloak.example.com/realms/main`. Provider discovery runs against it at boot; a discovery failure is fatal (the process exits). |
| `KANSO_OIDC_CLIENT_ID` | For OIDC | none | OAuth2 client ID registered at the provider. |
| `KANSO_OIDC_CLIENT_SECRET` | For OIDC | none | OAuth2 client secret. In the chart this comes from `oidc.existingSecret`. |
| `KANSO_OIDC_PROVIDER_NAME` | No | issuer host | Label of the SSO button on the login page. Unset → the issuer URL's host; if that cannot be parsed, `SSO`. |
| `KANSO_OIDC_GROUPS_CLAIM` | No | none | Name of an ID-token claim holding group names. When set, each OIDC login reconciles the user's SSO-origin memberships of **existing** Kanso groups to the claim's values (groups are never created from a claim; local memberships are untouched). Unset → no group sync. |

Requested scopes are `openid profile email`.

**Fallback when unset:** local accounts (username and password stored in Kanso's own database) are always available and are the default; the login page simply has no SSO button. OIDC never becomes a requirement — when configured, it adds an alternative issuer of the same session, and local login keeps working. See [Users and authentication](users-and-auth.md).

## Attachments and S3

| Variable | Required | Default | Description |
|---|---|---|---|
| `KANSO_ATTACHMENT_MAX_SIZE` | No | `10485760` (10 MiB) | Maximum attachment size in bytes. Must parse as a positive integer; an invalid value is ignored with a warning and the default is kept. Applies in both storage backends. |
| `KANSO_PUBLICATION_SCAN_MAX` | No | `1048576` (1 MiB) | How many leading bytes of an attachment the publication gate scans for secrets when the attachment is completed on a publicly readable issue of a public space. Content is scanned when the declared type is text-like or the first 512 bytes sniff as text, whatever type the client declared; bytes past this cap, and bytes that sniff as an image or binary format, are not scanned. `0` turns content scanning off (file names are still scanned). Must be an integer `>= 0` (ASCII digits only); anything else refuses to boot with one error naming the variable. Read once at boot, in `web` and `worker` mode. Set through the chart's `extraEnv`. |
| `KANSO_S3_ENDPOINT` | For S3 | none | S3-compatible endpoint URL (MinIO, SeaweedFS, AWS, …). |
| `KANSO_S3_BUCKET` | For S3 | none | Bucket name. (The chart defaults it to `kanso`.) |
| `KANSO_S3_ACCESS_KEY` | For S3 | none | Access key. |
| `KANSO_S3_SECRET_KEY` | For S3 | none | Secret key. |
| `KANSO_S3_REGION` | No | `us-east-1` | Region, only consulted once the other four S3 variables enable the backend. |

The S3 backend turns on only when endpoint, bucket, access key and secret key are all non-empty. If the endpoint or either key is set but the group is incomplete, the server logs "partial S3 configuration ignored" and stays on the built-in store.

**Fallback when unset:** attachments are stored inside PostgreSQL (the built-in store), so a binary plus a database handles uploads and downloads with nothing else running. Enabling S3 later affects new attachments; existing built-in ones keep serving.

## Kubernetes access (declarative configuration)

The Kubernetes client is optional and serves one purpose: the reconciler that converges `KansoProject` and `KansoWorkflow` custom resources (see [Tracker as code](../integrate/tracker-as-code.md)). Detection order: first the standard in-cluster ServiceAccount (`KUBERNETES_SERVICE_HOST` plus a mounted token under `/var/run/secrets/kubernetes.io/serviceaccount`), then the `KANSO_KUBE_*` variables. Neither present → no client and no reconciler. If a client is configured but the API server does not answer at boot, the reconciler is disabled with a warning — never fatal.

| Variable | Required | Default | Description |
|---|---|---|---|
| `KANSO_KUBE_API` | No | none | Kubernetes API server URL, used only when no in-cluster ServiceAccount is present. |
| `KANSO_KUBE_TOKEN` | No | none | Bearer token for the API server. Empty → requests are sent without an Authorization header. |
| `KANSO_KUBE_CA` | No | none | Path to a CA certificate file for the API server. Unset while `KANSO_KUBE_API` is set → **no** client is configured unless `KANSO_KUBE_INSECURE=true`: TLS verification is never skipped silently. |
| `KANSO_KUBE_INSECURE` | No | unset | `true` = skip TLS verification when `KANSO_KUBE_API` is set without `KANSO_KUBE_CA`. Development use only — never production. |
| `KANSO_KUBE_NAMESPACE` | No | `default` | Namespace the reconciler watches (only with `KANSO_KUBE_API`; in-cluster mode reads the ServiceAccount's namespace). |

**Fallback when unset:** without any Kubernetes access, Kanso runs exactly as before — projects and workflows are configured through the API and the UI.

Apps are documents Kanso runs in-process (see [App development](../integrate/app-development.md)), so there is no app image or internal URL to configure.

## Apps, outbound calls and schedules

| Variable | Required | Default | Description |
|---|---|---|---|
| `KANSO_OUTBOUND_ALLOW_PRIVATE` | No | `false` | `true` lets connector calls — including an app's steps that call through a connector — reach loopback, private and link-local addresses. Off, such an address is refused after DNS resolution even when a credential's `allowHosts` names the host. Read once at boot. Webhook deliveries do not go through this guard. |
| `KANSO_APP_SCHEDULE_INTERVAL_SECONDS` | No | `60` | Seconds between wake-ups of the app schedule ticker. A minute is the finest schedule granularity. The chart sets it from `appSchedule.intervalSeconds`. |
| `KANSO_APP_SCHEDULE_CATCHUP_MINUTES` | No | `5` | How many missed minutes a restart catches up (`appSchedule.catchupMinutes`). |
| `KANSO_APP_SCHEDULE_DISABLED` | No | unset | `1` stops schedules firing (`appSchedule.disabled: true`). The stranded-run reaper keeps running, so a run left unfinished is still closed `needs_attention` with a note. |
| `KANSO_APP_DRYRUN_MAX` | No | `4` | Concurrent dry runs that execute a `script` step, per `web` process (`POST /apps/artifacts/{key}/dryRun`; each runs its sandbox in that process). A dry run waits up to 2 s for a slot, then is refused with `429 dry_run_limit` naming this variable. `0` switches script dry runs off (every one is refused, saying so); a dry run with no script step never counts. Invalid values are ignored with a warning. Set through the chart's `extraEnv`. |

The webhook SSRF fence is at the network layer instead — see [Network fencing](install.md#network-fencing).

## MCP, API tokens and held reads

| Variable | Required | Default | Description |
|---|---|---|---|
| `KANSO_MCP_ENABLED` | No | `true` | `false` never mounts `/api/v1/mcp`. |
| `KANSO_MCP_RATE` | No | `120` | `tools/call` per rolling minute, per credential. |
| `KANSO_TOKEN_DEFAULT_DAYS` | No | `90` | Personal API token lifetime when the caller does not ask for one. |
| `KANSO_TOKEN_MAX_DAYS` | No | `365` | Ceiling on any requested token lifetime; it can be raised, never removed. |
| `KANSO_AWAIT_MAX_PER_CREDENTIAL` | No | `8` | Concurrent held awaits per credential; `0` admits no hold. |
| `KANSO_AWAIT_MAX_PER_USER` | No | `16` | Concurrent held awaits per user, across all of that user's credentials. |
| `KANSO_AWAIT_MAX_GLOBAL` | No | `256` | Concurrent held awaits per process. |

[Connect an agent](../agents/connect.md#operator-settings) explains each of these in context.

## Agent access policy

How strict Kanso is with AI agents — API tokens and installed apps. By default a site admin sets it in the UI under **Settings → AI access**: a preset plus per-switch overrides, stored in the database (preset `standard`). Set `KANSO_AGENT_POLICY` and the environment wins: the screen becomes read-only and says so. Any `KANSO_AGENT_*` switch set while `KANSO_AGENT_POLICY` is not, or any invalid value, refuses to boot naming the variable — a security posture is never half-applied. Every preset keeps agent-to-human communication open (issues, comments, questions, answers, attachments, leases). The chart's `agentPolicy` block renders these variables.

| Variable | Required | Default | Description |
|---|---|---|---|
| `KANSO_AGENT_POLICY` | No | unset (the settings row governs) | `strict`, `standard` or `open`. `standard`: nothing a token creates outlives it (apps, connectors, credentials, configuration and waivers are opt-in). `strict`: like `standard`, but the optional MCP tool groups (`apps`, `connectors`, `operations`) are hidden from every MCP client. `open`: every switch on; the hard rules below still hold. |
| `KANSO_AGENT_TOKEN_APP_ADMIN` | No | per preset | `true`/`false`: tokens may create, publish, install and change apps (within what their user holds in that space). |
| `KANSO_AGENT_TOKEN_CONNECTOR_ADMIN` | No | per preset | Tokens may administer connectors and bindings. |
| `KANSO_AGENT_TOKEN_CREDENTIAL_ADMIN` | No | per preset | Tokens may store and rotate literal secrets (never a `secretRef`). |
| `KANSO_AGENT_TOKEN_CONFIG_ADMIN` | No | per preset | Tokens may administer spaces, workflows, fields, forms, webhooks and export. |
| `KANSO_AGENT_TOKEN_WAIVERS` | No | per preset | Tokens may waive requirements. |
| `KANSO_AGENT_TOKEN_ATTACHMENTS` | No | `true` in every preset | Tokens may upload and delete attachments. |
| `KANSO_AGENT_GUEST_QUESTIONS` | No | `true` in every preset | Agents (tokens and apps) may ask guest accounts. |
| `KANSO_AGENT_MCP` | No | `on` | `on`, `read_only` (every MCP write tool hidden) or `off` (every `/mcp` request is 403 `policy_mcp_off`; REST with a token keeps working). |
| `KANSO_AGENT_MCP_TOOL_GROUPS` | No | per preset | Comma list from `apps`, `connectors`, `operations` — the optional MCP tool groups (`operations` is `describe_operation` and `call_operation`, any operation of the API); empty string = none. Issue and question tools are always listed. |
| `KANSO_AGENT_LEASES` | No | `advisory` | `enforced`: an agent cannot edit, transition or delete an issue another holder has leased (409 `policy_lease_enforced`). People are never blocked. |

Never relaxed by any of these: people, groups, roles, schemes, resolutions, the importer, instance settings and your own profile stay session-only for tokens (`403 session_required`); a token never installs or administers a site-wide app install, never stores a `secretRef`, and never delegates authority its own user does not hold.

## Email notifications

Kanso hands mail to an SMTP **relay** you name and runs no mail server. Any mailbox provider's SMTP endpoint is a relay (Gmail, Outlook, SES, Mailgun, your domain's mail host), and so is one you host yourself (for example Mailu).

What each person receives is their own choice under **Notifications** in the sidebar. For every event — assigned, mentioned, a comment or a status change on an issue they are involved in, a new issue in a space, a question waiting for their answer, and the answer or decline of a question they asked — they pick Off, Bell, or Bell and email, everywhere or per space. By default only an assignment and a question waiting for an answer are mailed, and nobody hears of new issues until they ask for a space. Mail goes out only while the account is active, has an email (set by a site admin under People, or recorded from a verified single sign-on), and the person's master switch **Email me at …** is on.

There are two ways to name the relay, with one precedence: the environment wins whenever `KANSO_SMTP_HOST` is set; otherwise a site admin can save one under **Settings → Email** (the password is stored sealed under `KANSO_SECRET_KEY` and never shown again). With neither, nothing is sent and everything else works as before.

| Variable | Required | Default | Meaning |
|---|---|---|---|
| `KANSO_SMTP_HOST` | To enable | none | The relay's host name. Setting it turns email on and makes the Settings screen read-only. |
| `KANSO_SMTP_PORT` | No | `587` | 1–65535. |
| `KANSO_SMTP_FROM` | With host | none | The `From` header and envelope sender, e.g. `kanso@example.com`. |
| `KANSO_SMTP_TLS` | No | `starttls` | `starttls` (upgrade after connecting; certificate verified against the host), `implicit` (TLS from the first byte, the 465 shape), `none` (cleartext — only for a relay on a trusted network; a password is refused in the clear to anything but localhost). |
| `KANSO_SMTP_USERNAME` | No | none | When set, the client authenticates: PLAIN, or LOGIN when the relay offers no PLAIN, or CRAM-MD5 when it offers neither. |
| `KANSO_SMTP_PASSWORD` | With username | none | From a Kubernetes Secret (the chart's `smtp.password` / `smtp.existingSecret`). Never logged, never served. |

`KANSO_PUBLIC_URL` is what the mail's issue link is built from; without it the link line is omitted and Settings → Email says so. Delivery is a job in the same transaction as the feed row, attempted up to six times with backoff; the row records when the relay accepted the message or the last error, and Settings → Email shows the newest of each. **Send test email** on that screen sends one message to your own address.

## Search

The chart's `search.existingSecret` value injects `KANSO_SEARCH_URL`, `KANSO_SEARCH_USERNAME` and `KANSO_SEARCH_PASSWORD` into the pod, but the binary reads no `KANSO_SEARCH_*` variable. JQL search runs against PostgreSQL on every install; setting these changes nothing.
