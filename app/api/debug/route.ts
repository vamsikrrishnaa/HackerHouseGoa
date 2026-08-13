import { NextResponse } from 'next/server'

// Safe diagnostic — reports presence only, never values
export async function GET() {
  return NextResponse.json({
    BLOB_STORE_ID: !!process.env.BLOB_STORE_ID,
    BLOB_READ_WRITE_TOKEN: !!process.env.BLOB_READ_WRITE_TOKEN,
    VERCEL: !!process.env.VERCEL,
    VERCEL_ENV: process.env.VERCEL_ENV || 'not set',
    NODE_ENV: process.env.NODE_ENV,
    ts: new Date().toISOString(),
  })
}
