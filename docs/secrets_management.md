---
id: secrets_management
title: Secrets Management
sidebar_label: Secrets Management
---

# Centralized Secrets Management

Stacktic automates the full secret lifecycle: from generating secrets at build time, to seeding them into a vault, to syncing them into Kubernetes — all driven by component links.

---

## Architecture

```
┌──────────────────┐     ┌──────────────┐     ┌──────────────────┐
│  Stacktic Build   │────▶│   OpenBao     │────▶│  External Secrets │
│  (generates       │     │  (centralized │     │  Operator (ESO)   │
│   secret values)  │     │   vault)      │     │  (syncs to K8s)   │
└──────────────────┘     └──────────────┘     └──────────────────┘
                                                       │
                                                       ▼
                                               ┌──────────────┐
                                               │  K8s Secrets   │
                                               │  (consumed by  │
                                               │   workloads)   │
                                               └──────────────┘
```

---

## Components

| Component | Role | Link Type |
|-----------|------|-----------|
| **OpenBao** | Centralized secret store (open-source Vault fork) | — |
| **External Secrets Operator** | Syncs secrets from vault to K8s | `external_secrets-openbao` |
| **Seed Job** | Populates OpenBao with all component secrets | Generated when ESO→OpenBao link exists |

---

## How It Works

### Without ESO (Default)

Secrets are rendered as K8s Secrets via kustomize `secretGenerator`:

```yaml
secretGenerator:
  - name: rabbitmq-auth-secret
    namespace: rabbitmq
    envs:
      - secret/rabbitmq.env
```

SOPS encryption applied if `sops_enabled` is set.

### With ESO + OpenBao

When the `external_secrets-openbao` link exists:

| Step | What Happens |
|------|-------------|
| 1. OpenBao init job | Initializes vault, creates unseal key + root token, enables KV v2, creates policies |
| 2. Unseal CronJob | Checks every 5 minutes, auto-unseals if sealed |
| 3. Seed job | Populates OpenBao with all component secrets (idempotent) |
| 4. ClusterSecretStore | ESO connects to OpenBao using root token |
| 5. ExternalSecret CRs | Per-component CRs fetch secrets from OpenBao paths |
| 6. K8s Secrets | ESO creates K8s Secrets with same names as local mode |

Workloads mount the same K8s Secret names regardless of which mode is active.

---

## OpenBao Initialization

The init job runs once and performs:

| Step | Action |
|------|--------|
| 1 | Wait for OpenBao readiness (polls up to 30 times) |
| 2 | Initialize with 1 key share / 1 threshold |
| 3 | Store unseal-key + root-token in K8s Secret `{name}-init-keys` |
| 4 | Unseal if sealed |
| 5 | Enable KV v2 at `secret/` path |
| 6 | Enable userpass auth |
| 7 | Create `admin` policy (full access) |
| 8 | Create admin user with password from attributes |
| 9 | Create `eso-read` policy (read/list on `secret/data/*` and `secret/metadata/*`) |

**Critical**: The `{name}-init-keys` K8s Secret holds the unseal key and root token. Loss of this secret = vault inaccessible.

---

## Seed Job — Components & Secrets

The seed job populates OpenBao with secrets for 13 component types. Uses `seed_if_missing` — idempotent, never overwrites existing secrets.

### Secret Path Convention

```
secret/data/{system_name}/{component_name}[/{sub_component}]
```

Example: `secret/data/stack-3/cnpg/backend-db`

### Seeded Components

| Component | Secrets | Per Sub-Component |
|-----------|---------|-------------------|
| **rabbitmq** | erlang-cookie, password | No |
| **cnpg** | admin-username, admin-password | Yes — per database: username, password |
| **mongodb** | 10 cluster secrets (5 user pairs) | Yes — per database: database, username, password, connection_string |
| **grafana** | admin-user, admin-password | No |
| **prometheus** | smtp_smarthost, smtp_from, smtp_auth_username, smtp_auth_password, slack_api_url | No |
| **keycloak_operator** | DB creds + admin creds + client secret (3 paths) | No |
| **seaweedfs** | access_key, secret_key | Yes — per bucket: access_key, secret_key, bucket |
| **opensearch** | admin_password | No |
| **postgresql** | admin-password | Yes — per database: username, password |
| **valkey** | password | No |
| **redis** | password | No |
| **clickhouse** | admin_password | Yes — per database: username, password |
| **argo_cd** | admin_password | No |

---

## Template Detection Pattern

Every component template that manages secrets checks for ESO in `pre_gen_project.py`:

```python
{% for comp in cookiecutter.components.values() if comp.type == "external_secrets" %}
{{ cookiecutter.update({"__external_secrets": comp }) }}
{% endfor %}
```

### Conditional Secret Generation

When `__external_secrets` is set:

| What Changes | Without ESO | With ESO |
|-------------|-------------|----------|
| Secret source | `secretGenerator` in kustomization.yaml | `ExternalSecret` CR |
| Secret file | `secret/database-secret.yaml` included | Removed from resources |
| ESO CR | Not generated | `external-secret.yaml` included |
| K8s Secret name | Same | Same (transparent to workloads) |

Templates with ESO detection: cnpg, rabbitmq, mongodb, grafana, prometheus, keycloak_operator, kafka, opensearch, loki, langfuse, open-webui, fastapi, fastmcp.

---

## ExternalSecret CR Structure

```yaml
apiVersion: external-secrets.io/v1
kind: ExternalSecret
metadata:
  name: {component}-superadmin
  namespace: {namespace}
spec:
  refreshInterval: 1h              # Auto-sync frequency
  secretStoreRef:
    kind: ClusterSecretStore
    name: external-secrets          # References the ClusterSecretStore
  target:
    name: superadmin-secret         # K8s Secret name (same as local mode)
    creationPolicy: Owner
  data:
    - secretKey: username
      remoteRef:
        key: secret/data/{system}/{component}
        property: admin-username
    - secretKey: password
      remoteRef:
        key: secret/data/{system}/{component}
        property: admin-password
```

ESO controller syncs secrets every `refreshInterval` (default 1h). Password rotations in OpenBao propagate automatically.

---

## ClusterSecretStore Providers

| Provider | Attribute Value | Auth Method |
|----------|----------------|-------------|
| OpenBao / Vault | `vault` | Token from K8s Secret |
| AWS Secrets Manager | `aws` | Access key + secret key |
| GCP Secret Manager | `gcp` | Service account JSON |
| Azure Key Vault | `azure` | Client ID + client secret |

Set via `secret_store_provider` attribute on the external_secrets component.

---

## Key Attributes

### External Secrets

| Attribute | Description |
|-----------|-------------|
| `secret_store_provider` | Provider type: vault, aws, gcp, azure |
| `secret_store_host` | Vault/OpenBao URL |
| `secret_store_path` | KV mount path (default: `secret`) |
| `secret_store_version` | KV version (default: `v2`) |
| `refresh_interval` | Sync frequency (default: `1h`) |

### OpenBao

| Attribute | Description |
|-----------|-------------|
| `admin_password` | Admin user password |
| `port` | Service port (default: 8200) |
| `pvc_size` | Persistent volume size |
| `storageclass` | Storage class for PVC |

---

## No Circular Dependencies

```
OpenBao init-job (standalone, no ESO dependency)
       ↓
ESO seed-job (needs OpenBao initialized + token)
       ↓
ESO controller (reads ClusterSecretStore → OpenBao)
       ↓
K8s Secrets created (workloads can start)
```

OpenBao initializes independently. ESO depends on OpenBao being ready. Workloads depend on K8s Secrets existing.
