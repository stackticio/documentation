---
sidebar_position: 6
hide_table_of_contents: true
---

# Self-Service Capabilities

## Introduction

The Self-Service feature of Stacktic epitomizes the platform's commitment to flexibility and user empowerment. This core functionality is ingeniously designed to allow users to build and customize their automated services directly within our user interface (UI). By understanding that every customer's environment is unique and it's virtually impossible to cover 100% of application components out-of-the-box, the self-service capability grants you the freedom to tailor your environment to your precise requirements. This means you can add services, define how their properties will look, and determine which connectors will link to which services, all from within the Stacktic UI.

## Logic and Workflow

The essence of Stacktic's self-service lies in its ability to let you create a dedicated repository for templating. This involves crafting templates with the specific logic and conditions you require, for which we only need read permissions in a fork-style approach to template your template into the target repository alongside your code. Thus, your template is managed separately from our template repository, ensuring a clear distinction and independence in your customization efforts.

![img_24.png](img_24.png)
### Understanding the Structure of Templating

The structure of the templating repository is straightforward yet powerful. It is designed to enable a high degree of customization while maintaining simplicity in management. Here's an overview of how to navigate and utilize this structure effectively:

#### Basic Structure Overview
- **cookiecutter.json: represnt the version and metadata of the component 
- **Hooks Folder**: This contains the pre and post scripts, which are optional but can significantly enhance the templating process (optional).
- **Project Slug**: Everything behind the `{{cookiecutter.project_slug}}` is subject to templating. This is where you place the Dockerfile, dependencies, and Kubernetes deployment configurations.

Example structure with source code:

```plaintext
stacktic-templates/nodejs
├── cookiecutter.json
├── hooks
│   ├── post_gen_project.py
│   └── pre_gen_project.py
└── {{cookiecutter.project_slug}}
    ├── Dockerfile
    ├── k8s
    │   ├── build
    │   │   ├── base
    │   │   │   ├── kaniko.yaml
    │   │   │   └── kustomization.yaml
    │   │   └── overlays
    │   │       └── dev
    │   │           └── kustomization.yaml
    │   └── deploy
    │       ├── base
    │       │   ├── config
    │       │   │   └── cloud.env
    │       │   ├── cors.yaml
    │       │   ├── kustomization.yaml
    │       │   ├── namespace.yaml
    │       │   ├── network-policy.yaml
    │       │   ├── service-name-deployment.yaml
    │       │   └── secret
    │       │       └── registry.json
    │       └── overlays
    │           └── dev
    │               └── kustomization.yaml
    ├── package-lock.json
    ├── package.json
    ├── scripts
    │   └── validate.sh
    └── src
```
Example structure with helm:

```plaintext
stacktic-templates/minio
├── cookiecutter.json
├── hooks
│   ├── post_gen_project.py
│   └── pre_gen_project.py
└── {{cookiecutter.project_slug}}
    ├── doc
    │   └── README.md
    ├── helm
    │   ├── generate-yaml.sh
    │   └── helm-values.yaml
    ├── k8s
    │   └── deploy
    │       ├── base
    │       │   ├── kustomization.yaml
    │       │   ├── minio-client.yaml
    │       │   ├── namespace.yaml
    │       │   ├── network-policy.yaml
    │       │   └── secret
    │       │       └── minio.env
    │       └── overlays
    │           └── dev
    │               └── kustomization.yaml
    └── scripts
        └── validate.sh
```

## Integration of Template to UI

Integrating templating with the Stacktic UI enhances the platform's flexibility and user-friendliness by allowing for the creation and customization of components and properties directly within the UI. This section will guide you through the process of leveraging templates to enhance UI functionality.

### Principles of UI Templating

The principle of UI templating within Stacktic is straightforward yet powerful. It provides the flexibility to define any property you need, such as toggle buttons, text fields, or parameters. This capability allows for extensive customization and control over the behavior of your services. For example, a basic application of this is specifying a namespace in `helm values.yaml` or `kustomization.yaml`:

for example enabling a feature based on a toggle condition:
```yaml
{%- if cookiecutter.component.attributes.network_policy %}
- network-policy.yaml
{%- endif %}
```

## Creating and Configuring Components
To start creating and configuring components in Stacktic, follow these steps:

Define a Token for the Template Repository: Initially, define a token for accessing your template repository.
Create a Component: Navigate to the components page and create a new component. You will need to provide the following information:

- **Technical ID: this is represent the foder name on git. 
- **Label: Component label (e.g., My Awesome Starter)
- **Description: Component description, displayed on the System design page. (optional)
- **Group: which group the components will exist in the UI
- **Family: Component family in the System design page.
- 
![img_30.png](img_30.png)

- **Authentication: (If applicable)
- **Logo Url: the Logo of the serivce reccomended in svg format for best positioning
- **Attributes: add component attributes that you need to manage the component
- **Links To: add "links to" attributes for customizing the properties of the links
![img_31.png](img_31.png)
- **Links From: add "links from" attributes for customizing the properties of the links
- **Git Url: Git URL of the component template (in this format: https://github.com/beeNotice/stacktic-templates.git)
- **Git Branch: Branch to push the System 
- **Personal Access Token: choose the token you you defined for the templating (read-only permissions).
- **Multi Module: Specify if the Git hosting is a multi-module project.
  https://cookiecutter.readthedocs.io/en/2.6.0/advanced/directories.html

directory1-name/ and directory2-name/ is example of Multi Module.
```
https://github.com/user/repo-name.git
    ├── directory1-name/
    |   ├── {{cookiecutter.project_slug}}/
    |   └── cookiecutter.json
    └── directory2-name/
        ├── {{cookiecutter.project_slug}}/
        └── cookiecutter.json
```
## Customization Logic for Attributes

When considering the customization of links or components within Stacktic, it's crucial to focus on the desired generic automation outcomes you aim to achieve. This section will delve into how to conceptualize and implement these customizations effectively, using attributes to facilitate connections and functionalities between different parts of your application.

### Conceptualizing Customization

The starting point for any customization is understanding the automation you wish to achieve. For instance:

- **Linking Backend to Data Components:** Typically involves automation around secrets, application users, and databases. The goal is to ensure secure and efficient communication between your application's backend and its data layers.
- **Enhancing Functionality for Components like Kong:** Might include enabling features such as Cross-Origin Resource Sharing (CORS) or rate limiting. These functionalities are crucial for managing how your services interact with external requests and controlling access.

With a clear vision of the automation goals, you can proceed to the practical aspect of implementing these customizations through attributes.

### Adding and Configuring Attributes

Attributes serve as the backbone of customization in Stacktic, acting as variables within our system that can be linked to various configurations and conditions. Whether it's a toggle button or a text field, each attribute represents a variable that can be associated with specific configurations, such as parameters in `values.yaml`, `kustomization.yaml`, or conditions in a `ConfigMap`.

#### Steps to Add New Attributes

1. **Navigate to the Attribute Tab:** Here, you can add new attributes in addition to the existing ones predefined in the system.
2. **Choose the Attribute Type:** It's essential to select the appropriate type for your attribute, which could be a text box, a toggle for true/false values, etc. This choice will determine how the attribute is presented and interacted with in the UI.

#### Associating Attributes with Configurations

Once an attribute is created, the next step is to associate it with the necessary configurations to activate the intended functionality. This could involve:

- **Parameters in Helm's `values.yaml`:** Associating attributes with specific parameters to control the deployment configurations of your Helm charts.
- **Kustomization Customizations:** Linking attributes to elements in `kustomization.yaml` for dynamic customization based on the attribute's state.
- **Conditions in ConfigMaps:** Utilizing attributes to conditionally apply configurations within ConfigMaps, enabling or disabling features based on the attribute's value.

### Practical Example

Consider an attribute designed to toggle CORS functionality for a Kong component. This attribute, once associated with the corresponding conditional logic in a ConfigMap or `kustomization.yaml`, can dynamically enable or disable CORS based on user input.

```yaml
{%- if cookiecutter.component.attributes.enable_cors %}
- cors.yaml
{%- endif %}
```


### Simplify Your Setup with Ready Templates
No need to start from scratch or reinvent the wheel. Leverage our ready-to-use templates to kickstart your project. Simply copy and modify them to suit your needs. If you're integrating new source code, you'll find that adapting an existing template often suffices, as the structure typically remains consistent.

### How We Enhance Source Code Integration:
We dynamically adjust package.json and requirements.txt for Dockerfile configurations based on the linked components.
We automate API construction and generate providers for seamless authentication and connectivity.
Explore the customization chapter for detailed examples and guidance.

### For Non-Source Code Projects:
  
The process is even simpler. Utilizing our templates, you'll notice a familiar structure across projects. We employ Helm templates to generate YAML files, then refine ConfigMaps and Secrets using kustomization techniques.