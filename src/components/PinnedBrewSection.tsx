'use client';

import { useEffect, useRef, useState } from 'react';

type Stage = {
  num: string;
  name: string;
  endSec: number;
  target: number;
  copyHeadingHTML: string;
  copyBody: string;
};

const TOTAL_SEC = 210;

const STAGES: Stage[] = [
  {
    num: '01',
    name: 'Bloom',
    endSec: 45,
    target: 50,
    copyHeadingHTML: '<em>Bloom</em>. Forty-five seconds.',
    copyBody: "A small pour, just enough to wet the grounds. CO₂ escapes — that's the bubble. Wait.",
  },
  {
    num: '02',
    name: 'First Pour',
    endSec: 75,
    target: 100,
    copyHeadingHTML: 'The <em>first</em> pour. Thirty seconds.',
    copyBody: 'A steady, central pour. Build to 100g without rushing. The bed should still be flat.',
  },
  {
    num: '03',
    name: 'Second Pour',
    endSec: 105,
    target: 175,
    copyHeadingHTML: 'The <em>second</em> pour. Same rhythm.',
    copyBody: 'Build to 175g. Same speed, same arc. Concentric, controlled, calm.',
  },
  {
    num: '04',
    name: 'Final Pour',
    endSec: 150,
    target: 250,
    copyHeadingHTML: 'The <em>final</em> pour. Forty-five seconds.',
    copyBody: 'To 250g. The water level rises. Aim slightly off-center. Hold steady through the last pour.',
  },
  {
    num: '05',
    name: 'Drawdown',
    endSec: 210,
    target: 250,
    copyHeadingHTML: '<em>Drawdown</em>. Then the cup.',
    copyBody: 'A small swirl to settle the bed. Wait for the last drips. Total time should be near 3:30.',
  },
];

function pickStage(secElapsed: number): number {
  for (let i = 0; i < STAGES.length; i++) {
    if (secElapsed < STAGES[i]!.endSec) return i;
  }
  return STAGES.length - 1;
}

export function PinnedBrewSection() {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const [stageIdx, setStageIdx] = useState(0);
  const [secElapsed, setSecElapsed] = useState(0);

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;

    let ticking = false;

    const update = () => {
      ticking = false;
      const rect = wrap.getBoundingClientRect();
      const wh = window.innerHeight;
      const total = wrap.offsetHeight - wh;
      const scrolled = Math.min(Math.max(-rect.top, 0), total);
      const progress = total > 0 ? scrolled / total : 0;
      const elapsed = progress * TOTAL_SEC;
      setSecElapsed(elapsed);
      setStageIdx(pickStage(elapsed));
    };

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const stage = STAGES[stageIdx]!;
  const mm = String(Math.floor(secElapsed / 60)).padStart(2, '0');
  const ss = String(Math.floor(secElapsed % 60)).padStart(2, '0');

  return (
    <section className="bg-[var(--color-bg-deep)]">
      <div ref={wrapRef} className="relative h-[400vh]">
        <div className="sticky top-0 mx-auto grid h-screen max-w-7xl items-center gap-12 px-6 md:grid-cols-2 md:gap-20 md:px-10">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.18em] text-[var(--color-accent)]">
              <span className="mr-3 inline-block h-px w-6 align-middle bg-[var(--color-accent)]" />
              how it works
            </p>
            <h3
              className="mt-4 font-display text-4xl leading-none tracking-[-0.02em] md:text-6xl"
              dangerouslySetInnerHTML={{ __html: stage.copyHeadingHTML }}
            />
            <p className="mt-6 max-w-prose text-lg text-[var(--color-ink-2)]">{stage.copyBody}</p>

            <div className="mt-10 flex flex-col gap-1">
              {STAGES.map((s, i) => {
                const active = i === stageIdx;
                const done = i < stageIdx;
                const startSec = i === 0 ? 0 : STAGES[i - 1]!.endSec;
                const fmt = (n: number) => `${Math.floor(n / 60)}:${String(n % 60).padStart(2, '0')}`;
                return (
                  <div
                    key={s.num}
                    className="grid grid-cols-[50px_1fr_auto] items-center gap-4 border-b border-[var(--color-line)] py-3 transition-opacity duration-300"
                    style={{ opacity: active ? 1 : done ? 0.5 : 0.3 }}
                  >
                    <span className={`font-mono text-xs ${active ? 'text-[var(--color-accent)]' : 'text-[var(--color-muted)]'}`}>
                      {s.num}
                    </span>
                    <span className="font-display text-xl leading-tight">{s.name}</span>
                    <span className="font-mono text-xs tabular-nums text-[var(--color-muted)]">
                      {fmt(startSec)} — {fmt(s.endSec)}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="relative flex items-center justify-center">
            <div
              className="relative flex h-[280px] w-[280px] items-center justify-center rounded-full md:h-[480px] md:w-[480px]"
              style={{
                background: 'radial-gradient(circle, #2a1a10 0%, #0e0a06 60%, #0a0908 100%)',
                boxShadow:
                  'inset 0 0 80px rgba(0, 0, 0, 0.6), 0 32px 80px -20px rgba(26, 22, 18, 0.4)',
              }}
            >
              <span className="absolute inset-0 rounded-full border border-[var(--color-line-strong)]" />
              <span className="absolute h-full w-full animate-[water_4.5s_ease-out_infinite] rounded-full border-[1.5px] border-[var(--color-accent)] opacity-0" />
              <span className="absolute h-full w-full animate-[water_4.5s_ease-out_infinite_1.5s] rounded-full border-[1.5px] border-[var(--color-accent)] opacity-0" />
              <span className="absolute h-full w-full animate-[water_4.5s_ease-out_infinite_3s] rounded-full border-[1.5px] border-[var(--color-accent)] opacity-0" />
              <div
                className="relative z-10 font-mono text-4xl font-medium tracking-[-0.04em] tabular-nums md:text-[56px]"
                style={{ color: 'rgba(250,250,247,0.95)' }}
              >
                <span>{mm}</span>
                <span className="text-[var(--color-accent)]">:</span>
                <span>{ss}</span>
              </div>
              <div className="absolute bottom-12 left-1/2 -translate-x-1/2 text-center text-[var(--color-bg)]">
                <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--color-accent)]">pour to</p>
                <p className="font-display text-2xl italic md:text-[32px]">{stage.target}g</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
