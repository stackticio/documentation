---
title: The web interface
description: Find your way around Kanso's web interface, screen by screen, and see how each screen follows the server's own definitions.
---

Kanso's web interface is a deliberately thin, generic renderer over the server's own data: forms are drawn from the server's form definitions, the board is grouped by workflow status categories rather than hardcoded state names, and workflow diagrams are the served state machines drawn as they are. Nothing in the interface is custom-built per project, so when an administrator changes a form, a field or a workflow on the server, every screen follows immediately, with no interface release. This page walks through each screen as it actually behaves.

## Logging in

The login page asks for a username and password (local accounts stored in Kanso's own database). If the server offers single sign-on (the interface asks `GET /api/v1/auth/methods` when it loads), an extra "Continue with *provider*" button appears below the sign-in button and sends you to the server's OIDC login flow. The button only exists when the server says SSO is enabled; nothing about a particular identity provider is built into the interface. A failed SSO round-trip returns you to this page with the message "Single sign-on failed — try again or use a local account," and a wrong local password shows "Wrong username or password."

## Layout and navigation

After login you see a left sidebar and a main area.

**The sidebar** lists your *spaces* (Kanso's word for projects), with a button to create a new space when you are allowed to. Below that are the workspace screens: **Notifications**, **People**, **Access**, **Apps**, **Connectors**, **Migration**, **Export**, **Timesheet** and **Registry**, plus **Questions for you** whenever a question is waiting for your answer. Site admins also see **Resolutions**, **Email**, **AI access**, **Tokens** and **Publication rules**. At the bottom sit your name, the notification bell, **Security** (the shield), **Appearance**, a light/dark switch and **Sign out**.

Right-clicking a space row opens a context menu: **Open**, **Versions…**, **Components…**, **Access…**, **Convert text to Markdown…**, **Connectors…**, **Notify me of new issues**, **Notifications…**, **Rename space…** and **Delete space…**. Hovering a space row also reveals a ✕. Deleting a space is permanent and destroys everything in it, so the dialog makes you type the space's KEY (exact, case-sensitive) before the button enables. Spaces managed by a `KansoProject` Kubernetes resource refuse deletion here; delete the resource instead (see [Tracker as code](../integrate/tracker-as-code.md)).

**The main area** shows the selected space, with four working tabs: **Board**, **List**, **Backlog** and **Flow**.

If your server has no spaces at all, the main area shows a first-run screen instead: one form to create your first space (a name plus an auto-suggested key like `PLAT`), plus pointers to the Jira import assessment endpoint (`POST /api/v1/import/assess`; see [Importing from Jira](../migrate/jira-import.md)) and the served API contract at `/api/v1/openapi.yaml`.

### Search

The search box in the top bar is the server's JQL engine, not a client-side filter. Plain words are turned into a full-text query (`text ~ "…"`); anything that looks like an operator expression (`=`, `~`, `AND`, `ORDER BY`, …) is passed through as JQL. If the server rejects the query, its error message, with the position of the problem, is shown above the view with a link to the served JQL grammar, so the board never goes silently empty on a bad query. Category filter chips (All / To Do / In Progress / Done) sit below the top bar on the Board, List and Flow tabs. See [Search and JQL](search-jql.md).

## Creating an issue

"+ New issue" opens a dialog whose form is rendered entirely from the server's *createmeta* for the space's default issue type: which fields appear, their order and sections, which are required, hidden, read-only or half-width. All of it is server data. Field defaults are pre-filled from the same definition. If the server rejects the create, the per-field validation messages are shown as a notification. Add a field to the create form on the server and it appears here with no interface change.

### How forms work everywhere

The same form renderer backs the create dialog, the issue drawer and transition forms. As you type, it asks the server again (a debounced call to `/forms/preview`) to re-resolve the form against your draft values, so conditional fields appear and disappear exactly as the server's write path will enforce them. The interface cannot disagree with the server about what a valid submission is. It renders the field types the server serves: text, number, date, description (multi-line), assignee (user picker), priority, fix versions, resolution, and comma-separated labels. See [Forms](forms.md).

## The issue drawer

Clicking an issue anywhere opens a drawer on the right. From top to bottom:

- **Header**: issue key, current status (colored by category), the **resolution** chip when the issue is done (hover it for the resolved-at time), priority mark and assignee avatar; below that, issue type, reporter, and created/updated times. A 🗑 button deletes the issue (right-clicking an issue on the Board or List offers the same through a context menu). A leaf issue asks for a plain confirmation, but an issue with children is refused by the server and the panel upgrades to an explicit cascade: you type the issue key to delete the whole subtree. Deleted issue keys are retired, never reused.
- **Being worked on**: when an agent (or anyone) holds the issue's work lease, the header shows a chip: *Being worked on by Agent A · token “runner-1” · until 14:30* (hover it for the exact instant). The middle part names the credential that holds it: `token “<name>”`, `signed-in session`, `app <name>`, or `account` for a lease taken before credentials were recorded. A **Release** button appears exactly when the server says your release would succeed: you hold the lease, it is your own agent's (a browser session may call off its own account's agent, a *recall*), or you are an admin of the space (a *force*). Releasing re-reads the issue; a refusal is shown inline with the server's reason. The interface never judges a lease by your computer's clock: once the time on the chip has passed it reads *(may have ended — refresh)*, and the next read of the issue shows the truth. There is no button to claim an issue: agents take leases through the API and MCP ([Connecting an agent](../agents/connect.md)), and leases are advisory, so anyone may still edit a leased issue.
- **Transitions**: a row of buttons, one per workflow transition from the current state, straight from the workflow engine. Unavailable transitions are shown disabled with the server's reason as a tooltip. If a transition has a server-defined form (for example, "Resolve" asking for a resolution: put a `resolution` field on a `transition:<id>` form and you have that screen), clicking it opens that form in a dialog before executing. See [Workflows](workflows.md).
- **Fields**: the edit surface, rendered from the server's *editmeta* by the same form renderer. Editing any field shows a **Save** button; saving sends only the changed fields, carrying the issue's version number (`If-Match`). If someone else changed the issue meanwhile, the server answers `409` and the drawer reloads their version and tells you so. Your edit is never silently overwritten.
- **Description**: Markdown, written in a rich editor (see below).
- **Hierarchy**: an ancestor breadcrumb (each crumb clickable) and a children list, both served by the server's hierarchy reads; depth is data, not a fixed level scheme. You can set, change or detach the parent here; that is a normal versioned edit, so it conflicts like any other. See [Links and hierarchy](links-and-hierarchy.md).
- **Links**: typed links to other issues. The phrase dropdown ("blocks", "is blocked by", "relates to", …) is built from the server's link-type registry, each type contributing its two directions. Rows link to the other issue; each has a remove button.
- **Attachments**: upload through a file button (the size limit is fetched from the server and shown). Bytes go directly to the attachment store, not through the JSON API. Rows render purely from the attachment's status: freshly uploaded files show "resolving…" while the server settles them (the panel polls until they do), available files become download links, and rejected files show the server's reason. See [Attachments](attachments.md).
- **Work log**: log time, see the running total, and edit or remove entries. See [Worklogs and timesheets](worklogs.md).
- **Comments**: a list with author avatar, name and timestamp (deleted authors show as "Former user"), plus a box to add a comment. Comments are Markdown too, written and shown by the same editor as the description. Hovering a comment reveals a ✕ that deletes it; like worklogs, this touches no issue version and writes no changelog, because the comment list is its own history.
- **History**: the issue's changelog, grouped by author and time, showing each field's old → new value, alongside the issue's current version number. A group written with something other than a signed-in session on the REST API carries one chip naming how it was written: `via token "ci-agent"` (or `via token kat_12` for a token created before Kanso 0.71, whose name stays private), `via MCP session` (a signed-in session talking to `/mcp`), `via app "stamp"`, `via connector "gh"`, `imported` or `by Kanso`. Hover a chip for the credential's id; click it to open the space's list searching `changedVia = <that credential>`. Comments carry the same chip after their author (clicking searches `commentedVia`), and an edit by someone other than the author reads *edited by @bob*, with a chip when the edit was not made in a session. Work logs, records, attachments, waivers, question cards and the notification bell show the same words; an app's identity always carries an `app` badge, never a person's face. Kanso names credentials, not people or programs: a chip says which credential wrote, never "AI".

### Descriptions and comments in Markdown

Descriptions and comments are **Markdown**: headings, lists, task lists, tables, links, emphasis, and fenced code blocks with a language tag, highlighting and a **Copy** button. You write in a formatted editor by default; a **Markdown** toggle (Ctrl/⌘+E) shows the source, and typing `/` at the start of a line opens a block menu (`/code`, `/table`, …). Pasting a stack trace lands as a code block on its own. Issue keys in the text (`KAN-12`) become links. What is stored is the Markdown text exactly as written; the server never renders it, and raw HTML inside it is shown as literal text.

**Images:** paste or drop a picture into the description or a comment and it is uploaded as an attachment of the issue and shown inline where you pasted it. The text carries a reference to that attachment (`![shot.png](att_12)`), and only the issue's own attachments ever render: a reference to any other file, and any image URL, is shown as text or a link and never fetched. Only real PNG, JPEG, GIF and WebP files render; anything else stays a download. Pasting images needs an existing issue, so the create dialog asks you to save first.

**Task lists** in comments and on the answer page are live: ticking a box saves that one change straight away and rolls back if the server refuses.

Descriptions and comments written before Kanso supported Markdown, including everything the Jira importer wrote, are tagged **plain** and keep rendering exactly as before. They open in the raw editor with a one-click **Convert to Markdown**, and nothing is converted until you click it. A space admin can convert a whole space at once: right-click the space and choose **Convert text to Markdown…**. It shows how many descriptions and comments are plain, converts them in one go without changing a byte of text, and records the conversion in each issue's history.

## Notifications

**Notifications** in the sidebar is where you choose what reaches you. Each event (assigned to you, mentioned, a comment or a status change on an issue you watch, reported or are assigned, a new issue in a space, a question waiting for your answer, and the answer or decline of a question you asked) can be **Off**, **Bell** (the in-app feed) or **Bell and email**. The **Everywhere** table sets your defaults; **Per space** overrides any event for one space, for example "email me every new issue in PAY" or "mute OPS". Out of the box you get everything in the bell except new issues, and email only when you are assigned or asked a question. Right-click a space for **Notify me of new issues**.

In the bell, a question waiting for you opens its answer page; an answered or declined question opens the issue, whose question card shows the answer or the reason. A question the server could not deliver (the person named cannot see the issue) says so on its card, and in a brief pop-up message when you ask it. See [Human answers](../agents/human-answers.md).

Email needs a mail relay on the instance (set by the operator in the Helm chart, or by a site admin under **Email** in the sidebar), an address on your account, and the **Email me at …** switch at the top of the Notifications screen. A site admin's Email screen shows whether the relay is managed by the environment, not configured, or configured with the last send or the last error, and has a **Send test email** button that mails your own address.

## Tokens

**Your tokens** are in the **Security** dialog (the shield next to your name, bottom left), under **Connect an agent**. The line above the table names the account you are signed in as: tokens belong to the account that created them, so tokens made while signed in as someone else are not here. Each token shows its scope, whether it is **Active** or **Expired**, when it expires and when it was last used. **Expiry…** moves an active token's expiry to 7, 30 or 90 days from today, or to the instance maximum; the secret does not change, so the agent using it keeps working. An expired token cannot be brought back; create a new one. **Revoke** ends a token immediately.

**Every token** is in **Tokens** in the sidebar, for site admins: owner, token, scope, status, expiry and last use for every account, filtered by person and status. A site admin can revoke any token or change its expiry the same way; **People → Tokens…** opens the list for one person. Secrets are never shown again after a token is created, not here and not anywhere. See [Connecting an agent](../agents/connect.md).

## Board

The board has three columns (To Do, In Progress, Done), which are the workflow's *status categories*, never state names: rename or add states on the server and the board keeps working. Cards show the summary, any custom-field values as chips, labels and due date, priority, key, status name, last-update time and assignee. A small hourglass marks a card someone holds a work lease on; hover it (or listen to it with a screen reader) for *Leased by Agent A until 14:30*. Backlog rows and list rows carry the same marker. `leasedBy = "agent-a"` in search lists everything one account holds, and `leasedBy IS EMPTY` the unclaimed work.

Dragging a card to another column is a workflow transition, not a status write. The card moves immediately, then the interface asks the workflow engine which available transitions land in that column:

- exactly one: it executes;
- more than one: a small dialog asks which transition you meant;
- none, or the server rejects it: the card snaps back and the reason is shown.

If the transition needs input (it has a form), the board puts the card back and tells you to open the issue to transition; the form lives in the drawer.

## Backlog

The Backlog tab shows one lane per open sprint plus a final Backlog lane. Every lane is a JQL query ordered by rank (`sprint = <id> ORDER BY rank`, `sprint IS EMPTY ORDER BY rank`), so ordering is server data, not client state. What you can do:

- Drag an issue **onto another issue** to rank it immediately before that issue (moving it between lanes first if needed).
- Drag an issue **onto a lane** to move it into that sprint (or back to the backlog).
- **New sprint** creates a sprint by name; a *future* sprint has a **Start** button, an *active* one a **Complete** button; closed sprints disappear from the view. A sprint's goal, if set, shows under its header.

Rank moves never touch an issue's version on the server, so reordering never conflicts with someone editing the same issue. If a move fails, the view reloads from the server and shows the error. See [Boards and sprints](boards-sprints.md).

## Flow

The Flow tab is a diagram surface with two panes:

- **Issues**: the issues currently matching your search and filter, drawn as a graph. Solid top-down arrows are parent/child hierarchy; dashed labeled curves are issue links (e.g. "blocks"). Nodes show key, summary, a status-colored bar and the assignee; clicking a node opens the regular issue drawer. The diagram is a view of the same issues, not a separate model.
- **Workflows**: every workflow on the server, listed with its current version. Selecting one renders its state machine read-only: states colored by category, an initial-state marker, labeled transition arrows, and a ◆ on transitions guarded by CEL conditions or validators (hover for the expressions). A version selector lets you view any published version, not just the current one. The drawing is exactly the served definition; nothing is invented in the browser.

## Apps

The **Apps** button in the sidebar opens a dialog with three tabs:

- **Apps**: your app documents and the bundled **Library**. **+ New app** opens an editor; an app goes write → **Validate** → **Dry run** (applies nothing) → **Publish** → **Install**, and each app shows its documentation, code, installs and **Runs** (what every run did, step by step). A library app installs in one click, or, when it declares inputs, after a short form that configures it first. See [App development](../integrate/app-development.md).
- **Webhooks**: plain webhook subscriptions: name, target URL, a checklist of events (from the served event catalog, or `*` for everything), an optional JQL filter, and an optional secret (16+ characters) that enables HMAC signatures. Each webhook can be pinged, paused and resumed, or deleted, and its delivery log (event, status, attempts, HTTP response) can be inspected, with a redeliver button on finished deliveries. See [Webhooks and apps](../integrate/webhooks-and-apps.md).
- **Events**: the server's event catalog: every event name, its description and its payload keys. The interface knows nothing about which events exist; this list is served.

## People

The **People** button opens a dialog listing all users (avatar, name, username, and how each one signs in). Changes here are for site admins: add a person with a password (at least 8 characters) or, when single sign-on is configured, with only an email address, so their first SSO sign-in claims the account; add a **guest** of one space, who sees nothing else; edit display names and email; grant or revoke site admin; deactivate and reactivate. What each person may do inside a space is decided by that space's roles and permission scheme, not here. See [Users and authentication](../run/users-and-auth.md).

## One API for everyone

The web interface is an ordinary client of the same public REST API every other client uses: a small typed wrapper over `/api/v1`, same-origin, with no private endpoints. Writes carry the resource's version number (`If-Match`), which is why concurrent edits surface as polite conflicts instead of lost updates. Everything you can do in these screens you can do with `curl` against the same contract; see [the API guide](../integrate/api.md) and the served spec at `/api/v1/openapi.yaml`.
