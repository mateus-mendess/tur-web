interface SpotImageGalleryProps {
  images: string[]
  name: string
}

export function SpotImageGallery({ images, name }: SpotImageGalleryProps) {
  return (
    <section className="w-full">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3 md:gap-4 w-full">
        <div className="md:col-span-7 h-[350px] md:h-[480px] lg:h-[560px] bg-tur-dark/5 rounded-none overflow-hidden">
          <img
            src={images[0]}
            alt={`${name} 1`}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="md:col-span-5 flex flex-col justify-between gap-3 md:gap-4 h-auto md:h-[480px] lg:h-[560px]">
          <div className="h-[220px] md:h-[48%] bg-tur-dark/5 rounded-none overflow-hidden">
            <img
              src={images[1] || images[0]}
              alt={`${name} 2`}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="grid grid-cols-2 gap-3 md:gap-4 h-[200px] md:h-[48%]">
            <div className="h-full bg-tur-dark/5 rounded-none overflow-hidden">
              <img
                src={images[2] || images[0]}
                alt={`${name} 3`}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="h-full bg-tur-dark/5 rounded-none overflow-hidden">
              <img
                src={images[3] || images[1] || images[0]}
                alt={`${name} 4`}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
