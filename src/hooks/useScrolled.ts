import { useState, useEffect } from 'react'

export function useScrolled(threshold = 20, disabled = false) {
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    if (disabled) {
      setIsScrolled(true)
      return
    }

    const handleScroll = () => {
      setIsScrolled(window.scrollY > threshold)
    }

    setIsScrolled(window.scrollY > threshold)

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [threshold, disabled])

  return isScrolled
}
