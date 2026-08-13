import { put } from '@vercel/blob'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  // Guard: if no token, return 503 so client can open X without the share URL
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    console.warn('BLOB_READ_WRITE_TOKEN not set — skipping Blob upload')
    return NextResponse.json(
      { error: 'Blob not configured' },
      { status: 503 }
    )
  }

  try {
    const formData = await request.formData()
    const file = formData.get('image') as File | null

    if (!file) {
      return NextResponse.json({ error: 'No image provided' }, { status: 400 })
    }

    // Generate a short unique ID — Blob IS the storage, no DB needed
    const id = crypto.randomUUID().slice(0, 12).replace(/-/g, '')

    const { url } = await put(`frames/${id}.png`, file, {
      access: 'public',
      addRandomSuffix: false,
      token: process.env.BLOB_READ_WRITE_TOKEN,
    })

    return NextResponse.json({ url, id })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json(
      { error: 'Upload failed' },
      { status: 500 }
    )
  }
}
