---
title: Human answers
description: Ask a person a typed question on any ticket, wait for the answer without polling, and read it back as data with a permanent citation.
---

When an agent or a pipeline needs a decision from a person, it asks a question on the ticket the work is about. The question carries its own answer schema, the person answers on a plain page that uses none of the tracker's words, and the system that asked waits with one held read and then gets back a typed answer it can cite forever. Nothing has to be set up first, and nothing outside the question changes.

A question is an object on a ticket. It carries its answer schema — the items the person fills in, each with a kind, a label and the help text they read — and, once answered, the one answer: typed, canonical, with a permanent citation. Asking takes one call on any existing ticket in any space. It registers no field, stores no form, publishes no workflow and adds no issue type, and no other ticket anywhere sees anything. A file in the answer is an attachment whose SHA-256 the server computed and verified.

Keep the reversal in mind: the *system* asks and the *person* answers, and the person is usually not a tracker user at all.

All examples assume you are logged in and passing the session cookie (`-b cookies.txt`); see [Projects, issues and fields](../work/projects-issues-fields.md#authentication). A personal API token with write scope works the same way (`-H "Authorization: Bearer kat_…"`). `$KANSO_URL` is your Kanso server address. Ids such as `q_7`, `att_9` and `u_4` are minted by the server — read them from the responses; the ones below are illustrative.

## The loop in plain words

1. **Ask.** One `POST` on the ticket: the prompt, the items the answer consists of, optionally the files the person should look at and who should answer. The response carries the question's id and the link to hand over.
2. **The person answers** on the answer page: reads the prompt, fills the controls, adds a file if the answer is a file, presses one button. Once.
3. **The system waits** with `GET /questions/{id}/await` — one held request per minute at most — and then **reads the answer** with `GET /questions/{id}`: the values, typed and in schema order, with a permanent citation `<issueKey>/q_<n>`.
4. **Downstream** stores the citation where the answer was used and, if a file was part of the answer, verifies its bytes against the digest the server committed.

Nothing is set up beforehand and nothing is left behind afterwards except the question itself.

## Ask — one call

```bash
curl -b cookies.txt -X POST "$KANSO_URL/api/v1/issues/WEB-42/questions" \
  -H "Content-Type: application/json" \
  -H "Idempotency-Key: review-4471" \
  -d '{
    "prompt": "Do you accept the draft?",
    "detail": "Open the attached page, decide, and tell us why.",
    "schema": [
      {"id": "verdict",  "label": "Your verdict",                 "kind": "choice", "required": true,  "options": ["Accept", "Decline"], "help": "Pick one."},
      {"id": "concerns", "label": "Which of these need work?",    "kind": "multi",  "required": false, "options": ["Wording", "Layout", "Numbers"]},
      {"id": "notes",    "label": "Anything to add?",             "kind": "text",   "required": false, "help": "One or two sentences. This is what the asker reads first."},
      {"id": "score",    "label": "How confident are you, 1-10?", "kind": "number", "required": true},
      {"id": "final",    "label": "Is this the final version?",   "kind": "yesno",  "required": true},
      {"id": "signed",   "label": "The signed copy",              "kind": "file",   "required": false, "help": "If your answer is a file - a signed or corrected copy - add it here."}
    ],
    "context": ["att_9"],
    "assignee": "u_4"
  }'
```

```json
{
  "id": "q_7",
  "issueKey": "WEB-42",
  "prompt": "Do you accept the draft?",
  "detail": "Open the attached page, decide, and tell us why.",
  "schema": [ …the six items exactly as submitted, in order… ],
  "context": [ { "id": "att_9", "filename": "draft-page-3.png", "contentType": "image/png", "size": 48213, "sha256": "3a7bd3…" } ],
  "assignee": { "id": "u_4", "username": "reviewer", "name": "…", "active": true, "siteAdmin": false, "createdAt": "…" },
  "author":   { "id": "u_2", "username": "pipeline", "…": "the User shape" },
  "createdAt": "2026-09-03T09:12:41.118273Z",
  "state": "open",
  "answer": null,
  "withdrawnAt": null,
  "withdrawnBy": null,
  "citation": "WEB-42/q_7"
}
```

The link to hand to the person is `<origin>/answer/q_7` (the UI origin, without `/api/v1`). Their inbox at `/answers` lists it too, because the question names them. The response also carries `delivery`, which says whom the ask reached — see [Who is told](#who-is-told).

What the members mean:

| Member | Rule |
|---|---|
| `prompt` | Required, 1–500 characters. The headline the person reads. |
| `detail` | Optional, up to 20,000 characters. Rendered under the headline. |
| `schema` | Required, 1–20 items in the order the page shows them. Cannot be changed after the ask. |
| `context` | Optional, up to 20 ids of this ticket's own `available` attachments, shown to the person (images inline, everything else as downloads). Served back as `{id, filename, contentType, size, sha256}` in the order given. |
| `assignee` | Optional `u_<n>` of an existing, active, non-app user — who should answer — or omit it (or send `null`) for *anyone who can see the ticket*. Whether the assignee can see the ticket is not checked at ask time: visibility is decided when they read, so the question appears in their inbox the moment a grant lets them see it. |

Lengths count characters (Unicode code points), not bytes.

### The answer schema — one item per thing you want to know

Each item is exactly `{id, label, kind, required, help?, options?}`; an unknown member is refused.

| Member | Rule |
|---|---|
| `id` | `^[a-z][a-z0-9_]{0,31}$`, unique in the question — the key of this item in the answer |
| `label` | 1–120 characters — the control's label on the page |
| `kind` | One of the six below, exact lowercase |
| `required` | A boolean, **required** (no default — the asker states it) |
| `help` | Optional, up to 500 characters, rendered under the label in the asker's words |
| `options` | 1–50 unique strings of 1–120 characters; **required** for `choice` and `multi`, **refused** for every other kind (even `[]` or `null`) |

| Kind | The person sees | An answer value is |
|---|---|---|
| `choice` | A radio group | One of `options`, byte for byte |
| `multi` | Checkboxes ("several") | A non-empty array of distinct `options` entries |
| `text` | A text area | A string of 1–20,000 characters, never trimmed |
| `number` | A numeric input | A JSON number — `"7"` is refused |
| `yesno` | Two buttons | JSON `true` or `false` — `"yes"` and `1` are refused |
| `file` | "Add file" with drag-and-drop | `{attachmentId, sha256}` — an `available` attachment of this ticket whose stored digest equals the declared one ([below](#the-file-answer-a-digest-the-server-vouches-for)) |

None of these is a field type: the six kinds live on the question and add nothing to the field registry.

### What an ask does not do

Asking is communication, so it is permitted like a comment (`comment_add` on the ticket — a viewer who may comment may ask; an app declares `issues:comment`) and attributed to the caller as `author`. It changes **nothing about the ticket**: no field, no status, no version bump, no changelog item, no `If-Match`. The ticket reads exactly the same before and after; the question is the record, and the event `question.asked` carries the facts. The field registry, forms, workflows and issue types are neither read nor written, and every other ticket's forms are unchanged.

Every refusal has no effect and lists **all** the problems found:

| Response | When |
|---|---|
| `404 issue_not_found` | The ticket does not exist or the caller cannot see it — decided before the body is parsed, identical to `GET /issues/{key}` |
| `403 permission_denied` | Visible, but the permission scheme does not grant `comment_add` (the body names it) |
| `422 question_schema_invalid` | A schema item breaks a rule; `details[]` carries one entry per offence at `/schema/<i>/<member>` (`/schema` for a missing, non-array, empty or over-long schema) |
| `422 question_context_invalid` | A context id is malformed, names no attachment of *this* ticket (an attachment of a ticket the caller cannot see answers exactly like a nonexistent one), or is not `available` — at `/context/<i>` |
| `422 question_assignee_invalid` | `assignee` is not the `u_<n>` of an existing, active, non-app user — at `/assignee` |
| `422 validation_failed` | `prompt` or `detail` out of range (`/prompt`, `/detail`), malformed JSON, or a mix of the codes above |

`Idempotency-Key` is honoured and scoped to the ticket in the path: a retried ask with the same key on the same ticket returns the question as it reads now (`200`, even if it has been answered in between) instead of a second question; the same key on another ticket is another question. Bodies are not compared.

### Context: what the person looks at

Anything the person needs to see is an ordinary attachment of the same ticket — the three-step flow from [Attachments](../work/attachments.md), no cookie on the byte upload, no version bump — named in `context` once it is `available`:

```bash
curl -b cookies.txt -X POST "$KANSO_URL/api/v1/issues/WEB-42/attachments" \
  -H "Content-Type: application/json" \
  -d '{"filename": "draft-page-3.png", "size": 48213, "contentType": "image/png"}'
# → 201 {"id":"att_9","status":"pending","sha256":null,"uploadUrl":"/api/v1/attachments/att_9/upload?exp=…&sig=…",...}
curl -X PUT "<origin><uploadUrl>" -H "Content-Type: image/png" --data-binary @draft-page-3.png
curl -b cookies.txt -X POST "$KANSO_URL/api/v1/attachments/att_9/complete"      # 202, quarantined
curl -b cookies.txt "$KANSO_URL/api/v1/attachments/att_9"                       # poll until "status":"available"
```

Once a question names an attachment — in its context or, later, in a file answer — that attachment cannot be deleted for the life of the ticket ([below](#the-file-answer-a-digest-the-server-vouches-for)).

### With MCP

The same ask is one tool call (see [Connect an agent](./connect.md)):

```
ask_question  {"key": "WEB-42", "prompt": "Do you accept the draft?", "detail": "…",
               "schema": [ …the six items… ], "context": ["att_9"], "assignee": "u_4"}
              → the Question body above
```

`ask_question` is a write tool: a read-scope token does not see it and is refused `403 insufficient_scope` if it calls it. It takes no `Idempotency-Key` — an agent that needs replay safety calls `list_questions` for the ticket first. Refusals come back in-band with the REST code in the text (`question_schema_invalid`, `question_context_invalid`, `question_assignee_invalid`, `permission_denied`, `issue_not_found`, …).

## The person's side: the answer page

`/answer/q_<n>` is built for someone who is an expert in their own field and owes nothing to issue trackers.

- **No tracker vocabulary.** The words *issue, ticket, transition, workflow, status, resolution, field, form, changelog, version, hash, attachment id, JQL, project key* do not appear on it. The page says "A question for you", shows the `prompt` as the headline and the `detail` under it, lists the context files, and shows "asked by *name* · *when*". The ticket key appears once, muted, at the bottom — "ref WEB-42" — for phone support.
- **The schema is the form.** Each item renders as the plain control of its kind, in schema order, with the `help` text prominently under its label. Required items are marked; the single primary button — "Send answer" — stays disabled until they are filled and lists what is still needed in plain words ("Still needed: Your verdict").
- **Context files.** Images render inline; plain-text files (text, CSV, Markdown, JSON, up to 256 KB) render inline as text; everything else is a download with its name and size.
- **Files in the answer.** "Add file" uploads through the same three-step flow; once the upload is `available` the page reads the server-computed digest into the value — the browser never hashes. The person sees "✓ file received and verified"; the digest itself is not shown.
- **Working a queue.** When the question is one of several assigned to the person, the header says where they are ("3 of 12", in inbox order — oldest first). Cmd+Enter (Ctrl+Enter elsewhere) sends from any control.
- **After sending:** "Thank you — your answer was sent." with the committed values read back from the server, then "Next question →" — the oldest open question assigned to them, with how many are left — or "You're all caught up."
- **Something wrong with this question?** A small box that posts a comment on the ticket *without* answering. The asker sees it through notifications and events. The page never forces a wrong answer.
- **"I can't answer this."** Under the Send button, one quiet link opens a reason box (required). Sending it [declines](#decline) the question — a third, typed end the asker and any pipeline can act on — and moves to "Next question →" exactly as an answer does. The comment box stays for a conversation; a decline is for the record.
- **Already answered** when opened: the answer, read-only, and when it was given. **Withdrawn**: "This question was withdrawn." **Declined**: who declined, when, and the reason.

**The inbox is the working area.** **Questions for you** (`/answers`) reads every question that names the person and shows it by subject — the ticket, in the asker's words — open ones first and oldest first, with a progress line across the whole queue, "Continue →" to the next open one, and what they already answered or declined folded underneath each subject as history. The sidebar entry appears only while they have open questions. A guest lands here after signing in and is told to bookmark it; nothing on it is a board or a key.

Nothing on the page is specific to any question: it renders from the served schema. The ticket's own drawer shows every question of the ticket as a card (prompt, who should answer, state, the values once answered with a "file verified" chip) and carries the **Ask a question** builder — prompt, detail, items with a kind picker, context attachments, who answers, Send — which involves no issue types, forms or fields either.

### Who can answer

The person answering signs in — with a password or through single sign-on — but does not need to be a member of anything. A **guest** account holds only what a space grants it by name: "Guest of a space" in **People** makes an account that sees that one space, answers the questions sent to it, and lands on its questions. See [Users and authentication](../run/users-and-auth.md).

### Who is told

An ask tells the person asked: a `question_asked` entry in their bell and, by default, a mail carrying the prompt and the answer page link (`/answer/q_<n>`) when the instance has a mail relay and their account an address. An answer or a decline tells the asker (`question_answered` / `question_declined` in the bell; mail only if they turn it on). A withdrawal tells nobody. Each person chooses under **Notifications** (Off / Bell / Bell and email, everywhere or per space).

Every ask says whom it reached in `delivery`:

| `delivery` | Meaning |
|---|---|
| `assignee_notified` | The person can see the issue and the question waits in their inbox; a feed entry and mail follow as their own choices allow (which is not reported) |
| `assignee_cannot_see` | Nobody was told: they cannot see the issue. Get them access, or withdraw and ask someone who can |
| `no_assignee` | Nobody was named, so nobody was told |
| `asked_yourself` | You named yourself through a browser or password session. Ask through an API token to reach yourself |

An agent working through its owner's API token reaches its owner like anyone else.

## The system's side: wait, then read

### Wait

```bash
curl -b cookies.txt "$KANSO_URL/api/v1/questions/q_7/await?timeout=60"
# → 200 {"satisfied": false, "question": {…"state":"open"…}}      … call again …
# → 200 {"satisfied": true,  "question": {…"state":"answered","answer":{…}…}}
```

| Parameter | Meaning |
|---|---|
| `timeout` | Seconds to hold, an integer in `[0, 60]`, default 30. `0` evaluates once and answers. Above 60, a non-integer, or the parameter repeated is `422 await_timeout_range` — refused, never clamped. |
| `until`, `since` | Not parameters of this endpoint. Present at all — even empty — they are `422 await_condition_unknown` / `422 await_since_invalid`, never silently ignored. |

An admitted call **always answers `200`** with `{satisfied, question}`, where `question` is the same body `GET /questions/{id}` serves, re-read at return time, and `satisfied` is true exactly when that body's `state` is not `open` — answered, declined **or withdrawn** (a withdrawal is an answer to "will this be answered?"; a client that only wants answers reads `state`). A timed-out hold is a normal `satisfied:false`, not an error — call again. The server answers within a second of the answering, declining or withdrawing commit.

What the hold cannot hide: a question on a ticket the caller cannot see is the same `404 question_not_found` as a nonexistent or malformed id, decided *before* the parameters are validated and before any hold begins. Visibility and the credential are re-checked throughout the hold: lose access mid-hold, or have the ticket deleted, and the `404` arrives promptly; have the token revoked and the hold ends with `401`. Await writes nothing.

Holds are counted under the same limits as the issue-level await: at most 8 concurrent per credential, 16 per user and 256 per process (`KANSO_AWAIT_MAX_PER_CREDENTIAL`, `KANSO_AWAIT_MAX_PER_USER`, `KANSO_AWAIT_MAX_GLOBAL`), and an issue hold and a question hold of one credential count together. Over a cap: `429 await_limit` with a `Retry-After` that never overstates the wait; an instant check (`timeout=0`, or a question already ended) takes no slot. A 60 s hold needs a proxy read timeout of at least **90 s** in front of Kanso ([Install](../run/install.md) shows the annotation), and a rollout drops held connections — in both cases the client sees a transport error or a proxy-generated `504` and simply calls again.

### Read

```bash
curl -b cookies.txt "$KANSO_URL/api/v1/questions/q_7"
```

```json
{
  "id": "q_7",
  "issueKey": "WEB-42",
  "prompt": "Do you accept the draft?",
  "detail": "Open the attached page, decide, and tell us why.",
  "schema": [ …unchanged… ],
  "context": [ { "id": "att_9", "…": "…" } ],
  "assignee": { "id": "u_4", "…": "…" },
  "author": { "id": "u_2", "…": "…" },
  "createdAt": "2026-09-03T09:12:41.118273Z",
  "state": "answered",
  "answer": {
    "values": {
      "verdict":  "Accept",
      "concerns": ["Wording", "Numbers"],
      "notes":    "Two typos on page 3, otherwise fine.",
      "score":    8,
      "final":    true,
      "signed":   { "attachmentId": "att_10", "sha256": "9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08" }
    },
    "answeredBy": { "id": "u_4", "username": "reviewer", "…": "…" },
    "answeredAt": "2026-09-03T10:14:07.512345Z",
    "citation": "WEB-42/q_7"
  },
  "withdrawnAt": null,
  "withdrawnBy": null,
  "citation": "WEB-42/q_7"
}
```

`values` is canonical, so two people who meant the same thing produce identical bodies: exactly the schema's ids as keys, in schema order; an optional item nobody answered is present as `null`; a `multi` array is in the item's `options` order, whatever order it was sent in; numbers are stored as JSON numbers (`1e2` reads back as `100`). The `file` value is the verified content address — the attachment id and the digest the server computed when the upload was sealed and checked at write time. `answeredBy` is the person; `answeredAt` is the moment of the write; `answer.citation` equals the top-level `citation`, so a consumer holding only the answer object can still cite it.

### With MCP — ask, wait, read

```
ask_question    {"key": "WEB-42", "prompt": "…", "schema": [ … ], "assignee": "u_4"}
                → {"id": "q_7", "citation": "WEB-42/q_7", "state": "open", …}
await_question  {"id": "q_7", "timeout": 60}
                → {"satisfied": true, "question": {…}}          (or satisfied:false — call again)
get_question    {"id": "q_7"}
                → the Question body above, answer and citation included
list_questions  {"key": "WEB-42"}
                → {"items": [ …every open and answered question of the ticket, oldest first… ]}
```

`get_question`, `await_question` and `list_questions` are read tools — a read-scope token may call them. A held `await_question` is one request for its whole timeout and is charged **once** against the per-credential call ceiling, however long it holds; the hold caps above apply to it. There is deliberately **no** tool to answer or withdraw a question: the answering half of this loop is a person on the answer page, and a pipeline that must answer on someone's behalf uses the REST call below.

## Answering through the API

The page does this for the person; a pipeline or a demo does it directly:

```bash
curl -b cookies.txt -X POST "$KANSO_URL/api/v1/questions/q_7/answer" \
  -H "Content-Type: application/json" \
  -d '{"values": {"verdict": "Accept", "concerns": ["Numbers", "Wording"],
                  "notes": "Two typos on page 3, otherwise fine.", "score": 8, "final": true,
                  "signed": {"attachmentId": "att_10",
                             "sha256": "9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08"}}}'
# → 200 — the Question, state "answered", answer as shown above (concerns re-ordered to the options order)
```

**Who may.** With an `assignee`, only that user — and a site admin. Without one, anyone who can see the ticket, the asker included (a consumer that wants an independent answer checks `answer.answeredBy.id != author.id`). Anyone else gets `403 question_not_yours`. No permission is consulted beyond the visibility the `404` already decided; a site admin who cannot see the ticket gets the `404`, not a bypass.

**Once.** A question goes `open` → `answered`, `open` → `withdrawn` or `open` → `declined`, and nothing else. A second answer is `409 question_answered`, an answer after a withdrawal `409 question_withdrawn`, and an answer, withdrawal or decline after a decline `409 question_declined` — decided *before* the body is looked at, because nothing the caller sends can matter once the question has ended. Two concurrent answers yield exactly one `200` and one `409`. After the `200`, nothing on the question ever changes. To ask again, ask a new question; the old one stays citable.

**Typed.** Every violation is `422 question_answer_invalid` with one `details[]` entry per offending item at `/values/<id>` (`/values` when the object is missing, `/values/<key>` for an id the schema does not have), all listed, nothing written:

| Item | Refused |
|---|---|
| any `required: true` item | Absent or `null` (message `required`) |
| `choice` | Anything but one of `options` — case matters; a number; an array |
| `multi` | `[]`, a bare string, a duplicate, a value outside `options` |
| `text` | `""`, more than 20,000 characters, a non-string |
| `number` | A numeric string, a boolean, an array |
| `yesno` | `"yes"`, `"true"`, `1`, `0` |

`null` and *absent* are the only encodings of "no value" for an optional item — an empty array, an empty string and `{}` are refused, so "no value" has one spelling. `If-Match` is ignored on every question write; answering bumps no issue version and writes no changelog item — the event `question.answered` carries the answer.

## The file answer: a digest the server vouches for

When the answer is a file, three facts hold together:

1. **The digest is server truth, computed once when the upload is sealed.** `POST /attachments/{id}/complete` computes the SHA-256 of exactly the bytes `/content` will serve and stores it, for the built-in store and S3 alike. `Attachment.sha256` is `null` while pending, quarantined or rejected, and the lowercase hex digest once `available`. Nothing ever rewrites it, because nothing ever rewrites the bytes.
2. **The value is a verified content address.** A `file` value `{attachmentId, sha256}` is checked inside the write against the stored digest: the attachment must exist and be visible to the writer, belong to *this* ticket, be `available`, and the declared digest must equal the stored one exactly. Clients echo the digest the server served; they never hash.
3. **A referenced attachment cannot be deleted.** `DELETE /attachments/{id}` is `409 attachment_in_use` while any question of the ticket names it — in its context or in a file answer — with `details` naming each reference (`/questions/q_<n>/context/<i>`, `/questions/q_<n>/values/<id>`); nothing is deleted and `/content` keeps serving. Because a question cannot be changed and is kept when answered or withdrawn, that holds for the life of the ticket: such an attachment only goes with the ticket itself.

Answering with a file through the API — upload, seal, poll, read the digest, answer:

```bash
curl -b cookies.txt -X POST "$KANSO_URL/api/v1/issues/WEB-42/attachments" \
  -H "Content-Type: application/json" \
  -d '{"filename": "signed-draft.pdf", "size": 51200, "contentType": "application/pdf"}'
# → 201 {"id":"att_10","status":"pending","sha256":null,"uploadUrl":"…"}
curl -X PUT "<origin><uploadUrl>" -H "Content-Type: application/pdf" --data-binary @signed-draft.pdf
curl -b cookies.txt -X POST "$KANSO_URL/api/v1/attachments/att_10/complete"     # 202 — the server hashes the bytes here
curl -b cookies.txt "$KANSO_URL/api/v1/attachments/att_10"
# → {"id":"att_10","status":"available","size":51200,"sha256":"9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08",...}
# then POST /questions/q_7/answer with "signed": {"attachmentId": "att_10", "sha256": "9f86d0…"} as above
```

A refused file value is a `422` at `/values/<id>` with one of these codes, nothing written:

| Code | When |
|---|---|
| `artifact_malformed` | Not exactly `{attachmentId, sha256}`: a bare string, a missing or extra member, uppercase hex (never normalised), a non-canonical id such as `att_09` |
| `artifact_attachment_unknown` | No such attachment — also the answer for an attachment of a ticket the caller cannot see |
| `artifact_attachment_foreign` | The attachment belongs to another ticket (the message names it) |
| `artifact_attachment_unavailable` | The attachment is `pending`, `quarantined` or `rejected` |
| `artifact_hash_mismatch` | The declared digest is not the stored one |

An attachment uploaded before Kanso stored digests serves `sha256: null` until a file value first names it; at that point the server computes and stores its digest.

Verifying downstream is one download and one compare:

```bash
curl -b cookies.txt -L -o signed.pdf "$KANSO_URL/api/v1/attachments/att_10/content"   # -L: an S3 store answers 307
sha256sum signed.pdf    # must equal answer.values.signed.sha256
```

## The inbox and the ticket's list

```bash
curl -b cookies.txt "$KANSO_URL/api/v1/questions?assignee=me&state=open"     # my open questions, oldest first
curl -b cookies.txt "$KANSO_URL/api/v1/issues/WEB-42/questions"              # the ticket's questions, oldest first
```

- **The inbox** `GET /questions?assignee=me` lists every question naming the caller on a ticket the caller can see, ordered by `createdAt` then id — the order the answer page's "Next question →" follows, so the two never disagree. `assignee=me` is required and the only filter; `state` is `open` (the default), `answered`, `withdrawn`, `declined` or `all`; anything else is `422 validation_failed` at `/assignee` or `/state`. Questions for *anyone* are in nobody's inbox — they live on their ticket.
- **The ticket's list** `GET /issues/{key}/questions` returns `{items}` ordered by id: every question except withdrawn ones, which appear only with `includeWithdrawn=true` (exactly `true`, `false` or empty; anything else is `422`). An invisible ticket is `404 issue_not_found` before the parameter is looked at.

Neither list is paged.

## Ask several people at once

`POST /issues/{key}/question-groups` takes the ask body with `assignees` (1–20 user ids) instead of `assignee`, and creates one ordinary question per person under one group — all or nothing (`422 question_assignees_invalid` at `/assignees/<i>` names the person who cannot be asked, and nothing is created). Every member is a full question afterwards: its own link and inbox entry, its own answer, decline or withdrawal, its own events (`question.asked` fires once per member, each carrying `group: "qg_<n>"`).

`GET /question-groups/{id}` reads them back side by side — members in `assignees` order with canonical values, plus `summary {total, open, answered, withdrawn, declined}` counted on that read. The server computes **no agreement**: compare `questions[i].answer.values` yourself; a third reader on disagreement is a new ask citing the group. `GET /question-groups/{id}/await?timeout=` is ONE hold for the whole group, counted once under the await caps however many readers there are, and satisfied when no member is open. The group's citation `<issueKey>/qg_<n>` is permanent.

Plain asks and group asks share one `Idempotency-Key` space per ticket: a key first used by a plain ask is `409 idempotency_key_reused` on a group ask, and the reverse. Over MCP, `ask_question` with `assignees` does the same and returns the group; `get_question_group` and `await_question_group` are the two reads. In the ticket's drawer, pick several people in "Who answers" and the group renders as one card with a row per person.

## Decline

`POST /questions/{id}/decline {"reason": "…"}` is "I can't answer this", as data. Who may is exactly the answering rule: the assignee or a site admin, else anyone who can see the ticket (`403 question_not_yours` otherwise). The reason is required, 1–2000 characters (`422 decline_reason_invalid` otherwise), served verbatim as `declineReason` and never an enum — an asker who wants a typed reason asks a `choice`.

The response is the question as it now reads: `state: "declined"`, `declinedAt`, `declinedBy`, `answer: null`. Declined is "not open" everywhere: it leaves the default inbox and the sidebar count, satisfies a held await, and "Next question →" moves on. The event is `question.declined`; a subscriber to `question.answered` is never fired by a decline — that is the point. Nothing on the ticket moves.

## Withdraw

```bash
curl -b cookies.txt -X DELETE "$KANSO_URL/api/v1/questions/q_7"      # → 204
```

Only the asker — or a site admin — and only while the question is open. The question is kept: `state` becomes `withdrawn`, `withdrawnAt` and `withdrawnBy` are set, `answer` stays `null`, and the citation keeps resolving. Someone else gets `403 question_not_yours`; an already answered question `409 question_answered`; an already withdrawn one `409 question_withdrawn`. A held await on the question returns `satisfied: true` with `state: "withdrawn"`; the event is `question.withdrawn`.

## What a consumer stores: the citation

`citation` is `<issueKey>/q_<n>`, and it is permanent. Ticket keys are never reissued, `q_<n>` is never reissued, and a question is never re-answered, so one string names one answer for the life of the ticket: `GET /questions/q_7` re-reads the same `answer` after any number of later questions, answers, field edits, transitions or attachment deletions elsewhere. A withdrawn question is kept too, so a citation never dangles while the ticket exists; deleting the ticket removes its questions with it (`404 question_not_found` from then on, the id never reused).

Store the string wherever the answer was used. Kanso adds no special object for "this answer fed that"; existing mechanisms carry it:

| Where the answer was used | Mechanism | Example |
|---|---|---|
| Another ticket — the work it informed | An [issue link](../work/links-and-hierarchy.md) of the seeded `Relates` type (or one you register), plus the citation in a comment on the informed ticket | `POST /issue-links {"typeId": "lt_4", "outwardIssue": "WEB-42", "inwardIssue": "PLAT-88"}` |
| A run, a build, a deployment — something outside Kanso | A record on the ticket, kind `link`, whose `externalId` is your run id and whose `url` points at the run; put the citation in `data` | `PUT /issues/WEB-42/records {"namespace": "pipeline", "kind": "link", "externalId": "run-7f3c", "title": "Run 7f3c", "url": "https://ci.example.com/runs/7f3c", "data": {"citation": "WEB-42/q_7"}}` |
| A change in a repository | A commit trailer — `Kanso-Answer: WEB-42/q_7` — so the trail can be followed from either side | `git commit --trailer "Kanso-Answer: WEB-42/q_7"` |
| A conversation | A comment on the ticket naming what was done with the answer | `POST /issues/WEB-42/comments {"body": "Applied in run 7f3c (WEB-42/q_7)."}` |

Every one of these is visible to any client — an agent walks from a run to its citation to the answer with `get_question`.

## Events

Four events, each with payload keys `issue` and `question`: `question.asked`, `question.answered` (fires exactly once per question), `question.declined` and `question.withdrawn`. The envelope carries the ordinary ticket JSON (its version unchanged) and the question exactly as `GET /questions/{id}` serves it at that moment — the answered event carries the answer. A webhook subscribed to `question.*` receives them; an installed app whose trigger names `question.answered` runs when the person answers — the natural continuation "the person answered → run". No event fires on a refused write. See [Webhooks and apps](../integrate/webhooks-and-apps.md).

## Questions or an answering issue?

There are two ways to get an answer from a person, and they suit different jobs:

- **A question** carries its own schema, on its own record, on one ticket. Asking one changes nothing else: no field, form, workflow or issue type, and no other ticket's forms. Use it when the answer should *not* move the ticket.
- **An issue that resolves through a transition form** — the issue itself is the question, and the answer is what the resolving write committed. Use it when the answer *should* move the ticket: a review that closes it, a sign-off that resolves it.

The second needs setup, and custom fields are global: a space with no stored form of its own shows every registered field on its tickets. Store forms for the spaces you care about, or use questions.

## An issue that resolves through a transition form

For workflows that already have a done-category transition with a form on it.

### One-time setup

Register the fields the answer consists of (a `select`, a `text`, and an `artifact` field for a file whose digest the server vouches for), an issue type, a workflow whose `answer` transition targets a **done-category** state with an explicit `from` (a transition with `from` omitted is global and would be offered on an already-answered issue), and — **after binding the workflow** — a transition form naming the fields with the `helpText` the answerer reads:

```bash
curl -b cookies.txt -X POST "$KANSO_URL/api/v1/fields" -H "Content-Type: application/json" \
  -d '{"key": "verdict", "name": "Verdict", "type": "select", "options": [{"name": "Accept"}, {"name": "Decline"}]}'   # → cf_1
curl -b cookies.txt -X POST "$KANSO_URL/api/v1/fields" -H "Content-Type: application/json" -d '{"key": "reason",   "name": "Reason",   "type": "text"}'      # → cf_2
curl -b cookies.txt -X POST "$KANSO_URL/api/v1/fields" -H "Content-Type: application/json" -d '{"key": "evidence", "name": "Evidence", "type": "artifact"}'  # → cf_3
curl -b cookies.txt -X POST "$KANSO_URL/api/v1/issuetypes" -H "Content-Type: application/json" -d '{"name": "Question"}'                                   # → it_2
curl -b cookies.txt -X POST "$KANSO_URL/api/v1/workflows"  -H "Content-Type: application/json" -d @workflow.json                                          # → wf_2
curl -b cookies.txt -X PUT  "$KANSO_URL/api/v1/projects/ASK/issuetypes/it_2/workflow" -H "Content-Type: application/json" -d '{"workflowId": "wf_2"}'
curl -b cookies.txt -X PUT  "$KANSO_URL/api/v1/projects/ASK/issuetypes/it_2/forms/transition:answer" -H "Content-Type: application/json" -d @form.json
```

`workflow.json`:

```json
{
  "name": "Question flow",
  "definition": {
    "states": [
      { "id": "open",      "name": "Open",      "category": "todo" },
      { "id": "answering", "name": "Answering", "category": "in_progress" },
      { "id": "answered",  "name": "Answered",  "category": "done" }
    ],
    "initialState": "open",
    "transitions": [
      { "id": "start",  "name": "Start",  "from": ["open"],              "to": "answering" },
      { "id": "answer", "name": "Answer", "from": ["open", "answering"], "to": "answered" },
      { "id": "reopen", "name": "Reopen", "from": ["answered"],          "to": "open" }
    ]
  }
}
```

`form.json`:

```json
{
  "sections": [
    {
      "title": "Your answer",
      "items": [
        { "fieldId": "cf_1", "required": true,  "helpText": "Is the item in front of you acceptable?" },
        { "fieldId": "cf_2", "required": true,  "helpText": "One or two sentences on why. This is what the asker reads first." },
        { "fieldId": "cf_3", "required": false, "helpText": "If your answer is a file — a signed document, a corrected copy — add it here." }
      ]
    }
  ]
}
```

A transition form is validated against the *bound* workflow's version when stored, so the bind must come first. Artifact fields cannot sit on a `create` form (`field_not_placeable`), take no default (`field_default_not_applicable`) and cannot be set by a post-function; a value on `POST /issues` is `422 artifact_on_create`. See [Workflows](../work/workflows.md) and [Forms](../work/forms.md).

### Ask, answer, wait, read

Create the issue of that type assigned to the person and hand over `<origin>/answer/ASK-1`. The answer page for an *issue* renders every available transition into a done-category state as its stored form, with the same no-vocabulary rules as the question page. Then:

```bash
curl -b cookies.txt "$KANSO_URL/api/v1/issues/ASK-1/await?until=resolved&timeout=60"   # → 200 {"satisfied": true, "issue": {…"version":2,"resolution":{…}…}}
curl -b cookies.txt "$KANSO_URL/api/v1/issues/ASK-1/answer"                            # → the Answer below
```

```json
{ "issueKey": "ASK-1", "citation": "ASK-1@2", "version": 2,
  "answeredAt": "…", "answeredBy": { "id": "u_4", "…": "…" },
  "status": { "id": "answered", "name": "Answered", "category": "done" }, "resolution": { "id": "res_1", "name": "Fixed" },
  "fields": { "cf_1": "opt_1", "cf_2": "Looks right to me.", "cf_3": { "attachmentId": "att_2", "sha256": "9f86d0…" } },
  "artifacts": [ { "fieldId": "cf_3", "attachmentId": "att_2", "sha256": "9f86d0…" } ] }
```

- **Await** `GET /issues/{key}/await?until=resolved|changed&timeout=0..60[&since=<version>]` is the same hold as the question await with a different subject: `resolved` is "the issue carries a resolution", `changed` is `version > since` (`since` is required with `changed` and refused with `resolved`). Once admitted it always answers `200 {satisfied, issue}`; visibility is checked first (`404`); the same caps and the same `429 await_limit` apply. Issue holds and question holds count together.
- **The answer** `GET /issues/{key}/answer` is read from the changelog: the *resolving group* — the change that set a `status` and a non-null `resolution`. `fields` holds exactly what that write recorded, by id, never by name; `citation` is `<key>@<version>`, and `?version=<n>` re-reads that answer forever, after any later edit, reopen or correction. Unresolved (or reopened and not yet re-answered) is `404 not_answered`; a version that resolved nothing is `404 not_an_answer`. A value re-submitted *unchanged* writes no changelog item, so a re-answer's `fields` can be smaller than the form — the previous citation has that value. Every response carries `Cache-Control: no-store`.
- **The file** is an `artifact` field value, `{attachmentId, sha256}`, verified exactly as a question's file answer (the same five codes, plus `artifact_on_create`). The changelog carries it as JSON text with the filename as the display string; in JQL an artifact field supports `IS EMPTY` / `IS NOT EMPTY` only.
- **MCP**: `create_issue` → `await_issue {"key", "until": "resolved", "timeout"}` → `get_answer {"key"}` (optional `version` for a cited re-read). To answer on someone's behalf, `transition_issue` with a `fields` object forwarded to the transition's form.

## Limits

- A question cannot be edited after it is asked — ask a new one.
- A question has exactly one answer.
- There are no saved schema templates.
- No MCP tool answers or withdraws a question; answering is a person on the answer page, or the REST call.
- The inbox and the ticket's list are not paged and have no other filters.
- JQL does not search questions.
- Every question belongs to a ticket.
- The person answering needs an account and signs in.

## Related

- [Connect an agent (MCP)](./connect.md)
- [Attachments](../work/attachments.md)
- [Forms](../work/forms.md)
- [Webhooks and apps](../integrate/webhooks-and-apps.md)
