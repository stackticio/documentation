---
sidebar_position: 4
hide_table_of_contents: true
---
# Stacktic

> **Version‑controlled automation for full‑stack complexity**

Stacktic converts application topology into a fully versioned Git repository—complete with deployment manifests, security policies, and Day‑2 operations. Design your stack visually; we generate the code and keep it in sync.

---

## Why Stacktic?

| Feature                           | What you gain                                                                    |
| --------------------------------- | -------------------------------------------------------------------------------- |
| **🚀 Automated relationships**    | Service links and dependencies are mapped for you—no manual YAML.                |
| **🧠 Metadata‑driven**            | Declarative metadata eliminates human error and operational drift.               |
| **📦 Full‑stack version control** | Roll back or branch entire environments, not just code.                          |
| **🔒 Autonomous security**        | RBAC, NetworkPolicy, and OPA rules generated at build time.                      |
| **☁️ Cloud‑agnostic migration**   | Import workloads from VMs, managed services, or Docker to Kubernetes in minutes. |

---

## High‑Level Workflow

1. **Design topology** – Drag components and connect them.
2. **Extend with logic (optional)** – Add custom automation rules.
3. **Generate your stack** – Build to create the Git skeleton (`k8s/`, `scripts/`, dashboards, secrets).
4. **Source‑of‑truth Ops** – Stacktic tracks versions, handles merges, and promotes safe rollbacks.

---

## Core Concepts

| Concept           | Description                                                   |
| ----------------- | ------------------------------------------------------------- |
| **Component**     | A service such as backend, PostgreSQL, or Prometheus.         |
| **Sub‑component** | A unit inside a component (e.g., a DB schema, a Kafka topic). |
| **Link**          | Relationship between components (backend → DB).               |
| **Attribute**     | Parameter used for automation (ports, secrets, flags).        |

---

## Automation Scenarios (Examples)

| Trigger                    | What Stacktic generates                                    |
| -------------------------- | ---------------------------------------------------------- |
| *Source Code* → *Database* | Creates DB & user, injects connection string as Secret.    |
| *Grafana* → *Prometheus*   | Enables metrics, ServiceMonitor, and dashboard JSON.       |
| *ArgoCD GitOps*            | `Application` CRs per component for multi‑cluster sync.    |
| *Kafka Topic* → *Database* | Provisions topic, ACLs, and KafkaConnect sink.             |
| **Policies**               | RBAC, NetworkPolicy, and OPA Gatekeeper rules via toggles. |

---

## Quick Start

```shell
# 1. Sign in
https://staging.app.stacktic.io/

# 2. Create or select a Stack
https://staging.app.stacktic.io/systems

<img width="1135" height="658" alt="image" src="https://github.com/user-attachments/assets/5830a1ec-e581-48ca-84ac-c999ab32ff4b" />

# 3. Configure system (tokens > passwords!) and domain
```
<img width="1228" height="1003" alt="image" src="https://github.com/user-attachments/assets/a60053d2-7d23-4991-bb2d-c2c641b07c8f" />


> **SOPS support** – Enable encryption by adding your Age public key (optional only)
<img width="1712" height="742" alt="image" src="https://github.com/user-attachments/assets/a9aa76c5-9965-4ff1-addb-dc80c2cba707" />

---

## Designing Your First App

1. **Drag‑and‑drop** a backend and a database, then connect them.
2. **Build** (first time) – choose **Build**, not *FastBuild*, to create the full repo.
3. **Merge strategy** – The `stacktic` branch is the generated skeleton; `main` is yours. Automatic merges respect your custom edits.

---

## Deploying

```bash
# Clone the generated repo
$ git clone <your‑stack‑repo>
$ cd <your‑stack‑repo>

# Build & push images (Kaniko jobs)
$ kubectl apply -k k8s/build/overlays/dev/ --server-side --force-conflicts

# Deploy manifests
$ kubectl apply -k k8s/deploy/overlays/dev/ --server-side --force-conflicts

# Verify ingress
$ kubectl get apisixroute -A
```

---

## Updating & FastBuild

Use **FastBuild** when you only tweak component values (tokens, secrets). It captures \~95 % of relationships for the selected service and rebuilds quickly.

```bash
# Keep local main up‑to‑date
$ git fetch origin main
$ git checkout main
$ git reset --hard origin/main
```

---

## Managing Source Code

| Option                   | Best for             | How it works                                            |
| ------------------------ | -------------------- | ------------------------------------------------------- |
| **External source code** | Full code ownership  | Point to repo & Dockerfile; Stacktic builds + deploys.  |
| **image\_base**          | Teams with custom CI | Push your own image; Stacktic handles deploy & config.  |
| **Stacktic templates**   | 100 % hands‑off      | Use pre‑built service templates (contact us to enable). |

---

## Migrating an Existing App

1. **Import code** (external repo or pre‑built image).
2. **Add databases** and links.
3. **Load data**:

   * Manual restore
   * MinIO bucket‑based job (recommended)
   * `initdb` scripts during container start
4. **Validate** ingress & health checks.
5. **Add complexity** – Airflow, Kafka, RabbitMQ, etc.
6. **Enable Day‑2 Ops** – logging (Loki), monitoring (Prometheus + Grafana), autoscaling, security policies.

---

## Examples

* **Kafka Connect starter** – [https://github.com/stackticio/strimzi\_basic\_setup/tree/main](https://github.com/stackticio/strimzi_basic_setup/tree/main)
* **Easy Llama** – [https://github.com/stackticio/Llama\_base/tree/main](https://github.com/stackticio/Llama_base/tree/main)

---

## Resources

* Q\&A: [https://www.stacktic.io/differentiators](https://www.stacktic.io/differentiators)
* ROI calculator: [https://www.stacktic.io/roi](https://www.stacktic.io/roi)
* Blog: [https://www.stacktic.io/blog](https://www.stacktic.io/blog)
* Demos: [https://www.stacktic.io/demos](https://www.stacktic.io/demos)

Need help? **[support@stacktic.io](mailto:support@stacktic.io)**

---

© 2025 Stacktic. All rights reserved. This guide is provided "as is"; test in non‑production environments first.
