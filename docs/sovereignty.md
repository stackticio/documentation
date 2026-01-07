---
sidebar_label: 'Sovereignty & Agnostic Freedom'
description: 'Overview'
---

# Stack Sovereignty Across Cloud and Air-Gapped

## Overview

Stacktic is a platform designed to create and support sovereignty and cloud-agnostic solutions, including fully automated deployments in air-gapped environments.

## Key Features

### Sovereignty

Stacktic delivers true stack-level sovereignty through:

- **100% Open Source**: Fully transparent, stable solution with complete visibility
- **Dependency Awareness**: Full understanding of packages, dependencies, and code
- **SBOM Automation**: Automated Software Bill of Materials (SBOM) generation in XML format
- **Complete Customization**: Modify any part of the stack solution to meet your specific needs

### Cloud-Agnostic Architecture

Stacktic provides stable OSS automation of full-stack applications that can be deployed on any Kubernetes cluster across any cloud provider. This translates to:

- **Cost Optimization**: Move your applications to the most cost-effective cloud provider with just 2 clicks
- **Vendor Lock-in Prevention**: Break free from cloud vendor lock-in with true flexibility to move environments
- **Platform Independence**: Deploy anywhere - public cloud, private cloud, or on-premises

### How Does It Work?

Change your domain name in the configuration, then apply the stack:

```
 kubectl apply -k k8s/deploy/overlays/dev --server-side=true --force-conflicts=true
```

tips: duplicate the stack and create dedicated stack on the repo with diffrent branches

### Air-Gapped Environment Support

Transform production applications with complex data pipelines from managed services to air-gapped environments with ease:

- **Self-Contained Architecture**: All data elements, messaging, and code reside within the Kubernetes cluster - no external dependencies
- **Automated Migration**: Our `migrate.sh` script handles pulling and pushing of all images in the stack
- **Image Management**: Automatic updating of new/old images in each `kustomization.yaml` file
- **Zero Manual Intervention**: Complete automation from start to finish

## How It Works

1. **Stack Awareness**: Stacktic maintains complete awareness of your entire application stack
2. **Metadata Migration**: Automated metadata migration handles all container images
3. **Deployment Automation**: Deploy to any Kubernetes cluster with minimal configuration
4. **Environment Portability**: Move between clouds, on-premises, or air-gapped environments seamlessly

## Getting Started

```bash
tree versioning
versioning
├── README.md
├── bom.json
├── bom.xml
├── migrate-images.sh
├── migration
│   ├── README.md
│   ├── migrate.sh
│   └── migration-config.json
├── scan-summary.json
├── versions.json
└── versions.md

./migrations/migrate.sh

cat versioning/migration/migrate.sh|grep tag

   docker tag apache/apisix-dashboard:3.0.0-alpine asauer/apisix-dashboard:3.0.0-alpine && \
   docker tag apache/apisix-ingress-controller:1.8.3 asauer/apisix-ingress-controller:1.8.3 && \
   docker tag apache/apisix:3.11.0-debian asauer/apisix:3.11.0-debian && \
   docker tag apache/apisix:3.5.0-debian asauer/apisix:3.5.0-debian && \
   docker tag asauer/cosign:2.4 asauer/cosign:2.4 && \
# [6/57] asauer/stage:0.0.1-SNAPSHOT
echo "[6/57] Processing stage:0.0.1-SNAPSHOT"
if docker pull asauer/stage:0.0.1-SNAPSHOT && \
   docker tag asauer/stage:0.0.1-SNAPSHOT asauer/stage:0.0.1-SNAPSHOT && \
   docker push asauer/stage:0.0.1-SNAPSHOT; then
    echo "  ✓ Migrated to asauer/stage:0.0.1-SNAPSHOT"
    docker rmi asauer/stage:0.0.1-SNAPSHOT 2>/dev/null
    docker rmi asauer/stage:0.0.1-SNAPSHOT 2>/dev/null
    echo "  ✗ Failed to migrate stage:0.0.1-SNAPSHOT"
   docker tag bitnami/kubectl:1.32.1-debian-12-r6 asauer/kubectl:1.32.1-debian-12-r6 && \
   docker tag bitnami/pushgateway:1.11.0-debian-12-r4 asauer/pushgateway:1.11.0-debian-12-r4 && \
   docker tag busybox asauer/busybox:latest && \
   docker tag busybox:1.28 asauer/busybox:1.28 && \
   ...............................
```

## Benefits

- **No Vendor Lock-in**: True freedom to choose and change cloud providers
- **Cost Reduction**: Optimize costs by choosing the most economical cloud option
- **Security & Compliance**: Meet sovereignty requirements with full control over your stack
- **Operational Simplicity**: Reduce complexity with automated deployments
- **Air-Gap Ready**: Deploy in the most restrictive environments without modification

## Architecture

Stacktic is built on the principle that all components should be:

- Self-contained within Kubernetes
- Fully automated
- Completely transparent
- Infinitely portable

---

**Stacktic** - Breaking cloud barriers, ensuring sovereignty, enabling freedom.
