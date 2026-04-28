export const MIN_CUPS = 1;
export const MAX_CUPS = 4;
export const MIN_RATIO = 8;
export const MAX_RATIO = 20;

export type ScaleParamsDefaults = {
  defaultCups: number;
  defaultRatio: number;
};

export type ScaleParamsResult = {
  cups: number;
  ratio: number;
  isDefault: boolean;
};

/**
 * Parse `cups` and `ratio` from URL search params, clamped to allowed ranges.
 * Defaults are also clamped so callers can pass per-recipe defaults that may
 * fall outside [MIN_*, MAX_*] without breaking `isDefault`.
 */
export function parseScaleParams(
  params: URLSearchParams,
  defaults: ScaleParamsDefaults,
): ScaleParamsResult {
  const cupsRaw = params.get('cups');
  const ratioRaw = params.get('ratio');

  const clampedDefaultCups = clampInt(defaults.defaultCups, MIN_CUPS, MAX_CUPS);
  const clampedDefaultRatio = clampFloat(defaults.defaultRatio, MIN_RATIO, MAX_RATIO);

  const cups = clampInt(parseNumber(cupsRaw, clampedDefaultCups), MIN_CUPS, MAX_CUPS);
  const ratio = clampFloat(parseNumber(ratioRaw, clampedDefaultRatio), MIN_RATIO, MAX_RATIO);

  const isDefault = cups === clampedDefaultCups && ratio === clampedDefaultRatio;

  return { cups, ratio, isDefault };
}

function parseNumber(value: string | null, fallback: number): number {
  if (value === null) return fallback;
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}

function clampInt(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, Math.round(value)));
}

function clampFloat(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}
