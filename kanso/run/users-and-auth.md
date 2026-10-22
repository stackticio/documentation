---
title: Users and authentication
description: Set up sign-in for Kanso — local accounts, sessions, guests, OIDC single sign-on and public spaces — and understand how every write is attributed to a person.
---

Kanso ships with local accounts out of the box: usernames and passwords stored in Kanso's own database, exchanged for an HttpOnly session cookie. No identity provider is required to run Kanso. When you do have one, OIDC single sign-on is enabled purely by configuration and becomes an alternative way to open the *same* session — local accounts keep working alongside it. This page covers local accounts, sessions, guests, how writes are attributed, comments, OIDC single sign-on and public spaces.

All endpoints below live under the API base path `/api/v1`.

## Local accounts

### The seeded admin

On first boot Kanso seeds one admin user:

- Username: `admin`
- Password: taken from the `KANSO_ADMIN_PASSWORD` environment variable, or generated once and printed to the server log on first boot.

Passwords are never stored or logged in clear text — the database holds only a bcrypt hash. A failed login returns the same 401 body whether the username is unknown or the password is wrong, so nobody can probe for valid usernames.

### Sessions and the `kanso_session` cookie

Logging in sets an HttpOnly cookie named `kanso_session`. Every data endpoint requires a valid credential — this session, or a personal API token (see [Connect an agent](../agents/connect.md)) — and returns `401` without one. The open endpoints are `/healthz`, the served contract (the OpenAPI spec and the JQL grammar), `/auth/login`, `/auth/methods` and the two OIDC browser endpoints — plus, while a space is public, the anonymous reads described under [Public spaces](#public-spaces).

Log in and store the cookie:

```bash
curl -c cookies.txt -X POST https://kanso.example.com/api/v1/auth/login \
  -H 'Content-Type: application/json' \
  -d '{"username": "admin", "password": "YOUR_PASSWORD"}'
```

A `200` response returns the User object and a `Set-Cookie: kanso_session=...` header. Check who you are:

```bash
curl -b cookies.txt https://kanso.example.com/api/v1/myself
```

Log out:

```bash
curl -b cookies.txt -X POST https://kanso.example.com/api/v1/auth/logout
```

Logout returns `204` and invalidates the session **server-side**: replaying the old cookie afterwards gets `401`.

### Creating and finding users

`POST /users` adds a person (site admin). Kanso never writes to an identity provider — this creates a Kanso account only:

```bash
curl -b cookies.txt -X POST https://kanso.example.com/api/v1/users \
  -H 'Content-Type: application/json' \
  -d '{"username": "jsmith", "name": "Jane Smith", "password": "s3cret-pass", "email": "jane@example.com"}'
```

Rules enforced by the API:

- `username` must match `^[a-z][a-z0-9._-]{1,63}$` (lowercase, starts with a letter).
- `password` must be at least 8 characters (`422` otherwise). It is optional — see [Pending accounts](#pending-accounts-claimed-by-the-first-sso-login) below.
- `email` is optional, lowercased on write and unique across accounts (`409 email_taken`).
- An account must have a way in: a password, or an email for single sign-on to claim. Neither is `422`.
- A taken username returns `409`.

Every User carries `email` (or `null`) and `signIn`, the server's derived answer to "how does this account sign in". It is derived from the row on every read, never stored:

| `signIn` | Meaning |
|---|---|
| `password` | A local account with a password. |
| `sso` | An identity from the provider is linked. |
| `pending` | No password and no identity yet; waits for its first SSO login. |
| `none` | No way in — an imported person who never logged in, or an app principal. |

A person with a password is a **local account**. This is how you add someone who does not exist at your identity provider: they sign in with the username and password on the login form, whether or not SSO is configured.

`GET /users?query=...` searches users by username or display name, case-insensitive — this is what the assignee picker uses:

```bash
curl -b cookies.txt 'https://kanso.example.com/api/v1/users?query=smith'
```

### Guests

A **guest** is an account — local or SSO-claimed — with `guest: true`: it holds only what a space grants it **by name**.

The seeded permission scheme grants every work key to `anyLoggedIn`, so an ordinary account sees every space the moment it logs in. `anyLoggedIn` grants and security levels never match a guest, so a guest sees nothing until a `user`, `group` or `projectRole` grant reaches it.

The seeded `Answerers` role holds `browse` and `comment_add` in the Default scheme. Add the guest to that role in one space and the guest sees exactly that space, can answer questions sent to it, and lands on its questions after signing in:

```
POST /projects/{key}/roles/{roleId}/members
{"users": ["lee"], "groups": []}
```

The call is additive and idempotent. In **Settings → People**, "Guest of a space" does both steps in one form.

- A guest is never a site admin (`422 guest_site_admin`) and cannot create spaces.
- `GET /users` answers a guest with its own row only.
- Flipping `guest` takes effect on the next request; sessions survive.

See [Human answers](../agents/human-answers.md) for how questions reach a person.

## Attribution of writes

Every write made with a session records its actor:

- `reporter` on an issue is set automatically to the logged-in creator and is **immutable** via the API — a `PATCH` that tries to change it returns `422`.
- Changelog groups carry an `author` — the user whose session made the change.
- Comments carry an `author` — always the session user, never client-supplied.

Data imported without a user mapping renders these fields as `null`, never as an error.

## Comments

Comments are their own stream on an issue: adding one does **not** bump the issue's version and does **not** create a changelog group.

```bash
curl -b cookies.txt -X POST https://kanso.example.com/api/v1/issues/KAN-1/comments \
  -H 'Content-Type: application/json' \
  -d '{"body": "Reproduced on staging."}'
```

Returns `201` with the Comment, including its `author`. An empty body is `422`; an unknown issue is `404`. Listing pages oldest-first:

```bash
curl -b cookies.txt 'https://kanso.example.com/api/v1/issues/KAN-1/comments?startAt=0&maxResults=100'
```

The response carries `startAt`, `maxResults` (max 200, default 100), `total` and `items`.

## OIDC single sign-on

OIDC is an alternative issuer of the same session — the `kanso_session` cookie, the authentication wall and every data endpoint are unchanged. It exists only when configured; a bare install keeps local accounts and never requires an identity provider.

### Enabling it

OIDC is enabled purely by environment variables (see [Configuration](configuration.md#auth-and-oidc) for the full reference, and [Install](install.md#enabling-oidc-single-sign-on) for the chart values):

| Variable | Meaning |
|---|---|
| `KANSO_OIDC_ISSUER_URL` | e.g. `https://keycloak.example.com/realms/myrealm`; the provider is discovered via `{issuer}/.well-known/openid-configuration` |
| `KANSO_OIDC_CLIENT_ID` / `KANSO_OIDC_CLIENT_SECRET` | A confidential client — Kanso uses the server-side authorization-code flow |
| `KANSO_PUBLIC_URL` | Kanso's external base URL; the redirect URI is `{KANSO_PUBLIC_URL}/api/v1/auth/oidc/callback` |
| `KANSO_OIDC_PROVIDER_NAME` | Optional display label for the SSO button (default: the issuer host) |

All four required variables present → OIDC is on. Any missing → OIDC is off: `/auth/methods` reports `oidc.enabled: false` and both OIDC endpoints answer `404`. Misconfiguration (for example an unreachable issuer) fails at **boot**, loudly — you never get a half-working login page.

### Discovering what an instance offers

`GET /auth/methods` is open (no session needed) and is what the login screen renders from — there is no hardcoded SSO button:

```bash
curl https://kanso.example.com/api/v1/auth/methods
```

```json
{
  "local": true,
  "oidc": { "enabled": true, "providerName": "keycloak.example.com" }
}
```

`local` is always `true`: local accounts keep working identically whether OIDC is off or on.

### The login flow

The flow is a server-side authorization-code exchange; the browser (and the UI) never handles tokens:

1. The browser navigates to `GET /api/v1/auth/oidc/login`, which responds `302` to the provider's authorization endpoint with `state` and `nonce` bound to a short-lived HttpOnly cookie.
2. After the user authenticates at the provider, the provider redirects to `GET /api/v1/auth/oidc/callback`.
3. The callback verifies the `state`, exchanges the code, and validates the ID token — signature against the provider's JWKS, plus `iss`, `aud`, `exp` and `nonce`. Only after **all** of that succeeds is a session issued.
4. On success Kanso sets `kanso_session` and redirects to `/`. Any validation failure redirects to `/?error=oidc_failed`; the reason is logged server-side and never leaked into the URL.

When OIDC is not configured, both `/auth/oidc/login` and `/auth/oidc/callback` return `404`.

### Identity mapping and just-in-time provisioning

Identities are keyed by **`(issuer, subject)` only**. The first login with a new subject provisions a fresh, active user just in time:

- Username minted from the `preferred_username` claim, slugified to Kanso's local username rules, suffixed `-2`, `-3`, … on collision.
- Display name from the `name` claim (fallback: `preferred_username`).

Subsequent logins with the same `(issuer, subject)` resolve to the **same** Kanso user, even after renames at the provider.

**No silent linking.** An OIDC login is *never* silently linked to an existing account that can already sign in — by username or by email — because that is an account-takeover vector. If an OIDC user's `preferred_username` collides with an existing local username, Kanso mints a suffixed username (for example `jsmith-2`) instead; the local account is untouched, and both can hold sessions concurrently.

When a new account is provisioned this way, the provider's **verified** email (`email_verified: true`) is recorded on it if no other account holds that address; an unverified email is never recorded.

### Pending accounts, claimed by the first SSO login

The one deliberate exception to "never link" is an account an administrator created *for exactly that purpose*: `POST /users` with an `email` and **no `password`**. Such an account is `signIn: pending` — nobody can enter it yet. When someone signs in through the provider and the ID token carries `email_verified: true` with a matching email, Kanso attaches that `(issuer, subject)` to the pending account instead of minting a new user. The person keeps the username and any assignments the administrator set up in advance.

The claim is narrow by construction:

- Only an **active** account with **no password and no linked identity** can be claimed. An account someone can already sign in to is never touched.
- Only a **verified** email claims. An unverified match falls through to ordinary just-in-time provisioning.
- The email of a pending account cannot be removed (it is the only way in); it can be changed.
- A pending account cannot be created on an instance without OIDC (`422 sso_not_configured`): nobody could ever enter it.

### OIDC users have no password

OIDC-provisioned users have no password hash. A local login attempt for such a user fails with the exact same `401` as a wrong password — indistinguishable, preserving the no-probing property of local login. Kanso stores only the issuer, subject and profile fields (username, name) — no tokens or secrets ever persist in the database or logs.

### Session parity

A session opened via OIDC is indistinguishable from a local one: logout, `/myself` and attribution of writes all behave identically.

## Public spaces

A site admin can open a space so that anyone can read it **without an account**. The switch is per space and off by default; every existing, new and imported space starts private.

### Turning it on

`PUT /projects/{projectKey}/public-read` with `{"publicRead": true}` (or `false` to close it).

- Only a site admin may call it, only from a browser session (an API token gets `403 session_required`), and never on a space owned by a KansoProject resource (`409 managed_by_cr`).
- Setting the current value changes nothing.
- Every change emits one `project.public_read_changed` event and logs `space read access changed` with the space, the value and who did it.
- Every `Project` body carries `publicRead`.

### Nothing secret goes public with it

Before a space opens, `POST /projects/{projectKey}/public-read/assess` (site admin, browser session) scans everything it would publish against the publication rules, and lists each finding by location — never the matched text. The scan covers every issue without a security level (its summary, description, labels, fixVersions, components, sprint history, comments, attachment names, declared media types and text-like contents) plus the space's versions, components, sprints, board, hierarchy levels and name.

- Turning a space public is refused with `409 import_running` while any import run is in progress. An import never writes into a public space — one that names a public space is refused with `409 import_target_public`.
- The flip re-runs the scan and answers `409 publication_findings` while any finding is not named in the body's `acknowledge` array (the findings' fingerprints). With every finding acknowledged, the space opens and emits one `publication.acknowledged` beside `project.public_read_changed`.
- A fingerprint binds its location, so the same secret written somewhere new needs a new acknowledgement.
- Closing a space never scans.

Once a space is public, every write that would publish text in it is scanned for secrets before it commits.

### What the flag grants

`browse` and nothing else, to every viewer except an installed app: an anonymous visitor, a guest, and a member who holds no grant in that space. Commenting, editing and every other action still come from the space's permission scheme. Apps read a space only through their install's grants, flag or not.

**Security levels still apply.** An issue that carries a security level is never public. Use a level for anything the internet must not read, such as an embargoed security report.

### What an anonymous visitor can read

Only a fixed list of reads, and only while at least one space is public:

- the space list and spaces, versions, components and hierarchy levels;
- issues, the GET form of JQL search, comments, history, links, children, ancestors and trees;
- attachments and their bytes;
- boards and sprints;
- the issue-type, priority, resolution and link-type vocabularies.

Each answers only what a public space shows. Everything else — `/myself`, the user directory, fields, questions and answers, records, worklogs, watchers, notifications, every write, `POST /search/jql` and `/mcp` — answers `401` exactly as before. People appear by username and display name; their email addresses are never shown to an anonymous visitor, and neither are custom-field values.

### Credentials, caching and the budget

- **A presented credential is never anonymous.** A request that carries any `Authorization` header or a `kanso_session` cookie, valid or not, is judged as a signed-in request: a bad one is `401`. A browser holding a stale session cookie must log out (`POST /auth/logout`, which clears it) before it can read anonymously.
- **Caching.** Every response of a listed read carries `Vary: Authorization, Cookie` (the one exception is the plain `401` a caller without a credential gets while no space is public, which is unchanged), and anonymous responses carry `Cache-Control: no-store` (inline images keep `private, max-age=3600`). Closing a space stops new reads at the next request; it cannot recall what was already delivered, and in S3 mode a presigned download URL stays valid until it expires.
- **The budget.** Anonymous reads are limited per `web` replica by `KANSO_PUBLIC_RATE` (default 1200 per rolling minute; over it, `429 rate_limited` with `Retry-After`) and by `KANSO_PUBLIC_CONCURRENCY` (default 32 at once; over it, `429 rate_limited` with `Retry-After: 1`). Signed-in requests are never counted. `KANSO_PUBLIC_RATE=0` closes the anonymous path completely while the flag keeps widening `browse` for accounts. See [Configuration](configuration.md#core).
