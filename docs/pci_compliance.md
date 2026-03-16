---
id: pci_compliance
title: PCI-DSS Compliance
sidebar_label: PCI-DSS Compliance
---

# PCI-DSS Compliance Generator

Stacktic automates PCI-DSS v4.0 network segmentation and compliance reporting through a single configuration attribute. No manual policy writing — the pipeline reads your stack topology and generates all NetworkPolicies, exceptions, and compliance reports automatically.

---

## How It Works

| Step | What Happens |
|------|-------------|
| 1. Set attribute | `configuration.microsegmentation_level = "pci_dss_strict"` |
| 2. Pipeline runs | `create-pci-networkpolicy.py` reads `stack-metadata.yaml` |
| 3. Policies generated | Default-deny + link-based + exception + internet rules |
| 4. Output files | Individual NetworkPolicy JSON files + manifest + Mermaid diagram |
| 5. Compliance report | 250 PCI-DSS v4.0 controls evaluated against stack topology |

---

## Configuration

| Attribute | Value | Effect |
|-----------|-------|--------|
| `microsegmentation_level` | `none` | No network policies generated |
| `microsegmentation_level` | `pci_dss_strict` | Full PCI-DSS strict mode |

Set via Stacktic UI or API on the system configuration.

---

## What PCI-DSS Strict Mode Generates

### 1. Default-Deny Baseline (PCI DSS 1.2.1)

Every namespace gets `default-deny-ingress` + `default-deny-egress` policies. All traffic is blocked unless explicitly allowed.

### 2. Link-Based Policies

For every component link in the stack topology, the generator creates explicit ingress/egress rules:

| Link Direction | Policy Generated |
|---------------|-----------------|
| A → B (egress) | Egress from A's namespace to B's namespace on B's port |
| A → B (ingress) | Ingress to B's namespace from A's namespace on B's port |

### 3. Component-Type Exceptions

Defined in `pci-exceptions.yaml` — per-component-type rules with explicit ports. No `allow_all` flags.

| Component | Exception Type | Ports |
|-----------|---------------|-------|
| cert_manager | Ingress from kube-system | 443, 9402, 10250 |
| argo_cd | Egress to git | 443 |
| prometheus | Ingress from grafana | 9090 |
| apisix | Ingress external | 80, 443, 9443 |
| opa | Egress to kube-api | 443 |
| stack_agent | Cluster-wide access | Per-tool ports |

### 4. System Exceptions (All Namespaces)

| Rule | Target | Port |
|------|--------|------|
| DNS egress | kube-system | 53 (UDP/TCP) |
| K8s API egress | default namespace | 443 |

No blanket internet egress — only the two rules above.

### 5. Internet Exceptions (Explicit Only)

Only components that genuinely need external access get it:

| Component | Direction | Ports | Reason |
|-----------|-----------|-------|--------|
| apisix | Ingress + Egress | 80, 443, 9443 | API gateway |
| argo_cd | Egress | 443 | Git repos |
| cert_manager | Egress | 443 | ACME/Let's Encrypt |
| opa | Egress | 443 | Policy bundles |
| velero | Egress | 443 | Backup storage |
| keda | Egress | 443 | External scalers |
| keycloak | Egress | 443 | Identity federation |
| sonarqube | Egress | 443 | Plugin updates |

**Not included**: grafana, prometheus, opensearch, backend apps — no internet access in PCI mode.

### 6. Intra-Namespace Communication

Pods within the same namespace can communicate with each other. No `allow_all_ports` flags.

---

## Generated Output Files

| File | Content |
|------|---------|
| `networkpolicy__*.json` | Individual NetworkPolicy resources per rule |
| `networkpolicy-manifest.json` | Complete manifest listing all policies with metadata |
| `network-diagram.md` | Mermaid diagram of all allowed traffic flows |
| `compliance/pci-dss/README.md` | PCI-DSS v4.0 compliance report (250 controls) |

---

## PCI Compliance Report

The pipeline evaluates 250 PCI-DSS v4.0 controls against your stack topology. Each control is scored based on which components are deployed and how they're configured.

### Component-to-Requirement Mapping

| Component | PCI Requirements Covered |
|-----------|------------------------|
| OPA | 1, 2, 5, 6, 7, 8, 11 |
| Falco | 5, 10, 11 |
| APISIX | 1, 4, 6, 8 |
| Prometheus | 10, 11 |
| CNPG | 3, 4 |
| Keycloak | 7, 8 |
| Trivy | 5, 6, 11 |
| OpenSearch (SIEM) | 10, 11 |
| External Secrets | 3, 4 |
| Cert Manager | 4 |
| Velero | 9 |
| ArgoCD | 6 |

### AI-Powered Compliance Tools (via MCP)

When FastMCP is linked to stack-agent, four PCI compliance tools are available:

| Tool | What It Does |
|------|-------------|
| `pci_compliance_overview()` | Full report with per-requirement table and scores |
| `pci_compliance_requirement(N)` | Drill into specific requirement (1-12) |
| `pci_compliance_gaps()` | Prioritized gap analysis with recommendations |
| `pci_compliance_component_impact(type)` | What-if analysis: effect of adding/removing a component |

---

## PCI Dashboards (OpenSearch SIEM)

When OpenSearch is deployed with SIEM enabled, PCI-specific dashboards are auto-generated per data source:

| Dashboard | Source | Content |
|-----------|--------|---------|
| PCI - Runtime | Falco | Runtime security events, syscall anomalies |
| PCI - API Gateway | APISIX | API access logs, auth failures, rate limiting |
| PCI - Policy | OPA | Policy violations, admission denials |
| PCI - Audit | K8s Audit | API server audit events |
| PCI - Scan | Trivy | Vulnerability scan results |
| PCI - 360 Overview | All sources | Cross-stack aggregated PCI view |

Each dashboard is generated per-stack with unique IDs. Cross-stack PCI overview aggregates all stacks.

---

## Exceptions Configuration

All PCI exceptions are defined in `pci-exceptions.yaml` with four sections:

| Section | Scope | Description |
|---------|-------|-------------|
| `well-known-ports` | Reference | Port mapping per component type |
| `component-exceptions` | Per-type | Ingress/egress rules with explicit ports and namespace selectors |
| `system-exceptions` | All namespaces | DNS and K8s API access only |
| `internet-exceptions` | Explicit list | Components allowed external network access |

---

## Standard vs PCI-DSS Network Policies

| Feature | Standard Mode | PCI-DSS Strict |
|---------|--------------|----------------|
| Default-deny | Per namespace | Every namespace |
| Internet egress | Allowed for most | Explicit allowlist only |
| Port specificity | Service ports | Exact ports, no ranges |
| allow_all flags | Honored | Ignored |
| Intra-namespace | Open | Allowed, no wildcard ports |
| Compliance report | Not generated | 250 controls evaluated |
| Mermaid diagram | Generated | Generated |
