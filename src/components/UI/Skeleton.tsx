interface SkeletonProps {
  className?: string
}

/** Bloco animado genérico. Use para construir skeletons customizados. */
export function Skeleton({ className = '' }: SkeletonProps) {
  return (
    <div
      className={`animate-pulse bg-tur-dark/10 rounded-none ${className}`}
    />
  )
}

/** Skeleton para SpotCard (aspect-square) — usado na grade de /explorar */
export function SpotCardSkeleton() {
  return (
    <div className="w-full flex flex-col gap-2">
      <Skeleton className="aspect-square w-full" />
    </div>
  )
}

/** Skeleton para cards horizontais — usado em FeaturedSpotsSection */
export function FeaturedSpotSkeleton() {
  return (
    <div className="shrink-0 w-[280px] sm:w-[320px] md:w-[360px]">
      <Skeleton className="aspect-[3/4] w-full" />
    </div>
  )
}
