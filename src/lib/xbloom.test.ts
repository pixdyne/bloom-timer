import { describe, it, expect } from 'vitest';
import {
  xbloomProfileToJSON,
  xbloomProfileToFilename,
  xbloomProfileToQRPayload,
} from './xbloom';
import type { XBloomProfile } from './types';

const sample: XBloomProfile = {
  bean: { dose_g: 15, grindSetting: 5 },
  water: { total_g: 250, tempC: 93 },
  pours: [
    { startSec: 0,  endSec: 45, targetWeight_g: 50,  pattern: 'center',      speed: 'medium' },
    { startSec: 45, endSec: 75, targetWeight_g: 100, pattern: 'spiral-out',  speed: 'medium' },
  ],
  bloomTime_sec: 45,
  totalTime_sec: 210,
  firmwareVersion: 'Studio v2.3',
  verifiedDate: '2026-04-28',
};

describe('xbloomProfileToJSON', () => {
  it('returns valid JSON', () => {
    const out = xbloomProfileToJSON(sample);
    const parsed = JSON.parse(out);
    expect(parsed.bean.dose_g).toBe(15);
    expect(parsed.water.total_g).toBe(250);
    expect(parsed.pours).toHaveLength(2);
  });

  it('is pretty-printed (multi-line)', () => {
    const out = xbloomProfileToJSON(sample);
    expect(out.split('\n').length).toBeGreaterThan(5);
  });

  it('round-trips losslessly', () => {
    const json = xbloomProfileToJSON(sample);
    const parsed = JSON.parse(json) as XBloomProfile;
    expect(parsed).toEqual(sample);
  });
});

describe('xbloomProfileToFilename', () => {
  it('returns slug.xbloomprofile', () => {
    expect(xbloomProfileToFilename('hoffmann-v60')).toBe('hoffmann-v60.xbloomprofile');
  });

  it('strips unsafe characters', () => {
    expect(xbloomProfileToFilename('foo/bar baz!')).toBe('foo-bar-baz.xbloomprofile');
  });
});

describe('xbloomProfileToQRPayload', () => {
  it('returns a string', () => {
    const out = xbloomProfileToQRPayload(sample);
    expect(typeof out).toBe('string');
  });

  it('embeds the JSON payload', () => {
    const out = xbloomProfileToQRPayload(sample);
    expect(out).toContain('15');
    expect(out).toContain('250');
  });

  it('keeps payload reasonably small for QR (< 1500 chars)', () => {
    const out = xbloomProfileToQRPayload(sample);
    expect(out.length).toBeLessThan(1500);
  });
});
