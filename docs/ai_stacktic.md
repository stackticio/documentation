---
sidebar_position: 22.5
hide_table_of_contents: false
---

# AI & Stacktic — The Dark Factory Model

<div style={{background: 'linear-gradient(135deg, #1a1a2e 0%, #0d1b2a 100%)', borderRadius: '12px', padding: '32px 40px', color: 'white', marginBottom: '32px', border: '1px solid #1976d2'}}>
  <h2 style={{color: 'white', margin: '0 0 8px 0', fontSize: '1.6rem'}}>AI can now work in production — with no risk</h2>
  <p style={{margin: 0, opacity: 0.9, fontSize: '1.05rem'}}>
    Stacktic is the interface between AI and your infrastructure. It provides AI with structured metadata and relationships, auto-generates governed MCP access per stack layer, restricts all operations to the Stacktic framework, and logs, versions, and rolls back everything. The result: AI operates production autonomously — because every action is bounded, audited, and reversible.
  </p>
</div>

<iframe src="/documentation/website/solution/ai-stacktic.html" width="100%" height="700px" frameBorder="0" style={{borderRadius: '12px', marginBottom: '24px'}}></iframe>

---

## 1. Metadata & Relationships — AI Sees What You Designed

Stacktic doesn't give AI raw cluster access. It gives AI **structured metadata** — the same topology you designed.

<div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '32px'}}>
  <div style={{background: '#f8f9fb', borderRadius: '8px', padding: '20px', border: '1px solid #e0e4e8'}}>
    <h4 style={{margin: '0 0 12px 0', color: '#0052cc'}}>What AI receives</h4>
    <ul style={{margin: 0, paddingLeft: '20px', fontSize: '0.9rem'}}>
      <li><strong>Components</strong> — every service, database, queue, gateway in your stack</li>
      <li><strong>Links</strong> — typed relationships between components (who talks to who, and how)</li>
      <li><strong>Sub-components</strong> — Kafka topics, DB schemas, S3 buckets, RabbitMQ queues</li>
      <li><strong>Attributes</strong> — versions, replicas, namespaces, ports, configurations</li>
      <li><strong>Cross-stack boundaries</strong> — is_external flags for multi-cluster awareness</li>
    </ul>
  </div>
  <div style={{background: '#f8f9fb', borderRadius: '8px', padding: '20px', border: '1px solid #e0e4e8'}}>
    <h4 style={{margin: '0 0 12px 0', color: '#0052cc'}}>What AI does NOT receive</h4>
    <ul style={{margin: 0, paddingLeft: '20px', fontSize: '0.9rem'}}>
      <li>No raw kubectl access</li>
      <li>No cluster-wide RBAC</li>
      <li>No unstructured YAML</li>
      <li>No raw passwords or secrets</li>
      <li>No access to services without drawn links</li>
      <li>No ability to run arbitrary shell commands</li>
    </ul>
  </div>
</div>

```
┌─────────────────────────────────────────────────────────────┐
│                    Stacktic Topology                         │
│                                                             │
│   FastAPI ──→ PostgreSQL      Kafka ──→ ClickHouse          │
│      │            │             │                           │
│      └──→ Redis   └──→ Grafana └──→ Loki                   │
│                                                             │
│   Every arrow = a typed link = AI metadata = MCP tool       │
└─────────────────────────────────────────────────────────────┘
                            │
                    Stack Agent API
                    POST /metadata/q
                            │
               ┌────────────┴────────────┐
               │    Structured JSON       │
               │    Components, links,    │
               │    attributes, types     │
               └─────────────────────────┘
```

> **The topology you design IS the metadata AI operates on.** Every component, link, and sub-component becomes queryable, structured data. AI doesn't parse YAML — it queries relationships.

---

## 2. Automated MCP & Permission Governance — Per Layer

When you draw a link to a service in Stacktic, a governed MCP (Model Context Protocol) toolset is **auto-generated** for that service. Remove the link — the tools disappear. No manual configuration. No permission drift.

<div style={{background: '#1a1a2e', borderRadius: '12px', padding: '24px', marginBottom: '24px', border: '1px solid #1976d2'}}>
  <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px'}}>
    <div style={{background: '#0d2137', borderRadius: '8px', padding: '16px'}}>
      <div style={{color: '#4caf50', fontWeight: 700, fontSize: '0.9rem', marginBottom: '8px'}}>Observability Layer</div>
      <p style={{color: '#b0bec5', fontSize: '0.85rem', margin: 0}}>Prometheus queries, Grafana dashboards, Loki log search — read-only by default, typed parameters, no raw PromQL injection</p>
    </div>
    <div style={{background: '#0d2137', borderRadius: '8px', padding: '16px'}}>
      <div style={{color: '#60d5ff', fontWeight: 700, fontSize: '0.9rem', marginBottom: '8px'}}>Data Layer</div>
      <p style={{color: '#b0bec5', fontSize: '0.85rem', margin: 0}}>PostgreSQL, MongoDB, ClickHouse, Redis/Valkey — scoped queries, credential substitution, write-access gated independently per database</p>
    </div>
    <div style={{background: '#0d2137', borderRadius: '8px', padding: '16px'}}>
      <div style={{color: '#fbbf24', fontWeight: 700, fontSize: '0.9rem', marginBottom: '8px'}}>Operations Layer</div>
      <p style={{color: '#b0bec5', fontSize: '0.85rem', margin: 0}}>ArgoCD sync, Kafka topic management, RabbitMQ publishing — each operation requires explicit write-access flag per service</p>
    </div>
  </div>
</div>

### How permissions work

| Control | How it works |
|---|---|
| **Tool generation** | Draw a link → tools appear. Remove a link → tools disappear. No link = no access. |
| **Credential scoping** | AI uses `{password}`, `{host}`, `{port}` variables — Stack Agent resolves them at runtime. AI never sees raw values. |
| **Write gating** | Each service has `MCP_*_WRITE_ACCESS=false` by default. Read always allowed. Write only when explicitly enabled. |
| **Multi-stack isolation** | Each stack generates its own MCP with its own credentials. Cross-stack boundaries are explicit via `is_external`. |

---

## 3. AI Restricted to Stacktic Framework

AI doesn't freestyle. Every operation AI performs goes through the Stacktic framework — validated templates, typed tools, structured queries.

<div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px'}}>
  <div style={{background: '#fff3e0', borderRadius: '8px', padding: '20px', border: '1px solid #ffe0b2'}}>
    <h4 style={{margin: '0 0 12px 0', color: '#e65100'}}>Without Stacktic</h4>
    <pre style={{background: '#3e2723', color: '#ffcc80', padding: '12px', borderRadius: '6px', fontSize: '0.8rem', overflow: 'auto'}}>{`AI → kubectl exec -it postgres -- psql
AI → kubectl delete pod kafka-0
AI → curl http://internal-service:8080/admin
AI → kubectl apply -f hallucinated.yaml`}</pre>
    <p style={{color: '#bf360c', fontSize: '0.85rem', marginTop: '8px', marginBottom: 0}}>Raw access. No boundaries. No audit. One hallucinated command = production incident.</p>
  </div>
  <div style={{background: '#e8f5e9', borderRadius: '8px', padding: '20px', border: '1px solid #c8e6c9'}}>
    <h4 style={{margin: '0 0 12px 0', color: '#2e7d32'}}>With Stacktic</h4>
    <pre style={{background: '#1b5e20', color: '#a5d6a7', padding: '12px', borderRadius: '6px', fontSize: '0.8rem', overflow: 'auto'}}>{`AI → mcp tools/call pg_query {sql: "SELECT ..."}
AI → mcp tools/call prom_alerts {}
AI → mcp tools/call loki_query {logql: "..."}
AI → mcp tools/call argocd_list_applications {}`}</pre>
    <p style={{color: '#2e7d32', fontSize: '0.85rem', marginTop: '8px', marginBottom: 0}}>Typed tools. Scoped parameters. Governed access. Every call is JSON-RPC with method, params, timestamp.</p>
  </div>
</div>

**What this means:**

- AI **cannot** run arbitrary commands — only pre-defined, typed MCP tools
- AI **cannot** access services without drawn links — topology = permission boundary
- AI **cannot** see raw credentials — variable substitution at runtime
- AI **cannot** write without explicit permission — per-service write flags
- AI **cannot** hallucinate operations — tools have typed parameters, invalid calls are rejected

---

## 4. Log Everything. Version Everything. Rollback Everything.

This is what makes AI safe in production. Every layer of the stack is **versioned, audited, and reversible**.

<div style={{background: '#1a1a2e', borderRadius: '12px', padding: '24px', marginBottom: '24px', border: '1px solid #1976d2'}}>
  <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px'}}>
    <div style={{background: '#0d2137', borderRadius: '8px', padding: '16px', borderTop: '3px solid #4caf50'}}>
      <div style={{color: '#4caf50', fontWeight: 700, fontSize: '1.1rem', marginBottom: '8px'}}>Log Everything</div>
      <p style={{color: '#b0bec5', fontSize: '0.85rem', margin: 0}}>Every MCP call is JSON-RPC — method name, parameters, timestamp, response. Every AI operation is a structured audit trail. Combined with Loki for application logs and Prometheus for metrics — full observability of what AI does and what the stack does.</p>
    </div>
    <div style={{background: '#0d2137', borderRadius: '8px', padding: '16px', borderTop: '3px solid #60d5ff'}}>
      <div style={{color: '#60d5ff', fontWeight: 700, fontSize: '1.1rem', marginBottom: '8px'}}>Version Everything</div>
      <p style={{color: '#b0bec5', fontSize: '0.85rem', margin: 0}}>Stacktic versions the entire stack as a unified snapshot — every component, every link, every configuration, every secret. When AI triggers a change, that change is part of a versioned stack state. Not scattered config files — a single, trackable stack version.</p>
    </div>
    <div style={{background: '#0d2137', borderRadius: '8px', padding: '16px', borderTop: '3px solid #fbbf24'}}>
      <div style={{color: '#fbbf24', fontWeight: 700, fontSize: '1.1rem', marginBottom: '8px'}}>Rollback Everything</div>
      <p style={{color: '#b0bec5', fontSize: '0.85rem', margin: 0}}>Any stack version can be rolled back — completely, to any previous state. If AI triggers a deployment that causes issues, rollback the entire stack to the last known-good version. Not just one service — the full stack with all its relationships intact.</p>
    </div>
  </div>
</div>

### The Safety Guarantee

```
┌──────────────────────────────────────────────────────────────┐
│                     AI operates production                    │
│                                                              │
│   ✓ Every action → logged (JSON-RPC audit trail)             │
│   ✓ Every state → versioned (unified stack snapshots)        │
│   ✓ Every change → reversible (full-stack rollback)          │
│   ✓ Every tool → validated (generated from tested templates) │
│   ✓ Every credential → scoped (variable substitution)       │
│   ✓ Every write → gated (per-service boolean flag)           │
│                                                              │
│   Result: AI in production with zero risk                    │
└──────────────────────────────────────────────────────────────┘
```

> **This is why it's a dark factory.** In manufacturing, a dark factory runs lights-out — no humans on the floor, fully automated, everything monitored and reversible. Stacktic brings this model to infrastructure: AI agents operate autonomously through governed metadata, every action is audited, every state is versioned, every mistake is reversible. Production-grade AI operations — lights out.

---

## The Full Picture

| Layer | What Stacktic provides | What AI gets |
|---|---|---|
| **Metadata** | Topology → Stack Agent API → structured JSON | Components, links, types, groups, attributes — full stack awareness |
| **MCP** | Auto-generated per stack, per linked service | 50+ typed tools — query, observe, test, operate |
| **Permissions** | Topology = governance, write gating, credential scoping | Bounded access — only what topology defines, only what flags allow |
| **Framework** | Validated templates, typed parameters, no kubectl | Structured operations — impossible to hallucinate invalid commands |
| **Logging** | JSON-RPC audit trail + Loki + Prometheus | Full observability of every AI action and every stack metric |
| **Versioning** | Unified stack snapshots — every component, link, config | Trackable state — know exactly what changed and when |
| **Rollback** | Full-stack rollback to any previous version | Safety net — any mistake is one rollback away from fixed |

<div style={{background: 'linear-gradient(135deg, #0052cc 0%, #003d99 100%)', borderRadius: '12px', padding: '24px', color: 'white', marginTop: '32px'}}>
  <p style={{margin: 0, fontSize: '1.1rem', fontWeight: 600, textAlign: 'center'}}>
    Stacktic provides AI with metadata and relationships · automates MCP and permission governance for each layer · restricts AI to the Stacktic framework for ops · logs everything, versions everything, rolls back everything — AI can now work in production with no risk.
  </p>
</div>
