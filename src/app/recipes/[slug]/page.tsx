import { Suspense } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { recipes, recipeBySlug } from '@/data/recipes';
import { brewerBySlug } from '@/data/brewers';
import { formatMMSS } from '@/lib/time';
import { BrewTimer } from '@/components/BrewTimer';
import { RecipeScaler } from '@/components/RecipeScaler';

export function generateStaticParams() {
  return recipes.map((r) => ({ slug: r.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const r = recipeBySlug(slug);
  if (!r) return {};
  return {
    title: `${r.author}'s ${r.name} — Bloom Timer`,
    description: r.description,
    alternates: {
      canonical: `/recipes/${r.slug}`,
    },
  };
}

export default async function RecipePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const r = recipeBySlug(slug);
  if (!r) notFound();

  const b = brewerBySlug(r.brewer);

  return (
    <main className="mx-auto max-w-4xl px-6 py-16 md:px-10 md:py-24">
      <header>
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-[var(--color-accent)]">
          — {b?.displayName} · {formatMMSS(r.totalTimeSec)}
        </p>
        <h1 className="mt-6 font-display text-5xl leading-[0.98] tracking-tight md:text-7xl">
          {r.name}
        </h1>
        <p className="mt-3 text-lg italic text-[var(--color-ink-3)]">— by {r.author}</p>
        <p className="mt-8 max-w-prose text-lg text-[var(--color-ink-2)]">{r.description}</p>
      </header>

      <section className="my-16 grid grid-cols-2 gap-6 border-y border-[var(--color-line)] py-8 md:grid-cols-6">
        <Spec label="Coffee" value={`${r.baseDose}g`} />
        <Spec label="Water" value={`${(r.baseDose * r.baseRatio).toFixed(0)}g`} />
        <Spec label="Ratio" value={`1:${r.baseRatio}`} />
        <Spec label="Grind" value={r.grindSize} />
        <Spec label="Temp" value={`${r.waterTempC}°C`} />
        <Spec label="Total" value={formatMMSS(r.totalTimeSec)} />
      </section>

      <Suspense>
        <RecipeScaler recipe={r} />
      </Suspense>
      <BrewTimer recipe={r} />
      <p className="-mt-8 mb-12 text-center">
        <Link
          href={`/recipes/${r.slug}/play`}
          className="inline-block rounded-full border border-[var(--color-line-strong)] px-5 py-2 font-mono text-xs uppercase tracking-[0.18em] text-[var(--color-ink-2)] transition hover:bg-[var(--color-ink)] hover:text-[var(--color-bg)]"
        >
          Open fullscreen ↗
        </Link>
      </p>

      <section className="mt-16">
        <h2 className="font-display text-3xl tracking-tight">Steps</h2>
        <ol className="mt-8 divide-y divide-[var(--color-line)]">
          {r.steps.map((step, i) => (
            <li key={i} className="grid grid-cols-[40px_120px_1fr] gap-6 py-6">
              <span className="font-mono text-sm text-[var(--color-muted)]">
                {String(i + 1).padStart(2, '0')}
              </span>
              <span className="font-mono text-sm text-[var(--color-accent)]">
                {formatMMSS(step.startSec)}
              </span>
              <span>
                <strong className="capitalize text-[var(--color-ink)]">
                  {step.action.replace('-', ' ')}
                </strong>
                {step.targetWeight !== undefined && (
                  <span className="font-mono text-[var(--color-accent)]"> → {step.targetWeight}g</span>
                )}
                {step.note && <p className="mt-1 text-[var(--color-ink-2)]">{step.note}</p>}
              </span>
            </li>
          ))}
        </ol>
      </section>
    </main>
  );
}

function Spec({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="font-mono text-xs uppercase tracking-[0.18em] text-[var(--color-muted)]">
        {label}
      </p>
      <p className="mt-2 font-display text-2xl">{value}</p>
    </div>
  );
}
