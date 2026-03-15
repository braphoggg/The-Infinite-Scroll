import { prisma } from '../db'
import { bus } from '../bus'
import { RssSource } from './rss-source'
import { isDuplicate } from './dedup'
import type { BaseSource } from './base-source'

export class EyeManager {
  private timers = new Map<string, NodeJS.Timeout>()
  private sources = new Map<string, BaseSource>()
  private running = false

  async start() {
    if (this.running) return
    this.running = true
    console.log('[Eyes] Starting...')

    const dbSources = await prisma.source.findMany({ where: { enabled: true } })
    for (const s of dbSources) {
      this.registerSource(s.id, s.type, s.url, s.pollIntervalMs, JSON.parse(s.config))
    }

    bus.on('source:added', async ({ sourceId }) => {
      const s = await prisma.source.findUnique({ where: { id: sourceId } })
      if (s && s.enabled) {
        this.registerSource(s.id, s.type, s.url, s.pollIntervalMs, JSON.parse(s.config))
      }
    })

    bus.on('source:removed', ({ sourceId }) => {
      this.unregisterSource(sourceId)
    })
  }

  stop() {
    this.running = false
    for (const [id, timer] of this.timers) {
      clearInterval(timer)
      this.timers.delete(id)
    }
    this.sources.clear()
    console.log('[Eyes] Stopped')
  }

  private registerSource(id: string, type: string, url: string, intervalMs: number, config: Record<string, unknown>) {
    if (this.sources.has(id)) return

    let source: BaseSource
    switch (type) {
      case 'rss':
        source = new RssSource(id, url, config)
        break
      default:
        console.warn(`[Eyes] Unknown source type: ${type}`)
        return
    }

    this.sources.set(id, source)
    this.pollSource(id, source)
    const timer = setInterval(() => this.pollSource(id, source), intervalMs)
    this.timers.set(id, timer)
    console.log(`[Eyes] Registered source: ${url} (every ${intervalMs / 1000}s)`)
  }

  private unregisterSource(id: string) {
    const timer = this.timers.get(id)
    if (timer) clearInterval(timer)
    this.timers.delete(id)
    this.sources.delete(id)
  }

  private async pollSource(sourceId: string, source: BaseSource) {
    try {
      const items = await source.poll()
      let newCount = 0

      for (const item of items) {
        const dupe = await isDuplicate(sourceId, item.externalId, item.url)
        if (dupe) continue

        const loreItem = await prisma.loreItem.create({
          data: {
            sourceId,
            externalId: item.externalId,
            url: item.url,
            title: item.title,
            rawContent: item.rawContent,
            publishedAt: item.publishedAt,
          },
        })

        bus.emit('lore:ingested', { itemId: loreItem.id })
        newCount++
      }

      await prisma.source.update({
        where: { id: sourceId },
        data: { lastPolledAt: new Date() },
      })

      if (newCount > 0) {
        console.log(`[Eyes] ${newCount} new items from source ${sourceId}`)
      }
    } catch (err) {
      console.error(`[Eyes] Error polling source ${sourceId}:`, err)
    }
  }
}
