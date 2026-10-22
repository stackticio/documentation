---
title: Attachments
description: Upload files to issues through a sealed three-step flow, download them safely, and choose where the bytes are stored.
---

Kanso attaches files to issues through a three-step flow: create the attachment record, upload the raw bytes to a time-limited upload URL, then seal the upload. Sealed uploads pass through a short quarantine before they become downloadable. Out of the box the bytes live in Kanso's own PostgreSQL database, so the Kanso server plus PostgreSQL is a complete setup; pointing Kanso at any S3-compatible object store is pure configuration, and the API does not change at all.

## The upload flow

Uploading is always the same three requests, whichever storage backend is active:

1. `POST /issues/{issueKey}/attachments` with the metadata (`filename`, declared `size`, optional `contentType`). The server creates the attachment in status `pending` and returns an **opaque** `uploadUrl` plus `maxSize` (the enforced limit).
2. `PUT` the raw file bytes to `uploadUrl`, verbatim. Repeated `PUT`s before step 3 replace the bytes: the last write wins.
3. `POST /attachments/{attachmentId}/complete` to seal the upload. This returns `202` and moves the attachment to `quarantined`; resolution is asynchronous. Poll `GET /attachments/{attachmentId}` until the status is `available`, then download from `GET /attachments/{attachmentId}/content`.

The API never receives file bytes on the metadata endpoint, and clients never construct the upload URL themselves.

### Upload URLs carry their own credential

The `uploadUrl` is a capability URL: its signed `exp`/`sig` query parameters are the credential, so **no session cookie is needed** for the byte upload (the same way S3 presigned URLs work). It is valid for 15 minutes and bound to exactly one attachment. A tampered signature, an expired URL, or one attachment's signature on another's URL is rejected with `403` and nothing is stored.

With the built-in store the URL is **relative**: resolve it against the origin you called the API on. With an S3-compatible store it is an **absolute** presigned URL. Either way, treat it as opaque and `PUT` to it as given.

Every other attachment endpoint requires a normal session and answers `401` without one.

## The quarantine states

An attachment moves through exactly one sequence of states, and no other transition exists:

```
pending → quarantined → available | rejected
```

- `pending`: record created, bytes not yet sealed. `size` is `null` in this state.
- `quarantined`: the upload is sealed and an asynchronous resolution job is running (enqueued in the same transaction as the seal).
- `available`: content can be downloaded.
- `rejected`: content will never be served; `rejectedReason` says why (`"too_large"`).

Kanso does not virus-scan uploads. The resolution step checks the stored size, so an upload within the limit moves straight to `available`.

Rules that follow from these states:

- Content is served **only** when `available`: `409` while pending or quarantined, `410` when rejected, `404` for an unknown id.
- `complete` with no bytes uploaded is `409`. Completing twice is `409`. A `PUT` after `complete` is `409`: the upload is sealed.
- Downloads always carry `Content-Disposition: attachment` (with an escaped filename) and `X-Content-Type-Options: nosniff`, and `Content-Type` echoes what was declared. Uploaded HTML or SVG never renders in Kanso's origin.

Attachment operations never bump the issue's `version` and write no changelog. Listing (`GET /issues/{issueKey}/attachments`) returns attachments in all states, oldest first. `DELETE /attachments/{attachmentId}` works in any status and removes everything: metadata and stored bytes are both deleted, and a second delete is `404`. One precondition applies: an attachment that an `artifact` field value on its issue references answers `409 attachment_in_use` (the count and issue key in `message`, the referencing field in `details`) and nothing is deleted; write another attachment or `null` to that field first. Deleting an issue or a space still removes its attachments unconditionally.

Sealing also computes the file's digest: `complete` stores the SHA-256 of exactly the bytes `/content` serves, and `Attachment.sha256` carries it (lowercase hex) once the status is `available`, `null` before. It is the value a client echoes into an artifact field; clients never hash. See [Human answers](../agents/human-answers.md).

## Size limits

The maximum attachment size is set by the `KANSO_ATTACHMENT_MAX_SIZE` environment variable (bytes, default `10485760` = 10 MiB); see [Configuration](../run/configuration.md). Clients can discover the enforced limit from `GET /attachments/meta`, which returns `{ "enabled": true, "uploadLimit": <bytes> }` (`enabled` is always true, because the built-in store needs no configuration).

Enforcement is layered, and the **stored** byte count is authoritative:

- A declared `size` over the limit is rejected up front with `422` at the metadata `POST`.
- With the built-in store, a `PUT` of oversized bytes is rejected with `413` and nothing is stored.
- `complete` re-verifies the stored size; an oversized stored object resolves to `rejected` with `rejectedReason: "too_large"`. (With an S3 store there is no `413` on the `PUT`; the resolution verdict is the enforcement.)

A declared size that differs from the actual bytes is not an error; once sealed, the `Attachment.size` field reports the actual stored size.

## Storage backends

### Built-in PostgreSQL store (the default)

By default, attachment bytes live in Kanso's own PostgreSQL database. This store is suited to development and evaluation: it is size-capped and needs zero configuration. `uploadUrl` is a relative URL served by Kanso itself, and `content` serves the bytes directly with `200`.

### S3-compatible storage: pure configuration

Setting all of the following environment variables switches **new** attachments to an S3-compatible object store (see [Configuration](../run/configuration.md)):

- `KANSO_S3_ENDPOINT`
- `KANSO_S3_BUCKET`
- `KANSO_S3_ACCESS_KEY`
- `KANSO_S3_SECRET_KEY`
- `KANSO_S3_REGION` (optional, default `us-east-1`)

Kanso uses path-style addressing, so stores like SeaweedFS and MinIO work. If any of endpoint, bucket or keys is missing, the built-in store is used, unchanged.

There is **no new API surface**: the client flow is identical, because `uploadUrl` was always opaque and `content` was always allowed to redirect. The only observable differences are:

- `uploadUrl` is an absolute presigned `PUT` URL (15 minutes) instead of a relative one.
- `GET /attachments/{id}/content` answers `307` to a presigned GET URL (15 minutes) instead of serving bytes with `200`. The redirect carries `response-content-disposition: attachment` and forces the stored content type, so uploaded files still never render after the redirect. A client that follows redirects (e.g. `curl -L`) gets exactly the same bytes.

Everything else (status codes, the state sequence, size enforcement, upload-URL scoping, byte-identity) holds in both modes. Sealing is real in S3 mode too: `complete` copies the staged object server-side to a sealed key the upload URL cannot write, so a late `PUT` within the URL's lifetime can never change what is served.

**Mixed mode:** each attachment remembers its backend internally (this is not exposed in the API). Attachments created before S3 was configured keep serving from the built-in store after S3 is enabled; new ones go to S3. Delete works for both. If the configured S3 store is unreachable, requests fail with a `5xx`; there is never a silent fallback to the built-in store. The [Jira importer](../migrate/jira-import.md) writes imported attachments to the built-in store even when S3 is configured.

## Walkthrough: upload, attach, download

Assumes `KANSO=https://your-kanso.example.com/api/v1` (adjust to your deployment's base URL) and a local account. Log in once to get a session cookie:

```sh
curl -c cookies.txt -X POST "$KANSO/auth/login" \
  -H 'Content-Type: application/json' \
  -d '{"username": "alice", "password": "secret"}'
```

**1. Create the attachment record on an issue** (here `KAN-1`):

```sh
curl -b cookies.txt -X POST "$KANSO/issues/KAN-1/attachments" \
  -H 'Content-Type: application/json' \
  -d '{"filename": "design.pdf", "size": 48213, "contentType": "application/pdf"}'
```

Response (`201`), with status `pending`, `size` null, and the upload URL:

```json
{
  "id": "att_42",
  "issueKey": "KAN-1",
  "filename": "design.pdf",
  "contentType": "application/pdf",
  "status": "pending",
  "size": null,
  "uploadUrl": "/api/v1/attachments/att_42/upload?exp=1755600000&sig=…",
  "maxSize": 10485760
}
```

**2. PUT the raw bytes to `uploadUrl`.** No cookie is needed; resolve a relative URL against your origin:

```sh
curl -X PUT "https://your-kanso.example.com/api/v1/attachments/att_42/upload?exp=1755600000&sig=…" \
  -H 'Content-Type: application/octet-stream' \
  --data-binary @design.pdf
```

**3. Seal the upload** (returns `202`, status `quarantined`):

```sh
curl -b cookies.txt -X POST "$KANSO/attachments/att_42/complete"
```

**4. Poll until `available`:**

```sh
curl -b cookies.txt "$KANSO/attachments/att_42"
# … "status": "available", "size": 48213, "sha256": "<64 lowercase hex>" …
```

**5. Download the content.** Use `-L` so the same command works whether the server serves bytes directly (built-in store, `200`) or redirects to a presigned URL (S3 store, `307`):

```sh
curl -b cookies.txt -L -o design.pdf "$KANSO/attachments/att_42/content"
```

To remove it:

```sh
curl -b cookies.txt -X DELETE "$KANSO/attachments/att_42"   # 204; metadata and bytes are gone
# 409 attachment_in_use instead, and nothing deleted, while an artifact field on KAN-1 names att_42
```
