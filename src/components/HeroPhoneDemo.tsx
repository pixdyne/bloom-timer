'use client';

import { useEffect, useState } from 'react';

type Stage = { name: string; target: number; range: [number, number]; label: string };

const STAGES: Stage[] = [
  { name: 'Bloom',       target: 50,  range: [0,   45],  label: 'step 1 of 5' },
  { name: 'First Pour',  target: 100, range: [45,  75],  label: 'step 2 of 5' },
  { name: 'Second Pour', target: 175, range: [75,  105], label: 'step 3 of 5' },
  { name: 'Final Pour',  target: 250, range: [105, 150], label: 'step 4 of 5' },
  { name: 'Drawdown',    target: 250, range: [150, 210], label: 'step 5 of 5' },
];

const TOTAL_SEC = 210;

export function HeroPhoneDemo() {
  const [sec, setSec] = useState(0);

  useEffect(() => {
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (reduce) return;
    const id = window.setInterval(() => {
      setSec((s) => (s + 1) % TOTAL_SEC);
    }, 60);
    return () => window.clearInterval(id);
  }, []);

  const stage = STAGES.find((s) => sec >= s.range[0] && sec < s.range[1]) ?? STAGES[0]!;
  const mm = String(Math.floor(sec / 60)).padStart(2, '0');
  const ss = String(sec % 60).padStart(2, '0');
  const progressPct = (sec / TOTAL_SEC) * 100;

  return (
    <div className="relative flex justify-center" aria-hidden="true">
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <span className="absolute h-[300px] w-[300px] animate-[bloomring_4s_ease-out_infinite] rounded-full border border-[var(--color-accent)] opacity-0" />
        <span className="absolute h-[300px] w-[300px] animate-[bloomring_4s_ease-out_infinite_1.3s] rounded-full border border-[var(--color-accent)] opacity-0" />
        <span className="absolute h-[300px] w-[300px] animate-[bloomring_4s_ease-out_infinite_2.6s] rounded-full border border-[var(--color-accent)] opacity-0" />
      </div>

      <div
        className="relative z-10 h-[640px] w-[320px] rounded-[44px] p-[14px]"
        style={{
          background: '#0e0c0a',
          boxShadow:
            '0 32px 80px -20px rgba(26, 22, 18, 0.35), 0 0 0 1px rgba(26, 22, 18, 0.1), inset 0 0 0 1px rgba(255, 255, 255, 0.04)',
        }}
      >
        <div
          className="relative flex h-full w-full flex-col overflow-hidden rounded-[32px] px-6 py-7"
          style={{ background: '#0a0908', color: '#fafaf7' }}
        >
          <span
            className="absolute left-1/2 top-3 h-[26px] w-[90px] -translate-x-1/2 rounded-full"
            style={{ background: '#0e0c0a', zIndex: 3 }}
          />
          <span
            className="pointer-events-none absolute left-1/2 top-1/2 h-[200px] w-[200px] -translate-x-1/2 -translate-y-1/2 rounded-full animate-[bloompulse_3.5s_ease-in-out_infinite]"
            style={{
              background:
                'radial-gradient(circle, rgba(200, 105, 58, 0.3) 0%, rgba(200, 105, 58, 0.05) 60%, transparent 100%)',
              filter: 'blur(2px)',
            }}
          />

          <div className="relative z-[2] mt-[18px] mb-8 flex justify-between font-mono text-[11px]" style={{ color: 'rgba(250,250,247,0.5)' }}>
            <span>9:41</span>
            <span>bloom.</span>
          </div>

          <div className="relative z-[2] mb-1.5 font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--color-accent)]">
            — {stage.label}
          </div>
          <div className="relative z-[2] mb-8 font-display text-[22px]">{stage.name}</div>

          <div className="relative z-[2] font-mono text-[76px] font-medium leading-none tracking-[-0.04em] tabular-nums">
            <span>{mm}</span>
            <span className="text-[var(--color-accent)]">:</span>
            <span>{ss}</span>
          </div>

          <div className="relative z-[2] mt-7 mb-1.5 font-mono text-[10px] uppercase tracking-[0.18em]" style={{ color: 'rgba(250,250,247,0.5)' }}>
            pour to
          </div>
          <div className="relative z-[2] font-sans text-[32px] font-semibold tracking-[-0.015em]">
            <span className="text-[var(--color-accent)]">{stage.target}</span>
            <span className="ml-0.5 text-[20px] font-medium" style={{ color: 'rgba(250,250,247,0.4)' }}>g</span>
          </div>

          <div className="relative z-[2] mt-auto pb-3">
            <div className="mb-2 h-[3px] overflow-hidden rounded-full" style={{ background: 'rgba(250,250,247,0.08)' }}>
              <div
                className="h-full rounded-full transition-[width] duration-100"
                style={{ width: `${progressPct}%`, background: 'var(--color-accent)' }}
              />
            </div>
            <div className="flex justify-between font-mono text-[10px] tabular-nums" style={{ color: 'rgba(250,250,247,0.4)' }}>
              <span>{mm}:{ss}</span>
              <span>03:30</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
