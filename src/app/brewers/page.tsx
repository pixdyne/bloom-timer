import Link from 'next/link';
import { brewers, recipesForBrewer } from '@/data/brewers';

export const metadata = {
  title: 'Brewers — Bloom Timer',
  description: 'Six pour-over methods, each with its own recipe lineup.',
};

export default function BrewersIndex() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-16 md:px-10 md:py-24">
      <h1 className="font-display text-5xl tracking-tight md:text-6xl">Brewers</h1>
      <p className="mt-6 max-w-prose text-lg text-[var(--color-ink-2)]">
        Each brewer has its own page with the full recipe lineup, a brief on what to use it for,
        and a grind reference.
      </p>

      <ul className="mt-16 grid grid-cols-1 gap-px border-y border-[var(--color-line)] bg-[var(--color-line)] sm:grid-cols-2 lg:grid-cols-3">
        {brewers.map((b) => {
          const count = recipesForBrewer(b.slug).length;
          return (
            <li key={b.slug} className="bg-[var(--color-bg)]">
              <Link
                href={`/brewers/${b.slug}`}
                className="block p-8 transition-colors hover:bg-[var(--color-bg-warm)]"
              >
                <p className="font-mono text-xs text-[var(--color-muted)]">№ {b.slug}</p>
                <h2 className="mt-3 font-display text-3xl tracking-tight">{b.displayName}</h2>
                <p className="mt-3 text-[var(--color-ink-2)]">{b.description}</p>
                <p className="mt-6 font-mono text-xs text-[var(--color-accent)]">
                  {count} recipe{count === 1 ? '' : 's'} →
                </p>
              </Link>
            </li>
          );
        })}
      </ul>
    </main>
  );
}
