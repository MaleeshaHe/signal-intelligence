import { SignalInput } from '../../models/SignalInput';
import { SignalOutput } from '../../models/SignalOutput';

type PriorityTier = 'P0_URGENT' | 'P1_HIGH' | 'P2_MEDIUM' | 'P3_LOW' | 'P4_DEFERRED';

function computePriorityTier(signal: SignalInput): PriorityTier {
  if (!signal.isActive) return 'P4_DEFERRED';
  if (signal.priorityLevel >= 5) return 'P0_URGENT';
  if (signal.priorityLevel === 4) return 'P1_HIGH';
  if (signal.priorityLevel === 3) return 'P2_MEDIUM';
  if (signal.priorityLevel === 2) return 'P3_LOW';
  return 'P4_DEFERRED';
}

export class SignalPriorityEngineService {
  process(signal: SignalInput): SignalOutput {
    const tier: PriorityTier = computePriorityTier(signal);

    return {
      id: crypto.randomUUID(),
      inputSignalId: signal.id,
      processedBy: 'SignalPriorityEngine',
      status: 'PRIORITY_ASSIGNED',
      result: `Signal [${signal.signalType}] assigned priority tier [${tier}].`,
      priorityLevel: signal.priorityLevel,
      metadata: [
        `priority_tier:${tier}`,
        `is_active:${signal.isActive}`,
        `raw_priority:${signal.priorityLevel}`,
        `source:${signal.signalSource}`,
      ],
      processedAt: new Date().toISOString(),
    };
  }
}
