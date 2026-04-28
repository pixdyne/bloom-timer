'use client';

import { useState } from 'react';
import QRCode from 'qrcode';
import {
  xbloomProfileToJSON,
  xbloomProfileToFilename,
  xbloomProfileToQRPayload,
} from '@/lib/xbloom';
import type { XBloomProfile } from '@/lib/types';

type Props = {
  profile: XBloomProfile;
  slug: string;
};

export function XBloomBlock({ profile, slug }: Props) {
  const [copied, setCopied] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(xbloomProfileToJSON(profile));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard API unavailable — silently ignore
    }
  };

  const handleQR = async () => {
    if (qrDataUrl) {
      setQrDataUrl(null);
      return;
    }
    try {
      const url = await QRCode.toDataURL(xbloomProfileToQRPayload(profile), {
        margin: 2,
        scale: 6,
        color: { dark: '#1a1612', light: '#f8f6f1' },
      });
      setQrDataUrl(url);
    } catch {
      // QR generation failure (payload too large) — show nothing
    }
  };

  const handleDownload = () => {
    const blob = new Blob([xbloomProfileToJSON(profile)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = xbloomProfileToFilename(slug);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <section
      aria-label="On xBloom"
      className="my-12 rounded-2xl border border-[var(--color-line)] bg-[var(--color-bg-warm)] p-8 md:p-10"
    >
      <header className="flex flex-wrap items-baseline justify-between gap-3">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-[var(--color-accent)]">
            — on xbloom
          </p>
          <h2 className="mt-3 font-display text-3xl tracking-tight md:text-4xl">
            This recipe, on <em className="text-[var(--color-accent)]">xBloom Studio.</em>
          </h2>
        </div>
        <p className="font-mono text-xs text-[var(--color-muted)]">
          {profile.firmwareVersion} · verified {profile.verifiedDate}
        </p>
      </header>

      <div className="mt-8 grid grid-cols-2 gap-6 border-y border-[var(--color-line)] py-6 md:grid-cols-4">
        <Cell label="Dose" value={`${profile.bean.dose_g}g`} />
        <Cell label="Grind" value={`${profile.bean.grindSetting} / 10`} />
        <Cell label="Water" value={`${profile.water.total_g}g @ ${profile.water.tempC}°C`} />
        <Cell label="Bloom" value={`${profile.bloomTime_sec}s`} />
      </div>

      <ol className="mt-6 divide-y divide-[var(--color-line)] border-b border-[var(--color-line)]">
        {profile.pours.map((pour, i) => (
          <li key={i} className="grid grid-cols-[40px_120px_1fr_auto] gap-4 py-3 font-mono text-sm">
            <span className="text-[var(--color-muted)]">{String(i + 1).padStart(2, '0')}</span>
            <span className="text-[var(--color-accent)]">
              {formatRange(pour.startSec, pour.endSec)}
            </span>
            <span className="text-[var(--color-ink)]">
              <span className="capitalize">{pour.pattern.replace('-', ' ')}</span>
              <span className="ml-2 text-[var(--color-muted)]">· {pour.speed}</span>
            </span>
            <span className="text-right text-[var(--color-accent)]">{pour.targetWeight_g}g</span>
          </li>
        ))}
      </ol>

      <div className="mt-6 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={handleCopy}
          className="rounded-full bg-[var(--color-ink)] px-5 py-2.5 text-sm font-medium text-[var(--color-bg)] transition hover:opacity-85"
        >
          {copied ? 'Copied ✓' : 'Copy as JSON'}
        </button>
        <button
          type="button"
          onClick={handleQR}
          className="rounded-full border border-[var(--color-line-strong)] px-5 py-2.5 text-sm transition hover:bg-[var(--color-bg-deep)]"
        >
          {qrDataUrl ? 'Hide QR' : 'Show QR code'}
        </button>
        <button
          type="button"
          onClick={handleDownload}
          className="rounded-full border border-[var(--color-line-strong)] px-5 py-2.5 text-sm transition hover:bg-[var(--color-bg-deep)]"
        >
          Download .xbloomprofile
        </button>
      </div>

      {qrDataUrl && (
        <div className="mt-6 flex justify-center rounded-xl bg-[var(--color-bg)] p-6">
          <img src={qrDataUrl} alt="xBloom profile QR code" className="h-64 w-64" />
        </div>
      )}

      <p className="mt-8 font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-muted)]">
        Not affiliated with xBloom Inc. · placeholder values pending real-device verification
      </p>
    </section>
  );
}

function Cell({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="font-mono text-xs uppercase tracking-[0.18em] text-[var(--color-muted)]">
        {label}
      </p>
      <p className="mt-2 font-display text-2xl">{value}</p>
    </div>
  );
}

function formatRange(startSec: number, endSec: number): string {
  const fmt = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, '0')}`;
  };
  return `${fmt(startSec)}–${fmt(endSec)}`;
}
