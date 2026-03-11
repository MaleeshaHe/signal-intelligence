# Signal Intelligence Family

Modular signal processing backend built with Node.js and TypeScript.
Clean `input → service → output` architecture across all signal modules.

---

## Project Overview

This is **Milestone 1** of the OpenStudyGo AI signal layer.

The goal is to validate repeated modular backend work with a thin, clean signal family — where every module follows the same strict architecture pattern.

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
│   │   ├── SignalInput.ts            # Shared input interface
│   │   └── SignalOutput.ts           # Shared output interface
│   ├── modules/
│   │   ├── SignalRegistry/
│   │   │   └── SignalRegistryService.ts
│   │   ├── SignalClassification/
│   │   │   └── SignalClassificationService.ts
│   │   └── SignalPriorityEngine/
│   │       └── SignalPriorityEngineService.ts
│   └── demo/
│       └── demo.ts                   # Execution proof
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

## Shared Models

### SignalInput

```typescript
export interface SignalInput {
  id: string;
  signalType: string;
  signalCategory: string;
  signalSource: string;
  signalValue: string;
  priorityLevel: number;
  timestamp: string;
  version: number;
  isActive: boolean;
}
```

### SignalOutput

```typescript
export interface SignalOutput {
  id: string;
  inputSignalId: string;
  processedBy: string;
  status: string;
  result: string;
  priorityLevel: number;
  metadata: string[];
  processedAt: string;
}
```

---

## Stack

- **Runtime:** Node.js
- **Language:** TypeScript (strict mode)
- **Execution:** ts-node

---

## Run the Demo

```bash
npm install
npm run demo
```

---

