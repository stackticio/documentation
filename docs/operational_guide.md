---
sidebar_position: 5
hide_table_of_contents: true
---

# Operational Guide

The operational guide for architects utilizing Stacktic delineates a streamlined process from application design to deployment, emphasizing the efficiency and flexibility of the platform. Stacktic enables architects to rapidly prototype, test, and iterate on application designs, drastically reducing the development lifecycle from months to minutes. This guide outlines the approach to designing applications, the automatic configuration capabilities of Stacktic, and an example application scenario to illustrate its practical application.

## Phase 1: Application Design Process (Application Architect)
- **Rapid Prototyping**: Architects can bring designs to deployment in minutes, a significant improvement over traditional methods that could take months. This capability allows for quick iteration and refinement of application architecture.
- **Simplified Configuration**: During the design phase, there's no need to delve into specific configurations beyond the topology. Stacktic works with default variables, which can be adjusted later as required.
- **Automatic Configurations**: Connecting components like the backend to Kong Ingress or enabling network policies triggers Stacktic to automatically set up necessary configurations, such as SSL certificates via Let's Encrypt or segmenting network policies, without manual intervention.

### Focus Areas for Architects

Architects are expected to concentrate on designing the core functional components of the application—data services, backend logic, and frontend presentation—while Stacktic handles the operational and infrastructure aspects. This focus allows architects to prioritize application logic and user experience.

### Example Use Case: E-commerce Platform

An e-commerce platform serves as an exemplary use case for Stacktic, illustrating how various technologies can be combined to create a robust, scalable application:

- **Backend Logic with Python**: Manages payment processing, order management, and other server-side logic.
- **Real-time Notifications with Node.js**: Handles real-time communication with users about orders and promotions.
- **Data Storage with PostgreSQL**: Stores structured data such as user profiles, product catalogs, and orders.
- **Flexible Data Handling with MongoDB**: Manages unstructured or semi-structured data like product reviews and user sessions.
- **Service Decoupling with RabbitMQ**: Facilitates asynchronous tasks such as email notifications and payment processing.
- **Dynamic Frontend with React**: Creates a responsive and interactive user interface for the e-commerce platform.

#### E-commerce Application Base Design with Stacktic

In designing the foundational topology for an e-commerce application using Stacktic, the approach emphasizes both operational efficiency and the automatic provisioning of essential services. This design integrates core and infrastructure components crucial for a robust e-commerce platform while employing Stacktic's automation for streamlined deployment and management. A special component, cert-manager, is included to enhance security without complicating the architecture with excessive connections.

![img_6.png](img_6.png)

### Infrastructure and Security Components:

- **Kong API Gateway**: Routes requests to appropriate services, managing authentication and other cross-cutting concerns.
- **Cert-manager**: Automatically handles SSL certificate issuance for endpoints routed through Kong, ensuring secure communications. This component operates independently, simplifying the architecture by avoiding direct connections to other services.

## Let's Start

First, let's build our stack.

![img_7.png](img_7.png)

To initiate the deployment process, use the following Kubernetes command to create resources based on the Kustomize configuration:

```plaintext
kubectl create -k stacktic-output/system/1/k8s/build/overlays/dev

kubectl get pods -n build
NAME                  READY   STATUS      RESTARTS   AGE
nodejs-kaniko-h9kzw   0/1     Completed   0          2m18s
python-kaniko-xnr99   0/1     Completed   0          2m18s
react-kaniko-9np5b    0/1     Completed   0          2m18s

kubectl apply -k stacktic-output/system/1/k8s/deploy/overlays/dev --server-side=true --force-conflicts=true

assafsauer@Assafs-MacBook-Pro workspaces % kubectl get pods -A | grep -v kube-system
NAMESPACE      NAME                                                  READY   STATUS      RESTARTS   AGE
build          nodejs-kaniko-h9kzw                                   0/1     Completed   0          3m47s
build          python-kaniko-xnr99                                   0/1     Completed   0          3m47s
build          react-kaniko-9np5b                                    0/1     Completed   0          3m47s
cert-manager   cert-manager-7cc868b744-p4bwv                         1/1     Running     0          53s
cert-manager   cert-manager-cainjector-f7f5bf74-rrxjw                1/1     Running     0          53s
cert-manager   cert-manager-startupapicheck-pk6px                    0/1     Completed   0          50s
cert-manager   cert-manager-webhook-b9655d4f4-bjqbr                  1/1     Running     0          52s
kong           kong-7b8b9fbd46-bghwl                                 1/2     Running     0          52s
kong           kong-7b8b9fbd46-zrpjd                                 2/2     Running     0          52s
kong           kong-migrate-d9jxk                                    0/1     Completed   0          50s
kong           kong-postgresql-0                                     1/1     Running     0          51s
mongodb        mongodb-dcf978cd9-d62vv                               1/1     Running     0          52s
mongodb        python-mongodb-create-collection-job-885bs            0/1     Completed   0          49s
nodejs         nodejs-6bfd6b5fbd-z22mh                               0/1     Running     0          51s
postgresql     postgresql-0                                          1/1     Running     0          50s
python         python-b987dbd64-tf2hf                                1/1     Running     0          51s
rabbitmq       rabbitmq-0                                            1/1     Running     0          50s
react          react-7756cf9449-wd5pz                                1/1     Running     0          51s

kubectl get svc kong -n kong
NAME   TYPE           CLUSTER-IP    EXTERNAL-IP     PORT(S)                      AGE
kong   LoadBalancer   10.64.5.164   34.82.132.209   80:32681/TCP,443:31612/TCP   10m

  curl -ks https://python.sauer.source-lab.io/greeting
{
  "message": "Hello, welcome to the service!"
}
 curl -ks https://nodejs.sauer.source-lab.io/greeting
{"id":1,"content":"Hello from K8s, World!"}
```

The React endpoint offers a clear view of the application's key features, including API endpoints, software versions, messaging systems, and the format of data outputs. It's designed to confirm that the setup is correct and everything is in place, helping developers proceed with coding confidently.

Start Coding with Stacktic: Integration and Workflow Guide
Stacktic employs a branch-based integration approach, facilitating seamless updates and customizations to your application without disrupting the main development workflow. Here's how to effectively incorporate Stacktic's updates into your project while maintaining control over your application's core codebase.
Integrating Stacktic Updates
Stacktic pushes updates to a dedicated branch (named stacktic by default), which you specify in your configuration settings. To incorporate these updates into your project, follow these steps to merge changes from the stacktic branch into your main branch (or another branch of your choosing):

First git clone and login:
```
token=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

git remote set-url origin https://$token@github.com/assafsauer/ecommerce.git
git fetch --all
```
BUILD IN STACKTIC THEN:
```
First update local e-commerce
git checkout stacktic
git pull origin stacktic
```
Merge stacktic to main (locally)
```
git checkout main
git fetch --all
git merge origin/stacktic
git add .
git commit -m "Resolved merge conflicts between stacktc and main"
git push origin main
```

Pushing Your Code Changes
When you make changes to your code, ensure to update the main branch with your latest work. Here's how to commit and push changes to your repository:
Modify code push from main to public main
```
git checkout main
git add .
git commit -m "Updated configurations and application code"
git push origin main
```
## Phase 2: Day1 Operations (DevOps/SREs)

After outlining the basic design of the application, we shift focus to Day 2 operations. Simply deploying an application is not the end goal; it's also about managing monitoring, security, policies, scaling, and more. Here, we'll explore how we automate these Day 2 operations to ensure the application is production-ready.

### Observability Enhancement

#### Integrating Observability Tools

We've enriched the stack with key observability components: Loki for log aggregation, Prometheus for metrics collection across services, and Grafana for visualizing those metrics.

- **Loki** automatically aggregates logs from the entire stack. It operates without direct links to services, capturing all logs by default directly from the nodes.
- **Prometheus** collects metrics from each connected service. We've enabled default metrics collection for all components. For custom applications like those written in Python, we utilize native Prometheus libraries. Further customization details are available in the repository documentation.
- **Grafana** dashboards are generated for each service to visualize the metrics collected by Prometheus. These dashboards are customizable to suit different monitoring preferences.

#### Implementing and Customizing

After integrating these services, merge and apply the changes. This process ensures that without manual configuration, you'll have a comprehensive observability setup.

By automating the addition of these observability tools, your application gains immediate access to log aggregation, metrics collection, alert management, and customizable dashboards, streamlining the transition into a fully monitored production environment.

![img_9.png](img_9.png)


Beyond integrating tools and open-source solutions, you can modify your architecture to enable blue-green deployment. This involves setting up a duplicate environment with the same source code backend, using the same production storage, and managed under the same API Gateway. Simply adjust identifiers, such as switching to dev_namespace, to test new versions in a separate environment within the same cluster.

![img_8.png](img_8.png)

## Navigating Day 2 Operations: Beyond Initial Setup

For the moment, you can overlook configurations such as secrets and feature enablements and stick with the defaults. We've observed some examples of observability. However, certain services don't require connections due to two main reasons:

- Some impact the entire stack, like GitOps or log aggregation, requiring too many connections.
- Others are relevant only for Day 2 operations and aren't needed for initial deployment, such as autoscaling and security policies, which are essential for production but not for development.

Take CI/CD and GitOps, for example. With ArgoCD (GitOps) and Argo Workflows (CI), these components don't need to be directly linked to other services. GitOps is applied automatically across all components, reducing the need for extensive linking. Argo Workflows, in turn, automatically creates CI processes, but only for backend services (source code), based on the stack's metadata.

Leaving the GitOps feature enabled means it will automatically apply configurations across each component in the stack. If disabled, you can opt to implement it later; the necessary YAML will be available in the Day 2 folder.

As for Argo Workflows, it automates various types of CI processes, with or without scanning. It isn't enabled by default since CI customization may be desired at the initial stages.

![img_11.png](img_11.png)

## Phase 3: Security Implementation (DevSecOps)

### Introduction

In Phase 2, our focus shifts to integrating comprehensive security measures within our development stack. Leveraging the power of metadata, we automate the configuration and policy enforcement to bolster security across the board. This automation not only streamlines security practices but also aids in meeting compliance requirements seamlessly.

### Features Overview

Our platform supports a variety of features designed to enhance security and ensure compliance with minimal manual intervention. While it's challenging to map each feature to specific compliance sections directly, the following overview provides insight into the out-of-the-box (OOTB) capabilities that are automated for your convenience:

#### Open Policy Agent (OPA)

- **Custom Policy Tuning**: OPA serves as a flexible component allowing for the tuning of policies to meet specific compliance needs.
- **Policy Library**: A comprehensive list of pre-defined policies is available, with the flexibility for customers to extend or create their own, leveraging our metadata and logic engine for automation.

#### Security Properties examples:

- **Network Policies**: A simple toggle enables network policies for backend and data components, restricting communication to specified ingress or egress paths and essential platform components. This includes automatic access configurations, like for ArgoCD, and conditions to prevent unauthorized namespace or pod communications.
- **CORS and Rate Limiting**: Toggles are available for enabling Cross-Origin Resource Sharing (CORS) and rate limiting, enhancing security at the communication level.
- **Secrets Management**: Secure communication between components through encrypted secrets, ensuring data protection.

#### Standard Operating Procedures (SOPs):

- **Encryption**: SOPs mechanism encrypts all secrets within the stack. Users can add SOPs keys and decrypt secrets locally post-stack generation.
- **E2E Integration**: The SOPs feature integrates end-to-end, including components like ArgoCD, automating the necessary plugins for decryption with private keys.

#### Additional Components:

- **OPA**: Policy enforcement for specific compliance requirements.
- **Cert-manager**: Automates certificate issuance and renewal processes.
- **Keycloak**: Manages authentication across services.
- **Istio**: Provides a secure service mesh for inter-service communication.
- **Alertmanager**: Configures alerts based on queries for real-time monitoring.
- **K6**: Facilitates testing and validation of services.

### Audit and Compliance

Each stack includes an audit section where users can view detailed information about enabled security features, compliance status, and other relevant security metrics. This section aims to provide transparency and insight into the security posture of the stack.

## Phase 4: Day 2 Operation and Development Flow

### Starting Development

Developers are enabled to begin their work immediately by utilizing the main branch. Stacktic always pushes to the `stacktic` branch, and developers code on the `main` branch.

First, they merge all changes from the `stacktic` branch into the `main` branch and then start coding. When DevOps or SecOps teams make updates such as changing security settings, adding components, or versioning, the developer just needs to merge the changes from the `stacktic` branch into the `main` branch if they think it is needed.

This is a secure and efficient way of implementing changes in the stack, ensuring that the latest improvements and security updates are easily integrated into the development workflow.
