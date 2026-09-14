import { useState, useEffect } from 'react'
import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { SpinnerIcon, CheckIcon, CloseIcon } from './Icons'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost'
  children: ReactNode
  isLoading?: boolean
  isSuccess?: boolean
  isError?: boolean
}

const variants = {
  primary:
    'bg-primary text-surface border border-primary hover:bg-primary/90 active:bg-primary disabled:opacity-60 disabled:cursor-not-allowed',
  secondary:
    'bg-transparent text-primary border border-primary hover:bg-primary hover:text-surface transition-colors duration-200 disabled:opacity-60 disabled:cursor-not-allowed',
  ghost:
    'bg-transparent text-primary border-none hover:text-secondary p-0 font-inherit disabled:opacity-60 disabled:cursor-not-allowed',
}

export function Button({
  variant = 'primary',
  className = '',
  children,
  isLoading,
  isSuccess,
  isError,
  disabled,
  ...props
}: ButtonProps) {
  const [internalState, setInternalState] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  useEffect(() => {
    if (isLoading) {
      setInternalState('loading')
    } else if (isSuccess) {
      setInternalState('success')
      const timer = setTimeout(() => setInternalState('idle'), 1000)
      return () => clearTimeout(timer)
    } else if (isError) {
      setInternalState('error')
      const timer = setTimeout(() => setInternalState('idle'), 1000)
      return () => clearTimeout(timer)
    } else {
      setInternalState('idle')
    }
  }, [isLoading, isSuccess, isError])

  // Base font and layout classes
  const baseClasses =
    'font-sans font-normal rounded-md cursor-pointer tracking-wide flex items-center justify-center gap-2 transition-colors duration-200 relative'

  // Ghost variant has specific sizing (inherited from text flow)
  // Others use explicit dimensions
  const sizeClasses = variant === 'ghost' ? '' : 'h-11 px-8 text-[14px]'
  
  const isActuallyDisabled = disabled || internalState !== 'idle'

  return (
    <button
      className={`${baseClasses} ${sizeClasses} ${variants[variant]} ${className}`}
      disabled={isActuallyDisabled}
      {...props}
    >
      <div className={`flex items-center justify-center gap-2 transition-opacity duration-200 ${internalState !== 'idle' ? 'opacity-0' : 'opacity-100'}`}>
        {children}
      </div>
      
      {/* Loading State Spinner */}
      <div
        className={`absolute inset-0 flex items-center justify-center transition-all duration-300 pointer-events-none ${
          internalState === 'loading' ? 'opacity-100 scale-100' : 'opacity-0 scale-75'
        }`}
      >
        {internalState !== 'idle' && <SpinnerIcon className="animate-spin w-5 h-5" />}
      </div>
      
      {/* Success / Error Final Icon */}
      <div
        className={`absolute inset-0 flex items-center justify-center transition-all duration-300 pointer-events-none ${
          internalState === 'success' || internalState === 'error'
            ? 'opacity-100 scale-100'
            : 'opacity-0 scale-75'
        }`}
      >
        {internalState === 'success' && <CheckIcon className="text-current w-6 h-6" strokeWidth={3} />}
        {internalState === 'error' && <CloseIcon className="text-current w-6 h-6" strokeWidth={3} />}
      </div>
    </button>
  )
}
