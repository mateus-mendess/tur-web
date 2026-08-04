import type { ButtonHTMLAttributes, ReactNode } from 'react'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost'
  children: ReactNode
}

const variants = {
  primary:
    'bg-tur-dark text-white border-none hover:bg-tur-dark-hover active:bg-tur-dark-active disabled:opacity-60 disabled:cursor-not-allowed',
  secondary:
    'bg-transparent text-tur-dark border border-black/30 hover:bg-black/5 disabled:opacity-60 disabled:cursor-not-allowed',
  ghost:
    'bg-transparent text-tur-dark border-none hover:text-tur-accent p-0 font-inherit',
}

export function Button({
  variant = 'primary',
  className = '',
  children,
  ...props
}: ButtonProps) {
  // Base font and layout classes
  const baseClasses =
    'font-dm-sans font-semibold rounded-none cursor-pointer tracking-[0.2px] flex items-center justify-center gap-2 transition-colors duration-200'

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
