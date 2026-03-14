export type ClassificationLabel = 'CRITICAL' | 'HIGH' | 'STANDARD' | 'LOW' | 'NOISE';

export interface ClassificationDecision {
  score: number;
  label: ClassificationLabel;
}
