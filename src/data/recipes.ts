import type { Recipe, Step, XBloomProfile, XBloomPour } from '@/lib/types';

// Placeholder xBloom profile — uses each recipe's pour-to steps as a rough mapping.
// Real values will be filled in after testing on the actual device.
function placeholderXBloom(args: {
  dose_g: number;
  total_g: number;
  tempC: number;
  totalTime_sec: number;
  steps: Step[];
}): XBloomProfile {
  const pours: XBloomPour[] = args.steps
    .filter((s): s is Step & { targetWeight: number } => s.action === 'pour-to' && s.targetWeight !== undefined)
    .map((s, i, arr) => {
      const next = arr[i + 1];
      const endSec = next ? next.startSec : args.totalTime_sec;
      const pour: XBloomPour = {
        startSec: s.startSec,
        endSec,
        targetWeight_g: s.targetWeight,
        pattern: i === 0 ? 'center' : 'spiral-out',
        speed: 'medium',
      };
      if (s.note !== undefined) pour.note = s.note;
      return pour;
    });
  return {
    bean: { dose_g: args.dose_g, grindSetting: 5 },
    water: { total_g: args.total_g, tempC: args.tempC },
    pours,
    bloomTime_sec: pours[0] ? pours[0].endSec - pours[0].startSec : 30,
    totalTime_sec: args.totalTime_sec,
    firmwareVersion: 'Studio v2.3 (placeholder)',
    verifiedDate: '2026-04-28',
  };
}

const hoffmannV60Steps: Step[] = [
  { startSec: 0,   action: 'pour-to', targetWeight: 50,  note: 'Bloom — concentric circles' },
  { startSec: 45,  action: 'pour-to', targetWeight: 100, note: 'Steady center pour' },
  { startSec: 75,  action: 'pour-to', targetWeight: 175, note: 'Same rhythm' },
  { startSec: 105, action: 'pour-to', targetWeight: 250, note: 'Final addition' },
  { startSec: 150, action: 'swirl', note: 'Settle the bed' },
  { startSec: 155, action: 'wait',  note: 'Drawdown' },
];

const tetsuKasuya46Steps: Step[] = [
  { startSec: 0,   action: 'pour-to', targetWeight: 60,  note: 'First 40% — sweetness' },
  { startSec: 45,  action: 'pour-to', targetWeight: 120, note: 'Second 40%' },
  { startSec: 90,  action: 'pour-to', targetWeight: 180, note: 'First 60% — strength' },
  { startSec: 135, action: 'pour-to', targetWeight: 240, note: 'Second 60%' },
  { startSec: 165, action: 'pour-to', targetWeight: 300, note: 'Final pour' },
];

const lanceHedrickV60Steps: Step[] = [
  { startSec: 0,   action: 'pour-to', targetWeight: 60,  note: 'Bloom' },
  { startSec: 45,  action: 'swirl' },
  { startSec: 50,  action: 'pour-to', targetWeight: 306, note: 'Single large pour' },
  { startSec: 110, action: 'stir',    note: 'Spin gently' },
];

const aeropressInvertedClassicSteps: Step[] = [
  { startSec: 0,   action: 'invert' },
  { startSec: 5,   action: 'pour-to', targetWeight: 220, note: 'Fill to top' },
  { startSec: 25,  action: 'stir' },
  { startSec: 30,  action: 'wait',    note: 'Steep 60s' },
  { startSec: 90,  action: 'plunge',  note: 'Slow, 30s' },
];

const aeropressTimWendelboeSteps: Step[] = [
  { startSec: 0,   action: 'pour-to', targetWeight: 180, note: 'Fill quickly' },
  { startSec: 20,  action: 'stir' },
  { startSec: 30,  action: 'wait',    note: 'Steep 60s' },
  { startSec: 90,  action: 'plunge',  note: '30s plunge' },
];

const aeropressWac2023Steps: Step[] = [
  { startSec: 0,   action: 'pour-to', targetWeight: 50,  note: 'Bloom' },
  { startSec: 30,  action: 'stir' },
  { startSec: 35,  action: 'pour-to', targetWeight: 243, note: 'Top up' },
  { startSec: 60,  action: 'wait',    note: 'Steep 90s' },
  { startSec: 150, action: 'plunge' },
];

const chemexOnyxSteps: Step[] = [
  { startSec: 0,   action: 'pour-to', targetWeight: 100, note: 'Bloom' },
  { startSec: 45,  action: 'pour-to', targetWeight: 400, note: 'Main pour' },
  { startSec: 120, action: 'pour-to', targetWeight: 800, note: 'Final pour' },
  { startSec: 180, action: 'wait',    note: 'Drawdown' },
];

const chemexBlueBottleSteps: Step[] = [
  { startSec: 0,   action: 'pour-to', targetWeight: 90,  note: 'Bloom' },
  { startSec: 45,  action: 'pour-to', targetWeight: 350 },
  { startSec: 120, action: 'pour-to', targetWeight: 546 },
  { startSec: 180, action: 'wait' },
];

const kalitaWavePrologSteps: Step[] = [
  { startSec: 0,   action: 'pour-to', targetWeight: 50,  note: 'Bloom' },
  { startSec: 45,  action: 'pour-to', targetWeight: 130 },
  { startSec: 75,  action: 'pour-to', targetWeight: 210 },
  { startSec: 105, action: 'pour-to', targetWeight: 288 },
  { startSec: 150, action: 'wait' },
];

const origamiTetsuSteps: Step[] = [
  { startSec: 0,   action: 'pour-to', targetWeight: 60 },
  { startSec: 45,  action: 'pour-to', targetWeight: 120 },
  { startSec: 90,  action: 'pour-to', targetWeight: 240 },
  { startSec: 135, action: 'pour-to', targetWeight: 300 },
];

const frenchPressHoffmannSteps: Step[] = [
  { startSec: 0,   action: 'pour-to', targetWeight: 500, note: 'Pour all water' },
  { startSec: 30,  action: 'wait',    note: 'Steep 4 min' },
  { startSec: 270, action: 'stir',    note: 'Break crust' },
  { startSec: 280, action: 'wait',    note: 'Settle 5 min' },
];

const mokaHoffmannSteps: Step[] = [
  { startSec: 0,   action: 'pour-to', targetWeight: 180, note: 'Fill base with hot water' },
  { startSec: 30,  action: 'wait',    note: 'Heat on medium' },
  { startSec: 240, action: 'wait',    note: 'Listen for the gurgle' },
];

export const recipes: Recipe[] = [
  {
    slug: 'hoffmann-v60',
    name: 'Hoffmann V60',
    brewer: 'v60',
    author: 'James Hoffmann',
    authorUrl: 'https://www.youtube.com/@jameshoffmann',
    description:
      "James Hoffmann's pragmatic refinement of the classic Hario method — a staggered three-pour bloom that forgives an unfussy hand and rewards a careful one.",
    baseCups: 1,
    baseDose: 15,
    baseRatio: 16.7,
    grindSize: 'medium-fine',
    waterTempC: 93,
    totalTimeSec: 210,
    tags: ['v60', 'beginner-friendly', 'single-cup'],
    steps: hoffmannV60Steps,
    xbloomProfile: placeholderXBloom({ dose_g: 15, total_g: 250, tempC: 93, totalTime_sec: 210, steps: hoffmannV60Steps }),
  },
  {
    slug: 'tetsu-kasuya-46',
    name: 'The 4:6 Method',
    brewer: 'v60',
    author: 'Tetsu Kasuya',
    description:
      "Tetsu Kasuya's WBrC-winning method — split the water 40/60 between sweetness and strength.",
    baseCups: 1,
    baseDose: 20,
    baseRatio: 15,
    grindSize: 'medium-coarse',
    waterTempC: 92,
    totalTimeSec: 210,
    tags: ['v60', 'championship'],
    steps: tetsuKasuya46Steps,
    xbloomProfile: placeholderXBloom({ dose_g: 20, total_g: 300, tempC: 92, totalTime_sec: 210, steps: tetsuKasuya46Steps }),
  },
  {
    slug: 'lance-hedrick-v60',
    name: "Lance's V60",
    brewer: 'v60',
    author: 'Lance Hedrick',
    description: "Lance Hedrick's high-extraction V60 — finer grind, longer contact, deliberate agitation.",
    baseCups: 1,
    baseDose: 18,
    baseRatio: 17,
    grindSize: 'fine',
    waterTempC: 96,
    totalTimeSec: 240,
    tags: ['v60', 'high-extraction'],
    steps: lanceHedrickV60Steps,
    xbloomProfile: placeholderXBloom({ dose_g: 18, total_g: 306, tempC: 96, totalTime_sec: 240, steps: lanceHedrickV60Steps }),
  },
  {
    slug: 'aeropress-inverted-classic',
    name: 'Inverted Classic',
    brewer: 'aeropress',
    author: 'Common practice',
    description: 'The default starter recipe — flip, steep, plunge.',
    baseCups: 1,
    baseDose: 17,
    baseRatio: 13.3,
    grindSize: 'medium-fine',
    waterTempC: 85,
    totalTimeSec: 150,
    tags: ['aeropress', 'beginner'],
    steps: aeropressInvertedClassicSteps,
    xbloomProfile: placeholderXBloom({ dose_g: 17, total_g: 226, tempC: 85, totalTime_sec: 150, steps: aeropressInvertedClassicSteps }),
  },
  {
    slug: 'aeropress-tim-wendelboe',
    name: 'Wendelboe AeroPress',
    brewer: 'aeropress',
    author: 'Tim Wendelboe',
    description: 'Filtered, light-roast-friendly. Short steep, gentle plunge.',
    baseCups: 1,
    baseDose: 14,
    baseRatio: 13,
    grindSize: 'medium-fine',
    waterTempC: 91,
    totalTimeSec: 120,
    tags: ['aeropress', 'light-roast'],
    steps: aeropressTimWendelboeSteps,
    xbloomProfile: placeholderXBloom({ dose_g: 14, total_g: 182, tempC: 91, totalTime_sec: 120, steps: aeropressTimWendelboeSteps }),
  },
  {
    slug: 'aeropress-wac-2023',
    name: 'WAC 2023 Champion',
    brewer: 'aeropress',
    author: 'Carlos Medina',
    description: '2023 World AeroPress Championship winning recipe.',
    baseCups: 1,
    baseDose: 18,
    baseRatio: 13.5,
    grindSize: 'medium',
    waterTempC: 88,
    totalTimeSec: 195,
    tags: ['aeropress', 'championship'],
    steps: aeropressWac2023Steps,
    xbloomProfile: placeholderXBloom({ dose_g: 18, total_g: 243, tempC: 88, totalTime_sec: 195, steps: aeropressWac2023Steps }),
  },
  {
    slug: 'chemex-onyx',
    name: 'The Onyx Chemex',
    brewer: 'chemex',
    author: 'Onyx Coffee Lab',
    description: 'A standard Chemex three-cup recipe from a top-tier US roaster.',
    baseCups: 2,
    baseDose: 50,
    baseRatio: 16,
    grindSize: 'medium-coarse',
    waterTempC: 96,
    totalTimeSec: 300,
    tags: ['chemex', 'three-cup'],
    steps: chemexOnyxSteps,
    xbloomProfile: placeholderXBloom({ dose_g: 50, total_g: 800, tempC: 96, totalTime_sec: 300, steps: chemexOnyxSteps }),
  },
  {
    slug: 'chemex-blue-bottle',
    name: 'Blue Bottle Chemex',
    brewer: 'chemex',
    author: 'Blue Bottle Coffee',
    description: 'The cafe-standard Chemex method.',
    baseCups: 2,
    baseDose: 42,
    baseRatio: 13,
    grindSize: 'medium-coarse',
    waterTempC: 94,
    totalTimeSec: 270,
    tags: ['chemex', 'cafe'],
    steps: chemexBlueBottleSteps,
    xbloomProfile: placeholderXBloom({ dose_g: 42, total_g: 546, tempC: 94, totalTime_sec: 270, steps: chemexBlueBottleSteps }),
  },
  {
    slug: 'kalita-wave-prolog',
    name: 'Prolog Kalita Wave',
    brewer: 'kalita',
    author: 'Prolog Coffee',
    description: "Prolog's pulse-pour Kalita method.",
    baseCups: 1,
    baseDose: 18,
    baseRatio: 16,
    grindSize: 'medium',
    waterTempC: 94,
    totalTimeSec: 225,
    tags: ['kalita', 'pulse'],
    steps: kalitaWavePrologSteps,
    xbloomProfile: placeholderXBloom({ dose_g: 18, total_g: 288, tempC: 94, totalTime_sec: 225, steps: kalitaWavePrologSteps }),
  },
  {
    slug: 'origami-tetsu',
    name: "Tetsu's Origami",
    brewer: 'origami',
    author: 'Tetsu Kasuya',
    description: "Tetsu's adaptation of his method to the Origami pleated dripper.",
    baseCups: 1,
    baseDose: 20,
    baseRatio: 15,
    grindSize: 'medium-coarse',
    waterTempC: 92,
    totalTimeSec: 180,
    tags: ['origami'],
    steps: origamiTetsuSteps,
    xbloomProfile: placeholderXBloom({ dose_g: 20, total_g: 300, tempC: 92, totalTime_sec: 180, steps: origamiTetsuSteps }),
  },
  {
    slug: 'french-press-hoffmann',
    name: 'The Ultimate French Press',
    brewer: 'french-press',
    author: 'James Hoffmann',
    description: 'A clean French Press cup using long steep, skim, decant.',
    baseCups: 2,
    baseDose: 30,
    baseRatio: 16.7,
    grindSize: 'coarse',
    waterTempC: 92,
    totalTimeSec: 540,
    tags: ['french-press', 'immersion'],
    steps: frenchPressHoffmannSteps,
    xbloomProfile: placeholderXBloom({ dose_g: 30, total_g: 501, tempC: 92, totalTime_sec: 540, steps: frenchPressHoffmannSteps }),
  },
  {
    slug: 'moka-hoffmann',
    name: "Hoffmann's Moka",
    brewer: 'moka',
    author: 'James Hoffmann',
    description: "Hoffmann's modern Moka pot method, with pre-heated water.",
    baseCups: 1,
    baseDose: 18,
    baseRatio: 10,
    grindSize: 'medium-fine',
    waterTempC: 100,
    totalTimeSec: 330,
    tags: ['moka', 'stovetop'],
    steps: mokaHoffmannSteps,
    xbloomProfile: placeholderXBloom({ dose_g: 18, total_g: 180, tempC: 100, totalTime_sec: 330, steps: mokaHoffmannSteps }),
  },
];

export function recipeBySlug(slug: string): Recipe | undefined {
  return recipes.find((r) => r.slug === slug);
}
