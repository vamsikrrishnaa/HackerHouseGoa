import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Make Your Mark — Hacker House Goa 2026',
  description:
    'Build your way into Hacker House Goa 2026. Create your frame or builder ID and share it on X. #FrameInGoa',
  openGraph: {
    title: 'Make Your Mark — HH Goa 2026',
    description:
      'Create your HH Goa 2026 photo frame or builder ID. Upload, customize, download & share. #FrameInGoa',
    siteName: 'Hacker House Goa 2026',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Make Your Mark — HH Goa 2026',
    description:
      'Create your HH Goa 2026 photo frame or builder ID. Upload, customize, download & share. #FrameInGoa',
  },
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export const viewport: Viewport = {
  colorScheme: 'light',
  themeColor: '#08783d',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
