'use client';

import { useReveal } from '@/hooks/useReveal';
import { useTickingNumber } from '@/hooks/useTickingNumber';

type Props = {
  target: number;
  duration?: number;
  decimals?: number;
  className?: string;
};

export function Ticker({ target, duration = 1400, decimals = 0, className }: Props) {
  const { ref, inView } = useReveal({ threshold: 0.5 });
  const value = useTickingNumber({ target, duration, start: inView });
  const display = decimals > 0 ? value.toFixed(decimals) : Math.round(value).toString();
  return (
    <span ref={ref as (node: Element | null) => void} className={className}>
      {display}
    </span>
  );
}
