'use client';

import { useEffect, useState } from 'react';

export function SiteNav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav
      className={`fixed inset-x-0 top-0 z-50 backdrop-blur-xl transition-colors duration-300 ${
        scrolled ? 'border-b border-[var(--color-line)]' : 'border-b border-transparent'
      }`}
      style={{ background: 'rgba(248, 246, 241, 0.7)' }}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 md:px-10">
        <a href="/" className="font-display text-2xl tracking-tight">
          bloom<em className="not-italic text-[var(--color-accent)]">.</em>
        </a>
        <ul className="flex items-center gap-1 text-sm">
          <li className="hidden md:block"><a href="/recipes" className="rounded-full px-3 py-1.5 text-[var(--color-ink-2)] transition-colors hover:bg-[var(--color-bg-warm)] hover:text-[var(--color-ink)]">Recipes</a></li>
          <li className="hidden md:block"><a href="/calculator" className="rounded-full px-3 py-1.5 text-[var(--color-ink-2)] transition-colors hover:bg-[var(--color-bg-warm)] hover:text-[var(--color-ink)]">Calculator</a></li>
          <li className="hidden md:block"><a href="/xbloom" className="rounded-full px-3 py-1.5 text-[var(--color-ink-2)] transition-colors hover:bg-[var(--color-bg-warm)] hover:text-[var(--color-ink)]">xBloom</a></li>
          <li className="hidden md:block"><a href="/brewers" className="rounded-full px-3 py-1.5 text-[var(--color-ink-2)] transition-colors hover:bg-[var(--color-bg-warm)] hover:text-[var(--color-ink)]">Brewers</a></li>
          <li>
            <a
              href="/recipes/hoffmann-v60"
              className="ml-2 rounded-full bg-[var(--color-ink)] px-4 py-2 text-[var(--color-bg)] transition-opacity hover:opacity-85"
            >
              Start brewing →
            </a>
          </li>
        </ul>
      </div>
    </nav>
  );
}
