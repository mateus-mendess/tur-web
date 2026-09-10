import React from 'react'

interface PageContainerProps {
  children: React.ReactNode
  className?: string
}

export function PageContainer({ children, className = '' }: PageContainerProps) {
  return (
    <div className={`w-full max-w-[1440px] mx-auto px-6 md:px-10 ${className}`}>
      {children}
    </div>
  )
}
