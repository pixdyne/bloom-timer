import type { Metadata } from 'next';
import { Geist, Geist_Mono, Instrument_Serif } from 'next/font/google';
import './globals.css';

const instrumentSerif = Instrument_Serif({
  variable: '--font-display',
  subsets: ['latin'],
  weight: '400',
  style: ['normal', 'italic'],
  display: 'swap',
});

const geist = Geist({
  variable: '--font-sans',
  subsets: ['latin'],
  display: 'swap',
});

const geistMono = Geist_Mono({
  variable: '--font-mono',
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Bloom Timer — Pour Over Coffee Recipes & Timer',
  description:
    'A precise, kitchen-friendly brew timer with twelve championship pour-over recipes. No accounts, no tracking.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body
        className={`${instrumentSerif.variable} ${geist.variable} ${geistMono.variable} antialiased font-sans`}
      >
        <nav className="border-b border-[var(--color-line)]">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4 md:px-10">
            <a href="/" className="font-display text-2xl tracking-tight">
              bloom<em className="not-italic text-[var(--color-accent)]">.</em>
            </a>
            <ul className="flex gap-1 text-sm">
              <li><a href="/recipes" className="rounded-full px-3 py-1.5 text-[var(--color-ink-2)] hover:bg-[var(--color-bg-warm)] hover:text-[var(--color-ink)]">Recipes</a></li>
              <li><a href="/brewers" className="rounded-full px-3 py-1.5 text-[var(--color-ink-2)] hover:bg-[var(--color-bg-warm)] hover:text-[var(--color-ink)]">Brewers</a></li>
            </ul>
          </div>
        </nav>
        {children}
      </body>
    </html>
  );
}
