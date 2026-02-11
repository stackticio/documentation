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

1. **initilze configuration** – configure Repo and Regsitry tokens
2. **Design topology** – Drag components and connect them.
3. **Generate your stack** – Build to create the Git skeleton (`k8s/`, `scripts/`, dashboards, secrets).
4. **Deploy Your Stack** – Kustomize your full stack on K8s Cluster

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


---

### Prepare in Advance

Before configuring Stacktic, create the following tokens:

#### 1. Container Registry Token

Create a token with **full read/write access** to your container registry (Docker Hub, GitHub Container Registry, GitLab Registry, etc.).

This token allows Stacktic to push and pull container images during build and deploy.

#### 2. Git Repository Token

Create a **fine-grained personal access token** with full permissions to your repositories.

**GitHub example** (GitLab and other providers follow the same concept):

1. Go to [https://github.com/settings/personal-access-tokens](https://github.com/settings/personal-access-tokens)
2. Click **Generate new token**
3. Under **Repository access**, select the repositories Stacktic will manage (or select all)
4. Under **Permissions**, set both **Repository permissions** and **Account permissions** to allow all
5. Generate and copy the token

:::tip
Use **fine-grained tokens** over classic tokens for better security. Grant only the repositories Stacktic needs.
:::


<img src={require('./image-70.png').default} alt="alt text" width="500" />

---

### Configure Stacktic

```shell
# 1. Sign in
https://staging.app.stacktic.io/

# 2. Create or select a Stack
https://staging.app.stacktic.io/systems

# 3. Configure system (tokens, domain)
```
Initialize Stack configuration before stack design

1. **Initialize configuration** — paste your Registry token

<img src={require('./image-65.png').default} alt="alt text" width="500" />

2. **Initialize configuration** — paste your Repo token

<img src={require('./image-66.png').default} alt="alt text" width="500" />

3. **SOPS support (optional)** — enable encryption by adding your Age public key

<img src={require('./image-67.png').default} alt="alt text" width="500" />

---

## Designing Your First App

1. **Drag‑and‑drop** a backend and a database, then connect them.

<div style={{maxWidth: '100%'}}>
  <video width="100%" controls style={{maxWidth: '800px'}}>
    <source src="https://video.wixstatic.com/video/06ddae_62e9379f2c8d4f0abd61b6a68282b721/1080p/mp4/file.mp4" type="video/mp4" />
    <p>Your browser does not support the video tag.</p>
  </video>
</div>


2. **Build** (first time) – choose **Build**, not *FastBuild*, to create the full repo.


<img src={require('./image-71.png').default} alt="alt text" width="500" />

3. **Merge strategy** – The `stacktic` branch is the generated skeleton; `main` is yours. Automatic merges respect your custom edits.  we merge changes to main, and give you the option to ignore, overwriteor merge directly from stacktic UI:


<img src={require('./image-72.png').default} alt="alt text" width="500" />

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
