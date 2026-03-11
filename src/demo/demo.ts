import { SignalInput } from '../models/SignalInput';
import { SignalRegistryService } from '../modules/SignalRegistry/SignalRegistryService';
import { SignalClassificationService } from '../modules/SignalClassification/SignalClassificationService';
import { SignalPriorityEngineService } from '../modules/SignalPriorityEngine/SignalPriorityEngineService';

// ─── Sample Signal Input ──────────────────────────────────
const sampleSignal: SignalInput = {
  id: crypto.randomUUID(),
  signalType: 'urgency_signal',
  signalCategory: 'routing',
  signalSource: 'country_relationship_layer',
  signalValue: 'medium',
  priorityLevel: 4,
  timestamp: new Date().toISOString(),
  version: 1,
  isActive: true,
};

function separator(title: string): void {
  console.log('\n' + '─'.repeat(60));
  console.log(`  ${title}`);
  console.log('─'.repeat(60));
}

// ─── INPUT ────────────────────────────────────────────────
separator('INPUT — SignalInput');
console.log(sampleSignal);

// ─── MODULE 1: SignalRegistry ─────────────────────────────
separator('MODULE 1 — SignalRegistry');
const registry = new SignalRegistryService();
console.log(registry.process(sampleSignal));

// ─── MODULE 2: SignalClassification ───────────────────────
separator('MODULE 2 — SignalClassification');
const classification = new SignalClassificationService();
console.log(classification.process(sampleSignal));

// ─── MODULE 3: SignalPriorityEngine ───────────────────────
separator('MODULE 3 — SignalPriorityEngine');
const priority = new SignalPriorityEngineService();
console.log(priority.process(sampleSignal));

separator('DEMO COMPLETE');
