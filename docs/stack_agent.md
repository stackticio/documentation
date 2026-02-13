---
sidebar_position: 5
---

# Validation API

<div style={{background: 'linear-gradient(135deg, #0052cc 0%, #003d99 100%)', borderRadius: '12px', padding: '32px 40px', color: 'white', marginBottom: '32px'}}>
  <h2 style={{color: 'white', margin: '0 0 8px 0', fontSize: '1.6rem'}}>Query your entire stack like a database</h2>
  <p style={{margin: 0, opacity: 0.9, fontSize: '1.05rem'}}>
    With a single API call, Stacktic validates every database, every topic, every service — tracking each command's success or failure. Get the deep status of your entire stack in a few lines, not a few days.
  </p>
</div>

{/* WHAT MAKES IT UNIQUE */}
<div style={{background: '#1a1a2e', borderRadius: '12px', padding: '24px', marginBottom: '32px', border: '1px solid #1976d2'}}>
  <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px'}}>
    <div>
      <h3 style={{color: 'white', margin: '0 0 12px 0'}}>What makes this unique?</h3>
      <p style={{color: '#b0bec5', fontSize: '0.95rem', margin: '0 0 16px 0'}}>
        Traditional monitoring tells you <em>if</em> something is up. The Validation API tells you <em>if your stack actually works</em> — end to end, across every relationship.
      </p>
      <p style={{color: '#b0bec5', fontSize: '0.95rem', margin: '0 0 16px 0'}}>
        Think of it as <strong style={{color: 'white'}}>querying your stack like a database</strong>. Instead of SSHing into 20 services and running manual checks, you hit one endpoint and get the full picture — every database connection, every Kafka topic, every route, every certificate — validated against real commands, not just health pings.
      </p>
      <p style={{color: '#b0bec5', fontSize: '0.95rem', margin: 0}}>
        Stacktic knows your topology. It knows what's connected to what. So the validation pipeline is <strong style={{color: 'white'}}>generated automatically from your stack design</strong> — with almost no code.
      </p>
    </div>
    <div style={{display: 'flex', flexDirection: 'column', gap: '10px'}}>
      <div style={{background: '#0d2137', borderRadius: '8px', padding: '14px', borderLeft: '3px solid #4caf50'}}>
        <div style={{color: '#4caf50', fontWeight: 700, fontSize: '0.8rem', marginBottom: '4px'}}>FEW LINES</div>
        <p style={{color: '#e0e0e0', fontSize: '0.85rem', margin: 0}}>A single <code style={{color: '#8ecaff'}}>validate-all.sh</code> or API call replaces hundreds of manual checks across your entire stack.</p>
      </div>
      <div style={{background: '#0d2137', borderRadius: '8px', padding: '14px', borderLeft: '3px solid #f9a825'}}>
        <div style={{color: '#f9a825', fontWeight: 700, fontSize: '0.8rem', marginBottom: '4px'}}>DEEP DEPTH</div>
        <p style={{color: '#e0e0e0', fontSize: '0.85rem', margin: 0}}>Not just "is it up" — validates schemas exist, users have access, topics are created, connectors are running, certs are valid.</p>
      </div>
      <div style={{background: '#0d2137', borderRadius: '8px', padding: '14px', borderLeft: '3px solid #0052cc'}}>
        <div style={{color: '#90caf9', fontWeight: 700, fontSize: '0.8rem', marginBottom: '4px'}}>ZERO CODE</div>
        <p style={{color: '#e0e0e0', fontSize: '0.85rem', margin: 0}}>Validation pipelines are auto-generated from your stack topology. Add a component — its tests appear automatically.</p>
      </div>
    </div>
  </div>
</div>

## How It Works

<div style={{background: '#f8f9fb', borderRadius: '12px', padding: '24px', border: '1px solid #e0e4e8', marginBottom: '32px'}}>

{/* ── FLOW DIAGRAM ── */}
<div style={{position: 'relative', padding: '0'}}>

  {/* API CALL - TOP */}
  <div style={{textAlign: 'center', marginBottom: '24px'}}>
    <div style={{display: 'inline-block', background: 'linear-gradient(135deg, #0052cc, #003d99)', color: 'white', borderRadius: '12px', padding: '16px 40px', boxShadow: '0 4px 20px rgba(0,82,204,0.3)', fontSize: '1.1rem', fontWeight: 700, letterSpacing: '0.5px'}}>
      <code style={{color: '#8ecaff', fontSize: '0.85rem', display: 'block', marginBottom: '4px'}}>$STACKTIC_OUTPUT/scripts/stacktic/validate-all.sh</code>
      Single command — full stack validation
    </div>
  </div>

  {/* ARROW DOWN */}
  <div style={{textAlign: 'center', marginBottom: '16px'}}>
    <div style={{display: 'inline-block', width: '3px', height: '32px', background: 'linear-gradient(to bottom, #0052cc, #90caf9)'}}></div>
  </div>

  {/* AGENT SCANNER */}
  <div style={{textAlign: 'center', marginBottom: '24px'}}>
    <div style={{display: 'inline-block', background: '#1a1a2e', color: 'white', borderRadius: '10px', padding: '12px 32px', border: '2px solid #0052cc', fontSize: '0.95rem', fontWeight: 600}}>
      Reads your topology — auto-discovers every component, sub-component & link
    </div>
  </div>

  {/* BRANCHING ARROWS */}
  <div style={{textAlign: 'center', marginBottom: '8px'}}>
    <div style={{display: 'inline-block', width: '3px', height: '20px', background: '#90caf9'}}></div>
  </div>
  <div style={{display: 'flex', justifyContent: 'center', gap: '0', marginBottom: '8px'}}>
    <div style={{width: '80%', height: '3px', background: 'linear-gradient(to right, #e3f2fd, #0052cc, #0052cc, #e3f2fd)', borderRadius: '2px'}}></div>
  </div>

  {/* FIVE TRACKS — REAL TESTS */}
  <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr', gap: '10px', marginBottom: '24px'}}>

    {/* POSTGRESQL */}
    <div style={{textAlign: 'center'}}>
      <div style={{display: 'inline-block', width: '3px', height: '20px', background: '#90caf9', marginBottom: '8px'}}></div>
      <div style={{background: '#1a1a2e', borderRadius: '10px', padding: '12px', border: '1px solid #1976d2'}}>
        <div style={{fontSize: '0.9rem', fontWeight: 700, color: 'white', marginBottom: '8px'}}>PostgreSQL</div>
        <div style={{display: 'flex', flexDirection: 'column', gap: '4px'}}>
          <div style={{background: '#0d2137', borderRadius: '4px', padding: '5px 8px', fontSize: '0.7rem', color: '#e0e0e0', textAlign: 'left', fontFamily: 'monospace'}}>
            <span style={{color: '#4caf50'}}>PASS</span> SELECT 1
          </div>
          <div style={{background: '#0d2137', borderRadius: '4px', padding: '5px 8px', fontSize: '0.7rem', color: '#e0e0e0', textAlign: 'left', fontFamily: 'monospace'}}>
            <span style={{color: '#4caf50'}}>PASS</span> write perms
          </div>
          <div style={{background: '#0d2137', borderRadius: '4px', padding: '5px 8px', fontSize: '0.7rem', color: '#e0e0e0', textAlign: 'left', fontFamily: 'monospace'}}>
            <span style={{color: '#4caf50'}}>PASS</span> cluster healthy
          </div>
          <div style={{background: '#0d2137', borderRadius: '4px', padding: '5px 8px', fontSize: '0.7rem', color: '#e0e0e0', textAlign: 'left', fontFamily: 'monospace'}}>
            <span style={{color: '#4caf50'}}>PASS</span> pods running
          </div>
        </div>
      </div>
    </div>

    {/* KAFKA */}
    <div style={{textAlign: 'center'}}>
      <div style={{display: 'inline-block', width: '3px', height: '20px', background: '#90caf9', marginBottom: '8px'}}></div>
      <div style={{background: '#1a1a2e', borderRadius: '10px', padding: '12px', border: '1px solid #1976d2'}}>
        <div style={{fontSize: '0.9rem', fontWeight: 700, color: 'white', marginBottom: '8px'}}>Kafka</div>
        <div style={{display: 'flex', flexDirection: 'column', gap: '4px'}}>
          <div style={{background: '#0d2137', borderRadius: '4px', padding: '5px 8px', fontSize: '0.7rem', color: '#e0e0e0', textAlign: 'left', fontFamily: 'monospace'}}>
            <span style={{color: '#4caf50'}}>PASS</span> cluster ready
          </div>
          <div style={{background: '#0d2137', borderRadius: '4px', padding: '5px 8px', fontSize: '0.7rem', color: '#e0e0e0', textAlign: 'left', fontFamily: 'monospace'}}>
            <span style={{color: '#4caf50'}}>PASS</span> topics exist
          </div>
          <div style={{background: '#0d2137', borderRadius: '4px', padding: '5px 8px', fontSize: '0.7rem', color: '#e0e0e0', textAlign: 'left', fontFamily: 'monospace'}}>
            <span style={{color: '#f44336'}}>FAIL</span> sink connector
          </div>
          <div style={{background: '#0d2137', borderRadius: '4px', padding: '5px 8px', fontSize: '0.7rem', color: '#e0e0e0', textAlign: 'left', fontFamily: 'monospace'}}>
            <span style={{color: '#4caf50'}}>PASS</span> produce E2E
          </div>
        </div>
      </div>
    </div>

    {/* APISIX */}
    <div style={{textAlign: 'center'}}>
      <div style={{display: 'inline-block', width: '3px', height: '20px', background: '#90caf9', marginBottom: '8px'}}></div>
      <div style={{background: '#1a1a2e', borderRadius: '10px', padding: '12px', border: '1px solid #1976d2'}}>
        <div style={{fontSize: '0.9rem', fontWeight: 700, color: 'white', marginBottom: '8px'}}>APISIX</div>
        <div style={{display: 'flex', flexDirection: 'column', gap: '4px'}}>
          <div style={{background: '#0d2137', borderRadius: '4px', padding: '5px 8px', fontSize: '0.7rem', color: '#e0e0e0', textAlign: 'left', fontFamily: 'monospace'}}>
            <span style={{color: '#4caf50'}}>PASS</span> routes 2xx
          </div>
          <div style={{background: '#0d2137', borderRadius: '4px', padding: '5px 8px', fontSize: '0.7rem', color: '#e0e0e0', textAlign: 'left', fontFamily: 'monospace'}}>
            <span style={{color: '#4caf50'}}>PASS</span> SSL valid
          </div>
          <div style={{background: '#0d2137', borderRadius: '4px', padding: '5px 8px', fontSize: '0.7rem', color: '#e0e0e0', textAlign: 'left', fontFamily: 'monospace'}}>
            <span style={{color: '#4caf50'}}>PASS</span> response &lt;5s
          </div>
          <div style={{background: '#0d2137', borderRadius: '4px', padding: '5px 8px', fontSize: '0.7rem', color: '#e0e0e0', textAlign: 'left', fontFamily: 'monospace'}}>
            <span style={{color: '#f44336'}}>FAIL</span> TLS cert exp
          </div>
        </div>
      </div>
    </div>

    {/* VALKEY */}
    <div style={{textAlign: 'center'}}>
      <div style={{display: 'inline-block', width: '3px', height: '20px', background: '#90caf9', marginBottom: '8px'}}></div>
      <div style={{background: '#1a1a2e', borderRadius: '10px', padding: '12px', border: '1px solid #1976d2'}}>
        <div style={{fontSize: '0.9rem', fontWeight: 700, color: 'white', marginBottom: '8px'}}>Valkey</div>
        <div style={{display: 'flex', flexDirection: 'column', gap: '4px'}}>
          <div style={{background: '#0d2137', borderRadius: '4px', padding: '5px 8px', fontSize: '0.7rem', color: '#e0e0e0', textAlign: 'left', fontFamily: 'monospace'}}>
            <span style={{color: '#4caf50'}}>PASS</span> PING→PONG
          </div>
          <div style={{background: '#0d2137', borderRadius: '4px', padding: '5px 8px', fontSize: '0.7rem', color: '#e0e0e0', textAlign: 'left', fontFamily: 'monospace'}}>
            <span style={{color: '#4caf50'}}>PASS</span> write/read
          </div>
          <div style={{background: '#0d2137', borderRadius: '4px', padding: '5px 8px', fontSize: '0.7rem', color: '#e0e0e0', textAlign: 'left', fontFamily: 'monospace'}}>
            <span style={{color: '#4caf50'}}>PASS</span> memory ok
          </div>
          <div style={{background: '#0d2137', borderRadius: '4px', padding: '5px 8px', fontSize: '0.7rem', color: '#e0e0e0', textAlign: 'left', fontFamily: 'monospace'}}>
            <span style={{color: '#4caf50'}}>PASS</span> clients
          </div>
        </div>
      </div>
    </div>

    {/* GRAFANA */}
    <div style={{textAlign: 'center'}}>
      <div style={{display: 'inline-block', width: '3px', height: '20px', background: '#90caf9', marginBottom: '8px'}}></div>
      <div style={{background: '#1a1a2e', borderRadius: '10px', padding: '12px', border: '1px solid #1976d2'}}>
        <div style={{fontSize: '0.9rem', fontWeight: 700, color: 'white', marginBottom: '8px'}}>Grafana</div>
        <div style={{display: 'flex', flexDirection: 'column', gap: '4px'}}>
          <div style={{background: '#0d2137', borderRadius: '4px', padding: '5px 8px', fontSize: '0.7rem', color: '#e0e0e0', textAlign: 'left', fontFamily: 'monospace'}}>
            <span style={{color: '#4caf50'}}>PASS</span> health ok
          </div>
          <div style={{background: '#0d2137', borderRadius: '4px', padding: '5px 8px', fontSize: '0.7rem', color: '#e0e0e0', textAlign: 'left', fontFamily: 'monospace'}}>
            <span style={{color: '#4caf50'}}>PASS</span> datasources
          </div>
          <div style={{background: '#0d2137', borderRadius: '4px', padding: '5px 8px', fontSize: '0.7rem', color: '#e0e0e0', textAlign: 'left', fontFamily: 'monospace'}}>
            <span style={{color: '#4caf50'}}>PASS</span> dashboards
          </div>
          <div style={{background: '#0d2137', borderRadius: '4px', padding: '5px 8px', fontSize: '0.7rem', color: '#e0e0e0', textAlign: 'left', fontFamily: 'monospace'}}>
            <span style={{color: '#4caf50'}}>PASS</span> Prom query
          </div>
        </div>
      </div>
    </div>

  </div>

  {/* CONVERGE ARROWS */}
  <div style={{display: 'flex', justifyContent: 'center', gap: '0', marginBottom: '8px'}}>
    <div style={{width: '80%', height: '3px', background: 'linear-gradient(to right, #e3f2fd, #0052cc, #0052cc, #e3f2fd)', borderRadius: '2px'}}></div>
  </div>
  <div style={{textAlign: 'center', marginBottom: '16px'}}>
    <div style={{display: 'inline-block', width: '3px', height: '20px', background: '#90caf9'}}></div>
  </div>

  {/* PIPELINE OUTPUT */}
  <div style={{textAlign: 'center', marginBottom: '16px'}}>
    <div style={{display: 'inline-block', background: 'linear-gradient(135deg, #1a1a2e, #16213e)', borderRadius: '12px', padding: '20px 32px', border: '2px solid #0052cc', boxShadow: '0 4px 20px rgba(0,82,204,0.2)', maxWidth: '700px', width: '100%'}}>
      <div style={{fontSize: '0.8rem', color: '#90caf9', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '1px'}}>Pipeline Result</div>
      <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', flexWrap: 'wrap'}}>
        <div style={{background: '#1b5e20', color: 'white', borderRadius: '6px', padding: '6px 12px', fontSize: '0.8rem', fontWeight: 600}}>CNPG 4/4</div>
        <div style={{color: '#90caf9'}}>→</div>
        <div style={{background: '#b71c1c', color: 'white', borderRadius: '6px', padding: '6px 12px', fontSize: '0.8rem', fontWeight: 600}}>Kafka 3/4</div>
        <div style={{color: '#90caf9'}}>→</div>
        <div style={{background: '#b71c1c', color: 'white', borderRadius: '6px', padding: '6px 12px', fontSize: '0.8rem', fontWeight: 600}}>APISIX 3/4</div>
        <div style={{color: '#90caf9'}}>→</div>
        <div style={{background: '#1b5e20', color: 'white', borderRadius: '6px', padding: '6px 12px', fontSize: '0.8rem', fontWeight: 600}}>Valkey 4/4</div>
        <div style={{color: '#90caf9'}}>→</div>
        <div style={{background: '#1b5e20', color: 'white', borderRadius: '6px', padding: '6px 12px', fontSize: '0.8rem', fontWeight: 600}}>Grafana 4/4</div>
        <div style={{color: '#90caf9'}}>→</div>
        <div style={{background: '#e65100', color: 'white', borderRadius: '6px', padding: '6px 14px', fontSize: '0.85rem', fontWeight: 700}}>18/20 PASSED</div>
      </div>
    </div>
  </div>

</div>
</div>

{/* WHAT IT VALIDATES - REAL EXAMPLES */}
<div style={{marginBottom: '32px'}}>
  <h3>Real validation depth — per component</h3>
  <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px'}}>
    <div style={{background: '#f8f9fb', borderRadius: '10px', padding: '20px', borderTop: '3px solid #0052cc', border: '1px solid #e0e4e8'}}>
      <h4 style={{margin: '0 0 10px 0', color: '#0052cc'}}>PostgreSQL / CNPG</h4>
      <ul style={{margin: 0, paddingLeft: '18px', fontSize: '0.85rem', color: '#555'}}>
        <li>Database connectivity (<code>SELECT 1</code>)</li>
        <li>Write permissions (CREATE/INSERT)</li>
        <li>Connection count from <code>pg_stat_activity</code></li>
        <li>Database size</li>
        <li>CNPG cluster health &amp; phase</li>
        <li>Primary/replica pod status</li>
      </ul>
    </div>
    <div style={{background: '#f8f9fb', borderRadius: '10px', padding: '20px', borderTop: '3px solid #0052cc', border: '1px solid #e0e4e8'}}>
      <h4 style={{margin: '0 0 10px 0', color: '#0052cc'}}>Kafka</h4>
      <ul style={{margin: 0, paddingLeft: '18px', fontSize: '0.85rem', color: '#555'}}>
        <li>Cluster &amp; KafkaConnect ready</li>
        <li>All topics created (dynamic)</li>
        <li>All connectors running</li>
        <li>No failed connector tasks</li>
        <li>Produce to topic E2E</li>
        <li>Sink E2E (produce → wait → verify in DB)</li>
        <li>Consumer groups listed</li>
      </ul>
    </div>
    <div style={{background: '#f8f9fb', borderRadius: '10px', padding: '20px', borderTop: '3px solid #0052cc', border: '1px solid #e0e4e8'}}>
      <h4 style={{margin: '0 0 10px 0', color: '#0052cc'}}>APISIX (Ingress)</h4>
      <ul style={{margin: 0, paddingLeft: '18px', fontSize: '0.85rem', color: '#555'}}>
        <li>Route HTTP status (2xx/3xx)</li>
        <li>SSL certificate valid &amp; expiry</li>
        <li>Response time under 5s</li>
        <li>CORS headers present</li>
        <li>WebSocket upgrade</li>
        <li>TLS 1.2+ supported</li>
        <li>Security headers (HSTS, X-Frame)</li>
        <li>Backend pods running</li>
      </ul>
    </div>
    <div style={{background: '#f8f9fb', borderRadius: '10px', padding: '20px', borderTop: '3px solid #0052cc', border: '1px solid #e0e4e8'}}>
      <h4 style={{margin: '0 0 10px 0', color: '#0052cc'}}>Valkey (Redis)</h4>
      <ul style={{margin: 0, paddingLeft: '18px', fontSize: '0.85rem', color: '#555'}}>
        <li>PING connectivity</li>
        <li>Write/read test with TTL</li>
        <li>Memory usage &amp; limits</li>
        <li>Connected client count</li>
        <li>Key count (DBSIZE)</li>
        <li>Server version</li>
      </ul>
    </div>
    <div style={{background: '#f8f9fb', borderRadius: '10px', padding: '20px', borderTop: '3px solid #0052cc', border: '1px solid #e0e4e8'}}>
      <h4 style={{margin: '0 0 10px 0', color: '#0052cc'}}>Grafana</h4>
      <ul style={{margin: 0, paddingLeft: '18px', fontSize: '0.85rem', color: '#555'}}>
        <li>Health check (<code>/api/health</code>)</li>
        <li>Datasource exists per link</li>
        <li>Datasource URL matches namespace</li>
        <li>Datasource health probe</li>
        <li>Prometheus query via proxy</li>
        <li>Loki label query</li>
        <li>Dashboard count</li>
      </ul>
    </div>
    <div style={{background: '#f8f9fb', borderRadius: '10px', padding: '20px', borderTop: '3px solid #0052cc', border: '1px solid #e0e4e8'}}>
      <h4 style={{margin: '0 0 10px 0', color: '#0052cc'}}>+ ClickHouse, SeaweedFS, Qdrant, OTel, Cert-Manager...</h4>
      <p style={{margin: 0, fontSize: '0.85rem', color: '#555'}}>
        Every component Stacktic supports gets its own deep validation suite — auto-generated from your topology. Add a component, its validation pipeline appears.
      </p>
    </div>
  </div>
</div>

---

## Plug It Anywhere

<div style={{background: '#f8f9fb', borderRadius: '12px', padding: '24px', border: '1px solid #e0e4e8', marginBottom: '32px'}}>
  <p style={{fontSize: '0.95rem', color: '#555', marginTop: 0}}>
    The Validation API is a simple script and endpoint — it runs anywhere. Add it to your CI/CD pipeline, your GitHub Actions, your upgrade flow, or run it manually. A few lines and you have full stack validation.
  </p>
  <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', marginBottom: '16px'}}>
    <div style={{background: 'white', borderRadius: '8px', padding: '16px', borderTop: '3px solid #0052cc', boxShadow: '0 1px 4px rgba(0,0,0,0.06)'}}>
      <h4 style={{margin: '0 0 6px 0', color: '#0052cc'}}>CI/CD & GitHub Actions</h4>
      <p style={{margin: 0, fontSize: '0.85rem', color: '#555'}}>
        Add <code>validate-all.sh</code> as a post-deploy step in any pipeline — GitHub Actions, GitLab CI, Jenkins, ArgoCD hooks. If validation fails, the pipeline fails.
      </p>
    </div>
    <div style={{background: 'white', borderRadius: '8px', padding: '16px', borderTop: '3px solid #2e7d32', boxShadow: '0 1px 4px rgba(0,0,0,0.06)'}}>
      <h4 style={{margin: '0 0 6px 0', color: '#2e7d32'}}>Versioning & Upgrades</h4>
      <p style={{margin: 0, fontSize: '0.85rem', color: '#555'}}>
        Run validation before and after a stack version upgrade. Compare results to confirm nothing broke — databases still connected, topics still flowing, routes still serving.
      </p>
    </div>
    <div style={{background: 'white', borderRadius: '8px', padding: '16px', borderTop: '3px solid #e65100', boxShadow: '0 1px 4px rgba(0,0,0,0.06)'}}>
      <h4 style={{margin: '0 0 6px 0', color: '#e65100'}}>Migration Validation</h4>
      <p style={{margin: 0, fontSize: '0.85rem', color: '#555'}}>
        Migrating from managed services or VMs? Run validation after each step to confirm data landed, connections work, and services are healthy — before going live.
      </p>
    </div>
  </div>
  <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px'}}>
    <div style={{background: 'white', borderRadius: '8px', padding: '16px', borderTop: '3px solid #b71c1c', boxShadow: '0 1px 4px rgba(0,0,0,0.06)'}}>
      <h4 style={{margin: '0 0 6px 0', color: '#b71c1c'}}>Security Assessments</h4>
      <p style={{margin: 0, fontSize: '0.85rem', color: '#555'}}>
        Validate TLS certificates, security headers (HSTS, X-Frame-Options), CORS configuration, and RBAC — automatically, on every deploy. No manual audit required.
      </p>
    </div>
    <div style={{background: 'white', borderRadius: '8px', padding: '16px', borderTop: '3px solid #6a1b9a', boxShadow: '0 1px 4px rgba(0,0,0,0.06)'}}>
      <h4 style={{margin: '0 0 6px 0', color: '#6a1b9a'}}>Scheduled Health Checks</h4>
      <p style={{margin: 0, fontSize: '0.85rem', color: '#555'}}>
        Run on a cron schedule to catch drift — expired certificates, failed connectors, unhealthy replicas — before your users notice.
      </p>
    </div>
  </div>
</div>

---

## System Documentation

<div style={{background: '#f8f9fb', borderRadius: '12px', padding: '24px', border: '1px solid #e0e4e8', marginBottom: '24px'}}>

### Prepare Environment

<div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px'}}>
  <div style={{background: 'white', borderRadius: '10px', padding: '20px', borderLeft: '4px solid #0052cc', boxShadow: '0 1px 4px rgba(0,0,0,0.06)'}}>
    <h4 style={{margin: '0 0 8px 0'}}>Environment Variables</h4>
    <pre style={{background: '#1e1e1e', color: '#d4d4d4', borderRadius: '8px', padding: '14px', fontSize: '0.85rem', overflow: 'auto', margin: 0}}><code>{`# Root directory of your System
export STACKTIC_OUTPUT=<FILL_ME>

# Configure AGE Key file to decrypt SOPS files
export SOPS_AGE_KEY_FILE=<FILL_ME>`}</code></pre>
  </div>
  <div style={{background: 'white', borderRadius: '10px', padding: '20px', borderLeft: '4px solid #0052cc', boxShadow: '0 1px 4px rgba(0,0,0,0.06)'}}>
    <h4 style={{margin: '0 0 8px 0'}}>Install SOPS</h4>
    <pre style={{background: '#1e1e1e', color: '#d4d4d4', borderRadius: '8px', padding: '14px', fontSize: '0.85rem', overflow: 'auto', margin: 0}}><code>{`# Download the binary
curl -LO https://github.com/getsops/sops/releases/download/v3.8.1/sops-v3.8.1.linux.amd64

# Move into PATH
mv sops-v3.8.1.linux.amd64 /usr/local/bin/sops

# Make executable
chmod +x /usr/local/bin/sops`}</code></pre>
    <p style={{margin: '8px 0 0 0', fontSize: '0.8rem', color: '#999'}}>All SOPS releases: <a href="https://github.com/getsops/sops/releases">github.com/getsops/sops/releases</a></p>
  </div>
</div>

### Operations Pipeline

<div style={{display: 'flex', flexDirection: 'column', gap: '12px'}}>
  <div style={{background: 'white', borderRadius: '10px', padding: '16px 20px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', display: 'flex', gap: '16px', alignItems: 'flex-start'}}>
    <div style={{background: '#0052cc', color: 'white', borderRadius: '50%', minWidth: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.95rem'}}>1</div>
    <div style={{flex: 1}}>
      <h4 style={{margin: '0 0 4px 0'}}>Decrypt secrets</h4>
      <pre style={{background: '#1e1e1e', color: '#d4d4d4', borderRadius: '6px', padding: '10px 14px', fontSize: '0.85rem', margin: 0}}><code>$STACKTIC_OUTPUT/scripts/stacktic/decrypt-secrets.sh</code></pre>
    </div>
  </div>
  <div style={{background: 'white', borderRadius: '10px', padding: '16px 20px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', display: 'flex', gap: '16px', alignItems: 'flex-start'}}>
    <div style={{background: '#0052cc', color: 'white', borderRadius: '50%', minWidth: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.95rem'}}>2</div>
    <div style={{flex: 1}}>
      <h4 style={{margin: '0 0 4px 0'}}>Build all components</h4>
      <pre style={{background: '#1e1e1e', color: '#d4d4d4', borderRadius: '6px', padding: '10px 14px', fontSize: '0.85rem', margin: 0}}><code>{`kubectl apply -k $STACKTIC_OUTPUT/k8s/build/overlays/dev/ \\
  --server-side=true --force-conflicts=true`}</code></pre>
    </div>
  </div>
  <div style={{background: 'white', borderRadius: '10px', padding: '16px 20px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', display: 'flex', gap: '16px', alignItems: 'flex-start'}}>
    <div style={{background: '#0052cc', color: 'white', borderRadius: '50%', minWidth: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.95rem'}}>3</div>
    <div style={{flex: 1}}>
      <h4 style={{margin: '0 0 4px 0'}}>Deploy all components</h4>
      <pre style={{background: '#1e1e1e', color: '#d4d4d4', borderRadius: '6px', padding: '10px 14px', fontSize: '0.85rem', margin: 0}}><code>{`kubectl apply -k $STACKTIC_OUTPUT/k8s/deploy/overlays/dev/ \\
  --server-side=true --force-conflicts=true`}</code></pre>
      <div style={{background: '#fff8e1', borderLeft: '4px solid #f9a825', borderRadius: '6px', padding: '8px 12px', marginTop: '8px', fontSize: '0.8rem'}}>
        You may encounter <code>no matches for kind "XXX"</code> errors on first apply. Reapply the deployment and the error will resolve — CRDs need a moment to register.
      </div>
    </div>
  </div>
  <div style={{background: 'white', borderRadius: '10px', padding: '16px 20px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', display: 'flex', gap: '16px', alignItems: 'flex-start'}}>
    <div style={{background: '#2e7d32', color: 'white', borderRadius: '50%', minWidth: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.95rem'}}>4</div>
    <div style={{flex: 1}}>
      <h4 style={{margin: '0 0 4px 0'}}>Validate all components</h4>
      <pre style={{background: '#1e1e1e', color: '#d4d4d4', borderRadius: '6px', padding: '10px 14px', fontSize: '0.85rem', margin: 0}}><code>$STACKTIC_OUTPUT/scripts/stacktic/validate-all.sh</code></pre>
    </div>
  </div>
</div>

<div style={{background: '#e3f2fd', borderLeft: '4px solid #1976d2', borderRadius: '6px', padding: '12px 16px', marginTop: '16px'}}>
  <strong>Cluster requirement:</strong> Make sure your cluster allows metrics and cloud monitoring for HPA (Horizontal Pod Autoscaler).
</div>

</div>

---

## Migration Guide

<div style={{background: '#f8f9fb', borderRadius: '12px', padding: '24px', border: '1px solid #e0e4e8', marginBottom: '24px'}}>

<div style={{display: 'flex', flexDirection: 'column', gap: '16px'}}>

  {/* STEP 1 */}
  <div style={{background: 'white', borderRadius: '10px', padding: '20px', borderLeft: '4px solid #0052cc', boxShadow: '0 1px 4px rgba(0,0,0,0.06)'}}>
    <div style={{display: 'flex', gap: '12px', alignItems: 'flex-start'}}>
      <div style={{background: '#0052cc', color: 'white', borderRadius: '50%', minWidth: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700}}>1</div>
      <div>
        <h4 style={{margin: '0 0 8px 0'}}>Design Your Topology</h4>
        <p style={{margin: '0 0 12px 0', fontSize: '0.9rem', color: '#555'}}>
          No matter if the migration is from a legacy app or a managed service, design your topology — backend, frontend, and data — exactly as it exists today. Start with the basic skeleton, without observability, security, or testing.
        </p>
        <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px'}}>
          <div style={{background: '#f0f4f8', borderRadius: '6px', padding: '10px 14px', fontSize: '0.85rem'}}>
            <strong>DocumentDB</strong> is MongoDB — same open-source engine, managed wrapper.
          </div>
          <div style={{background: '#f0f4f8', borderRadius: '6px', padding: '10px 14px', fontSize: '0.85rem'}}>
            <strong>RDS</strong> is PostgreSQL — same open-source engine, managed wrapper.
          </div>
        </div>
      </div>
    </div>
  </div>

  {/* STEP 2 */}
  <div style={{background: 'white', borderRadius: '10px', padding: '20px', borderLeft: '4px solid #0052cc', boxShadow: '0 1px 4px rgba(0,0,0,0.06)'}}>
    <div style={{display: 'flex', gap: '12px', alignItems: 'flex-start'}}>
      <div style={{background: '#0052cc', color: 'white', borderRadius: '50%', minWidth: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700}}>2</div>
      <div>
        <h4 style={{margin: '0 0 8px 0'}}>Source Code</h4>
        <p style={{margin: '0 0 12px 0', fontSize: '0.9rem', color: '#555'}}>Decide how to manage your source code:</p>
        <table style={{fontSize: '0.85rem', width: '100%', borderCollapse: 'collapse'}}>
          <thead>
            <tr style={{background: '#f0f4f8'}}>
              <th style={{textAlign: 'left', padding: '8px', borderBottom: '2px solid #e0e4e8'}}>Option</th>
              <th style={{textAlign: 'left', padding: '8px', borderBottom: '2px solid #e0e4e8'}}>How it works</th>
              <th style={{textAlign: 'left', padding: '8px', borderBottom: '2px solid #e0e4e8'}}>Watch out</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{padding: '8px', borderBottom: '1px solid #eee'}}><strong>External source code</strong></td>
              <td style={{padding: '8px', borderBottom: '1px solid #eee'}}>Point to your repo & Dockerfile. Define path, branch, ConfigMap params.</td>
              <td style={{padding: '8px', borderBottom: '1px solid #eee'}}>UID/GID defaults to 1001. Set port correctly. Avoid PVC if using HPA.</td>
            </tr>
            <tr>
              <td style={{padding: '8px', borderBottom: '1px solid #eee'}}><strong>Pre-defined templates</strong></td>
              <td style={{padding: '8px', borderBottom: '1px solid #eee'}}>Use Stacktic's automated source code templates — more efficient long-term.</td>
              <td style={{padding: '8px', borderBottom: '1px solid #eee'}}>Requires code mods to meet API and version requirements.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>

  {/* STEP 3 */}
  <div style={{background: 'white', borderRadius: '10px', padding: '20px', borderLeft: '4px solid #0052cc', boxShadow: '0 1px 4px rgba(0,0,0,0.06)'}}>
    <div style={{display: 'flex', gap: '12px', alignItems: 'flex-start'}}>
      <div style={{background: '#0052cc', color: 'white', borderRadius: '50%', minWidth: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700}}>3</div>
      <div>
        <h4 style={{margin: '0 0 8px 0'}}>Data Migration</h4>
        <p style={{margin: '0 0 8px 0', fontSize: '0.9rem', color: '#555'}}>
          Use <strong>MinIO</strong> for fast backup and restore. Click "+" on the data component to add your database, upload data to MinIO, and attach the link — this creates a restore job in your base folder automatically.
        </p>
        <div style={{background: '#e6f7e6', borderLeft: '4px solid #2e7d32', borderRadius: '6px', padding: '8px 12px', fontSize: '0.85rem'}}>
          Manual backups are possible but MinIO-based jobs are recommended for speed and repeatability.
        </div>
      </div>
    </div>
  </div>

  {/* STEP 4 */}
  <div style={{background: 'white', borderRadius: '10px', padding: '20px', borderLeft: '4px solid #0052cc', boxShadow: '0 1px 4px rgba(0,0,0,0.06)'}}>
    <div style={{display: 'flex', gap: '12px', alignItems: 'flex-start'}}>
      <div style={{background: '#0052cc', color: 'white', borderRadius: '50%', minWidth: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700}}>4</div>
      <div>
        <h4 style={{margin: '0 0 8px 0'}}>Test the Setup</h4>
        <pre style={{background: '#1e1e1e', color: '#d4d4d4', borderRadius: '6px', padding: '12px 14px', fontSize: '0.85rem', margin: '0 0 8px 0', overflow: 'auto'}}><code>{`# Build and deploy
kubectl apply -k k8s/build/overlay/dev
kubectl apply -k k8s/deploy/overlay/dev

# Run database restore (e.g. MongoDB)
kubectl apply -f k8s/deploybase/mongodb/mongo-restore.yaml`}</code></pre>
      </div>
    </div>
  </div>

  {/* STEP 5 */}
  <div style={{background: 'white', borderRadius: '10px', padding: '20px', borderLeft: '4px solid #2e7d32', boxShadow: '0 1px 4px rgba(0,0,0,0.06)'}}>
    <div style={{display: 'flex', gap: '12px', alignItems: 'flex-start'}}>
      <div style={{background: '#2e7d32', color: 'white', borderRadius: '50%', minWidth: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700}}>5</div>
      <div>
        <h4 style={{margin: '0 0 8px 0'}}>Build Around the Skeleton</h4>
        <p style={{margin: '0 0 8px 0', fontSize: '0.9rem', color: '#555'}}>Once the basic app is deployed, enhance it:</p>
        <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '8px'}}>
          <div style={{background: '#f0f4f8', borderRadius: '6px', padding: '10px', textAlign: 'center', fontSize: '0.85rem'}}><strong>Observability</strong><br/><span style={{color: '#555', fontSize: '0.75rem'}}>Monitoring & logging</span></div>
          <div style={{background: '#f0f4f8', borderRadius: '6px', padding: '10px', textAlign: 'center', fontSize: '0.85rem'}}><strong>Testing</strong><br/><span style={{color: '#555', fontSize: '0.75rem'}}>Automated frameworks</span></div>
          <div style={{background: '#f0f4f8', borderRadius: '6px', padding: '10px', textAlign: 'center', fontSize: '0.85rem'}}><strong>Security</strong><br/><span style={{color: '#555', fontSize: '0.75rem'}}>IAM, policies, scanning</span></div>
          <div style={{background: '#f0f4f8', borderRadius: '6px', padding: '10px', textAlign: 'center', fontSize: '0.85rem'}}><strong>Services</strong><br/><span style={{color: '#555', fontSize: '0.75rem'}}>Expand & refine</span></div>
        </div>
      </div>
    </div>
  </div>

</div>

</div>
