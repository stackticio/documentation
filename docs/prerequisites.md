---
sidebar_label: 'Prerequisites'
description: 'Before you begin using Stacktic, ensure you have the following requirements in place.'
---

# Prerequisites

Before you begin using Stacktic, ensure you have the following requirements in place.

## Two Deployment Scenarios

Stacktic has two distinct deployment contexts:

### 1. Hosting the Stacktic Platform

This refers to running the Stacktic control plane itself (the web UI and automation engine).

### 2. Deploying Stacktic-Generated Stacks

This refers to deploying the **automated stack repositories** that Stacktic generates for your applications.

**The requirements below apply to BOTH scenarios.**

## Supported Kubernetes Clusters

Stacktic is designed to work with **any native Kubernetes cluster**. Any standard Kubernetes distribution should work seamlessly.

### Tested and Verified

The following distributions have been thoroughly tested:

#### Self-Managed & On-Premises

- **Amazon EKS** (Elastic Kubernetes Service)
- **Google GKE** (Google Kubernetes Engine)
- **Azure AKS** (Azure Kubernetes Service)
- **SUSE** (RANCHER)
  - **Partner Certification & Solutions Catalog: [https://www.suse.com/pcsc/viewPartnerPage?partnerID=254286](https://www.suse.com/pcsc/viewPartnerPage?partnerID=254286)**
- **IONOS Cloud Managed Kubernetes**
  - **Partnership Available**: [Contact us at info@stacktic.io for IONOS-specific support and partnership benefits](https://partnernetwork.ionos.com/channel-partners/search)
- **See IONOS private doc:** [https://06ddae7e-3b5c-43a5-bc0a-7d6aa4bf03d6.usrfiles.com/ugd/06ddae_6e377b89b17e44a6affd24cec977645e.pdf](https://06ddae7e-3b5c-43a5-bc0a-7d6aa4bf03d6.usrfiles.com/ugd/06ddae_6e377b89b17e44a6affd24cec977645e.pdf)

#### Local Development

- **Minikube**
- **Kind** (Kubernetes in Docker)
- **Docker Desktop** (with Kubernetes enabled)
- **k3d**

### Not Yet Tested

- **OpenShift** - Support expected but not yet verified. Contact us if you need OpenShift compatibility testing.

### Your Distribution Not Listed?

Any **native Kubernetes** cluster should work. If you're using a different distribution, it will likely work without issues. Contact [support@stacktic.io](mailto:support@stacktic.io) if you encounter any compatibility concerns.

## Kubernetes Version Requirements

- **Minimum version**: Kubernetes 1.20+
- **Recommended version**: Kubernetes 1.24+
- **Latest tested**: Kubernetes 1.29

## Required Tools

Install the following tools on your local machine:

### Essential Tools

| Tool | Version | Purpose |
|------|---------|---------|
| **kubectl** | 1.20+ | Kubernetes command-line tool |
| **git** | 2.0+ | Version control |

### Optional but Recommended

| Tool | Version | Purpose |
|------|---------|---------|
| **helm** | 3.0+ | Package manager for Kubernetes |
| **kustomize** | 4.0+ | Kubernetes native configuration management |
| **age** | 1.0+ | Encryption tool for SOPS secret management |

## Cluster Requirements

Your Kubernetes cluster should have:

### Minimum Resources

- **Nodes**: 2+ worker nodes (for production)
- **CPU**: 4+ cores per node
- **Memory**: 8GB+ RAM per node
- **Storage**: Dynamic volume provisioning enabled

### Network Requirements

- **Ingress Controller**: Stacktic uses APISIX by default
- **Load Balancer**: For exposing services externally
- **Network Policies**: Support for NetworkPolicy resources (optional but recommended)

## Access Requirements

### Git Repository Access

- **GitHub** account with repository creation permissions
- **Personal Access Token** (PAT) with `repo` scope
- SSH key configured (optional, for SSH-based git operations)

### Container Registry Access

- **Docker Hub**, **GitHub Container Registry**, or **private registry**
- Registry credentials for pushing/pulling images
- **Recommendation**: Use tokens instead of passwords

### Kubernetes Cluster Access

- **kubectl** configured with cluster credentials
- **RBAC permissions**:
  - Create/manage namespaces
  - Deploy workloads (Deployments, StatefulSets, etc.)
  - Manage ConfigMaps and Secrets
  - Apply CustomResourceDefinitions (CRDs)

## Optional: Encryption Setup

For secret management with SOPS encryption:

1. **Install Age**:

```bash
# macOS
brew install age

# Linux
apt-get install age  # or yum install age
```

2. **Generate Age Key Pair**:

```bash
age-keygen -o keys.txt
```

3. **Save Public Key**: You'll add this to Stacktic's system configuration

## Verification Checklist

Before proceeding, verify you have:

- [ ] Kubernetes cluster running (version 1.20+)
- [ ] kubectl installed and configured
- [ ] Git installed
- [ ] GitHub account with PAT token
- [ ] Container registry credentials
- [ ] kubectl cluster access verified (`kubectl get nodes`)
- [ ] Dynamic storage provisioner available (`kubectl get storageclass`)

## Next Steps

Once you have all prerequisites in place:

1. Review the [Quick Start](/documentation/docs/quick_start) guide
2. Configure your [Stack settings](/documentation/docs/quick_start#step-2--configure)
3. Design your [first stack](/documentation/docs/quick_start#step-3--design--build)
4. Review [Private SaaS Deployment](/documentation/docs/private_saas_deployment)

## Troubleshooting

### Common Issues

## Support

Need help with prerequisites? Contact us at:

- **Support**: [support@stacktic.io](mailto:support@stacktic.io)
- **Documentation**: Visit our [resources](/documentation/docs/quick_start#reference)
