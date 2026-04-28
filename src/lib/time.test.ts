import { describe, it, expect } from 'vitest';
import { formatMMSS, parseMMSS, secondsBetween } from './time';

describe('formatMMSS', () => {
  it('formats 0 as 00:00', () => {
    expect(formatMMSS(0)).toBe('00:00');
  });
  it('formats 65 seconds as 01:05', () => {
    expect(formatMMSS(65)).toBe('01:05');
  });
  it('formats 600 seconds as 10:00', () => {
    expect(formatMMSS(600)).toBe('10:00');
  });
  it('floors fractional seconds', () => {
    expect(formatMMSS(45.9)).toBe('00:45');
  });
  it('clamps negative to 00:00', () => {
    expect(formatMMSS(-5)).toBe('00:00');
  });
});

describe('parseMMSS', () => {
  it('parses 02:30 as 150 seconds', () => {
    expect(parseMMSS('02:30')).toBe(150);
  });
  it('parses 0:00 as 0', () => {
    expect(parseMMSS('00:00')).toBe(0);
  });
  it('throws on invalid format', () => {
    expect(() => parseMMSS('foo')).toThrow();
    expect(() => parseMMSS('1:2:3')).toThrow();
  });
});

describe('secondsBetween', () => {
  it('returns difference in seconds', () => {
    const t0 = 1000;
    const t1 = 4500;
    expect(secondsBetween(t0, t1)).toBeCloseTo(3.5, 2);
  });
});
