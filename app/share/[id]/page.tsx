import type { Metadata } from 'next'
import Link from 'next/link'
import { head } from '@vercel/blob'

type Props = {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  let imageUrl = ''

  try {
    // Look up the blob by its pathname — OIDC auth, no token needed
    const blob = await head(`frames/${id}.png`)
    imageUrl = blob.url
  } catch {
    // Blob not found or not accessible
  }

  return {
    title: 'Builder ID — Hacker House Goa 2026',
    description:
      'I just created my HH Goa 2026 Builder ID. Create yours! #FrameInGoa',
    openGraph: {
      title: 'Hacker House Goa 2026',
      description:
        'I just created my HH Goa 2026 Builder ID. Create yours! #FrameInGoa',
      type: 'website',
      ...(imageUrl && {
        images: [
          {
            url: imageUrl,
            width: 1080,
            height: 1080,
            alt: 'HH Goa 2026 Builder ID',
          },
        ],
      }),
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Hacker House Goa 2026',
      description:
        'I just created my HH Goa 2026 Builder ID. Create yours! #FrameInGoa',
      ...(imageUrl && { images: [imageUrl] }),
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
