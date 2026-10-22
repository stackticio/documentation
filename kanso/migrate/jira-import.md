---
title: The Jira importer
description: Import a Jira backup into Kanso — assess it read-only, decide who becomes whom, run an idempotent import, and know exactly what is and is not carried over.
---

Kanso imports a Jira backup — a ZIP containing `entities.xml` (Jira's OfBiz entity XML, stream-parsed), or a bare `entities.xml` file — in two steps: first a **read-only assessment** that tells you exactly what would and would not survive the move, then an **idempotent, resumable import run**. Nothing is ever silently dropped: every construct in the archive that is not imported appears in the report's `unmapped` list with a kind, reference, reason and fallback. For the strategy behind it — what moves and whose limit applies to what does not — see [Moving from Jira](jira-migration.md).

Both Jira backup dialects are understood: **Cloud** exports (Settings → System → Backup manager; issues carry `projectKey` + `number`, usernames are opaque account ids) and **Server/DC** XML backups (issues carry a `key` attribute, entities reference user keys).

**In the UI:** the sidebar's **Migration** entry is this whole flow — upload the zip, review the report, decide who becomes whom (the report's email and display-name suggestions are pre-selected, Atlassian app accounts default to skip), then import and watch the run.

All endpoints live under `/api/v1` and require an authenticated session (see [Users and authentication](../run/users-and-auth.md)). The importer is a site-admin surface: only a site admin can assess, run or list imports. An uploaded archive may be up to 8 GiB; a larger one is refused with `413 archive_too_large`.

## Step 1: assess

`POST /import/assess` uploads the archive and returns the fidelity report. It is a dry run: **nothing is written**.

```bash
curl -b cookies.txt -X POST https://kanso.example.com/api/v1/import/assess \
  -F archive=@jira-backup.zip
```

A `200` response is an ImportReport with three parts:

- `counts` — per-entity counts: `source` (found in the archive), `imported` (always 0 for assess), `skipped`.
- `unmapped` — every construct that would not import, each with `kind` (e.g. `custom_field_type`, `priority`, `attachment`, `board`, `issue_link`, `workflow_condition`, `app_data`), `jiraRef`, `reason`, and `fallback` (what the importer would do instead, e.g. `"mapped to medium"`, `"synthesized open transitions"`, `"reported only"`).
- `users` — every Jira user referenced in the archive, with what a person needs to decide the mapping: `email` and `displayName` from the archive (Cloud usernames are opaque account ids, so these are what you actually recognize), `bot` (Atlassian app accounts, e.g. `*@connect.atlassian.com`), and `suggested` (a Kanso user when exactly one active username equals the email local part or the full Jira username — a **report-only hint** the run never applies). `matched` is set when the username matches an existing Kanso username exactly — that one the run does apply when you give no explicit decision. Everything else is a human decision.

An upload that is not a parsable Jira backup returns `422`.

## Step 2: run

`POST /import/runs` takes the same archive plus your mapping decisions and runs asynchronously. `userMapping` is a JSON object (stringified, because the request is multipart) mapping each Jira user key/accountId to one of:

- `"u_<n>"` — attribute to that existing Kanso user,
- `"create"` — mint a **placeholder account**: username from the email local part (fallback: display name), collision-suffixed like OIDC provisioning, never adopting an existing account; placeholders are passwordless — they hold history but cannot log in,
- `"skip"` — import their content with `null` attribution.

```bash
curl -b cookies.txt -X POST https://kanso.example.com/api/v1/import/runs \
  -F archive=@jira-backup.zip \
  -F 'userMapping={"jsmith": "u_2", "jdoe": "create", "old-bot": "skip"}'
```

Responses:

- `202` — accepted, with an ImportRun body (`id`, `state` of `running`/`completed`/`failed`, `startedAt`, `finishedAt`, `error`, and the evolving `report`).
- `409` — another import run is already active.
- `422` — unparsable backup or bad mapping.

Poll the run until it completes, and list past runs:

```bash
curl -b cookies.txt https://kanso.example.com/api/v1/import/runs/1
curl -b cookies.txt https://kanso.example.com/api/v1/import/runs
```

## Idempotency and resume

Every imported entity is keyed through a Jira-id → Kanso-id mapping table, so re-running the same archive creates **nothing** new: the run completes with `imported: 0` and the counts show everything as `skipped`. An interrupted run resumes the same way — just POST the archive again and already-imported entities are skipped, never duplicated. Only one run can be active at a time (a concurrent second run gets `409`).

## What gets imported

- **Projects** — issues keep their Jira keys and numbers (e.g. `JIM-42` stays `JIM-42`).
- **Issue types.**
- **Custom fields** — typed values into Kanso's field registry, auto-registered with the Jira field names. Supported Jira types: text/textarea → text, float/number → number. Any other type (e.g. cascading select) is not imported; the field lands in `unmapped` and its values are absent from issues.
- **Statuses** — each imported project gets one workflow (named `Imported: <KEY>`) whose states are the Jira statuses, with state categories taken from Jira's status categories, and an open transition into every state. Jira's workflow definitions — transitions, conditions, validators and post-functions — are **not translated**, and the report says so (see [Workflows](../work/workflows.md) for what a Kanso workflow can express).
- **Issues with system fields** — summary; description as **plain text**, exactly as Jira had it (Jira's markup is not converted); priority mapped by name onto Kanso's seeded scale (an unmapped name like "Blocker" falls back to medium and is reported); labels; due date; assignee and reporter via the user mapping.
- **Resolutions** — Jira's `Resolution` values map onto Kanso's global resolution registry by name (case-insensitively), so "Fixed" and "Won't Do" land on the seeded rows and a genuinely new name is added at the end of the order. Per issue, Kanso stores a resolution **exactly while the issue's status is done-category** — that coupling is a product promise, so the import does not carry Jira's drift:
  - a done issue with a mappable resolution imports as-is;
  - a done issue with none (or an unmappable one) takes the site default, disclosed once in aggregate;
  - a **non-done** issue carrying a resolution is imported **without** it, disclosed per issue by key, plus one line stating the total;
  - a resolution id with no matching `Resolution` element is disclosed per issue and never fails the issue it rode in on.

  `resolutiondate` becomes `resolvedAt` (falling back to the issue's `updated`), and imported resolution entries in the change history are re-encoded to Kanso's `res_<n>` ids so one timeline never carries two encodings. Jira's `iconurl` is the only Resolution field dropped.
- **Components** — every `Component` element becomes a per-project component row, keyed idempotently by (project, name), so a component a team created by hand before the import is **adopted rather than duplicated**. Issue↔component links come from the `IssueComponent` NodeAssociation only; Jira's legacy denormalised `Issue@component` attribute is **disclosed, never imported** — two sources for one fact is how an importer starts guessing. The component `lead` is imported through the same user mapping as assignee/reporter and is **display only**: Jira's per-component `assigneetype` rule (auto-assign to the component lead) is refused, not simulated, and is disclosed once with a count. `Component.url` has no reader in Kanso and is disclosed per component. Every association that cannot be written (no such component in the archive, a component that did not import, a cross-project reference) is disclosed and never fails the issue it rode in on.
- **Fix versions** — versions and fix-version links are imported; affects-version links are reported.
- **Comments.**
- **Full change history** — with the original authors and timestamps.
- **Issue links** — mapped by name onto Kanso's link-type registry (Jira's `Cloners` → `Clones`, `Duplicate` → `Duplicates`); Jira's link direction is preserved (source = outward). Subtask and epic links become the child issue's **parent** instead of link rows. Links of a type with no registry equivalent (e.g. Polaris) are reported per type, not imported.
- **Attachments** — a `FileAttachment` entry whose file is present in the archive imports with its original author (per the user mapping) and original timestamps, and is created directly `available` — no quarantine job runs. A `FileAttachment` whose file is missing from the archive, or whose file is empty or exceeds the upload limit, imports nothing and lands in `unmapped`. One limitation: imported attachment bytes always go to the built-in PostgreSQL store, even when S3 object storage is configured.

## What is reported, not imported

These appear in `unmapped` with a reason, and their source counts are reported faithfully, but they are not written. The constructs a migrating team actually asks about get their own kinds with the product truth stated plainly — `group`, `permission_scheme`, `project_role`, `watcher`, `voter`, `version`, `worklog` — instead of hiding in generic `app_data`:

- Boards, sprints, and rank
- Watchers and voters
- Groups, permission schemes, and project roles. Kanso has its own permission engine — groups, project roles, permission schemes and security levels — but the importer does not translate Jira's. Spaces the import creates get the default permission scheme like any new space (as seeded, every logged-in user may browse and work in them, and only the Administrators role administers them): bind a restrictive scheme per space before inviting users, and configure access in Kanso after the import.
- Affects versions and worklogs (fix versions and components are imported)
- App data (activeobjects)
- Automation rules

## Import powers

The import path is allowed to do things the normal API forbids, and it is the *only* path that can:

- Imported issues, comments and history events carry their **original Jira timestamps and mapped authors verbatim**. The normal API always stamps the current time and the session user; the import is the only way to set these.
- The import fires **no webhooks** and enqueues no background jobs for the imported writes.
- **No guessed identities**: a Jira author with no mapping entry and no exact-username auto-match imports with `null` author/assignee/reporter — content is never attributed to the wrong person.

After the run, imported issues are normal issues: editable, transitionable and commentable through the regular API.
