'use client'

import { useEffect, useState, useCallback } from 'react'
import { LoreCard } from './LoreCard'

interface LoreItem {
  id: string
  title: string
  summary: string | null
  url: string
  biasLabel: string | null
  importance: number
  ingestedAt: string
  source: { name: string; type: string }
  tags: Array<{ confidence: number; topic: { name: string; color: string } }>
}

interface LoreFeedProps {
  topic?: string
  search?: string
}

export function LoreFeed({ topic, search }: LoreFeedProps) {
  const [items, setItems] = useState<LoreItem[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)

  const fetchLore = useCallback(async () => {
    const params = new URLSearchParams()
    if (topic) params.set('topic', topic)
    if (search) params.set('search', search)
    params.set('limit', '50')

    const res = await fetch(`/api/lore?${params}`)
    const data = await res.json()
    setItems(data.items)
    setTotal(data.total)
    setLoading(false)
  }, [topic, search])

  useEffect(() => {
    fetchLore()
    const interval = setInterval(fetchLore, 5000)
    return () => clearInterval(interval)
  }, [fetchLore])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-text-muted text-sm">Loading lore...</div>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <p className="text-4xl mb-3">📜</p>
        <p className="text-text-secondary text-sm">No lore found</p>
        <p className="text-text-muted text-xs mt-1">Add some sources to start collecting lore</p>
      </div>
    )
  }

  return (
    <div>
      <p className="text-xs text-text-muted mb-3">{total} items</p>
      <div className="space-y-2">
        {items.map(item => (
          <LoreCard
            key={item.id}
            title={item.title}
            summary={item.summary}
            url={item.url}
            sourceName={item.source.name}
            sourceType={item.source.type}
            biasLabel={item.biasLabel}
            importance={item.importance}
            ingestedAt={item.ingestedAt}
            tags={item.tags}
          />
        ))}
      </div>
    </div>
  )
}
