---
sidebar_position: 1
hide_table_of_contents: true
---

# 🚀 Introduction to Stacktic


---

> **Note**  
> This guide does **not** represent the full set of capabilities or guidelines for each service.  
> Detailed information is generated directly within the **application stack repository**, which contains the complete, up-to-date reference.  
> The purpose of this guide is to **explain key concepts** and provide **examples** of our framework, automation, and solutions.  
> For comprehensive details on every feature and service, please refer to the **stack documentation**.

___

**Stacktic** is a new concept in full-stack management - a logic framework that understands and automates relationships across your entire technology stack.


## ❗ The Problem

### Current Reality

Companies are trapped between bad options:

**Option 1: Hyperscalers & Managed Services**
- Chosen due to lack of in-house skills
- False sense of "insurance" 
- Long-term commitment contracts
- Lock-in with no portability
- Pay premium for a "promise" of faster time-to-market

**Option 2: Open-Source Kubernetes Solutions**
- Requires highly skilled teams or big budgets
- Massive operational burden
- Complex versioning, observability, data pipelines
- Security concerns add more complexity

### Hard Decisions Companies Face Daily

- Private container-based LLaMA vs fast-moving AI services (OpenAI, Gemini, Claude)?   
- Stay with managed services or migrate to containers/Kubernetes?
- How to transition from VMs or Cloud Foundry to pure modrern app Kubernetes?

#### The impact of each choice is not only about saving millions in infa or Ops,it’s about meeting future demands for privacy, ensuring flexibility, and maintaining the ability to adapt and change.


![alt text](image-63.png)

### The Root Cause

## Relationships

**It's all about relationships:**
- Between services and databases
- Between microservices
- Between data pipelines and applications
- Between RBAC, metrics, and observability
- These are **stack relationships**

![alt text](image-9.png)

---

## 💡 What Is Stacktic?

### Core: A Logic Framework

Stacktic is fundamentally a **logic framework** that:
- **Integrates and understands relationships** between all stack components
- **Automates these relationships** - from application topology to ETL to Day-2 operations

![alt text](image-10.png)

### The UI Layer

On top of the logic framework, a **modular platform engineering UI** that enables:
- Integration of anything (inside or outside Kubernetes)
- Automation and connection of all components
- **Real version control for every element** of the stack using metadata

### Revolutionary: Stack Version Control

Using metadata, Stacktic creates **actual version control** for your entire stack:

- **Migrate** to new services or versions out-of-the-box
- **Duplicate** stack versions for production, staging, QA, testing
- **Rollback** an entire stack to a previous version
- **Redefine complexity** as versioned, trackable changes

![alt text](image-11.png)

---

## 🌟 The Value

### Immediate Impact

- **Day-0 planning**: From months to hours
- **Deployment costs**: 70%+ reduction
- **Ops overhead**: Eliminated through automation (SRE, DataOps, SecOps)
- **Security**: Automated, removing blockers
- **Engineers**: Focus on customization and improvement, not configuration

### Strategic Benefits

- **Cloud-agnostic stacks**: Single command deployment on any cloud
- **Infrastructure savings**: 30-50% reduction
- **Data regulations**: Full compliance support
- **Negotiation power**: No vendor lock-in
- **Sovereignty**: Private ownership and sovereignty principles fully supported

---

## 🤖 AI Governance, Automation & Control

### The Challenge: AI Meets Infrastructure

AI agents are becoming the primary operators of infrastructure — diagnosing incidents, querying databases, reading logs, triggering deployments. But without structure, AI operates blind: raw `kubectl` access, no understanding of relationships, no boundaries.

### Stacktic's Answer: Metadata-Driven AI Control

Stacktic doesn't just generate infrastructure — it generates the **metadata layer that governs AI**:

- **Structured Metadata Feed**: Every component, link, sub-component, and attribute in your stack is exposed as typed, queryable data through the Stack Agent API. AI never parses YAML or guesses service names — it queries structured JSON.

- **Auto-Generated MCP Server**: When you draw links in Stacktic, an MCP (Model Context Protocol) server is generated per stack with typed tools for every connected service — databases, message queues, observability, deployments. Draw a link → tools appear. Remove a link → tools disappear.

- **Governance by Architecture**: The topology you design IS the governance. What AI can see, access, query, and modify is determined by the links you draw — not by a separate policy layer that can drift.

- **Zero Raw Access**: AI agents operate through scoped tools with variable substitution (`{namespace}`, `{password}`, `{database}`) — the Stack Agent resolves variables from metadata. AI never sees raw credentials or runs arbitrary kubectl commands.

- **Write-Access Gating**: Every service connection has an independent write-access flag. Read operations are always available. Write operations (publish messages, trigger syncs, insert rows) only appear when explicitly enabled per service.

- **Multi-Stack Isolation**: Each stack generates its own MCP with its own credentials and topology scope. Cross-stack boundaries are explicitly controlled via `is_external` flags.

### What This Means

| Without Stacktic | With Stacktic |
|---|---|
| AI + kubectl = unlimited cluster access | AI + MCP = scoped tools, typed metadata |
| AI must guess relationships from labels | AI knows every link, direction, and dependency |
| Governance bolted on after deployment | Governance auto-generated from topology |
| Manual policy maintenance and drift | Zero-drift — topology changes propagate instantly |
| Same AI access across all environments | Per-stack isolation with independent credentials |

> **The metadata you feed AI IS the control.** Stacktic generates 360° stack metadata — components, links, sub-components, attributes, cross-stack boundaries — and feeds it to AI through governed tools. This isn't a feature. It's a fundamental shift in how AI operates infrastructure.

---

## 🌟 Vision

Stacktic bridges the gap between:
- **Disadvantages** of managed services (lock-in, cost, limited control)
- **Disadvantages** of pure open-source (time-to-market, operational overhead)
- **Advantages** of both approaches

By bypassing skill gaps and reducing operational complexity, Stacktic delivers **fully stable, automated, cloud-agnostic, and sovereignty-compliant full stacks** — with AI governance built into the architecture from day one.

**Our vision**: A unified platform engineering solution that democratizes open source, boosts adoption, and removes vendor lock-in — providing full freedom to innovate, adapt, and keep pace with technology. Where AI agents operate infrastructure through structured metadata and governed tools, not raw cluster access.

![alt text](image-12.png)

---

*Stacktic: Transforming stack complexity into versioned simplicity — with AI governance built in.*