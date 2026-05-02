import { revalidatePath } from 'next/cache'
import { parseBody } from 'next-sanity/webhook'
import { type NextRequest, NextResponse } from 'next/server'
import { SITE_ID } from '@/lib/sanity/env'

export const dynamic = 'force-dynamic'

interface BlogWebhookBody {
  readonly _type: 'blog'
  readonly site: string
  readonly slug?: { readonly current: string }
}

export async function POST(req: NextRequest) {
  try {
    const { body, isValidSignature } = await parseBody<BlogWebhookBody>(
      req,
      process.env.SANITY_REVALIDATE_SECRET,
    )

    if (!isValidSignature) {
      return NextResponse.json(
        { message: 'Invalid signature' },
        { status: 401 },
      )
    }

    if (!body?._type || body._type !== 'blog' || body.site !== SITE_ID) {
      return NextResponse.json({ message: 'Ignored', body }, { status: 200 })
    }

    revalidatePath('/')
    revalidatePath('/blog')
    revalidatePath('/sitemap.xml')
    if (body.slug?.current) {
      revalidatePath(`/blog/${body.slug.current}`)
    }

    return NextResponse.json({
      revalidated: true,
      site: body.site,
      slug: body.slug?.current ?? null,
    })
  } catch (error) {
    return NextResponse.json(
      {
        message:
          error instanceof Error ? error.message : 'Revalidation failed',
      },
      { status: 500 },
    )
  }
}
