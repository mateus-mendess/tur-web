import type { InputHTMLAttributes } from 'react'
import { forwardRef } from 'react'

export const Checkbox = forwardRef<
  HTMLInputElement,
  InputHTMLAttributes<HTMLInputElement>
>(({ className = '', ...props }, ref) => {
  return (
    <input
      type="checkbox"
      ref={ref}
      className={`appearance-none w-[18px] h-[18px] border-[1.5px] border-tur-gray-400 rounded-none outline-none cursor-pointer flex items-center justify-center mt-0.5 shrink-0 transition-all duration-200 bg-white checked:bg-tur-dark checked:border-tur-dark checked:after:content-[''] checked:after:w-[5px] checked:after:h-[9px] checked:after:border-solid checked:after:border-white checked:after:border-b-2 checked:after:border-r-2 checked:after:rotate-45 checked:after:mb-[2px] focus-visible:ring-[3px] focus-visible:ring-tur-dark/20 ${className}`}
      {...props}
    />
  )
})

Checkbox.displayName = 'Checkbox'
