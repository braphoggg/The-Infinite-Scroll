'use client'

import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'

interface SourceCardProps {
  id: string
  name: string
  url: string
  type: string
  enabled: boolean
  lastPolledAt: string | null
  itemCount: number
  onToggle: (id: string, enabled: boolean) => void
  onDelete: (id: string) => void
}

export function SourceCard({ id, name, url, type, enabled, lastPolledAt, itemCount, onToggle, onDelete }: SourceCardProps) {
  return (
    <Card className="p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-text-primary truncate">{name}</span>
            <Badge color={enabled ? '#4ade80' : '#f87171'}>{enabled ? 'active' : 'paused'}</Badge>
            <Badge>{type}</Badge>
          </div>
          <p className="text-xs text-text-muted mt-1 truncate">{url}</p>
          <div className="flex items-center gap-3 mt-2 text-xs text-text-muted">
            <span>{itemCount} items</span>
            {lastPolledAt && <span>Last polled: {new Date(lastPolledAt).toLocaleTimeString()}</span>}
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <Button variant="ghost" size="sm" onClick={() => onToggle(id, !enabled)}>
            {enabled ? 'Pause' : 'Resume'}
          </Button>
          <Button variant="danger" size="sm" onClick={() => onDelete(id)}>
            Delete
          </Button>
        </div>
      </div>
    </Card>
  )
}
