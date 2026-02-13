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
  <p>Before you start, prepare the following:</p>
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
    <div style={{padding: '12px 0'}}>
      <ol>
        <li>Go to <a href="https://github.com/settings/personal-access-tokens">github.com/settings/personal-access-tokens</a></li>
        <li>Click <strong>Generate new token</strong></li>
        <li>Under <strong>Repository access</strong>, select the repositories Stacktic will manage</li>
        <li>Under <strong>Permissions</strong>, enable all <strong>Repository</strong> and <strong>Account</strong> permissions <span style={{background: '#fee2e2', color: '#dc2626', padding: '2px 8px', borderRadius: '4px', fontWeight: 700, fontSize: '0.85rem'}}>Required — must allow all</span></li>
        <li>Generate and copy the token</li>
      </ol>
      <div style={{background: '#e6f7e6', borderLeft: '4px solid #2e7d32', borderRadius: '6px', padding: '12px 16px', marginBottom: '12px'}}>
        <strong>Tip:</strong> Use <strong>fine-grained tokens</strong> over classic tokens for better security. Grant only the repositories Stacktic needs.
      </div>
      <img src={require('./image-70.png').default} alt="GitHub token setup" width="650" />
    </div>
  </details>
</div>

---

## Step 2 — Configure

<div style={{background: '#f8f9fb', borderRadius: '12px', padding: '24px', border: '1px solid #e0e4e8', marginBottom: '24px'}}>
  <div style={{background: 'white', borderRadius: '10px', padding: '16px 20px', marginBottom: '20px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)'}}>
    <strong>Sign in</strong> at <a href="https://staging.app.stacktic.io/">staging.app.stacktic.io</a> and create or select a <strong>Stack</strong>.
  </div>
  <p>Paste your tokens in the Stack settings:</p>
  <div style={{display: 'flex', flexDirection: 'column', gap: '16px'}}>
    <div style={{background: 'white', borderRadius: '10px', padding: '16px 20px', borderLeft: '4px solid #0052cc', boxShadow: '0 1px 4px rgba(0,0,0,0.06)'}}>
      <p style={{fontWeight: 600, color: '#0052cc', marginBottom: '10px', fontSize: '1rem'}}>2a. Paste your Registry Token</p>
      <a href={require('./image-65.png').default} target="_blank"><img src={require('./image-65.png').default} alt="Registry token" width="780" style={{borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', cursor: 'zoom-in'}} /></a>
      <p style={{margin: '6px 0 0 0', fontSize: '0.75rem', color: '#999'}}>Click image to enlarge</p>
    </div>
    <div style={{background: 'white', borderRadius: '10px', padding: '16px 20px', borderLeft: '4px solid #0052cc', boxShadow: '0 1px 4px rgba(0,0,0,0.06)'}}>
      <p style={{fontWeight: 600, color: '#0052cc', marginBottom: '10px', fontSize: '1rem'}}>2b. Paste your Repo Token</p>
      <a href={require('./image-66.png').default} target="_blank"><img src={require('./image-66.png').default} alt="Repo token" width="780" style={{borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', cursor: 'zoom-in'}} /></a>
      <p style={{margin: '6px 0 0 0', fontSize: '0.75rem', color: '#999'}}>Click image to enlarge</p>
    </div>
    <div style={{background: 'white', borderRadius: '10px', padding: '16px 20px', borderLeft: '4px solid #0052cc', boxShadow: '0 1px 4px rgba(0,0,0,0.06)'}}>
      <p style={{fontWeight: 600, color: '#0052cc', marginBottom: '10px', fontSize: '1rem'}}>2c. SOPS Key (optional)</p>
      <a href={require('./image-67.png').default} target="_blank"><img src={require('./image-67.png').default} alt="SOPS key" width="780" style={{borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', cursor: 'zoom-in'}} /></a>
      <p style={{margin: '6px 0 0 0', fontSize: '0.75rem', color: '#999'}}>Click image to enlarge</p>
    </div>
  </div>
  <div style={{background: '#e3f2fd', border: '2px solid #1976d2', borderRadius: '10px', padding: '20px', marginTop: '20px'}}>
    <h4 style={{margin: '0 0 12px 0', color: '#0d47a1'}}>Understanding Git Branch and Build Branch</h4>
    <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '12px'}}>
      <div style={{background: 'white', borderRadius: '8px', padding: '14px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)'}}>
        <p style={{margin: 0, fontSize: '0.9rem'}}>
          <span style={{background: '#0052cc', color: 'white', padding: '2px 10px', borderRadius: '4px', fontWeight: 700, fontSize: '0.8rem', marginRight: '8px'}}>Git Branch</span>
          The <strong>source of truth</strong>. Stacktic automatically pushes the stack version and configuration to this branch. This is where the generated stack skeleton lives.
        </p>
      </div>
      <div style={{background: 'white', borderRadius: '8px', padding: '14px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)'}}>
        <p style={{margin: 0, fontSize: '0.9rem'}}>
          <span style={{background: '#2e7d32', color: 'white', padding: '2px 10px', borderRadius: '4px', fontWeight: 700, fontSize: '0.8rem', marginRight: '8px'}}>Build Branch</span>
          Where your <strong>code and customizations</strong> live. Stacktic uses a merge strategy to sync changes from the Git branch into the Build branch, respecting your edits.
        </p>
      </div>
    </div>
    <p style={{margin: 0, fontSize: '0.85rem', color: '#555'}}>
      Most of the time these are the same branch. The merge strategy ensures Stacktic's generated updates never overwrite your custom code.
    </p>
  </div>
</div>

---

## Step 3 — Design & Build

<div style={{background: '#f8f9fb', borderRadius: '12px', padding: '24px', border: '1px solid #e0e4e8', marginBottom: '24px'}}>
  <h3 style={{marginTop: 0}}>How the topology design works</h3>
  <p>Stacktic's topology design follows a simple principle:</p>
  <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', marginBottom: '16px'}}>
    <div style={{background: 'white', borderRadius: '8px', padding: '16px', borderTop: '3px solid #0052cc', boxShadow: '0 1px 4px rgba(0,0,0,0.06)'}}>
      <h4 style={{margin: '0 0 6px 0', color: '#0052cc'}}>Component</h4>
      <p style={{margin: 0, fontSize: '0.85rem', color: '#555'}}>The service itself and its configuration — a backend, a database, a message broker, etc.</p>
    </div>
    <div style={{background: 'white', borderRadius: '8px', padding: '16px', borderTop: '3px solid #0052cc', boxShadow: '0 1px 4px rgba(0,0,0,0.06)'}}>
      <h4 style={{margin: '0 0 6px 0', color: '#0052cc'}}>Sub-component</h4>
      <p style={{margin: 0, fontSize: '0.85rem', color: '#555'}}>Units related to a service — a database schema, a Kafka topic, an API endpoint, or any functionality needed to design logic and relations to other components.</p>
    </div>
    <div style={{background: 'white', borderRadius: '8px', padding: '16px', borderTop: '3px solid #0052cc', boxShadow: '0 1px 4px rgba(0,0,0,0.06)'}}>
      <h4 style={{margin: '0 0 6px 0', color: '#0052cc'}}>Link</h4>
      <p style={{margin: 0, fontSize: '0.85rem', color: '#555'}}>Links define the relationship between components. A link from backend to database creates endpoints, secrets, and APIs. A link from topic to database creates Kafka Connect and its dependencies.</p>
    </div>
  </div>
  <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px'}}>
    <div style={{background: 'white', borderRadius: '8px', padding: '16px', borderTop: '3px solid #f9a825', boxShadow: '0 1px 4px rgba(0,0,0,0.06)'}}>
      <h4 style={{margin: '0 0 6px 0', color: '#e65100'}}>Attributes</h4>
      <p style={{margin: 0, fontSize: '0.85rem', color: '#555'}}>
        Components, sub-components, and links have <strong>attributes</strong> that control automation behavior. Check the available attributes when connecting components. <strong>An empty attribute equals false</strong> — no configuration is applied. For example, if <code>storageClass</code> is empty, no StorageClass is defined and the cluster default is used.
      </p>
    </div>
    <div style={{background: 'white', borderRadius: '8px', padding: '16px', borderTop: '3px solid #f9a825', boxShadow: '0 1px 4px rgba(0,0,0,0.06)'}}>
      <h4 style={{margin: '0 0 6px 0', color: '#e65100'}}>Check link attributes</h4>
      <p style={{margin: 0, fontSize: '0.85rem', color: '#555'}}>
        When you create a link, always check if <strong>link-level attributes</strong> exist. These attributes fine-tune the automation — for example, enabling TLS, setting replica counts, or configuring connection pooling. If an attribute exists but is left empty, the feature is disabled by design.
      </p>
    </div>
  </div>
  <div style={{background: '#fff8e1', borderLeft: '4px solid #f9a825', borderRadius: '6px', padding: '12px 16px', marginBottom: '20px'}}>
    <strong>There is only one good pattern of configuration.</strong> If you are not following best practices, you are doing something wrong. Stacktic automates based on best practices and security requirements to create a top-quality, secure stack skeleton with all relationships wired correctly.
  </div>
  <h3>Drag, connect, build</h3>
  <p>Drag components onto the canvas and connect them. Stacktic maps all relationships automatically.</p>
  <div style={{maxWidth: '100%', marginBottom: '20px'}}>
    <video width="100%" controls style={{maxWidth: '800px', borderRadius: '10px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)'}}>
      <source src="https://video.wixstatic.com/video/06ddae_7d1d30abd775432083213b4f2d86c4ac/1080p/mp4/file.mp4" type="video/mp4" />
      <p>Your browser does not support the video tag.</p>
    </video>
  </div>
  <p>Click <strong>Build</strong> to generate the full repository:</p>
  <img src={require('./image-71.png').default} alt="Build button" width="650" />
  <div style={{background: '#e3f2fd', borderLeft: '4px solid #1976d2', borderRadius: '6px', padding: '12px 16px', margin: '16px 0'}}>
    <strong>Merge Strategy:</strong> The <code>stacktic</code> branch contains generated code; <code>main</code> is yours. Stacktic auto-merges while respecting your custom edits. You can ignore, overwrite, or merge from the UI.
  </div>
  <img src={require('./image-72.png').default} alt="Merge strategy" width="650" />
</div>

---

## Step 4 — Deploy

<div style={{background: '#f8f9fb', borderRadius: '12px', padding: '24px', border: '1px solid #e0e4e8', marginBottom: '24px'}}>
  <p>Clone the generated repo and apply to your Kubernetes cluster:</p>
  <pre style={{background: '#1e1e1e', color: '#d4d4d4', borderRadius: '8px', padding: '16px', fontSize: '0.9rem', overflow: 'auto'}}><code>{`# Clone the generated repo
git clone <your-stack-repo>
cd <your-stack-repo>

# Build & push images (Kaniko jobs)
kubectl apply -k k8s/build/overlays/dev/ --server-side --force-conflicts

# Deploy manifests
kubectl apply -k k8s/deploy/overlays/dev/ --server-side --force-conflicts

# Verify route
kubectl get apisixroute -A`}</code></pre>
  <div style={{background: '#e6f7e6', borderLeft: '4px solid #2e7d32', borderRadius: '6px', padding: '12px 16px', marginTop: '16px'}}>
    <strong>Done!</strong> Your stack is now running. Every component is connected, secured, and version-controlled.
  </div>
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
    <div style={{padding: '12px 0'}}>
      <ol>
        <li><strong>Import code</strong> — external repo or pre-built image</li>
        <li><strong>Add databases</strong> and create links between components</li>
        <li><strong>Load data</strong> — MinIO bucket job (recommended), manual restore, or <code>initdb</code> scripts</li>
        <li><strong>Validate</strong> ingress & health checks</li>
        <li><strong>Add complexity</strong> — Airflow, Kafka, RabbitMQ, etc.</li>
        <li><strong>Enable Day-2 Ops</strong> — logging, monitoring, autoscaling, security policies</li>
      </ol>
    </div>
  </details>
</div>

---

## Understanding the Automation Flow

<div style={{background: '#f8f9fb', borderRadius: '12px', padding: '24px', border: '1px solid #e0e4e8', marginBottom: '24px'}}>
  <p>Once your stack is running, here's how to explore what Stacktic automates for you — in 3 steps:</p>
  <div style={{maxWidth: '100%', marginBottom: '20px'}}>
    <video width="100%" controls style={{maxWidth: '800px', borderRadius: '10px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)'}}>
      <source src="https://video.wixstatic.com/video/06ddae_0cc72b5c41d1430b9333f2163de62fdb/1080p/mp4/file.mp4" type="video/mp4" />
      <p>Your browser does not support the video tag.</p>
    </video>
  </div>
  <div style={{display: 'flex', flexDirection: 'column', gap: '16px'}}>
    <div style={{background: 'white', borderRadius: '10px', padding: '20px', borderLeft: '4px solid #0052cc', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', display: 'flex', gap: '16px', alignItems: 'flex-start'}}>
      <div style={{background: '#0052cc', color: 'white', borderRadius: '50%', minWidth: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '1.1rem'}}>1</div>
      <div>
        <h4 style={{margin: '0 0 6px 0'}}>Discover available links</h4>
        <p style={{margin: 0, fontSize: '0.9rem', color: '#555'}}>
          Press the <strong>+ button</strong> on any component to see all available link types. Each link represents a relationship Stacktic can automate — for example, connecting a backend to a database, or Grafana to Prometheus.
        </p>
      </div>
    </div>
    <div style={{background: 'white', borderRadius: '10px', padding: '20px', borderLeft: '4px solid #0052cc', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', display: 'flex', gap: '16px', alignItems: 'flex-start'}}>
      <div style={{background: '#0052cc', color: 'white', borderRadius: '50%', minWidth: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '1.1rem'}}>2</div>
      <div>
        <h4 style={{margin: '0 0 6px 0'}}>See exactly what each link automates</h4>
        <p style={{margin: 0, fontSize: '0.9rem', color: '#555'}}>
          Click the <strong>info button</strong> on any component, sub-component, or link to see the exact automation flow — what files are generated, what configurations are injected, and how the relationship is wired end-to-end.
        </p>
      </div>
    </div>
    <div style={{background: 'white', borderRadius: '10px', padding: '20px', borderLeft: '4px solid #0052cc', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', display: 'flex', gap: '16px', alignItems: 'flex-start'}}>
      <div style={{background: '#0052cc', color: 'white', borderRadius: '50%', minWidth: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '1.1rem'}}>3</div>
      <div>
        <h4 style={{margin: '0 0 6px 0'}}>Read your stack-specific operations docs</h4>
        <p style={{margin: 0, fontSize: '0.9rem', color: '#555'}}>
          Stacktic auto-generates <strong>deep operational documentation</strong> for each component in your stack. These are not generic docs — they are written specifically for your stack's configuration, specifications, and relationships. Use them to understand Day-2 operations, troubleshooting, and how every piece fits together.
        </p>
      </div>
    </div>
  </div>
</div>

---

## Reference

<div style={{background: '#f8f9fb', borderRadius: '12px', padding: '24px', border: '1px solid #e0e4e8'}}>
  <details>
    <summary><strong>Core Concepts</strong></summary>
    <div style={{padding: '12px 0'}}>
      <table style={{fontSize: '0.9rem', width: '100%'}}>
        <thead><tr><th style={{textAlign: 'left', padding: '8px'}}>Concept</th><th style={{textAlign: 'left', padding: '8px'}}>Description</th></tr></thead>
        <tbody>
          <tr><td style={{padding: '8px'}}><strong>Component</strong></td><td style={{padding: '8px'}}>A service — backend, PostgreSQL, Prometheus, etc.</td></tr>
          <tr><td style={{padding: '8px'}}><strong>Sub-component</strong></td><td style={{padding: '8px'}}>A unit inside a component (DB schema, Kafka topic)</td></tr>
          <tr><td style={{padding: '8px'}}><strong>Link</strong></td><td style={{padding: '8px'}}>Relationship between components (backend → DB)</td></tr>
          <tr><td style={{padding: '8px'}}><strong>Attribute</strong></td><td style={{padding: '8px'}}>Parameter used for automation (ports, secrets, flags)</td></tr>
        </tbody>
      </table>
    </div>
  </details>
  <details>
    <summary><strong>Automation Examples</strong></summary>
    <div style={{padding: '12px 0'}}>
      <table style={{fontSize: '0.9rem', width: '100%'}}>
        <thead><tr><th style={{textAlign: 'left', padding: '8px'}}>When you connect…</th><th style={{textAlign: 'left', padding: '8px'}}>Stacktic generates…</th></tr></thead>
        <tbody>
          <tr><td style={{padding: '8px'}}>Source Code → Database</td><td style={{padding: '8px'}}>DB & user creation, connection string as Secret</td></tr>
          <tr><td style={{padding: '8px'}}>Grafana → Prometheus</td><td style={{padding: '8px'}}>Metrics, ServiceMonitor, dashboard JSON</td></tr>
          <tr><td style={{padding: '8px'}}>ArgoCD GitOps</td><td style={{padding: '8px'}}>Application CRs per component for multi-cluster sync</td></tr>
          <tr><td style={{padding: '8px'}}>Kafka Topic → Database</td><td style={{padding: '8px'}}>Topic, ACLs, and KafkaConnect sink</td></tr>
          <tr><td style={{padding: '8px'}}><strong>Security policies</strong></td><td style={{padding: '8px'}}>RBAC, NetworkPolicy, OPA Gatekeeper rules</td></tr>
        </tbody>
      </table>
    </div>
  </details>
  <details>
    <summary><strong>Examples & Resources</strong></summary>
    <div style={{padding: '12px 0'}}>
      <p><strong>Starter repos:</strong></p>
      <ul>
        <li><a href="https://github.com/stackticio/strimzi_basic_setup/tree/main">Kafka Connect starter</a></li>
        <li><a href="https://github.com/stackticio/Llama_base/tree/main">Easy Llama</a></li>
      </ul>
      <p><strong>Links:</strong></p>
      <p>
        <a href="https://www.stacktic.io/differentiators">Q&A</a> | <a href="https://www.stacktic.io/roi">ROI Calculator</a> | <a href="https://www.stacktic.io/blog">Blog</a> | <a href="https://www.stacktic.io/demos">Demos</a>
      </p>
      <p>Need help? <strong><a href="mailto:support@stacktic.io">support@stacktic.io</a></strong></p>
    </div>
  </details>
</div>
