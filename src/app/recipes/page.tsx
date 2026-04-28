import Link from 'next/link';
import { recipes } from '@/data/recipes';
import { brewers, recipesForBrewer } from '@/data/brewers';
import { formatMMSS } from '@/lib/time';

export const metadata = {
  title: 'All Recipes — Bloom Timer',
  description: 'Twelve championship pour-over recipes, organized by brewer.',
};

export default function RecipesIndex() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-16 md:px-10 md:py-24">
      <h1 className="font-display text-5xl tracking-tight md:text-6xl">All Recipes</h1>
      <p className="mt-6 max-w-prose text-lg text-[var(--color-ink-2)]">
        Twelve recipes, sorted by brewer. Each has a name, a source, and a verified parameter set.
      </p>

      {brewers.map((b) => {
        const list = recipesForBrewer(b.slug);
        if (list.length === 0) return null;
        return (
          <section key={b.slug} className="mt-16">
            <header className="mb-6 flex items-baseline justify-between border-b border-[var(--color-line)] pb-3">
              <h2 className="font-display text-3xl tracking-tight">{b.displayName}</h2>
              <span className="font-mono text-xs uppercase tracking-widest text-[var(--color-muted)]">
                {list.length} recipe{list.length === 1 ? '' : 's'}
              </span>
            </header>
            <ul className="divide-y divide-[var(--color-line)]">
              {list.map((r) => (
                <li key={r.slug}>
                  <Link
                    href={`/recipes/${r.slug}`}
                    className="grid grid-cols-[1fr_auto] gap-4 py-5 transition-colors hover:bg-[var(--color-bg-warm)] sm:grid-cols-[1fr_180px_100px_80px]"
                  >
                    <div>
                      <h3 className="font-display text-xl tracking-tight">{r.name}</h3>
                      <p className="mt-1 text-sm italic text-[var(--color-ink-3)]">
                        — {r.author}
                      </p>
                    </div>
                    <div className="hidden font-mono text-sm text-[var(--color-ink-2)] sm:block">
                      {r.tags.slice(0, 2).join(' · ')}
                    </div>
                    <div className="hidden font-mono text-sm text-[var(--color-accent)] sm:block">
                      1:{r.baseRatio}
                    </div>
                    <div className="text-right font-mono text-sm text-[var(--color-ink-2)]">
                      {formatMMSS(r.totalTimeSec)}
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        );
      })}
    </main>
  );
}
