'use client';

import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useMemo } from 'react';
import { scaleRecipe } from '@/lib/scale';
import { parseScaleParams, MIN_CUPS, MAX_CUPS, MIN_RATIO, MAX_RATIO } from '@/lib/scaleParams';
import { formatMMSS } from '@/lib/time';
import type { Recipe } from '@/lib/types';

type Props = { recipes: Recipe[] };

export function CalculatorClient({ recipes }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const slugFromUrl = searchParams?.get('recipe');
  const recipe = useMemo(
    () => recipes.find((r) => r.slug === slugFromUrl) ?? recipes[0]!,
    [recipes, slugFromUrl],
  );

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

  const setRecipe = (slug: string) => {
    const sp = new URLSearchParams();
    sp.set('recipe', slug);
    router.replace(`${pathname}?${sp.toString()}`, { scroll: false });
  };

  const update = (next: { cups?: number; ratio?: number }) => {
    const sp = new URLSearchParams(searchParams?.toString() ?? '');
    sp.set('recipe', recipe.slug);
    const newCups = next.cups ?? params.cups;
    const newRatio = next.ratio ?? params.ratio;
    if (newCups === recipe.baseCups) sp.delete('cups');
    else sp.set('cups', String(newCups));
    if (newRatio === recipe.baseRatio) sp.delete('ratio');
    else sp.set('ratio', String(newRatio));
    router.replace(`${pathname}?${sp.toString()}`, { scroll: false });
  };

  return (
    <div className="grid gap-12 lg:grid-cols-[400px_1fr]">
      <aside className="space-y-8">
        <div>
          <label htmlFor="recipe-pick" className="font-mono text-xs uppercase tracking-[0.18em] text-[var(--color-muted)]">
            Recipe
          </label>
          <select
            id="recipe-pick"
            value={recipe.slug}
            onChange={(e) => setRecipe(e.target.value)}
            className="mt-2 w-full rounded-lg border border-[var(--color-line-strong)] bg-[var(--color-bg)] px-4 py-3 font-display text-xl"
          >
            {recipes.map((r) => (
              <option key={r.slug} value={r.slug}>
                {r.name} — {r.author}
              </option>
            ))}
          </select>
          <p className="mt-2 font-mono text-xs text-[var(--color-muted)]">
            Base: {recipe.baseDose}g · 1:{recipe.baseRatio} · {formatMMSS(recipe.totalTimeSec)}
          </p>
        </div>

        <div>
          <div className="flex items-baseline justify-between">
            <label htmlFor="calc-cups" className="font-mono text-xs uppercase tracking-[0.18em] text-[var(--color-muted)]">
              Servings
            </label>
            <span className="font-mono text-sm text-[var(--color-accent)]">
              {params.cups} cup{params.cups === 1 ? '' : 's'}
            </span>
          </div>
          <input
            id="calc-cups"
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
            <label htmlFor="calc-ratio" className="font-mono text-xs uppercase tracking-[0.18em] text-[var(--color-muted)]">
              Ratio
            </label>
            <span className="font-mono text-sm text-[var(--color-accent)]">
              1:{params.ratio.toFixed(1)}
            </span>
          </div>
          <input
            id="calc-ratio"
            type="range"
            min={MIN_RATIO}
            max={MAX_RATIO}
            step={0.1}
            value={params.ratio}
            onChange={(e) => update({ ratio: Number(e.target.value) })}
            className="mt-2 w-full accent-[var(--color-accent)]"
          />
        </div>
      </aside>

      <section className="space-y-8 rounded-2xl border border-[var(--color-line)] bg-[var(--color-bg-warm)] p-10">
        <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
          <Stat label="Coffee" value={`${scaled.scaledDose.toFixed(1)}g`} />
          <Stat label="Water" value={`${scaled.scaledTotalWater.toFixed(0)}g`} />
          <Stat label="Ratio" value={`1:${params.ratio.toFixed(1)}`} />
          <Stat label="Total time" value={formatMMSS(recipe.totalTimeSec)} />
        </div>

        <div>
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-[var(--color-muted)]">
            Steps
          </p>
          <ol className="mt-3 divide-y divide-[var(--color-line)] border-y border-[var(--color-line)]">
            {scaled.scaledSteps.map((step, i) => (
              <li key={i} className="grid grid-cols-[40px_80px_1fr] gap-4 py-4 font-mono text-sm">
                <span className="text-[var(--color-muted)]">{String(i + 1).padStart(2, '0')}</span>
                <span className="text-[var(--color-accent)]">{formatMMSS(step.startSec)}</span>
                <span>
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
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="font-mono text-xs uppercase tracking-[0.18em] text-[var(--color-muted)]">
        {label}
      </p>
      <p className="mt-2 font-display text-3xl tracking-tight">{value}</p>
    </div>
  );
}
