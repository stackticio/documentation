---
sidebar_position: 8
hide_table_of_contents: true
---

# 🚀 Migration Guide: Moving to Stacktic

## 📋 Table of Contents

1. [Migration Overview](#migration-overview)
2. [Pre-Migration Assessment](#pre-migration-assessment)
3. [Source Code Migration](#source-code-migration)
4. [Data Migration](#data-migration)
5. [Platform-Specific Migrations](#platform-specific-migrations)
6. [Validation & Cutover](#validation--cutover)
7. [Common Challenges](#common-challenges)

---

## Migration Overview

This guide focuses specifically on **migrating existing applications** to Stacktic. For general Stacktic setup and Day 0-2 operations, refer to the Operational Guide.

### Migration Workflow

```
Assess → Containerize → Import → Migrate Data → Validate → Cutover
```

### How Stacktic Handles Your Code

**Important:** Stacktic doesn't clone your repository. Instead:
- **external_source_code**: Reads your repository and builds using **Kaniko** (in-cluster builds)
- **image_base**: Uses pre-built images from your registry

---

## Pre-Migration Assessment

### What to Prepare Before Starting

| Assessment Area | What to Capture | Why It Matters |
|----------------|-----------------|----------------|
| **Design of existing app** | relations | to understand the topology |
| **Services Versions** | Database versions | to make sure we compatible if the version is old |
| **Data requirements** | messaging, logging | Data pipelines creation |
| **Security demands** | Compliance, protocols, current Secops | for meeting the Sec demands |
| **Auto Scale** | Peaks, size, capacity | Tune app Autoscale |

### Migration Readiness Checklist

- [ ] ENV of source code
- [ ] Versions identified
- [ ] Data backup ready (dumps files)
- [ ] Maintenance window scheduled
- [ ] Rollback plan prepared

---

## Source Code Migration

### Import Options

| Scenario | How to Import | What Happens |
|----------|--------------|--------------|
| **Source code in Git** | Use `external_source_code` component | Stacktic reads repo, builds with Kaniko in-cluster |
| **Pre-built container** | Use `image_base` component | Stacktic pulls existing image from registry |

<img width="474" height="423" alt="image" src="https://github.com/user-attachments/assets/3643398e-06c2-42f8-a829-3f5f05ce27cc" />

### What You Need

For `external_source_code`:
- Git repository with Dockerfile
- Registry credentials for push
- Build args if needed

For `image_base`:
- Container image in registry
- Pull credentials if private

> After importing, configure: ports, UIDs, PVCs, environment variables based on your requirements.

### Add Components and Relationships

<img width="328" height="366" alt="image" src="https://github.com/user-attachments/assets/8158e633-0464-4382-8809-c3df89fc9d5c" />

1. Attach database layer (Postgres, MySQL, MongoDB, Redis, etc.)
2. Declare relationships so app receives connection strings via secrets
3. Optional: Connect to API Gateway for ingress and routing

---

## Data Migration

### Database Migration

Stacktic creates empty databases. You need to import existing data.

<img width="594" height="334" alt="image" src="https://github.com/user-attachments/assets/05efa951-b323-48b7-aa44-8fd01679935a" />

**Options:**
1. **Manual import** - Run your own migration scripts
2. **Bucket automation** - Upload dump to S3/MinIO, Stacktic generates Kubernetes Job to load it

### Migration Scripts

Find in `day0` folder after generating stack:

```
tree mongodb/day0
├── README.md
├── backup-all-db.sh
├── backup.sh
└── restore.sh
```

### File Storage Migration

| Current | Target | Method |
|---------|--------|--------|
| Local files | MinIO bucket | Upload via script |
| NFS/Shared | PVC | Mount and copy |
| Cloud storage | Keep external or migrate | Update connection strings |

---

## Platform-Specific Migrations

### Docker Compose → Stacktic
- Import each service as component
- Convert volumes to PVCs or object storage
- Networks become Kubernetes services automatically

### Heroku → Stacktic
- Convert Procfile to container CMD
- Add-ons become Stacktic components
- Config vars become component attributes

### VMs → Stacktic
- Containerize first (need Dockerfile)
- Move local storage to PVCs/buckets
- Change hardcoded IPs to service names

---

## Validation & Cutover

### Progressive Validation

<img width="768" height="612" alt="image" src="https://github.com/user-attachments/assets/d2bef256-4462-4675-96b1-59af9b651af6" />

Test at each stage:
1. Build successful
2. Pods running
3. Connections working
4. Data accessible
5. Performance acceptable

### Production Readiness

<img width="1471" height="721" alt="image" src="https://github.com/user-attachments/assets/217a3a8e-5519-4cca-a191-2257865bc00e" />

Once stable, enable:
- Logging (Loki)
- Observability (Prometheus + Grafana)
- Auto-scaling (HPA/KEDA)
- Security policies & RBAC

---

## Common Challenges

| Challenge | Symptom | Solution |
|-----------|---------|----------|
| **Kaniko build fails** | Image won't build | Check Dockerfile syntax, ensure all files accessible |
| **Connection refused** | Services can't communicate | Use Kubernetes service names, not localhost |
| **Permission denied** | Container won't start | Adjust SecurityContext, check UIDs |
| **Data not persisting** | Lost after restart | Configure PVCs correctly |
| **Environment vars missing** | App errors | Add to component attributes |

---

## Summary

### Typical Timelines

| Complexity | Duration |
|-----------|----------|
| Simple (1-3 services) | 2-3 days |
| Medium (4-10 services) | 5-7 days |
| Complex (10+ services) | 10-15 days |

Stacktic turns migration into a repeatable process:

> **Design → Import → Tune → Validate → Operate**

Follow these steps and you'll have your legacy workload running as a fully GitOps-managed, observable, and secure Kubernetes stack.

---

*Migration simplified with Stacktic automation.*