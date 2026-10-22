---
title: Moving from Jira
description: Plan a move from Jira to Kanso — what the importer carries over, what stays behind and whose limit that is, and how the import protects your data.
---

Kanso imports a Jira backup directly: projects, issues with their fields, comments, full change history with the original authors and timestamps, attachments, issue links, resolutions, components and fix versions. Before anything is written, it tells you exactly what will and will not move, so the migration is a decision you make with the facts in front of you rather than a risk you discover afterwards. This page is the strategy; for the hands-on walkthrough — endpoints, the Migration dialog, resume — see [The Jira importer](jira-import.md).

## What the importer does today

Both Jira backup dialects (Cloud and Server/Data Center) are understood. The importer writes projects, issues with system and custom fields, comments, full change history, attachments, issue links (subtask and epic links become parents), resolutions, components and fix versions, and maps Jira users to Kanso accounts — existing ones, or placeholder accounts it creates. You drive it from the sidebar's **Migration** dialog or through the API.

Boards, sprints and rank, watchers, groups, permission schemes and project roles, and worklogs are disclosed in the report, not written.

## What moves, and whose limit it is

Two different limits decide what reaches Kanso.

**Jira's own export.** What Jira does not put in its backup cannot move to any destination — including Atlassian's own Cloud ↔ Data Center migrations. Per Atlassian's export documentation:

| Does **not** move | Why |
|---|---|
| Marketplace-app data: **Tempo** worklogs, **Structure** hierarchies, **Xray** tests, **ScriptRunner** scripts | Third-party app data is explicitly excluded from the backup |
| Jira Automation rules, Assets for JSM, Opsgenie-powered JSM features, Product Discovery views | Explicitly excluded from the backup |

A team living inside Tempo or ScriptRunner leaves that data behind wherever it goes. That is a fact about Jira's export, and saying so up front is the point.

**Kanso's importer.** Of what the backup does contain, this is what is written and what is only reported:

| Imported | Reported, not written |
|---|---|
| Projects — issues keep their Jira keys | Boards, sprints and backlog rank |
| Issue types | Watchers and voters |
| Custom fields of text and number types | Other custom field types |
| Statuses, as one workflow per imported project | Jira workflow transitions, conditions, validators and post-functions |
| Issues: summary, description, priority, labels, due date, assignee, reporter | Groups, permission schemes and project roles |
| Resolutions, components and fix versions | Affects versions |
| Comments and full change history | Worklogs |
| Issue links | App data |
| Attachments present in the archive | |

[The Jira importer](jira-import.md) lists the exact rules for each.

## How Jira data maps

Kanso's data model mirrors Jira's semantics, so most of the mapping is mechanical rather than interpretive:

| Jira construct | Kanso | Fidelity |
|---|---|---|
| `customfieldvalue` typed values | Field registry + typed values | Mechanical for text and number fields; other types are reported, not imported |
| Changelog items (`fieldId, from, to`) | History rows | **History imports as first-class data**, with original authors and timestamps — not as a text dump |
| Statuses and their categories | Workflow states and state categories | One workflow per imported project, with an open transition into every state; Jira's workflow logic is reported, not translated |
| Resolutions | The global resolution registry | Matched by name; kept only while the issue is in a done-category status |
| Description text | Plain-text description | Imported verbatim; Jira's markup is not converted |
| `accountId` identity | User mapping | You decide who becomes whom; authorship is preserved |

## Extraction — the backup, not the API

Jira has a real export format, which makes API-crawling millions of issues the wrong design. Kanso stream-parses `entities.xml` from the backup ZIP: one atomic snapshot, no pagination, no rate limits, complete history.

**Not a migration path: CSV/Excel export.** It is capped at 1,000 issues from the Issue Navigator (Server default) and 10,000 via Cloud's async export. Fine for spot-checking, not for a real move.

## How the importer behaves

**Assess first.** Point the assessment at a backup and it emits the fidelity report *before* anyone commits: entity counts, which workflow logic will not carry over, which custom field types have no equivalent, which app data stays behind. **The report is the migration plan** — it turns migration from a risk into a decision you can make in an afternoon.

| Property | Why it works this way |
|---|---|
| **Import-only powers** | Original timestamps and authors are preserved, and **notifications and webhooks are suppressed entirely** — replaying a large backup must not fire an event for every imported issue into anyone's chat |
| **Idempotent and resumable** | A `jira-id → kanso-id` mapping table means re-running continues; it never duplicates |
| **Every run ends with a fidelity report** | Entity counts source-vs-imported, plus an explicit list of every construct that did not map. **Silence is not fidelity** |
| **Identity mapping has a human step** | Jira Cloud's privacy model hides email addresses, so `accountId → user` cannot always resolve automatically. Kanso auto-matches only on an exact username and suggests the rest; a person confirms. **Authorship is never silently guessed** |

**Out of scope**, stated so nobody plans around it:

- **Bidirectional live Jira ↔ Kanso sync.** That is a conflict-resolution product in itself. The pragmatic pattern is a one-way import, keeping the old Jira read-only.
- **Marketplace-app data** (Tempo and similar). Unmappable by definition — a documented boundary.
