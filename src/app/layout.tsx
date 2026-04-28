import type { Metadata } from 'next';
import { Geist, Geist_Mono, Instrument_Serif } from 'next/font/google';
import './globals.css';
import { SiteNav } from '@/components/SiteNav';

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
        <SiteNav />
        <div className="pt-[68px]">{children}</div>
      </body>
    </html>
  );
}
