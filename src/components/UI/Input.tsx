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
        className={`w-full h-10 px-0.5 font-inter text-sm text-tur-dark bg-transparent border-b rounded-none outline-none transition-colors duration-200 focus:border-tur-dark placeholder-tur-gray-400 ${
          error ? 'border-tur-red' : 'border-tur-gray-300'
        } ${className}`}
        {...props}
      />
    )
  },
)

Input.displayName = 'Input'
