'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'

interface SourceFormProps {
  onSubmit: (data: { name: string; url: string; type: string }) => void
}

export function SourceForm({ onSubmit }: SourceFormProps) {
  const [url, setUrl] = useState('')
  const [name, setName] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!url) return
    setSubmitting(true)
    onSubmit({ name: name || new URL(url).hostname, url, type: 'rss' })
    setUrl('')
    setName('')
    setSubmitting(false)
  }

  return (
    <form onSubmit={handleSubmit} className="flex items-end gap-3">
      <div className="flex-1">
        <Input label="RSS Feed URL" placeholder="https://example.com/feed.xml" value={url} onChange={e => setUrl(e.target.value)} required />
      </div>
      <div className="w-48">
        <Input label="Name (optional)" placeholder="Auto-detected" value={name} onChange={e => setName(e.target.value)} />
      </div>
      <Button type="submit" disabled={submitting || !url}>Add Source</Button>
    </form>
  )
}
