---
sidebar_position: 3
hide_table_of_contents: true
---

# Quick Start

To get started with initializing credentials for your Stacktic application, follow these steps to configure your system and Kubernetes settings, ensuring secure and efficient deployment of your builds.

## Configuration Steps

### System Configuration

 - **Go to system and create new stack** (credentials are per stack)
 - **Build Namespace**: Set this to `build` to specify the namespace where your build artifacts will be deployed.

### Registry Configuration

- **Registry Host**: Use `index.docker.io` for Docker Hub or specify another registry host if necessary.
- **Registry Project**: Enter `asauer` to define the project namespace on the registry.
- **Registry Credentials**: Provide the username (`asauer`), password, and email (`as.sauer@gmail.com`) associated with your registry account.

### Git Configuration

- **Git Host**: Use `github.com` for GitHub or specify another git hosting service.
- **Git Project**: Set to `stack-app` to name your project repository.
- **Git Owner**: Specify `assafsauer` as the owner of the Git repository.
- **Git Branch**: Use `main` for the primary branch of your system deployment.
- **Git Credentials**: Enter the Git username (`assafsauer`) and password.
 
- ![img_1.png](img_1.png)
- 
### Ingress Configuration

- **Domain**: Configure your domain, such as `sauer.source-lab.io`, to be used for ingress routes.


### Secret Management

- **SOPS (Secrets OPerationS)**: Enable SOPS if you wish to encrypt secrets. Provide the Age Recipients public key and the corresponding Age Secret Key for decryption.

![img_2.png](img_2.png)

## Starting Your First Application Design

Starting your first application design on Stacktic involves a simple yet powerful drag-and-drop interface, allowing you to quickly piece together the components of your application stack.

### Step 1: Begin Your Design

- Navigate to the design section of Stacktic.
- Start by dragging a backend service and a database into the workspace.
- Connect these components. You can specify desired properties for each or leave the defaults to be filled in automatically.

### Understanding Connections

- **Backend Services** can connect to any data component, enabling seamless data access and manipulation.
- **Prometheus** is designed to connect to any component for monitoring purposes, collecting metrics and providing insights into application performance.
- **Grafana** exclusively connects to Prometheus, visualizing the collected metrics in comprehensive dashboards.
- **Kong** acts as an API gateway, capable of connecting to both backend and frontend services to manage API requests efficiently.
- **K6** is an application testing tool that connects to data components or backend services to simulate traffic and test performance under various conditions.
- Components like **Argo** for GitOps and **KEDA** for automatic scaling serve automated roles that don't directly connect to application services in the design phase. Instead, they're included as YAML configurations for Day 2 operations, enhancing CI/CD workflows, security, and scalability without being part of the initial overlay deployment.

![alt text](image-5.png)

<img src="image-5.png" alt="alt text" width="300"/>


### Step 2: Save and Build

- After designing your application, hit save to lock in your configuration.
- Proceed to the build section and submit your design for generation. Stacktic will now process the metadata and logic to create the necessary Kubernetes manifests and other configurations.
- You can go to your repo detailed instruction in the doc folder of the structure, day, installation, and much more… later on, we will explain about the repo structure and logic.
- make sure to merge stacktic branch and main because the build/kaniko process (where you code ) point to the main.
````
git fetch --all
git merge origin/stacktic
git add .
git commit -m "Resolved merge conflicts between stacktc and main"
git push origin main
````


![img_5.png](img_5.png)

### Step 3: Deploy to Kubernetes

- First, build the source code for the backend group. Given the dynamic nature of your design, this process ensures all dependencies, APIs, and security configurations are up-to-date.
````
kubect apply -k k8s/build/overlay/dev

### validate completion ended successfully
kubectl get pods -n build                                           
NAME                   READY   STATUS      RESTARTS   AGE
python1-kaniko-dtkjc   0/1     Completed   0          9m41s
python2-kaniko-hmm44   0/1     Completed   0          9m39s
react-kaniko-b6fq6     0/1     Completed     0          5s
````
- Once the build completes (typically within a few minutes), you can deploy the generated Kubernetes manifests to roll out your application.
- update your DNS A record to the ingress IP (for example "react       react     kong    react.apps.source-lab.io     34.171.143.188 ")
```
kubect apply -k  k8s/deploy/overlays/dev --server-side=true --force-conflicts=true

### validation

 kubectl get pods -A
NAMESPACE      NAME                                                  READY   STATUS      RESTARTS   AGE
cert-manager   cert-manager-7cc868b744-xhd9f                         1/1     Running     0          3h57m
cert-manager   cert-manager-cainjector-f7f5bf74-8b5fj                1/1     Running     0          4h52m
cert-manager   cert-manager-startupapicheck-dlp8s                    0/1     Completed   0          4h52m
cert-manager   cert-manager-webhook-b9655d4f4-k9qgc                  1/1     Running     0          3h57m
istio-system   istio-84c594b7b7-fkmr7                                1/1     Running     0          106m
istio-system   istiod-5d669c7cb7-44ndb                               1/1     Running     0          106m
kong           kong-86f7789bc7-6fhtp                                 2/2     Running     0          4h52m
kong           kong-86f7789bc7-n8dvw                                 2/2     Running     0          3h57m
kong           kong-postgresql-0                                     1/1     Running     0          4h52m
kube-system    calico-node-5685m                                     1/1     Running     0          4h56m
kube-system    calico-node-kr9jb                                     1/1     Running     0          4h56m
kube-system    calico-node-vertical-autoscaler-6446d6bc5c-85nzr      1/1     Running     0          4h57m
kube-system    calico-node-vtjdt                                     1/1     Running     0          105m
kube-system    calico-typha-94876c957-dcj8h                          1/1     Running     0          4h56m
kube-system    calico-typha-94876c957-qhfnn                          1/1     Running     0          3h55m
kube-system    calico-typha-horizontal-autoscaler-5b57b69bc5-f86mp   1/1     Running     0          4h57m
kube-system    calico-typha-vertical-autoscaler-fcc7f69d-8drbb       1/1     Running     0          4h57m
kube-system    ip-masq-agent-bptlj                                   1/1     Running     0          4h57m
kube-system    ip-masq-agent-nksr4                                   1/1     Running     0          105m
kube-system    ip-masq-agent-zkl45                                   1/1     Running     0          4h57m
kube-system    konnectivity-agent-8fdddf7bf-d27wf                    1/1     Running     0          4h56m
kube-system    konnectivity-agent-8fdddf7bf-dwkgx                    1/1     Running     0          3h57m
kube-system    konnectivity-agent-8fdddf7bf-txl5b                    1/1     Running     0          4h57m
kube-system    konnectivity-agent-autoscaler-5d9dbcc6d8-8gq5s        1/1     Running     0          4h57m
kube-system    kube-dns-746fbc5df6-tjhr4                             3/3     Running     0          4h56m
kube-system    kube-dns-746fbc5df6-wcnks                             3/3     Running     0          4h57m
kube-system    kube-dns-autoscaler-84b8db4dc7-czcwt                  1/1     Running     0          4h57m
kube-system    kube-proxy-gke-cluster-1-default-pool-8a725717-4vd0   1/1     Running     0          4h56m
kube-system    kube-proxy-gke-cluster-1-default-pool-8a725717-jxl3   1/1     Running     0          4h56m
kube-system    kube-proxy-gke-cluster-1-default-pool-8a725717-scng   1/1     Running     0          104m
kube-system    l7-default-backend-cf7cdc6f6-gzt7q                    1/1     Running     0          4h57m
kube-system    metrics-server-v0.5.2-8fb865474-jcdtf                 2/2     Running     0          4h56m
kube-system    pdcsi-node-2qkt2                                      2/2     Running     0          105m
kube-system    pdcsi-node-bsr4m                                      2/2     Running     0          4h57m
kube-system    pdcsi-node-hflsx                                      2/2     Running     0          4h57m
postgresql     postgresql-0                                          1/1     Running     0          105m
python1        python1-68b989f7d-7k57k                               1/1     Running     0          4h25m
python2        python2-665cc4fcb7-fkdh2                              1/1     Running     0          4h52m
react          react-679597f8f-ppvd6                                 1/1     Running     0          4h52m
 
 kubectl get ingress -A
NAMESPACE   NAME      CLASS   HOSTS                        ADDRESS          PORTS     AGE
python1     python1   kong    python1.apps.source-lab.io   34.171.143.188   80, 443   4h52m
python2     python2   kong    python2.apps.source-lab.io   34.171.143.188   80, 443   4h52m
react       react     kong    react.apps.source-lab.io     34.171.143.188   80, 443   4h52m

 curl -ks https://python2.apps.source-lab.io/greeting
{
  "message": "Hello, welcome to the service!"
}
assafsauer@Assafs-MacBook-Pro workspaces % 
```

- Once the DNS is updated you can access your React frontend.

![img_33.png](img_33.png)

**Note**: If there are no changes to backend connectors, there's no need to rebuild. Simply deploy the Kubernetes manifests for your application.

