import Link from 'next/link';
import { notFound } from 'next/navigation';
import { brewers, brewerBySlug, recipesForBrewer } from '@/data/brewers';
import { formatMMSS } from '@/lib/time';

export function generateStaticParams() {
  return brewers.map((b) => ({ slug: b.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const b = brewerBySlug(slug);
  if (!b) return {};
  return {
    title: `${b.displayName} Recipes — Bloom Timer`,
    description: b.description,
  };
}

export default async function BrewerPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const b = brewerBySlug(slug);
  if (!b) notFound();
  const list = recipesForBrewer(b.slug);

  return (
    <main className="mx-auto max-w-4xl px-6 py-16 md:px-10 md:py-24">
      <header>
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-[var(--color-accent)]">
          — Brewer · {list.length} recipes
        </p>
        <h1 className="mt-6 font-display text-5xl tracking-tight md:text-7xl">{b.displayName}</h1>
        <p className="mt-8 max-w-prose text-lg text-[var(--color-ink-2)]">{b.description}</p>
      </header>

      <section className="mt-16">
        <h2 className="font-display text-3xl tracking-tight">Recipes</h2>
        <ul className="mt-8 divide-y divide-[var(--color-line)] border-y border-[var(--color-line)]">
          {list.map((r) => (
            <li key={r.slug}>
              <Link
                href={`/recipes/${r.slug}`}
                className="grid grid-cols-[1fr_100px_80px] gap-6 py-6 transition-colors hover:bg-[var(--color-bg-warm)]"
              >
                <div>
                  <h3 className="font-display text-xl tracking-tight">{r.name}</h3>
                  <p className="mt-1 text-sm italic text-[var(--color-ink-3)]">— {r.author}</p>
                </div>
                <div className="font-mono text-sm text-[var(--color-accent)]">1:{r.baseRatio}</div>
                <div className="text-right font-mono text-sm text-[var(--color-ink-2)]">
                  {formatMMSS(r.totalTimeSec)}
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
