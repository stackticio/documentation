---
sidebar_position: 2
hide_table_of_contents: true
---

# Core Concepts

This section outlines topics and terms necessary for a comprehensive understanding of our stack. The required depth of knowledge varies based on the user's role and team association.

## Templating and Tools Used in Our Platform

- **Kustomization**: Our template structure leverages the Kustomization standard, enabling efficient management and customization of Kubernetes resources. [Learn more about Kustomization](https://kubectl.docs.kubernetes.io/references/kustomize/kustomization/).
- **Helm Chart**: We use Helm charts to template YAML, which is then managed by Kustomization. This requires an understanding of Helm's overlays, bases, and features. [Helm Documentation](https://helm.sh/docs/).
- **Cookiecutter**: Cookiecutter serves as our framework for templating logic and UI conditions, streamlining code customization. [Cookiecutter GitHub](https://github.com/cookiecutter/cookiecutter).
- **Frameworks**: Developers should be familiar with dockerizing processes, managing dependencies, and defining APIs to customize their source code effectively.
- **Kaniko**: We utilize Kaniko for the build process, facilitating container image builds in a Kubernetes cluster. [Kaniko Project](https://github.com/GoogleContainerTools/kaniko).

## Terms and Processes

- **GitOps (ArgoCD)**: The GitOps methodology, particularly using tools like Argo Workflow and ArgoCD, is central to our CI/CD processes. [ArgoCD User Guide](https://argo-cd.readthedocs.io/).
- **CI/CD**: Knowledge of Continuous Integration and Continuous Deployment (CI/CD) concepts and tools is essential for automation and streamlined development. [CI/CD Introduction](https://www.redhat.com/en/topics/devops/what-is-ci-cd).
- **Policies**: Understanding how to enforce policies using tools like OPA Gatekeeper or native Kubernetes RBAC is crucial for maintaining secure and compliant configurations. [OPA Gatekeeper](https://open-policy-agent.github.io/gatekeeper/website/docs/).
- **Load and Performance Testing Methodologies (k6)**: Familiarity with load testing and performance measurement methodologies, particularly using tools like k6. [k6 Documentation](https://k6.io/docs/).
- **Observability**: Comprehensive knowledge of observability components like Prometheus for monitoring and Grafana for dashboarding is necessary for system health and performance tracking. [Prometheus](https://prometheus.io/), [Grafana](https://grafana.com/).
- **Object Storage**: Understanding the role and implementation of object storage solutions, like MinIO, in applications. [MinIO Quickstart Guide](https://docs.min.io/).
- **API Management**: Insights into API management, including API gateways like Kong and Ingress controllers, are key for managing external and internal service interactions. [Kong API Gateway](https://konghq.com/kong/), [Kubernetes Ingress](https://kubernetes.io/docs/concepts/services-networking/ingress/).
- **Kubernetes Resources**: A solid grasp of Kubernetes resources such as ConfigMaps, Secrets, and the fundamentals of Kubernetes architecture is indispensable. [Kubernetes Basics](https://kubernetes.io/docs/tutorials/kubernetes-basics/).
