import type { LabelHTMLAttributes, ReactNode } from 'react'

export interface LabelProps extends LabelHTMLAttributes<HTMLLabelElement> {
  children: ReactNode
  required?: boolean
}

export function Label({
  children,
  required,
  className = '',
  ...props
}: LabelProps) {
  return (
    <label
      className={`font-inter text-[11px] font-bold text-tur-gray-600 tracking-[0.8px] uppercase ${className}`}
      {...props}
    >
      {children}
      {required && <span className="text-tur-accent ml-0.5">*</span>}
    </label>
  )
}
