import { prisma } from '../db'
import { bus } from '../bus'
import { MockClassifier } from './mock-classifier'
import type { IClassifier } from './classifier'

export class SeekerManager {
  private classifier: IClassifier
  private running = false

  constructor(classifier?: IClassifier) {
    this.classifier = classifier || new MockClassifier()
  }

  async start() {
    if (this.running) return
    this.running = true
    console.log('[Seekers] Starting...')

    // Process any pending items from previous runs
    await this.processBacklog()

    // Listen for new items
    bus.on('lore:ingested', async ({ itemId }) => {
      await this.processItem(itemId)
    })
  }

  stop() {
    this.running = false
    console.log('[Seekers] Stopped')
  }

  private async processBacklog() {
    const pending = await prisma.loreItem.findMany({
      where: { status: { in: ['pending', 'processing'] } },
      select: { id: true },
      take: 100,
    })
    for (const item of pending) {
      await this.processItem(item.id)
    }
    if (pending.length > 0) {
      console.log(`[Seekers] Processed ${pending.length} backlog items`)
    }
  }

  private async processItem(itemId: string) {
    try {
      await prisma.loreItem.update({
        where: { id: itemId },
        data: { status: 'processing' },
      })

      const item = await prisma.loreItem.findUnique({ where: { id: itemId } })
      if (!item) return

      const result = await this.classifier.classify(item.title, item.rawContent)

      // Ensure topics exist and create tags
      const topicIds: string[] = []
      for (const t of result.topics) {
        const topic = await prisma.topic.upsert({
          where: { name: t.name },
          create: { name: t.name },
          update: {},
        })
        topicIds.push(topic.id)

        await prisma.loreTag.upsert({
          where: { itemId_topicId: { itemId, topicId: topic.id } },
          create: { itemId, topicId: topic.id, confidence: t.confidence },
          update: { confidence: t.confidence },
        })
      }

      await prisma.loreItem.update({
        where: { id: itemId },
        data: {
          summary: result.summary,
          biasLabel: result.biasLabel,
          biasReasoning: result.biasReasoning,
          importance: result.importance,
          status: 'classified',
          processedAt: new Date(),
        },
      })

      bus.emit('lore:classified', { itemId, topicIds })
    } catch (err) {
      console.error(`[Seekers] Error processing item ${itemId}:`, err)
      await prisma.loreItem.update({
        where: { id: itemId },
        data: { status: 'failed' },
      }).catch(() => {})
      bus.emit('lore:failed', { itemId, error: String(err) })
    }
  }
}
