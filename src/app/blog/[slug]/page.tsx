import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { PortableText, type PortableTextComponents } from '@portabletext/react'
import {
  fetchBlogPost,
  fetchBlogSlugs,
  fetchLatestBlogPosts,
} from '@/lib/sanity/queries'
import { urlFor } from '@/lib/sanity/client'
import { SITE_URL } from '@/lib/sanity/env'
import type { SanityImageAsset, BlogPostSummary } from '@/types/blog'

interface BlogPostPageProps {
  readonly params: Promise<{ readonly slug: string }>
}

export async function generateStaticParams() {
  const slugs = await fetchBlogSlugs()
  return slugs.map((slug) => ({ slug }))
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  })
}

export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params
  const post = await fetchBlogPost(slug)
  if (!post) return { title: 'Post Not Found' }

  const ogImage = post.mainImage?.asset?._ref
    ? urlFor(post.mainImage).width(1200).height(630).fit('crop').url()
    : undefined

  return {
    title: `${post.title} — Bloom Timer Journal`,
    description: post.excerpt,
    alternates: { canonical: `/blog/${post.slug.current}` },
    openGraph: {
      type: 'article',
      title: post.title,
      description: post.excerpt,
      url: `/blog/${post.slug.current}`,
      publishedTime: post.publishedAt,
      images: ogImage
        ? [
            {
              url: ogImage,
              alt: post.mainImage.alt,
              width: 1200,
              height: 630,
            },
          ]
        : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
    },
  }
}

const portableComponents: PortableTextComponents = {
  block: {
    h2: ({ children }) => (
      <h2 className="mt-14 mb-5 font-display text-[34px] leading-[1.15] tracking-[-0.01em] text-[var(--color-ink)]">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="mt-10 mb-4 font-display text-[26px] leading-[1.2] tracking-[-0.01em] text-[var(--color-ink)]">
        {children}
      </h3>
    ),
    blockquote: ({ children }) => (
      <blockquote className="my-8 border-l-2 border-[var(--color-accent)] pl-5 font-display italic text-[22px] leading-[1.45] text-[var(--color-ink-2)]">
        {children}
      </blockquote>
    ),
    normal: ({ children }) => (
      <p className="my-5 text-[17px] leading-[1.7] text-[var(--color-ink-2)]">
        {children}
      </p>
    ),
  },
  marks: {
    link: ({ children, value }) => {
      const href = value?.href ?? '#'
      const isExternal = /^https?:\/\//.test(href)
      return (
        <a
          href={href}
          className="text-[var(--color-accent)] underline-offset-4 hover:underline"
          {...(isExternal
            ? { target: '_blank', rel: 'noopener noreferrer' }
            : {})}
        >
          {children}
        </a>
      )
    },
    em: ({ children }) => <em className="italic text-[var(--color-ink)]">{children}</em>,
    strong: ({ children }) => <strong className="font-medium text-[var(--color-ink)]">{children}</strong>,
  },
  list: {
    bullet: ({ children }) => (
      <ul className="my-5 list-disc space-y-2 pl-6 text-[17px] leading-[1.7] text-[var(--color-ink-2)] marker:text-[var(--color-accent)]">
        {children}
      </ul>
    ),
    number: ({ children }) => (
      <ol className="my-5 list-decimal space-y-2 pl-6 text-[17px] leading-[1.7] text-[var(--color-ink-2)] marker:text-[var(--color-accent)]">
        {children}
      </ol>
    ),
  },
  types: {
    image: ({ value }) => {
      const image = value as SanityImageAsset | undefined
      if (!image?.asset?._ref) return null
      const src = urlFor(image).width(1600).fit('max').url()
      return (
        <figure className="my-10">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={src}
            alt={image.alt ?? ''}
            loading="lazy"
            className="w-full rounded-2xl"
          />
          {image.alt ? (
            <figcaption className="mt-3 text-center font-mono text-[11px] uppercase tracking-[0.12em] text-[var(--color-muted)]">
              {image.alt}
            </figcaption>
          ) : null}
        </figure>
      )
    },
  },
}

function RelatedCard({ post }: { readonly post: BlogPostSummary }) {
  const hero =
    post.mainImage?.asset?._ref
      ? urlFor(post.mainImage).width(800).height(600).fit('crop').url()
      : null
  return (
    <Link href={`/blog/${post.slug.current}`} className="group block">
      <div className="relative mb-4 flex aspect-[4/3] items-center justify-center overflow-hidden rounded-xl bg-[var(--color-bg-warm)]">
        {hero ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={hero}
            alt={post.mainImage.alt ?? post.title}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
        ) : null}
      </div>
      <p className="mb-2 font-mono text-[11px] uppercase tracking-[0.12em] text-[var(--color-accent)]">
        — {post.category}
      </p>
      <h3 className="font-display text-[22px] leading-[1.2] tracking-[-0.01em] text-[var(--color-ink)] transition-colors group-hover:text-[var(--color-accent)]">
        {post.title}
      </h3>
    </Link>
  )
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params
  const post = await fetchBlogPost(slug)
  if (!post) notFound()

  const heroUrl = post.mainImage?.asset?._ref
    ? urlFor(post.mainImage).width(2000).height(1200).fit('crop').url()
    : null

  const latest = await fetchLatestBlogPosts(4)
  const related = latest.filter((p) => p._id !== post._id).slice(0, 3)

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.excerpt,
    image: heroUrl ? [heroUrl] : undefined,
    datePublished: post.publishedAt,
    author: { '@type': 'Organization', name: 'Bloom Timer' },
    publisher: { '@type': 'Organization', name: 'Bloom Timer' },
    mainEntityOfPage: `${SITE_URL}/blog/${post.slug.current}`,
  }

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'Journal', item: `${SITE_URL}/blog` },
      {
        '@type': 'ListItem',
        position: 3,
        name: post.title,
        item: `${SITE_URL}/blog/${post.slug.current}`,
      },
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <article className="mx-auto max-w-3xl px-6 pt-20 pb-16 md:px-10 md:pt-28">
        <nav aria-label="Breadcrumb" className="mb-10">
          <Link
            href="/blog"
            className="font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--color-ink-3)] transition-colors hover:text-[var(--color-accent)]"
          >
            ← The Journal
          </Link>
        </nav>

        <header className="mb-10">
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--color-accent)]">
            — {post.category}
          </p>
          <h1 className="mt-4 font-display text-[clamp(40px,5.5vw,72px)] leading-[1.02] tracking-[-0.02em] text-[var(--color-ink)]">
            {post.title}
          </h1>
          {post.excerpt ? (
            <p className="mt-6 max-w-[60ch] text-[19px] leading-[1.55] text-[var(--color-ink-2)]">
              {post.excerpt}
            </p>
          ) : null}
          <time
            dateTime={post.publishedAt}
            className="mt-6 block font-mono text-[11px] uppercase tracking-[0.12em] text-[var(--color-ink-3)]"
          >
            {formatDate(post.publishedAt)}
          </time>
        </header>

        {heroUrl ? (
          <figure className="mb-12 overflow-hidden rounded-2xl bg-[var(--color-bg-warm)]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={heroUrl}
              alt={post.mainImage.alt ?? post.title}
              className="h-auto w-full"
            />
          </figure>
        ) : null}

        <div className="font-sans">
          <PortableText
            value={post.content as never}
            components={portableComponents}
          />
        </div>

        <footer className="mt-20 flex flex-wrap items-center justify-between gap-4 border-t border-[var(--color-line)] pt-8 text-[13px] text-[var(--color-ink-3)]">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.18em] transition-colors hover:text-[var(--color-accent)]"
          >
            ← Back to the Journal
          </Link>
          <span className="font-mono text-[11px] uppercase tracking-[0.18em]">
            bloom · {new Date().getFullYear()}
          </span>
        </footer>
      </article>

      {related.length > 0 ? (
        <section className="mx-auto max-w-7xl px-6 pb-32 md:px-10 md:pb-36">
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-[var(--color-accent)]">
            <span className="mr-3 inline-block h-px w-6 align-middle bg-[var(--color-accent)]" />
            keep reading
          </p>
          <h2 className="mt-4 mb-12 font-display text-[clamp(32px,4vw,52px)] leading-[1.05] tracking-[-0.02em]">
            More from the journal.
          </h2>
          <ul className="grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((p) => (
              <li key={p._id}>
                <RelatedCard post={p} />
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </>
  )
}
