import type { Recipe, ScaleInputs, ScaledRecipe } from './types';

export function scaleRecipe(recipe: Recipe, inputs: ScaleInputs): ScaledRecipe {
  if (inputs.userCups <= 0) {
    throw new RangeError('userCups must be greater than 0');
  }
  if (inputs.userRatio <= 0) {
    throw new RangeError('userRatio must be greater than 0');
  }

  const cupFactor = inputs.userCups / recipe.baseCups;
  const ratioFactor = recipe.baseRatio / inputs.userRatio;

  const scaledDose = cupFactor * recipe.baseDose * ratioFactor;
  const scaledTotalWater = cupFactor * recipe.baseDose * recipe.baseRatio;

  const scaledSteps = recipe.steps.map((step) => ({
    ...step,
    scaledTargetWeight:
      step.targetWeight !== undefined ? step.targetWeight * cupFactor : undefined,
  }));

  return { scaledDose, scaledTotalWater, scaledSteps };
}
