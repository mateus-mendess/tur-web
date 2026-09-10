import type { ButtonHTMLAttributes, ReactNode } from 'react'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost'
  children: ReactNode
}

const variants = {
  primary:
    'bg-primary text-surface border border-primary hover:bg-primary/90 active:bg-primary disabled:opacity-60 disabled:cursor-not-allowed',
  secondary:
    'bg-transparent text-primary border border-primary hover:bg-primary hover:text-surface transition-colors duration-200 disabled:opacity-60 disabled:cursor-not-allowed',
  ghost:
    'bg-transparent text-primary border-none hover:text-secondary p-0 font-inherit',
}

export function Button({
  variant = 'primary',
  className = '',
  children,
  ...props
}: ButtonProps) {
  // Base font and layout classes
  const baseClasses =
    'font-sans font-normal rounded-none cursor-pointer tracking-wide flex items-center justify-center gap-2 transition-colors duration-200'

  // Ghost variant has specific sizing (inherited from text flow)
  // Others use explicit dimensions
  const sizeClasses = variant === 'ghost' ? '' : 'h-11 px-8 text-[14px]'

  return (
    <button
      className={`${baseClasses} ${sizeClasses} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}
