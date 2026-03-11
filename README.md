# Signal Intelligence

Modular signal processing backend — Node.js + TypeScript.

---

## Branches

| Branch | Content |
|---|---|
| `main` | Base signal modules (5 modules) |
| `feature/rest-api` | REST API layer on top of base modules |

---

## Architecture Pattern

Every module follows one rule:

```
SignalInput  →  Service  →  SignalOutput
```

- **SignalInput** — shared raw signal contract
- **Service** — single transformation, one responsibility
- **SignalOutput** — isolated, readable result object

---

## Project Structure

```
signal-intelligence/
├── src/
│   ├── models/
│   │   ├── SignalInput.ts
│   │   └── SignalOutput.ts
│   ├── modules/
│   │   ├── SignalRegistry/
│   │   │   ├── SignalRegistryService.ts
│   │   │   ├── SignalRegistryController.ts
│   │   │   └── SignalRegistryRoute.ts
│   │   ├── SignalClassification/
│   │   │   ├── SignalClassificationService.ts
│   │   │   ├── SignalClassificationController.ts
│   │   │   └── SignalClassificationRoute.ts
│   │   └── SignalPriorityEngine/
│   │       ├── SignalPriorityEngineService.ts
│   │       ├── SignalPriorityEngineController.ts
│   │       └── SignalPriorityEngineRoute.ts
│   ├── db/
│   │   └── InMemorySignalStore.ts
│   ├── routes/
│   │   └── index.ts
│   ├── middleware/
│   │   └── error.middleware.ts
│   ├── utils/
│   │   └── catchAsync.ts
│   ├── demo/
│   │   └── demo.ts
│   ├── app.ts
│   └── server.ts
├── nodemon.json
├── package.json
└── tsconfig.json
```

---

## Modules

| # | Module | Responsibility |
|---|---|---|
| 1 | `SignalRegistry` | Register and acknowledge incoming signals |
| 2 | `SignalClassification` | Classify signal as CRITICAL / HIGH / STANDARD / LOW / NOISE |
| 3 | `SignalPriorityEngine` | Assign priority tier P0\_URGENT through P4\_DEFERRED |

---

## API Endpoints

Base URL: `http://localhost:3000`

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/health` | Health check |
| `POST` | `/api/signals/register` | Register a signal |
| `POST` | `/api/signals/classify` | Classify a signal |
| `POST` | `/api/signals/prioritize` | Assign priority to a signal |
| `GET` | `/api/signals` | Get all processed signals |
| `GET` | `/api/signals/:id` | Get one signal by ID |

---

## Request Body

```json
{
  "id": "signal-001",
  "signalType": "urgency_signal",
  "signalCategory": "routing",
  "signalSource": "country_relationship_layer",
  "signalValue": "medium",
  "priorityLevel": 4,
  "timestamp": "2026-03-11T17:00:00.000Z",
  "version": 1,
  "isActive": true
}
```

---

## Stack

- **Runtime:** Node.js
- **Language:** TypeScript (strict mode)
- **Framework:** Express.js
- **Storage:** In-memory Map store
- **Security:** Helmet, CORS, Compression
- **Dev tools:** ts-node, nodemon

---

## Scripts

```bash
npm run dev     # development — auto-restart on file changes
npm start       # production run
npm run demo    # run signal family execution demo
```
