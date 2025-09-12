---
sidebar_position: 6
hide_table_of_contents: true
---

# 🔧 Stacktic Adoption and Customization

## 📋 Table of Contents

1. [Overview](#overview)
2. [Adoption Overview](#-adoption-overview)
3. [Working With Your Source Code](#-working-with-your-source-code)
4. [Merge Strategy](#-merge-strategy)
5. [Simplified Customization Flow](#-simplified-customization-flow)

---

## Overview

This section explains how Stacktic integrates with your existing tools and processes, and how you can **customize results** and **manage your code** with minimal overhead.

### Key Principles

| Principle | Description | Benefit |
|-----------|-------------|---------|
| **Non-Invasive** | Works alongside existing tools | No disruption to current workflows |
| **Flexible Integration** | Multiple integration options | Choose what fits your needs |
| **Full Control** | Your code remains yours | Complete customization freedom |
| **Smart Merging** | Intelligent branch management | Preserves your customizations |

---

## 🧩 Adoption Overview

### Integration Philosophy

Stacktic is designed to **coexist peacefully with your existing environment**.

#### What Stacktic DOES Enable
- ✅ Continue using your **existing CI/CD pipeline** OR handle CI directly in Stacktic
- ✅ Use your own **Backstage** OR automate from Stacktic
- ✅ Rely on **external services** OR let Stacktic automate them
- ✅ Manage metadata for **external** or **managed services** as needed

### Integration Options

| Component | Your Choice | Stacktic's Role |
|-----------|------------|-----------------|
| **CI/CD Pipeline** | Keep existing (Jenkins, GitLab CI, etc.) OR use Stacktic | Generates compatible configs for either |
| **Service Catalog** | Keep Backstage/similar OR use Stacktic | Integrates with existing or provides built-in |
| **External Services** | Keep managed services OR automate | Supports both approaches |
| **Repository** | Use existing OR create new | Works with any Git provider |

> 💡 **Bottom Line:** Stacktic integrates smoothly with your existing environment and can connect to external components without disruption.

---

## 📂 Working With Your Source Code

### Code Management Options

Stacktic keeps your code **open and under your control** with multiple approaches:

#### Option 1: Import from External Repository
- Import code from any Git repository
- Maintain existing development workflows
- Stacktic adds configuration without touching source

#### Option 2: Import Container Images
- Use pre-built images
- Perfect for third-party services
- Stacktic manages deployment configuration

#### Option 3: Use Stacktic Sourc Code
- Write code directly on `main` branch
- Stacktic merges configuration changes separately
- **Never touches** your source code or libraries

### Code Ownership Model

| Aspect | Control | Management |
|--------|---------|------------|
| **Application Code** | 100% yours | You manage directly |
| **Business Logic** | 100% yours | Never touched by Stacktic |
| **Libraries/Dependencies** | 100% yours | You control versions |
| **Infrastructure Config** | Customizable | Stacktic generates, you can modify |
| **Relationships** | Customizable | Stacktic automates, you can override |

---

## 🔀 Merge Strategy

### Automated Configuration Management

Stacktic automates **relationships and configuration**, while you focus on **customizing the final results**.

#### How The Merge Process Works

```yaml
1. Build Phase:
   - Stacktic generates configurations
   - Pushes changes to 'stacktic' branch
   
2. Merge Phase:
   - Changes merged into 'main' branch
   - Your customizations preserved
   
3. Customization Phase:
   - You modify anything in 'main'
   - Changes persist across builds
```

### Merge Strategy Options

#### Default Strategy: Safe Merge
- Merges everything from `stacktic` to `main`
- **Never overwrites** your customizations
- Additive approach - new configs added, existing preserved
- Perfect for most use cases

#### Custom Strategy: Selective Control
- Track differences between `main` and `stacktic` branches
- Choose to **ignore** or **overwrite** specific changes
- File-level control during build process

<img src={require('./image-35.png').default} alt="alt text" width="500" />

### File-Level Control

You can choose **specific actions for individual files**:

| Action | Use Case | Result |
|--------|----------|--------|
| **Restore from Stacktic** | File corrupted or misconfigured | Returns to Stacktic's version |
| **Keep Custom** | Your version is preferred | Ignores Stacktic updates |
| **Merge Changes** | Want both updates | Intelligent merge |
| **Rollback** | Previous state needed | Restore earlier version |

<img src={require('./image-36.png').default} alt="alt text" width="200" />

### Merge Conflict Resolution

| Scenario | Resolution | Control |
|----------|------------|---------|
| **New files from Stacktic** | Always added | Automatic |
| **Modified configs** | Your changes preserved | Default behavior |
| **Conflicting changes** | Manual review option | You decide |
| **Deleted files** | Restoration option | Per-file control |

---

## ✅ Simplified Customization Flow

### The Complete Workflow

This **build-and-merge strategy** simplifies your workflow while giving you **100% customization** with **minimal effort**.

#### Workflow Benefits

| Benefit | Description | Impact |
|---------|-------------|--------|
| **Full Control** | Every aspect customizable | No vendor lock-in |
| **Minimal Effort** | Automation handles complexity | 90% time savings |
| **Safe Updates** | Your changes never lost | Risk-free upgrades |
| **Version Tracking** | Complete Git history | Full auditability |

### Practical Workflow Example

```bash
# 1. Stacktic generates and pushes to stacktic branch
git checkout stacktic
# All infrastructure and configuration updates here

# 2. Merge to main (your customizations preserved)
git checkout main
git merge stacktic --strategy=ours  # Or custom strategy

# 3. Your customizations remain intact
# - Your source code: untouched
# - Your custom configs: preserved
# - Your overrides: maintained

# 4. Continue development
# Make any changes you need in main
# Next Stacktic build respects your changes
```

### Customization Levels

| Level | What You Can Customize | Example |
|-------|------------------------|---------|
| **Component** | Service configurations | Resource limits, replicas |
| **Relationships** | Connection settings | Protocols, authentication |
| **Security** | Policies and access | RBAC, network policies |
| **Operations** | Monitoring, backups | Thresholds, schedules |
| **Everything** | Any generated file | Complete flexibility |

### Best Practices for Customization

#### Do's
- ✅ Customize in `main` branch after merge
- ✅ Use file-level controls for specific needs
- ✅ Document your customizations
- ✅ Test changes in staging first
- ✅ Use version control for tracking

#### Don'ts
- ❌ Don't modify `stacktic` branch directly
- ❌ Don't skip merge reviews for critical systems
- ❌ Don't ignore Stacktic updates completely
- ❌ Don't customize without documenting why

---

## 🎯 Summary

### Key Takeaways

Stacktic's adoption and customization approach provides:

| Feature | Benefit |
|---------|---------|
| **Seamless Integration** | Works with existing tools and workflows |
| **Flexible Code Management** | Multiple options for source code handling |
| **Intelligent Merging** | Preserves customizations while updating |
| **Full Control** | 100% customization capability |
| **Minimal Overhead** | Automation with override options |

### The Stacktic Promise

> **You maintain full control over your code, while Stacktic handles the heavy lifting for relationships, configurations, and automation.**

This approach ensures:
- ✅ **No vendor lock-in**
- ✅ **Preserved investments** in existing tools
- ✅ **Gradual adoption** possible
- ✅ **Complete transparency** in all operations
- ✅ **Future flexibility** for changes

---

*Stacktic: Powerful automation that respects your autonomy.*