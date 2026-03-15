'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'

const PRESET_COLORS = ['#f0b132', '#f87171', '#60a5fa', '#4ade80', '#c084fc', '#fb923c', '#67e8f9', '#f472b6']

interface TopicFormProps {
  onSubmit: (data: { name: string; description: string; color: string }) => void
}

export function TopicForm({ onSubmit }: TopicFormProps) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [color, setColor] = useState(PRESET_COLORS[0])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name) return
    onSubmit({ name, description, color })
    setName('')
    setDescription('')
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="flex gap-3">
        <div className="flex-1">
          <Input label="Topic Name" placeholder="e.g. crypto, geopolitics" value={name} onChange={e => setName(e.target.value)} required />
        </div>
        <div className="flex-1">
          <Input label="Description" placeholder="What this topic covers" value={description} onChange={e => setDescription(e.target.value)} />
        </div>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-xs text-text-muted">Color:</span>
        {PRESET_COLORS.map(c => (
          <button
            key={c}
            type="button"
            onClick={() => setColor(c)}
            className={`w-6 h-6 rounded-full transition-transform ${c === color ? 'scale-125 ring-2 ring-white/30' : ''}`}
            style={{ backgroundColor: c }}
          />
        ))}
        <div className="flex-1" />
        <Button type="submit" size="sm" disabled={!name}>Add Topic</Button>
      </div>
    </form>
  )
}
