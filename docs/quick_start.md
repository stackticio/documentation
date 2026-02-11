---
sidebar_position: 4
---

# Quick Start Guide

<div style={{background: 'linear-gradient(135deg, #0052cc 0%, #003d99 100%)', borderRadius: '12px', padding: '32px 40px', color: 'white', marginBottom: '32px'}}>
  <h2 style={{color: 'white', margin: '0 0 8px 0', fontSize: '1.6rem'}}>From zero to a running stack in 4 steps</h2>
  <p style={{margin: 0, opacity: 0.9, fontSize: '1.05rem'}}>
    Design your stack visually, Stacktic generates the code — deployment manifests, security policies, and Day-2 operations — all version-controlled in Git.
  </p>
</div>

<div style={{display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '32px'}}>
  <a href="#step-1--prerequisites" style={{textDecoration: 'none'}}>
    <div style={{background: '#f0f4f8', borderRadius: '10px', padding: '16px', textAlign: 'center', border: '2px solid transparent', transition: 'border 0.2s'}}>
      <div style={{fontSize: '1.6rem', marginBottom: '4px'}}>1</div>
      <div style={{fontWeight: 600, color: '#0052cc', fontSize: '0.85rem'}}>Prerequisites</div>
      <div style={{fontSize: '0.75rem', color: '#666'}}>Tokens & access</div>
    </div>
  </a>
  <a href="#step-2--configure" style={{textDecoration: 'none'}}>
    <div style={{background: '#f0f4f8', borderRadius: '10px', padding: '16px', textAlign: 'center', border: '2px solid transparent', transition: 'border 0.2s'}}>
      <div style={{fontSize: '1.6rem', marginBottom: '4px'}}>2</div>
      <div style={{fontWeight: 600, color: '#0052cc', fontSize: '0.85rem'}}>Configure</div>
      <div style={{fontSize: '0.75rem', color: '#666'}}>Connect registry & repo</div>
    </div>
  </a>
  <a href="#step-3--design--build" style={{textDecoration: 'none'}}>
    <div style={{background: '#f0f4f8', borderRadius: '10px', padding: '16px', textAlign: 'center', border: '2px solid transparent', transition: 'border 0.2s'}}>
      <div style={{fontSize: '1.6rem', marginBottom: '4px'}}>3</div>
      <div style={{fontWeight: 600, color: '#0052cc', fontSize: '0.85rem'}}>Design & Build</div>
      <div style={{fontSize: '0.75rem', color: '#666'}}>Drag, connect, build</div>
    </div>
  </a>
  <a href="#step-4--deploy" style={{textDecoration: 'none'}}>
    <div style={{background: '#f0f4f8', borderRadius: '10px', padding: '16px', textAlign: 'center', border: '2px solid transparent', transition: 'border 0.2s'}}>
      <div style={{fontSize: '1.6rem', marginBottom: '4px'}}>4</div>
      <div style={{fontWeight: 600, color: '#0052cc', fontSize: '0.85rem'}}>Deploy</div>
      <div style={{fontSize: '0.75rem', color: '#666'}}>Apply to Kubernetes</div>
    </div>
  </a>
</div>

---

## Step 1 — Prerequisites

<div style={{background: '#f8f9fb', borderRadius: '12px', padding: '24px', border: '1px solid #e0e4e8', marginBottom: '24px'}}>

Before you start, prepare the following:

<div style={{display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', marginBottom: '16px'}}>
  <div style={{background: 'white', borderRadius: '10px', padding: '20px', borderLeft: '4px solid #0052cc', boxShadow: '0 1px 4px rgba(0,0,0,0.06)'}}>
    <h4 style={{margin: '0 0 8px 0'}}>Container Registry Token</h4>
    <p style={{margin: 0, fontSize: '0.9rem', color: '#555'}}>
      Create a token with <strong>read/write access</strong> to your container registry (Docker Hub, GHCR, GitLab Registry, etc.). Stacktic uses this to push and pull images.
    </p>
  </div>
  <div style={{background: 'white', borderRadius: '10px', padding: '20px', borderLeft: '4px solid #0052cc', boxShadow: '0 1px 4px rgba(0,0,0,0.06)'}}>
    <h4 style={{margin: '0 0 8px 0'}}>Git Repository Token</h4>
    <p style={{margin: 0, fontSize: '0.9rem', color: '#555'}}>
      Create a <strong>fine-grained personal access token</strong> with full repository permissions. Stacktic uses this to create and manage your stack repo.
    </p>
  </div>
  <div style={{background: 'white', borderRadius: '10px', padding: '20px', borderLeft: '4px solid #0052cc', boxShadow: '0 1px 4px rgba(0,0,0,0.06)'}}>
    <h4 style={{margin: '0 0 8px 0'}}>Domain</h4>
    <p style={{margin: 0, fontSize: '0.9rem', color: '#555'}}>
      Have a valid domain ready. After deploying, update your DNS A-record to point to the APISIX gateway external IP.
    </p>
    <pre style={{margin: '8px 0 0 0', fontSize: '0.8rem', background: '#f0f4f8', borderRadius: '6px', padding: '8px 12px', overflow: 'auto'}}><code>kubectl get svc apisix-gateway -n ingress-apisix{"\n"}# EXTERNAL-IP → update your DNS A-record</code></pre>
  </div>
</div>

<details>
<summary><strong>GitHub token setup (click to expand)</strong></summary>

1. Go to [github.com/settings/personal-access-tokens](https://github.com/settings/personal-access-tokens)
2. Click **Generate new token**
3. Under **Repository access**, select the repositories Stacktic will manage
4. Under **Permissions**, enable all **Repository** and **Account** permissions
5. Generate and copy the token

:::tip
Use **fine-grained tokens** over classic tokens for better security. Grant only the repositories Stacktic needs.
:::

<img src={require('./image-70.png').default} alt="GitHub token setup" width="650" />

</details>

</div>

---

## Step 2 — Configure

<div style={{background: '#f8f9fb', borderRadius: '12px', padding: '24px', border: '1px solid #e0e4e8', marginBottom: '24px'}}>

<div style={{background: 'white', borderRadius: '10px', padding: '16px 20px', marginBottom: '20px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)'}}>
  <strong>Sign in</strong> at <a href="https://staging.app.stacktic.io/">staging.app.stacktic.io</a> and create or select a <strong>Stack</strong>.
</div>

Paste your tokens in the Stack settings:

<div style={{display: 'flex', flexDirection: 'column', gap: '16px'}}>
  <div style={{background: 'white', borderRadius: '10px', padding: '16px 20px', borderLeft: '4px solid #0052cc', boxShadow: '0 1px 4px rgba(0,0,0,0.06)'}}>
    <p style={{fontWeight: 600, color: '#0052cc', marginBottom: '10px', fontSize: '1rem'}}>2a. Paste your Registry Token</p>
    <img src={require('./image-65.png').default} alt="Registry token" width="780" style={{borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)'}} />
  </div>
  <div style={{background: 'white', borderRadius: '10px', padding: '16px 20px', borderLeft: '4px solid #0052cc', boxShadow: '0 1px 4px rgba(0,0,0,0.06)'}}>
    <p style={{fontWeight: 600, color: '#0052cc', marginBottom: '10px', fontSize: '1rem'}}>2b. Paste your Repo Token</p>
    <img src={require('./image-66.png').default} alt="Repo token" width="780" style={{borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)'}} />
  </div>
  <div style={{background: 'white', borderRadius: '10px', padding: '16px 20px', borderLeft: '4px solid #0052cc', boxShadow: '0 1px 4px rgba(0,0,0,0.06)'}}>
    <p style={{fontWeight: 600, color: '#0052cc', marginBottom: '10px', fontSize: '1rem'}}>2c. SOPS Key (optional)</p>
    <img src={require('./image-67.png').default} alt="SOPS key" width="780" style={{borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)'}} />
  </div>
</div>

</div>

---

## Step 3 — Design & Build

<div style={{background: '#f8f9fb', borderRadius: '12px', padding: '24px', border: '1px solid #e0e4e8', marginBottom: '24px'}}>

### Drag, connect, build

Drag components onto the canvas and connect them. Stacktic maps all relationships automatically.

<div style={{maxWidth: '100%', marginBottom: '20px'}}>
  <video width="100%" controls style={{maxWidth: '800px', borderRadius: '10px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)'}}>
    <source src="https://video.wixstatic.com/video/06ddae_7d1d30abd775432083213b4f2d86c4ac/1080p/mp4/file.mp4" type="video/mp4" />
    <p>Your browser does not support the video tag.</p>
  </video>
</div>

Click **Build** to generate the full repository:

<img src={require('./image-71.png').default} alt="Build button" width="650" />

:::info Merge Strategy
The `stacktic` branch contains generated code; `main` is yours. Stacktic auto-merges while respecting your custom edits. You can ignore, overwrite, or merge from the UI.
:::

<img src={require('./image-72.png').default} alt="Merge strategy" width="650" />

</div>

---

## Step 4 — Deploy

<div style={{background: '#f8f9fb', borderRadius: '12px', padding: '24px', border: '1px solid #e0e4e8', marginBottom: '24px'}}>

Clone the generated repo and apply to your Kubernetes cluster:

```bash
# Clone the generated repo
git clone <your-stack-repo>
cd <your-stack-repo>

# Build & push images (Kaniko jobs)
kubectl apply -k k8s/build/overlays/dev/ --server-side --force-conflicts

# Deploy manifests
kubectl apply -k k8s/deploy/overlays/dev/ --server-side --force-conflicts

# Verify route
kubectl get apisixroute -A
```

:::tip Done!
Your stack is now running. Every component is connected, secured, and version-controlled.
:::

</div>

---

## What's Next?

<div style={{background: '#f8f9fb', borderRadius: '12px', padding: '24px', border: '1px solid #e0e4e8', marginBottom: '24px'}}>

<div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px'}}>
  <div style={{background: 'white', borderRadius: '10px', padding: '20px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)'}}>
    <h4 style={{margin: '0 0 8px 0', color: '#0052cc'}}>FastBuild</h4>
    <p style={{margin: '0 0 8px 0', fontSize: '0.9rem', color: '#555'}}>
      Changed tokens, secrets, or component values? Use <strong>FastBuild</strong> — it captures ~95% of relationships and rebuilds in seconds.
    </p>
    <pre style={{margin: 0, fontSize: '0.85rem', background: '#f0f4f8', borderRadius: '6px', padding: '12px', overflow: 'auto'}}><code>git fetch origin main{"\n"}git checkout main{"\n"}git reset --hard origin/main</code></pre>
  </div>
  <div style={{background: 'white', borderRadius: '10px', padding: '20px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)'}}>
    <h4 style={{margin: '0 0 8px 0', color: '#0052cc'}}>Source Code Options</h4>
    <table style={{fontSize: '0.9rem', width: '100%'}}>
      <thead><tr><th style={{textAlign: 'left', padding: '6px 8px'}}>Option</th><th style={{textAlign: 'left', padding: '6px 8px'}}>Best for</th></tr></thead>
      <tbody>
        <tr><td style={{padding: '6px 8px'}}><strong>External source</strong></td><td style={{padding: '6px 8px'}}>Point to your repo & Dockerfile</td></tr>
        <tr><td style={{padding: '6px 8px'}}><strong>image_base</strong></td><td style={{padding: '6px 8px'}}>Push your own image</td></tr>
        <tr><td style={{padding: '6px 8px'}}><strong>Templates</strong></td><td style={{padding: '6px 8px'}}>100% hands-off</td></tr>
      </tbody>
    </table>
  </div>
</div>

<details>
<summary><strong>Migrating an existing app?</strong></summary>

1. **Import code** — external repo or pre-built image
2. **Add databases** and create links between components
3. **Load data** — MinIO bucket job (recommended), manual restore, or `initdb` scripts
4. **Validate** ingress & health checks
5. **Add complexity** — Airflow, Kafka, RabbitMQ, etc.
6. **Enable Day-2 Ops** — logging, monitoring, autoscaling, security policies

</details>

</div>

---

## Reference

<div style={{background: '#f8f9fb', borderRadius: '12px', padding: '24px', border: '1px solid #e0e4e8'}}>

<details>
<summary><strong>Core Concepts</strong></summary>

| Concept | Description |
|---------|-------------|
| **Component** | A service — backend, PostgreSQL, Prometheus, etc. |
| **Sub-component** | A unit inside a component (DB schema, Kafka topic) |
| **Link** | Relationship between components (backend → DB) |
| **Attribute** | Parameter used for automation (ports, secrets, flags) |

</details>

<details>
<summary><strong>Automation Examples</strong></summary>

| When you connect… | Stacktic generates… |
|---|---|
| Source Code → Database | DB & user creation, connection string as Secret |
| Grafana → Prometheus | Metrics, ServiceMonitor, dashboard JSON |
| ArgoCD GitOps | `Application` CRs per component for multi-cluster sync |
| Kafka Topic → Database | Topic, ACLs, and KafkaConnect sink |
| **Security policies** | RBAC, NetworkPolicy, OPA Gatekeeper rules |

</details>

<details>
<summary><strong>Examples & Resources</strong></summary>

**Starter repos:**
- [Kafka Connect starter](https://github.com/stackticio/strimzi_basic_setup/tree/main)
- [Easy Llama](https://github.com/stackticio/Llama_base/tree/main)

**Links:**
- [Q&A](https://www.stacktic.io/differentiators) | [ROI Calculator](https://www.stacktic.io/roi) | [Blog](https://www.stacktic.io/blog) | [Demos](https://www.stacktic.io/demos)

Need help? **[support@stacktic.io](mailto:support@stacktic.io)**

</details>

</div>
