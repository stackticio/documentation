---
sidebar_label: 'organizational control layers'
description: 'Vision & Philosophy'
---

# Stack Access & Permission Model

## Vision & Philosophy

At the core of our design, we believe in **automated, strict security enforcement at the stack level**, while maintaining **operational freedom** as much as possible for those who build, deploy, and maintain the stacks.

In other words:

> We believe in securing the *stack* layers, not nessarcily the *org operators* layers.

However, we also recognize that organizations have **compliance** and **regulatory requirements**, so we provide a **hierarchical permission model** that is both flexible and strictly controlled lime never before.

---

## Permission Levels

When creating a stack, you can add collaborators under **four permission levels**:

| Permission | Description |
|------------|-------------|
| **MAINTAIN** | Full access -- can modify both the **system** and the **configuration**. |
| **WRITE** | Can modify only the **system**. Configuration details remain hidden. |
| **SECURITY AUDITOR** | Read-only access to both the **system** and **configuration** (for compliance or auditing). |
| **READ** | Read-only access to the **system**; configuration cannot be viewed. |

---

## Layer 2: Stack Hierarchy

The second layer introduces a unique **hierarchical stack model**:

- Each team (e.g., **DataOps**, **SecOps**, **Dev**) can create and manage their **own sub-stacks**.
- A designated **Stack Admin** can **unify multiple sub-stacks** into a single **master stack**.

This structure **solves a major issue with monolithic repositories** -- it allows teams to maintain independence and security per stack, while the admin merges them into a **single production-ready stack**.

> Think of it as *multi-stack collaboration with single-stack deployment*.

<a href="https://video.wixstatic.com/video/06ddae_61c604db8cb94c25abdbe5e23f1d7852/1080p/mp4/file.mp4" target="_blank">
  <img src="https://img.shields.io/badge/▶_Watch_Demo-Stack_Hierarchy-667eea?style=for-the-badge&logo=youtube&logoColor=white" alt="Watch Stack Hierarchy Demo"/>
</a>

---

## Layer 3: Action Logs (TBA: 1/11/2025)

Every user action within the system is **logged and auditable**.
This provides:

- Full traceability of modifications
- Transparency in collaboration
- Clear accountability across teams

---

## Layer 4: RBAC Integration (Kubernetes Level)

Finally, our security chapter introduces **Kubernetes-native RBAC linkage**:

- Each stack component can link to **kubectl RBAC roles** directly.
- Access can be tied from **sub-component user/groups** to **specific components**.

This ensures **fine-grained access control** that aligns perfectly with your cluster's RBAC policy.

---

## Summary

| Layer | Purpose | Outcome |
|-------|---------|---------|
| **1. Permissions** | Define collaborator access | Clear role-based boundaries |
| **2. Hierarchy** | Unify sub-stacks | Secure multi-team collaboration |
| **3. Action Logs** | Record all user activity | Full visibility & auditability |
| **4. RBAC Mapping** | Integrate with K8s security | End-to-end access enforcement |

---

**In short:**
Our model lets you **decide how strict** your organization's security should be -- from flexible collaboration to fully locked-down compliance mode -- all backed by transparent logging and RBAC-level enforcement.

---
