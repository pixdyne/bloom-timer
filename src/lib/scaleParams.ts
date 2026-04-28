export const MIN_CUPS = 1;
export const MAX_CUPS = 4;
export const MIN_RATIO = 12;
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

export function parseScaleParams(
  params: URLSearchParams,
  defaults: ScaleParamsDefaults,
): ScaleParamsResult {
  const cupsRaw = params.get('cups');
  const ratioRaw = params.get('ratio');

  const cups = clampInt(parseNumber(cupsRaw, defaults.defaultCups), MIN_CUPS, MAX_CUPS);
  const ratio = clampFloat(parseNumber(ratioRaw, defaults.defaultRatio), MIN_RATIO, MAX_RATIO);

  const isDefault = cups === defaults.defaultCups && ratio === defaults.defaultRatio;

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
