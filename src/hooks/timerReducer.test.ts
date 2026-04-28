import { describe, it, expect } from 'vitest';
import { timerReducer, initialTimerState, type TimerState } from './timerReducer';

describe('timerReducer', () => {
  it('starts in idle status with elapsed=0', () => {
    expect(initialTimerState.status).toBe('idle');
    expect(initialTimerState.elapsedSec).toBe(0);
  });

  it('start transitions idle -> running', () => {
    const next = timerReducer(initialTimerState, { type: 'start', nowMs: 1000 });
    expect(next.status).toBe('running');
    expect(next.startedAtMs).toBe(1000);
  });

  it('tick updates elapsedSec while running', () => {
    const started: TimerState = timerReducer(initialTimerState, { type: 'start', nowMs: 1000 });
    const ticked = timerReducer(started, { type: 'tick', nowMs: 4500 });
    expect(ticked.elapsedSec).toBe(3); // floor((4500-1000)/1000) = 3
  });

  it('pause stops the elapsed counter from advancing', () => {
    let s: TimerState = timerReducer(initialTimerState, { type: 'start', nowMs: 1000 });
    s = timerReducer(s, { type: 'tick', nowMs: 4000 });
    s = timerReducer(s, { type: 'pause', nowMs: 4000 });
    expect(s.status).toBe('paused');
    const stillPaused = timerReducer(s, { type: 'tick', nowMs: 8000 });
    expect(stillPaused.elapsedSec).toBe(s.elapsedSec);
  });

  it('resume from paused continues elapsed counting', () => {
    let s: TimerState = timerReducer(initialTimerState, { type: 'start', nowMs: 1000 });
    s = timerReducer(s, { type: 'tick', nowMs: 4000 }); // elapsed=3
    s = timerReducer(s, { type: 'pause', nowMs: 4000 });
    s = timerReducer(s, { type: 'resume', nowMs: 10000 });
    s = timerReducer(s, { type: 'tick', nowMs: 12000 });
    expect(s.elapsedSec).toBe(5); // 3 + (12000-10000)/1000
  });

  it('reset returns to initial state', () => {
    let s: TimerState = timerReducer(initialTimerState, { type: 'start', nowMs: 1000 });
    s = timerReducer(s, { type: 'tick', nowMs: 5000 });
    s = timerReducer(s, { type: 'reset' });
    expect(s).toEqual(initialTimerState);
  });

  it('start while already running is a no-op', () => {
    const started: TimerState = timerReducer(initialTimerState, { type: 'start', nowMs: 1000 });
    const second = timerReducer(started, { type: 'start', nowMs: 5000 });
    expect(second.startedAtMs).toBe(1000);
  });

  it('tick while idle is a no-op', () => {
    const ticked = timerReducer(initialTimerState, { type: 'tick', nowMs: 5000 });
    expect(ticked).toEqual(initialTimerState);
  });
});
