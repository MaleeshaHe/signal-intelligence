# Signal Intelligence

Modular signal processing backend built with Node.js and TypeScript.
This repository currently implements three signal modules, one orchestration pipeline, and a REST API layer.

## Implemented Modules

1. `SignalRegistry`
2. `SignalClassification`
3. `SignalPriorityEngine`

## Orchestrated Processing Flow

`SignalInput -> SignalRegistry -> transformed input -> SignalClassification -> transformed input -> SignalPriorityEngine -> final output`

Orchestrator file:
- `src/orchestrator/SignalOrchestrator.ts`

## REST API Proof

### Route Definitions

Base URL: `http://localhost:3000`

- `GET /health`
- `POST /api/signals/register`
- `POST /api/signals/classify`
- `POST /api/signals/prioritize`
- `POST /api/signals/process`
- `GET /api/signals`
- `GET /api/signals/:id`

Route composition files:
- `src/routes/index.ts`
- `src/modules/SignalRegistry/SignalRegistryRoute.ts`
- `src/modules/SignalClassification/SignalClassificationRoute.ts`
- `src/modules/SignalPriorityEngine/SignalPriorityEngineRoute.ts`
- `src/orchestrator/SignalOrchestratorRoute.ts`

### How Modules Are Exposed via API

- `POST /api/signals/register` -> `SignalRegistryController` -> `SignalRegistryService`
- `POST /api/signals/classify` -> `SignalClassificationController` -> `SignalClassificationService`
- `POST /api/signals/prioritize` -> `SignalPriorityEngineController` -> `SignalPriorityEngineService`
- `POST /api/signals/process` -> `SignalOrchestratorController` -> `SignalOrchestrator` -> `SignalRegistryService` -> `SignalClassificationService` -> `SignalPriorityEngineService`

Each controller stores output using `InMemorySignalStore` (`src/db/InMemorySignalStore.ts`).

### Endpoint Example (Request)

```http
POST /api/signals/register
Content-Type: application/json
```

```json
{
  "id": "SIG-1001",
  "signalType": "urgency_signal",
  "signalCategory": "security",
  "signalSource": "country_relationship_layer",
  "signalValue": "high, immediate attention",
  "priorityLevel": 4,
  "timestamp": "2026-03-14T15:45:00.000Z",
  "version": 1,
  "isActive": true
}
```

### Endpoint Example (Response)

```json
{
  "message": "Signal Registered Successfully",
  "data": {
    "processedBy": "SignalRegistry",
    "status": "REGISTERED",
    "inputSignalId": "SIG-1001",
    "priorityLevel": 4
  }
}
```

### Full Pipeline Endpoint Example

```http
POST /api/signals/process
Content-Type: application/json
```

```json
{
  "message": "Signal Processed Through Full Pipeline",
  "data": {
    "stageOutputs": {
      "registry": { "processedBy": "SignalRegistry", "status": "REGISTERED" },
      "classification": { "processedBy": "SignalClassification", "status": "CLASSIFIED" },
      "priority": { "processedBy": "SignalPriorityEngine", "status": "PRIORITY_ASSIGNED" }
    },
    "finalOutput": {
      "processedBy": "SignalOrchestrator",
      "status": "PIPELINE_COMPLETE"
    }
  }
}
```

### Validation Snapshot (Executed on 2026-03-14)

- `GET /health` returned:

```json
{ "status": "OK", "service": "signal-intelligence" }
```

- `POST /api/signals/register` returned `201` with `processedBy: "SignalRegistry"`.
- `POST /api/signals/classify` returned `201` with `processedBy: "SignalClassification"`.
- `POST /api/signals/prioritize` returned `201` with `processedBy: "SignalPriorityEngine"`.
- `POST /api/signals/process` returned `201` with final output `processedBy: "SignalOrchestrator"` and all three stage outputs.
- `GET /api/signals` returned 4 stored records after four POST calls.

## Scripts

```bash
npm run dev     # development auto-restart
npm start       # run REST API server
npm run demo    # run orchestrator pipeline demo
```
