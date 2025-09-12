
# 📘 Stacktic Operational Guide: Day 0–2 Workflow

**Stacktic** takes you from an **idea** to a **production-ready full stack** in minutes.  
This guide walks you through the workflow across:

- **Day 0 – Architecture & Topology**  
- **Day 1 – Deployment**  
- **Day 2 – Operations & Security**

---

## 📅 Day 0 – Architecture & Topology

### 🧩 Design Your Application Topology
Begin by designing your application using standard components:

- ✅ Define **databases**, **backend**, and **frontend** services.  
- ➕ Use the **“+”** icon on each service to explore available links to other components (e.g., connecting a backend to a database).

### 🔗 Import Options
Choose how to bring your application code or images into Stacktic:

- **Import code from a repository** (`external_source_code` component):  

![alt text](image-21.png)

- **Import an image** (`image_base` component):  

![alt text](image-20.png)

> **Tip:** After importing, adjust settings such as container ports, UID numbers, enabling PVCs, or updating configurations based on your image or Dockerfile.

---

### 🏗 Build a Base Stack
Create the base stack for your app, including backend services, data relationships, API gateway endpoints, and supporting services like authentication.  

![alt text](image-15.png)

Extend functionality—for example, add **API endpoints** or **messaging services**:  

![alt text](image-16.png)

---

### 📦 Demo: Initial App Topology
Click below to watch the demo:  
[![Demo Video](https://via.placeholder.com/640x480.png?text=Click+to+Play+Video)](https://video.wixstatic.com/video/06ddae_156895725d83421bae1cc5e90362b682/1080p/mp4/file.mp4)

---

### 🔧 Optional: Add Scale Forecast Inputs
Provide forecast values on components or links (e.g., from API gateways like Apisix) to get **scaling cost recommendations** during design:

- `rps` – Requests per second  
- `io` – Storage I/O estimates  

These inputs help Stacktic **simulate performance requirements** and **predict costs**.  

<img width="897" alt="image" src="https://github.com/user-attachments/assets/73c7644a-355b-4476-923f-cf0f724235de" />

After building, review the **scale cost report** for production planning:  

<img width="1442" alt="image" src="https://github.com/user-attachments/assets/f112ff77-92f1-4c2f-9043-cd7665873511" />

---

Don’t forget: **Stacktic creates empty databases**. You’ll need to import your dump into the Kubernetes cluster.  
We can automate this via bucket jobs (explained later in the migration chapter), but to keep it simple, you can find import scripts in the `data` components’ Day 0 folder:

```

tree mongodb/day0
mongodb/day0
├── README.md
├── backup-all-db.sh
├── backup.sh
└── restore.sh

```

---

## 📅 Day 1 – Deployment & Day 2 – Operations

### 🛠 Prepare for Production
With your base skeleton ready, make the app production-ready by:

- Creating environments (**dev**, **staging**, **prod**)  
- Adding **security** and **backup** layers  
- Deploying **Day 2 operational components**

> **Tip:** Use `external_source_code` for importing your code and `image_base` for production images.  
> For dev or staging, you can also use `image_base` if you want to handle your own CI pipeline.

![alt text](image-17.png)

---

### ➕ Add Operational Components
Extend your stack with key operational tools:

- **Velero (Backup):** Generates backup and restore pipelines under the `day2` folder.  
- **ArgoCD:** Automates deployment (via `kind` or cluster-specific apps) for each service.  
- **Prometheus + Grafana:**  
  - Linking **Prometheus** creates monitoring metrics.  
  - Linking **Prometheus** as a **Grafana** data source generates preconfigured dashboards.

![alt text](image-22.png)

---

## 🔐 Security Hardening

Once the operational base is ready, secure your stack:

- **OPA Policies:** Add Open Policy Agent rules to meet your security standards.  
- **RBAC Configuration:**  
  - Include RBAC components.  
  - Link users or groups to services (e.g., associate data users/groups with MongoDB, or Ops groups with backend services).  
- **Source Code Security:**  
  - Stacktic automatically adjusts security settings for your services.  
  - Manually review and refine settings (e.g., folder write permissions, probes).  
  - Be careful—overly strict settings may disrupt your code.

**OPA and RBAC:**  

![alt text](image-23.png)

**Hardening Source Code:**  

![alt text](image-24.png)

Stacktic also generates a **CISO Audit Report** inside the repository.  
This report provides a **real-time assessment** of your security level based on stack metadata, including recommendations.  
You can make changes directly in the design page until the audit report confirms compliance.

![alt text](image-32.png)

---

At this point, you’ve evaluated your stack from **architecture** to **operations** and **security**.  
Use **stack version control** for each phase:  
- Save multiple versions of your stack for different teams or environments.  
- Make radical changes by branching into a new version (e.g., V-x) without dealing with complicated manual versioning.

![alt text](image-25.png)

---

## 📅 Day 2 – Operations in Action

Assume your stack is running with separate **prod**, **stage**, and **dev** versions, with Ops and security in place. Let’s look at Day 2 operations:

- On any component, you can change its **version**—either a specific Helm or image version, or a new Stacktic component version—jumping to a new release range.  

![alt text](image-26.png)

- You’ll receive **notifications** for new versions and changes:  

![alt text](image-27.png)

Stacktic maintains your automation even as versions change.  
However, it’s recommended to test upgrades in **staging** first, since new versions could affect your code or data even if automation remains consistent.  

Use the **Sections** area to manage versions, secrets, and resources:

![alt text](image-28.png)

![alt text](image-29.png)

You can also create custom sections—for example, grouping specific attributes from multiple components:

![alt text](image-30.png)

---

### 🗂 Day-2 Readiness
Make sure to review your Ops configuration and understand operational behavior.  

For example, linking **Velero** will automatically create backup, restore, and schedule configurations in the `day2` folder:

![alt text](image-31.png)

```

tree velero/day2
velero/day2
├── README.md
├── backup
│   ├── mongodb-backup.yaml
│   └── opensearch-backup.yaml
├── restore
│   ├── mongodb-restore.yaml
│   └── opensearch-restore.yaml
└── schedule
├── mongodb-schedule.yaml
└── opensearch-schedule.yaml

```

The `day2` folder exists for many services to support ongoing operations.

Stacktic also provides **out-of-the-box dashboards** for SRE, which are maintained and updated with new versions.  
Beyond Grafana and Loki-style dashboards, Stacktic includes a **Live View**:  

- The Live View agent validates stack layers and updates the UI.  
- It checks **API health**, **data component health**, **route scanning**, **SSL health**, and performs **security validation tests**.  
- This gives you deep, relationship-aware insight into your stack’s health and readiness.

see liveview chapter for more information

![alt text](image-33.png)

![alt text](image-34.png)
