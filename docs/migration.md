---
sidebar_position: 6
hide_table_of_contents: true
---

# Migration

## Scope

While creating a new application in Stacktic is simplified with drag-and-drop functionality, migrating an existing application requires a different approach. There are a few options to consider for migration, and we will discuss two of them:

### Option 1: Using the "External Code" Service

The "External Code" service simplifies migration by pointing to a source code repository and automatically templating the source code into Kubernetes as part of the stack. It also provides generic connectivity, such as KONG Ingress.

#### Steps:

1. **Set Up External Code Service**: Configure the service to point to your existing source code repository.
2. **Automate Templating**: Stacktic will automatically template the source code into Kubernetes configurations.
3. **Establish Generic Connectivity**: Automatic setup of components like KONG Ingress for managing API traffic.
4. **Customize Links and Components**: If you need to link to data or other components, you will have to customize the connections by adding a link in the component and templating the conditions in the template folder.

![alt text](image-2.png)

### Option 2: Creating New Components Pointing to Your Repository

Another approach is to create new components that point to your repository and copy your existing source code into these components.

#### Steps:

1. **Create New Template**: Start by copying an existing source code template.
2. **Modify Template**: Adjust the template to point to your repository.
3. **Copy Existing Source Code**: Copy your existing source code into the `src` folder of the new template.
4. **Customize Configuration**: Modify configurations as necessary to ensure compatibility with Stacktic.

By following these methods, you can effectively migrate your existing applications to the Stacktic platform, leveraging its automation and operational efficiency features.
