---
sidebar_position: 22
hide_table_of_contents: false
---

# AI Ops Automation

Stacktic automates the deployment and management of production AI infrastructure on Kubernetes. Design your AI stack visually, connect components, and Stacktic generates everything: LLM serving, vector databases, RAG applications, API gateways, and auto-scaling.

## Demo

<video width="100%" controls>
  <source src="https://video.wixstatic.com/video/06ddae_f8f4c10f9bc44c029c16da6c599ee34b/1080p/mp4/file.mp4" type="video/mp4" />
</video>

---

## Architecture Overview

```
                                    ┌─────────────────────────────────────────────────────────────┐
                                    │                      APISIX Gateway                         │
                                    │         Routes, AI Plugins, Authentication, SSL             │
                                    └─────────────────────────────────────────────────────────────┘
                                                              │
                        ┌─────────────────────────────────────┼─────────────────────────────────────┐
                        │                                     │                                     │
                        ▼                                     ▼                                     ▼
              ┌─────────────────┐                   ┌─────────────────┐                   ┌─────────────────┐
              │   Open-WebUI    │                   │    Langflow     │                   │  External AI    │
              │  (Chat UI)      │                   │  (RAG Builder)  │                   │  (OpenAI, etc)  │
              └────────┬────────┘                   └────────┬────────┘                   └─────────────────┘
                       │                                     │
                       │         ┌───────────────────────────┤
                       │         │                           │
                       ▼         ▼                           ▼
              ┌─────────────────────────┐          ┌─────────────────┐
              │         vLLM            │          │     Qdrant      │
              │  ┌───────────────────┐  │          │  (Vector DB)    │
              │  │      Router       │  │          │                 │
              │  └─────────┬─────────┘  │          │  collections    │
              │            │            │          └─────────────────┘
              │  ┌─────────┴─────────┐  │
              │  ▼                   ▼  │
              │ model             model │          ┌─────────────────┐
              │ (embedding)      (chat) │◄─────────│      KEDA       │
              └─────────────────────────┘          │  (Auto-Scale)   │
                         ▲                         └────────┬────────┘
                         │                                  │
              ┌──────────┴──────────┐                       │
              │     Prometheus      │◄──────────────────────┘
              │     (Metrics)       │
              └─────────────────────┘
```

---

## Components

### vLLM - LLM Serving

High-performance LLM inference with GPU acceleration. Deploy multiple models with automatic load balancing.

**Component Properties:**

| Property | Description |
|----------|-------------|
| `namespace` | Kubernetes namespace for deployment |
| `huggingface` | HuggingFace token for gated models |
| `nodepool` | GPU nodepool name |
| `gpu_request` | Number of GPUs (0 for CPU mode) |
| `route_mem_request` | Router memory (recommend 1Gi+) |

**Sub-Component: Model**

Add models as sub-components. Each model runs as a separate pod:

| Property | Description |
|----------|-------------|
| `model_path` | HuggingFace model (e.g., `Qwen/Qwen2-1.5B-Instruct`) |
| `model_type` | `chat` for conversation, `embedding` for vectors |
| `max_model_len` | Maximum context length |
| `gpu_memory_utilization` | GPU memory fraction (0.8-0.9 recommended) |

**Example Structure:**

```
vLLM
├── gte-qwen2-1-5b-instruct (embedding model)
└── qwen2-1-5b-instruct (chat model)
```

**What Gets Generated:**
- VLLMRuntime CR for each model
- VLLMRouter CR for load balancing
- Service endpoints for model access

---

### Qdrant - Vector Database

Vector similarity search for RAG applications. Store and query embeddings.

**Component Properties:**

| Property | Description |
|----------|-------------|
| `namespace` | Kubernetes namespace |
| `cpu_request` / `mem_request` | Resource allocation |

**Sub-Component: Collection**

Create collections for organizing vector data:

| Property | Description |
|----------|-------------|
| `collection_name` | Name of the collection |
| `vector_size` | Dimension size (must match embedding model) |
| `distance` | `Cosine`, `Euclidean`, or `Dot` |

---

### Langflow - RAG Application Builder

Visual tool for building LLM workflows with RAG capabilities.

**Component Properties:**

| Property | Description |
|----------|-------------|
| `namespace` | Kubernetes namespace |
| `superuser` / `superuser_password` | Admin credentials |
| `api_key` | API key for external access |
| `cache_type` | `async` or `redis` |

---

### Open-WebUI - Chat Interface

ChatGPT-like interface for interacting with your LLMs.

**Component Properties:**

| Property | Description |
|----------|-------------|
| `namespace` | Kubernetes namespace |
| `service_port` | Service port (default: 8080) |
| `pipelines_enabled` | Enable pipelines feature |

---

### KEDA - Auto-Scaling

Scale your LLM models automatically based on demand.

**Component Properties:**

| Property | Description |
|----------|-------------|
| `namespace` | Kubernetes namespace (default: keda) |

---

### APISIX - API Gateway

Ingress routing with AI-specific plugins for content filtering, rate limiting, and authentication.

**Component Properties:**

| Property | Description |
|----------|-------------|
| `namespace` | Kubernetes namespace |
| `dashboard` | Enable APISIX dashboard |
| `external_traffic` | Preserve client IP (required for IP whitelisting) |

**Sub-Component: AI Gateway**

Advanced AI routing with content filtering and rate limiting:

| Property | Description |
|----------|-------------|
| `api_key` | API key for authentication |
| `cors` | Enable CORS |
| `rate_limiting` | Enable request rate limiting |
| `whitelist` / `ip_whitelist` | IP whitelisting |
| `apisix_timeout` | Request timeout configuration |

---

## Relationships & Automation

When you link components in Stacktic, the platform automatically generates all necessary configurations.

### Langflow → vLLM

**What happens:** Langflow is configured to use vLLM as its LLM backend.

**Generated:** Environment variable `OPENAI_API_BASE` pointing to vLLM router endpoint.

**Result:** Langflow can use any model deployed in vLLM through the standard OpenAI API.

---

### Langflow → Qdrant

**What happens:** Langflow is configured with Qdrant for vector storage.

**Generated:** `QDRANT_URL` environment variable with Qdrant service endpoint.

**Result:** Langflow flows can store and retrieve embeddings from Qdrant.

---

### Langflow → Collection (Qdrant sub-component)

**What happens:** Langflow is linked to a specific Qdrant collection.

**Generated:** `QDRANT_COLLECTION` and `QDRANT_VECTOR_SIZE` configuration.

**Result:** Pre-configured collection for RAG workflows.

---

### Open-WebUI → Model (vLLM sub-component)

**What happens:** Open-WebUI is connected to specific models.

**Generated:** Model configurations in Open-WebUI, separated by type (chat vs embedding).

**Result:** Users see linked models in the model selector.

---

### KEDA → Model (vLLM sub-component)

**What happens:** Auto-scaling is enabled for a specific model.

**Link Properties:**

| Property | Description |
|----------|-------------|
| `scale_metric` | Prometheus metric (e.g., `vllm:num_requests_waiting`) |
| `scale_threshold` | Threshold to trigger scaling |
| `keda_minreplicacount` | Minimum replicas |
| `keda_maxreplicacount` | Maximum replicas |
| `polling_interval` | How often to check metrics |
| `cooldown_period` | Wait time before scaling down |

**Generated:** KEDA ScaledObject that monitors Prometheus metrics and scales the model.

**Result:** Model pods scale up when queue depth exceeds threshold, scale down when idle.

**Example Configuration:**
```
KEDA → Model: qwen2-1-5b-instruct
├── scale_metric: vllm:num_requests_waiting
├── scale_threshold: 5
├── min replicas: 1
├── max replicas: 3
└── polling_interval: 20s
```

---

### AI Gateway → Model (vLLM sub-component)

**What happens:** Per-model API routing with AI-specific plugins.

**Link Properties:**

| Property | Description |
|----------|-------------|
| `subdomain` | Route subdomain (e.g., `qwen-chat` → `qwen-chat.yourdomain.com`) |
| `path` | URL path (default: `/v1/*`) |
| `deny_patterns` | Blocked regex patterns (one per line) |
| `allow_patterns` | Required regex patterns (one per line) |
| `prompt_decorator` | System prompt to inject |
| `ai_rate_limit` | Token-based rate limiting |

**Generated:**
- ApisixRoute with AI plugins
- ApisixUpstream pointing to model service
- ApisixTls for SSL
- ApisixConsumer for API key auth

**AI Plugins:**

| Plugin | Function |
|--------|----------|
| `ai-prompt-guard` | Block or require specific content patterns |
| `ai-prompt-decorator` | Inject system prompts into every request |
| `ai-rate-limiting` | Limit by tokens (not just requests) |
| `key-auth` | API key authentication |

**Example Configuration:**
```
AI Gateway → Model: qwen2-chat
├── subdomain: qwen-chat
├── path: /v1/*
├── deny_patterns: prohibited_word
├── allow_patterns: allowed_word
├── prompt_decorator:
│   role: "system"
│   content: "You are a helpful assistant"
└── ai_rate_limit:
    limit: 10000
    time_window: 3600
    limit_strategy: total_tokens
```

**Result:** Model accessible at `https://qwen-chat.yourdomain.com/v1/*` with content filtering, prompt injection, and token-based rate limiting.

---

### AI Gateway → External AI

**What happens:** Route to external AI providers (OpenAI, Azure, Anthropic) through your gateway.

**External AI Component Properties:**

| Property | Description |
|----------|-------------|
| `ai_provider` | `openai`, `azure_openai`, or `anthropic` |
| `ai_endpoint` | Provider API endpoint |
| `ai_provider_api_key` | Provider API key |

**Generated:** Same AI plugins as internal models, but routing to external providers.

**Result:** Unified API gateway for both internal vLLM models and external AI providers.

---

### Prometheus → vLLM / Qdrant / KEDA

**What happens:** Metrics collection is enabled.

**Generated:** ServiceMonitor CRs for Prometheus to scrape metrics.

**Result:** Metrics available in Grafana dashboards, KEDA can use metrics for scaling.

---

### APISIX → Langflow / Open-WebUI

**What happens:** Ingress routes are created.

**Generated:** ApisixRoute with SSL termination.

**Result:** Services accessible at `langflow.yourdomain.com`, `open-webui.yourdomain.com`.

---

## Relationship Summary

| Link | Source | Target | What Gets Configured |
|------|--------|--------|---------------------|
| `langflow-vllm` | Langflow | vLLM | OpenAI API endpoint |
| `langflow-qdrant` | Langflow | Qdrant | Vector database URL |
| `langflow-collection` | Langflow | Collection | Collection name, vector size |
| `langflow-db` | Langflow | CNPG Database | PostgreSQL connection |
| `open-webui-vllm` | Open-WebUI | vLLM | OpenAI API endpoint |
| `open-webui-model` | Open-WebUI | Model | Model selector configuration |
| `open-webui-qdrant` | Open-WebUI | Qdrant | Vector search |
| `keda-model` | KEDA | Model | ScaledObject for auto-scaling |
| `ai_gateway-model` | AI Gateway | Model | AI route with plugins |
| `ai_gateway-external_ai` | AI Gateway | External AI | External provider route |
| `prometheus-vllm` | Prometheus | vLLM | ServiceMonitor |
| `prometheus-qdrant` | Prometheus | Qdrant | ServiceMonitor |
| `apisix-langflow` | APISIX | Langflow | Ingress route |
| `apisix-open-webui` | APISIX | Open-WebUI | Ingress route |

---

## Quick Start Guides

### Basic RAG Stack

1. Add **vLLM** with embedding and chat models
2. Add **Qdrant** for vector storage
3. Add **Langflow** for RAG orchestration
4. Link: Langflow → vLLM
5. Link: Langflow → Qdrant
6. Add **APISIX** and link to Langflow

**Result:** Langflow accessible at `langflow.yourdomain.com` with LLM and vector search ready.

### Auto-Scaling LLM API

1. Add **vLLM** with models
2. Add **Prometheus** (metrics source)
3. Add **KEDA** (auto-scaler)
4. Link: Prometheus → vLLM
5. Link: KEDA → Model (for each model to scale)
6. Add **APISIX** with **AI Gateway** sub-component
7. Link: AI Gateway → Model (for each model)

**Result:** Models scale 1-3 replicas based on queue depth, accessible via API gateway with authentication.

---

## Testing Your Stack

### Test vLLM Models

```bash
# Port-forward to router
kubectl port-forward -n vllm svc/vllm-router-service 8000:80

# List models
curl http://localhost:8000/v1/models

# Chat completion
curl -X POST http://localhost:8000/v1/chat/completions \
  -H 'Content-Type: application/json' \
  -d '{
    "model": "Qwen/Qwen2-1.5B-Instruct",
    "messages": [{"role": "user", "content": "Hello"}]
  }'
```

### Test AI Gateway

```bash
curl -X POST 'https://qwen-chat.yourdomain.com/v1/chat/completions' \
  -H 'Content-Type: application/json' \
  -H 'apikey: YOUR_API_KEY' \
  -d '{
    "model": "Qwen/Qwen2-1.5B-Instruct",
    "messages": [{"role": "user", "content": "Hello"}]
  }'
```

### Check KEDA Scaling

```bash
kubectl get scaledobject -n vllm
kubectl get hpa -n vllm
kubectl get pods -n vllm -w
```

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Model won't start | Check GPU nodepool exists and has capacity |
| Router crashes (OOM) | Increase `route_mem_request` to 1Gi+ |
| "Model does not exist" | Use full model name from `/v1/models` endpoint |
| AI Gateway 403 | Verify API key header: `apikey: YOUR_KEY` |
| Content blocked | Message must contain word from `allow_patterns` |
| KEDA not scaling | Verify Prometheus → vLLM link exists |
| `max_model_len` error | Lower `max_model_len` in model properties |

---

## Best Practices

1. **Separate Models by Type** - Use embedding models for vectors, chat models for conversation
2. **Set Appropriate Timeouts** - AI requests can take 30s+, configure `apisix_timeout`
3. **Use Token Rate Limiting** - Prefer `ai-rate-limiting` over request count for LLM APIs
4. **Monitor GPU Memory** - Set `gpu_memory_utilization` to 0.8-0.9 to avoid OOM
5. **Scale Based on Queue** - Use `vllm:num_requests_waiting` metric for scaling decisions
6. **Protect with Allow Patterns** - Use `allow_patterns` to restrict inputs to expected vocabulary
