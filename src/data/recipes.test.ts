import { describe, it, expect } from 'vitest';
import { recipes, recipeBySlug } from './recipes';

describe('recipes data integrity', () => {
  it('has exactly 12 recipes', () => {
    expect(recipes).toHaveLength(12);
  });

  it('all slugs are unique', () => {
    const slugs = recipes.map((r) => r.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it('all slugs are url-safe (kebab-case alphanumeric)', () => {
    for (const r of recipes) {
      expect(r.slug).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
    }
  });

  it('all step.startSec are non-decreasing within each recipe', () => {
    for (const r of recipes) {
      for (let i = 1; i < r.steps.length; i++) {
        expect(r.steps[i]!.startSec).toBeGreaterThanOrEqual(r.steps[i - 1]!.startSec);
      }
    }
  });

  it('totalTimeSec is at least the last step startSec', () => {
    for (const r of recipes) {
      const lastStart = r.steps[r.steps.length - 1]?.startSec ?? 0;
      expect(r.totalTimeSec).toBeGreaterThanOrEqual(lastStart);
    }
  });

  it('recipeBySlug returns the right recipe', () => {
    const r = recipeBySlug('hoffmann-v60');
    expect(r?.name).toBe('Hoffmann V60');
  });

  it('recipeBySlug returns undefined for unknown slug', () => {
    expect(recipeBySlug('does-not-exist')).toBeUndefined();
  });

  it('every recipe has an xbloomProfile', () => {
    for (const r of recipes) {
      expect(r.xbloomProfile).toBeDefined();
    }
  });

  it('xbloomProfile total_g matches dose × ratio (within 1.5g)', () => {
    for (const r of recipes) {
      const expected = r.baseDose * r.baseRatio;
      expect(r.xbloomProfile!.water.total_g).toBeGreaterThan(expected - 1.5);
      expect(r.xbloomProfile!.water.total_g).toBeLessThan(expected + 1.5);
    }
  });

  it('xbloomProfile pours are non-empty for pour-based recipes', () => {
    for (const r of recipes) {
      const hasPourSteps = r.steps.some((s) => s.action === 'pour-to');
      if (hasPourSteps) {
        expect(r.xbloomProfile!.pours.length).toBeGreaterThan(0);
      }
    }
  });
});
