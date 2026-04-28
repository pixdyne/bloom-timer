export type Brewer =
  | 'v60'
  | 'aeropress'
  | 'chemex'
  | 'kalita'
  | 'origami'
  | 'french-press'
  | 'moka';

export type GrindSize =
  | 'fine'
  | 'medium-fine'
  | 'medium'
  | 'medium-coarse'
  | 'coarse';

export type StepAction =
  | 'pour-to'
  | 'swirl'
  | 'wait'
  | 'stir'
  | 'invert'
  | 'plunge';

export type Step = {
  startSec: number;
  action: StepAction;
  targetWeight?: number;
  durationSec?: number;
  note?: string;
};

export type Recipe = {
  slug: string;
  name: string;
  brewer: Brewer;
  author: string;
  authorUrl?: string;
  description: string;
  baseCups: 1 | 2;
  baseDose: number;
  baseRatio: number;
  grindSize: GrindSize;
  grindNote?: string;
  waterTempC: number;
  totalTimeSec: number;
  steps: Step[];
  tags: string[];
  xbloomProfile?: XBloomProfile;
};

export type ScaleInputs = {
  userCups: number;
  userRatio: number;
};

export type ScaledRecipe = {
  scaledDose: number;
  scaledTotalWater: number;
  scaledSteps: Array<Step & { scaledTargetWeight: number | undefined }>;
};

export type XBloomPourPattern = 'center' | 'spiral-out' | 'spiral-in' | 'agitate';
export type XBloomPourSpeed = 'slow' | 'medium' | 'fast';

export type XBloomPour = {
  startSec: number;
  endSec: number;
  targetWeight_g: number;
  pattern: XBloomPourPattern;
  speed: XBloomPourSpeed;
  note?: string;
};

export type XBloomProfile = {
  bean: {
    dose_g: number;
    grindSetting: number;
  };
  water: {
    total_g: number;
    tempC: number;
  };
  pours: XBloomPour[];
  bloomTime_sec: number;
  totalTime_sec: number;
  firmwareVersion: string;
  verifiedDate: string;
};
