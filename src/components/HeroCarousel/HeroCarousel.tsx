import { useState, useEffect } from 'react'

const MOCK_LOCATIONS = [
  { id: 1, name: 'Zannier Île de Bendor', location: 'Bandol, France', image: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&q=80' },
  { id: 2, name: 'Cristo Redentor', location: 'Rio de Janeiro, Brasil', image: 'https://images.unsplash.com/photo-1483729558449-99ef09a8c325?auto=format&fit=crop&q=80' },
  { id: 3, name: 'Lençóis Maranhenses', location: 'Maranhão, Brasil', image: 'https://images.unsplash.com/photo-1544640166-735c029b3a0f?auto=format&fit=crop&q=80' }
]

export function HeroCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % MOCK_LOCATIONS.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="relative w-full min-h-screen overflow-hidden bg-background">
      {MOCK_LOCATIONS.map((loc, idx) => (
        <div
          key={loc.id}
          className={`absolute inset-0 transition-opacity duration-1000 ${idx === currentIndex ? 'opacity-100' : 'opacity-0'}`}
        >
          <img src={loc.image} alt={loc.name} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/30" />
        </div>
      ))}
      
      <div className="absolute bottom-16 left-10 text-surface z-20">
        <h1 className="text-5xl font-semibold mb-2">{MOCK_LOCATIONS[currentIndex].name}</h1>
        <p className="text-xl opacity-90">{MOCK_LOCATIONS[currentIndex].location}</p>
      </div>

      <div className="absolute bottom-16 right-10 flex gap-2 z-20">
        {MOCK_LOCATIONS.map((_, idx) => (
          <div key={idx} className="w-16 h-[2px] bg-white/30 relative overflow-hidden">
            <div 
              key={`progress-${idx}-${currentIndex}`} // Force re-render of animation when active
              className={`absolute top-0 left-0 h-full bg-white ${
                idx === currentIndex 
                  ? 'animate-[fillProgress_5s_linear_forwards]' 
                  : idx < currentIndex 
                    ? 'w-full' 
                    : 'w-0'
              }`}
            />
          </div>
        ))}
      </div>
    </div>
  )
}
