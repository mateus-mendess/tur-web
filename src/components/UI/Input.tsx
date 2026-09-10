import type { InputHTMLAttributes } from 'react'
import { forwardRef } from 'react'

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: boolean
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className = '', error, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={`w-full h-10 px-0.5 font-sans text-sm text-primary bg-transparent border-b rounded-none outline-none transition-colors duration-200 focus:border-primary placeholder-black/40 ${
          error ? 'border-error' : 'border-black/20'
        } ${className}`}
        {...props}
      />
    )
  },
)

Input.displayName = 'Input'
