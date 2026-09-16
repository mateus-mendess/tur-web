export function ImagePlaceholder({ className = '' }: { className?: string }) {
  return (
    <div className={`w-full h-full bg-[#D9DFE3] relative overflow-hidden flex items-center justify-center ${className}`}>
      {/* Background shape inspired by LinkedIn default cover */}
      <div className="absolute top-0 left-0 w-[150%] h-[150%] bg-[#C8CFD5] rounded-full -translate-x-[45%] -translate-y-[45%]" />
    </div>
  )
}
