'use client';

import { useEffect, useReducer, useRef } from 'react';
import { initialTimerState, timerReducer } from '@/hooks/timerReducer';
import { useWakeLock } from '@/hooks/useWakeLock';
import { findCurrentStepIndex } from '@/lib/currentStep';
import { formatMMSS } from '@/lib/time';
import { playEnd, playStage } from '@/lib/audio';
import type { Recipe } from '@/lib/types';

type Props = { recipe: Recipe };

export function BrewTimer({ recipe }: Props) {
  const [state, dispatch] = useReducer(timerReducer, initialTimerState);
  const lastStageIndex = useRef<number>(-1);
  const endedRef = useRef(false);

  useWakeLock(state.status === 'running');

  // RAF tick loop
  useEffect(() => {
    if (state.status !== 'running') return;
    let raf = 0;
    const loop = () => {
      dispatch({ type: 'tick', nowMs: performance.now() });
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [state.status]);

  // Stage transition audio
  useEffect(() => {
    if (state.status !== 'running') {
      lastStageIndex.current = -1;
      endedRef.current = false;
      return;
    }
    const idx = findCurrentStepIndex(recipe.steps, state.elapsedSec);
    if (idx !== lastStageIndex.current) {
      if (lastStageIndex.current !== -1) playStage();
      lastStageIndex.current = idx;
    }
    if (state.elapsedSec >= recipe.totalTimeSec && !endedRef.current) {
      playEnd();
      endedRef.current = true;
    }
  }, [state.elapsedSec, state.status, recipe.steps, recipe.totalTimeSec]);

  const idx = findCurrentStepIndex(recipe.steps, state.elapsedSec);
  const currentStep = recipe.steps[idx];
  const targetText = currentStep?.targetWeight !== undefined
    ? `${currentStep.targetWeight}g`
    : currentStep?.action ?? '—';

  return (
    <section className="my-12 rounded-2xl border border-[var(--color-line)] bg-[var(--color-bg-warm)] p-8 md:p-12">
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-[var(--color-accent)]">
        — {state.status === 'idle' ? 'ready' : `step ${idx + 1} of ${recipe.steps.length}`}
      </p>

      <div className="mt-6 grid grid-cols-1 items-end gap-8 md:grid-cols-[auto_1fr]">
        <p
          className="font-mono text-7xl tabular-nums tracking-tight md:text-9xl"
          aria-live="polite"
        >
          {formatMMSS(state.elapsedSec)}
        </p>
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-[var(--color-muted)]">
            {state.status === 'idle' ? 'tare scale, then begin' : currentStep?.action ?? 'idle'}
          </p>
          <p className="mt-2 font-display text-5xl text-[var(--color-accent)] md:text-6xl">
            {state.status === 'idle' ? '—' : targetText}
          </p>
          {state.status !== 'idle' && currentStep?.note && (
            <p className="mt-2 text-[var(--color-ink-2)]">{currentStep.note}</p>
          )}
        </div>
      </div>

      <div className="mt-8 flex flex-wrap gap-3">
        {state.status === 'idle' && (
          <button
            type="button"
            onClick={() => dispatch({ type: 'start', nowMs: performance.now() })}
            className="rounded-full bg-[var(--color-ink)] px-6 py-3 font-medium text-[var(--color-bg)] transition hover:opacity-85"
          >
            Begin brewing
          </button>
        )}
        {state.status === 'running' && (
          <button
            type="button"
            onClick={() => dispatch({ type: 'pause', nowMs: performance.now() })}
            className="rounded-full bg-[var(--color-ink)] px-6 py-3 font-medium text-[var(--color-bg)] transition hover:opacity-85"
          >
            Pause
          </button>
        )}
        {state.status === 'paused' && (
          <button
            type="button"
            onClick={() => dispatch({ type: 'resume', nowMs: performance.now() })}
            className="rounded-full bg-[var(--color-accent)] px-6 py-3 font-medium text-[var(--color-bg)] transition hover:opacity-85"
          >
            Resume
          </button>
        )}
        {state.status !== 'idle' && (
          <button
            type="button"
            onClick={() => dispatch({ type: 'reset' })}
            className="rounded-full border border-[var(--color-line-strong)] px-6 py-3 transition hover:bg-[var(--color-bg-deep)]"
          >
            Reset
          </button>
        )}
      </div>

      <div className="mt-6 h-1 overflow-hidden rounded-full bg-[var(--color-line)]">
        <div
          className="h-full bg-[var(--color-accent)] transition-[width]"
          style={{
            width: `${Math.min(100, (state.elapsedSec / recipe.totalTimeSec) * 100)}%`,
          }}
        />
      </div>
      <div className="mt-2 flex justify-between font-mono text-xs text-[var(--color-muted)]">
        <span>00:00</span>
        <span>{formatMMSS(recipe.totalTimeSec)}</span>
      </div>
    </section>
  );
}
