---
title: Forms
description: Declare which fields a create, edit or transition screen asks for, and have the server enforce exactly what every client shows.
---

A form in Kanso is one declarative definition with three consumers: the web interface renders it, agents and API clients discover it so they can fill it in without guessing, and the server **enforces** it inside the write transaction. Because all three read the same definition, what a client sees as required, hidden or read-only is exactly what the server will enforce. The two can never drift apart.

All examples assume you are logged in and passing the session cookie (`-b cookies.txt`), with the same `$KANSO_URL` as in [Projects, issues and fields](projects-issues-fields.md#authentication).

## How forms are resolved

Resolution is deliberately flat: at most **one form per (project, issue type, operation)**. The operation is `create`, `edit`, or `transition:<transitionId>` (a form shown when executing that workflow transition). There is no scheme graph to untangle.

When nothing is stored for a combination, an **implicit default form** applies: `summary`, `description`, `assignee`, `priority`, `labels`, `dueDate`, `fixVersions`, `components`, then all registered custom fields, with no conditions. (Artifact fields are left off the default create form, because they cannot be written on create.) Responses mark where a form came from with `source: "stored"` or `source: "default"`. The default imposes no constraints beyond the field registry, so projects without stored forms behave exactly as if forms didn't exist.

## The form document

A form is a list of sections, each holding items. Store one with a whole-document PUT:

```bash
curl -b cookies.txt -X PUT "$KANSO_URL/api/v1/projects/KAN/issuetypes/it_1/forms/create" \
  -H "Content-Type: application/json" \
  -d '{
    "sections": [
      {
        "title": "Basics",
        "items": [
          {"fieldId": "summary", "required": true},
          {"fieldId": "description", "helpText": "What and why."}
        ]
      },
      {
        "title": "Planning",
        "collapsed": true,
        "items": [
          {
            "fieldId": "cf_1",
            "required": true,
            "visibleWhen": "int(fields.cf_1) >= 0",
            "default": 1,
            "width": "half"
          }
        ]
      }
    ]
  }'
```

Each item supports:

| Property | Meaning |
|---|---|
| `fieldId` | A registered custom field id (`cf_<n>`) or a system field: `summary`, `description`, `assignee`, `priority`, `labels`, `dueDate`, `fixVersions`, `components`, `resolution`. |
| `required` | Must be present on write. Forms can only be *stricter* than the field registry, never looser. |
| `visibleWhen` | CEL over `{issue, fields}`; absent means always visible. A hidden field cannot be written. |
| `readonlyWhen` | CEL; absent means editable. |
| `default` | Literal default applied on create when the field is absent. |
| `defaultCel` | Computed default (CEL). Mutually exclusive with `default`. |
| `helpText` | Shown to the person (or agent) filling the form. |
| `width` | `full` (default) or `half`, a layout hint for the renderer. |

The PUT is validated before anything is stored: an unregistered field id, a CEL expression that doesn't compile, `default` and `defaultCel` on the same item, or a `transition:<id>` operation that doesn't name a transition of the bound workflow's current version all return `422` with the offending path in `details`, and the previously stored form (or the default) stays in effect. An artifact field cannot be placed on a `create` form (`field_not_placeable`) and takes no `default` or `defaultCel` on any form (`field_default_not_applicable`). Each successful PUT increments the form's `version`. Storing a form needs the `admin_project` permission on the project.

Read a form back with GET on the same path. It returns the stored document, or the implicit default with `source: "default"`:

```bash
curl -b cookies.txt "$KANSO_URL/api/v1/projects/KAN/issuetypes/it_1/forms/create"
```

## Server-side enforcement

The resolved form's rules are enforced **inside the write transaction** for issue create, issue update, and transition-with-fields. No client can bypass them; a violation returns `422` and changes nothing: no issue row, no changelog group, no webhook job.

Concretely:

- **Required**: creating (or editing) without a required field, or setting it to `null`, is rejected with the path in `details` (e.g. `/fields/cf_1`).
- **Read-only**: a PATCH that changes a read-only field is rejected; changing other fields in the same form still works.
- **Hidden**: a write that sets a field whose `visibleWhen` resolved false is rejected as a hidden field, and that field is equally absent from `editmeta`.
- **Defaults**: on create, a defaulted field you omit gets its default applied and recorded in the issue's created changelog group.
- **Transitions**: if a form is stored for `transition:<id>`, `POST /issues/{issueKey}/transitions` accepts a `fields` map validated against it and applied atomically with the status change, in the same changelog group. A transition *without* a stored form accepts no fields at all: passing any is `422`, and nothing is silently ignored.

Form enforcement is additive to the field registry: a form can never make an unregistered field legal or loosen a type check.

CEL in forms **fails closed, without data loss**: a `visibleWhen` that errors at runtime resolves to *visible*, a `readonlyWhen` that errors resolves to *read-only*, and a `defaultCel` that errors yields no default. There is never an open bypass, and never a hidden field silently dropped.

## Discovery: createmeta, editmeta, preview

These endpoints return the form *resolved*, with conditions evaluated and defaults computed, as a flat field list in form order. What they report is exactly what the write path enforces for the same values.

**Create metadata**: the create form evaluated over an empty draft, for building a create dialog or letting an agent know what to send.

```bash
curl -b cookies.txt "$KANSO_URL/api/v1/projects/KAN/issuetypes/it_1/createmeta"
```

**Edit metadata**: the edit form evaluated against one issue's current values.

```bash
curl -b cookies.txt "$KANSO_URL/api/v1/issues/KAN-1/editmeta"
```

**Preview**: re-evaluate a form with draft values overlaid on current values. The web interface calls this as the user types, so conditional visibility on screen is the same server evaluation the write will enforce.

```bash
curl -b cookies.txt -X POST "$KANSO_URL/api/v1/forms/preview" \
  -H "Content-Type: application/json" \
  -d '{
    "projectKey": "KAN",
    "typeId": "it_1",
    "operation": "edit",
    "issueKey": "KAN-1",
    "values": {"cf_1": 7}
  }'
```

`issueKey` supplies current values for edit and transition forms; `values` are the draft overlay. Both are optional for a create preview.

All three return the same shape:

```json
{
  "projectKey": "KAN",
  "typeId": "it_1",
  "operation": "edit",
  "source": "stored",
  "fields": [
    {
      "fieldId": "cf_1",
      "name": "Story points",
      "type": "number",
      "required": true,
      "visible": true,
      "readonly": false,
      "default": 1,
      "helpText": "…",
      "width": "half",
      "section": "Planning"
    }
  ]
}
```

`fields` is in form order with sections flattened (each field names its `section`). For custom fields, `type` is the field's registered type (`text`, `number`, `select`, `multi_select`, `date`, `user` or `artifact`); system fields carry their own kinds (`user`, `priority`, `labels`, `date`, `versions`, `components`, `resolution`) so a renderer can pick the right control.

The registry-backed kinds (`versions`, `components`, `resolution`) deliberately do **not** embed their options: the picker's source is `GET /projects/{key}/versions`, `GET /projects/{key}/components` and `GET /resolutions`, the same discovery path an agent uses. Only the select kinds carry an inline `options` array.

Two rules matter for set-valued fields (`components`, `fixVersions`, `labels`). An empty array is **not** a value: it clears the field, so it can never satisfy a `required` check. And a stored `default` naming a registry id is validated when the form is PUT, then silently dropped at write time if that id has since been deleted, so a deleted registry row can never block issue creation or a transition.
