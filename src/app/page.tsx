import Link from 'next/link';
import { HeroPhoneDemo } from '@/components/HeroPhoneDemo';
import { PinnedBrewSection } from '@/components/PinnedBrewSection';
import { recipes } from '@/data/recipes';
import { brewers } from '@/data/brewers';
import { formatMMSS } from '@/lib/time';
import { Reveal } from '@/components/Reveal';
import { CalcPreview } from '@/components/CalcPreview';
import { fetchLatestBlogPosts } from '@/lib/sanity/queries';
import { urlFor } from '@/lib/sanity/client';

function formatJournalDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

export default async function HomePage() {
  const journalPosts = await fetchLatestBlogPosts(3).catch(() => []);
  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden pt-32 pb-24 md:pt-40 md:pb-32">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-52 left-1/2 -z-0 h-[1200px] w-[1200px] -translate-x-1/2 animate-[herofloat_20s_ease-in-out_infinite]"
          style={{ background: 'radial-gradient(circle, rgba(200, 105, 58, 0.12) 0%, transparent 50%)' }}
        />
        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-6 md:grid-cols-[1.1fr_1fr] md:gap-20 md:px-10">
          <div>
            <span className="mb-7 inline-flex items-center gap-2.5 rounded-full border border-[var(--color-line)] bg-[var(--color-bg-warm)] px-3.5 py-1.5 text-[13px] text-[var(--color-ink-2)]">
              <span className="rounded-full bg-[var(--color-ink)] px-2 py-0.5 font-mono text-[10px] font-medium tracking-wider text-[var(--color-bg)]">
                v1
              </span>
              <span>Twelve recipes — six brewers — one timer</span>
            </span>
            <h1 className="font-display text-[clamp(54px,8vw,116px)] leading-[0.92] tracking-[-0.025em]">
              Brew like the world&apos;s <em className="text-[var(--color-accent)]">best baristas.</em>
            </h1>
            <p className="mt-7 max-w-[38ch] text-[19px] leading-[1.55] text-[var(--color-ink-2)]">
              A precise pour-over timer with twelve championship recipes, played by the second.
              Tare your scale, set your phone on the counter, brew.
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-3">
              <Link
                href="/recipes/hoffmann-v60"
                className="inline-flex items-center gap-2 rounded-full bg-[var(--color-ink)] px-6 py-3.5 text-sm font-medium text-[var(--color-bg)] transition hover:-translate-y-px hover:shadow-[0_8px_24px_rgba(26,22,18,0.15)]"
              >
                Start brewing <span aria-hidden="true">→</span>
              </Link>
              <Link
                href="/recipes"
                className="inline-flex items-center gap-2 rounded-full border border-[var(--color-line-strong)] bg-transparent px-6 py-3.5 text-sm font-medium text-[var(--color-ink)] transition hover:border-[var(--color-ink)] hover:bg-[var(--color-bg-warm)]"
              >
                Browse recipes
              </Link>
            </div>
            <div className="mt-8 flex flex-wrap items-center gap-6 text-[13px] text-[var(--color-ink-3)]">
              <span className="inline-flex items-center gap-1.5">
                <span className="block h-1.5 w-1.5 rounded-full bg-current" /> No accounts
              </span>
              <span className="block h-[3px] w-[3px] rounded-full bg-[var(--color-muted)]" />
              <span>No tracking</span>
              <span className="block h-[3px] w-[3px] rounded-full bg-[var(--color-muted)]" />
              <span>Free forever</span>
            </div>
          </div>
          <HeroPhoneDemo />
        </div>
      </section>

      {/* PINNED BREW DEMO */}
      <PinnedBrewSection />

      {/* THE LIBRARY */}
      <section className="mx-auto max-w-7xl px-6 py-32 md:px-10 md:py-36">
        <Reveal>
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-[var(--color-accent)]">
            <span className="mr-3 inline-block h-px w-6 align-middle bg-[var(--color-accent)]" />
            the library
          </p>
        </Reveal>
        <Reveal delay={100}>
          <h2 className="mt-4 font-display text-[clamp(44px,5.5vw,80px)] leading-[0.98] tracking-[-0.02em] max-w-[18ch]">
            Twelve recipes, <em className="text-[var(--color-accent)]">worth memorising.</em>
          </h2>
        </Reveal>
        <Reveal delay={200}>
          <p className="mt-6 mb-20 max-w-[56ch] text-[19px] leading-[1.55] text-[var(--color-ink-2)]">
            Every recipe has a name, a source, and a reason. Championship winners, world-class daily
            drivers, the standards that keep specialty cafes running. We brewed every single one.
          </p>
        </Reveal>
        <Reveal delay={300}>
          <ul className="grid grid-cols-1 gap-px border-y border-[var(--color-line)] bg-[var(--color-line)] sm:grid-cols-2 lg:grid-cols-3">
            {recipes.map((r, i) => (
              <li key={r.slug} className="bg-[var(--color-bg)]">
                <Link
                  href={`/recipes/${r.slug}`}
                  className="group relative block min-h-[240px] p-9 transition-colors hover:bg-[var(--color-bg-warm)]"
                >
                  <span aria-hidden="true" className="pointer-events-none absolute bottom-0 left-0 h-px w-0 bg-[var(--color-accent)] transition-[width] duration-500 group-hover:w-full" />
                  <span aria-hidden="true" className="absolute right-8 top-8 text-[var(--color-muted)] transition-all duration-300 group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:text-[var(--color-accent)]">
                    ↗
                  </span>
                  <p className="font-mono text-[11px] tracking-[0.05em] text-[var(--color-muted)]">
                    № {String(i + 1).padStart(2, '0')} · {r.brewer}
                  </p>
                  <h3 className="mt-4 font-display text-[32px] leading-[1.1] tracking-[-0.01em]">{r.name}</h3>
                  <p className="mt-1.5 text-sm italic text-[var(--color-ink-3)]">— {r.author}</p>
                  <p className="mt-7 flex items-baseline justify-between font-mono text-xs text-[var(--color-ink-2)]">
                    <span>{formatMMSS(r.totalTimeSec)} · {r.baseDose}g</span>
                    <span className="font-medium text-[var(--color-accent)]">1:{r.baseRatio}</span>
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        </Reveal>
      </section>

      {/* CALCULATOR PREVIEW */}
      <Reveal>
        <CalcPreview />
      </Reveal>

      {/* BREWERS */}
      <section className="mx-auto max-w-7xl px-6 py-32 md:px-10 md:py-36">
        <Reveal>
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-[var(--color-accent)]">
            <span className="mr-3 inline-block h-px w-6 align-middle bg-[var(--color-accent)]" />
            by brewer
          </p>
        </Reveal>
        <Reveal delay={100}>
          <h2 className="mt-4 font-display text-[clamp(44px,5.5vw,80px)] leading-[0.98] tracking-[-0.02em] max-w-[18ch]">
            Seven brewers, <em className="text-[var(--color-accent)]">covered.</em>
          </h2>
        </Reveal>
        <Reveal delay={200}>
          <p className="mt-6 mb-20 max-w-[56ch] text-[19px] leading-[1.55] text-[var(--color-ink-2)]">
            Each brewer has its own page with the full recipe lineup, a brief on what to use it for, and a grind reference.
          </p>
        </Reveal>
        <Reveal delay={300}>
          <ul className="grid grid-cols-2 border-y border-[var(--color-line)] sm:grid-cols-3 lg:grid-cols-7">
            {brewers.map((b, i) => {
              const count = recipes.filter((r) => r.brewer === b.slug).length;
              return (
                <li key={b.slug} className="border-b border-r border-[var(--color-line)] last:border-r-0 lg:border-b-0">
                  <Link
                    href={`/brewers/${b.slug}`}
                    className="group block py-14 px-6 text-center transition-colors hover:bg-[var(--color-bg-warm)]"
                  >
                    <p className="mb-6 font-mono text-[11px] text-[var(--color-muted)]">{String(i + 1).padStart(2, '0')}</p>
                    <p className="font-display text-[28px] leading-[1.05] tracking-[-0.01em]">{b.short}</p>
                    <p className="mt-2 text-xs text-[var(--color-ink-3)] transition-colors group-hover:text-[var(--color-accent)]">
                      {count} {count === 1 ? 'recipe' : 'recipes'} →
                    </p>
                  </Link>
                </li>
              );
            })}
          </ul>
        </Reveal>
      </section>

      {/* JOURNAL — latest 3 posts from Sanity (section hides if none) */}
      {journalPosts.length > 0 ? (
        <section className="mx-auto max-w-7xl px-6 py-32 md:px-10 md:py-36">
          <Reveal>
            <p className="font-mono text-xs uppercase tracking-[0.18em] text-[var(--color-accent)]">
              <span className="mr-3 inline-block h-px w-6 align-middle bg-[var(--color-accent)]" />
              from the journal
            </p>
          </Reveal>
          <Reveal delay={100}>
            <div className="mt-4 mb-12 flex flex-wrap items-end justify-between gap-6">
              <h2 className="font-display text-[clamp(44px,5.5vw,80px)] leading-[0.98] tracking-[-0.02em] max-w-[18ch]">
                On coffee, <em className="text-[var(--color-accent)]">thinking aloud.</em>
              </h2>
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 rounded-full border border-[var(--color-line-strong)] px-5 py-2.5 text-sm font-medium text-[var(--color-ink)] transition hover:border-[var(--color-ink)] hover:bg-[var(--color-bg-warm)]"
              >
                All entries <span aria-hidden="true">→</span>
              </Link>
            </div>
          </Reveal>
          <Reveal delay={200}>
            <ul className="grid gap-8 md:grid-cols-3">
              {journalPosts.map((post, index) => {
                const hero = post.mainImage?.asset?._ref
                  ? urlFor(post.mainImage).width(1200).height(900).fit('crop').url()
                  : null;
                return (
                  <li key={post._id}>
                    <Link
                      href={`/blog/${post.slug.current}`}
                      className="group block focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-4 focus-visible:ring-offset-[var(--color-bg)]"
                    >
                      <div className="relative mb-5 flex aspect-[4/3] items-center justify-center overflow-hidden rounded-2xl bg-[var(--color-bg-warm)]">
                        {hero ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={hero}
                            alt={post.mainImage.alt ?? post.title}
                            loading={index === 0 ? 'eager' : 'lazy'}
                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                          />
                        ) : (
                          <span
                            className="font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--color-muted)]"
                          >
                            [ photo ]
                          </span>
                        )}
                      </div>
                      <p className="mb-2.5 font-mono text-[11px] uppercase tracking-[0.12em] text-[var(--color-accent)]">
                        — {post.category}
                      </p>
                      <h4 className="font-display text-[26px] leading-[1.15] tracking-[-0.01em] transition-colors group-hover:text-[var(--color-accent)]">
                        {post.title}
                      </h4>
                      <time
                        dateTime={post.publishedAt}
                        className="mt-2 block font-mono text-[11px] uppercase tracking-[0.12em] text-[var(--color-ink-3)]"
                      >
                        {formatJournalDate(post.publishedAt)}
                      </time>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </Reveal>
        </section>
      ) : null}

      {/* CTA BANNER */}
      <section className="relative overflow-hidden px-6 py-40 text-center md:py-48">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-1/2 -z-0 h-[1000px] w-[1000px] -translate-x-1/2 -translate-y-1/2"
          style={{ background: 'radial-gradient(circle, rgba(200, 105, 58, 0.08) 0%, transparent 50%)' }}
        />
        <div className="relative">
          <Reveal>
            <h2 className="mx-auto max-w-[14ch] font-display text-[clamp(56px,7vw,104px)] leading-[0.95] tracking-[-0.025em]">
              Make a <em className="text-[var(--color-accent)]">better</em> cup, tomorrow morning.
            </h2>
          </Reveal>
          <Reveal delay={100}>
            <p className="mt-8 text-[19px] text-[var(--color-ink-2)]">Bookmark it. Open it. Brew alongside the best.</p>
          </Reveal>
          <Reveal delay={200}>
            <div className="mt-10 flex flex-wrap justify-center gap-3">
              <Link
                href="/recipes/hoffmann-v60"
                className="inline-flex items-center gap-2 rounded-full bg-[var(--color-ink)] px-6 py-3.5 text-sm font-medium text-[var(--color-bg)] transition hover:-translate-y-px hover:shadow-[0_8px_24px_rgba(26,22,18,0.15)]"
              >
                Start brewing <span aria-hidden="true">→</span>
              </Link>
              <Link
                href="/recipes"
                className="inline-flex items-center gap-2 rounded-full border border-[var(--color-line-strong)] px-6 py-3.5 text-sm font-medium text-[var(--color-ink)] transition hover:border-[var(--color-ink)] hover:bg-[var(--color-bg-warm)]"
              >
                Browse all 12 recipes
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
