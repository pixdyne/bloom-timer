'use client';

let stageAudio: HTMLAudioElement | null = null;
let endAudio: HTMLAudioElement | null = null;

function lazyStage(): HTMLAudioElement {
  if (!stageAudio) {
    stageAudio = new Audio('/sounds/stage.wav');
    stageAudio.preload = 'auto';
    stageAudio.volume = 0.6;
  }
  return stageAudio;
}

function lazyEnd(): HTMLAudioElement {
  if (!endAudio) {
    endAudio = new Audio('/sounds/end.wav');
    endAudio.preload = 'auto';
    endAudio.volume = 0.6;
  }
  return endAudio;
}

export function playStage(): void {
  if (typeof window === 'undefined') return;
  const a = lazyStage();
  a.currentTime = 0;
  a.play().catch(() => {});
}

export function playEnd(): void {
  if (typeof window === 'undefined') return;
  const a = lazyEnd();
  a.currentTime = 0;
  a.play().catch(() => {});
}
