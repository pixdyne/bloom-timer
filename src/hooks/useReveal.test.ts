import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useReveal } from './useReveal';

type ObserverCb = IntersectionObserverCallback;

class MockIntersectionObserver implements IntersectionObserver {
  static instances: MockIntersectionObserver[] = [];
  callback: ObserverCb;
  observed: Element[] = [];
  unobserved: Element[] = [];
  root = null;
  rootMargin = '';
  thresholds: ReadonlyArray<number> = [];

  constructor(cb: ObserverCb) {
    this.callback = cb;
    MockIntersectionObserver.instances.push(this);
  }
  observe(el: Element) { this.observed.push(el); }
  unobserve(el: Element) { this.unobserved.push(el); }
  disconnect() { this.observed = []; }
  takeRecords(): IntersectionObserverEntry[] { return []; }

  trigger(isIntersecting: boolean) {
    const entries = this.observed.map((el) => ({
      target: el,
      isIntersecting,
      intersectionRatio: isIntersecting ? 1 : 0,
      boundingClientRect: {} as DOMRectReadOnly,
      intersectionRect: {} as DOMRectReadOnly,
      rootBounds: null,
      time: 0,
    })) as IntersectionObserverEntry[];
    this.callback(entries, this);
  }
}

describe('useReveal', () => {
  beforeEach(() => {
    MockIntersectionObserver.instances = [];
    (globalThis as unknown as { IntersectionObserver: typeof IntersectionObserver }).IntersectionObserver =
      MockIntersectionObserver as unknown as typeof IntersectionObserver;
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('starts not in view', () => {
    const { result } = renderHook(() => useReveal());
    expect(result.current.inView).toBe(false);
  });

  it('observes the element when ref is attached', () => {
    const { result } = renderHook(() => useReveal());
    const el = document.createElement('div');
    act(() => {
      result.current.ref(el);
    });
    expect(MockIntersectionObserver.instances[0]?.observed).toContain(el);
  });

  it('flips to in view when observer fires intersecting', () => {
    const { result } = renderHook(() => useReveal());
    const el = document.createElement('div');
    act(() => {
      result.current.ref(el);
    });
    act(() => {
      MockIntersectionObserver.instances[0]?.trigger(true);
    });
    expect(result.current.inView).toBe(true);
  });

  it('unobserves after first reveal (one-shot)', () => {
    const { result } = renderHook(() => useReveal());
    const el = document.createElement('div');
    act(() => {
      result.current.ref(el);
    });
    act(() => {
      MockIntersectionObserver.instances[0]?.trigger(true);
    });
    expect(MockIntersectionObserver.instances[0]?.unobserved).toContain(el);
  });

  it('respects prefers-reduced-motion (always inView=true)', () => {
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      configurable: true,
      value: (q: string): MediaQueryList => ({
        matches: q === '(prefers-reduced-motion: reduce)',
        media: q,
        onchange: null,
        addListener: () => {},
        removeListener: () => {},
        addEventListener: () => {},
        removeEventListener: () => {},
        dispatchEvent: () => false,
      } as unknown as MediaQueryList),
    });
    const { result } = renderHook(() => useReveal());
    expect(result.current.inView).toBe(true);
  });
});
