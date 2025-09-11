---
sidebar_position: 4
hide_table_of_contents: true
---

# Architecture

The architecture and approach of Stacktic reflect a deep commitment to security, data privacy, and operational efficiency. Here's a breakdown of its key architectural components and methodologies:

## 🔒 Security and Data Concerns

Stacktic is a **stack generator**, **not** an operator or deployment agent within your infrastructure.  
- It only requires credentials for your Git repository (to push and merge) and your container registry (to pull and build images).  
- These credentials are used **only to initialize** an empty repository and registry—Stacktic **does not store** your personal information or application code.  
- The platform provides the **application skeleton**, so you can write or migrate your own code without worrying about underlying infrastructure complexity.  

Optionally, Stacktic can use a lightweight **agent inside your cluster** that communicates with the backend via API to share **health** and **stack layer information**. This is used **only for health checks, security, and scaling purposes**.

<img width="1119" height="641" alt="Stacktic Diagram" src="https://github.com/user-attachments/assets/56dc189a-c452-4ea0-a4e2-4412d8e39ccf" />

---

## ⚙️ Stacktic Automation Overview

Stacktic automates **every layer and step** involved in delivering full-stack applications:  
- **Day 0 – Architecture:** Defines your application topology and dependencies.  
- **Day 1 – Deployment:** Generates and deploys the required stack components.  
- **Day 2 – Operations:** Automates scaling, security checks, and operational tasks.  

The platform understands **metadata from your UI topology** and automates **infrastructure, APIs, connectors, dependencies, security settings, and human task configurations**—but **it never touches your application logic or databases**.  

In other words, **Stacktic automates everything beyond your code**, so you can focus entirely on building features.  

The generated automation is committed to your **Git repository** and can be:  
- Installed with a **single command**, or  
- Deployed through existing tools (e.g., **ArgoCD**) directly to Kubernetes.



## 📁 Repository Structure

The repository structure maintained by **Stacktic** follows a consistent format, combining **Helm** and **Kustomize** for maximum flexibility and maintainability:

- **Helm Chart Templating**  
  Helm is used to generate the deployment YAML files that feed into Kustomize.  
  We avoid the overhead of managing Helm charts directly—instead, we create a full Kustomize setup from the Helm output.

- **Kustomize Control**  
  The stack structure is defined by **Kustomize**, where each component is automatically configured at the base level with pre-defined overlays.  
  This allows you to deploy your stack with a **single command** on any Kubernetes cloud.

- **Deployment and Build Directories**  
  Kustomize handles both **build** and **deploy** processes:  
  - Deployment configurations are located under `k8s/deploy`.  
  - Build processes are located under `k8s/build`, with builds triggered by **Kaniko**.

```
  cat k8s/deploy/overlays/dev/kustomization.yaml
resources:
  - fastapi
  - stack-agent
  - prod
  - dev
  - stage
  - cert-manager
  - minio
  - apisix
  - cnpg
  - rabbitmq
  - keycloak-operator.........
 
tree -d k8s/deploy/base/

k8s/deploy/base/
├── apisix
│   ├── crd
│   ├── patch
│   └── secret
├── cert-manager
│   └── issuer
├── cnpg
│   ├── backup
│   ├── jobs
│   ├── patch
│   └── secret
├── dev
│   ├── config
│   ├── files
│   ├── jobs
│   ├── patch
│   └── secret
│       └── cosign
├── fastapi
│   ├── files
│   ├── patch
│   └── secret
├── keycloak-operator
│   ├── crds
│   ├── jobs
│   ├── patch
│   └── secret
├── minio.............

```
- **Documentation and Source Code**: Placed at the root level for easy access and modification.

```
 tree -d doc             
doc
├── apisix
├── cert-manager
├── cnpg
├── dev
├── fastapi
│   └── images
├── minio
├── prod
├── rabbitmq
├── stack-agent
├── stacktic
│   └── known-issues
└── stage

14 directories
tree -d fastapi 
fastapi
├── day2
├── dev_tools
├── src
│   ├── rabbitmq_module
│   └── stack_agent_api_module
└── tests
    └── integration

8 directories

```

## 🧠 Metadata and Logic

Stacktic is a **metadata-driven logic platform**:  
- It can interpret, from a **single connection** between services, exactly **what needs to happen next**.  
- For example, when you connect a backend backend to a database, there is typically **one proven pattern** that includes:  
  - Secrets management  
  - Dependency resolution  
  - API connections  
  - ConfigMap and environment variable exchanges  
  - Documentation explaining the configuration  

The main variables that can affect these patterns are **version differences**, which influence dependencies, knowledge sharing, and compatibility.  
Stacktic **automates the optimal pattern** while understanding and adapting to **version-specific dependencies**.


<img width="1016" height="517" alt="image" src="https://github.com/user-attachments/assets/4f64e6d1-2e75-465a-a2d7-61783f5b3d67" />


 ## 🧩 Stacktic Structure: Components and Sub-Components

Stacktic’s structure is based on **components**, which represent services (e.g., **MongoDB**, **Flowise**, **Apache Airflow**).  
From these components, you can add **sub-components** that represent specific functionality within a component.  

### 🔗 Examples
- **Kafka** component → **Topic** sub-component  
- **MongoDB** component → **Mongo Database** sub-component  
- **MinIO** component → **Bucket** sub-component  

### 🔄 Connections and Relationships
- **Components** can be connected to **sub-components**, and **sub-components** can also be linked back to **components** (bi-directional relationships).  
- **Configuration attributes** exist at every level:  
  - **Components:** Attributes related to **versioning** and **deployment**.  
  - **Links (relationships):** Attributes defining the **connection behavior** between components or sub-components.  
  - **Sub-components:** Attributes specific to that element, such as **buckets**, **database secrets**, or other fine-grained settings.  

This structure provides **flexibility and precision** while maintaining a clear hierarchy for managing services and their relationships.

<img width="471" height="392" alt="image" src="https://github.com/user-attachments/assets/b63b0da4-ef2d-4a14-8697-4880e69dc0e7" />

## 🏢 Stacktic SaaS Considerations

Stacktic’s **public SaaS** is built on **multi-tenant principles** and **best security practices**.  
- We **do not store personal application data** or run directly in your production environment.  
- For customers with stricter security or compliance requirements, we offer the following options:

### 🔒 Flexible Deployment Options
1. **Private Public SaaS**  
   - We can host and manage Stacktic as a **dedicated SaaS instance** for your organization.  
   - Supports private data and backend management.  
   - We can restrict access with **firewall rules** to your IP ranges or apply **specific custom configurations** to meet your security requirements.

2. **Private SaaS for Highly Regulated Customers**  
   - Deploy Stacktic **within your own clusters**, **compliant data centers**, or **air-gapped environments**.  
   - We only require secure access to **push updates remotely** to the Stacktic host, ensuring you maintain full control of sensitive environments.

---

## 🔐 Security and Openness

Stacktic is an **open platform**, meaning:  
- If you deploy Stacktic as **private SaaS** or use our **health-check agent**, **you retain the option and responsibility** to modify or add your own security measures to our services.  
- This flexibility allows organizations to **align Stacktic with their internal security policies** without vendor lock-in or restricted controls.

