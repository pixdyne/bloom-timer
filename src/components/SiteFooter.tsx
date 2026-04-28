import Link from 'next/link';

export function SiteFooter() {
  return (
    <footer className="border-t border-[var(--color-line)] pt-16 pb-10">
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <div className="mb-14 grid gap-14 md:grid-cols-[2fr_1fr_1fr_1fr]">
          <div>
            <Link href="/" className="font-display text-[32px] tracking-tight">
              bloom<em className="not-italic text-[var(--color-accent)]">.</em>
            </Link>
            <p className="mt-4 max-w-[32ch] text-sm leading-[1.6] text-[var(--color-ink-3)]">
              A precise pour-over timer with twelve championship recipes. Open source. No tracking.
            </p>
          </div>
          <Col title="Product" links={[
            { href: '/recipes', label: 'Recipes' },
            { href: '/calculator', label: 'Calculator' },
            { href: '/brewers', label: 'Brewers' },
            { href: '/xbloom', label: 'xBloom' },
          ]} />
          <Col title="Read" links={[
            { href: '/blog', label: 'Journal' },
            { href: '/blog', label: 'Method guides' },
          ]} />
          <Col title="About" links={[
            { href: 'mailto:hello@bloomtimer.com', label: 'Contact' },
            { href: '/colophon', label: 'Colophon' },
          ]} />
        </div>
        <div className="flex flex-col justify-between gap-3 border-t border-[var(--color-line)] pt-6 text-[13px] text-[var(--color-ink-3)] md:flex-row">
          <span>bloom · {new Date().getFullYear()} · Hosted on Vercel</span>
          <span>Set in Instrument Serif &amp; Geist</span>
        </div>
      </div>
    </footer>
  );
}

function Col({ title, links }: { title: string; links: Array<{ href: string; label: string }> }) {
  return (
    <div>
      <h5 className="mb-4 font-mono text-[11px] uppercase tracking-[0.12em] font-medium text-[var(--color-muted)]">
        {title}
      </h5>
      {links.map((l) => (
        <Link
          key={`${title}-${l.label}`}
          href={l.href}
          className="block py-1 text-sm text-[var(--color-ink)] transition-colors hover:text-[var(--color-accent)]"
        >
          {l.label}
        </Link>
      ))}
    </div>
  );
}
