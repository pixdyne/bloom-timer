import Link from 'next/link';
import { notFound } from 'next/navigation';
import { recipes, recipeBySlug } from '@/data/recipes';
import { brewerBySlug } from '@/data/brewers';
import { formatMMSS } from '@/lib/time';
import { XBloomBlock } from '@/components/XBloomBlock';

export function generateStaticParams() {
  return recipes.map((r) => ({ slug: r.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const r = recipeBySlug(slug);
  if (!r) return {};
  return {
    title: `${r.name} on xBloom Studio — Bloom Timer`,
    description: `${r.author}'s ${r.name} translated to xBloom Studio parameters. Copy as JSON, scan QR, or download the .xbloomprofile.`,
    alternates: { canonical: `/recipes/${r.slug}` },
  };
}

export default async function XBloomRecipePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const r = recipeBySlug(slug);
  if (!r || !r.xbloomProfile) notFound();
  const profile = r.xbloomProfile;
  const b = brewerBySlug(r.brewer);

  return (
    <main className="mx-auto max-w-4xl px-6 py-16 md:px-10 md:py-24">
      <header>
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-[var(--color-accent)]">
          — xBloom · {b?.displayName} · {formatMMSS(r.totalTimeSec)}
        </p>
        <h1 className="mt-6 font-display text-5xl leading-[0.98] tracking-tight md:text-7xl">
          {r.name} <span className="text-[var(--color-muted)]">on</span> xBloom <span className="text-[var(--color-muted)]">Studio.</span>
        </h1>
        <p className="mt-3 text-lg italic text-[var(--color-ink-3)]">
          — by {r.author}, translated to xBloom Studio parameters
        </p>
        <p className="mt-8 max-w-prose text-lg text-[var(--color-ink-2)]">
          {r.description}
        </p>
      </header>

      <XBloomBlock profile={profile} slug={r.slug} />

      <section className="mt-12 rounded-2xl border border-[var(--color-line)] p-8 md:p-10">
        <h2 className="font-display text-2xl tracking-tight">Prefer the manual version?</h2>
        <p className="mt-3 max-w-prose text-[var(--color-ink-2)]">
          The same recipe, brewed by hand with a kitchen-friendly timer:
        </p>
        <p className="mt-4">
          <Link
            href={`/recipes/${r.slug}`}
            className="inline-block rounded-full bg-[var(--color-ink)] px-5 py-2.5 font-medium text-[var(--color-bg)] transition hover:opacity-85"
          >
            Open the manual recipe →
          </Link>
        </p>
      </section>

      <p className="mt-12 font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-muted)]">
        Not affiliated with xBloom Inc.
      </p>
    </main>
  );
}
