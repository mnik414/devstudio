import { NextRequest, NextResponse } from 'next/server'
import { readFile } from 'fs/promises'
import path from 'path'
import { existsSync } from 'fs'

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const { path: segments } = await params
  const filename = segments.join('/')

  const filepath = path.join(process.cwd(), 'public', 'uploads', filename)
  if (!existsSync(filepath)) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  const ext = path.extname(filename).toLowerCase()
  const mime: Record<string, string> = {
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.gif': 'image/gif',
    '.webp': 'image/webp',
    '.svg': 'image/svg+xml',
  }

  const bytes = await readFile(filepath)
  return new NextResponse(bytes, {
    headers: {
      'Content-Type': mime[ext] || 'application/octet-stream',
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  })
}