import type { Metadata } from 'next'
import Link from 'next/link'

type Props = {
  searchParams: Promise<{ v?: string }>
}

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const params = await searchParams
  const imageUrl = params?.v || ''

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

export default async function SharePage({ searchParams }: Props) {
  const params = await searchParams
  const imageUrl = params?.v || ''

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
