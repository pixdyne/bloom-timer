import Link from 'next/link';
import { recipes } from '@/data/recipes';
import { formatMMSS } from '@/lib/time';

export const metadata = {
  title: 'xBloom Recipes — Bloom Timer',
  description:
    'Twelve championship pour-over recipes, translated to xBloom Studio parameters. Copy as JSON, scan a QR code, or download the .xbloomprofile.',
  alternates: { canonical: '/xbloom' },
};

export default function XBloomHub() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-16 md:px-10 md:py-24">
      <header className="mb-16 md:mb-24">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-[var(--color-accent)]">
          — for xbloom studio owners
        </p>
        <h1 className="mt-6 font-display text-5xl leading-[0.95] tracking-tight md:text-7xl">
          Classic recipes, on <em className="text-[var(--color-accent)]">xBloom.</em>
        </h1>
        <p className="mt-6 max-w-prose text-lg text-[var(--color-ink-2)]">
          Hoffmann, Tetsu Kasuya, Lance Hedrick, Wendelboe, Onyx — twelve championship pour-over
          recipes, translated into xBloom Studio parameters. Copy the JSON, scan the QR, or
          download the profile file.
        </p>
      </header>

      <section>
        <h2 className="font-display text-3xl tracking-tight md:text-4xl">The Library</h2>
        <ul className="mt-8 grid grid-cols-1 gap-px border-y border-[var(--color-line)] bg-[var(--color-line)] sm:grid-cols-2 lg:grid-cols-3">
          {recipes.map((r) => (
            <li key={r.slug} className="bg-[var(--color-bg)]">
              <Link
                href={`/xbloom/${r.slug}`}
                className="block p-8 transition-colors hover:bg-[var(--color-bg-warm)]"
              >
                <p className="font-mono text-xs text-[var(--color-muted)]">№ {r.brewer}</p>
                <h3 className="mt-3 font-display text-2xl tracking-tight">{r.name}</h3>
                <p className="mt-1 text-sm italic text-[var(--color-ink-3)]">— {r.author}</p>
                <p className="mt-6 flex items-baseline justify-between font-mono text-xs text-[var(--color-ink-2)]">
                  <span>
                    {r.xbloomProfile?.bean.dose_g ?? r.baseDose}g · grind {r.xbloomProfile?.bean.grindSetting ?? '?'}
                  </span>
                  <span className="text-[var(--color-accent)]">{formatMMSS(r.totalTimeSec)}</span>
                </p>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-24 rounded-2xl border border-[var(--color-line)] bg-[var(--color-bg-warm)] p-10 md:p-14">
        <h2 className="font-display text-3xl tracking-tight md:text-4xl">Why this exists.</h2>
        <p className="mt-6 max-w-prose text-lg text-[var(--color-ink-2)]">
          The xBloom Studio ships with its own recipe library, but it&apos;s in-app and not
          searchable on the open web. This page collects the most-asked-for classic
          pour-over recipes — Hoffmann&apos;s V60, Kasuya&apos;s 4:6, Wendelboe&apos;s
          AeroPress — translated into xBloom parameters. Each one is verified on a real
          xBloom Studio before publishing.
        </p>
        <p className="mt-4 max-w-prose text-[var(--color-ink-3)]">
          Found a parameter that doesn&apos;t taste right?{' '}
          <a href="mailto:hello@bloomtimer.com" className="underline decoration-dotted underline-offset-4">
            Tell us
          </a>{' '}
          — we&apos;ll re-test on the next firmware update and credit you.
        </p>
      </section>

      <p className="mt-12 font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-muted)]">
        Not affiliated with xBloom Inc.
      </p>
    </main>
  );
}
