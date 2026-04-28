import Link from 'next/link';
import { recipes } from '@/data/recipes';
import { formatMMSS } from '@/lib/time';

export default function HomePage() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-16 md:px-10 md:py-24">
      <header className="mb-16 md:mb-24">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-[var(--color-accent)]">
          — twelve recipes, six brewers, one timer
        </p>
        <h1 className="mt-6 font-display text-5xl leading-[0.95] tracking-tight text-[var(--color-ink)] md:text-7xl">
          Brew like the world&apos;s <em className="text-[var(--color-accent)]">best baristas.</em>
        </h1>
        <p className="mt-6 max-w-prose text-lg text-[var(--color-ink-2)]">
          A precise pour-over timer with twelve championship recipes. No accounts, no tracking,
          free forever.
        </p>
      </header>

      <section>
        <h2 className="font-display text-3xl tracking-tight md:text-4xl">The Library</h2>
        <ul className="mt-8 grid grid-cols-1 gap-px border-y border-[var(--color-line)] bg-[var(--color-line)] sm:grid-cols-2 lg:grid-cols-3">
          {recipes.map((r) => (
            <li key={r.slug} className="bg-[var(--color-bg)]">
              <Link
                href={`/recipes/${r.slug}`}
                className="block p-8 transition-colors hover:bg-[var(--color-bg-warm)]"
              >
                <p className="font-mono text-xs text-[var(--color-muted)]">№ {r.brewer}</p>
                <h3 className="mt-3 font-display text-2xl tracking-tight">{r.name}</h3>
                <p className="mt-1 text-sm italic text-[var(--color-ink-3)]">— {r.author}</p>
                <p className="mt-6 flex items-baseline justify-between font-mono text-xs text-[var(--color-ink-2)]">
                  <span>
                    {formatMMSS(r.totalTimeSec)} · {r.baseDose}g
                  </span>
                  <span className="text-[var(--color-accent)]">1:{r.baseRatio}</span>
                </p>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
