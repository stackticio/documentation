---
title: Install
description: Install Kanso 0.77.0 on Kubernetes with the Helm chart, and grow it into a production deployment.
---

Kanso needs exactly one thing to be a complete product: a PostgreSQL database. The Helm chart is batteries-included — with zero configuration it renders a dev/eval-grade internal PostgreSQL and a first-boot admin credential, so one `helm install` yields a working, credentialed instance. External PostgreSQL, OIDC single sign-on, S3-compatible attachment storage, an SMTP relay for email, and declarative configuration from Kubernetes custom resources are all optional upgrades you layer on with values.

Kanso ships as a single Go binary in the container image `docker.io/stacktic/kanso` (distroless, runs as nonroot). This page installs **Kanso 0.77.0**, which is Helm chart **1.28.0**. All runtime configuration is environment variables; the full reference is [Configuration](configuration.md).

## Install with Helm

Kanso installs with its Helm chart. The chart is published as an OCI artifact on Docker Hub — no `helm repo add`:

```bash
helm install kanso oci://registry-1.docker.io/stacktic/kanso --version 1.28.0
```

Without `--version`, Helm installs the newest published chart. Set one for a reproducible install or an upgrade you have reviewed — `--version <chart version>` on `helm install` and `helm upgrade` alike.

Inspect the chart before installing, straight from the registry:

```bash
helm show chart   oci://registry-1.docker.io/stacktic/kanso --version 1.28.0   # version + appVersion
helm show readme  oci://registry-1.docker.io/stacktic/kanso --version 1.28.0
helm show values  oci://registry-1.docker.io/stacktic/kanso --version 1.28.0
```

Chart versions and app versions move independently: each chart version deploys exactly one app version, its `appVersion`, which is the image tag it uses unless you set `image.tag`. Chart 1.28.0 deploys app 0.77.0. Both live in the same Docker Hub repository and are told apart by tag — chart tags are chart versions, image tags are app versions. The chart README, which `helm show readme` prints, is the full chart reference: every value, the production recipe, the security posture, the CRD caveat and the upgrade note.

After installing, prove it end to end:

```bash
helm test kanso
```

### What a default install deploys

With no values set, the chart deploys:

- **One `Deployment`** running the Kanso binary in its default `web` mode, which serves the API and UI and runs the job workers in-process. Startup, liveness and readiness probes all hit `/healthz` on port 8080. The startup probe (30 attempts, 5 s apart) carries a slow first boot while migrations run, so liveness can stay tight afterwards. Every probe's timing is a value, and setting a probe to `{}` drops it.
- **A `ClusterIP` Service** on port 8080 (`service.type`, `service.port`).
- **The internal PostgreSQL** and **the admin-password Secret**, described below.
- **The instance signing key**, in the Secret `<release>-signing` under key `KANSO_SECRET_KEY`: 48 random characters, generated once and kept stable across upgrades. Connector bindings are derived from it, and stored credentials and the email relay password are sealed under it, so keep the Secret if you ever rebuild the release.
- **A `ServiceAccount`** (identity only — no API token is mounted unless declarative configuration is on) and default resource requests and limits on every container.
- **The two `kanso.io` CRDs** (`kansoprojects`, `kansoworkflows`). They are installed even though the reconciler that consumes them is off by default (`declarativeConfig.enabled: false`); `helm install --skip-crds` omits them on clusters where you may not create CRDs.

Helm installs CRDs on first install only — `helm upgrade` never updates them. When a release changes one, apply the CRDs of the chart version you are upgrading to:

```bash
helm show crds oci://registry-1.docker.io/stacktic/kanso --version <chart version> | kubectl apply -f -
```

The post-install notes print the port-forward and password commands for your release.

### The internal dev-grade PostgreSQL

The internal PostgreSQL is rendered **only** when `database.existingSecret` is empty **and** `database.internal.enabled` is `true` (the default). It creates:

- A single-replica StatefulSet running `database.internal.image` (default `postgres:16-alpine`) with a PVC of `database.internal.storage` (default `1Gi`; an empty `database.internal.storageClassName` uses the cluster default).
- A Secret `<release>-postgres` containing a generated 24-character password and a ready-made `KANSO_DATABASE_URL` (`postgres://kanso:<password>@<release>-postgres:5432/kanso`), which the Kanso Deployment consumes via `envFrom`. The password stays stable across `helm upgrade`.

This database is dev/eval-grade: one replica, no high availability, no backups. Do not run production on it.

### Pointing at an external PostgreSQL

Create a Secret carrying the connection URL under the key `KANSO_DATABASE_URL`, then reference it:

```bash
kubectl create secret generic my-kanso-db \
  --from-literal=KANSO_DATABASE_URL='postgres://kanso:pass@my-cnpg-rw.db.svc:5432/kanso'
```

```yaml
# values
database:
  existingSecret: my-kanso-db
```

When `database.existingSecret` is set, the internal PostgreSQL (StatefulSet, Service and Secret) is not rendered at all; the Deployment takes its `envFrom` from your Secret instead. The application cannot tell the difference — it only reads `KANSO_DATABASE_URL`.

### First login and the admin account

On first boot in web mode, the server seeds a local `admin` account (display name "Administrator") — but only if the user table is completely empty. It uses `KANSO_ADMIN_PASSWORD` when set; when unset, it generates a random password and logs it exactly once. Later changes to the variable never rotate the account.

The chart provisions the password as a Secret so the default install is credentialed:

| Values | Result |
|---|---|
| `admin.password` set | That exact password is written into the chart's Secret `<release>-admin` (key `KANSO_ADMIN_PASSWORD`). |
| `admin.existingSecret` set | The chart renders no Secret of its own and reads key `KANSO_ADMIN_PASSWORD` from yours. |
| Both empty (default) | A random 20-character password is generated once and kept stable across upgrades. |

Read it:

```bash
kubectl get secret kanso-admin \
  -o jsonpath='{.data.KANSO_ADMIN_PASSWORD}' | base64 -d; echo
```

Then port-forward and sign in as `admin`:

```bash
kubectl port-forward svc/kanso 8080:8080
# open http://localhost:8080
```

Passwords must be at least 8 characters. A shorter `KANSO_ADMIN_PASSWORD` fails the admin seed and the process exits at boot.

### Exposing it: Ingress and TLS

Kanso serves the UI and the API from a single origin on a single port, so the ingress is one host and one path:

```yaml
ingress:
  enabled: true
  className: nginx
  annotations:
    cert-manager.io/cluster-issuer: letsencrypt
    # Jira imports are large; most controllers cap request bodies by default.
    nginx.ingress.kubernetes.io/proxy-body-size: "0"
    # A held GET /issues/{key}/await may last 60 s; ingress-nginx's
    # default upstream read timeout is 60 s, so give it headroom or the
    # proxy answers 504 before Kanso does.
    nginx.ingress.kubernetes.io/proxy-read-timeout: "90"
  hosts:
    - host: kanso.example.com
      paths:
        - path: /
          pathType: Prefix
  tls:
    - secretName: kanso-tls
      hosts: [kanso.example.com]
```

When `publicUrl` is left empty, the chart derives it from the first ingress host (`https://` when TLS is configured, `http://` otherwise). That is the value OIDC turns into its `redirect_uri` and the value the server uses to decide on Secure cookies and HSTS, so enabling ingress with TLS is usually all the URL configuration there is. An explicit `publicUrl` always wins.

Nothing about the ingress is required: `kubectl port-forward` reaches the same Service, and a `LoadBalancer` service type is a values change away.

### Scaling out and staying up

The web pods are stateless — all state is in PostgreSQL, sessions are cookie or token based, and River leases each job — so scaling is a replica count:

```yaml
database:
  existingSecret: kanso-db      # scale out ONLY against an external database
replicaCount: 3
autoscaling:                    # optional; needs metrics-server
  enabled: true
  minReplicas: 3
  maxReplicas: 12
  targetCPUUtilizationPercentage: 80
podDisruptionBudget:
  enabled: true                 # rendered only at 2+ replicas
  minAvailable: 2
topologySpreadConstraints:
  - maxSkew: 1
    topologyKey: kubernetes.io/hostname
    whenUnsatisfiable: ScheduleAnyway
    labelSelector:
      matchLabels:
        app.kubernetes.io/name: kanso
```

Scaling out on the **internal** database is a mistake the chart warns about at install time: that StatefulSet is one replica with no high availability and no backups. Point `database.existingSecret` at a real database first.

Resource requests and limits are set by default (100m CPU and 256Mi memory requested, 1Gi memory limit) and are the first thing to raise before a large Jira import. CPU has no limit on purpose — throttling a request-serving pod costs latency and buys nothing.

### Separate worker pods

The Kanso binary has two modes, selected by `KANSO_MODE`:

- **`web`** (the default) — serves the API and the UI **and** runs the job workers in-process. This is the complete product in one pod.
- **`worker`** — runs the job workers only, plus `/healthz` for probes and the served contract endpoints `/api/v1/openapi.yaml` and `/api/v1/jql/grammar`. No data endpoints, no UI.

The chart renders the split with `worker.enabled: true`: a second Deployment running `KANSO_MODE=worker`, with its own `worker.replicaCount`, `worker.resources` and scheduling settings. It adds throughput for webhooks and other background work, and it is never a requirement, because web mode already runs the workers. The web pods own the declarative-configuration reconciler, so the chart mounts no ServiceAccount token on the worker pods; two reconcilers on one namespace would fight.

### Network fencing

`networkPolicy.enabled` (on by default) keeps the internal database reachable only from Kanso pods. Two stricter policies are off by default, because the right answer is cluster-specific and a wrong guess fails silently:

```yaml
networkPolicy:
  ingress:
    enabled: true               # only these sources may reach the UI
    from:
      - namespaceSelector:
          matchLabels:
            kubernetes.io/metadata.name: ingress-nginx
  restrictEgress: true          # SSRF fence for webhooks and other outbound calls
  extraEgressCidrs: ["10.42.0.0/16"]   # your own services, if they are on private ranges
```

**`ingress.enabled`** renders `NetworkPolicy/<fullname>-ingress`: only the sources in `from` reach port 8080 on the web pods (an empty `from` admits any source, on 8080 only). `helm test` connects from the release namespace, so list that namespace too if you rely on it.

**`restrictEgress`** renders `NetworkPolicy/<fullname>-egress` over the web and worker pods. Outbound traffic is confined to DNS (port 53, any address), pods in the release namespace, and public IPv4 ranges — which blocks RFC1918, loopback and the 169.254.0.0/16 metadata range. That is the network-layer SSRF fence for webhook and workflow post-function deliveries, which have no in-process guard of their own.

Everything Kanso legitimately reaches on a private range goes in `extraEgressCidrs` (one rule per CIDR, all ports): an external PostgreSQL, the OIDC issuer, S3, the SMTP relay, the Kubernetes API server when declarative configuration is on, and any in-cluster service in another namespace. Most CNIs match `ipBlock` against the pod IP behind a Service, so list the pod CIDR; behaviour is CNI-dependent, so verify yours. If you cannot list them, leave the fence off.

The fence is IPv4-only: IPv6 destinations outside the namespace are unreachable with it on, and `extraEgressCidrs` accepts IPv4 CIDRs only.

Charts 1.6.0 through 1.24.2 accepted `networkPolicy.ingress.*`, `restrictEgress` and `extraEgressCidrs` but rendered neither policy. If you set them on one of those charts you were not fenced; after upgrading, `kubectl get networkpolicy` should list `<fullname>-ingress` and `<fullname>-egress` (the chart's full name, for example `prod-kanso-ingress` for `helm install prod`).

### Enabling OIDC single sign-on

Local accounts always work; OIDC is optional and additive. Create an OIDC client at your provider with redirect URI `<publicUrl>/api/v1/auth/oidc/callback`, put its client secret in a Secret under key `KANSO_OIDC_CLIENT_SECRET`, then set:

```yaml
publicUrl: https://kanso.example.com
oidc:
  issuerURL: https://keycloak.example.com/realms/main
  clientID: kanso
  providerName: "Acme SSO"      # optional login-button label; defaults to the issuer host
  existingSecret: kanso-oidc    # Secret with key KANSO_OIDC_CLIENT_SECRET
```

All four of issuer URL, client ID, client secret and `publicUrl` must be present, or OIDC stays off: the server logs a warning about partial configuration and keeps local login only. When all four are present, provider discovery runs at boot and a discovery failure is fatal — the pod exits rather than serving a half-working login page. See [Users and authentication](users-and-auth.md).

### S3-compatible attachment storage

By default, attachment bytes live in Kanso's own PostgreSQL — no object store is required. To store **new** attachments in an S3-compatible endpoint instead, put the credentials in a Secret under keys `KANSO_S3_ACCESS_KEY` and `KANSO_S3_SECRET_KEY`, and set:

```yaml
objectStorage:
  endpoint: https://minio.example.com
  bucket: kanso            # chart default
  region: us-east-1        # chart default
  existingSecret: kanso-s3 # Secret with KANSO_S3_ACCESS_KEY, KANSO_S3_SECRET_KEY
```

The server enables S3 only when endpoint, bucket, access key and secret key are all present; otherwise it warns about partial configuration and keeps the built-in store. Existing built-in attachments keep serving after S3 is enabled.

### Declarative configuration (opt-in)

Declarative configuration lets a git repository configure the tracker: `KansoProject` and `KansoWorkflow` custom resources declare desired state, and a reconciler in the Kanso pod converges it through the same store operations the public API uses — PostgreSQL stays the only runtime truth. It is off by default:

```yaml
declarativeConfig:
  enabled: true
```

Enabling it renders a namespace-scoped Role and RoleBinding for the release's ServiceAccount, granting `get` / `list` on `kansoprojects` and `kansoworkflows` and `patch` on their `/status` — no write access to any built-in Kubernetes resource — and mounts the ServiceAccount token on the web pods, which is what switches the reconciler on. With it disabled, no token is mounted and no Role is rendered; everything else works unchanged. The resources themselves are described in [Tracker as code](../integrate/tracker-as-code.md).

Apps do not run as containers: an app is a document Kanso runs in-process (see [App development](../integrate/app-development.md)). `appRuntime.enabled` is still honoured as a deprecated alias of `declarativeConfig.enabled`, so `helm upgrade --reuse-values` keeps the reconciler; `appRuntime.appsImage` is ignored.

### Search values

`search.existingSecret` in the chart values has no effect on behaviour: the binary reads no `KANSO_SEARCH_*` variable, and JQL search runs against PostgreSQL on every install.

### Extra environment variables

`extraEnv` accepts a verbatim list of env entries (name/value or `valueFrom`), appended after the chart's own env — an entry there overrides a same-named variable:

```yaml
extraEnv:
  - name: KANSO_ATTACHMENT_MAX_SIZE
    value: "52428800"
```

## Database migrations

Migrations are applied automatically at every boot, in both modes, before the server starts accepting work:

- The SQL migrations are embedded in the binary and applied in filename order.
- Migrations are forward-only, one transaction per migration, tracked in a `schema_migrations` table the server creates itself.
- Already-applied migrations are skipped; a failing migration aborts boot.

River's own queue-table migrations run the same way, immediately after. There is no separate migration command — pointing the binary at a database is the migration procedure.
