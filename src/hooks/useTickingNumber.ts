import { useEffect, useRef, useState } from 'react';

type Options = {
  target: number;
  duration: number;
  start: boolean;
};

const easeOutCubic = (t: number): number => 1 - Math.pow(1 - t, 3);

export function useTickingNumber({ target, duration, start }: Options): number {
  const [value, setValue] = useState(0);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (!start) return;
    const t0 = performance.now();
    const isInt = Number.isInteger(target);

    const step = (now: number) => {
      const elapsed = now - t0;
      const progress = Math.min(elapsed / duration, 1);
      const eased = easeOutCubic(progress);
      const next = target * eased;
      setValue(isInt ? Math.round(next) : next);
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(step);
      }
    };

    rafRef.current = requestAnimationFrame(step);
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [target, duration, start]);

  return value;
}
