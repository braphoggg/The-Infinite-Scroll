import { ButtonHTMLAttributes } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost'
  size?: 'sm' | 'md'
}

const variants = {
  primary: 'bg-accent text-bg-primary hover:bg-accent-hover font-medium',
  secondary: 'bg-bg-tertiary text-text-primary hover:bg-border',
  danger: 'bg-danger/20 text-danger hover:bg-danger/30',
  ghost: 'text-text-secondary hover:text-text-primary hover:bg-bg-tertiary',
}

const sizes = {
  sm: 'px-3 py-1.5 text-xs',
  md: 'px-4 py-2 text-sm',
}

export function Button({ variant = 'primary', size = 'md', className = '', ...props }: ButtonProps) {
  return (
    <button
      className={`rounded-md transition-colors disabled:opacity-50 disabled:pointer-events-none ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    />
  )
}
