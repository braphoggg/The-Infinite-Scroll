'use client'

import { useState } from 'react'
import { Header } from '@/components/layout/Header'
import { LoreFeed } from '@/components/lore/LoreFeed'
import { LoreFilters } from '@/components/lore/LoreFilters'

export default function FeedPage() {
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null)
  const [search, setSearch] = useState('')

  return (
    <div className="flex flex-col h-full">
      <Header title="Lore Feed" description="Real-time classified intelligence" />
      <div className="flex-1 overflow-auto p-6">
        <LoreFilters
          selectedTopic={selectedTopic}
          onTopicChange={setSelectedTopic}
          search={search}
          onSearchChange={setSearch}
        />
        <div className="mt-4">
          <LoreFeed topic={selectedTopic || undefined} search={search || undefined} />
        </div>
      </div>
    </div>
  )
}
