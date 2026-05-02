// Shared blog schema lives in pixdyne-dashboard/src/sanity/schemaTypes/blog.ts
// This type is the read-shape the site consumes via GROQ.

export interface SanityImageAsset {
  readonly asset: { readonly _ref: string }
  readonly alt: string
}

export interface BlogPostSummary {
  readonly _id: string
  readonly title: string
  readonly slug: { readonly current: string }
  readonly site: string
  readonly category: string
  readonly publishedAt: string
  readonly excerpt: string
  readonly mainImage: SanityImageAsset
  readonly color?: string
}

export interface BlogBacklink {
  readonly targetUrl: string
  readonly anchorText: string
  readonly client: string
}

export interface BlogPost extends BlogPostSummary {
  readonly contentImage?: SanityImageAsset
  readonly content: readonly Record<string, unknown>[]
  readonly backlinks?: readonly BlogBacklink[]
}

export interface BlogSitemapEntry {
  readonly slug: string
  readonly publishedAt: string
}
