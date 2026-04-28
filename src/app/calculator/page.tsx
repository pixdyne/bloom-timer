import { Suspense } from 'react';
import { recipes } from '@/data/recipes';
import { CalculatorClient } from '@/components/CalculatorClient';
import { Reveal } from '@/components/Reveal';

export const metadata = {
  title: 'Pour Over Calculator — Bloom Timer',
  description:
    'Scale any pour-over recipe to your cup count. Adjust dose, ratio, and temperature. Share the URL.',
  alternates: { canonical: '/calculator' },
};

export default function CalculatorPage() {
  return (
    <main className="mx-auto max-w-5xl px-6 py-16 md:px-10 md:py-24">
      <header className="mb-16">
        <Reveal>
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-[var(--color-accent)]">
            — the calculator
          </p>
        </Reveal>
        <Reveal delay={100}>
          <h1 className="mt-6 font-display text-5xl leading-[0.98] tracking-tight md:text-7xl">
            Scale a recipe to <em className="text-[var(--color-accent)]">your cup.</em>
          </h1>
        </Reveal>
        <Reveal delay={200}>
          <p className="mt-6 max-w-prose text-lg text-[var(--color-ink-2)]">
            Pick a recipe, adjust the parameters, share the URL. Every step&apos;s water target re-computes
            in real time.
          </p>
        </Reveal>
      </header>

      <Reveal delay={300}>
        <Suspense>
          <CalculatorClient recipes={recipes} />
        </Suspense>
      </Reveal>
    </main>
  );
}
