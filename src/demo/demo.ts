import { SignalInput } from '../models/SignalInput';
import { SignalOrchestrator } from '../orchestrator/SignalOrchestrator';

const sampleSignal: SignalInput = {
  id: crypto.randomUUID(),
  signalType: 'urgency_signal',
  signalCategory: 'security',
  signalSource: 'country_relationship_layer',
  signalValue: 'high, immediate attention',
  priorityLevel: 4,
  timestamp: new Date().toISOString(),
  version: 1,
  isActive: true,
};

function separator(title: string): void {
  console.log('\n' + '-'.repeat(60));
  console.log(`  ${title}`);
  console.log('-'.repeat(60));
}

const orchestrator = new SignalOrchestrator();
const pipeline = orchestrator.run(sampleSignal);

separator('INPUT -> SignalInput');
console.log(sampleSignal);

separator('MODULE 1 -> SignalRegistry');
console.log(pipeline.registryOutput);

separator('TRANSFORMED INPUT -> SignalClassification');
console.log(pipeline.classificationInput);
console.log(pipeline.classificationOutput);

separator('TRANSFORMED INPUT -> SignalPriorityEngine');
console.log(pipeline.priorityInput);
console.log(pipeline.priorityOutput);

separator('FINAL OUTPUT');
console.log(pipeline.finalOutput);
