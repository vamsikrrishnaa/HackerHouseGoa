import { NextResponse } from 'next/server'

// Diagnostic endpoint — confirms which env vars are present
// Safe: only reports presence (true/false), never the values
export async function GET() {
  return NextResponse.json({
    BLOB_READ_WRITE_TOKEN: !!process.env.BLOB_READ_WRITE_TOKEN,
    BLOB_STORE_ID: !!process.env.BLOB_STORE_ID,
    NODE_ENV: process.env.NODE_ENV,
    ts: new Date().toISOString(),
  })
}
