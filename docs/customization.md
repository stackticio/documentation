---
sidebar_position: 6
hide_table_of_contents: true
---

# Logic and Customization:

# Customization

## Introduction

Stacktic stands as a beacon of openness and customization in the cloud-native landscape. At its core, Stacktic champions declarative automation, streamlining the orchestration of services and infrastructure in cloud-native environments. This chapter delves into the foundational logic and extensive customization options Stacktic offers, setting the stage for you to tailor your environment to meet your unique needs.

## The Essence of Customization

Stacktic's platform is built on the principle that every environment is unique. To this end, we offer comprehensive tools and methodologies to modify and customize existing services. Understanding the logic behind these customization options is crucial, providing you with the knowledge needed to navigate the self-service features discussed in the following chapter, which focuses on building your services from the ground up.

## UI-Driven Metadata Management

At the heart of Stacktic's customization capabilities is its UI, designed to collect and manage metadata for centralized management of your full stack. Each UI element, from buttons to input fields, is tied to specific logic or conditions. These are primarily managed through the cookiecutter language, our chosen templating agent due to its open-source nature and flexibility in templating code and configurations.

## Templating with Cookiecutter

Cookiecutter plays a pivotal role in Stacktic's customization framework. By embedding conditions marked by double parentheses `(( ))` within the code, you can template your Stacktic stack submission. This approach allows for dynamic templating based on defined conditions or variables, with the cookiecutter code disappearing once it templates the target repository.

## Dedicated Repository for Templating

We utilize a dedicated repository filled with cookiecutter code to trigger the customization of the final repository—your target repository. This process ensures that every aspect of your Stacktic stack, from the infrastructure components to the application code, is precisely tailored to your requirements.

## Structure and Customization

The structure of your templated project is critical. We template everything after the folder `{{cookiecutter.project_slug}}`, which contains all relevant folders for your target repository. This structure remains consistent whether you're using helm chart components or source code with Dockerfile and code. However, customization options may vary, especially with source code, where you might wish to customize the source itself in addition to Kubernetes elements.

## Understanding Our Customization Structure

Our platform's customization framework is designed with flexibility and automation at its core. Below, we illustrate the structure we employ for helm chart customization, which exemplifies our approach to simplifying and automating the deployment process.

### Automation Scripts: `pre_gen_project.py` and `post_gen_project.py`

At the heart of our templating process lie two crucial automation scripts: `pre_gen_project.py` and `post_gen_project.py`. Positioned strategically before the templating folder `{{cookiecutter.project_slug}}`, these scripts serve as the automation's vanguard and rearguard. They are executed before and after the templating process, respectively.

- **Pre-Templating Automation**: The `pre_gen_project.py` script is our tool for setting up the environment, enforcing rules, and ensuring all prerequisites are met before the templating begins.
- **Post-Templating Cleanup**: Conversely, `post_gen_project.py` focuses on cleanup activities, such as removing unnecessary files and finalizing the automation setup, essentially automating the automation itself.

### The Templating Flow

Our automation primarily targets the `values.yaml` file within the helm folder and the Kubernetes manifests, with a special focus on the `kustomization.yaml` file that orchestrates the final deployment configuration. The templating sequence is meticulously designed to ensure a seamless transition from configuration to deployment:

1. **UI Configuration**: The journey begins with the UI, where users input configurations and set the stage for the templating process.
2. **Cookiecutter Templating**: Following the UI configuration, the cookiecutter templating engine takes over, applying the specified configurations to template the project structure and content.
3. **Helm/Kustomization Processing**: Next, the focus shifts to processing the `values.yaml` for Helm charts and the `kustomization.yaml` for Kubernetes, fine-tuning the deployment specifics.
4. **Deployment Realization**: The culmination of this process is the deployment phase, where the configured and templated components are deployed to the target environment.


```
├── README.md
├── cookiecutter.json
├── hooks
│   ├── post_gen_project.py
│   └── pre_gen_project.py
├── local_extensions.py
└── {{cookiecutter.project_slug}}
    ├── doc
    │   └── README.md
    ├── helm
    │   ├── argo-cd-helm-values.yaml
    │   ├── argocd-image-updater-helm-values.yaml
    │   └── generate-yaml.sh
    └── k8s
        └── deploy
            ├── base
            │   ├── apps.yaml
            │   ├── config
            │   │   ├── decrypt-sops.sh
            │   │   └── sops-plugin.yaml
            │   ├── kustomization.yaml
            │   ├── namespace.yaml
            │   ├── network-policy.yaml
            │   ├── secret
            │   │   ├── git.env
            │   │   ├── registry.json
            │   │   └── sops-key.txt
            │   └── updater-rbac.yaml
            └── overlays
                └── dev
                    └── kustomization.yaml
```
### Source Code Customization VS HELM Chart: Similarities and Differences

While the process for source code customization mirrors the helm chart approach in its foundational steps, there are notable distinctions:

- **Direct Source Code Templating**: In source code customization, conditions and templating can be applied directly to the source code itself, allowing for more granular adjustments.
- **Kustomization Focus**: Unlike the helm chart process, source code customization relies solely on kustomization alongside deployment YAMLs, streamlining the deployment of templated code.


```
assafsauer@Assafs-MacBook-Pro workspaces % tree stacktic-templates/python  
stacktic-templates/python
├── cookiecutter.json
├── hooks
│   ├── post_gen_project.py
│   └── pre_gen_project.py
└── {{cookiecutter.project_slug}}
    ├── Dockerfile
    ├── app.py
    ├── doc
    │   ├── README.md
    │   ├── img.png
    │   └── img_1.png
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
    │       │   ├── mongodb_collector.yaml
    │       │   ├── namespace.yaml
    │       │   ├── network-policy.yaml
    │       │   ├── python.yaml
    │       │   ├── rate-limit.yaml
    │       │   └── secret
    │       │       └── registry.json
    │       └── overlays
    │           └── dev
    │               └── kustomization.yaml
    ├── requirements.txt
    └── src
        ├── __init__.py
        ├── http_rest_mongodb.py
        ├── http_rest_postgres.py
        ├── http_rest_rabbitmq.py
        ├── metrics.py
        ├── mongodb_provider.py
        ├── mongodb_utils.py
        ├── postgresql_provider.py
        ├── prometheus_provider.py
        ├── rabbitmq_provider.py
        └── sample_document.json

```
This diagram presents a high-level overview of the workflow, illustrating the sequential flow and key phases from initial UI input to the final outcome in the repository


![img_16.png](img_16.png)

Our workflow incorporates a dual-phase templating approach, utilizing both Helm charts and Kustomize. This methodology is deliberately chosen to capitalize on the strengths of each tool—merging Helm's convenient handling of templates with Kustomize's straightforward approach to customizing the final YAML outputs. This dual strategy enhances flexibility significantly, allowing us to offer customers the option to apply UI conditions directly within Helm values or through Kustomize. This hybrid approach has proven to be highly effective, providing us with the versatility needed to tailor outcomes to specific customer requirements seamlessly.

## Delving Into Templating: A Backend Component Illustration

Having established an understanding of our workflow structure, let's proceed with a hands-on example. This section focuses on the impact of a simple UI button on the templating process for a backend component. Each backend component is equipped with default variables, essential for its construction and deployment. These variables are detailed in several YAML files, including `deployment.yaml`, `kustomization.yaml`, and `kaniko.yaml` (utilized for building purposes).

### The Role of Default Variables

These default variables are tailor-made to facilitate the seamless build and deployment of the component. Embedded across various YAML configurations, they ensure the process is executed flawlessly. Although these defaults typically do not require adjustments, they exemplify our templating system's functionality.


![img_17.png](img_17.png)

### Applying Conditional Logic

Our templating mechanism integrates conditional logic to adapt to specific configurations, such as the activation or deactivation of network policies. This involves employing conditions that assess whether certain configurations should be applied, based on whether they are true or false. For instance, the decision to enable network policies is manifested through a toggle in the UI, requiring its conditional inclusion in our templates. The following code snippet illustrates this concept:


```yaml
kustomization.yaml:
{%- if cookiecutter.component.attributes.network_policy %}
- network-policy.yaml
{%- endif %}
```

## Understanding Templating: Link Properties Between Services

In this section, we delve into the templating of link properties between two services, focusing on the essential variables that facilitate these connections. Such variables often include secrets, database names, or other capabilities critical to the connector between two components. Let's explore three illustrative examples.

### Example 1: Backend Connected to RabbitMQ

Our strategy emphasizes simplicity, selecting only the most generic properties necessary for connection without burdening the configuration with excessive options. For a backend to communicate effectively with RabbitMQ, the minimal requirements include a secret, a virtual host (vhost), and a queue. Here's a look at what happens behind the scenes to establish this connection, ensuring seamless communication by focusing on these fundamental properties.

#### How It Works: Automating Connections

Behind the scenes, we use a script and configuration files to automatically set up these components. Here's a simplified overview:


**/hooks/pre_gen_project.py:** Before generating the project, we check if there's a link to RabbitMQ and update the configuration accordingly. This script ensures that if your project is linked to a RabbitMQ component, all necessary information is automatically configured.

```yaml
# Check if there is rabbitmq link
{% for component in cookiecutter.links_to.values() if component.type == "python-rabbitmq" %}
{{ cookiecutter.update({"__rabbitmq": component }) }}
{% endfor %}
```

**/k8s/deploy/base/config/cloud.env:** We define the connection details in an environment file, including host, port, user credentials, queue, and virtual host. This file is then used by the Kubernetes deployment to set up the environment variables for your application (configmap for the source code)

```yaml
{%- if cookiecutter.__rabbitmq != '' %}
RABBIT_HOST={{ cookiecutter.__rabbitmq.component.name }}.{{ cookiecutter.__rabbitmq.component.attributes.namespace }}.svc.cluster.local
RABBIT_PORT=5672
RABBIT_USER={{ cookiecutter.__rabbitmq.attributes.username }}
RABBIT_PASSWORD={{ cookiecutter.__rabbitmq.attributes.password }}
RABBIT_QUEUE={{ cookiecutter.__rabbitmq.attributes.queue }}
RABBIT_VHOST={{ cookiecutter.__rabbitmq.attributes.vhost }}
{%- endif %}
```
**/k8s/deploy/base/kustomization.yaml:** Finally, we use a Kubernetes ConfigMap to pass the environment variables to your application, ensuring it can connect to RabbitMQ without any manual configuration needed on your part.

  ```yaml
configMapGenerator:
  - name: {{ cookiecutter.component.name }}-config
    namespace: {{ cookiecutter.component.attributes.namespace }}
    envs:
      - config/cloud.env
    options:
      disableNameSuffixHash: true
```
**/k8s/deploy/base/secret/definitions.json:**
To streamline RabbitMQ setup for Kubernetes and to define the the initial configuration (such as: vhost, secret,que..), we use a definitions.json file, configuring secrets, vhosts, and queues essential for each connection. This setup is automated through a condition that targets only the backend services (link_from.group == 'backend-broker'), ensuring a logical and secure connection to RabbitMQ.
```yaml
{
  "users": [
    {% for link_from in cookiecutter.links_from.values() if link_from.group == 'backend-broker' or link_from.type == "k6-rabbitmq" %}
    {
      "name": "{{ link_from.attributes.username }}",
      "password_hash": "{{ link_from.attributes.password | password_hash }}",
      "tags": "user"
    },
    {% endfor -%}
    {
      "name": "admin",
      "password_hash": "{{ cookiecutter.component.attributes.admin_password | password_hash }}",
      "tags": "administrator"
    }
  ],
  "permissions": [
    {% for link_from in cookiecutter.links_from.values() if link_from.group == 'backend-broker' or link_from.type == "k6-rabbitmq" %}
    {
      "user": "{{ link_from.attributes.username }}",
      "vhost": "{{ link_from.attributes.vhost }}",
      "configure": ".*",
      "write": ".*",
      "read": ".*"
    },
    {% endfor -%}
    {
      "user": "admin",
      "vhost": "/",
      "configure": ".*",
      "write": ".*",
      "read": ".*"
    }
  ],

  "vhosts": [
    {% for link_from in cookiecutter.links_from.values() if link_from.group == 'backend-broker' or link_from.type == "k6-rabbitmq" %}
    {
      "name": "{{ link_from.attributes.vhost }}"
    },
    {% endfor -%}
    {
      "name": "/"
    }
  ],
  "queues": [
    {% for link_from in cookiecutter.links_from.values() if link_from.group == 'backend-broker' or link_from.type == "k6-rabbitmq" %}
    {
      "name": "{{ link_from.attributes.queue }}",
      "vhost": "{{ link_from.attributes.vhost }}",
      "durable": true,
      "auto_delete": false,
      "arguments": {}
    }{% if not loop.last %},{% endif %}
    {% endfor %}
  ]
}
```
we use secretGenerator on the kustomzation.yaml to automaticly encrypte the config on k8s.
```yaml
secretGenerator:
- name: rabbitmq-load-definition
  namespace: {{ cookiecutter.component.attributes.namespace }}
  files:
    - secret/definitions.json
```




### Example 2: Ingress Features

Sometimes, the goal is to simply enable or disable features related to the connection, such as allowing or disallowing specific capacities. In this scenario, features like Cross-Origin Resource Sharing (CORS) or rate limiting can be toggled for backends attached to an ingress controller (e.g., Kong). This flexibility demonstrates the power of templating in managing connection features, offering the ability to tailor the ingress behavior to specific requirements.

These examples illustrate the versatility and efficiency of templating in configuring link properties between services, demonstrating how minimal configurations can significantly streamline and enhance service connectivity.

/k**8s/deploy/base/kustomization.yaml;** enabling yaml deployment through kustomize.
  ```yaml
resources:
  {%- if cookiecutter.__ingress.attributes.cors %}
  - cors.yaml
  {%- endif %}
  {%- if cookiecutter.__ingress.attributes.rate_limiting %}
  - rate-limit.yaml
  {%- endif %}
 ```
**/k8s/deploy/base/python.yaml:** Here's our method for enabling ingress and incorporating plugins within the deployment YAML of a backend service. We activate plugins by appending annotations, employing a slightly different loop style to showcase the system's flexibility. This variation underscores the adaptability of our approach, highlighting that numerous strategies for conditioning and looping are available, allowing for customization to best fit specific requirements.
```yaml
{% if cookiecutter.__ingress != '' -%}
---
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: {{ cookiecutter.component.name }}
  namespace: {{ cookiecutter.component.attributes.namespace }}
  labels:
    app.kubernetes.io/name: "{{ cookiecutter.component.name }}"
    app.kubernetes.io/instance: "{{ cookiecutter.component.name }}"
    app.kubernetes.io/component: "server"
    app.kubernetes.io/part-of: "{{ cookiecutter.configuration.system_name | slugify }}"
    app.kubernetes.io/managed-by: "stacktic"
  annotations:
    cert-manager.io/cluster-issuer: "issuer"
    {%- set plugins = [] %}
    {%- if cookiecutter.__ingress.attributes.cors %}
    {%- set plugins = plugins + [cookiecutter.component.name ~ '-cors'] %}
    {%- endif %}
    {%- if cookiecutter.__ingress.attributes.rate_limiting %}
    {%- set plugins = plugins + [cookiecutter.component.name ~ '-rate-limit'] %}
    {%- endif %}
    {%- if plugins %}
    konghq.com/plugins: {{ plugins | join(',') }}
    {%- endif %}
spec:
  ingressClassName: "{{ cookiecutter.__ingress.component.type }}"
  rules:
    - host: {{ cookiecutter.component.name }}.{{ cookiecutter.configuration.domain }}
      http:
        paths:
            - path: /
              pathType: Prefix
              backend:
                service:
                  name: {{ cookiecutter.component.name }}
                  port:
                    name: http
  tls:
    - hosts:
        - {{ cookiecutter.component.name }}.{{ cookiecutter.configuration.domain }}
      secretName: wildcard-tls-secret
  {%- endif %}

```

## Automating Complex Processes with Templating: Conditions and Loops

With a foundational understanding of basic templating, let's explore how we can extend these principles to automate more intricate operations, such as CI/CD workflows or security configurations.

### Example 1: Automating Network Policies

While enabling a network policy is as simple as toggling it on in the `kustomization.yaml`, the real magic lies in how these policies are dynamically created based on the metadata we provide.

**How It Works**: When the network policy toggle is activated, our templating engine examines the provided metadata to construct appropriate rules. This ensures that the network policies are not only enabled but are also tailored to the specific requirements and connections of your services, enhancing security without manual rule definition.

![img_19.png](img_19.png)

**k8s/deploy/base/network-policy.yaml:** here is example of conditions that automatically establish egress rules for "link_to" backend to destinations like databases. It also incorporates a second loop for Kong, enabling egress to other components managed by Kong. This example illustrates how different services require unique automation based on their role within the application, demonstrating the versatility of our approach.
```yaml 
### NetworkPolicies

  {%- for link in cookiecutter.links_to.values() %}
### allow Egress for {{ cookiecutter.component.name }}
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: egress-from-{{ cookiecutter.component.name }}-to-{{ link.component.name }}
  namespace: {{ cookiecutter.component.attributes.namespace }}
spec:
  podSelector:
    matchLabels:
      stacktic.io/app: {{ cookiecutter.component.name }}
  policyTypes:
    - Egress
  egress:
    - to:
        - namespaceSelector:
            matchLabels:
              stacktic.io/namespace: {{ link.component.attributes.namespace }}
        - podSelector:
            matchLabels:
              stacktic.io/app: {{ link.component.name }}
      ports:
        - protocol: TCP
          port: {{ link.component.attributes.port }}
---
{%- endfor %}

  {% for link in cookiecutter.links_from.values() %}
  {% if link.component.name == 'kong' %}
  ### allow DNS access for {{ cookiecutter.component.name }}
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: allow-dns-access-for-{{ cookiecutter.component.name }}
  namespace: {{ cookiecutter.component.attributes.namespace }}
spec:
  podSelector:
    matchLabels:
      stacktic.io/app: {{ cookiecutter.component.name }}
  policyTypes:
    - Egress
  egress:
    - to:
        - namespaceSelector:
            matchLabels:
              kubernetes.io/metadata.name: kube-system
      ports:
        - protocol: UDP
          port: 53  # Port used by DNS
```

### Example 2: GitOps Automation

**Full Stack Automation**: To conditionally automate GitOps for the entire stack, our system uses the provided configurations to dynamically generate the necessary GitOps setup. This approach ensures that every component of the stack is included in the GitOps workflow, streamlining updates and deployments across the board.
![img_18.png](img_18.png)

**/k8s/deploy/base/kustomization.yaml:** enable toggle of gitops via kustomization.yaml
```yaml
resources:
  - namespace.yaml
  - argo-cd.yaml
  - argocd-image-updater.yaml
  #- network-policy.yaml
  - updater-rbac.yaml
  {%- if cookiecutter.component.attributes.gitops %}
  - apps.yaml
  {%- endif %}
```
**/k8s/deploy/base/apps.yaml:** The apps.yaml leverages a loop to implement GitOps for all components, excluding ArgoCD itself, as it's not practical to apply GitOps to the GitOps tool. Within this loop, particularly in the synchronization section, additional conditions such as "service.type == 'service'" are used. This differentiation is crucial because various services necessitate distinct synchronization options to ensure they are automatically synced and maintain a healthy status. Essentially, this streamlined loop facilitates the creation of a comprehensive GitOps environment for the entire stack.
```yaml
{% for service in cookiecutter.components.values() if service.type != 'argo' -%}
---
apiVersion: argoproj.io/v1alpha1
kind: Application
metadata:
  name: {{ service.name }}
  namespace: {{ cookiecutter.component.attributes.namespace }}
  annotations:
    argocd-image-updater.argoproj.io/image-list: {{ service.name }}={{ cookiecutter.configuration.registry_host }}/{{ cookiecutter.configuration.registry_project }}/{{ service.name }}
    argocd-image-updater.argoproj.io/{{ service.name }}.update-strategy: "latest"
    argocd-image-updater.argoproj.io/{{ service.name }}.force-update: "true"
    argocd-image-updater.argoproj.io/write-back-method: "git"
    argocd-image-updater.argoproj.io/write-back-target: "kustomization"
    argocd-image-updater.argoproj.io/argocd.kustomize.image-name: {{ cookiecutter.configuration.registry_host }}/{{ cookiecutter.configuration.registry_project }}/{{ service.name }}
spec:
  project: default
  source:
    repoURL: 'https://{{ cookiecutter.configuration.git_host }}/{{ cookiecutter.configuration.git_owner }}/{{ cookiecutter.configuration.git_project }}.git'
    path: k8s/deploy/overlays/dev/{{ service.name }}
    targetRevision: {{ cookiecutter.configuration.git_branch }}
    {% if cookiecutter.configuration.sops_enabled  -%}
    plugin:
      name: sops-v1.0
    {%- endif %}
  destination:
    server: 'https://kubernetes.default.svc'
  syncPolicy:
    automated:
      {% if service.type == 'mongodb' or service.type == 'postgresql' -%}
      prune: true
      {%- else %}
      selfHeal: true
      {%- endif %}
    syncOptions:
      - RespectIgnoreDifferences=true
      - CreateNamespace=true
      - SkipDryRunOnMissingResource=true
      {% if service.type == 'mongodb' or service.type == 'postgresql' -%}
      - Prune=true
      {% elif service.type == 'opa' -%}
      - ServerSideApply=true
      {% elif service.type == 'keda' or service.type == 'prometheus'-%}
      - Replace=true
      {%- endif %}
  ignoreDifferences:
    - group: apps
      kind: StatefulSet
      jsonPointers:
        - /volumeClaimTemplates/0/metadata/creationTimestamp
    - group: ""
      kind: PersistentVolumeClaim
      jsonPointers:
        - /spec/volumeName
{% endfor %}

```


### Example 3: Automating Continuous Integration (CI)

While Continuous Deployment (CD) might be automated through conditions created for tools like ArgoCD, automating Continuous Integration (CI) requires a different approach since CI isn’t typically something enabled at the initial deployment stage.



**CI Basic example:** Creating CI workflows for all the source code in the stack might seem complex at first glance. However, let's explore how simplifying the process can be. The example below demonstrates using a straightforward ArgoFlow YAML configuration to automate the "build" process with Kaniko.
To execute this as a loop for the source code, we've established two conditional loops based on "service.group == 'backend'". One loop is designated for the "step" in the process, and another specifically addresses the Kaniko environment settings. This approach streamlines the CI setup for backend services, showcasing the simplicity and efficiency of our method.

```yaml
apiVersion: argoproj.io/v1alpha1
kind: Workflow
metadata:
  generateName: kaniko-build
  namespace: argo
spec:
  entrypoint: build-push
  volumes:  # Defined at the top level to be available for all templates
    - name: kaniko-secret
      secret:
        secretName: docker-credentials
        items:
          - key: .dockerconfigjson
            path: config.json
  templates:
    - name: build-push
      steps:
        {% for service in cookiecutter.components.values() if service.group == 'backend' %}
        - - name: build-push-{{ service.name }}
            template: build-push-{{ service.name }}
        {% endfor %}

    {% for service in cookiecutter.components.values() if service.group == 'backend' %}
    - name: build-push-{{ service.name }}
      container:
        image: gcr.io/kaniko-project/executor:latest
        args:
          - "--context=git://{{ cookiecutter.configuration.git_host }}/{{ cookiecutter.configuration.git_owner }}/{{ cookiecutter.configuration.git_project }}.git#refs/heads/{{ cookiecutter.configuration.git_branch }}"
          - "--context-sub-path={{ service.name }}" 
          - "--destination={{ cookiecutter.configuration.registry_host }}/{{ cookiecutter.configuration.registry_project }}/{{ service.name }}:{{ service.attributes.version }}"
        env:
          - name: GIT_PASSWORD
            valueFrom:
              secretKeyRef:
                name: github-repo-secret 
                key: password
          - name: GIT_USERNAME
            valueFrom:
              secretKeyRef:
                name: github-repo-secret
                key: username
        volumeMounts:
          - name: kaniko-secret
            mountPath: /kaniko/.docker
    {% endfor %}

```
CI with Scan step: If you wish to introduce additional steps into the process, it's as straightforward as incorporating two more loops. For instance, I've integrated a scanning step. This involves adding an extra condition for the "Scan Steps" phase and another for the task "Scan Templates using Trivy." This method allows for seamless expansion of the workflow to include new operations, enhancing the CI process with additional security and analysis capabilities.
```yaml
apiVersion: argoproj.io/v1alpha1
kind: Workflow
metadata:
  generateName: kaniko-build
  namespace: argo
spec:
  entrypoint: build-push
  volumes:  # Defined at the top level to be available for all templates
    - name: kaniko-secret
      secret:
        secretName: docker-credentials
        items:
          - key: .dockerconfigjson
            path: config.json
  templates:
    - name: build-push
      steps:
        # CI Build and Push Steps
        {% for service in cookiecutter.components.values() if service.group == 'backend' %}
        - - name: build-push-{{ service.name }}
            template: build-push-{{ service.name }}
        {% endfor %}

        # Scan Steps
        {% for service in cookiecutter.components.values() if service.group == 'backend' %}
        - - name: scan-{{ service.name }}
            template: scan-{{ service.name }}
        {% endfor %}

    # CI Build and Push Templates
    {% for service in cookiecutter.components.values() if service.group == 'backend' %}
    - name: build-push-{{ service.name }}
      container:
        image: gcr.io/kaniko-project/executor:latest
        args:
          - "--context=git://{{ cookiecutter.configuration.git_host }}/{{ cookiecutter.configuration.git_owner }}/{{ cookiecutter.configuration.git_project }}.git#refs/heads/{{ cookiecutter.configuration.git_branch }}"
          - "--context-sub-path={{ service.name }}" 
          - "--destination={{ cookiecutter.configuration.registry_host }}/{{ cookiecutter.configuration.registry_project }}/{{ service.name }}:{{ service.attributes.version }}"
        env:
          - name: GIT_PASSWORD
            valueFrom:
              secretKeyRef:
                name: github-repo-secret 
                key: password
          - name: GIT_USERNAME
            valueFrom:
              secretKeyRef:
                name: github-repo-secret
                key: username
        volumeMounts:
          - name: kaniko-secret
            mountPath: /kaniko/.docker
    {% endfor %}

    # Scan Templates using Trivy
    {% for service in cookiecutter.components.values() if service.group == 'backend' %}
    - name: scan-{{ service.name }}
      container:
        image: aquasec/trivy:latest  # Trivy image
        command: ["trivy"]  # Trivy command
        args:
          - "image"
          - "--format"
          - "table"  # Output format (table, json, etc.)
          - "{{ cookiecutter.configuration.registry_host }}/{{ cookiecutter.configuration.registry_project }}/{{ service.name }}:{{ service.attributes.version }}"
    {% endfor %}
```

### Source Code Customization: Dynamic Approach

Our platform enhances source code integration by dynamically customizing dependencies and API definitions based on linked services. This ensures flexible and robust source code adaptation to various connectors, databases, and secrets.

![img_32.png](img_32.png)

#### Python Customization Example

Source code customization for advanced integration allows dependencies and API definitions to dynamically adapt based on the link connector. For example, in Python, this customization begins at the requirements.txt level, adjusting dependencies according to linked services:

```
Flask>=2.2.2
Werkzeug>=2.2.2

# Prometheus monitoring
{% for component in cookiecutter.links_from.values() if component.type == "prometheus-python" %}
prometheus_client>=0.14.1
requests>=2.25.1
{% endfor %}

# RabbitMQ link
{% for component in cookiecutter.links_to.values() if component.type == "python-rabbitmq" %}
pika>=1.3.0
requests>=2.25.1
{% endfor %}

# Relational DB link
{% for link in cookiecutter.links_to.values() if link.group == "backend-rel_db" %}
psycopg2-binary>=2.9.3
SQLAlchemy>=1.4.39
{% endfor %}

# MongoDB link
{% for component in cookiecutter.links_to.values() if component.type == "python-mongodb" %}
pymongo>=4.1.1
{% endfor %}
```

Following dependency customization, providers and API definitions for each service connector are created within the src directory:

```
stacktic-templates/python/{{cookiecutter.project_slug}}/src/
├── __init__.py
├── http_rest_mongodb.py
├── http_rest_postgres.py
├── http_rest_rabbitmq.py
├── metrics.py
├── mongodb_provider.py
├── mongodb_utils.py
├── postgresql_provider.py
├── prometheus_provider.py
├── rabbitmq_provider.py
└── sample_document.json
```

The source code utilizes configmaps already templated without exposing any secrets directly in the code, using the configmap environment variables instead.
Main code files, such as app.py in Python, incorporate conditions for the links to dynamically decide whether to connect to the linked service using the provided APIs and definitions at the app code level:
```
# Prometheus setup
{% for component in cookiecutter.links_from.values() if component.type == "prometheus-python" %}
from src.prometheus_provider import ...
app = Flask(__name__)
app.wsgi_app = DispatcherMiddleware(app.wsgi_app, ...
{% endfor %}

# RabbitMQ setup
{% for component in cookiecutter.links_to.values() if component.type == "python-rabbitmq" %}
rabbitmq_host = os.getenv('RABBIT_HOST')
...
app.register_blueprint(rabbitmq_bp, ...
{% endfor %}

```
K8s level standard templates cover most needs, creating secrets for users, databases, etc., on the linked service side, and using configmaps and secrets as environment variables in the source code:
```
stacktic-templates/python/{{cookiecutter.project_slug}}/k8s/deploy/base/
├── config
│   └── cloud.env
├── cors.yaml
...
└── secret
    └── registry.json
```
ConfigMap example:

```
GREETING_TEMPLATE=Hello from K8s, %s!
SERVICE_PORT=8080

{%- if cookiecutter.__rel_db != '' and cookiecutter.__rel_db.component.type == 'postgresql' %}
POSTGRESS_HOST={{ cookiecutter.__rel_db.component.name }}.{{ cookiecutter.__rel_db.component.attributes.namespace }}.svc.cluster.local
POSTGRESS_USERNAME={{ cookiecutter.__rel_db.attributes.username }}
POSTGRESS_PASSWORD={{ cookiecutter.__rel_db.attributes.password }}
POSTGRESS_DATABASE={{ cookiecutter.__rel_db.attributes.database }}
{%- endif %}

{%- if cookiecutter.__rabbitmq != '' %}
RABBIT_HOST={{ cookiecutter.__rabbitmq.component.name }}.{{ cookiecutter.__rabbitmq.component.attributes.namespace }}.svc.cluster.local
RABBIT_PORT=5672
RABBIT_USER={{ cookiecutter.__rabbitmq.attributes.username }}
RABBIT_PASSWORD={{ cookiecutter.__rabbitmq.attributes.password }}
RABBIT_QUEUE={{ cookiecutter.__rabbitmq.attributes.queue }}
RABBIT_VHOST={{ cookiecutter.__rabbitmq.attributes.vhost }}
{%- endif %}

{%- if cookiecutter.__mongodb != '' %}
MONGODB_USER={{ cookiecutter.__mongodb.attributes.username }}
MONGODB_PASSWORD={{ cookiecutter.__mongodb.attributes.password }}
MONGODB_HOST={{ cookiecutter.__mongodb.component.name }}.{{ cookiecutter.__mongodb.component.attributes.namespace }}.svc.cluster.local
MONGODB_PORT=27017
MONGODB_DATABASE={{ cookiecutter.__mongodb.attributes.database }}
{%- endif %}
```
### conclusion
Leveraging metadata and logic, we can streamline the automation of complex processes into concise YAML configurations and a handful of conditions. Once set up, this system efficiently orchestrates comprehensive CI/CD workflows for the entire stack, regardless of the number of services involved or the complexity of the topology. This approach not only simplifies initial setup but also ensures scalable and manageable automation across even the most intricate systems.
