import Link from 'next/link';
import { Ticker } from '@/components/Ticker';

export function CalcPreview() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-20 md:px-10">
      <div
        className="relative overflow-hidden rounded-3xl px-8 py-16 md:px-16 md:py-20"
        style={{ background: 'var(--color-ink)', color: 'var(--color-bg)' }}
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-52 -top-52 h-[500px] w-[500px]"
          style={{ background: 'radial-gradient(circle, rgba(200, 105, 58, 0.15) 0%, transparent 60%)' }}
        />
        <div className="relative grid items-center gap-12 md:grid-cols-[1fr_1.2fr] md:gap-20">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.18em] text-[var(--color-accent)]">— the calculator</p>
            <h3 className="mt-4 font-display text-[clamp(40px,4vw,56px)] leading-none tracking-[-0.02em]">
              Scale a recipe to <em className="text-[var(--color-accent-light)]">your</em> cup.
            </h3>
            <p className="mt-6 max-w-[36ch] text-[17px] leading-[1.55]" style={{ color: 'rgba(248,246,241,0.7)' }}>
              Adjust dose, ratio, cup count — every pour target re-computes in real time.
              The URL stays sharable. No backend required.
            </p>
            <Link
              href="/calculator"
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-[var(--color-bg)] px-6 py-3.5 text-sm font-medium text-[var(--color-ink)] transition hover:opacity-85"
            >
              Open calculator <span aria-hidden="true">→</span>
            </Link>
          </div>

          <div
            className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border"
            style={{ background: 'rgba(255,255,255,0.08)', borderColor: 'rgba(255,255,255,0.08)' }}
          >
            <Cell label="servings" delta="↑ from 1">
              <Ticker target={2} />
              <span className="ml-1 font-sans text-[22px] font-medium" style={{ color: 'rgba(248,246,241,0.4)' }}>cups</span>
            </Cell>
            <Cell label="ratio" delta="slightly richer">
              1:<em className="italic"><Ticker target={16} /></em>
            </Cell>
            <Cell label="coffee" delta="↑ doubled">
              <Ticker target={31} />.3
              <span className="ml-1 font-sans text-[22px] font-medium" style={{ color: 'rgba(248,246,241,0.4)' }}>g</span>
            </Cell>
            <Cell label="water" delta="— scaled by 2.0×" accent>
              <Ticker target={500} />
              <span className="ml-1 font-sans text-[22px] font-medium" style={{ color: 'rgba(248,246,241,0.4)' }}>g</span>
            </Cell>
          </div>
        </div>
      </div>
    </section>
  );
}

interface CellProps {
  label: string;
  delta: string;
  accent?: boolean;
  children: React.ReactNode;
}

function Cell({ label, delta, accent = false, children }: CellProps) {
  return (
    <div className="px-8 py-7" style={{ background: 'rgba(255,255,255,0.02)' }}>
      <p className="font-mono text-[11px] uppercase tracking-[0.12em]" style={{ color: 'rgba(248,246,241,0.5)' }}>
        {label}
      </p>
      <p
        className={`mt-2.5 font-display text-[56px] leading-[0.95] tracking-[-0.025em] tabular-nums ${
          accent ? 'text-[var(--color-accent)]' : ''
        }`}
      >
        {children}
      </p>
      <p className="mt-1.5 font-mono text-[11px] text-[var(--color-accent)]">{delta}</p>
    </div>
  );
}
