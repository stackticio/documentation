---
sidebar_position: 3
hide_table_of_contents: true
---

# Core Concepts

This section outlines topics and terms necessary for a comprehensive understanding of our stack. The required depth of knowledge varies based on the user's role and team association.

## Stacktic-Specific Concepts

- **Components**: The fundamental building blocks in Stacktic representing services (MongoDB, PostgreSQL, Kafka, etc.). Each component encapsulates a complete service with its configuration, dependencies, and operational requirements.
- **Sub-Components**: Granular elements within components (e.g., Kafka Topics, MongoDB Databases, MinIO Buckets) that represent specific functionality or resources within a service.
- **Links/Relationships**: Bidirectional connections between components or sub-components that automatically generate configurations, secrets, network policies, and API connections based on metadata-driven logic.
- **Stack Topology**: The visual and logical representation of your application architecture, showing all components, sub-components, and their relationships.
- **Day 0/1/2 Operations**: Stacktic's lifecycle framework - Day 0 (Architecture & Design), Day 1 (Deployment), Day 2 (Operations & Management).
- **external_source_code**: A Stacktic component type that points to Git repositories and builds images using Kaniko in-cluster.
- **image_base**: A Stacktic component type for importing pre-built container images from registries.
- **Metadata-Driven Logic**: Stacktic's core engine that interprets component relationships and automatically generates optimal configurations, patterns, and automation.
- **Stack Versioning**: Stacktic's capability to save, branch, and manage multiple versions of your entire stack configuration.
- **LiveView**: Stacktic's relationship-aware observability solution that provides deep insights into stack layer interactions beyond traditional metrics.
- **Sections**: Centralized configuration areas in Stacktic for managing resources, secrets, and custom attribute groupings across multiple components.
- **Stacktic Branch**: The git branch where Stacktic pushes all automated configurations, separate from your main branch to preserve customizations.
- **Scale Forecast**: Stacktic's capacity planning feature that uses RPS, IO, and connection metrics to predict resource requirements and costs.
- **CISO Audit Report**: Automatically generated security compliance report based on stack metadata, including recommendations and risk scoring.

## Templating and Tools Used in Our Platform

- **Kustomization**: Our template structure leverages the Kustomization standard, enabling efficient management and customization of Kubernetes resources. [Learn more about Kustomization](https://kubectl.docs.kubernetes.io/references/kustomize/kustomization/).
- **Helm Chart**: We use Helm charts to template YAML, which is then managed by Kustomization. This requires an understanding of Helm's overlays, bases, and features. [Helm Documentation](https://helm.sh/docs/).
- **Cookiecutter**: Cookiecutter serves as our framework for templating logic and UI conditions, streamlining code customization. [Cookiecutter GitHub](https://github.com/cookiecutter/cookiecutter).
- **Frameworks**: Developers should be familiar with dockerizing processes, managing dependencies, and defining APIs to customize their source code effectively.
- **Kaniko**: We utilize Kaniko for the build process, facilitating container image builds in a Kubernetes cluster. [Kaniko Project](https://github.com/GoogleContainerTools/kaniko).

## Infrastructure & Orchestration

### CNCF Ecosystem Components
- **Container Orchestration**: Deep understanding of Kubernetes as the foundation, including CRDs, Operators, StatefulSets, and advanced scheduling concepts.
- **Service Mesh (Istio/Linkerd)**: Traffic management, observability, and security at the mesh layer for microservices communication.
- **GitOps (ArgoCD/Flux)**: Declarative continuous deployment using Git as single source of truth. Understanding of reconciliation loops and drift detection.
- **Auto-scaling (KEDA/HPA/VPA)**: Event-driven autoscaling with KEDA, Horizontal Pod Autoscaler patterns, and Vertical Pod Autoscaler for right-sizing.
- **Ingress Controllers**: NGINX, Traefik, HAProxy for L7 load balancing and routing.

### Apache & Open Source Stack
- **Workflow Orchestration (Apache Airflow)**: DAG-based workflow management for ETL, data pipelines, and scheduled tasks.
- **Streaming (Apache Kafka/Pulsar)**: Event streaming platforms with understanding of topics, partitions, consumer groups, and exactly-once semantics.
- **API Gateway (Apache APISIX)**: Advanced traffic control, authentication, rate limiting, and observability at the API layer.
- **Object Storage (MinIO)**: S3-compatible object storage for cloud-native applications, understanding buckets, policies, and lifecycle management.
- **Search & Analytics (OpenSearch/Elasticsearch)**: Full-text search, log analytics, and distributed search architecture.

## Security & Compliance (SecOps)

### Access Control & Identity
- **RBAC**: Kubernetes Role-Based Access Control with Roles, ClusterRoles, ServiceAccounts, and binding strategies.
- **OIDC/OAuth2**: Identity providers integration (Keycloak, Dex, Auth0) for SSO and federated authentication.
- **mTLS**: Mutual TLS for service-to-service authentication and encryption.

### Policy Enforcement
- **OPA (Open Policy Agent)**: Policy-as-code with Rego language for admission control, authorization, and compliance.
- **Network Policies**: Kubernetes-native and CNI-specific policies for micro-segmentation and zero-trust networking.
- **Pod Security Standards**: Pod Security Policies replacement with restricted, baseline, and privileged profiles.

### Secrets Management
- **SOPS (Secrets Operations)**: Encryption of secrets in Git repositories with key management.
- **External Secrets Operator**: Integration with HashiCorp Vault, AWS Secrets Manager, Azure Key Vault.
- **Sealed Secrets**: Bitnami Sealed Secrets for GitOps-friendly secret management.

## Observability & Performance

### Metrics & Monitoring
- **Prometheus Stack**: PromQL, ServiceMonitors, AlertManager, recording rules, and federation.
- **Grafana Ecosystem**: Dashboards, Loki for logs, Tempo for traces, and Grafana Agent.
- **OpenTelemetry**: Unified observability framework for metrics, logs, and traces with OTLP protocol.

### Performance Testing
- **k6**: Load testing with JavaScript-based scenarios, thresholds, and cloud/on-premise execution.
- **Gatling/JMeter**: Alternative load testing frameworks for specific protocols and scenarios.
- **Chaos Engineering**: Litmus, Chaos Mesh for resilience testing and failure injection.

## Data & Persistence

### Database Operators
- **CloudNative-PG (CNPG)**: PostgreSQL operator with automated failover, backups, and pooling.
- **MongoDB Operator**: Automated MongoDB clusters with sharding and replication.
- **Redis Operator**: Redis Sentinel and Cluster modes with persistence options.

### Message Queues & Streaming
- **Strimzi (Kafka on K8s)**: Kafka operator with topic management, Kafka Connect, and MirrorMaker.
- **RabbitMQ Operator**: Clustering, quorum queues, and management policies.
- **NATS**: Lightweight messaging with JetStream for persistence.

### Backup & Disaster Recovery
- **Velero**: Backup and restore of Kubernetes resources and persistent volumes.
- **Kasten K10**: Enterprise backup with application consistency and cross-cloud mobility.
- **Longhorn**: Distributed block storage with built-in backup capabilities.