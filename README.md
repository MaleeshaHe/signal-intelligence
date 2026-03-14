# Signal Intelligence Family

Modular signal processing backend built with Node.js and TypeScript.
This milestone currently implements 3 core modules and one orchestration flow.

## Implemented Scope

Only the following modules are implemented in code:

1. `SignalRegistry`
2. `SignalClassification`
3. `SignalPriorityEngine`

An additional orchestration layer is included:

- `SignalOrchestrator` (runs modules in sequence)

## Processing Flow

The demo now executes a real chained pipeline:

`SignalInput -> SignalRegistry -> transformed input -> SignalClassification -> transformed input -> SignalPriorityEngine -> final output`

## Project Structure

```text
signal-intelligence/
|-- src/
|   |-- models/
|   |   |-- SignalInput.ts
|   |   `-- SignalOutput.ts
|   |-- modules/
|   |   |-- SignalRegistry/
|   |   |   `-- SignalRegistryService.ts
|   |   |-- SignalClassification/
|   |   |   `-- SignalClassificationService.ts
|   |   `-- SignalPriorityEngine/
|   |       `-- SignalPriorityEngineService.ts
|   |-- orchestrator/
|   |   `-- SignalOrchestrator.ts
|   `-- demo/
|       `-- demo.ts
|-- package.json
`-- tsconfig.json
```

## Logic Notes

- Classification now uses multi-factor scoring (priority, value text, category, source, activity, timestamp freshness).
- Priority assignment now uses combined rules (classification signal, escalation hints, source/category signals, freshness/activity guards).
- Registry adds metadata used by downstream stages (including registry risk score).

## Run the Demo

```bash
npm install
npm run demo
```
