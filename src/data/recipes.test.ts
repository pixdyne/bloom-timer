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
});
