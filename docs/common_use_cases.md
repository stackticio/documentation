---
sidebar_position: 13
hide_table_of_contents: true
---

# 💡 Common Use Cases

## 📋 Table of Contents

1. [Overview](#overview)
2. [External Services Integration](#external-services-integration)
3. [Auto-Scaling Configuration](#auto-scaling-configuration)
4. [Multi-Cluster Stack](#multi-cluster-stack)
5. [Private SaaS Maintenance](#private-saas-maintenance)
6. [Migration from VMs or Managed Services](#migration-from-vms-or-managed-services)

---

## Overview

This chapter covers different approaches and scenarios for using Stacktic to solve real-world challenges. From integrating external services to managing multi-cluster deployments, these use cases demonstrate Stacktic's flexibility and power.

---

## External Services Integration

### Managing Services Outside the Stack

While we encourage using everything from inside the stack to create agnostic, centralized stacks, we understand that sometimes external services are preferred or required.

### Integration Approaches

#### Option 1: Simple Environment Variables
The straightforward approach - add environment variables to your source code:
- Add S3 keys and host as ENV variables
- Your code likely already supports these ENVs
- Minimal changes required

#### Option 2: Dummy Components for Synchronization
For a more stack-integrated solution:
- Create dummy components with relevant attributes
- Link them to source code or components
- Automatically sync ENVs across the stack

#### Option 3: External Component Automation
For advanced scenarios:
- Add automation of external components using Crossplane
- Manage external resources from within Stacktic
- Maintain centralized control

### Best Practices for External Services

| Approach | Use Case | Complexity |
|----------|----------|------------|
| **ENV Variables** | Simple external service connections | Low |
| **Dummy Components** | ENV synchronization across stack | Medium |
| **Crossplane Integration** | Full external resource management | High |

---

## Auto-Scaling Configuration

### Simplified Kubernetes Auto-Scaling

Many teams fear Kubernetes auto-scaling or struggle with tuning for peaks while saving costs. Stacktic provides centralized control, resource recommendations, forecasting, and LiveView analysis recommendations.

### Resource Management Options

#### Component-Level Editing
Edit resources directly from components:


<img src={require('./image-50.png').default} alt="alt text" width="500" />

#### Centralized Section Control
Use sections for centralized resource management across the stack.

### Resource Plans for Complex Services

For high-complexity services like Loki, Prometheus, or OpenSearch (which might contain 6+ different resources), Stacktic simplifies management with pre-configured plans:


<img src={require('./image-51.png').default} alt="alt text" width="500" />

#### Example: Loki Resource Configuration

```yaml
cat k8s/deploy/base/loki/patch/resource-small.yaml 
# 1) loki-backend StatefulSet
apiVersion: apps/v1
kind: StatefulSet
metadata:
  name: loki-backend
  namespace: loki
spec:
  template:
    spec:
      containers:
      - name: loki
        resources:
          requests:
            cpu: 100m
            memory: 128Mi
          limits:
            cpu: 150m
            memory: 192Mi

---
# 2) loki-read Deployment
apiVersion: apps/v1
kind: Deployment
metadata:
  name: loki-read
  namespace: loki
spec:
  template:
    spec:
      containers:
      - name: loki
        resources:
          requests:
            cpu: 100m
            memory: 128Mi
          limits:
            cpu: 150m
            memory: 192Mi

---
# 3) loki-write StatefulSet
apiVersion: apps/v1
kind: StatefulSet
metadata:
  name: loki-write
  namespace: loki
spec:
  template:
    spec:
      containers:
      - name: loki
        resources:
          requests:
            cpu: 250m
            memory: 256Mi
          limits:
            cpu: 375m
            memory: 384Mi

# ... additional components (gateway, cache, etc.)
```

#### Kustomization Configuration

```yaml
cat k8s/deploy/base/loki/kustomization.yaml       
resources:
  - namespace.yaml
  - loki.yaml
  - servicemonitor.yaml
  
labels:
  - pairs:
      stacktic.io/app: "loki"
      stacktic.io/group: "logs"
      stacktic.io/namespace: "loki"
    includeTemplates: true

patches:
  - path: patch/resource-small.yaml
```

### Forecast Report Configuration

Use the estimation editor to enter your statistics for better scaling recommendations:


<img src={require('./image-52.png').default} alt="alt text" width="500" />

#### Example Forecast Input

```yaml
expected_rps: 100
peak_rps: 400
expected_concurrent_connections: 10
peak_concurrent_connections: 60
avg_payload_size_kb: 12
```

This helps Stacktic's metadata engine provide better scaling understanding for the forecast report.

### LiveView Real-Time Analysis

The LiveView agent can:
- Estimate resources in real-time
- Provide analysis and recommendations
- Suggest optimal scaling configurations

---

## Multi-Cluster Stack

### Cross-Cluster Architecture

Some customers need multi-cluster stacks where:
- API gateway connects to another cluster
- Prometheus sends metrics to centralized Prometheus
- Services span multiple clusters

While not out-of-the-box, multi-cluster stacks are technically supported and can be easily configured per customer request.

### Configuration Steps

#### Step 1: Select External System
Choose external system from the left panel:


<img src={require('./image-48.png').default} alt="alt text" width="500" />


#### Step 2: Drag Components
Drag components from external system into your local stack:

<img src={require('./image-49.png').default} alt="alt text" width="500" />

#### Step 3: Create Cross-Stack Logic
Creating logic between stacks solves connectivity and centralization needs.

### Multi-Cluster Use Cases

| Scenario | Solution | Benefit |
|----------|----------|---------|
| **Centralized Monitoring** | Connect remote clusters to central Prometheus | Single pane of glass |
| **Distributed API Gateway** | API gateway routing to multiple clusters | Load distribution |
| **Cross-Region Services** | Services spanning geographic regions | High availability |

---

## Private SaaS Maintenance

### Managing Private Stacktic Instances

As discussed in the architecture and adoption chapters, private SaaS options are fully available. Customers using private SaaS can bypass all compliance concerns.

### Upgrade Procedure

The private SaaS upgrade procedure is simple:
1. Maintain single connection to Stacktic main SaaS
2. Stacktic pushes updates of automation and new features
3. Updates applied to your private SaaS instance
4. Full control over when to apply updates

### Benefits of Private SaaS

| Benefit | Description |
|---------|-------------|
| **Compliance** | Meet strict regulatory requirements |
| **Control** | Full control over updates and changes |
| **Security** | Air-gapped options available |
| **Customization** | Tailored to your needs |

---

## Migration from VMs or Managed Services

### Application Migration Support

Migrating existing applications from VMs or managed services to Stacktic requires careful planning.

### Migration Considerations

Not all migrations are the same. Common challenges include:
- Real production data
- Complex custom source code
- Legacy systems
- External connectors

### Migration Support

We're happy to get involved and assist with migrations. We can support most use cases except:
- Monolithic to microservices conversions without significant developer assistance
- Breaking architectural changes requiring deep application knowledge

### Migration Approach

| Migration Type | Complexity | Stacktic Support |
|---------------|------------|------------------|
| **Lift and Shift** | Low | Fully automated |
| **Re-platforming** | Medium | Assisted automation |
| **Re-architecting** | High | Consultation + automation |
| **Legacy Modernization** | Very High | Custom engagement |

### Getting Migration Help

For migration assistance:
1. Document your current architecture
2. Identify dependencies and integrations
3. Contact Stacktic team for assessment
4. Receive customized migration plan

---

## 🎯 Summary

### Key Use Case Takeaways

| Use Case | Solution | Complexity |
|----------|----------|------------|
| **External Services** | ENV vars, dummy components, or Crossplane | Low to Medium |
| **Auto-Scaling** | Centralized control with forecast reports | Medium |
| **Multi-Cluster** | Cross-stack component linking | Medium to High |
| **Private SaaS** | Isolated instance with controlled updates | Low |
| **Migration** | Assisted or automated based on complexity | Variable |

### Stacktic Flexibility

These use cases demonstrate that Stacktic can:
- ✅ Integrate with existing infrastructure
- ✅ Scale from simple to complex deployments
- ✅ Support various compliance requirements
- ✅ Facilitate migrations and modernization
- ✅ Adapt to unique organizational needs

---

*Stacktic: Solving real-world challenges with intelligent automation.*