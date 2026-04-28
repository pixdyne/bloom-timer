'use client';

import Link from 'next/link';
import { useEffect, useReducer, useRef } from 'react';
import { initialTimerState, timerReducer } from '@/hooks/timerReducer';
import { useWakeLock } from '@/hooks/useWakeLock';
import { findCurrentStepIndex } from '@/lib/currentStep';
import { formatMMSS } from '@/lib/time';
import { playEnd, playStage } from '@/lib/audio';
import type { Recipe } from '@/lib/types';

type Props = { recipe: Recipe };

export function FullscreenTimer({ recipe }: Props) {
  const [state, dispatch] = useReducer(timerReducer, initialTimerState);
  const lastStageIndex = useRef<number>(-1);
  const endedRef = useRef(false);

  useWakeLock(state.status === 'running');

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
  const targetText =
    currentStep?.targetWeight !== undefined
      ? `${currentStep.targetWeight}g`
      : currentStep?.action ?? '—';

  return (
    <div className="fixed inset-0 flex flex-col bg-[#0a0908] text-[#fafaf7]">
      <header className="flex items-center justify-between px-6 py-4">
        <Link
          href={`/recipes/${recipe.slug}`}
          className="font-mono text-xs uppercase tracking-[0.2em] text-[#9a8e82] hover:text-[#fafaf7]"
        >
          ← Exit
        </Link>
        <span className="font-mono text-xs uppercase tracking-[0.2em] text-[#9a8e82]">
          {recipe.name}
        </span>
      </header>

      <main className="flex flex-1 flex-col items-center justify-center px-6">
        <p className="font-mono text-sm uppercase tracking-[0.2em] text-[#c8693a]">
          {state.status === 'idle' ? 'ready' : `step ${idx + 1} of ${recipe.steps.length}`}
        </p>
        <p
          className="mt-6 font-mono text-[18vw] leading-none tabular-nums tracking-tight"
          aria-live="polite"
        >
          {formatMMSS(state.elapsedSec)}
        </p>
        <p className="mt-8 font-display text-6xl text-[#c8693a] md:text-8xl">
          {state.status === 'idle' ? '—' : targetText}
        </p>
        {state.status !== 'idle' && currentStep?.note && (
          <p className="mt-4 max-w-prose text-center text-lg text-[#a3a3a3]">
            {currentStep.note}
          </p>
        )}
      </main>

      <footer className="flex justify-center gap-3 px-6 py-8">
        {state.status === 'idle' && (
          <button
            type="button"
            onClick={() => dispatch({ type: 'start', nowMs: performance.now() })}
            className="rounded-full bg-[#c8693a] px-8 py-4 text-lg font-medium hover:opacity-85"
          >
            Begin
          </button>
        )}
        {state.status === 'running' && (
          <button
            type="button"
            onClick={() => dispatch({ type: 'pause', nowMs: performance.now() })}
            className="rounded-full border border-white/20 px-8 py-4 text-lg hover:bg-white/10"
          >
            Pause
          </button>
        )}
        {state.status === 'paused' && (
          <button
            type="button"
            onClick={() => dispatch({ type: 'resume', nowMs: performance.now() })}
            className="rounded-full bg-[#c8693a] px-8 py-4 text-lg font-medium hover:opacity-85"
          >
            Resume
          </button>
        )}
        {state.status !== 'idle' && (
          <button
            type="button"
            onClick={() => dispatch({ type: 'reset' })}
            className="rounded-full border border-white/20 px-8 py-4 text-lg hover:bg-white/10"
          >
            Reset
          </button>
        )}
      </footer>
    </div>
  );
}
