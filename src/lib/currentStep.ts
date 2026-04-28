import type { Step } from './types';

export function findCurrentStepIndex(steps: Step[], elapsedSec: number): number {
  if (steps.length === 0) return 0;
  let idx = 0;
  for (let i = 0; i < steps.length; i++) {
    if (steps[i]!.startSec <= elapsedSec) idx = i;
    else break;
  }
  return idx;
}
