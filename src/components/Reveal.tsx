'use client';

import { useReveal } from '@/hooks/useReveal';
import type { CSSProperties, ElementType, ReactNode } from 'react';

type Props = {
  children: ReactNode;
  delay?: number;
  as?: ElementType;
  className?: string;
};

export function Reveal({ children, delay = 0, as: Tag = 'div', className }: Props) {
  const { ref, inView } = useReveal();

  const style: CSSProperties = {
    opacity: inView ? 1 : 0,
    transform: inView ? 'translateY(0)' : 'translateY(32px)',
    transition: 'opacity 900ms cubic-bezier(0.16, 1, 0.3, 1), transform 900ms cubic-bezier(0.16, 1, 0.3, 1)',
    transitionDelay: `${delay}ms`,
    willChange: 'opacity, transform',
  };

  return (
    <Tag ref={ref as (node: Element | null) => void} style={style} className={className}>
      {children}
    </Tag>
  );
}
