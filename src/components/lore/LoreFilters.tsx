'use client'

import { useEffect, useState } from 'react'
import { Badge } from '@/components/ui/Badge'

interface Topic {
  id: string
  name: string
  color: string
  _count: { tags: number }
}

interface LoreFiltersProps {
  selectedTopic: string | null
  onTopicChange: (topic: string | null) => void
  search: string
  onSearchChange: (search: string) => void
}

export function LoreFilters({ selectedTopic, onTopicChange, search, onSearchChange }: LoreFiltersProps) {
  const [topics, setTopics] = useState<Topic[]>([])

  useEffect(() => {
    fetch('/api/topics').then(r => r.json()).then(setTopics)
  }, [])

  return (
    <div className="space-y-4">
      <input
        type="text"
        placeholder="Search lore..."
        value={search}
        onChange={e => onSearchChange(e.target.value)}
        className="w-full px-3 py-2 bg-bg-primary border border-border rounded-md text-sm text-text-primary placeholder-text-muted focus:outline-none focus:border-accent"
      />
      <div>
        <p className="text-xs text-text-muted mb-2 uppercase tracking-wider">Topics</p>
        <div className="flex flex-wrap gap-1.5">
          <button
            onClick={() => onTopicChange(null)}
            className={`text-xs px-2 py-1 rounded transition-colors ${
              !selectedTopic ? 'bg-accent text-bg-primary' : 'bg-bg-tertiary text-text-secondary hover:text-text-primary'
            }`}
          >
            All
          </button>
          {topics.map(t => (
            <button
              key={t.id}
              onClick={() => onTopicChange(t.name === selectedTopic ? null : t.name)}
            >
              <Badge color={selectedTopic === t.name ? t.color : undefined}>
                {t.name} ({t._count.tags})
              </Badge>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
