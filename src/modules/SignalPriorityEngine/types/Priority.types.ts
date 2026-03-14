export type PriorityTier = 'P0_URGENT' | 'P1_HIGH' | 'P2_MEDIUM' | 'P3_LOW' | 'P4_DEFERRED';

export interface PriorityDecision {
  score: number;
  tier: PriorityTier;
}
