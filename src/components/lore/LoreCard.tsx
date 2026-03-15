import { Badge } from '@/components/ui/Badge'
import { Card } from '@/components/ui/Card'

interface LoreTag {
  confidence: number
  topic: { name: string; color: string }
}

interface LoreCardProps {
  title: string
  summary: string | null
  url: string
  sourceName: string
  sourceType: string
  biasLabel: string | null
  importance: number
  ingestedAt: string
  tags: LoreTag[]
}

const biasColors: Record<string, string> = {
  left: '#60a5fa',
  'center-left': '#93c5fd',
  center: '#a1a1aa',
  'center-right': '#fca5a5',
  right: '#f87171',
  independent: '#4ade80',
  conspiratorial: '#c084fc',
  academic: '#67e8f9',
}

export function LoreCard({ title, summary, url, sourceName, biasLabel, importance, ingestedAt, tags }: LoreCardProps) {
  const timeAgo = getTimeAgo(new Date(ingestedAt))
  const importanceColor = importance >= 7 ? '#f87171' : importance >= 4 ? '#fbbf24' : '#a1a1aa'

  return (
    <Card className="p-4 hover:border-accent/30 transition-colors">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <a href={url} target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-text-primary hover:text-accent transition-colors line-clamp-2">
            {title}
          </a>
          {summary && (
            <p className="text-xs text-text-secondary mt-1.5 line-clamp-3">{summary}</p>
          )}
          <div className="flex items-center gap-2 mt-2 flex-wrap">
            {tags.map(t => (
              <Badge key={t.topic.name} color={t.topic.color}>{t.topic.name}</Badge>
            ))}
            {biasLabel && (
              <Badge color={biasColors[biasLabel] || '#a1a1aa'}>{biasLabel}</Badge>
            )}
          </div>
        </div>
        <div className="flex flex-col items-end gap-1 shrink-0">
          <span className="text-xs font-mono font-bold" style={{ color: importanceColor }}>
            {importance}/10
          </span>
          <span className="text-[10px] text-text-muted">{timeAgo}</span>
          <span className="text-[10px] text-text-muted">{sourceName}</span>
        </div>
      </div>
    </Card>
  )
}

function getTimeAgo(date: Date): string {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000)
  if (seconds < 60) return 'just now'
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  return `${days}d ago`
}
