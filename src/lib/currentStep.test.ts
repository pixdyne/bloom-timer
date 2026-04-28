import { describe, it, expect } from 'vitest';
import { findCurrentStepIndex } from './currentStep';
import type { Step } from './types';

const steps: Step[] = [
  { startSec: 0,   action: 'pour-to', targetWeight: 50 },
  { startSec: 45,  action: 'pour-to', targetWeight: 100 },
  { startSec: 75,  action: 'pour-to', targetWeight: 175 },
  { startSec: 105, action: 'pour-to', targetWeight: 250 },
  { startSec: 150, action: 'wait' },
];

describe('findCurrentStepIndex', () => {
  it('returns 0 at elapsed=0', () => {
    expect(findCurrentStepIndex(steps, 0)).toBe(0);
  });
  it('returns 0 at elapsed=44 (still in step 0)', () => {
    expect(findCurrentStepIndex(steps, 44)).toBe(0);
  });
  it('returns 1 at elapsed=45 (start of step 1)', () => {
    expect(findCurrentStepIndex(steps, 45)).toBe(1);
  });
  it('returns 1 at elapsed=74', () => {
    expect(findCurrentStepIndex(steps, 74)).toBe(1);
  });
  it('returns 4 at elapsed=200', () => {
    expect(findCurrentStepIndex(steps, 200)).toBe(4);
  });
  it('returns 0 for empty steps', () => {
    expect(findCurrentStepIndex([], 100)).toBe(0);
  });
});
