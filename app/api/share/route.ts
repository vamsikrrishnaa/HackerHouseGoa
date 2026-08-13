import { put } from '@vercel/blob'
import { NextResponse } from 'next/server'

export const runtime = 'nodejs'

export async function POST(request: Request) {
  // Diagnostic logging — safe (no secrets)
  console.log('[share] BLOB_STORE_ID present:', !!process.env.BLOB_STORE_ID)
  console.log('[share] NODE_ENV:', process.env.NODE_ENV)
  console.log('[share] VERCEL:', process.env.VERCEL)

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

    // @vercel/blob 2.x uses OIDC automatically on Vercel
    // No manual token needed — the SDK reads BLOB_STORE_ID + VERCEL_OIDC_TOKEN
    const blob = await put(pathname, file, {
      access: 'public',
      addRandomSuffix: false,
    })

    console.log('[share] Upload success:', blob.url)
    return NextResponse.json({ url: blob.url, id })
  } catch (error) {
    const err = error as Error
    console.error('[share] Blob put() failed:', err.name, err.message)
    return NextResponse.json(
      { error: `Upload failed: ${err.message}` },
      { status: 500 }
    )
  }
}
