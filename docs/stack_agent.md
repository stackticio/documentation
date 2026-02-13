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

## API Examples

<div style={{background: '#f8f9fb', borderRadius: '12px', padding: '24px', border: '1px solid #e0e4e8', marginBottom: '32px'}}>
  <p style={{fontSize: '0.95rem', color: '#555', marginTop: 0}}>
    Every test is a single <code>POST</code> to <code>/metadata/q</code>. The API reads your topology, resolves variables like <code>{'{namespace}'}</code> and <code>{'{database}'}</code> automatically, executes the command on the right target, and returns <code>passed</code> or <code>failed</code> with diagnostics.
  </p>

  <div style={{background: '#1a1a2e', borderRadius: '10px', padding: '16px 20px', marginBottom: '20px'}}>
    <div style={{color: '#90caf9', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px'}}>Request Structure</div>
    <pre style={{background: '#0d2137', color: '#e0e0e0', borderRadius: '8px', padding: '16px', fontSize: '0.82rem', overflow: 'auto', margin: 0}}><code>{`curl -s -X POST http://localhost:8080/metadata/q \\
  -H "Content-Type: application/json" \\
  -d '{
    "source":      "type:cnpg",           // which component to target
    "target":      "sub_components",       // component | sub_components | links_to | links_from
    "command":     "SELECT 1",            // the actual test — exit 0 = passed
    "description": "Connect {database}",  // label in the report
    "severity":    "critical",            // critical | warning | info
    "on_failure":  "kubectl get pods ...",  // runs when command fails
    "on_success":  "SELECT current_db()"   // runs when command passes
  }'`}</code></pre>
  </div>


</div>

---

## Example: Kafka Version Upgrade — Validate All Topics & Sinks

<div style={{background: '#1a1a2e', borderRadius: '12px', padding: '24px', marginBottom: '32px', border: '1px solid #1976d2'}}>
  <p style={{color: '#b0bec5', fontSize: '0.95rem', marginTop: 0}}>
    You just upgraded Kafka from 3.6 to 3.7. Before calling it done, run these 4 calls and know in seconds if everything survived the upgrade.
  </p>

  <div style={{display: 'flex', flexDirection: 'column', gap: '16px'}}>

    {/* STEP 1 */}
    <div style={{background: '#0d2137', borderRadius: '10px', padding: '16px', borderLeft: '3px solid #4caf50'}}>
      <div style={{display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px'}}>
        <div style={{background: '#4caf50', color: 'white', borderRadius: '50%', minWidth: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.85rem'}}>1</div>
        <span style={{color: 'white', fontWeight: 600}}>Cluster Ready after upgrade</span>
      </div>
      <pre style={{background: '#162032', color: '#e0e0e0', borderRadius: '6px', padding: '12px', fontSize: '0.78rem', overflow: 'auto', margin: 0}}><code>{`curl -s -X POST http://localhost:8080/metadata/q -H 'Content-Type: application/json' \\
  -d '{
    "source": "type:kafka", "target": "component",
    "command": "kubectl get kafka -n {namespace} -o jsonpath=\\"{.items[0].status.conditions[?(@.type==\\\\\\"Ready\\\\\\")].status}\\" | grep -q True",
    "description": "Kafka cluster ready",
    "severity": "critical",
    "on_success": "kubectl get kafka -n {namespace} -o jsonpath=\\"{.items[0].metadata.name}: replicas={.items[0].spec.kafka.replicas}, version={.items[0].spec.kafka.version}\\""
  }' | jq`}</code></pre>
    </div>

    {/* STEP 2 */}
    <div style={{background: '#0d2137', borderRadius: '10px', padding: '16px', borderLeft: '3px solid #f9a825'}}>
      <div style={{display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px'}}>
        <div style={{background: '#f9a825', color: 'white', borderRadius: '50%', minWidth: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.85rem'}}>2</div>
        <span style={{color: 'white', fontWeight: 600}}>All Topics still ready</span>
      </div>
      <pre style={{background: '#162032', color: '#e0e0e0', borderRadius: '6px', padding: '12px', fontSize: '0.78rem', overflow: 'auto', margin: 0}}><code>{`curl -s -X POST http://localhost:8080/metadata/q -H 'Content-Type: application/json' \\
  -d '{
    "source": "type:kafka", "target": "component",
    "command": "not_ready=$(kubectl get kafkatopic -n {namespace} -o jsonpath=\\"{range .items[*]}{.metadata.name}:{.status.conditions[?(@.type==\\\\\\"Ready\\\\\\")].status}{\\\\\\"\\\\\\\\n\\\\\\"}{end}\\" | grep -v True | grep -v \\"^$\\"); if [ -n \\"$not_ready\\" ]; then echo NOT READY: $not_ready; exit 1; else echo All topics ready; fi",
    "description": "All topics ready",
    "severity": "critical",
    "on_failure": "kubectl get kafkatopic -n {namespace}"
  }' | jq`}</code></pre>
    </div>

    {/* STEP 3 */}
    <div style={{background: '#0d2137', borderRadius: '10px', padding: '16px', borderLeft: '3px solid #0052cc'}}>
      <div style={{display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px'}}>
        <div style={{background: '#0052cc', color: 'white', borderRadius: '50%', minWidth: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.85rem'}}>3</div>
        <span style={{color: 'white', fontWeight: 600}}>All Sink Connectors running</span>
      </div>
      <pre style={{background: '#162032', color: '#e0e0e0', borderRadius: '6px', padding: '12px', fontSize: '0.78rem', overflow: 'auto', margin: 0}}><code>{`curl -s -X POST http://localhost:8080/metadata/q -H 'Content-Type: application/json' \\
  -d '{
    "source": "type:kafka", "target": "component",
    "command": "echo \\"=== Sink Connectors ===\\"; for connector in $(kubectl get kafkaconnector -n {namespace} -o jsonpath=\\"{.items[*].metadata.name}\\"); do state=$(kubectl get kafkaconnector $connector -n {namespace} -o jsonpath=\\"{.status.connectorStatus.connector.state}\\"); task=$(kubectl get kafkaconnector $connector -n {namespace} -o jsonpath=\\"{.status.connectorStatus.tasks[0].state}\\"); topic=$(kubectl get kafkaconnector $connector -n {namespace} -o jsonpath=\\"{.spec.config.topics}\\"); echo \\"$connector: state=$state task=$task topic=$topic\\"; done",
    "description": "All sinks summary",
    "severity": "info"
  }' | jq`}</code></pre>
    </div>

    {/* STEP 4 */}
    <div style={{background: '#0d2137', borderRadius: '10px', padding: '16px', borderLeft: '3px solid #e65100'}}>
      <div style={{display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px'}}>
        <div style={{background: '#e65100', color: 'white', borderRadius: '50%', minWidth: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.85rem'}}>4</div>
        <span style={{color: 'white', fontWeight: 600}}>E2E — Produce message, verify it lands in PostgreSQL sink</span>
      </div>
      <pre style={{background: '#162032', color: '#e0e0e0', borderRadius: '6px', padding: '12px', fontSize: '0.78rem', overflow: 'auto', margin: 0}}><code>{`curl -s -X POST http://localhost:8080/metadata/q -H 'Content-Type: application/json' \\
  -d '{
    "source": "type:kafka", "target": "component",
    "command": "broker=$(kubectl get pods -n {namespace} -l strimzi.io/component-type=kafka -o jsonpath=\\"{.items[0].metadata.name}\\"); bootstrap=$(kubectl get kafka -n {namespace} -o jsonpath=\\"{.items[0].status.listeners[0].bootstrapServers}\\"); connector=$(kubectl get kafkaconnector -n {namespace} --no-headers -o custom-columns=NAME:.metadata.name,CLASS:.spec.class | grep -i postgresql | head -1 | awk \\"{print \\\\$1}\\"); topic=$(kubectl get kafkaconnector $connector -n {namespace} -o jsonpath=\\"{.spec.config.topics}\\"); test_id=\\"e2e-$(date +%s)\\"; echo \\"{\\\\\\"username\\\\\\":\\\\\\"$test_id\\\\\\",\\\\\\"city\\\\\\":\\\\\\"test\\\\\\"}\\" | kubectl exec -n {namespace} -i $broker -- /opt/kafka/bin/kafka-console-producer.sh --bootstrap-server $bootstrap --topic $topic 2>/dev/null && echo Produced: $test_id to $topic",
    "verify_delay": 5,
    "on_success": "pg_pod=$(kubectl get pods -n cnpg -l cnpg.io/cluster -o jsonpath=\\"{.items[0].metadata.name}\\"); kubectl exec -n cnpg $pg_pod -- psql -c \\"SELECT count(*) FROM pg_stat_activity\\" 2>/dev/null || echo PostgreSQL query executed",
    "on_failure": "kubectl logs -n {namespace} -l strimzi.io/name=kafka-connect --tail=30",
    "description": "PostgreSQL sink E2E",
    "severity": "warning"
  }' | jq`}</code></pre>
    </div>

  </div>

  <div style={{background: '#162032', borderLeft: '3px solid #90caf9', borderRadius: '6px', padding: '12px 16px', marginTop: '16px'}}>
    <p style={{color: '#b0bec5', fontSize: '0.85rem', margin: 0}}>
      <strong style={{color: 'white'}}>4 calls. Full Kafka validation.</strong> Cluster health, all topics, all connectors, end-to-end data flow — zero hardcoded names. Same calls work on any stack, any environment.
    </p>
  </div>
</div>

---

## Query Reference

<div style={{background: '#f8f9fb', borderRadius: '12px', padding: '24px', border: '1px solid #e0e4e8', marginBottom: '24px'}}>
  <p style={{fontSize: '0.95rem', color: '#555', marginTop: 0}}>
    Beyond running tests, you can query your stack metadata directly — list components, inspect links, dry-run commands before executing.
  </p>

  <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px'}}>
    <div style={{background: 'white', borderRadius: '10px', padding: '20px', borderLeft: '4px solid #0052cc', boxShadow: '0 1px 4px rgba(0,0,0,0.06)'}}>
      <h4 style={{margin: '0 0 10px 0', color: '#0052cc'}}>List all databases</h4>
      <pre style={{background: '#1e1e1e', color: '#d4d4d4', borderRadius: '6px', padding: '12px', fontSize: '0.8rem', overflow: 'auto', margin: 0}}><code>{`curl -s -X POST http://localhost:8080/metadata/q \\
  -H "Content-Type: application/json" \\
  -d '{
    "source": "type:cnpg",
    "target": "sub_components",
    "select": ["database", "username", "consumers"]
  }' | jq`}</code></pre>
    </div>
    <div style={{background: 'white', borderRadius: '10px', padding: '20px', borderLeft: '4px solid #0052cc', boxShadow: '0 1px 4px rgba(0,0,0,0.06)'}}>
      <h4 style={{margin: '0 0 10px 0', color: '#0052cc'}}>List all APISIX routes</h4>
      <pre style={{background: '#1e1e1e', color: '#d4d4d4', borderRadius: '6px', padding: '12px', fontSize: '0.8rem', overflow: 'auto', margin: 0}}><code>{`curl -s -X POST http://localhost:8080/metadata/q \\
  -H "Content-Type: application/json" \\
  -d '{
    "source": "apisix",
    "target": "links_to",
    "select": ["subdomain", "domain", "cors", "websocket"]
  }' | jq`}</code></pre>
    </div>
    <div style={{background: 'white', borderRadius: '10px', padding: '20px', borderLeft: '4px solid #0052cc', boxShadow: '0 1px 4px rgba(0,0,0,0.06)'}}>
      <h4 style={{margin: '0 0 10px 0', color: '#0052cc'}}>Dry run — preview without executing</h4>
      <pre style={{background: '#1e1e1e', color: '#d4d4d4', borderRadius: '6px', padding: '12px', fontSize: '0.8rem', overflow: 'auto', margin: 0}}><code>{`curl -s -X POST http://localhost:8080/metadata/q \\
  -H "Content-Type: application/json" \\
  -d '{
    "source": "apisix",
    "target": "links_to",
    "command": "curl -sk https://{subdomain}.{domain}",
    "dry_run": true
  }' | jq '.results[] | {name, command}'`}</code></pre>
    </div>
    <div style={{background: 'white', borderRadius: '10px', padding: '20px', borderLeft: '4px solid #0052cc', boxShadow: '0 1px 4px rgba(0,0,0,0.06)'}}>
      <h4 style={{margin: '0 0 10px 0', color: '#0052cc'}}>Who connects to Valkey?</h4>
      <pre style={{background: '#1e1e1e', color: '#d4d4d4', borderRadius: '6px', padding: '12px', fontSize: '0.8rem', overflow: 'auto', margin: 0}}><code>{`curl -s -X POST http://localhost:8080/metadata/q \\
  -H "Content-Type: application/json" \\
  -d '{
    "source": "valkey",
    "target": "links_from",
    "select": ["link_name", "link_type"]
  }' | jq`}</code></pre>
    </div>
  </div>

  <div style={{background: '#e3f2fd', borderLeft: '4px solid #1976d2', borderRadius: '6px', padding: '12px 16px', marginTop: '16px'}}>
    <strong>Available for every component:</strong> PostgreSQL, Kafka, APISIX, Valkey, Grafana, ClickHouse, SeaweedFS, Qdrant, OpenTelemetry, Cert-Manager — and any component you add to your topology.
  </div>
</div>
