import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { bus } from '@/lib/bus'

export async function GET() {
  const sources = await prisma.source.findMany({
    orderBy: { createdAt: 'desc' },
    include: { _count: { select: { items: true } } },
  })
  return NextResponse.json(sources)
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { name, url, type = 'rss', pollIntervalMs = 300000 } = body

  if (!url) {
    return NextResponse.json({ error: 'URL is required' }, { status: 400 })
  }

  const existing = await prisma.source.findUnique({ where: { url } })
  if (existing) {
    return NextResponse.json({ error: 'Source with this URL already exists' }, { status: 409 })
  }

  const source = await prisma.source.create({
    data: {
      name: name || new URL(url).hostname,
      url,
      type,
      pollIntervalMs,
    },
  })

  bus.emit('source:added', { sourceId: source.id })
  return NextResponse.json(source, { status: 201 })
}

export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const id = searchParams.get('id')
  if (!id) {
    return NextResponse.json({ error: 'ID is required' }, { status: 400 })
  }

  await prisma.source.delete({ where: { id } })
  bus.emit('source:removed', { sourceId: id })
  return NextResponse.json({ ok: true })
}
