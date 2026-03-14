import { SignalInput } from '../models/SignalInput';
import { SignalOutput } from '../models/SignalOutput';
import { SignalClassificationService } from '../modules/SignalClassification/SignalClassificationService';
import { SignalPriorityEngineService } from '../modules/SignalPriorityEngine/SignalPriorityEngineService';
import { SignalRegistryService } from '../modules/SignalRegistry/SignalRegistryService';

export interface SignalPipelineResult {
  input: SignalInput;
  classificationInput: SignalInput;
  priorityInput: SignalInput;
  registryOutput: SignalOutput;
  classificationOutput: SignalOutput;
  priorityOutput: SignalOutput;
  finalOutput: SignalOutput;
}

function readMetadataNumber(metadata: string[], key: string, fallback: number): number {
  const entry = metadata.find((item) => item.startsWith(`${key}:`));
  if (!entry) return fallback;
  const value = Number(entry.split(':')[1]);
  return Number.isFinite(value) ? value : fallback;
}

function readMetadataString(metadata: string[], key: string, fallback: string): string {
  const entry = metadata.find((item) => item.startsWith(`${key}:`));
  if (!entry) return fallback;
  return entry.split(':').slice(1).join(':');
}

export class SignalOrchestrator {
  constructor(
    private readonly registry: SignalRegistryService = new SignalRegistryService(),
    private readonly classification: SignalClassificationService = new SignalClassificationService(),
    private readonly priority: SignalPriorityEngineService = new SignalPriorityEngineService()
  ) {}

  run(input: SignalInput): SignalPipelineResult {
    const registryOutput = this.registry.process(input);
    const classificationInput = this.buildClassificationInput(input, registryOutput);

    const classificationOutput = this.classification.process(classificationInput);
    const priorityInput = this.buildPriorityInput(classificationInput, registryOutput, classificationOutput);

    const priorityOutput = this.priority.process(priorityInput);
    const finalOutput: SignalOutput = {
      ...priorityOutput,
      id: crypto.randomUUID(),
      processedBy: 'SignalOrchestrator',
      status: 'PIPELINE_COMPLETE',
      result: `Pipeline complete for signal [${input.id}] with final tier decision.`,
      metadata: [
        `registry_status:${registryOutput.status}`,
        `classification_label:${readMetadataString(classificationOutput.metadata, 'classification_label', 'UNKNOWN')}`,
        `final_priority_tier:${readMetadataString(priorityOutput.metadata, 'priority_tier', 'P4_DEFERRED')}`,
      ],
      processedAt: new Date().toISOString(),
    };

    return {
      input,
      classificationInput,
      priorityInput,
      registryOutput,
      classificationOutput,
      priorityOutput,
      finalOutput,
    };
  }

  private buildClassificationInput(input: SignalInput, registryOutput: SignalOutput): SignalInput {
    const registryRiskScore = readMetadataNumber(registryOutput.metadata, 'registry_risk_score', 0);
    const adjustedPriority = Math.min(5, input.priorityLevel + (registryRiskScore >= 55 ? 1 : 0));

    return {
      ...input,
      priorityLevel: adjustedPriority,
      signalValue: `${input.signalValue};registryRisk:${registryRiskScore}`,
    };
  }

  private buildPriorityInput(
    previousInput: SignalInput,
    registryOutput: SignalOutput,
    classificationOutput: SignalOutput
  ): SignalInput {
    const label = readMetadataString(classificationOutput.metadata, 'classification_label', 'STANDARD');
    const classificationScore = readMetadataNumber(classificationOutput.metadata, 'classification_score', 0);
    const registryRiskScore = readMetadataNumber(registryOutput.metadata, 'registry_risk_score', 0);
    const boost = classificationScore >= 85 || registryRiskScore >= 60 ? 1 : 0;

    return {
      ...previousInput,
      priorityLevel: Math.min(5, previousInput.priorityLevel + boost),
      signalValue: `${previousInput.signalValue};classification:${label};escalate:${boost > 0}`,
    };
  }
}
