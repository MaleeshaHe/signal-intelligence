import { SignalInput } from '../../models/SignalInput';
import { SignalOutput } from '../../models/SignalOutput';

const TRUSTED_SOURCES = ['country_relationship_layer', 'regional_watchtower', 'threat_intel'];

function isFresh(timestamp: string): boolean {
  const value = new Date(timestamp).getTime();
  if (Number.isNaN(value)) return false;
  const ageHours = (Date.now() - value) / (1000 * 60 * 60);
  return ageHours <= 24;
}

function computeRegistryRiskScore(signal: SignalInput): number {
  let score = signal.priorityLevel * 12;
  if (!signal.isActive) score += 10;
  if (!isFresh(signal.timestamp)) score += 10;
  if (!TRUSTED_SOURCES.includes(signal.signalSource.toLowerCase())) score += 8;
  if (signal.signalCategory.toLowerCase().includes('security')) score += 12;
  return score;
}

export class SignalRegistryService {
  process(signal: SignalInput): SignalOutput {
    const registryRiskScore = computeRegistryRiskScore(signal);
    const fresh = isFresh(signal.timestamp);
    const sourceTrusted = TRUSTED_SOURCES.includes(signal.signalSource.toLowerCase());

    return {
      id: crypto.randomUUID(),
      inputSignalId: signal.id,
      processedBy: 'SignalRegistry',
      status: 'REGISTERED',
      result: `Signal [${signal.signalType}] from [${signal.signalSource}] has been registered.`,
      priorityLevel: signal.priorityLevel,
      metadata: [
        'signal_registry_baseline',
        `registry_risk_score:${registryRiskScore}`,
        `category:${signal.signalCategory}`,
        `version:${signal.version}`,
        `active:${signal.isActive}`,
        `fresh:${fresh}`,
        `source_trusted:${sourceTrusted}`,
      ],
      processedAt: new Date().toISOString(),
    };
  }
}
