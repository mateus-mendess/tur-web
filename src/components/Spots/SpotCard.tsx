import type { Spot } from '#/types/spot'

interface SpotCardProps {
  spot: Spot
  onClick?: () => void
}

export function SpotCard({ spot, onClick }: SpotCardProps) {
  return (
    <article
      className="group w-full flex flex-col cursor-pointer transition-all duration-300 ease-out hover:scale-[1.02] hover:z-10"
      onClick={onClick}
    >
      {/* Card Container with Image and Overlay Content */}
      <div className="relative aspect-square w-full rounded-none overflow-hidden shadow-sm group-hover:shadow-xl transition-shadow bg-tur-dark/5">
        <img
          src={spot.imageUrl}
          alt={spot.name}
          className="w-full h-full object-cover"
          loading="lazy"
        />

        {/* Gradient Overlay with Name at Top-Left & Location at Bottom-Left */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/10 to-black/65 p-4 sm:p-5 flex flex-col justify-between text-white pointer-events-none">
          {/* Top-Left: Destination Name (Uppercase) */}
          <div>
            <h3 className="font-dm-sans text-sm sm:text-base md:text-lg font-bold uppercase tracking-wider text-white leading-snug drop-shadow-sm m-0">
              {spot.name}
            </h3>
          </div>

          {/* Bottom-Left: Location */}
          <div className="font-inter text-xs sm:text-sm font-medium text-white/90 drop-shadow-sm">
            <span>{spot.location}</span>
          </div>
        </div>
      </div>
    </article>
  )
}
