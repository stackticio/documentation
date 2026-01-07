---
sidebar_label: 'Private SaaS Deployment'
description: 'Quick Summary - Deploy Stacktic in your own infrastructure. Simple config, single command - done.'
---

# Private SaaS Deployment

> **Quick Summary** - Deploy Stacktic in your own infrastructure. Simple config, single command - done.

---

## Overview

**Private SaaS** means Stacktic runs entirely in your infrastructure:

- Your domain
- Your registry
- Your cluster
- Your data

You control everything. Stacktic can push updates if you want them.

### Why Private SaaS?

| Benefit | Why It Matters |
|---------|----------------|
| **Data Sovereignty** | Your data never leaves your infrastructure |
| **Compliance** | Meet any regulatory requirement |
| **Air-Gap Ready** | Can run completely offline |
| **Your Domain** | Use your own branding |
| **Full Control** | You decide when to update |

---

## Prerequisites

| Need | Details |
|------|---------|
| **Kubernetes** | Version 1.24+ (any cloud or on-prem) |
| **Registry** | Your private registry |
| **Domain** | A domain you control |
| **Storage** | Persistent storage |

**Resources:**

- 2+ nodes
- 4+ CPU cores
- 8GB+ RAM
- 50GB+ storage

---

## Installation

### Step 1: Get the Repo

Contact Stacktic team for the private SaaS repo.

```bash
git clone <private-saas-repo-url>
cd stacktic-private-saas
```

---

### Step 2: Edit Config

Simple YAML file with your details:

**File:** `values.yaml`

```yaml
registry: registry.yourcompany.com
domain: stacktic.yourcompany.com
environment: production

# Database restore
database:
  restore: true
  dumpFile: stacktic_saas.dump

# Updates (optional)
updates:
  enabled: true
```

Done. That's the whole config.

---

### Step 3: Deploy

Single command:

```bash
kubectl apply -k k8s/deploy/overlays/production \
  --server-side=true \
  --force-conflicts=true
```

**What happens automatically:**

- Builds and pushes images to your registry
- Deploys PostgreSQL cluster with HA
- Restores database
- Deploys API, UI, workers
- Configures domain and TLS
- Applies security policies
- Ready to use

**Check status:**

```bash
kubectl get pods -n stacktic-saas -w
```

---

### Step 4: Access

Open browser:

```
https://stacktic.yourcompany.com
```

Login with credentials from Stacktic team.

> Change password after first login.

---

## Updates

### With Internet Connection

Stacktic will push updates remotely to your database.
You will get pre-notification.

### Air-Gap

Move to air-gapped environment.
See versioning/migration documentation.

---

## Troubleshooting

### Pods Not Starting

```bash
kubectl get pods -n stacktic-saas
kubectl logs <pod-name> -n stacktic-saas
```

**Check:**

- Registry credentials in values.yaml
- Cluster has enough resources
- Database is ready

### Can't Access UI

```bash
kubectl get apisixroutes.apisix.apache.org -A
```

**Example output:**

```
NAMESPACE        NAME               HOSTS                            URIS     AGE
ingress-apisix   agent-route        ["agent.app.stacktic.io"]        ["/*"]   11d
ingress-apisix   develop-route      ["develop.app.stacktic.io"]      ["/*"]   11d
ingress-apisix   fastapi-route      ["fastapi.app.stacktic.io"]      ["/*"]   11d
ingress-apisix   grafana-route      ["grafana.app.stacktic.io"]      ["/*"]   11d
```

**Check:**

- DNS points to cluster
- TLS certificate is valid

---

## Support

| Contact | When |
|---------|------|
| [support@stacktic.io](mailto:support@stacktic.io) | Technical issues |
| [emergency@stacktic.io](mailto:emergency@stacktic.io) | Urgent (24/7 enterprise) |

---

## Summary

### Installation Checklist

- [ ] Get Stacktic private repo
- [ ] Edit `values.yaml` (registry, domain)
- [ ] Run single deploy command
- [ ] Access via browser
- [ ] Change password

### What You Get

- Complete Stacktic platform in your infrastructure
- Full data sovereignty
- Update control
- No vendor dependency

**Time to deploy:** 30 minutes

---

*Stacktic Private SaaS: Your infrastructure, your control.*
