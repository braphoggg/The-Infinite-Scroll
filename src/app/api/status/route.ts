import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { engine } from '@/lib/engine'

export async function GET() {
  const now = new Date()
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate())

  const [totalSources, activeSources, totalItems, itemsToday, pendingItems, failedItems, totalTopics] =
    await Promise.all([
      prisma.source.count(),
      prisma.source.count({ where: { enabled: true } }),
      prisma.loreItem.count(),
      prisma.loreItem.count({ where: { ingestedAt: { gte: todayStart } } }),
      prisma.loreItem.count({ where: { status: 'pending' } }),
      prisma.loreItem.count({ where: { status: 'failed' } }),
      prisma.topic.count(),
    ])

  return NextResponse.json({
    engineRunning: engine.running,
    totalSources,
    activeSources,
    totalItems,
    itemsToday,
    pendingItems,
    failedItems,
    totalTopics,
  })
}
