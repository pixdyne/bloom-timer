import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useTickingNumber } from './useTickingNumber';

describe('useTickingNumber', () => {
  it('returns 0 when start=false (idle)', () => {
    const { result } = renderHook(() => useTickingNumber({ target: 100, duration: 1000, start: false }));
    expect(result.current).toBe(0);
  });

  it('animates to target over duration when start flips to true', () => {
    const rafs: FrameRequestCallback[] = [];
    vi.stubGlobal('requestAnimationFrame', (cb: FrameRequestCallback) => {
      rafs.push(cb);
      return rafs.length;
    });
    vi.stubGlobal('cancelAnimationFrame', () => {});
    vi.stubGlobal('performance', { now: () => 0 });

    const { result, rerender } = renderHook(
      ({ s }: { s: boolean }) => useTickingNumber({ target: 100, duration: 1000, start: s }),
      { initialProps: { s: false } },
    );
    expect(result.current).toBe(0);

    rerender({ s: true });

    act(() => {
      let now = 0;
      while (rafs.length > 0 && now <= 1000) {
        const cb = rafs.shift();
        if (cb) cb(now);
        now += 100;
      }
    });

    expect(result.current).toBeGreaterThanOrEqual(99);
    expect(result.current).toBeLessThanOrEqual(100);

    vi.unstubAllGlobals();
  });

  it('rounds when target is integer', () => {
    const rafs: FrameRequestCallback[] = [];
    vi.stubGlobal('requestAnimationFrame', (cb: FrameRequestCallback) => { rafs.push(cb); return rafs.length; });
    vi.stubGlobal('cancelAnimationFrame', () => {});
    vi.stubGlobal('performance', { now: () => 0 });

    const { result, rerender } = renderHook(
      ({ s }: { s: boolean }) => useTickingNumber({ target: 5, duration: 100, start: s }),
      { initialProps: { s: false } },
    );
    rerender({ s: true });
    act(() => {
      while (rafs.length > 0) {
        const cb = rafs.shift();
        if (cb) cb(200);
      }
    });
    expect(Number.isInteger(result.current)).toBe(true);

    vi.unstubAllGlobals();
  });
});
