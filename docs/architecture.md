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

## Metadata and Logic
stacktic is a metdata based logic which can udnerstand by single link from one serivce to another what need to happen, 
when you connect for example backend to database there always one good pattenrs which include secrets, depencies , api , configmap exchange ENV and doecumantion explaining the configraiton ..
the only elements htat could impact is the versions which can impact depencdencies ,knolwedge shraing and more.. stacktic automate the good pattern while understing the depcncies of the versions 

<img width="1016" height="517" alt="image" src="https://github.com/user-attachments/assets/4f64e6d1-2e75-465a-a2d7-61783f5b3d67" />


### Metadata Structure Overview

Stacktic's metadata is structured to define each service's characteristics, including its name, group, type, and specific attributes (such as namespace, version, and network policies). This structured approach allows Stacktic to automate the deployment, configuration, and integration of services within a Kubernetes cluster.

### Service Categorization

- **Name**: Identifies the service uniquely within the Stacktic environment.
- **Group**: Classifies services into logical groups based on their role or functionality within the application architecture (backend, frontend, data, platform…).
- **Type**: Specifies the service type, providing further granularity within a group and facilitating specific configurations or policies applicable to that type.
- **Examples of Attributes**: might include anything related to the service (namespace, secret, DB) or connectors (secret, Endpoint, queue/DB, etc.).

### Connectors (Links To and Links From)

Connectors define the relationships between services, specifying how they interact or depend on each other. These connections are categorized into two types:

- **Links To**: Outbound connections from the defined service to other services, indicating dependencies or data flows from the service.
- **Links From**: Inbound connections to the defined service from other services, representing how the service is accessed or utilized by other components.

Each link specifies a group and type that classify the nature of the connection, along with attributes that detail the specific parameters of the interaction, such as database names, credentials, or API paths. This approach enables Stacktic to model complex service interactions and dependencies accurately.

### Operational and Performance Services

Stacktic's metadata also encompasses operational and performance monitoring services like Prometheus and K6, integrating them into the application's architecture. These services are linked to application components to provide metrics collection, performance testing, and observability. The `links_from` attribute for these services indicates how they are configured to interact with the application components, ensuring comprehensive monitoring and testing coverage.

### Application of Metadata in Stacktic

The metadata structure facilitates a declarative approach to defining and managing the application stack, allowing Stacktic to:

- Automate the deployment of services based on their defined attributes and relationships.
- Apply configuration changes and updates selectively based on service type, group, or specific attributes.
- Enforce security policies dynamically, aligned with the defined network policies and service interactions based on connectors metadata.
- Integrate operational and performance monitoring tools seamlessly into the application architecture, ensuring that all components are adequately monitored and tested.

This metadata-driven model empowers Stacktic to manage complex Kubernetes applications efficiently, ensuring that each service is configured, deployed, and maintained according to its specific requirements and relationships within the overall architecture.

###  Understanding the Templating Idea and the Open Approach

The diagram illustrates the flow and interaction between Stacktic and the customer, showcasing how the templating system works and emphasizing the open approach Stacktic takes to integrate and manage various components.

## Templating System

### UI (User Interface)
- **Function**: The UI is the design interface where users interact with Stacktic to set up their application stack. Users can specify configurations, select components, and design their application's topology.
- **Process**: When users create or modify their stack through the UI, the details are captured and stored in a structured format.

### Database
- **Function**: The database stores UI components, metadata, and their relationships, including links, attributes, and configurations.
- **Process**: Upon submission by the user, the database generates templating metadata (e.g., Cookiecutter YAML) based on the input provided through the UI. This metadata is used to facilitate the creation of templates according to predefined rules and logic.

### Metadata
- **Function**: Metadata acts as a blueprint that defines the structure and components of the application stack. It includes specifications for service connections, attribute definitions, and other essential elements.
- **Process**: The metadata is generated automatically based on the user’s input and is used by the stack generator to create the necessary configurations.

### Stack Generator
- **Function**: The stack generator converts the templating metadata into a functional configuration within the customer's GitHub repository.
- **Process**: It processes the metadata, templates the configurations, and pushes the refined code directly into the target repository, ensuring that the deployment is ready for production.

## Open Approach

### Integration with Open Source
- **Adding Open Source**: Users can integrate their own open-source frameworks or third-party templates into the Stacktic environment. This allows for a broad range of customization and the ability to leverage existing solutions.
- **Customer Templates**: Users can define and customize their own UI elements, connectors, properties, and logic, linking them to personal templates for a tailored platform that meets specific project requirements.

### Custom Repository
- **Function**: Acts as a repository where users can add and manage their custom templates and configurations.
- **Process**: When users submit their application design through the UI, the stack generator processes this information and pushes it into the custom repository. This repository can include predefined templates designed for various application types and configurations.

### App Target Repository
- **Function**: Serves as the destination for the generated templates and configurations.
- **Process**: Templates are initially pushed to a specific branch (named stacktic by default) in the target repository. These templates are later merged into the main branch, where the production code resides, ensuring seamless integration and deployment.

## Key Benefits

- **Flexibility**: The dual-layer templating (for Helm charts and source code) allows for full flexibility and modularity, leveraging both values.yaml and kustomization for production environments.
- **Automation**: Automates the generation of necessary configurations, reducing manual effort and minimizing errors.
- **Customization**: Supports extensive customization, enabling users to tailor their platform to their specific needs.
- **Open Integration**: Encourages the use of open-source tools and frameworks, providing a versatile and adaptable solution for various application types.

 
 ![alt text](image-8.png)
 
