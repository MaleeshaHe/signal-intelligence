import { SignalInput } from '../../models/SignalInput';
import { SignalOutput } from '../../models/SignalOutput';

export class SignalRegistryService {
  process(signal: SignalInput): SignalOutput {
    return {
      id: crypto.randomUUID(),
      inputSignalId: signal.id,
      processedBy: 'SignalRegistry',
      status: 'REGISTERED',
      result: `Signal [${signal.signalType}] from [${signal.signalSource}] has been registered.`,
      priorityLevel: signal.priorityLevel,
      metadata: [
        'signal_registry_baseline',
        `category:${signal.signalCategory}`,
        `version:${signal.version}`,
        `active:${signal.isActive}`,
      ],
      processedAt: new Date().toISOString(),
    };
  }
}
