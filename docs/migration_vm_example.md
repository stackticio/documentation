---
sidebar_label: 'Example: VM to Kubernetes'
description: 'Quick Summary - Migrate VMs to Kubernetes in days, not months. Design your topology in Stacktic - everything else is automated.'
---

# Migration Example: VM to Kubernetes

> **Quick Summary** - Migrate VMs to Kubernetes in days, not months. Design your topology in Stacktic - everything else is automated.

---

## Table of Contents

1. [Chapter 1: Overview](#chapter-1-overview)
   - [Migration Timeline](#migration-timeline)
   - [What You'll Learn](#what-youll-learn)
2. [Chapter 2: Why Migrate?](#chapter-2-why-migrate)
   - [VM vs Kubernetes Comparison](#vm-vs-kubernetes-comparison)
3. [Chapter 3: Why Stacktic?](#chapter-3-why-stacktic)
   - [Time Comparison](#time-comparison)
4. [Chapter 4: How It Works](#chapter-4-how-it-works)
   - [Migration in 3 Steps](#migration-in-3-steps)
5. [Chapter 5: Complete Migration Example](#chapter-5-complete-migration-example)
   - [The Application Before Migration](#the-application-before-migration)
   - [VM Architecture Components](#vm-architecture-components)
   - [Migration Journey](#migration-journey)
   - [Step 1: Design Topology](#step-1-design-topology-in-stacktic)
   - [Step 2: Migrate Code and Data](#step-2-migrate-code-and-data-dumps)
   - [Step 3: Add Modern Capabilities](#step-3-add-modern-capabilities)
6. [Next Steps](#next-steps)

---

## Chapter 1: Overview

This guide walks through a **real-world VM-to-Kubernetes migration** using Stacktic. We'll take a traditional VM-based application stack and migrate it to a modern, cloud-native Kubernetes environment with minimal effort and maximum automation.

### Migration Timeline

| Traditional Approach | With Stacktic |
|----------------------|---------------|
| **3-6 months** manual work | **Days to weeks** automated |
| Complex YAML configurations | Visual topology design |
| Manual networking setup | Auto-generated manifests |
| Security configured after | Security built-in from start |

### What You'll Learn

- **Design** your Kubernetes topology in Stacktic (replicate your VM architecture)
- **Migrate** code and data dumps (containerization and data migration)
- **Modernize** with observability, security, and GitOps

### The Migration Process (Visual Overview)

<iframe src="/documentation/migration-stacktic.html" width="100%" height="850px" frameBorder="0" title="VM Migration to Kubernetes - 4 Simple Steps"></iframe>

---

## Chapter 2: Why Migrate?

### VM vs Kubernetes Comparison

| Benefit | VMs | Kubernetes |
|---------|-----|------------|
| **Cost** | 20-30% utilization, over-provisioned | 60-80% utilization = **40-60% cost savings** |
| **Scaling** | Manual, slow | Automatic, instant |
| **Deployment & Operation** | Hours/days | Minutes |
| **HA/DR** | 2x-3x duplicate infrastructure | Built-in replicas and auto-scaling |
| **Modern Tech** | Old, legacy | Adoptable, secure, revenue driven |

---

## Chapter 3: Why Stacktic?

**Traditional migration:** Each app = months of manual work and planning
**With Stacktic:** Design once - Everything auto-generated

### Time Comparison

| Apps | Traditional | Stacktic | Savings |
|------|-------------|----------|---------|
| 5 apps | 10-20 months | 2-4 weeks | **90% faster** |
| 10 apps | 20-40 months | 4-8 weeks | **90% faster** |
| 20 apps | 3-7 years | 2-4 months | **90% faster** |

---

## Chapter 4: How It Works

### Migration in 3 Steps

| Step | What You Do | Time |
|------|-------------|------|
| **1. Map** | List VMs, services, connections, versions | 1-2 days |
| **2. Design** | Drag components in Stacktic - Draw connections - Click "Generate" | 4-8 hours |
| **3. Deploy** | Containerize apps - Migrate data - Deploy to production | 1-3 days |

**Total:** 3-7 days per application

---

### What You Get

Click "Generate" - Stacktic creates:

- Kubernetes manifests (Deployments, Services, StatefulSets)
- Security (RBAC, NetworkPolicy, secrets encryption)
- Connections (Secrets, ConfigMaps, DNS, env vars)
- Monitoring (Prometheus, Grafana)
- Multi-environment configs (dev/staging/prod)
- Documentation

---

## Chapter 5: Complete Migration Example

> **This is YOUR VM Infrastructure** - Below is a real-world example showing a traditional VM-based data center. We'll show you exactly how to migrate it to Kubernetes in 3 simple steps.

---

### The Application Before Migration

**Traditional VM-Based Data Center Infrastructure:**

<iframe src="/documentation/example-vm-app.html" width="100%" height="900px" frameBorder="0" title="Traditional Data Center Infrastructure Example"></iframe>

---

### VM Architecture Components

**Your current VM infrastructure:**

| Component | Type | Details |
|-----------|------|---------|
| **Python App VM** | Application Server | Python microservice running on dedicated VM |
| **Spring App VM** | Application Server | Spring Boot application on separate VM |
| **PostgreSQL VM** | Database Server | Primary relational database |
| **MongoDB VMs** | Database Cluster | Sharded MongoDB cluster across multiple VMs |
| **RabbitMQ VM** | Message Queue | Message broker for async processing |
| **Load Balancer** | Network | Hardware load balancer |
| **Firewall** | Network | Manual firewall rules between VMs |

**Challenges with this architecture:**

- Each VM over-provisioned (20-30% utilization)
- Manual configuration and networking
- Slow scaling (hours to provision new VMs)
- High operational overhead
- No automated deployments

---

### Migration Journey

> **Here's How We'll Migrate This:**

| Step | What You Do | Stacktic Does For You | Result | Time |
|------|-------------|----------------------|--------|------|
| **1. Design Topology** | Map VMs to K8s components, Drag & drop in Stacktic UI, Draw connections, Click "Generate" | Auto-generates all manifests, Creates NetworkPolicies, Sets up RBAC & secrets, Configures service mesh | All infrastructure code ready | **4-8 hours** |
| **2. Import Code & Data** | Provide source code & repos, Export database dumps from VMs | **Stacktic AI dockerizes your apps**, Generates Dockerfiles & CI/CD, **Assists with data migration**, Creates import scripts | Apps containerized, data migrated | **1-2 days** |
| **3. Add SRE/SecOps** | Select tools from Stacktic catalog, Connect monitoring & security | Auto-configures Prometheus/Grafana, Sets up Trivy & OPA policies, Integrates ArgoCD GitOps, Configures Keycloak auth | Production-ready stack | **2-4 hours** |

**Total Migration Time: 3-5 days** (vs. 3-6 months traditional approach)

---

**Let's walk through each step in detail:**

---

### Step 1: Design Topology in Stacktic

**Map your VM components to Kubernetes:**

| From VM | To Kubernetes Component |
|---------|------------------------|
| **Python App VM** | Python application (containerized) |
| **Spring App VM** | Spring application (containerized) |
| **PostgreSQL VM** | PostgreSQL database (CNPG) |
| **MongoDB VMs** | MongoDB cluster (sharded) |
| **RabbitMQ VM** | RabbitMQ messaging |
| **Load Balancer** | API Gateway (APISIX) |
| **Firewall** | NetworkPolicies (auto-generated) |

**Design in Stacktic (drag & drop):**

**What you see:**

- `python` - Python application (from VM)
- `spring` - Spring application (from VM)
- `db` + `cnpg` - PostgreSQL database
- `mongo_db` + `shard` + `stage` + `mongodb` - MongoDB cluster
- `rabbitmq` + `exchange` + `queue` - RabbitMQ messaging
- `apisix` -> `python` - API gateway routing
- `apisix` -> `opensearch` - Log routing

**At this point:** You've designed your basic application topology. Stacktic will generate all manifests, connections, secrets, and networking.

---

### Step 2: Migrate Code and Data Dumps

#### Dockerize Your Applications

**Option 1: Automated VM to Container Conversion**

Stacktic provides an automated end-to-end solution to convert VMs to containers:

<iframe src="/documentation/vm-migration-process.html" width="100%" height="900px" frameBorder="0" title="VM to Container Conversion Process"></iframe>

**Option 2: Bring Your Own Docker Images**

If you prefer manual control or already have containers:

- Use your existing Dockerfiles
- Import pre-built images from your registry
- Stacktic integrates with any container registry (Docker Hub, ECR, GCR, etc.)

#### Import Data to Kubernetes

**Stacktic Assists with Data Migration:**

**For PostgreSQL:**

```bash
# Export from VM
pg_dump -h old-vm -U postgres prod > prod_backup.dump

kubectl exec -i -n cnpg cluster-cnpg-1 -- pg_restore -U postgres -d prod --clean --if-exists --no-owner --no-acl < prod_backup.dump
```

**For MongoDB:**

- Stacktic provides migration scripts for sharded clusters
- Handles data replication and validation
- Ensures zero-downtime migration strategies

**At this point:** Your application code is containerized (by Stacktic AI or manually) and your data is migrated into the new Kubernetes environment with Stacktic's assistance.

---

### Step 3: Add Modern Capabilities

Add monitoring, security, GitOps from the Stacktic catalog:

**Added:** Prometheus, Grafana, Trivy, ArgoCD, Keycloak, OPA, K6

**Result:** Same apps + modern observability, security, GitOps - All auto-configured

---

## Next Steps

Ready to migrate?

**Contact:** [support@stacktic.io](mailto:support@stacktic.io) for migration planning and architecture review
