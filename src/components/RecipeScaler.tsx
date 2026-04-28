'use client';

import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useMemo } from 'react';
import { scaleRecipe } from '@/lib/scale';
import { parseScaleParams, MIN_CUPS, MAX_CUPS, MIN_RATIO, MAX_RATIO } from '@/lib/scaleParams';
import { formatMMSS } from '@/lib/time';
import type { Recipe } from '@/lib/types';

type Props = { recipe: Recipe };

export function RecipeScaler({ recipe }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const params = useMemo(() => {
    const sp = new URLSearchParams(searchParams?.toString() ?? '');
    return parseScaleParams(sp, {
      defaultCups: recipe.baseCups,
      defaultRatio: recipe.baseRatio,
    });
  }, [searchParams, recipe.baseCups, recipe.baseRatio]);

  const scaled = useMemo(
    () => scaleRecipe(recipe, { userCups: params.cups, userRatio: params.ratio }),
    [recipe, params.cups, params.ratio],
  );

  const update = (next: { cups?: number; ratio?: number }) => {
    const sp = new URLSearchParams(searchParams?.toString() ?? '');
    const newCups = next.cups ?? params.cups;
    const newRatio = next.ratio ?? params.ratio;

    if (newCups === recipe.baseCups) sp.delete('cups');
    else sp.set('cups', String(newCups));

    if (newRatio === recipe.baseRatio) sp.delete('ratio');
    else sp.set('ratio', String(newRatio));

    const query = sp.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
  };

  const reset = () => router.replace(pathname, { scroll: false });

  return (
    <section
      aria-label="Scale this recipe"
      className="my-12 grid gap-8 rounded-2xl border border-[var(--color-line)] bg-[var(--color-bg-warm)] p-8 md:grid-cols-2 md:p-10"
    >
      <div>
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-[var(--color-accent)]">
          — scale this recipe
        </p>
        <h2 className="mt-3 font-display text-3xl tracking-tight md:text-4xl">
          {scaled.scaledDose.toFixed(1)}<span className="text-[var(--color-muted)]">g</span> coffee · {scaled.scaledTotalWater.toFixed(0)}<span className="text-[var(--color-muted)]">g</span> water
        </h2>
        <p className="mt-2 font-mono text-sm text-[var(--color-ink-2)]">
          {params.cups} cup{params.cups === 1 ? '' : 's'} · ratio 1:{params.ratio}
          {!params.isDefault && (
            <button
              type="button"
              onClick={reset}
              className="ml-3 underline decoration-dotted underline-offset-4 hover:text-[var(--color-accent)]"
            >
              reset
            </button>
          )}
        </p>

        <div className="mt-6 space-y-5">
          <div>
            <div className="flex items-baseline justify-between">
              <label htmlFor="cups" className="font-mono text-xs uppercase tracking-[0.18em] text-[var(--color-muted)]">
                Servings
              </label>
              <span className="font-mono text-sm text-[var(--color-accent)]">{params.cups}</span>
            </div>
            <input
              id="cups"
              type="range"
              min={MIN_CUPS}
              max={MAX_CUPS}
              step={1}
              value={params.cups}
              onChange={(e) => update({ cups: Number(e.target.value) })}
              className="mt-2 w-full accent-[var(--color-accent)]"
            />
          </div>
          <div>
            <div className="flex items-baseline justify-between">
              <label htmlFor="ratio" className="font-mono text-xs uppercase tracking-[0.18em] text-[var(--color-muted)]">
                Ratio
              </label>
              <span className="font-mono text-sm text-[var(--color-accent)]">1:{params.ratio.toFixed(1)}</span>
            </div>
            <input
              id="ratio"
              type="range"
              min={MIN_RATIO}
              max={MAX_RATIO}
              step={0.1}
              value={params.ratio}
              onChange={(e) => update({ ratio: Number(e.target.value) })}
              className="mt-2 w-full accent-[var(--color-accent)]"
            />
          </div>
        </div>
      </div>

      <div>
        <p className="font-mono text-xs uppercase tracking-[0.18em] text-[var(--color-muted)]">
          Scaled steps
        </p>
        <ol className="mt-3 divide-y divide-[var(--color-line)]">
          {scaled.scaledSteps.map((step, i) => (
            <li key={i} className="grid grid-cols-[40px_80px_1fr] gap-4 py-3 font-mono text-sm">
              <span className="text-[var(--color-muted)]">{String(i + 1).padStart(2, '0')}</span>
              <span className="text-[var(--color-accent)]">{formatMMSS(step.startSec)}</span>
              <span className="text-[var(--color-ink)]">
                <span className="capitalize">{step.action.replace('-', ' ')}</span>
                {step.scaledTargetWeight !== undefined && (
                  <span className="text-[var(--color-accent)]"> → {step.scaledTargetWeight.toFixed(0)}g</span>
                )}
              </span>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
