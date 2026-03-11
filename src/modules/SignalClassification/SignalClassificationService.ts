import { SignalInput } from '../../models/SignalInput';
import { SignalOutput } from '../../models/SignalOutput';

type ClassificationLabel = 'CRITICAL' | 'HIGH' | 'STANDARD' | 'LOW' | 'NOISE';

function classifySignal(signal: SignalInput): ClassificationLabel {
  if (signal.priorityLevel >= 5) return 'CRITICAL';
  if (signal.priorityLevel === 4) return 'HIGH';
  if (signal.priorityLevel === 3) return 'STANDARD';
  if (signal.priorityLevel === 2) return 'LOW';
  return 'NOISE';
}

export class SignalClassificationService {
  process(signal: SignalInput): SignalOutput {
    const label: ClassificationLabel = classifySignal(signal);

    return {
      id: crypto.randomUUID(),
      inputSignalId: signal.id,
      processedBy: 'SignalClassification',
      status: 'CLASSIFIED',
      result: `Signal [${signal.signalType}] classified as [${label}].`,
      priorityLevel: signal.priorityLevel,
      metadata: [
        `classification_label:${label}`,
        `category:${signal.signalCategory}`,
        `source:${signal.signalSource}`,
      ],
      processedAt: new Date().toISOString(),
    };
  }
}
