---
sidebar_position: 1
hide_table_of_contents: true
---

# What is Stacktic?

Stacktic is a **stack generator platform** engineered to simplify the development and operation of modern applications. Utilizing metadata and a logic engine, Stacktic automates the generation of configurations for a diverse array of open-source frameworks and tools. This automation facilitates the creation of a GitHub repository tailored to your project's needs, encompassing everything from build processes and APIs to infrastructure and security considerations.

Beyond being merely a design tool, Stacktic provides a robust suite of features for "Day 2" operations, including versioning and comprehensive management capabilities. At the heart of Stacktic's philosophy is a commitment to **zero vendor lock-in**, with a foundation built entirely on open-source technologies. These technologies are not only selected and integrated for their stability and reliability but are also customizable by users, enhancing flexibility through logical parameters.

The platform empowers users with a self-service engine, enabling the addition, customization, and seamless control of their tooling. This flexibility ensures Stacktic's integration with virtually any desired tool or technology.

In essence, Stacktic offers an end-to-end (E2E) solution for the design, operation, and security of advanced applications on Kubernetes. This comprehensive approach is designed to maximize efficiency, results, and quality with minimal effort. Stacktic ensures that users can not only deploy but also effectively manage and secure their applications, establishing it as a comprehensive platform for the development of modern applications.

The goal of Stacktic is to transform months of development work into results achievable in seconds, all while maintaining as much generality and flexibility as possible.

![img_20.png](img_20.png)

## Why Stacktic?

For those aiming to build advanced application stacks for Kubernetes efficiently, Stacktic offers a streamlined solution. By combining logic and metadata, Stacktic automates the complex process of designing, operating, and securing applications. This approach minimizes the need for extensive time, resources, and costs typically associated with such endeavors. Stacktic simplifies the entire lifecycle, from initial design and daily operations to integrating robust security practices, making it an indispensable tool for modern application development on Kubernetes.

## Who Should Use Stacktic?

- **Migration-Ready Companies**: Ideal for businesses looking to transition their managed services to Kubernetes swiftly with minimal effort and Kubernetes expertise.
- **Kubernetes Veterans**: Companies already on Kubernetes wishing to enhance their stack and security while streamlining operations. Stacktic offers features like secret management, versioning, updates, and auditing to elevate stack quality and ease of operation.
- **B2B Customers**: Those aiming to containerize their applications into an enterprise-grade production stack for their clients.
- **Resource-Conscious Small Companies**: Perfect for smaller businesses lacking the budget for Kubernetes experts or a large DevOps team.
- **Large Enterprises**: Suitable for big organizations with numerous applications, seeking an application factory platform to optimize costs and boost revenue.

## How Stacktic Works

Stacktic simplifies the process of designing and deploying applications on Kubernetes through an intuitive, metadata-driven approach. Here’s a concise overview of how it functions:

### Initialization

Start by setting up the initial configuration, which includes specifying registry and repository target credentials. This foundational step ensures Stacktic can interact with your development and deployment environments.

### Design

The user interface (UI) facilitates a drag-and-drop approach to application design. Services are categorized for easy selection, allowing users to integrate various components seamlessly into their project.

### Customization and Connectivity

- **Service Properties**: By clicking on a service, users can modify generic values through a properties panel, tailoring each service to their specific needs.
- **Connectivity Properties**: When linking services, additional properties related to the connection (such as secrets, database configurations, etc.) become available, enabling detailed customization of inter-service communication.

### Behind the Scene

- **Metadata and Logic**: Once the design is saved, Stacktic generates metadata that, upon submission, is translated into a fully configured GitHub repository. The platform employs logic based on conditions and loops to ensure the generated repository matches the designed application stack precisely.
- **Dynamic Updates**: Any changes made in the design are dynamically reflected in the repository, from secrets to documentation, ensuring the repository evolves alongside the application design.
- **Tooling and Structure**: Stacktic leverages a combination of Kustomize and Helm templates to offer flexibility and ease of operation. This approach allows for extensive customization and simplifies deployment processes.
- **Build and Deployment**: The build process is powered by Kaniko, ensuring compatibility and efficiency. Installation is streamlined into a simple two-step process—build backend services and deploy the full overlay (K8s deployment) —minimizing the complexity of deploying to Kubernetes.
- **Automation and Validation**: Stacktic incorporates extensive logic, including pre and post-automation scripts tailored to the components and design of your stack. This includes everything from Day 2 automation scripts that enhance your stack's operation to validation processes ensuring everything is configured correctly.

### High-Level Flow of Stacktic System

The Stacktic system streamlines the application setup process, from initial design to deployment, ensuring efficiency and flexibility. Here’s a high-level overview of the flow:

1. **Our Templates**:
   - **Description**: Start with our predefined templates designed for various application types and configurations. These templates offer a broad starting point tailored to meet diverse development needs.

2. **User Design App**:
   - **Description**: Users design their applications using the Stacktic interface. This involves specifying essential options such as service connections, attribute definitions, dependency management, secret configurations, and database settings.

3. **Logic Engine**:
   - **Description**: Upon saving the design, the logic engine activates. It translates the saved design into a structured database that reflects the specified components and their interactions. This engine processes the metadata, preparing it for further actions.

4. **Data Layer**:
   - **Description**: The SQL database stores UI components and their relationships in PostgreSQL, including links, components, and attributes. Upon user submission, the system generates the templating metadata (Cookiecutter YAML) from the database. This allows conditions in the template repository to access the metadata, facilitating the creation of templates according to the rules and logic defined within the template.

5. **Stack Generator**:
   - **Description**: Converts the metadata configuration into the customer's GitHub repository. This process involves stripping all conditions from our templates and pushing the refined code directly into the repository.

6. **Target Repository**:
   - **Description**: Acts as the destination for the generated templates. The templates are initially pushed to a specific branch (stacktic) and later merged into the main branch where the production code resides.

7. **Customer Templates**:
   - **Description**: Allows users to integrate their own open-source frameworks or third-party templates into the Stacktic environment, extending the customization possibilities beyond our default offerings.

8. **Customize UI DB**:
   - **Description**: Users can define their own UI elements, including components, connectors, properties, and logic. These elements can be linked to their personal templates, enabling a fully customized platform tailored to specific project requirements.

![alt text](image-4.png)
