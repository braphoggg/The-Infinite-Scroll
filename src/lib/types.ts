export interface BusEvents {
  'lore:ingested': { itemId: string }
  'lore:classified': { itemId: string; topicIds: string[] }
  'lore:failed': { itemId: string; error: string }
  'source:added': { sourceId: string }
  'source:removed': { sourceId: string }
  'engine:started': undefined
  'engine:stopped': undefined
}

export interface RawLoreItem {
  externalId?: string
  url: string
  title: string
  rawContent: string
  publishedAt?: Date
}

export interface ClassificationResult {
  topics: Array<{ name: string; confidence: number }>
  summary: string
  biasLabel: string
  biasReasoning: string
  importance: number
}

export interface ISource {
  readonly type: string
  readonly sourceId: string
  poll(): Promise<RawLoreItem[]>
}
