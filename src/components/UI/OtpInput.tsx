import React, { useState, useRef, useEffect } from 'react'

interface OtpInputProps {
  length?: number
  value: string
  onChange: (value: string) => void
  error?: boolean
  disabled?: boolean
}

export function OtpInput({ length = 6, value, onChange, error, disabled }: OtpInputProps) {
  const [otp, setOtp] = useState<string[]>(Array(length).fill(''))
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  useEffect(() => {
    const newOtp = value.split('').slice(0, length)
    while (newOtp.length < length) newOtp.push('')
    setOtp(newOtp)
  }, [value, length])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const val = e.target.value.replace(/\D/g, '') // only numbers
    if (!val) return

    const newOtp = [...otp]
    newOtp[index] = val.substring(val.length - 1) // take the last character typed
    setOtp(newOtp)
    onChange(newOtp.join(''))

    // Focus next input
    if (index < length - 1 && val) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace') {
      if (!otp[index] && index > 0) {
        // Move focus to previous if current is empty
        inputRefs.current[index - 1]?.focus()
      } else {
        // Clear current
        const newOtp = [...otp]
        newOtp[index] = ''
        setOtp(newOtp)
        onChange(newOtp.join(''))
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus()
    } else if (e.key === 'ArrowRight' && index < length - 1) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  // Paste handler to allow pasting a full 6 digit code
  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData('text/plain').replace(/\D/g, '').slice(0, length)
    if (!pastedData) return

    const newOtp = [...otp]
    for (let i = 0; i < pastedData.length; i++) {
      newOtp[i] = pastedData[i]
    }
    setOtp(newOtp)
    onChange(newOtp.join(''))

    // Focus on the next empty input or the last one
    const focusIndex = Math.min(pastedData.length, length - 1)
    inputRefs.current[focusIndex]?.focus()
  }

  return (
    <div className="flex gap-2 justify-center w-full">
      {otp.map((digit, index) => (
        <input
          key={index}
          ref={(el) => { inputRefs.current[index] = el }}
          type="text"
          inputMode="numeric"
          autoComplete="one-time-code"
          pattern="\d{1}"
          maxLength={1}
          value={digit}
          onChange={(e) => handleChange(e, index)}
          onKeyDown={(e) => handleKeyDown(e, index)}
          onPaste={handlePaste}
          disabled={disabled}
          className={`w-12 h-12 text-center font-sans text-xl text-primary bg-transparent border-b-2 rounded-none outline-none transition-colors duration-200 focus:border-primary focus:bg-black/5 placeholder-black/40 ${
            error ? 'border-error text-error' : 'border-black/20'
          } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        />
      ))}
    </div>
  )
}
