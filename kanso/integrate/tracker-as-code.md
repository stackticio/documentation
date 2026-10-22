---
title: Tracker as code
description: Declare Kanso spaces and workflows as Kubernetes custom resources, keep them in git, and let Kanso converge to them.
---

Kanso's configuration can live in Kubernetes. `KansoProject` and `KansoWorkflow` declare the *desired* state of a space and a workflow, and a reconciler inside Kanso converges to them through the same operations the public API exposes — so a git repository holding two YAML files is a configured tracker. PostgreSQL remains the only runtime truth; Kubernetes objects are declarations, never the source.

## Turning it on

The reconciler is off by default. Turn it on in the Helm chart's values:

```yaml
declarativeConfig:
  enabled: true
```

The CRDs ship in the chart and Helm installs them before the templates. With declarative config on, the chart grants Kanso's service account a Role that can read `KansoProject` and `KansoWorkflow` objects and patch their status — and nothing else: no write access to any built-in Kubernetes resource. The reconciler re-reads the resources about every 20 seconds.

## KansoProject (`kproj`)

```yaml
apiVersion: kanso.io/v1alpha1
kind: KansoProject
metadata:
  name: demo-project
spec:
  key: DEMO                 # required, ^[A-Z][A-Z0-9]{1,9}$
  name: Demo (declared in git)
  hierarchyLevels:
    - { depth: 0, name: Initiative }
    - { depth: 1, name: Epic }
    - { depth: 2, name: Story }
```

Spec fields: `key` (required), `name`, `hierarchyLevels` (each `{depth: 0..19, name}`). A key conflict with an existing *unmanaged* project makes the CR `Degraded` with a message — never a silent adoption. Deleting a KansoProject CR does **not** delete the project: issues are user data, so it only releases management, leaving the project mutable again. Printer columns show Key and Phase.

## KansoWorkflow (`kwf`)

```yaml
apiVersion: kanso.io/v1alpha1
kind: KansoWorkflow
metadata:
  name: demo-flow
spec:
  name: Demo flow
  definition:               # the exact public-API workflow shape
    states:
      - { id: todo,  name: To Do, category: todo }
      - { id: doing, name: Doing, category: in_progress }
      - { id: done,  name: Done,  category: done }
    initialState: todo
    transitions:
      - { id: start,  name: Start,  from: [todo],  to: doing }
      - { id: finish, name: Finish, from: [doing], to: done }
  bindings:
    - { projectKey: DEMO, issueType: Task }
```

Spec fields: `name` and `definition` (required), `bindings` (`[{projectKey, issueType}]`). Applying a changed definition **publishes a new version** — workflows stay versioned: CRs cannot rewrite history, they can only publish, and existing issues keep the workflow version they were on. Printer columns show Workflow, Version and Phase. See [Workflows](../work/workflows.md) for the definition shape.

## One writer per object

A CR-managed object refuses imperative edits with a named `409 managed_by_cr`. One writer per object, never a silent overwrite — the reconciler converges through the same operations as any other client, so there is no private path.

## Try it

Save the two manifests above as `project.yaml` and `workflow.yaml` in one directory — together they *are* a configured tracker — and apply it:

```sh
kubectl apply -f tracker/
kubectl get kansoprojects,kansoworkflows
```

Within one reconcile cycle you have project DEMO with named hierarchy levels, and the "Demo flow" workflow published at v1 and bound to DEMO's Tasks. Edit the workflow YAML and re-apply: a new version is published while old issues keep theirs. Delete the project CR and the project survives, unmanaged.
