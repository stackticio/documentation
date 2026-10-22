---
title: Workflows
description: Define issue types and versioned workflows with guarded transitions and post-functions, and move issues through them safely.
---

A workflow is the lifecycle an issue follows: named states, named transitions between them, guard expressions that decide when a transition is allowed, and post-functions that act when it runs. Published workflow versions never change, and every issue records the exact version it lives under, so you can evolve a workflow in a live system without silently rewriting issues that are already in flight.

All examples assume you are logged in and passing the session cookie (`-b cookies.txt`), with the same `$KANSO_URL` as in [Projects, issues and fields](projects-issues-fields.md#authentication).

## Issue types

Every issue has a type. A fresh Kanso ships with one seeded type, **Task**, marked `isDefault: true`; an issue created without a `type` gets the default.

```bash
# create a type
curl -b cookies.txt -X POST "$KANSO_URL/api/v1/issuetypes" \
  -H "Content-Type: application/json" \
  -d '{"name": "Bug"}'

# list types
curl -b cookies.txt "$KANSO_URL/api/v1/issuetypes"
```

The create response carries an immutable server-minted id (`it_<n>`, e.g. `it_2`). Use that id in the `{fields}` envelope when creating an issue: `{"fields": {"project": "KAN", "summary": "…", "type": "it_2"}}`. A duplicate type name returns `409`; an unknown type id on issue creation returns `422`.

## Workflows

A workflow definition has three parts:

- `states`: each with a stable `id` (lowercase, e.g. `todo`, `review`), a display `name`, and a `category` (`todo` | `in_progress` | `done`). Boards and reports group by category, never by name.
- `initialState`: the state id new issues start in.
- `transitions`: each with an `id`, `name`, a target state `to`, and optionally `from` (source state ids; omitted or empty means the transition is global, available from any state), `conditions`, `validators` and `postFunctions`.

### Creating a workflow (publishes version 1)

```bash
curl -b cookies.txt -X POST "$KANSO_URL/api/v1/workflows" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Review flow",
    "definition": {
      "states": [
        {"id": "todo",        "name": "To Do",       "category": "todo"},
        {"id": "in_review",   "name": "In Review",   "category": "in_progress"},
        {"id": "done",        "name": "Done",        "category": "done"}
      ],
      "initialState": "todo",
      "transitions": [
        {
          "id": "submit", "name": "Submit for review",
          "from": ["todo"], "to": "in_review",
          "conditions": ["int(fields.cf_1) >= 5"]
        },
        {
          "id": "approve", "name": "Approve",
          "from": ["in_review"], "to": "done",
          "postFunctions": [
            {"type": "set_field", "fieldId": "cf_1", "value": 0},
            {"type": "webhook", "url": "https://example.com/hooks/kanso"}
          ]
        }
      ]
    }
  }'
```

The response (`201`) is the workflow with `id` (`wf_<n>`) and `currentVersion: 1`. The definition is validated **before** anything is stored: structural problems (an unknown `initialState`, a transition targeting a missing state, duplicate state ids) and CEL expressions that fail to compile all return `422` with the offending path in `details`. An invalid guard is never stored.

Read workflows:

```bash
curl -b cookies.txt "$KANSO_URL/api/v1/workflows"                    # list, with currentVersion
curl -b cookies.txt "$KANSO_URL/api/v1/workflows/wf_2"               # current version's definition
curl -b cookies.txt "$KANSO_URL/api/v1/workflows/wf_2/versions/1"    # one specific published version
```

### Publishing a new version: immutability and status mapping

Published versions are never edited in place. To change a workflow you publish a **new** version:

```bash
curl -b cookies.txt -X POST "$KANSO_URL/api/v1/workflows/wf_2/versions" \
  -H "Content-Type: application/json" \
  -d '{
    "definition": { "…": "the full new definition" },
    "statusMapping": { "in_review": "todo" }
  }'
```

If the new definition removes states that issues currently occupy (under any binding of this workflow), the request **must** include a `statusMapping` covering every removed in-use state; otherwise the publish is rejected with `409` listing the states, and nothing changes. When a mapping is given, every affected issue is moved to its new status in the same transaction as the publish and moved onto the new version, and each status change lands in that issue's changelog.

A mapping may cross the done boundary. If the new definition has no done-category state at all, every legal mapping out of a removed done state must cross it, so the publish records the issue's **resolution** change in the same changelog group rather than refusing the mapping. A new definition whose `initialState` is in the done category is refused (`422`): an issue may not be created already resolved by accident. Earlier versions remain readable and unchanged forever.

### Binding a workflow to a project and type

Any (project, issue type) pair without an explicit binding uses the default workflow's current version. To bind a specific workflow:

```bash
curl -b cookies.txt -X PUT "$KANSO_URL/api/v1/projects/KAN/issuetypes/it_1/workflow" \
  -H "Content-Type: application/json" \
  -d '{"workflowId": "wf_2"}'
```

Binding affects **new issues only**: they start at the initial state of the bound workflow's current version. Existing issues are untouched.

## Why editing a workflow is safe

Every issue carries `workflow: {id, version}`, the exact workflow version it was created or last transitioned under. Guards and available transitions are evaluated against that version, not against whatever the workflow looks like today.

This is what makes workflow editing safe in a live system:

- Publishing a new version never rewrites in-flight issues. They keep behaving under the version they are on. (The one deliberate exception is a publish whose `statusMapping` you explicitly gave to move issues out of removed states.)
- Binding a different workflow to a project and type can never orphan an issue's status: existing issues keep their workflow.
- An issue catches up naturally: when it executes a transition, it moves to the workflow's current version, and its new status is guaranteed valid in that version.

## Transition guards (CEL)

Transitions carry two kinds of guard, both written as CEL expressions over a frozen context of `issue` and `fields`:

- **`conditions`** decide whether a transition is *available*. All conditions must evaluate true. Example: `int(fields.cf_1) >= 5`.
- **`validators`** are re-checked *inside* the execute transaction; any validator that is false rejects the execution with `409` and nothing changes.

Guards **fail closed**. A CEL expression that doesn't compile is rejected with `422` at publish time and never stored; one that errors at runtime (say it references a field the issue doesn't have) makes the transition unavailable, or rejects the execute. It never opens the gate.

## Post-functions

Post-functions are actions performed when a transition executes, in listed order. Two kinds exist:

- **`set_field` (synchronous).** `{"type": "set_field", "fieldId": "cf_1", "value": 0}` sets a registered custom field (or `null` to clear it) *inside the transition transaction*. The `fieldId` may also be the system field `resolution` (`{"type": "set_field", "fieldId": "resolution", "value": "res_2"}`), which is how a workflow declares *how* a transition closes an issue. Publish refuses a `set_field` on `resolution` whose transition does not target a done-category state, and refuses a value that is neither `null` nor a known, unarchived `res_<n>`. A post-function wins over a transition screen carrying the same field, so a workflow author who wants the screen to decide simply does not declare it. The transition produces exactly one issue write: one version bump and one changelog group containing both the status event and the field events. If the transition is rejected, no post-function effect exists.
- **`webhook` (asynchronous).** `{"type": "webhook", "url": "https://…"}` enqueues a job in the same transaction as the transition, so the job exists if and only if the transition committed. The URL is POSTed a JSON payload with `event` (`"issue.transitioned"`), the issue, `transitionId`, `from`/`to` state ids, `at`, and the post-transition issue `version`. Delivery is at-least-once with retries on failure.

Post-functions are validated at publish time like everything else: an unregistered `set_field` fieldId, a value that doesn't match the field's registered type, or a webhook URL that isn't `http(s)` all return `422` with the post-function's path in `details`, and nothing is stored.

## Transitioning an issue

### List what's available

```bash
curl -b cookies.txt "$KANSO_URL/api/v1/issues/KAN-1/transitions"
```

Response:

```json
{
  "items": [
    {
      "id": "submit",
      "name": "Submit for review",
      "to": "in_review",
      "toName": "In Review",
      "toCategory": "in_progress",
      "isAvailable": false,
      "unavailableReason": "condition_failed"
    }
  ]
}
```

The list contains all transitions leaving the issue's current state (plus global transitions), each with `isAvailable` after evaluating its conditions against the issue's workflow version. When unavailable, `unavailableReason` is `condition_failed` (a condition evaluated false) or `condition_error` (a condition errored at runtime, so the gate stays closed).

### Execute

Execution is checked for concurrent changes like every issue write: send the issue's current `version` in `If-Match`.

```bash
curl -b cookies.txt -X POST "$KANSO_URL/api/v1/issues/KAN-1/transitions?returnIssue=true" \
  -H "Content-Type: application/json" \
  -H "If-Match: 3" \
  -d '{"transitionId": "submit"}'
```

The whole execution is one transaction: conditions and validators are re-checked inside it, the status changes, the issue version bumps by exactly 1, the changelog group is appended (with `fieldId: "status"`, state ids in `from`/`to` and state names in `fromString`/`toString`), synchronous post-functions apply, asynchronous jobs are enqueued, and the issue moves to the workflow's current version. The default success response is `204`; with `?returnIssue=true` you get `200` and the updated issue.

Failure modes: a stale `If-Match` or a failing condition or validator returns `409` and changes nothing: no status change, no changelog group, no webhook job. A `transitionId` that doesn't leave the issue's current state returns `404`.

If a form is stored for the transition (operation `transition:<id>`), the request body may also carry a `fields` map, validated against that form and applied atomically with the status change. See [Forms](forms.md).
