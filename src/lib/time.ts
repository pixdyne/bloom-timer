export function formatMMSS(totalSeconds: number): string {
  const clamped = Math.max(0, Math.floor(totalSeconds));
  const m = Math.floor(clamped / 60);
  const s = clamped % 60;
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

export function parseMMSS(input: string): number {
  const match = /^(\d{1,2}):(\d{1,2})$/.exec(input);
  if (!match) {
    throw new Error(`Invalid MM:SS string: ${input}`);
  }
  const minutes = Number(match[1]);
  const seconds = Number(match[2]);
  return minutes * 60 + seconds;
}

export function secondsBetween(startMs: number, endMs: number): number {
  return (endMs - startMs) / 1000;
}
