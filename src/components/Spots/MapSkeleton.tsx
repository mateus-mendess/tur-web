export function MapSkeleton() {
  return (
    <div className="w-full h-full min-h-[400px] bg-black/5 flex items-center justify-center border border-black/10 rounded-[6px] animate-pulse">
      <div className="w-8 h-8 rounded-full border-2 border-black/20 border-t-secondary animate-spin" />
    </div>
  )
}
