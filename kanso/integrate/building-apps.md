---
title: Build your own service
description: Put your own HTTP service next to Kanso — receive signed event deliveries, verify them, and act back through the public API with a token of its own.
---

There are two ways to put your own logic next to Kanso. An **app** is one document that Kanso runs in-process, under its own identity, on events or on a schedule — no server of yours, nothing to deploy; when the logic belongs to Kanso, start there with [App development](app-development.md). **Your own service** is an ordinary HTTP endpoint that receives signed event POSTs from Kanso and, when it wants to act, calls back the same public REST API every person, script and agent uses. That is this guide: use it when you already run the service, or when it needs something Kanso deliberately does not do inside itself.

For the event catalog, envelope shape, delivery states and subscription semantics, see [Webhooks and apps](webhooks-and-apps.md); this guide is about writing the thing on the other end.

## Step 1 — stand up an HTTP receiver

One `POST` handler that reads the raw body, verifies the signature, handles the event and returns 200:

```go
http.HandleFunc("POST /", func(w http.ResponseWriter, r *http.Request) {
    body, err := io.ReadAll(r.Body) // raw bytes — needed for the signature
    if err != nil {
        w.WriteHeader(http.StatusBadRequest)
        return
    }
    // ... verify signature over body (step 3), then handle the event
    w.WriteHeader(http.StatusOK)
})
```

Your HTTP status code is the acknowledgment: 2xx means delivered; anything else, or no response within 15 seconds, triggers retries with backoff up to 10 attempts, after which the delivery is parked as a visible `failed` you can redeliver. So return 200 for events you deliberately ignore, and 5xx only when you want Kanso to try again. Answer quickly and do slow work asynchronously.

## Step 2 — subscribe

`POST /webhooks` with `{name, url, events, jqlFilter?, secret?}` — you choose the event list, an optional server-side JQL filter, and the signing secret (16–200 characters). The secret is write-only: no read ever returns it, so keep your copy. Managing webhooks takes a site admin. See [Subscriptions](webhooks-and-apps.md#subscriptions).

```sh
curl -s -b /tmp/kanso.jar -X POST "$KANSO/webhooks" \
  -H 'Content-Type: application/json' \
  -d '{"name": "my-service", "url": "https://my-service.example.com/",
       "events": ["issue.created"], "secret": "<16-200 characters you keep>"}'
# → 201 {"id": "wh_1", ..., "hasSecret": true}

curl -s -b /tmp/kanso.jar -X POST "$KANSO/webhooks/wh_1/ping"   # → 202, a signed webhook.ping
```

## Step 3 — verify the HMAC signature over the raw body bytes

Every delivery to a webhook with a secret carries `X-Kanso-Signature: sha256=<hex hmac-sha256(secret, body)>`, signed over the exact bytes posted. Verify before parsing — an unverifiable request is not from Kanso. `hmac.Equal` is a constant-time compare:

```go
sig := strings.TrimPrefix(r.Header.Get("X-Kanso-Signature"), "sha256=")
mac := hmac.New(sha256.New, []byte(secret))
mac.Write(body)
if !hmac.Equal([]byte(hex.EncodeToString(mac.Sum(nil))), []byte(sig)) {
    w.WriteHeader(http.StatusUnauthorized)
    return
}
```

Read the raw body first, verify over those bytes, and only then `json.Unmarshal`. If you let a framework parse the body before you see it, you can no longer verify the signature.

## Step 4 — react to events

The body is the envelope `{id, event, at, actor, via, ...payloadKeys}` — which extra keys each event carries is declared per event by your own instance at `GET /api/v1/events` (see [The served event catalog](webhooks-and-apps.md#the-served-event-catalog)). Unmarshal only the fields you need and check the `event` name before acting:

```go
var env struct {
    Event string `json:"event"`
    Issue struct {
        Key string `json:"key"`
    } `json:"issue"`
}
if json.Unmarshal(body, &env) != nil || env.Event != "issue.created" || env.Issue.Key == "" {
    w.WriteHeader(http.StatusOK) // not ours; ack so Kanso stops retrying
    return
}
```

## Step 5 — act back through the public API, as yourself

A service that writes needs a Kanso account of its own, so issue history attributes its actions honestly. Create one (People, or `POST /users` as a site admin), sign in as it once, and mint a **personal API token** with write scope — tokens are minted from an interactive session, expire (90 days by default, at most 365 unless the operator raises the ceiling) and can be revoked; see [How tokens work](../agents/connect.md#how-tokens-work). The service then sends it as a Bearer header:

```go
base := strings.TrimRight(os.Getenv("KANSO_URL"), "/") + "/api/v1"
do := func(req *http.Request) (*http.Response, error) {
    req.Header.Set("Authorization", "Bearer "+os.Getenv("KANSO_TOKEN"))
    return http.DefaultClient.Do(req)
}
```

Writes follow the API's optimistic-concurrency contract (see [Versioned writes and If-Match](api.md#versioned-writes-and-if-match)): GET the issue, PATCH with `If-Match: <version>`, and loop on a conflict:

```go
req, _ := http.NewRequest(http.MethodPatch, base+"/issues/"+key, bytes.NewReader(patch))
req.Header.Set("Content-Type", "application/json")
req.Header.Set("If-Match", fmt.Sprint(iss.Version))
pres, err := do(req)
// ...
switch pres.StatusCode {
case 200:
    return nil
case 409:
    continue // concurrent edit — refetch and retry
case 401:
    return errors.New("token expired or revoked — mint a new one")
}
```

Never treat the event payload as truth for writing — it is an event-time snapshot. Refetch, then write with `If-Match`; the retry loop absorbs races.

## Filtering, idempotency, redelivery

- **JQL filtering** happens server-side: set `jqlFilter` on the webhook and non-matching events are recorded as `skipped` instead of POSTed. The filter is unrestricted JQL, compiled at write time, evaluated at delivery time — details in [Subscriptions](webhooks-and-apps.md#subscriptions). Filter server-side rather than in your handler where you can: skipped deliveries are visible in the log, silent handler drops are not.
- **Delivery is at-least-once.** `X-Kanso-Delivery` (the `dlv_<n>` id) is your idempotency key. Either deduplicate explicitly on it, or make the action naturally idempotent (check whether the label is already there before adding it). A duplicate log line is harmless; a duplicate transition is not.
- **Your own writes come back as events.** If your service writes with its token, it receives the events those writes cause. Drop them by comparing the envelope's `via.id` with your token's id (the part of the token before the dot) — see [the loop guard](webhooks-and-apps.md#transactional-emission-and-the-envelope).
- **Redelivery** is an operator action (`POST /webhooks/{id}/deliveries/{deliveryId}/redeliver`) that re-sends the same payload bytes — one more reason your handler must tolerate repeats.

## Running it

An HTTP server you run wherever you like — a laptop, a VM, a pod next to Kanso, someone else's cloud — as long as Kanso can reach its URL. You provide its environment yourself: the webhook secret, `KANSO_URL`, and the token if it writes.
