'use client'

import { useEffect, useState, useCallback } from 'react'
import { Header } from '@/components/layout/Header'
import { TopicForm } from '@/components/topics/TopicForm'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'

interface Topic {
  id: string
  name: string
  description: string | null
  color: string
  _count: { tags: number }
}

export default function TopicsPage() {
  const [topics, setTopics] = useState<Topic[]>([])

  const fetchTopics = useCallback(async () => {
    const res = await fetch('/api/topics')
    setTopics(await res.json())
  }, [])

  useEffect(() => { fetchTopics() }, [fetchTopics])

  const handleAdd = async (data: { name: string; description: string; color: string }) => {
    await fetch('/api/topics', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    fetchTopics()
  }

  const handleDelete = async (id: string) => {
    await fetch(`/api/topics?id=${id}`, { method: 'DELETE' })
    fetchTopics()
  }

  return (
    <div className="flex flex-col h-full">
      <Header title="Seekers" description="Topics and classification tags" />
      <div className="flex-1 overflow-auto p-6 space-y-6">
        <Card className="p-4">
          <TopicForm onSubmit={handleAdd} />
        </Card>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {topics.map(t => (
            <Card key={t.id} className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full" style={{ backgroundColor: t.color }} />
                  <span className="text-sm font-medium text-text-primary">{t.name}</span>
                </div>
                <Button variant="ghost" size="sm" onClick={() => handleDelete(t.id)}>x</Button>
              </div>
              {t.description && <p className="text-xs text-text-muted mt-1 ml-5">{t.description}</p>}
              <p className="text-xs text-text-muted mt-2 ml-5">{t._count.tags} items tagged</p>
            </Card>
          ))}
        </div>
        {topics.length === 0 && (
          <div className="text-center py-12">
            <p className="text-4xl mb-3">🏷</p>
            <p className="text-text-secondary text-sm">No topics yet</p>
            <p className="text-text-muted text-xs mt-1">Topics are auto-created by the classifier, or add your own above</p>
          </div>
        )}
      </div>
    </div>
  )
}
