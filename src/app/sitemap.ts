import type { MetadataRoute } from 'next'
import { fetchBlogSitemapEntries } from '@/lib/sanity/queries'
import { SITE_URL } from '@/lib/sanity/env'
import { recipes } from '@/data/recipes'
import { brewers } from '@/data/brewers'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const blogEntries = await fetchBlogSitemapEntries().catch(() => [])

  const now = new Date()

  const staticPages: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, lastModified: now, changeFrequency: 'weekly', priority: 1 },
    { url: `${SITE_URL}/recipes`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${SITE_URL}/brewers`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${SITE_URL}/calculator`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${SITE_URL}/xbloom`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${SITE_URL}/blog`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
  ]

  const recipePages: MetadataRoute.Sitemap = recipes.map((r) => ({
    url: `${SITE_URL}/recipes/${r.slug}`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.7,
  }))

  const brewerPages: MetadataRoute.Sitemap = brewers.map((b) => ({
    url: `${SITE_URL}/brewers/${b.slug}`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.6,
  }))

  const blogPages: MetadataRoute.Sitemap = blogEntries.map((entry) => ({
    url: `${SITE_URL}/blog/${entry.slug}`,
    lastModified: new Date(entry.publishedAt),
    changeFrequency: 'monthly',
    priority: 0.7,
  }))

  return [...staticPages, ...recipePages, ...brewerPages, ...blogPages]
}
