import { SignalInput } from '../../models/SignalInput';
import { SignalOutput } from '../../models/SignalOutput';
import { PriorityDecision, PriorityTier } from './types/Priority.types';

function parseClassificationLabel(signalValue: string): string {
  const marker = signalValue.match(/classification:(CRITICAL|HIGH|STANDARD|LOW|NOISE)/i);
  return marker?.[1]?.toUpperCase() ?? 'STANDARD';
}

function hasEscalationHint(signalValue: string): boolean {
  const normalized = signalValue.toLowerCase();
  return normalized.includes('escalate') || normalized.includes('immediate') || normalized.includes('urgent');
}

function isStaleSignal(timestamp: string): boolean {
  const signalTime = new Date(timestamp).getTime();
  if (Number.isNaN(signalTime)) return true;
  const ageHours = (Date.now() - signalTime) / (1000 * 60 * 60);
  return ageHours > 48;
}

function computePriorityScore(signal: SignalInput): number {
  let score = signal.priorityLevel * 18;
  const classificationLabel = parseClassificationLabel(signal.signalValue);

  if (classificationLabel === 'CRITICAL') score += 28;
  if (classificationLabel === 'HIGH') score += 18;
  if (classificationLabel === 'LOW' || classificationLabel === 'NOISE') score -= 20;

  if (signal.signalCategory.toLowerCase().includes('security')) score += 15;
  if (signal.signalSource.toLowerCase().includes('country_relationship_layer')) score += 8;
  if (hasEscalationHint(signal.signalValue)) score += 12;
  if (!signal.isActive) score -= 30;
  if (isStaleSignal(signal.timestamp)) score -= 20;

  return score;
}

function computePriorityTier(signal: SignalInput, score: number): PriorityTier {
  if (!signal.isActive || isStaleSignal(signal.timestamp)) return 'P4_DEFERRED';
  if (score >= 100) return 'P0_URGENT';
  if (score >= 75) return 'P1_HIGH';
  if (score >= 50) return 'P2_MEDIUM';
  if (score >= 30) return 'P3_LOW';
  return 'P4_DEFERRED';
}

export class SignalPriorityEngineService {
  process(signal: SignalInput): SignalOutput {
    const score = computePriorityScore(signal);
    const decision: PriorityDecision = {
      score,
      tier: computePriorityTier(signal, score),
    };
    const classificationLabel = parseClassificationLabel(signal.signalValue);

    return {
      id: crypto.randomUUID(),
      inputSignalId: signal.id,
      processedBy: 'SignalPriorityEngine',
      status: 'PRIORITY_ASSIGNED',
      result: `Signal [${signal.signalType}] assigned priority tier [${decision.tier}].`,
      priorityLevel: signal.priorityLevel,
      metadata: [
        `priority_score:${decision.score}`,
        `priority_tier:${decision.tier}`,
        `classification:${classificationLabel}`,
        `is_active:${signal.isActive}`,
        `raw_priority:${signal.priorityLevel}`,
        `source:${signal.signalSource}`,
      ],
      processedAt: new Date().toISOString(),
    };
  }
}
