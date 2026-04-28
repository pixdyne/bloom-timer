import { describe, it, expect } from 'vitest';
import { scaleRecipe } from './scale';
import type { Recipe } from './types';

const hoffmann: Recipe = {
  slug: 'hoffmann-v60',
  name: 'Hoffmann V60',
  brewer: 'v60',
  author: 'James Hoffmann',
  description: '',
  baseCups: 1,
  baseDose: 15,
  baseRatio: 16.7,
  grindSize: 'medium-fine',
  waterTempC: 93,
  totalTimeSec: 210,
  tags: [],
  steps: [
    { startSec: 0,   action: 'pour-to', targetWeight: 50 },
    { startSec: 45,  action: 'pour-to', targetWeight: 100 },
    { startSec: 75,  action: 'pour-to', targetWeight: 175 },
    { startSec: 105, action: 'pour-to', targetWeight: 250 },
    { startSec: 150, action: 'wait' },
  ],
};

describe('scaleRecipe', () => {
  it('returns base values when scale inputs match base', () => {
    const result = scaleRecipe(hoffmann, { userCups: 1, userRatio: 16.7 });
    expect(result.scaledDose).toBeCloseTo(15, 2);
    expect(result.scaledTotalWater).toBeCloseTo(250.5, 2);
    expect(result.scaledSteps[0]?.scaledTargetWeight).toBeCloseTo(50, 2);
    expect(result.scaledSteps[3]?.scaledTargetWeight).toBeCloseTo(250, 2);
  });

  it('doubles step water targets when cups doubles', () => {
    const result = scaleRecipe(hoffmann, { userCups: 2, userRatio: 16.7 });
    expect(result.scaledSteps[0]?.scaledTargetWeight).toBeCloseTo(100, 2);
    expect(result.scaledSteps[3]?.scaledTargetWeight).toBeCloseTo(500, 2);
  });

  it('reduces dose when ratio increases at same cups', () => {
    const result = scaleRecipe(hoffmann, { userCups: 1, userRatio: 18 });
    // dose = 15 * (16.7/18) = 13.916...
    expect(result.scaledDose).toBeCloseTo(13.92, 2);
    // water unchanged when cups unchanged
    expect(result.scaledTotalWater).toBeCloseTo(250.5, 2);
  });

  it('combines cups and ratio change correctly', () => {
    const result = scaleRecipe(hoffmann, { userCups: 2, userRatio: 16 });
    // dose = 2 * 15 * (16.7/16) = 31.31...
    expect(result.scaledDose).toBeCloseTo(31.3125, 3);
    // water = 2 * 250.5 = 501
    expect(result.scaledTotalWater).toBeCloseTo(501, 2);
  });

  it('preserves non-pour-to steps unchanged', () => {
    const result = scaleRecipe(hoffmann, { userCups: 2, userRatio: 16 });
    const waitStep = result.scaledSteps[4];
    expect(waitStep?.action).toBe('wait');
    expect(waitStep?.scaledTargetWeight).toBeUndefined();
    expect(waitStep?.startSec).toBe(150); // time never scales
  });

  it('throws on userCups <= 0', () => {
    expect(() => scaleRecipe(hoffmann, { userCups: 0, userRatio: 16 })).toThrow();
    expect(() => scaleRecipe(hoffmann, { userCups: -1, userRatio: 16 })).toThrow();
  });

  it('throws on userRatio <= 0', () => {
    expect(() => scaleRecipe(hoffmann, { userCups: 1, userRatio: 0 })).toThrow();
  });
});
