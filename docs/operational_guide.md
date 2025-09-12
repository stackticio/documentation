---
sidebar_position: 7
hide_table_of_contents: true
---
# 📘 Stacktic Operational Guide: Complete Day 0–2 Workflow

## 📋 Table of Contents

### Quick Navigation
1. [Executive Overview](#executive-overview)
2. [Introduction & Objectives](#introduction--objectives)
3. [Prerequisites & Requirements](#prerequisites--requirements)
4. [Day 0: Architecture & Design](#day-0-architecture--design)
   - [4.1 Application Topology Design](#41-application-topology-design)
   - [4.2 Import Strategies](#42-import-strategies)
   - [4.3 Base Stack Construction](#43-base-stack-construction)
   - [4.4 Scale Planning & Forecasting](#44-scale-planning--forecasting)
   - [4.5 Database Initialization](#45-database-initialization)
5. [Day 1: Deployment & Environment Setup](#day-1-deployment--environment-setup)
   - [5.1 Production Preparation](#51-production-preparation)
   - [5.2 Operational Components](#52-operational-components)
6. [Day 2: Operations & Management](#day-2-operations--management)
   - [6.1 Security Hardening](#61-security-hardening)
   - [6.2 Version Management](#62-version-management)
   - [6.3 Operational Readiness](#63-operational-readiness)
   - [6.4 Monitoring & Observability](#64-monitoring--observability)
7. [Best Practices & Guidelines](#best-practices--guidelines)
8. [Troubleshooting & FAQ](#troubleshooting--faq)
9. [Next Steps & Resources](#next-steps--resources)

---

## 🎯 Executive Overview

### What This Guide Delivers
**Stacktic** transforms your application **from concept to production-ready full stack in minutes**. This comprehensive guide provides a structured workflow covering:

| Phase | Focus | Outcome |
|-------|-------|---------|
| **Day 0** | Architecture & Topology | Complete application design with all components |
| **Day 1** | Deployment & Setup | Multi-environment deployment ready |
| **Day 2** | Operations & Security | Production-grade operations with full observability |

### Time to Production
- **Traditional Approach:** 4-6 weeks
- **With Stacktic:** 2-3 days
- **Time Saved:** ~90%

---

## 🚀 Introduction & Objectives

### Learning Objectives
After completing this guide, you will be able to:
- ✅ Design complex application topologies using Stacktic components
- ✅ Import and configure existing code and containers
- ✅ Deploy multi-environment setups (dev, staging, production)
- ✅ Implement enterprise-grade security and compliance
- ✅ Establish Day 2 operations including monitoring, backup, and scaling

### Target Audience
- **DevOps Engineers** - Streamline deployment workflows
- **Platform Engineers** - Build standardized stacks
- **SRE Teams** - Implement operational excellence
- **Security Teams** - Ensure compliance and hardening

---

## 📋 Prerequisites & Requirements

### Technical Requirements
| Component | Requirement | Notes |
|-----------|------------|-------|
| **Kubernetes Cluster** | 1.24+ | EKS, GKE, AKS, or local |
| **Stacktic Account** | Active subscription | Free trial available |
| **Source Code Access** | Git repositories | GitHub, GitLab, Bitbucket |
| **Container Registry** | Write access | For image deployments |

### Knowledge Prerequisites
- Basic Kubernetes concepts
- Understanding of microservices architecture
- Familiarity with Git workflows

---

## 📅 Day 0: Architecture & Design

### Chapter Overview
Day 0 focuses on **designing your application architecture** and establishing the foundation for your stack.

---

### 4.1 🧩 Application Topology Design

#### Getting Started
Begin by designing your application using Stacktic's visual topology builder:

##### Core Components Setup
- ✅ Define **databases** (PostgreSQL, MongoDB, Redis)
- ✅ Configure **backend services** (APIs, microservices)
- ✅ Design **frontend applications** (React, Vue, Angular)
- ➕ Use the **"+"** icon on each service to explore available links

#### Component Linking Strategy
| From Component | To Component | Link Type | Purpose |
|---------------|--------------|-----------|---------|
| Backend | Database | Data connection | Persistent storage |
| Frontend | Backend | API connection | Business logic |
| API Gateway | Backend | Routing | External access |
| Cache | Backend | Performance | Response optimization |

---

### 4.2 🔗 Import Strategies

#### Choose Your Import Method

##### Option 1: Import Source Code
Use the `external_source_code` component for direct repository integration:

<img src={require('./image-21.png').default} alt="alt text" width="500" />

**Best for:**
- Active development environments
- CI/CD integration
- Automated builds

##### Option 2: Import Container Images
Use the `image_base` component for pre-built containers:

<img src={require('./image-20.png').default} alt="alt text" width="500" />

**Best for:**
- Production deployments
- Third-party services
- Stable releases

> 💡 **Pro Tip:** After importing, adjust settings such as:
> - Container ports configuration
> - UID/GID numbers for security
> - PVC enablement for persistent storage
> - Environment-specific configurations

---

### 4.3 🏗️ Base Stack Construction

#### Building Your Foundation

Create a comprehensive base stack including:

![alt text](image-15.png)

##### Essential Components
1. **Backend Services** - API endpoints, business logic
2. **Data Layer** - Databases, caches, message queues
3. **API Gateway** - External access, routing, rate limiting
4. **Authentication** - Identity providers, OIDC/SAML

#### Extending Functionality
Add advanced capabilities like **API endpoints** or **messaging services**:

![alt text](image-16.png)

---

### 📦 Demo: Initial App Topology
**See it in action!** Click below to watch the demo:  
[![Demo Video](https://via.placeholder.com/640x480.png?text=Click+to+Play+Video)](https://video.wixstatic.com/video/06ddae_156895725d83421bae1cc5e90362b682/1080p/mp4/file.mp4)

---

### 4.4 🔧 Scale Planning & Forecasting

#### Capacity Planning Inputs

Provide forecast values on components for **intelligent scaling recommendations**:

| Metric | Description | Example | Impact |
|--------|-------------|---------|--------|
| **RPS** | Requests per second | 1000 RPS | CPU/Memory sizing |
| **IO** | Storage I/O estimates | 500 IOPS | Disk performance |
| **Connections** | Concurrent users | 5000 | Connection pooling |
| **Bandwidth** | Network throughput | 100 Mbps | Network capacity |

<img width="897" alt="image" src="https://github.com/user-attachments/assets/73c7644a-355b-4476-923f-cf0f724235de" />

#### Cost Analysis Report
Review the **scale cost report** for production planning:

<img width="1442" alt="image" src="https://github.com/user-attachments/assets/f112ff77-92f1-4c2f-9043-cd7665873511" />

---

### 4.5 🗄️ Database Initialization

#### Important Note
**Stacktic creates empty databases by default.** You'll need to import your data into the Kubernetes cluster.

#### Migration Options

##### Automated Migration (Recommended)
Use bucket jobs for automated data migration (covered in migration chapter)

##### Manual Migration Scripts
Find import scripts in the `data` components' Day 0 folder:

```bash
tree mongodb/day0
mongodb/day0
├── README.md
├── backup-all-db.sh
├── backup.sh
└── restore.sh
```

---

## 📅 Day 1: Deployment & Environment Setup

### Chapter Overview
Day 1 transforms your design into deployable environments with operational readiness.

---

### 5.1 🛠️ Production Preparation

#### Multi-Environment Strategy

With your base skeleton ready, create production-ready environments:

| Environment | Purpose | Configuration |
|------------|---------|---------------|
| **Development** | Feature development | Minimal resources, debug enabled |
| **Staging** | Pre-production testing | Production-like, synthetic data |
| **Production** | Live system | Full resources, monitoring, backups |

#### Implementation Approach
- 🔄 Create environments (**dev**, **staging**, **prod**)
- 🔐 Add **security layers** (NetworkPolicies, RBAC)
- 💾 Deploy **backup solutions** (Velero, snapshots)
- 📊 Enable **Day 2 operational components**

> **💡 Best Practice:** 
> - Use `external_source_code` for active development
> - Use `image_base` for production deployments
> - For dev/staging with custom CI, `image_base` works well

![alt text](image-17.png)

---

### 5.2 ➕ Operational Components

#### Essential Operational Stack

Extend your infrastructure with critical operational tools:

![alt text](image-22.png)

##### Component Breakdown

| Component | Purpose | Auto-Generated Assets |
|-----------|---------|----------------------|
| **Velero** | Backup & Restore | Backup pipelines, restore procedures, schedules |
| **ArgoCD** | GitOps Deployment | Application manifests, sync policies |
| **Prometheus** | Metrics Collection | Service monitors, alert rules |
| **Grafana** | Visualization | Preconfigured dashboards, data sources |
| **Loki** | Log Aggregation | Log streams, queries |

#### Integration Benefits
- **Prometheus → Services:** Automatic metric scraping
- **Prometheus → Grafana:** Pre-built dashboards per service
- **ArgoCD → Git:** Automated deployment on commit
- **Velero → Storage:** Scheduled backups with retention

---

## 📅 Day 2: Operations & Management

### Chapter Overview
Day 2 ensures your stack is production-ready with enterprise-grade security, monitoring, and operational excellence.

---

### 6.1 🔐 Security Hardening

#### Comprehensive Security Implementation

##### Security Layers

**1. OPA Policy Enforcement**
- Add Open Policy Agent rules for compliance
- Enforce security standards automatically
- Validate configurations before deployment

**2. RBAC Configuration**
Implement role-based access control:
- Include RBAC components in topology
- Link users/groups to appropriate services
- Examples:
  - Data teams → MongoDB access
  - Ops groups → Backend service management
  - Security teams → Audit log access

![alt text](image-23.png)

**3. Source Code Security Hardening**
Stacktic automatically adjusts security settings:

<img src={require('./image-24.png').default} alt="alt text" width="500" />

##### Security Checklist
- ✅ SecurityContext configuration
- ✅ Network policies enabled
- ✅ Pod security standards
- ✅ Secret management
- ✅ Image scanning
- ✅ Admission controllers

> ⚠️ **Warning:** Overly strict settings may disrupt your application. Test thoroughly in staging.

#### CISO Audit Report

Stacktic generates a comprehensive **CISO Audit Report** automatically:

![alt text](image-32.png)

**Report Includes:**
- Real-time security assessment
- Compliance status (CIS, PCI-DSS, HIPAA)
- Vulnerability analysis
- Remediation recommendations
- Risk scoring

---

### 6.2 📦 Version Management

#### Version Control Strategy

Stacktic provides powerful version management capabilities:

![alt text](image-25.png)

##### Version Control Features

| Feature | Description | Use Case |
|---------|-------------|----------|
| **Stack Versioning** | Save complete stack configurations | Environment snapshots |
| **Component Versioning** | Individual service versions | Gradual rollouts |
| **Branch Management** | Create version branches | A/B testing, experiments |
| **Rollback Capability** | Instant version reversal | Emergency recovery |

#### Component Version Updates

Change component versions easily:

<img src={require('./image-26.png').default} alt="alt text" width="300" />

#### Version Notifications

Receive alerts for new versions and changes:

<img src={require('./image-27.png').default} alt="alt text" width="500" />

> 💡 **Best Practice:** Always test version upgrades in **staging** before production deployment.

#### Configuration Management

Use the **Sections** area for centralized management:

![alt text](image-28.png)

![alt text](image-29.png)

##### Custom Sections
Create custom groupings for specific needs:

![alt text](image-30.png)

---

### 6.3 🗂️ Operational Readiness

#### Day-2 Operations Structure

Review and understand your operational configuration:

![alt text](image-31.png)

#### Automated Backup Configuration

Velero integration creates comprehensive backup strategies:

```bash
tree velero/day2
velero/day2
├── README.md
├── backup
│   ├── mongodb-backup.yaml
│   └── opensearch-backup.yaml
├── restore
│   ├── mongodb-restore.yaml
│   └── opensearch-restore.yaml
└── schedule
    ├── mongodb-schedule.yaml
    └── opensearch-schedule.yaml
```

**Backup Features:**
- Automated scheduling
- Point-in-time recovery
- Cross-region replication
- Disaster recovery procedures

---

### 6.4 📊 Monitoring & Observability

#### Comprehensive Monitoring Stack

##### Out-of-the-Box Dashboards
Stacktic provides maintained, auto-updating dashboards for:
- Infrastructure metrics
- Application performance
- Business KPIs
- Security events

##### Live View Capabilities

Stacktic's **Live View** provides deep, relationship-aware insights:

![alt text](image-33.png)

![alt text](image-34.png)

**Live View Features:**

| Check Type | Description | Frequency |
|------------|-------------|-----------|
| **API Health** | Endpoint availability and latency | 30 seconds |
| **Data Component Health** | Database connectivity and performance | 1 minute |
| **Route Scanning** | Ingress and service mesh validation | 2 minutes |
| **SSL Health** | Certificate expiry and validation | 1 hour |
| **Security Validation** | Policy compliance tests | 5 minutes |

---

## 📚 Best Practices & Guidelines

### Deployment Best Practices

| Practice | Description | Benefit |
|----------|-------------|---------|
| **Environment Parity** | Keep environments similar | Reduces production surprises |
| **Gradual Rollouts** | Deploy to staging first | Catches issues early |
| **Version Pinning** | Lock critical component versions | Stability assurance |
| **Resource Limits** | Set CPU/memory constraints | Prevents resource exhaustion |
| **Health Checks** | Configure liveness/readiness probes | Automatic recovery |

### Security Best Practices

1. **Least Privilege** - Grant minimal required permissions
2. **Defense in Depth** - Multiple security layers
3. **Regular Updates** - Keep components current
4. **Audit Logging** - Track all changes
5. **Encryption** - TLS everywhere, encrypted storage

---

## ❓ Troubleshooting & FAQ

### Common Issues & Solutions

| Issue | Symptoms | Solution |
|-------|----------|----------|
| **Import Failure** | Code won't import | Check repository permissions |
| **Scaling Issues** | Pods not scaling | Verify metrics server installation |
| **Network Policies** | Services can't communicate | Review policy rules |
| **Backup Failures** | Velero errors | Check storage credentials |
| **Monitoring Gaps** | Missing metrics | Ensure ServiceMonitor labels |

### Frequently Asked Questions

**Q: How long does the full Day 0-2 process take?**
A: Typically 2-3 days for a production-ready stack

**Q: Can I skip Day 1 and go directly to Day 2?**
A: Not recommended - Day 1 establishes critical foundations

**Q: How do I handle existing applications?**
A: Use the migration tools and import features

---

## 🚀 Next Steps & Resources

### Recommended Learning Path

1. ✅ Complete this Day 0-2 workflow
2. 📖 Review the Security Framework documentation
3. 🔄 Explore CI/CD integration options
4. 📊 Master the monitoring stack
5. 🎯 Implement advanced features (service mesh, ML ops)

### Additional Resources

- 📚 [Stacktic Documentation](https://docs.stacktic.io)
- 🎥 [Video Tutorials](https://stacktic.io/tutorials)
- 💬 [Community Slack](https://stacktic.io/slack)
- 📧 [Support Portal](https://support.stacktic.io)
- 🎓 [Training Programs](https://stacktic.io/training)

### Get Support

| Support Type | Contact | Response Time |
|-------------|---------|--------------|
| **Community** | Slack channel | < 24 hours |
| **Standard** | support@stacktic.io | < 8 hours |
| **Enterprise** | Dedicated channel | < 1 hour |
| **Emergency** | Hotline (Enterprise) | < 15 minutes |

---

## 🎯 Summary

You've now mastered the complete Stacktic workflow from **architecture to production operations**. Your stack is:

✅ **Professionally Designed** - Following best practices  
✅ **Fully Deployed** - Across multiple environments  
✅ **Operationally Ready** - With monitoring and backups  
✅ **Security Hardened** - Meeting compliance standards  
✅ **Future-Proof** - Ready for scaling and evolution  

---

*Transform your infrastructure from idea to production in minutes, not months.*

**Version:** 2.0  
**Last Updated:** September 2025  
**© Stacktic - Intelligent Stack Automation**