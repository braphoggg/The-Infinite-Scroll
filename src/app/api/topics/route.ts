import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET() {
  const topics = await prisma.topic.findMany({
    orderBy: { name: 'asc' },
    include: { _count: { select: { tags: true } } },
  })
  return NextResponse.json(topics)
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { name, description, color } = body

  if (!name) {
    return NextResponse.json({ error: 'Name is required' }, { status: 400 })
  }

  const topic = await prisma.topic.create({
    data: { name: name.toLowerCase(), description, color },
  })
  return NextResponse.json(topic, { status: 201 })
}

export async function PUT(req: NextRequest) {
  const body = await req.json()
  const { id, name, description, color } = body

  if (!id) {
    return NextResponse.json({ error: 'ID is required' }, { status: 400 })
  }

  const topic = await prisma.topic.update({
    where: { id },
    data: { ...(name && { name: name.toLowerCase() }), description, color },
  })
  return NextResponse.json(topic)
}

export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const id = searchParams.get('id')
  if (!id) {
    return NextResponse.json({ error: 'ID is required' }, { status: 400 })
  }

  await prisma.topic.delete({ where: { id } })
  return NextResponse.json({ ok: true })
}
