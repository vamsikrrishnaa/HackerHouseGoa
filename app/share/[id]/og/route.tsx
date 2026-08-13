import { ImageResponse } from 'next/og'
import { head } from '@vercel/blob'

export const runtime = 'nodejs'

// Generate a 1200×630 OG image for X/social cards
// Embeds the user's 1080×1080 generated artifact into a landscape composition
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  let imageUrl = ''
  try {
    const blob = await head(`frames/${id}.png`)
    imageUrl = blob.url
  } catch {
    return new Response('Not found', { status: 404 })
  }

  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          width: '100%',
          height: '100%',
          background: '#08783d',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '30px 50px',
          gap: '50px',
          fontFamily: 'sans-serif',
        }}
      >
        {/* Left: generated artifact */}
        <div
          style={{
            display: 'flex',
            flexShrink: 0,
            border: '5px solid #111',
            boxShadow: '12px 12px 0px #ff1686',
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={imageUrl}
            width={480}
            height={480}
            style={{ display: 'block' }}
          />
        </div>

        {/* Right: branding */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
            maxWidth: '550px',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              marginBottom: '8px',
            }}
          >
            <div
              style={{
                display: 'flex',
                background: '#ffde16',
                borderRadius: '50%',
                width: '52px',
                height: '52px',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '22px',
                fontWeight: 900,
                color: '#111',
              }}
            >
              HH
            </div>
            <div
              style={{
                display: 'flex',
                background: '#ff1686',
                borderRadius: '20px',
                padding: '8px 18px',
                fontSize: '16px',
                fontWeight: 900,
                color: '#fffef4',
              }}
            >
              GOA · 26
            </div>
          </div>

          <div
            style={{
              fontSize: '52px',
              fontWeight: 900,
              color: '#ffde16',
              lineHeight: 1,
              letterSpacing: '-0.03em',
            }}
          >
            HACKER
          </div>
          <div
            style={{
              fontSize: '52px',
              fontWeight: 900,
              color: '#ffde16',
              lineHeight: 1,
              letterSpacing: '-0.03em',
            }}
          >
            HOUSE
          </div>
          <div
            style={{
              fontSize: '52px',
              fontWeight: 900,
              color: '#ff1686',
              lineHeight: 1,
              letterSpacing: '-0.03em',
            }}
          >
            GOA &apos;26
          </div>

          <div
            style={{
              display: 'flex',
              marginTop: '12px',
              fontSize: '26px',
              fontWeight: 900,
              color: '#fffef4',
              letterSpacing: '0.05em',
            }}
          >
            #FrameInGoa
          </div>

          <div
            style={{
              fontSize: '15px',
              fontWeight: 700,
              color: '#ffde16',
              letterSpacing: '0.1em',
              marginTop: '4px',
            }}
          >
            28—31 OCT · GOA, INDIA
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  )
}
