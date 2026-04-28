import Link from 'next/link';
import { HeroPhoneDemo } from '@/components/HeroPhoneDemo';
import { PinnedBrewSection } from '@/components/PinnedBrewSection';

export default function HomePage() {
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
    </>
  );
}
