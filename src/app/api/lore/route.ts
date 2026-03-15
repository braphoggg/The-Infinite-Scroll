import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const topic = searchParams.get('topic')
  const search = searchParams.get('search')
  const status = searchParams.get('status') || 'classified'
  const limit = Math.min(parseInt(searchParams.get('limit') || '50'), 100)
  const offset = parseInt(searchParams.get('offset') || '0')

  const where: Record<string, unknown> = {}
  if (status !== 'all') where.status = status
  if (search) {
    where.OR = [
      { title: { contains: search } },
      { summary: { contains: search } },
    ]
  }
  if (topic) {
    where.tags = { some: { topic: { name: topic } } }
  }

  const [items, total] = await Promise.all([
    prisma.loreItem.findMany({
      where,
      orderBy: { ingestedAt: 'desc' },
      take: limit,
      skip: offset,
      include: {
        source: { select: { name: true, type: true } },
        tags: { include: { topic: true } },
      },
    }),
    prisma.loreItem.count({ where }),
  ])

  return NextResponse.json({ items, total, limit, offset })
}
