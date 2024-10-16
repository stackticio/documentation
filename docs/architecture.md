---
sidebar_position: 4
hide_table_of_contents: true
---

# Architecture

The architecture and approach of Stacktic reflect a deep commitment to security, data privacy, and operational efficiency. Here's a breakdown of its key architectural components and methodologies:

## Security and Data Concerns

Stacktic operates as a stack generator, not as an operator or agent within your infrastructure. This means it requires only basic credentials to initialize an empty repository and registry, without storing any personal information or code. The platform provides the application's skeleton, allowing you to write or migrate your code without concern for underlying complexities.

## Relation with the Repository

Stacktic actively manages and updates versions, dependencies, connections, and services to ensure your stack remains current. It accomplishes this by creating new branches for these updates, giving you the option to merge these changes or ignore them if upgrades are not desired at the moment.

This example highlights the overall workflow. The user begins by entering initial information, such as registry details and Git credentials for a dedicated project repository. They then specify a branch for Stacktic updates, utilizing "main" for their code. The user integrates all initial design code in the first merge, followed by subsequent merges for changes, updates, and modifications on day two.

![img_23.png](img_23.png)

## Repository Structure

The repository structure maintained by Stacktic follows a consistent format, leveraging the strengths of both Helm charts and Kustomize for maximum flexibility and maintainability:

- **Helm Chart Templating**: Used for creating YAML files, offering dynamic configuration capabilities.
- **Kustomize Control**: Provides overlays to manage different environments or configurations, enhancing Helm's templating.
- **Deployment and Build Directories**: Located under `k8s/deploy` for deployment configurations and `k8s/build` for build processes, respectively.
- **Documentation and Source Code**: Placed at the root level for easy access and modification.

## Templating Structure

Stacktic uses Cookiecutter for templating, dynamically injecting variables and logic based on UI inputs into the configuration files:

- **Cookiecutter Structure**: Consists of `cookiecutter.json` for defining variables, hooks for pre and post-generation operations, and templates for the actual files and configurations.
- **Example Structure**: The provided example demonstrates how a typical Stacktic template (e.g., for MinIO) is organized, including documentation, Helm chart for YAML generation, Kubernetes deployment configurations with base and overlays, and validation scripts.

This architecture ensures that Stacktic is not only flexible and powerful but also secure and easy to integrate into your CI/CD workflows. By combining the best features of Helm and Kustomize with the dynamic templating capabilities of Cookiecutter, Stacktic delivers a robust foundation for deploying and managing Kubernetes applications with ease.

### Example Repository Structure

```plaintext
├── doc/
|   ├── stacktic
|   |   └── README.md
|   └── component-1
|   |   └── README.md
|   └── ...
└── k8s/
|   ├── build/
|   |   └── base/
|   |   |   └── stacktic
|   |   |   └── component-1
|   |   |   └── ...
|   |   └── overlays/
|   |   |   └── dev/
|   |   |   |   └── stacktic
|   |   |   |   └── component-1
|   |   |   |   └── ...
|   ├── deploy/
|   |   └── base/
|   |   |   └── stacktic
|   |   |   └── component-1
|   |   |   └── ...
|   |   └── overlays/
|   |   |   └── dev/
|   |   |   |   └── stacktic
|   |   |   |   └── component-1
|   |   |   |   └── ...
├── scripts/
|   └── stacktic/
|   |   └── validate-all.sh
|   |   └── ...
|   └── component-1/
|   |   └── validate.sh
|   └── ...
├── component-1
|   └── ...
└── ...
```


## Metadata and Logic

Understanding the metadata structure and its use within Stacktic involves analyzing how services are defined, interconnected, and how their characteristics dictate their deployment and interaction within a Kubernetes environment. This detailed explanation aims to clarify the underlying mechanisms of Stacktic's metadata-driven architecture, focusing on service categorization, connectors, and the management of configurations and policies.

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
 