export type TimerStatus = 'idle' | 'running' | 'paused';

export type TimerState = {
  status: TimerStatus;
  elapsedSec: number;
  startedAtMs: number | null;     // null when idle/paused
  pausedElapsedSec: number;       // accumulated time before current run
};

export type TimerAction =
  | { type: 'start'; nowMs: number }
  | { type: 'pause'; nowMs: number }
  | { type: 'resume'; nowMs: number }
  | { type: 'tick'; nowMs: number }
  | { type: 'reset' };

export const initialTimerState: TimerState = {
  status: 'idle',
  elapsedSec: 0,
  startedAtMs: null,
  pausedElapsedSec: 0,
};

export function timerReducer(state: TimerState, action: TimerAction): TimerState {
  switch (action.type) {
    case 'start':
      if (state.status === 'running') return state;
      return {
        ...state,
        status: 'running',
        startedAtMs: action.nowMs,
        pausedElapsedSec: 0,
        elapsedSec: 0,
      };

    case 'pause':
      if (state.status !== 'running') return state;
      return {
        ...state,
        status: 'paused',
        pausedElapsedSec: state.elapsedSec,
        startedAtMs: null,
      };

    case 'resume':
      if (state.status !== 'paused') return state;
      return {
        ...state,
        status: 'running',
        startedAtMs: action.nowMs,
      };

    case 'tick': {
      if (state.status !== 'running' || state.startedAtMs === null) return state;
      const live = (action.nowMs - state.startedAtMs) / 1000;
      const elapsedSec = Math.floor(state.pausedElapsedSec + live);
      if (elapsedSec === state.elapsedSec) return state;
      return { ...state, elapsedSec };
    }

    case 'reset':
      return initialTimerState;

    default:
      return state;
  }
}
