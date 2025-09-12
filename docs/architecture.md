---
sidebar_position: 4
hide_table_of_contents: true
---

# 🏗️ Architecture

## 📋 Table of Contents

1. [Overview](#overview)
2. [Security and Data Concerns](#-security-and-data-concerns)
3. [Stacktic Automation Overview](#-stacktic-automation-overview)
4. [Repository Structure](#-repository-structure)
5. [Metadata and Logic](#-metadata-and-logic)
6. [Component Structure](#-stacktic-structure-components-and-sub-components)
7. [SaaS Deployment Options](#-stacktic-saas-considerations)
8. [Security and Openness](#-security-and-openness)

---

## Overview

The architecture and approach of Stacktic reflect a deep commitment to **security**, **data privacy**, and **operational efficiency**. This document provides a comprehensive breakdown of Stacktic's key architectural components and methodologies.

### Key Principles

| Principle | Description | Implementation |
|-----------|-------------|----------------|
| **Security First** | Zero-trust model, minimal access | Generator-only approach |
| **Data Privacy** | No storage of personal/app data | Metadata-driven design |
| **Automation** | Full lifecycle automation | Day 0-2 coverage |
| **Flexibility** | Adaptable to any requirement | Open platform architecture |

---

## 🔒 Security and Data Concerns

### Core Security Model

Stacktic is a **stack generator**, **not** an operator or deployment agent within your infrastructure.

#### What Stacktic Accesses

| Component | Access Type | Purpose | Data Retention |
|-----------|------------|---------|----------------|
| **Git Repository** | Write access | Push/merge generated code | No retention |
| **Container Registry** | Read/Write | Pull base images, push builds | No retention |
| **Cluster (Optional)** | Read-only via agent | Health monitoring | Metrics only |

#### Security Guarantees

- ✅ Credentials used **only for initialization**
- ✅ **No storage** of personal information or application code
- ✅ Provides **application skeleton** without touching your business logic
- ✅ Optional lightweight **agent** for health monitoring only

### Optional Agent Architecture

The optional agent communicates via API for **health** and **stack layer information** only:
- Used for health checks, security validation, and scaling recommendations
- Outbound communication only
- No application data access

<img width="1119" height="641" alt="Stacktic Diagram" src="https://github.com/user-attachments/assets/56dc189a-c452-4ea0-a4e2-4412d8e39ccf" />

---

## ⚙️ Stacktic Automation Overview

### Complete Lifecycle Automation

Stacktic automates **every layer and step** involved in delivering full-stack applications:

| Phase | Focus | Automated Elements | Outcome |
|-------|-------|-------------------|---------|
| **Day 0 – Architecture** | Design & Planning | Topology, dependencies, resource planning | Complete blueprint |
| **Day 1 – Deployment** | Implementation | Stack generation, configuration, deployment | Running application |
| **Day 2 – Operations** | Management | Scaling, security, monitoring, backups | Operational excellence |

### Automation Scope

The platform interprets **metadata from your UI topology** and automates:
- **Infrastructure** configuration
- **API** gateways and routing
- **Service** connectors and dependencies
- **Security** policies and RBAC
- **Operational** tasks and monitoring

> **Important:** Stacktic automates everything **except your application logic and databases** - maintaining clear separation of concerns.

### Deployment Process

The generated automation is:
- ✅ Committed to your **Git repository**
- ✅ Installable with a **single command**
- ✅ Compatible with existing tools (e.g., **ArgoCD**)
- ✅ Deployable directly to Kubernetes

---

## 📁 Repository Structure

### Design Philosophy

The repository structure combines **Helm** and **Kustomize** for maximum flexibility and maintainability:

#### Helm + Kustomize Integration

| Tool | Purpose | Benefit |
|------|---------|---------|
| **Helm** | Template generation | Parameterized YAML creation |
| **Kustomize** | Overlay management | Environment-specific configs |

- **Helm Chart Templating**: Generates deployment YAML files that feed into Kustomize
- **Kustomize Control**: Defines stack structure with pre-defined overlays
- **Single Command Deployment**: Deploy entire stack on any Kubernetes cloud

### Directory Organization

#### Deployment Structure

```yaml
cat k8s/deploy/overlays/dev/kustomization.yaml
resources:
  - fastapi
  - stack-agent
  - prod
  - dev
  - stage
  - cert-manager
  - minio
  - apisix
  - cnpg
  - rabbitmq
  - keycloak-operator.........
```

#### Base Components Layout

```bash
tree -d k8s/deploy/base/

k8s/deploy/base/
├── apisix
│   ├── crd
│   ├── patch
│   └── secret
├── cert-manager
│   └── issuer
├── cnpg
│   ├── backup
│   ├── jobs
│   ├── patch
│   └── secret
├── dev
│   ├── config
│   ├── files
│   ├── jobs
│   ├── patch
│   └── secret
│       └── cosign
├── fastapi
│   ├── files
│   ├── patch
│   └── secret
├── keycloak-operator
│   ├── crds
│   ├── jobs
│   ├── patch
│   └── secret
├── minio.............
```

#### Documentation and Source Code

**Documentation Structure:**
```bash
tree -d doc             
doc
├── apisix
├── cert-manager
├── cnpg
├── dev
├── fastapi
│   └── images
├── minio
├── prod
├── rabbitmq
├── stack-agent
├── stacktic
│   └── known-issues
└── stage
```

**Source Code Organization:**
```bash
tree -d fastapi 
fastapi
├── day2          # Operational scripts
├── dev_tools     # Development utilities
├── src           # Application source
│   ├── rabbitmq_module
│   └── stack_agent_api_module
└── tests         # Test suites
    └── integration
```

---

## 🧠 Metadata and Logic

### Metadata-Driven Intelligence

Stacktic is a **metadata-driven logic platform** that interprets relationships and generates optimal configurations:

#### Pattern Recognition

From a **single connection** between services, Stacktic understands exactly **what needs to happen**:

| Connection Type | Automated Generation |
|----------------|---------------------|
| **Backend → Database** | • Secrets management<br/>• Dependency resolution<br/>• API connections<br/>• ConfigMaps and environment variables<br/>• Health checks and monitoring<br/>• Backup configuration<br/>• Documentation |
| **Frontend → Backend** | • CORS configuration<br/>• API gateway setup<br/>• Authentication integration<br/>• Rate limiting<br/>• Client SDK generation |
| **Service → Message Queue** | • Topic/queue creation<br/>• Consumer configuration<br/>• Dead letter queues<br/>• Monitoring and alerts |

#### Version Intelligence

The main variables affecting patterns are **version differences**, which influence:
- Dependency compatibility
- Configuration syntax
- Feature availability
- Security requirements

Stacktic **automates the optimal pattern** while adapting to **version-specific dependencies**.

<img width="1016" height="517" alt="image" src="https://github.com/user-attachments/assets/4f64e6d1-2e75-465a-a2d7-61783f5b3d67" />

---

## 🧩 Stacktic Structure: Components and Sub-Components

### Hierarchical Component Model

Stacktic's structure is based on **components** (services) with **sub-components** (specific functionality):

#### Component Examples

| Component Type | Sub-Components | Purpose |
|---------------|---------------|---------|
| **Kafka** | Topics, Consumers, Producers | Message streaming |
| **MongoDB** | Databases, Collections, Users | Document storage |
| **MinIO** | Buckets, Policies, Users | Object storage |
| **PostgreSQL** | Databases, Schemas, Roles | Relational data |

### Connections and Relationships

#### Relationship Types
- **Components** ↔ **Sub-components** (bi-directional)
- **Components** ↔ **Components**
- **Sub-components** ↔ **Components**

#### Configuration Attributes

| Level | Attribute Types | Examples |
|-------|----------------|----------|
| **Components** | Versioning, deployment | Image tags, replicas, resources |
| **Links** | Connection behavior | Protocols, authentication, routing |
| **Sub-components** | Element-specific | Bucket policies, database secrets |

This structure provides **flexibility and precision** while maintaining a clear hierarchy.

<img width="471" height="392" alt="image" src="https://github.com/user-attachments/assets/b63b0da4-ef2d-4a14-8697-4880e69dc0e7" />

---

## 🏢 Stacktic SaaS Considerations

### Multi-Tenant Architecture

Stacktic's **public SaaS** is built on **multi-tenant principles** with **best security practices**:

- ✅ **No storage** of personal application data
- ✅ **Isolated** tenant environments
- ✅ **Encrypted** communications
- ✅ **Compliance** ready (SOC 2, GDPR, HIPAA)

### Flexible Deployment Options

For customers with specific security or compliance requirements:

#### 1. 🌐 **Private Public SaaS**
- **Dedicated instance** for your organization
- **Custom configurations** to meet security requirements
- **IP whitelisting** and firewall rules
- **Isolated backend** management
- **Best for:** Enhanced security needs

#### 2. 🏢 **Private SaaS for Highly Regulated Customers**
- Deploy **within your own clusters**
- **Compliant data centers** or **air-gapped environments**
- Stacktic provides **remote updates** only
- **Full control** of sensitive environments
- **Best for:** Maximum compliance requirements

### Deployment Comparison

| Feature | Public SaaS | Private Public SaaS | Private On-Premises |
|---------|------------|-------------------|-------------------|
| **Management** | Fully managed | Managed with customization | Self-managed with support |
| **Isolation** | Multi-tenant | Single-tenant | Complete isolation |
| **Updates** | Automatic | Scheduled | Controlled |
| **Compliance** | Standard | Enhanced | Custom |
| **Cost** | $ | $$ | $$$ |

---

## 🔐 Security and Openness

### Open Platform Philosophy

Stacktic is an **open platform**, providing:

#### Customization Capabilities
- ✅ **Modify** security measures and policies
- ✅ **Add** custom configurations
- ✅ **Integrate** with existing tools
- ✅ **Extend** functionality as needed

#### Benefits
- **No vendor lock-in** - Full control over generated code
- **Compliance alignment** - Match internal security policies
- **Flexibility** - Adapt to unique requirements
- **Transparency** - All generated code is visible and modifiable

> **Note:** When deploying as **private SaaS** or using the **health-check agent**, you retain full control to modify and enhance security measures according to your organization's policies.

---

## 📚 Summary

### Key Architectural Highlights

| Aspect | Implementation | Benefit |
|--------|---------------|---------|
| **Security Model** | Generator-only, no runtime access | Maximum data privacy |
| **Automation Scope** | Day 0-2 complete lifecycle | 90% reduction in manual work |
| **Repository Structure** | Helm + Kustomize hybrid | Flexibility and maintainability |
| **Metadata Engine** | Pattern recognition and version intelligence | Automated best practices |
| **Component Model** | Hierarchical with relationships | Intuitive and scalable |
| **Deployment Options** | SaaS to air-gapped | Fits any requirement |
| **Platform Openness** | Fully customizable output | No vendor lock-in |

### Next Steps

1. 📖 Review the [Operational Guide](./operational-guide.md) for Day 0-2 workflow
2. 🔒 Explore the [Security Framework](./security-framework.md) for hardening details
3. 🚀 Start with a [Quick Start Guide](./quick-start.md) to build your first stack
4. 💬 Join our [Community](https://stacktic.io/slack) for support

---

*Stacktic - Automating everything except your business logic, so you can focus on what matters.*