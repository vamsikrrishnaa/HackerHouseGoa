import { put } from '@vercel/blob'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const file = formData.get('image') as File | null

    if (!file) {
      return NextResponse.json({ error: 'No image provided' }, { status: 400 })
    }

    // Generate a short unique ID (no database needed)
    const id = crypto.randomUUID().slice(0, 12).replace(/-/g, '')

    const { url } = await put(`frames/${id}.png`, file, {
      access: 'public',
      addRandomSuffix: false,
    })

    return NextResponse.json({ url, id })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json(
      { error: 'Failed to upload. Ensure BLOB_READ_WRITE_TOKEN is set.' },
      { status: 500 }
    )
  }
}
