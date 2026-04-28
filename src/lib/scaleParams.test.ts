import { describe, it, expect } from 'vitest';
import { parseScaleParams, MIN_CUPS, MAX_CUPS, MIN_RATIO, MAX_RATIO } from './scaleParams';

describe('parseScaleParams', () => {
  it('returns defaults when params are null', () => {
    const params = new URLSearchParams();
    const result = parseScaleParams(params, { defaultCups: 1, defaultRatio: 16.7 });
    expect(result.cups).toBe(1);
    expect(result.ratio).toBe(16.7);
  });

  it('reads cups and ratio from URL', () => {
    const params = new URLSearchParams('?cups=2&ratio=16');
    const result = parseScaleParams(params, { defaultCups: 1, defaultRatio: 16.7 });
    expect(result.cups).toBe(2);
    expect(result.ratio).toBe(16);
  });

  it('clamps cups to MAX_CUPS', () => {
    const params = new URLSearchParams('?cups=99');
    const result = parseScaleParams(params, { defaultCups: 1, defaultRatio: 16 });
    expect(result.cups).toBe(MAX_CUPS);
  });

  it('clamps cups to MIN_CUPS', () => {
    const params = new URLSearchParams('?cups=0');
    const result = parseScaleParams(params, { defaultCups: 1, defaultRatio: 16 });
    expect(result.cups).toBe(MIN_CUPS);
  });

  it('clamps ratio to MIN_RATIO and MAX_RATIO', () => {
    expect(parseScaleParams(new URLSearchParams('?ratio=5'), { defaultCups: 1, defaultRatio: 16 }).ratio).toBe(MIN_RATIO);
    expect(parseScaleParams(new URLSearchParams('?ratio=99'), { defaultCups: 1, defaultRatio: 16 }).ratio).toBe(MAX_RATIO);
  });

  it('falls back to defaults on non-numeric values', () => {
    const params = new URLSearchParams('?cups=abc&ratio=xyz');
    const result = parseScaleParams(params, { defaultCups: 1, defaultRatio: 16.7 });
    expect(result.cups).toBe(1);
    expect(result.ratio).toBe(16.7);
  });

  it('rounds cups to integer', () => {
    const params = new URLSearchParams('?cups=2.7');
    const result = parseScaleParams(params, { defaultCups: 1, defaultRatio: 16 });
    expect(result.cups).toBe(3);
  });

  it('preserves ratio decimals', () => {
    const params = new URLSearchParams('?ratio=15.5');
    const result = parseScaleParams(params, { defaultCups: 1, defaultRatio: 16 });
    expect(result.ratio).toBe(15.5);
  });

  it('reports whether params are at default', () => {
    const defaults = { defaultCups: 1, defaultRatio: 16.7 };
    expect(parseScaleParams(new URLSearchParams(), defaults).isDefault).toBe(true);
    expect(parseScaleParams(new URLSearchParams('?cups=1&ratio=16.7'), defaults).isDefault).toBe(true);
    expect(parseScaleParams(new URLSearchParams('?cups=2'), defaults).isDefault).toBe(false);
  });

  it('clamps out-of-range defaults so isDefault still works', () => {
    // Moka recipe scenario: baseRatio is 10, below MIN_RATIO=8 we'd be fine, but
    // if a recipe ever has e.g. baseRatio: 25 (above MAX_RATIO=20) the default
    // should still produce isDefault: true on an empty query.
    const params = new URLSearchParams();
    const result = parseScaleParams(params, { defaultCups: 1, defaultRatio: 25 });
    expect(result.ratio).toBe(MAX_RATIO);
    expect(result.isDefault).toBe(true);
  });
});
