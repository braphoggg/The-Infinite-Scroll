interface HeaderProps {
  title: string
  description?: string
  action?: React.ReactNode
}

export function Header({ title, description, action }: HeaderProps) {
  return (
    <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-bg-secondary">
      <div>
        <h2 className="text-xl font-semibold text-text-primary">{title}</h2>
        {description && <p className="text-sm text-text-muted mt-0.5">{description}</p>}
      </div>
      {action && <div>{action}</div>}
    </div>
  )
}
