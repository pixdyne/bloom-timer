import type { Metadata } from 'next'
import Link from 'next/link'
import { fetchBlogPosts } from '@/lib/sanity/queries'
import { urlFor } from '@/lib/sanity/client'
import type { BlogPostSummary } from '@/types/blog'

export const metadata: Metadata = {
  title: 'Journal — Bloom Timer',
  description:
    'Field notes on pour-over coffee — method, equipment, and the small details that make a better cup.',
  alternates: { canonical: '/blog' },
  openGraph: {
    type: 'website',
    title: 'Journal — Bloom Timer',
    description:
      'Field notes on pour-over coffee — method, equipment, and the small details that make a better cup.',
    url: '/blog',
  },
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

function JournalCard({ post, index }: { readonly post: BlogPostSummary; readonly index: number }) {
  const hero =
    post.mainImage?.asset?._ref
      ? urlFor(post.mainImage).width(1200).height(900).fit('crop').url()
      : null

  return (
    <li>
      <Link
        href={`/blog/${post.slug.current}`}
        className="group block focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-4 focus-visible:ring-offset-[var(--color-bg)]"
      >
        <div
          className="relative mb-5 flex aspect-[4/3] items-center justify-center overflow-hidden rounded-2xl bg-[var(--color-bg-warm)]"
        >
          {hero ? (
            // Sanity-hosted image; using <img> avoids configuring next/image domains for CDN
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={hero}
              alt={post.mainImage.alt ?? post.title}
              loading={index < 3 ? 'eager' : 'lazy'}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            />
          ) : (
            <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--color-muted)]">
              [ image ]
            </span>
          )}
        </div>
        <p className="mb-2.5 font-mono text-[11px] uppercase tracking-[0.12em] text-[var(--color-accent)]">
          — {post.category}
        </p>
        <h2 className="font-display text-[26px] leading-[1.15] tracking-[-0.01em] text-[var(--color-ink)] transition-colors group-hover:text-[var(--color-accent)]">
          {post.title}
        </h2>
        {post.excerpt ? (
          <p className="mt-3 line-clamp-3 text-[15px] leading-[1.55] text-[var(--color-ink-2)]">
            {post.excerpt}
          </p>
        ) : null}
        <time
          dateTime={post.publishedAt}
          className="mt-4 block font-mono text-[11px] uppercase tracking-[0.12em] text-[var(--color-ink-3)]"
        >
          {formatDate(post.publishedAt)}
        </time>
      </Link>
    </li>
  )
}

export default async function BlogIndexPage() {
  const posts = await fetchBlogPosts()

  return (
    <main>
      <section className="mx-auto max-w-7xl px-6 pt-24 pb-12 md:px-10 md:pt-32">
        <p className="font-mono text-xs uppercase tracking-[0.18em] text-[var(--color-accent)]">
          <span className="mr-3 inline-block h-px w-6 align-middle bg-[var(--color-accent)]" />
          the journal
        </p>
        <h1 className="mt-4 font-display text-[clamp(44px,6vw,88px)] leading-[0.98] tracking-[-0.02em] max-w-[20ch]">
          On coffee, <em className="text-[var(--color-accent)]">thinking aloud.</em>
        </h1>
        <p className="mt-6 max-w-[56ch] text-[19px] leading-[1.55] text-[var(--color-ink-2)]">
          Method notes, equipment thoughts, and short essays on the daily ritual of brewing a
          better cup. Written at the pace it deserves.
        </p>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-32 md:px-10 md:pb-36">
        {posts.length === 0 ? (
          <div className="border-y border-[var(--color-line)] py-24 text-center">
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--color-muted)]">
              — coming soon
            </p>
            <p className="mt-4 font-display text-[28px] leading-[1.15] text-[var(--color-ink)]">
              The first piece is still drying on the page.
            </p>
            <p className="mt-3 text-[15px] text-[var(--color-ink-3)]">
              Check back shortly, or start brewing in the meantime.
            </p>
            <Link
              href="/recipes"
              className="mt-8 inline-flex items-center gap-2 rounded-full border border-[var(--color-line-strong)] px-6 py-3 text-sm font-medium text-[var(--color-ink)] transition hover:border-[var(--color-ink)] hover:bg-[var(--color-bg-warm)]"
            >
              Browse recipes
            </Link>
          </div>
        ) : (
          <ul className="grid grid-cols-1 gap-x-10 gap-y-16 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post, i) => (
              <JournalCard key={post._id} post={post} index={i} />
            ))}
          </ul>
        )}
      </section>
    </main>
  )
}
