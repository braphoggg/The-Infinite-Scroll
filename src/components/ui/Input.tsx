import { InputHTMLAttributes } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
}

export function Input({ label, className = '', ...props }: InputProps) {
  return (
    <div>
      {label && <label className="block text-xs text-text-muted mb-1.5">{label}</label>}
      <input
        className={`w-full px-3 py-2 bg-bg-primary border border-border rounded-md text-sm text-text-primary placeholder-text-muted focus:outline-none focus:border-accent transition-colors ${className}`}
        {...props}
      />
    </div>
  )
}
