---
sidebar_label: 'Q&A'
description: "Quick Summary - Common questions about Stacktic's approach, capabilities, and how it fits into your existing workflows."
---

# Q&A

> **Quick Summary** - Common questions about Stacktic's approach, capabilities, and how it fits into your existing workflows.

---

## Core Concepts

### **Q: Is Stacktic an AI?**

Stacktic includes AI as a major component, but by design, it's much more than that.

At its core, Stacktic is a **logic-driven automation framework** that manages full-stack relationships across infrastructure, applications, and operations.

We train AI models **to operate within Stacktic's automation framework** -- to create automations, validate results, and maintain compliance. Because the AI operates under **strict logic constraints** and must pass automated validation at every step, it **cannot make assumptions, guesses, or uncontrolled decisions**.

In short, AI powers Stacktic, but Stacktic defines the rules.

---

### **Q: Is Stacktic an AIOps platform? Does it compete with AI-driven future-Ops tools?**

Yes -- Stacktic qualifies as an **AIOps platform**, but in a **production-grade** sense rather than a "chat and suggestion" tool.

While typical AIOps systems focus on recommendations, Stacktic is **enterprise-ready**, designed for **zero-guesswork operational automation**.

#### Integration with Existing AIOps

Stacktic can work **alongside traditional AIOps tools** -- those can provide analytics, recommendations, and debugging insights, while Stacktic serves as the **single source of truth** for production.

**Key AIOps integrations and strengths:**

| Capability | Purpose |
|------------|---------|
| **SecOps Integration** | Compliance, version control, dependency tracking |
| **Stack Health Validation** | Automated validation, signature control |
| **Audit-Ready Reporting** | Complete compliance documentation |
| **AI Recommendations** | Deterministic execution and verification |

---

### **Q: Is Stacktic problematic because engineers don't create their own configurations?**

Quite the opposite.

In today's environment, engineers often produce **fragmented configurations**, especially when AI tools generate YAMLs, scripts, or policies with **inconsistent standards and little documentation**.

#### Stacktic Ensures:

- **Zero human-error configurations** with consistent standards and full documentation
- **End-to-end traceability** ensuring all outputs follow best practices and document every step on the way from knowledge sharing to depencies, versions and secuirty audit (stacktic is bad for job secuirty)
- **Freedom and customization** -- engineers can push to the Stacktic branch, merge to main, or bring their own configurations

You can modify Stacktic-generated results, extend automation pipelines, or ignore them entirely -- **everything remains open and customizable**.

---

### **Q: Is Stacktic really the most secure full-stack framework -- and is that claim fact-based?**

Yes -- this claim is supported by Stacktic's design.

Stacktic is built on **metadata-driven automation**, applying **hundreds of policies** across stack layers and topologies to prevent human error.

#### Key Security Differentiators:

| Feature | Benefit |
|---------|---------|
| **Dynamic Policy Automation** | Security adjusts automatically as application design changes |
| **Automated Microsegmentation** | Network isolation configured by default |
| **Audit & Vulnerability Reporting** | Built-in compliance validation |
| **Policy Awareness** | Self-healing configurations |
| **Continuous Compliance** | Real-time enforcement |

These features make Stacktic's approach to operational security **unique in today's automation landscape**.

> See the [Security Framework](/documentation/docs/security) chapter for more details.

---

## Capabilities & Value

### **Q: What do I get from Stacktic that I don't have today?**

#### Immediate Benefits:

1. **Fully Automated, Auditable Config**
   - Review, diff, and trust every configuration
   - Complete transparency into all generated code

2. **Accelerated Innovation**
   - Ideas to production in hours--not months
   - Boost org-wide innovation and research velocity

3. **LiveView Validation**
   - Deep checks into databases and APIs
   - Auto-generated tests and health probes

4. **Automated Guardrails**
   - Network policies for micro-segmentation
   - Multi-layer RBAC
   - Security controls most teams skip

5. **CISO-Ready Security Posture**
   - Per-stack security reports
   - Remediation guidance included

6. **Stack Version Control**
   - Save, duplicate to staging, modify, roll back, and share
   - Manage environments like code

7. **Drift-Resistant Versioning**
   - Automations keep working even as YAMLs/schemas/dependencies change

8. **Open Integration**
   - Works with existing automation and flows
   - No vendor lock-in

9. **Auto-Generated Documentation**
   - Runbooks, diagrams, and ops notes generated from the stack
   - No more manual documentation

10. **Relationship Intelligence**
    - Understands connections across layers
    - Surfaces insecure components and stack-level improvements

---

### **Q: Can I use my own processes (e.g., CI), or do I have to use Stacktic for everything?**

**Your call.** Stacktic is an open, modular platform.

#### Integration Options:

| Approach | Description |
|----------|-------------|
| **Bring Your Own CI/CD** | Import a pre-built image, use external CI pipeline |
| **Use Stacktic CI** | Let Stacktic run CI for you with Kaniko |
| **Hybrid** | Use external code with Stacktic automation inside |
| **Templates** | Use our templates or bring your own |

**Adopt as much--or as little--as you want.**

---

### **Q: Can I automate my own logic with Stacktic?**

**Yes.** Before it's a platform, Stacktic is a **relationship-logic framework**.

#### How It Works:

1. Define attributes and links in a simple UI
2. These compile into code conditions and automations
3. Build a fully customized automation ecosystem

This allows you to create automation patterns specific to your organization's needs.

---

### **Q: Can Stacktic automate outside the Kubernetes ecosystem?**

**Yes.** Stacktic is metadata-driven.

#### External Integrations:

- **Managed Databases**: Cloud-provider database services
- **External Services**: APIs, SaaS platforms
- **Infrastructure Tools**: Crossplane, Terraform, cloud APIs
- **Any Component**: If it has an API, Stacktic can automate it

---

## Workflow & Integration

### **Q: How does Stacktic work alongside an IDP like Backstage?**

**Complementary.** Use your IDP as is--or automate parts of it via Stacktic.

Stacktic is designed to run in parallel with existing platforms and components without conflicts.

#### Integration Patterns:

- **Catalog Integration**: Stacktic stacks appear in Backstage catalog
- **Template Extension**: Use Backstage templates with Stacktic automation
- **API Integration**: Backstage triggers Stacktic workflows
- **Standalone**: Run Stacktic independently

---

### **Q: Will this let Ops focus on higher-value work? What skills are needed?**

**Yes** -- Ops toil drops dramatically so the team can focus on reliability, cost optimization, and improvements.

#### Required Skills:

| Skill Level | Description |
|-------------|-------------|
| **General Dev + Ops Familiarity** | Understand basic Kubernetes and application concepts |
| **Stack Understanding** | Know what you're deploying (e.g., Kafka, databases) |
| **Review Capability** | Ability to review automation outcomes |
| **Customization** | Modify configurations when needed |

**Depth isn't required** -- understand the stack, review automation outcomes, customize when needed.

#### Special Cases:

- **Data-Heavy Stacks** (Kafka, sink DBs): DataOps mindset helps
- **Complex Integrations**: Understanding of APIs and webhooks
- **Custom Automation**: Logic and scripting knowledge

---

### **Q: Is Stacktic only for deployment, or also for operations?**

**Both.** Stacktic covers the complete lifecycle.

#### Day 0: Initial Setup

- Provisioning
- Configuration
- Security setup
- Guardrails implementation

#### Day 1: Deployment

- Application deployment
- Service connectivity
- Initial validation
- Production cutover

#### Day 2: Operations

- Health checks and validation
- Security tests
- Versioning and updates
- Migrations
- Operational configuration
- Scaling and optimization

---

## Control & Transparency

### **Q: What if I'm not comfortable fully automating my configuration?**

**You stay in control.**

#### Control Mechanisms:

1. **Review Branch**: Work in Stacktic branch before merging
2. **Diff Review**: See exactly what changes before applying
3. **Customization**: Modify, extend, or ignore any automation
4. **Best Practices**: We ship security standards by default--you decide what to keep

#### Workflow:

```
Stacktic Branch -> Review Diffs -> Customize -> Merge to Main -> Deploy
```

You maintain full visibility and control at every step.

---

### **Q: How do I see exactly what Stacktic automates?**

**Complete transparency** at every level.

#### Visibility Tools:

1. **Info Panel**
   - Shows automation details per component
   - Preview of generated files

2. **Config Preview**
   - See what files will be generated
   - Review before creation

3. **Pull Requests**
   - GitHub PRs with full diffs
   - Line-by-line comparison

4. **Generated Docs**
   - Repository includes documentation
   - Summarizes config and operations

5. **Audit Reports**
   - Complete automation history
   - Security and compliance validation

**360 degree transparency** into automation, outcomes, and ongoing operations.

---

## Next Steps

- **Get Started**: [Quick Start Guide](/documentation/docs/quick_start)
- **Learn Architecture**: [Architecture Overview](/documentation/docs/architecture)
- **Security Deep Dive**: [Security Framework](/documentation/docs/security)
- **Join Community**: [Community & Support](https://stacktic.io/slack)

---

*Have more questions? Contact us at [support@stacktic.io](mailto:support@stacktic.io) or visit our [documentation](https://docs.stacktic.io).*
