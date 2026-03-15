'use client'

import { useEffect, useState, useCallback } from 'react'
import { Header } from '@/components/layout/Header'
import { SourceCard } from '@/components/sources/SourceCard'
import { SourceForm } from '@/components/sources/SourceForm'

interface Source {
  id: string
  name: string
  url: string
  type: string
  enabled: boolean
  lastPolledAt: string | null
  _count: { items: number }
}

export default function SourcesPage() {
  const [sources, setSources] = useState<Source[]>([])

  const fetchSources = useCallback(async () => {
    const res = await fetch('/api/sources')
    setSources(await res.json())
  }, [])

  useEffect(() => {
    fetchSources()
    const interval = setInterval(fetchSources, 5000)
    return () => clearInterval(interval)
  }, [fetchSources])

  const handleAdd = async (data: { name: string; url: string; type: string }) => {
    await fetch('/api/sources', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    fetchSources()
  }

  const handleToggle = async (id: string, enabled: boolean) => {
    await fetch('/api/sources', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, enabled }),
    })
    fetchSources()
  }

  const handleDelete = async (id: string) => {
    await fetch(`/api/sources?id=${id}`, { method: 'DELETE' })
    fetchSources()
  }

  return (
    <div className="flex flex-col h-full">
      <Header title="Eyes" description="Content sources that feed the scroll" />
      <div className="flex-1 overflow-auto p-6 space-y-6">
        <SourceForm onSubmit={handleAdd} />
        <div className="space-y-2">
          {sources.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-4xl mb-3">👁</p>
              <p className="text-text-secondary text-sm">No sources configured</p>
              <p className="text-text-muted text-xs mt-1">Add an RSS feed URL above to start collecting lore</p>
            </div>
          ) : (
            sources.map(s => (
              <SourceCard
                key={s.id}
                id={s.id}
                name={s.name}
                url={s.url}
                type={s.type}
                enabled={s.enabled}
                lastPolledAt={s.lastPolledAt}
                itemCount={s._count.items}
                onToggle={handleToggle}
                onDelete={handleDelete}
              />
            ))
          )}
        </div>
      </div>
    </div>
  )
}
