import { sanityClient } from './client'
import { SITE_ID } from './env'
import type {
  BlogPost,
  BlogPostSummary,
  BlogSitemapEntry,
} from '@/types/blog'

const BLOG_LIST_QUERY = `
  *[_type == "blog" && site == $site] | order(publishedAt desc) {
    _id,
    title,
    slug,
    site,
    category,
    publishedAt,
    excerpt,
    mainImage { asset, alt },
    color
  }
`

const BLOG_DETAIL_QUERY = `
  *[_type == "blog" && site == $site && slug.current == $slug][0] {
    _id,
    title,
    slug,
    site,
    category,
    publishedAt,
    excerpt,
    mainImage { asset, alt },
    contentImage { asset, alt },
    content,
    backlinks,
    color
  }
`

const BLOG_SLUGS_QUERY = `
  *[_type == "blog" && site == $site] { "slug": slug.current }
`

const BLOG_SITEMAP_QUERY = `
  *[_type == "blog" && site == $site && defined(slug.current) && defined(publishedAt)] {
    "slug": slug.current,
    publishedAt
  }
`

const BLOG_LATEST_QUERY = `
  *[_type == "blog" && site == $site] | order(publishedAt desc) [0...$limit] {
    _id,
    title,
    slug,
    site,
    category,
    publishedAt,
    excerpt,
    mainImage { asset, alt },
    color
  }
`

export async function fetchBlogPosts(): Promise<readonly BlogPostSummary[]> {
  return sanityClient.fetch<readonly BlogPostSummary[]>(BLOG_LIST_QUERY, {
    site: SITE_ID,
  })
}

export async function fetchLatestBlogPosts(
  limit = 3,
): Promise<readonly BlogPostSummary[]> {
  return sanityClient.fetch<readonly BlogPostSummary[]>(BLOG_LATEST_QUERY, {
    site: SITE_ID,
    limit,
  })
}

export async function fetchBlogPost(slug: string): Promise<BlogPost | null> {
  return sanityClient.fetch<BlogPost | null>(BLOG_DETAIL_QUERY, {
    site: SITE_ID,
    slug,
  })
}

export async function fetchBlogSlugs(): Promise<readonly string[]> {
  const result = await sanityClient.fetch<readonly { slug: string }[]>(
    BLOG_SLUGS_QUERY,
    { site: SITE_ID },
  )
  return result.map((r) => r.slug)
}

export async function fetchBlogSitemapEntries(): Promise<
  readonly BlogSitemapEntry[]
> {
  return sanityClient.fetch<readonly BlogSitemapEntry[]>(BLOG_SITEMAP_QUERY, {
    site: SITE_ID,
  })
}
