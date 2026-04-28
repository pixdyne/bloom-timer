import { useCallback, useEffect, useRef, useState } from 'react';

type Options = {
  threshold?: number;
  rootMargin?: string;
};

export function useReveal({ threshold = 0.12, rootMargin = '0px 0px -8% 0px' }: Options = {}) {
  const reduce = typeof window !== 'undefined'
    && typeof window.matchMedia === 'function'
    && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const [inView, setInView] = useState<boolean>(reduce);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const elRef = useRef<Element | null>(null);

  const ref = useCallback((node: Element | null) => {
    if (observerRef.current && elRef.current) {
      observerRef.current.unobserve(elRef.current);
    }
    elRef.current = node;
    if (!node || reduce) return;

    if (!observerRef.current) {
      observerRef.current = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting) {
              setInView(true);
              observerRef.current?.unobserve(entry.target);
            }
          }
        },
        { threshold, rootMargin },
      );
    }
    observerRef.current.observe(node);
  }, [threshold, rootMargin, reduce]);

  useEffect(() => {
    return () => {
      observerRef.current?.disconnect();
      observerRef.current = null;
    };
  }, []);

  return { ref, inView };
}
