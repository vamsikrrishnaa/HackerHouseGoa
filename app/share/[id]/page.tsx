import type { Metadata } from 'next'
import Link from 'next/link'
import { head } from '@vercel/blob'
import { headers } from 'next/headers'

type Props = {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params

  // Construct absolute URL for OG image (same-domain route)
  const headersList = await headers()
  const host = headersList.get('host') || 'localhost:3000'
  const proto = headersList.get('x-forwarded-proto') || 'https'
  const ogImageUrl = `${proto}://${host}/share/${id}/og`

  return {
    title: 'Builder ID — Hacker House Goa 2026',
    description:
      'I just created my HH Goa 2026 Builder ID. Create yours! #FrameInGoa',
    openGraph: {
      title: 'Hacker House Goa 2026',
      description:
        'I just created my HH Goa 2026 Builder ID. Create yours! #FrameInGoa',
      type: 'website',
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: 'HH Goa 2026 Builder ID',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Hacker House Goa 2026',
      description:
        'I just created my HH Goa 2026 Builder ID. Create yours! #FrameInGoa',
      images: [ogImageUrl],
    },
  }
}

export default async function SharePage({ params }: Props) {
  const { id } = await params
  let imageUrl = ''

  try {
    const blob = await head(`frames/${id}.png`)
    imageUrl = blob.url
  } catch {
    // not found
  }

  return (
    <main className="share-page">
      <header className="share-topbar">
        <div className="brand-mark">
          <span>HH</span>
          <i>GOA</i>
        </div>
        <span>HACKER HOUSE GOA 2026</span>
      </header>

      <div className="share-body">
        {imageUrl ? (
          <div className="share-card">
            <img
              src={imageUrl}
              alt="HH Goa 2026 Builder ID"
              width={1080}
              height={1080}
            />
          </div>
        ) : (
          <div className="share-empty">
            <p>This share link has expired or is invalid.</p>
          </div>
        )}

        <p className="share-hashtag">#FrameInGoa</p>

        <Link href="/" className="share-cta">
          Create yours →
        </Link>
      </div>

      <footer className="share-footer">
        <span>28—31 OCT 2026 · GOA, INDIA</span>
      </footer>
    </main>
  )
}
