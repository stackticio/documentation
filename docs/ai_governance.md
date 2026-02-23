---
sidebar_position: 23
hide_table_of_contents: false
---

# AI Governance & MCP

<div style={{background: 'linear-gradient(135deg, #0052cc 0%, #003d99 100%)', borderRadius: '12px', padding: '32px 40px', color: 'white', marginBottom: '32px'}}>
  <h2 style={{color: 'white', margin: '0 0 8px 0', fontSize: '1.6rem'}}>The Dark Open-Source Factory — where AI governance is the architecture</h2>
  <p style={{margin: 0, opacity: 0.9, fontSize: '1.05rem'}}>
    In manufacturing, a "dark factory" runs lights-out — fully automated, zero human intervention. Stacktic brings this model to open-source infrastructure. Every stack generates a governed MCP server where the topology you design determines exactly what AI can see, query, and modify. The result: autonomous, metadata-driven operations with zero raw access — an open-source dark factory for topology, relationships, and operations automation.
  </p>
</div>

<iframe src="/documentation/website/solution/ai-governance.html" width="100%" height="750px" frameBorder="0" style={{borderRadius: '12px', marginBottom: '24px'}}></iframe>

{/* THE BIGGER PICTURE */}
<div style={{background: '#1a1a2e', borderRadius: '12px', padding: '24px', marginBottom: '32px', border: '1px solid #1976d2'}}>
  <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px'}}>
    <div>
      <h3 style={{color: 'white', margin: '0 0 12px 0'}}>Why AI governance is the next infrastructure challenge</h3>
      <p style={{color: '#b0bec5', fontSize: '0.95rem', margin: '0 0 16px 0'}}>
        AI agents are becoming the primary operators of infrastructure. They diagnose incidents, query databases, read logs, and trigger deployments. But today, giving AI access means giving it <code style={{color: '#8ecaff'}}>kubectl</code> — raw, unstructured, unlimited access to your entire cluster.
      </p>
      <p style={{color: '#b0bec5', fontSize: '0.95rem', margin: '0 0 16px 0'}}>
        The industry response is to <strong style={{color: 'white'}}>bolt on governance after the fact</strong> — policy engines, permission layers, audit wrappers. This creates another system to maintain, another thing that can drift, another gap between intention and reality.
      </p>
      <p style={{color: '#b0bec5', fontSize: '0.95rem', margin: 0}}>
        Stacktic eliminates this problem entirely. <strong style={{color: 'white'}}>The topology you draw IS the governance.</strong> When you design your stack — components, links, sub-components — you're simultaneously defining what AI can access, what metadata it receives, what operations it can perform, and what credentials it holds. Nothing to bolt on. Nothing to drift.
      </p>
    </div>
    <div style={{display: 'flex', flexDirection: 'column', gap: '10px'}}>
      <div style={{background: '#0d2137', borderRadius: '8px', padding: '14px', borderLeft: '3px solid #f44336'}}>
        <div style={{color: '#f44336', fontWeight: 700, fontSize: '0.8rem', marginBottom: '4px'}}>THE INDUSTRY PROBLEM</div>
        <p style={{color: '#e0e0e0', fontSize: '0.85rem', margin: 0}}>AI + kubectl = full cluster access. No structural boundaries. Every enterprise is one hallucinated command away from a production incident.</p>
      </div>
      <div style={{background: '#0d2137', borderRadius: '8px', padding: '14px', borderLeft: '3px solid #4caf50'}}>
        <div style={{color: '#4caf50', fontWeight: 700, fontSize: '0.8rem', marginBottom: '4px'}}>THE STACKTIC ANSWER</div>
        <p style={{color: '#e0e0e0', fontSize: '0.85rem', margin: 0}}>AI receives structured metadata, typed tools, and scoped credentials — auto-generated from the stack topology. The metadata feed IS the control plane.</p>
      </div>
      <div style={{background: '#0d2137', borderRadius: '8px', padding: '14px', borderLeft: '3px solid #0052cc'}}>
        <div style={{color: '#90caf9', fontWeight: 700, fontSize: '0.8rem', marginBottom: '4px'}}>THE DARK FACTORY MODEL</div>
        <p style={{color: '#e0e0e0', fontSize: '0.85rem', margin: 0}}>You don't govern AI by restricting it. You govern AI by <strong style={{color: 'white'}}>feeding it the right metadata</strong>. Stacktic is the interface between AI and production — every tool is validated, every configuration production-hardened, every secret scoped, every operation error-proof. The topology metadata gives AI complete understanding with zero raw access. Lights-out operations.</p>
      </div>
    </div>
  </div>
</div>

---

## Stacktic: The Production Interface for AI

<div style={{background: '#1a1a2e', borderRadius: '12px', padding: '24px', marginBottom: '32px', border: '1px solid #1976d2'}}>
  <p style={{color: '#e0e0e0', fontSize: '0.95rem', margin: '0 0 16px 0'}}>
    AI doesn't talk to your infrastructure directly. <strong style={{color: 'white'}}>Stacktic is the interface.</strong> Every tool AI calls was generated from a validated template. Every configuration is production-hardened. Every credential is scoped and resolved at runtime. Every operation is bounded by typed parameters — no arbitrary commands, no room for hallucinated kubectl.
  </p>
  <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '12px'}}>
    <div style={{background: '#0d2137', borderRadius: '8px', padding: '14px', textAlign: 'center'}}>
      <div style={{color: '#4caf50', fontWeight: 700, fontSize: '1.2rem', marginBottom: '4px'}}>Validated</div>
      <p style={{color: '#b0bec5', fontSize: '0.8rem', margin: 0}}>Every tool generated from tested templates with typed parameters</p>
    </div>
    <div style={{background: '#0d2137', borderRadius: '8px', padding: '14px', textAlign: 'center'}}>
      <div style={{color: '#60d5ff', fontWeight: 700, fontSize: '1.2rem', marginBottom: '4px'}}>Production</div>
      <p style={{color: '#b0bec5', fontSize: '0.8rem', margin: 0}}>Configurations are production-grade — Helm values, K8s manifests, SOPS secrets</p>
    </div>
    <div style={{background: '#0d2137', borderRadius: '8px', padding: '14px', textAlign: 'center'}}>
      <div style={{color: '#fbbf24', fontWeight: 700, fontSize: '1.2rem', marginBottom: '4px'}}>Restricted</div>
      <p style={{color: '#b0bec5', fontSize: '0.8rem', margin: 0}}>No kubectl, no arbitrary commands — only scoped tools from drawn links</p>
    </div>
    <div style={{background: '#0d2137', borderRadius: '8px', padding: '14px', textAlign: 'center'}}>
      <div style={{color: '#f44336', fontWeight: 700, fontSize: '1.2rem', marginBottom: '4px'}}>Error-Proof</div>
      <p style={{color: '#b0bec5', fontSize: '0.8rem', margin: 0}}>Typed params, credential scoping, write gating — AI cannot make destructive mistakes</p>
    </div>
  </div>
</div>

---

## AI + kubectl vs Stacktic MCP

<div style={{marginBottom: '32px'}}>

| Capability | AI + kubectl (raw access) | Stacktic MCP |
|---|---|---|
| **What AI sees** | Raw YAML, thousands of resources, no context | Structured topology — components, links, types, groups |
| **How AI queries** | `kubectl get pods -A` — wall of text to parse | `query_topology(source="type:kafka")` — typed JSON |
| **Cross-component awareness** | AI must guess relationships from labels | Links are first-class — AI knows what connects to what |
| **Credential access** | AI needs `kubectl get secret` — sees raw passwords | MCP server holds credentials internally, AI never sees them |
| **Write operations** | `kubectl apply/delete` — anything goes | Per-service write gating (`MCP_*_WRITE_ACCESS=false`) |
| **Blast radius** | Entire cluster — can delete any namespace | Only services with drawn links. No link = no access |
| **Multi-stack** | Full kubeconfig access to every cluster | Each stack's MCP exposes only its own topology |
| **Observability** | AI runs `kubectl logs`, `curl prometheus` manually | Typed tools: `loki_query()`, `prom_query()`, `grafana_list_dashboards()` |
| **Incident response** | AI improvises — different approach every time | Prompt templates: structured playbook, repeatable steps |
| **Adding a new service** | Manually teach AI how to access it | Draw a link in Stacktic → MCP tools auto-generated |
| **Audit trail** | Shell history (if saved) | Every MCP call is JSON-RPC — method, params, timestamp |
| **Security review** | Review every kubectl command AI might run | Review tool definitions once — that's the attack surface |

</div>

---

## How It Works

<div style={{background: '#f8f9fb', borderRadius: '12px', padding: '24px', border: '1px solid #e0e4e8', marginBottom: '32px'}}>

```
┌─────────────────────────────────────────────────────────────────────┐
│                        AI Client (Claude, Cursor, etc.)             │
│                     Sends: tools/call, prompts/get                  │
└──────────────────────────────┬──────────────────────────────────────┘
                               │ MCP Protocol (JSON-RPC)
                               │ Authorization: Bearer <api_key>
                               ▼
┌─────────────────────────────────────────────────────────────────────┐
│                         APISIX Gateway                              │
│                   key-auth, CORS, TLS termination                   │
└──────────────────────────────┬──────────────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────────────┐
│                        FastMCP Server (per stack)                   │
│                                                                     │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐              │
│  │ Topology     │  │ Prometheus   │  │ Loki         │              │
│  │ Tools (7)    │  │ Tools (7)    │  │ Tools (5)    │   Tools are  │
│  ├──────────────┤  ├──────────────┤  ├──────────────┤   auto-      │
│  │ CNPG         │  │ Grafana      │  │ ClickHouse   │   generated  │
│  │ Tools (5)    │  │ Tools (5)    │  │ Tools (5)    │   from       │
│  ├──────────────┤  ├──────────────┤  ├──────────────┤   topology   │
│  │ Kafka        │  │ ArgoCD       │  │ Valkey       │   links      │
│  │ Tools        │  │ Tools (6)    │  │ Tools (8)    │              │
│  ├──────────────┤  ├──────────────┤  ├──────────────┤              │
│  │ Prompts (6)  │  │ Resources(3) │  │ S3 Tools (5) │              │
│  └──────────────┘  └──────────────┘  └──────────────┘              │
│                                                                     │
│  Credentials from cloud.env (SOPS encrypted)                       │
│  Write-access gating per service                                    │
└──────────────────────────────┬──────────────────────────────────────┘
                               │ HTTP/gRPC/TCP (internal cluster network)
                               ▼
┌─────────────────────────────────────────────────────────────────────┐
│                     Stack Services                                  │
│  PostgreSQL  │  Kafka  │  Prometheus  │  Grafana  │  Loki  │  ...  │
└─────────────────────────────────────────────────────────────────────┘
```

</div>

**The MCP server is a ConfigMap-mounted Python application.** Tool files are generated from templates — when you draw a link from FastMCP to Grafana, the `grafana_tools.py` file is included. When you remove the link, it's deleted. No manual configuration.

---

## Stack Agent API — The Intelligence Layer

<div style={{background: '#1a1a2e', borderRadius: '12px', padding: '24px', marginBottom: '32px', border: '1px solid #1976d2'}}>
  <p style={{color: '#b0bec5', fontSize: '0.95rem', marginTop: 0}}>
    The Stack Agent is a lightweight pod deployed per stack that holds the <strong style={{color: 'white'}}>entire topology as structured metadata</strong>. It exposes a single API endpoint — <code style={{color: '#8ecaff'}}>POST /metadata/q</code> — that lets you query your stack like a database. The MCP topology tools are a thin wrapper around this API.
  </p>

  <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px'}}>

    <div style={{background: '#0d2137', borderRadius: '10px', padding: '20px', borderTop: '3px solid #4caf50'}}>
      <h4 style={{color: '#4caf50', margin: '0 0 12px 0'}}>What AI gets from the API</h4>
      <ul style={{margin: 0, paddingLeft: '18px', color: '#b0bec5', fontSize: '0.88rem'}}>
        <li>Every component — name, type, namespace, group</li>
        <li>Every sub-component — databases, topics, queues, buckets, models</li>
        <li>Every link — who connects to whom, with direction and type</li>
        <li>Every attribute — ports, credentials, endpoints, config</li>
        <li>Cross-stack boundaries — <code style={{color: '#8ecaff'}}>is_external</code> flag</li>
        <li>Run shell commands with auto-resolved variables</li>
      </ul>
    </div>

    <div style={{background: '#0d2137', borderRadius: '10px', padding: '20px', borderTop: '3px solid #f9a825'}}>
      <h4 style={{color: '#f9a825', margin: '0 0 12px 0'}}>Why this matters for governance</h4>
      <ul style={{margin: 0, paddingLeft: '18px', color: '#b0bec5', fontSize: '0.88rem'}}>
        <li>AI doesn't need <code style={{color: '#8ecaff'}}>kubectl</code> — it queries structured JSON</li>
        <li>Variables like <code style={{color: '#8ecaff'}}>{'{namespace}'}</code>, <code style={{color: '#8ecaff'}}>{'{password}'}</code> resolve automatically</li>
        <li>AI never sees raw credentials — the Agent substitutes them</li>
        <li>Commands run inside the Agent pod — not from AI's context</li>
        <li>Every query is scoped to the stack's topology</li>
        <li>Dry-run mode lets AI preview without executing</li>
      </ul>
    </div>

  </div>
</div>

### Query Model — Source / Target / Where

<div style={{background: '#f8f9fb', borderRadius: '12px', padding: '24px', border: '1px solid #e0e4e8', marginBottom: '24px'}}>
  <p style={{fontSize: '0.95rem', color: '#555', marginTop: 0}}>
    Every MCP topology call maps to a <code>POST /metadata/q</code> request with a source/target/where structure. This is the "SQL" of your stack.
  </p>

  <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', marginBottom: '16px'}}>

    <div style={{background: 'white', borderRadius: '8px', padding: '16px', borderTop: '3px solid #0052cc', boxShadow: '0 1px 4px rgba(0,0,0,0.06)'}}>
      <h4 style={{margin: '0 0 8px 0', color: '#0052cc', fontSize: '0.9rem'}}>Source — WHAT to query</h4>
      <div style={{fontSize: '0.82rem', color: '#555'}}>
        <code>"all"</code> — every component<br/>
        <code>"type:kafka"</code> — all Kafka instances<br/>
        <code>"namespace:db"</code> — all in namespace<br/>
        <code>"group:backend"</code> — all in group<br/>
        <code>"kafka"</code> — specific by name
      </div>
    </div>

    <div style={{background: 'white', borderRadius: '8px', padding: '16px', borderTop: '3px solid #2e7d32', boxShadow: '0 1px 4px rgba(0,0,0,0.06)'}}>
      <h4 style={{margin: '0 0 8px 0', color: '#2e7d32', fontSize: '0.9rem'}}>Target — WHAT to return</h4>
      <div style={{fontSize: '0.82rem', color: '#555'}}>
        <code>"component"</code> — the component itself<br/>
        <code>"sub_components"</code> — DBs, topics, queues<br/>
        <code>"links_to"</code> — outbound connections<br/>
        <code>"links_from"</code> — inbound connections<br/>
        <code>"attributes"</code> — config values
      </div>
    </div>

    <div style={{background: 'white', borderRadius: '8px', padding: '16px', borderTop: '3px solid #e65100', boxShadow: '0 1px 4px rgba(0,0,0,0.06)'}}>
      <h4 style={{margin: '0 0 8px 0', color: '#e65100', fontSize: '0.9rem'}}>Where — HOW to filter</h4>
      <div style={{fontSize: '0.82rem', color: '#555'}}>
        <code>"field": "value"</code> — exact match<br/>
        <code>"field__contains": "str"</code> — substring<br/>
        <code>"field__exists": true</code> — field present<br/>
        <code>"field__in": ["a","b"]</code> — in list<br/>
        <code>"field__gt": N</code> — greater than
      </div>
    </div>

  </div>
</div>

### Variable Substitution — Zero Hardcoding

<div style={{background: '#1a1a2e', borderRadius: '12px', padding: '24px', marginBottom: '24px', border: '1px solid #1976d2'}}>
  <p style={{color: '#b0bec5', fontSize: '0.95rem', marginTop: 0}}>
    When AI sends a command like <code style={{color: '#8ecaff'}}>kubectl get pods -n {'{namespace}'}</code>, the Stack Agent resolves <code style={{color: '#8ecaff'}}>{'{namespace}'}</code> to the actual namespace from the topology. The AI never hardcodes service names, ports, or credentials.
  </p>

| Variable | Resolved from | Example value |
|---|---|---|
| `{namespace}` | Component metadata | `kafka`, `db`, `monitoring` |
| `{name}` | Component name | `kafka`, `cnpg`, `prometheus` |
| `{port}` | Component attributes | `5432`, `9092`, `9090` |
| `{password}` | Component attributes | *(auto-resolved, AI never sees it)* |
| `{database}` | Sub-component attributes | `app_db`, `analytics` |
| `{username}` | Sub-component attributes | `app_user`, `admin` |
| `{host}` | Computed from type pattern | `cluster-db-rw.db.svc.cluster.local` |
| `{link_name}` | Link metadata | `fastapi-kafka_topic` |
| `{linked_namespace}` | Linked component | `messaging` |
| `{linked_is_external}` | Cross-stack flag | `true` / `false` |

  <div style={{background: '#162032', borderLeft: '3px solid #90caf9', borderRadius: '6px', padding: '12px 16px', marginTop: '16px'}}>
    <p style={{color: '#b0bec5', fontSize: '0.85rem', margin: 0}}>
      <strong style={{color: 'white'}}>Key governance point:</strong> AI writes generic commands with {'{variables}'}. The Stack Agent resolves them. The same command works across any stack, any environment — <strong style={{color: 'white'}}>zero hardcoded names, ports, or credentials</strong>.
    </p>
  </div>
</div>

### Command Pipeline — Test + Diagnose

<div style={{background: '#f8f9fb', borderRadius: '12px', padding: '24px', border: '1px solid #e0e4e8', marginBottom: '24px'}}>

```
┌──────────────────────────────────────────────────────────────────────────┐
│  AI calls: run_test(source="type:cnpg", target="sub_components",        │
│            command="PGPASSWORD={password} psql -h {host} -U {username}  │
│                     -d {database} -c 'SELECT 1'")                       │
└──────────────────────────────┬───────────────────────────────────────────┘
                               │
                               ▼
┌──────────────────────────────────────────────────────────────────────────┐
│  Stack Agent resolves variables per sub-component:                       │
│  {password} → "s3cur3pw", {host} → "cluster-db-rw.db.svc...",          │
│  {username} → "app_user", {database} → "app_db"                         │
└──────────────────────────────┬───────────────────────────────────────────┘
                               │
                    ┌──────────┴──────────┐
                    │    command executes   │
                    │    (exit code check)  │
                    └──────────┬──────────┘
                               │
                   ┌───────────┴───────────┐
                   │                       │
              exit 0 (pass)          exit ≠ 0 (fail)
                   │                       │
                   ▼                       ▼
         ┌─────────────────┐     ┌─────────────────┐
         │  wait            │     │  run on_failure  │
         │  verify_delay    │     │  (diagnostics)   │
         │  then on_success │     └─────────────────┘
         └─────────────────┘
```

</div>

### MCP Tools that Wrap the API

<div style={{marginBottom: '24px'}}>

| MCP Tool | What it does | Maps to |
|---|---|---|
| **`query_topology()`** | Full query with all parameters — source, target, where, command, pipeline | `POST /metadata/q` with full body |
| **`list_components()`** | List all components with types, groups, namespaces | `POST /metadata/q` → source="all", target="component" |
| **`get_component_links()`** | Get outbound or inbound links for a component | `POST /metadata/q` → target="links_to" or "links_from" |
| **`run_test()`** | Run a validation command with full pipeline | `POST /metadata/q` with command + on_success/on_failure |
| **`get_stack_structure()`** | Get component tree with sub-component counts | `GET /metadata/structure` |
| **`get_available_fields()`** | Discover what {'{variables}'} are available for a component | `GET /metadata/fields/{'{component}'}` |

</div>

### MCP Resources — Persistent Context

<div style={{marginBottom: '24px'}}>

| Resource URI | What AI gets | Use case |
|---|---|---|
| **`stack://guide/api`** | Full API reference — source options, target options, where operators, host patterns, CLI tools, test examples | AI reads once, knows how to query everything |
| **`stack://live/summary`** | Live snapshot — domain, component counts by type, namespaces, groups | Quick stack overview before deep queries |
| **`stack://live/structure`** | Live topology tree — every component, sub-component count, link list | Full map for navigation and planning |

  <div style={{background: '#e3f2fd', borderLeft: '4px solid #1976d2', borderRadius: '6px', padding: '12px 16px', marginTop: '12px'}}>
    <strong>How it works together:</strong> AI reads the <code>stack://guide/api</code> resource once to learn the query language. Then calls <code>get_stack_structure()</code> to understand the topology. Then uses <code>query_topology()</code> and <code>run_test()</code> to investigate specific components. The MCP prompts (diagnose_component, incident_response, etc.) encode this workflow as reusable playbooks.
  </div>
</div>

### Example: AI Queries the Stack

<div style={{background: '#1a1a2e', borderRadius: '12px', padding: '24px', marginBottom: '32px', border: '1px solid #1976d2'}}>

  <div style={{display: 'flex', flexDirection: 'column', gap: '12px'}}>

    <div style={{background: '#0d2137', borderRadius: '8px', padding: '14px', borderLeft: '3px solid #4caf50'}}>
      <div style={{color: '#4caf50', fontWeight: 700, fontSize: '0.8rem', marginBottom: '6px'}}>1. "What's in this stack?"</div>
      <pre style={{background: '#162032', color: '#e0e0e0', borderRadius: '6px', padding: '10px', fontSize: '0.78rem', overflow: 'auto', margin: 0}}><code>{`tools/call → list_components()
→ [{name: "kafka", type: "kafka", namespace: "kafka", group: "messaging"},
   {name: "cnpg", type: "cnpg", namespace: "db", group: "databases"},
   {name: "fastapi", type: "fastapi", namespace: "app", group: "backend"},
   {name: "apisix", type: "apisix", namespace: "ingress", group: "gateway"}, ...]`}</code></pre>
    </div>

    <div style={{background: '#0d2137', borderRadius: '8px', padding: '14px', borderLeft: '3px solid #f9a825'}}>
      <div style={{color: '#f9a825', fontWeight: 700, fontSize: '0.8rem', marginBottom: '6px'}}>2. "What databases exist?"</div>
      <pre style={{background: '#162032', color: '#e0e0e0', borderRadius: '6px', padding: '10px', fontSize: '0.78rem', overflow: 'auto', margin: 0}}><code>{`tools/call → query_topology(source="type:cnpg", target="sub_components",
                              select=["database", "username", "consumers"])
→ [{database: "app_db", username: "app_user", consumers: ["fastapi"]},
   {database: "keycloak_db", username: "keycloak", consumers: ["keycloak"]}]`}</code></pre>
    </div>

    <div style={{background: '#0d2137', borderRadius: '8px', padding: '14px', borderLeft: '3px solid #0052cc'}}>
      <div style={{color: '#90caf9', fontWeight: 700, fontSize: '0.8rem', marginBottom: '6px'}}>3. "Can the backend reach its database?"</div>
      <pre style={{background: '#162032', color: '#e0e0e0', borderRadius: '6px', padding: '10px', fontSize: '0.78rem', overflow: 'auto', margin: 0}}><code>{`tools/call → run_test(
  source="type:cnpg", target="sub_components",
  command='PGPASSWORD={password} psql -h {host} -p {port} -U {username} -d {database} -c "SELECT 1"',
  on_failure='kubectl get pods -n {namespace} -l cnpg.io/cluster --no-headers')
→ {status: "passed", results: [{name: "app_db", status: "passed", output: "1"},
                                {name: "keycloak_db", status: "passed", output: "1"}]}`}</code></pre>
    </div>

    <div style={{background: '#0d2137', borderRadius: '8px', padding: '14px', borderLeft: '3px solid #e65100'}}>
      <div style={{color: '#e65100', fontWeight: 700, fontSize: '0.8rem', marginBottom: '6px'}}>4. "Preview before executing" (dry run)</div>
      <pre style={{background: '#162032', color: '#e0e0e0', borderRadius: '6px', padding: '10px', fontSize: '0.78rem', overflow: 'auto', margin: 0}}><code>{`tools/call → query_topology(source="apisix", target="links_to",
                              command="curl -sk https://{subdomain}.{domain}",
                              dry_run=true)
→ [{name: "fastapi", command: "curl -sk https://api.stack-3.source-lab.io"},
   {name: "grafana", command: "curl -sk https://grafana.stack-3.source-lab.io"},
   {name: "langflow", command: "curl -sk https://langflow.stack-3.source-lab.io"}]`}</code></pre>
    </div>

  </div>

  <div style={{background: '#162032', borderLeft: '3px solid #90caf9', borderRadius: '6px', padding: '12px 16px', marginTop: '16px'}}>
    <p style={{color: '#b0bec5', fontSize: '0.85rem', margin: 0}}>
      <strong style={{color: 'white'}}>AI never hardcoded a single name, port, or password.</strong> It queried the topology, got structured data, and used {'{variables}'} for commands. The Stack Agent resolved everything from the metadata. Same queries work on any stack.
    </p>
  </div>
</div>

---

## Governance by Architecture — 4 Layers

<div style={{background: '#1a1a2e', borderRadius: '12px', padding: '24px', marginBottom: '32px', border: '1px solid #1976d2'}}>
  <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px'}}>

    <div style={{background: '#0d2137', borderRadius: '10px', padding: '20px', borderTop: '3px solid #4caf50'}}>
      <h4 style={{color: '#4caf50', margin: '0 0 12px 0'}}>Layer 1: Generation (Day 0)</h4>
      <p style={{color: '#b0bec5', fontSize: '0.9rem', margin: '0 0 10px 0'}}>
        <strong style={{color: 'white'}}>What CAN exist</strong> — 70 curated templates. AI can't invent components or create arbitrary connections. Link types are predefined.
      </p>
      <div style={{fontSize: '0.8rem', color: '#90caf9', fontFamily: 'monospace'}}>
        Templates → Hooks → Deterministic output
      </div>
    </div>

    <div style={{background: '#0d2137', borderRadius: '10px', padding: '20px', borderTop: '3px solid #f9a825'}}>
      <h4 style={{color: '#f9a825', margin: '0 0 12px 0'}}>Layer 2: Topology (Runtime)</h4>
      <p style={{color: '#b0bec5', fontSize: '0.9rem', margin: '0 0 10px 0'}}>
        <strong style={{color: 'white'}}>What AI KNOWS</strong> — Stack Agent provides structured metadata. AI sees components through a typed API, not raw kubectl output.
      </p>
      <div style={{fontSize: '0.8rem', color: '#90caf9', fontFamily: 'monospace'}}>
        Stack Agent → Metadata API → Structured JSON
      </div>
    </div>

    <div style={{background: '#0d2137', borderRadius: '10px', padding: '20px', borderTop: '3px solid #0052cc'}}>
      <h4 style={{color: '#90caf9', margin: '0 0 12px 0'}}>Layer 3: Operations (Day 2)</h4>
      <p style={{color: '#b0bec5', fontSize: '0.9rem', margin: '0 0 10px 0'}}>
        <strong style={{color: 'white'}}>What AI CAN DO</strong> — MCP tools with write-access gating. Prompt templates guide AI through structured workflows. Everything auditable.
      </p>
      <div style={{fontSize: '0.8rem', color: '#90caf9', fontFamily: 'monospace'}}>
        MCP Tools → Write Gating → Audit Trail
      </div>
    </div>

    <div style={{background: '#0d2137', borderRadius: '10px', padding: '20px', borderTop: '3px solid #e65100'}}>
      <h4 style={{color: '#e65100', margin: '0 0 12px 0'}}>Layer 4: Multi-Stack Isolation</h4>
      <p style={{color: '#b0bec5', fontSize: '0.9rem', margin: '0 0 10px 0'}}>
        <strong style={{color: 'white'}}>What SCOPE AI has</strong> — Each stack generates its own MCP with its own credentials and topology. Cross-stack access is explicitly controlled.
      </p>
      <div style={{fontSize: '0.8rem', color: '#90caf9', fontFamily: 'monospace'}}>
        Per-stack MCP → Isolated credentials → is_external boundaries
      </div>
    </div>

  </div>
</div>

---

## 360° Stack Metadata for AI

<div style={{background: '#f8f9fb', borderRadius: '12px', padding: '24px', border: '1px solid #e0e4e8', marginBottom: '32px'}}>
  <p style={{fontSize: '0.95rem', color: '#555', marginTop: 0}}>
    Stacktic provides AI with complete, structured metadata about every layer of the stack. Instead of parsing YAML or guessing service names, AI gets typed, queryable data from a single source of truth.
  </p>

| Metadata | What AI learns | Source |
|---|---|---|
| **Components** | Every service — name, type, namespace, group | `list_components()` |
| **Topology** | What connects to what — all links with directions | `get_component_links()` |
| **Sub-components** | Databases, topics, queues, buckets, models | `query_topology(target="sub_components")` |
| **Attributes** | Ports, credentials, config per component | `query_topology(target="attributes")` |
| **Cross-stack** | Which services are external, their endpoints | `is_external` flag in metadata |
| **Prometheus metrics** | Active targets, alert rules, metric values | `prom_query()`, `prom_alerts()` |
| **Grafana dashboards** | All dashboards, datasources, folders | `grafana_list_dashboards()` |
| **Loki logs** | Log labels, streams, LogQL query results | `loki_labels()`, `loki_query_range()` |
| **Database schemas** | Tables, columns, row counts | `ch_describe_table()`, `cnpg` tools |
| **ArgoCD state** | App sync status, health, resource tree | `argocd_list_applications()` |

  <div style={{background: '#e3f2fd', borderLeft: '4px solid #1976d2', borderRadius: '6px', padding: '12px 16px', marginTop: '16px'}}>
    <strong>Key point:</strong> This metadata is not manually configured. It's auto-generated from the topology you draw in Stacktic. Add a component, its metadata becomes queryable. Draw a link, the connection appears in the API.
  </div>
</div>

---

## MCP Tools — Auto-Generated from Links

<div style={{marginBottom: '32px'}}>

When you draw a link from FastMCP to a service, the corresponding tool file is generated and mounted into the MCP server. When you remove the link, the file is deleted.

| Link drawn | Tools generated | Operations |
|---|---|---|
| `fastmcp → stack_agent` | **Topology** (7 tools) + **Prompts** (6) | `query_topology`, `run_test`, `list_components`, `get_stack_structure`, `get_available_fields`, `get_component_links` |
| `fastmcp → cnpg` | **CNPG** (5 tools) | `cnpg_list_databases`, `cnpg_query`, `cnpg_table_stats`, `cnpg_describe_table`, `cnpg_list_tables` |
| `fastmcp → prometheus` | **Prometheus** (7 tools) | `prom_query`, `prom_query_range`, `prom_alerts`, `prom_targets`, `prom_rules`, `prom_label_values`, `prom_series` |
| `fastmcp → grafana` | **Grafana** (5-6 tools) | `grafana_list_dashboards`, `grafana_get_dashboard`, `grafana_list_datasources`, `grafana_get_alerts`, `grafana_list_folders`, `grafana_create_annotation`* |
| `fastmcp → loki` | **Loki** (5 tools) | `loki_query`, `loki_query_range`, `loki_labels`, `loki_label_values`, `loki_series` |
| `fastmcp → clickhouse` | **ClickHouse** (5 tools) | `ch_list_databases`, `ch_list_tables`, `ch_describe_table`, `ch_query`, `ch_table_stats` |
| `fastmcp → rabbitmq` | **RabbitMQ** (varies) | Queue management, message operations |
| `fastmcp → valkey` | **Valkey** (6-8 tools) | `valkey_info`, `valkey_dbsize`, `valkey_scan_keys`, `valkey_get`, `valkey_type_and_ttl`, `valkey_hgetall`, `valkey_set`*, `valkey_delete`* |
| `fastmcp → argo_cd` | **ArgoCD** (5-6 tools) | `argocd_list_applications`, `argocd_get_application`, `argocd_get_app_resources`, `argocd_list_projects`, `argocd_get_app_events`, `argocd_sync_application`* |
| `fastmcp → seaweedfs` | **S3** (5 tools) | `s3_list_buckets`, `s3_list_objects`, `s3_get_object`, `s3_read_text`, `s3_bucket_stats` |
| `fastmcp → fastapi` | **FastAPI** (varies) | HTTP proxy tools for backend API |

<em>* = write-gated — only registered when `MCP_*_WRITE_ACCESS=true`</em>

</div>

---

## Write-Access Gating

<div style={{background: '#1a1a2e', borderRadius: '12px', padding: '24px', marginBottom: '32px', border: '1px solid #1976d2'}}>
  <p style={{color: '#b0bec5', fontSize: '0.95rem', marginTop: 0}}>
    Every service connection has an independent write-access flag. Read tools are always available. Write tools only appear when explicitly enabled.
  </p>

  <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px'}}>

    <div style={{background: '#0d2137', borderRadius: '10px', padding: '16px'}}>
      <h4 style={{color: '#4caf50', margin: '0 0 10px 0'}}>Read-only (default)</h4>
      <pre style={{background: '#162032', color: '#e0e0e0', borderRadius: '6px', padding: '12px', fontSize: '0.82rem', overflow: 'auto', margin: 0}}><code>{`MCP_CLICKHOUSE_WRITE_ACCESS=False
MCP_S3_WRITE_ACCESS=false
MCP_GRAFANA_WRITE_ACCESS=false
MCP_ARGOCD_WRITE_ACCESS=false`}</code></pre>
      <p style={{color: '#90caf9', fontSize: '0.8rem', marginTop: '8px', marginBottom: 0}}>
        AI can query, inspect, and monitor — but cannot modify data, create annotations, or trigger deployments.
      </p>
    </div>

    <div style={{background: '#0d2137', borderRadius: '10px', padding: '16px'}}>
      <h4 style={{color: '#f9a825', margin: '0 0 10px 0'}}>Write-enabled (explicit)</h4>
      <pre style={{background: '#162032', color: '#e0e0e0', borderRadius: '6px', padding: '12px', fontSize: '0.82rem', overflow: 'auto', margin: 0}}><code>{`MCP_RABBITMQ_WRITE_ACCESS=True
MCP_VALKEY_WRITE_ACCESS=True
MCP_CLICKHOUSE_WRITE_ACCESS=True`}</code></pre>
      <p style={{color: '#90caf9', fontSize: '0.8rem', marginTop: '8px', marginBottom: 0}}>
        AI gains write tools: publish messages, set cache keys, insert rows. Each service is independently controlled.
      </p>
    </div>

  </div>
</div>

---

## MCP Prompts — AI Playbooks

<div style={{background: '#f8f9fb', borderRadius: '12px', padding: '24px', border: '1px solid #e0e4e8', marginBottom: '32px'}}>
  <p style={{fontSize: '0.95rem', color: '#555', marginTop: 0}}>
    MCP prompts are pre-built instruction templates that teach AI agents <strong>how</strong> to operate the stack. Instead of improvising, AI follows structured, repeatable playbooks.
  </p>

  <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px'}}>

    <div style={{background: 'white', borderRadius: '8px', padding: '16px', borderTop: '3px solid #0052cc', boxShadow: '0 1px 4px rgba(0,0,0,0.06)'}}>
      <h4 style={{margin: '0 0 6px 0', color: '#0052cc', fontSize: '0.9rem'}}>diagnose_component</h4>
      <p style={{margin: 0, fontSize: '0.82rem', color: '#555'}}>
        Query topology → check outbound links → check inbound links → discover test variables → run health tests → summarize blast radius and status.
      </p>
    </div>

    <div style={{background: 'white', borderRadius: '8px', padding: '16px', borderTop: '3px solid #2e7d32', boxShadow: '0 1px 4px rgba(0,0,0,0.06)'}}>
      <h4 style={{margin: '0 0 6px 0', color: '#2e7d32', fontSize: '0.9rem'}}>explain_stack</h4>
      <p style={{margin: 0, fontSize: '0.82rem', color: '#555'}}>
        Get structure → list all components → map connections → identify architecture patterns → present layered view with data flows.
      </p>
    </div>

    <div style={{background: 'white', borderRadius: '8px', padding: '16px', borderTop: '3px solid #e65100', boxShadow: '0 1px 4px rgba(0,0,0,0.06)'}}>
      <h4 style={{margin: '0 0 6px 0', color: '#e65100', fontSize: '0.9rem'}}>incident_response</h4>
      <p style={{margin: 0, fontSize: '0.82rem', color: '#555'}}>
        Identify suspect components from symptom → check each one → trace dependency chain → check ArgoCD for recent deploys → present root cause + blast radius.
      </p>
    </div>

    <div style={{background: 'white', borderRadius: '8px', padding: '16px', borderTop: '3px solid #6a1b9a', boxShadow: '0 1px 4px rgba(0,0,0,0.06)'}}>
      <h4 style={{margin: '0 0 6px 0', color: '#6a1b9a', fontSize: '0.9rem'}}>trace_data_flow</h4>
      <p style={{margin: 0, fontSize: '0.82rem', color: '#555'}}>
        Walk the link graph hop-by-hop from source to destination → test each connection → report protocol, health, and bottlenecks per hop.
      </p>
    </div>

    <div style={{background: 'white', borderRadius: '8px', padding: '16px', borderTop: '3px solid #b71c1c', boxShadow: '0 1px 4px rgba(0,0,0,0.06)'}}>
      <h4 style={{margin: '0 0 6px 0', color: '#b71c1c', fontSize: '0.9rem'}}>run_validation</h4>
      <p style={{margin: 0, fontSize: '0.82rem', color: '#555'}}>
        Systematic test suite: pods → services → component-specific checks → link connectivity → present PASS/FAIL table with health score.
      </p>
    </div>

    <div style={{background: 'white', borderRadius: '8px', padding: '16px', borderTop: '3px solid #f9a825', boxShadow: '0 1px 4px rgba(0,0,0,0.06)'}}>
      <h4 style={{margin: '0 0 6px 0', color: '#f9a825', fontSize: '0.9rem'}}>check_logs</h4>
      <p style={{margin: 0, fontSize: '0.82rem', color: '#555'}}>
        Get namespace from topology → query Loki logs for error patterns → correlate with Prometheus metrics → present timeline and root cause.
      </p>
    </div>

  </div>
</div>

---

## CNCF Four Pillars of Platform Control

<div style={{background: '#f8f9fb', borderRadius: '12px', padding: '24px', border: '1px solid #e0e4e8', marginBottom: '32px'}}>
  <p style={{fontSize: '0.95rem', color: '#555', marginTop: 0}}>
    The CNCF published a framework for governing AI in infrastructure (January 2026). Stacktic's MCP architecture maps to all four pillars.
  </p>

| CNCF Pillar | Definition | Stacktic Implementation |
|---|---|---|
| **Golden Paths** | Pre-built, approved workflows | MCP Prompts — `diagnose_component`, `incident_response`, `run_validation` |
| **Guardrails** | Hard limits on what AI can do | Write-access gating per service, tool boundaries, typed parameters |
| **Safety Nets** | Catch mistakes before damage | `dry_run=True` on tests, read-only defaults, no raw kubectl |
| **Manual Review** | Human approves risky actions | Write tools only registered when explicitly enabled by platform team |

</div>

---

## Governance Detail — What Controls What

<div style={{marginBottom: '32px'}}>

| Governance Mechanism | What it controls | How it works | Example |
|---|---|---|---|
| **Template Catalog** | What CAN exist | 70 curated templates — AI can't invent components | No random services outside the catalog |
| **Link Types** | What CAN connect | Defined link types per template | `fastapi-kafka_bridge` exists, arbitrary links don't |
| **Hooks** | What configuration is POSSIBLE | Deterministic code generation from links | Prometheus scrape config computed from links, not AI-generated |
| **Post-gen cleanup** | What files EXIST | Unused tool files deleted at generation time | No Loki link → `loki_tools.py` deleted → AI has no Loki tools |
| **Credential scoping** | What AI can AUTHENTICATE to | `cloud.env` only contains credentials for linked services | No ClickHouse link → no ClickHouse credentials in MCP |
| **Write-access gating** | What AI can MODIFY | Per-service boolean in environment variables | `MCP_RABBITMQ_WRITE_ACCESS=True` but `MCP_CLICKHOUSE_WRITE_ACCESS=False` |
| **Tool boundaries** | What OPERATIONS are available | Typed tools with defined parameters | AI calls `ch_query(sql)` not `kubectl exec clickhouse` |
| **MCP Prompts** | HOW AI operates | Structured playbooks for multi-step workflows | `incident_response` follows: suspects → check → trace → fix |
| **Stack isolation** | What SCOPE AI has | Each stack has its own MCP with its own credentials | SRE MCP can't touch production databases |
| **APISIX gateway** | WHO can access | API key authentication at ingress | Only authenticated AI clients reach the MCP |
| **Stack Agent metadata** | What AI UNDERSTANDS | Structured data model, not raw k8s resources | AI sees `{type: "kafka", links_to: [...]}` not 500 lines of YAML |

</div>

---

## Example: AI Diagnoses a Kafka Issue

<div style={{background: '#1a1a2e', borderRadius: '12px', padding: '24px', marginBottom: '32px', border: '1px solid #1976d2'}}>
  <p style={{color: '#b0bec5', fontSize: '0.95rem', marginTop: 0}}>
    An AI client calls <code style={{color: '#8ecaff'}}>prompts/get("diagnose_component", {'{'}component_name: "kafka"{'}'})</code> via MCP. Here's what happens — all through governed tools, no raw cluster access.
  </p>

  <div style={{display: 'flex', flexDirection: 'column', gap: '12px'}}>

    <div style={{background: '#0d2137', borderRadius: '8px', padding: '14px', borderLeft: '3px solid #4caf50'}}>
      <div style={{display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px'}}>
        <div style={{background: '#4caf50', color: 'white', borderRadius: '50%', minWidth: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.75rem'}}>1</div>
        <span style={{color: 'white', fontWeight: 600, fontSize: '0.9rem'}}>Get component info</span>
      </div>
      <pre style={{background: '#162032', color: '#e0e0e0', borderRadius: '6px', padding: '10px', fontSize: '0.78rem', overflow: 'auto', margin: 0}}><code>{`tools/call → query_topology(source="kafka", target="component")
→ {name: "kafka", type: "kafka", namespace: "kafka", group: "messaging"}`}</code></pre>
    </div>

    <div style={{background: '#0d2137', borderRadius: '8px', padding: '14px', borderLeft: '3px solid #f9a825'}}>
      <div style={{display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px'}}>
        <div style={{background: '#f9a825', color: 'white', borderRadius: '50%', minWidth: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.75rem'}}>2</div>
        <span style={{color: 'white', fontWeight: 600, fontSize: '0.9rem'}}>Check dependencies</span>
      </div>
      <pre style={{background: '#162032', color: '#e0e0e0', borderRadius: '6px', padding: '10px', fontSize: '0.78rem', overflow: 'auto', margin: 0}}><code>{`tools/call → query_topology(source="kafka", target="links_to")
→ 0 outbound links

tools/call → query_topology(source="kafka", target="links_from")
→ [{link: "prometheus-kafka", component: "prometheus"}]`}</code></pre>
    </div>

    <div style={{background: '#0d2137', borderRadius: '8px', padding: '14px', borderLeft: '3px solid #0052cc'}}>
      <div style={{display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px'}}>
        <div style={{background: '#0052cc', color: 'white', borderRadius: '50%', minWidth: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.75rem'}}>3</div>
        <span style={{color: 'white', fontWeight: 600, fontSize: '0.9rem'}}>Run health test</span>
      </div>
      <pre style={{background: '#162032', color: '#e0e0e0', borderRadius: '6px', padding: '10px', fontSize: '0.78rem', overflow: 'auto', margin: 0}}><code>{`tools/call → run_test(
  source="kafka",
  command='pods=$(kubectl get pods -n {namespace} --no-headers | grep -c Running); test "$pods" -gt 0'
)
→ {status: "passed", output: "9 running"}`}</code></pre>
    </div>

    <div style={{background: '#0d2137', borderRadius: '8px', padding: '14px', borderLeft: '3px solid #e65100'}}>
      <div style={{display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px'}}>
        <div style={{background: '#e65100', color: 'white', borderRadius: '50%', minWidth: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.75rem'}}>4</div>
        <span style={{color: 'white', fontWeight: 600, fontSize: '0.9rem'}}>AI summarizes</span>
      </div>
      <p style={{color: '#e0e0e0', fontSize: '0.85rem', margin: 0}}>
        "Kafka is healthy — 9 pods running in namespace kafka. Prometheus monitors it. No outbound dependencies. Blast radius: only Prometheus scraping would be affected if Kafka goes down."
      </p>
    </div>

  </div>

  <div style={{background: '#162032', borderLeft: '3px solid #90caf9', borderRadius: '6px', padding: '12px 16px', marginTop: '16px'}}>
    <p style={{color: '#b0bec5', fontSize: '0.85rem', margin: 0}}>
      <strong style={{color: 'white'}}>Every step went through MCP.</strong> The AI never touched kubectl directly. It used typed tools, got structured responses, and followed the prompt template. Every call is logged as JSON-RPC.
    </p>
  </div>
</div>

---

## Roadmap

<div style={{background: '#f8f9fb', borderRadius: '12px', padding: '24px', border: '1px solid #e0e4e8', marginBottom: '32px'}}>

<div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px'}}>

  <div style={{background: 'white', borderRadius: '8px', padding: '16px', borderLeft: '4px solid #4caf50', boxShadow: '0 1px 4px rgba(0,0,0,0.06)'}}>
    <div style={{color: '#4caf50', fontWeight: 700, fontSize: '0.75rem', marginBottom: '6px'}}>AVAILABLE TODAY</div>
    <h4 style={{margin: '0 0 8px 0'}}>Auto-generated MCP Tools</h4>
    <ul style={{margin: 0, paddingLeft: '18px', fontSize: '0.85rem', color: '#555'}}>
      <li>40+ tools across 11 service types</li>
      <li>6 MCP prompt templates</li>
      <li>3 MCP resources (API guide, live summary, structure)</li>
      <li>Write-access gating per service</li>
      <li>APISIX gateway authentication</li>
      <li>SOPS-encrypted credentials</li>
    </ul>
  </div>

  <div style={{background: 'white', borderRadius: '8px', padding: '16px', borderLeft: '4px solid #0052cc', boxShadow: '0 1px 4px rgba(0,0,0,0.06)'}}>
    <div style={{color: '#0052cc', fontWeight: 700, fontSize: '0.75rem', marginBottom: '6px'}}>NEXT</div>
    <h4 style={{margin: '0 0 8px 0'}}>Stack DNA Resource</h4>
    <ul style={{margin: 0, paddingLeft: '18px', fontSize: '0.85rem', color: '#555'}}>
      <li>One-shot full stack context for AI</li>
      <li>Components + links + sub-components + schemas + data flows</li>
      <li>AI reads once, understands the entire system</li>
      <li>Includes OpenAPI specs from linked FastAPI services</li>
    </ul>
  </div>

  <div style={{background: 'white', borderRadius: '8px', padding: '16px', borderLeft: '4px solid #f9a825', boxShadow: '0 1px 4px rgba(0,0,0,0.06)'}}>
    <div style={{color: '#f9a825', fontWeight: 700, fontSize: '0.75rem', marginBottom: '6px'}}>PLANNED</div>
    <h4 style={{margin: '0 0 8px 0'}}>Drift Detection</h4>
    <ul style={{margin: 0, paddingLeft: '18px', fontSize: '0.85rem', color: '#555'}}>
      <li>Compare live state vs Stacktic-generated desired state</li>
      <li>Detect: missing pods, broken links, expired certs, config drift</li>
      <li>Continuous auditing — AI as governance agent</li>
    </ul>
  </div>

  <div style={{background: 'white', borderRadius: '8px', padding: '16px', borderLeft: '4px solid #e65100', boxShadow: '0 1px 4px rgba(0,0,0,0.06)'}}>
    <div style={{color: '#e65100', fontWeight: 700, fontSize: '0.75rem', marginBottom: '6px'}}>PLANNED</div>
    <h4 style={{margin: '0 0 8px 0'}}>Autonomous Remediation</h4>
    <ul style={{margin: 0, paddingLeft: '18px', fontSize: '0.85rem', color: '#555'}}>
      <li>Alert → diagnose → fix → verify (closed loop)</li>
      <li>Governed by write-access flags — AI can only fix what's allowed</li>
      <li>Cross-stack AI coordination with per-stack boundaries</li>
    </ul>
  </div>

</div>

</div>

---

## MCP Protocol — Technical Details

<div style={{marginBottom: '32px'}}>

The MCP server uses the **Model Context Protocol** (now part of the Linux Foundation's Agentic AI Foundation). It speaks JSON-RPC 2.0 over streamable HTTP.

| Property | Value |
|---|---|
| **Protocol** | MCP 2025-03-26 (JSON-RPC 2.0) |
| **Transport** | Streamable HTTP (`POST /mcp`) |
| **Authentication** | Bearer token (`Authorization: Bearer <key>`) |
| **Session management** | `Mcp-Session-Id` header |
| **Capabilities** | Tools, Prompts, Resources |
| **Runtime** | Python 3.12 + FastMCP SDK |
| **Deployment** | Kubernetes pod with ConfigMap-mounted tools |
| **Credentials** | SOPS-encrypted `cloud.env` in Kubernetes Secret |

**Compatible AI clients:** Claude Desktop, Cursor, VS Code Copilot, any MCP-compatible client.

### MCP Endpoints

```
POST /mcp              # All MCP operations (initialize, tools/call, prompts/get, etc.)
GET  /health           # Health check
GET  /mcp              # SSE endpoint for server-initiated messages
```

### Example: Initialize + Call Tool

```bash
# 1. Initialize session
curl -X POST https://fastmcp.your-domain.com/mcp \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -d '{"jsonrpc":"2.0","id":1,"method":"initialize",
       "params":{"protocolVersion":"2025-03-26",
                 "clientInfo":{"name":"my-ai","version":"1.0"}}}'

# 2. Call a tool
curl -X POST https://fastmcp.your-domain.com/mcp \
  -H "Mcp-Session-Id: SESSION_ID" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -d '{"jsonrpc":"2.0","id":2,"method":"tools/call",
       "params":{"name":"list_components","arguments":{}}}'
```

</div>
