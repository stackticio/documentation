# Stacktic Operational Guide: Day 0–2 Workflow

> ⚡ No manual required—just your app knowledge.  
Stacktic helps you go from idea to a production-ready full stack in minutes. This guide walks you through an example from **Day 0 (design)** to **Day 2 (operation)**.
---

## 📅 Day 0 – Architecture & Topology

Start by designing your app’s topology using standard components:

- ✅ Define **databases**, **backend**, and **frontend** services.
- ➕ Click the **“+”** icon on each service to explore **available links** to other components (e.g., connect backend to DB).
- 🧱 For a first draft, skip advanced services like **KEDA**, **OPA**, etc.
- ⚙️ You **don’t need to change any default configs**—they’re ready to run out of the box for architectural evaluation.

### 🔧 Optional: Add Basic Scale Inputs

You can modify values like:

- `rps`: Requests per second  
- `io`: Storage I/O estimates  

This helps Stacktic forecast performance and scaling needs.

---

### 📦 Example: Initial App Topology Demo

Click the image below to watch the demo:

[![Demo Video](https://via.placeholder.com/640x480.png?text=Click+to+Play+Video)](https://video.wixstatic.com/video/06ddae_156895725d83421bae1cc5e90362b682/1080p/mp4/file.mp4)
