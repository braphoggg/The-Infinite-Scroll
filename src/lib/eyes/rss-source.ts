import Parser from 'rss-parser'
import { BaseSource } from './base-source'
import type { RawLoreItem } from '../types'

const parser = new Parser({
  timeout: 10_000,
  headers: { 'User-Agent': 'TheInfiniteScroll/0.1' },
})

export class RssSource extends BaseSource {
  constructor(sourceId: string, url: string, config: Record<string, unknown> = {}) {
    super(sourceId, 'rss', url, config)
  }

  async poll(): Promise<RawLoreItem[]> {
    const feed = await parser.parseURL(this.url)
    return (feed.items || []).map(item => ({
      externalId: item.guid || item.link || undefined,
      url: item.link || '',
      title: item.title || 'Untitled',
      rawContent: item.contentSnippet || item.content || item.summary || '',
      publishedAt: item.pubDate ? new Date(item.pubDate) : undefined,
    }))
  }
}
