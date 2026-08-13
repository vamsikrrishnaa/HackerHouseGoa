import { put } from '@vercel/blob'
import { NextResponse } from 'next/server'

export const runtime = 'nodejs'

export async function POST(request: Request) {
  const token = process.env.BLOB_READ_WRITE_TOKEN

  // Diagnostic: log env state (no secret values exposed)
  console.log('[share] BLOB_READ_WRITE_TOKEN present:', !!token)
  console.log('[share] NODE_ENV:', process.env.NODE_ENV)

  if (!token) {
    console.error('[share] BLOB_READ_WRITE_TOKEN is not set in this environment')
    // Return 503 so the client-side catch opens X without a URL
    // (the auto-downloaded PNG is still available to attach manually)
    return NextResponse.json(
      { error: 'Blob not configured — BLOB_READ_WRITE_TOKEN missing' },
      { status: 503 }
    )
  }

  let formData: FormData
  try {
    formData = await request.formData()
  } catch (err) {
    console.error('[share] Failed to parse formData:', err)
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }

  const file = formData.get('image') as File | null
  if (!file || file.size === 0) {
    console.error('[share] No image in formData. Keys:', [...formData.keys()])
    return NextResponse.json({ error: 'No image provided' }, { status: 400 })
  }

  console.log('[share] Uploading file:', file.name, 'size:', file.size)

  try {
    const id = crypto.randomUUID().slice(0, 12).replace(/-/g, '')
    const pathname = `frames/${id}.png`

    const { url } = await put(pathname, file, {
      access: 'public',
      addRandomSuffix: false,
      token,
    })

    console.log('[share] Upload success:', url)
    return NextResponse.json({ url, id })
  } catch (error) {
    console.error('[share] Blob put() failed:', error)
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
  }
}
