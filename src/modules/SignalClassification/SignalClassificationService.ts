import { SignalInput } from '../../models/SignalInput';
import { SignalOutput } from '../../models/SignalOutput';

type ClassificationLabel = 'CRITICAL' | 'HIGH' | 'STANDARD' | 'LOW' | 'NOISE';

const HIGH_IMPACT_CATEGORIES = new Set(['security', 'routing', 'incident']);
const TRUSTED_HIGH_IMPACT_SOURCES = ['country_relationship_layer', 'threat_intel'];

function hoursSince(timestamp: string): number {
  const then = new Date(timestamp).getTime();
  if (Number.isNaN(then)) return 999;
  return (Date.now() - then) / (1000 * 60 * 60);
}

function computeClassificationScore(signal: SignalInput): number {
  let score = signal.priorityLevel * 15;
  const normalizedValue = signal.signalValue.toLowerCase();
  const normalizedCategory = signal.signalCategory.toLowerCase();
  const normalizedSource = signal.signalSource.toLowerCase();

  if (normalizedValue.includes('critical') || normalizedValue.includes('severe')) score += 25;
  if (normalizedValue.includes('high')) score += 15;
  if (normalizedValue.includes('low') || normalizedValue.includes('noise')) score -= 10;

  if (HIGH_IMPACT_CATEGORIES.has(normalizedCategory)) score += 15;
  if (TRUSTED_HIGH_IMPACT_SOURCES.some((source) => normalizedSource.includes(source))) score += 10;
  if (!signal.isActive) score -= 30;
  if (hoursSince(signal.timestamp) > 24) score -= 15;

  return score;
}

function classifySignal(score: number): ClassificationLabel {
  if (score >= 90) return 'CRITICAL';
  if (score >= 70) return 'HIGH';
  if (score >= 45) return 'STANDARD';
  if (score >= 25) return 'LOW';
  return 'NOISE';
}

export class SignalClassificationService {
  process(signal: SignalInput): SignalOutput {
    const score = computeClassificationScore(signal);
    const label: ClassificationLabel = classifySignal(score);

    return {
      id: crypto.randomUUID(),
      inputSignalId: signal.id,
      processedBy: 'SignalClassification',
      status: 'CLASSIFIED',
      result: `Signal [${signal.signalType}] classified as [${label}].`,
      priorityLevel: signal.priorityLevel,
      metadata: [
        `classification_score:${score}`,
        `classification_label:${label}`,
        `category:${signal.signalCategory}`,
        `source:${signal.signalSource}`,
        `active:${signal.isActive}`,
      ],
      processedAt: new Date().toISOString(),
    };
  }
}
