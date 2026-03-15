interface TopicBadgeProps {
  name: string
  color: string
  count?: number
  selected?: boolean
  onClick?: () => void
}

export function TopicBadge({ name, color, count, selected, onClick }: TopicBadgeProps) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition-all border ${
        selected ? 'border-current' : 'border-transparent'
      }`}
      style={{ backgroundColor: `${color}15`, color }}
    >
      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
      {name}
      {count !== undefined && <span className="text-xs opacity-70">({count})</span>}
    </button>
  )
}
