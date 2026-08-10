import { Header } from '#/components/Header/Header'

interface HeroProps {
  videoSrc?: string
}

export function Hero({
  videoSrc = '/assets/videos/hero-video.mp4',
}: HeroProps) {
  const handleScrollDown = () => {
    const introSection = document.getElementById('intro-section')
    if (introSection) {
      introSection.scrollIntoView({ behavior: 'smooth' })
    } else {
      window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })
    }
  }

  return (
    <>
      <section className="relative w-full min-h-screen overflow-hidden flex flex-col justify-between p-[28px_40px] max-md:p-5 bg-tur-dark box-border">
        {/* Background Video */}
        <video
          className="absolute inset-0 w-full h-full object-cover z-0"
          autoPlay
          loop
          muted
          playsInline
        >
          <source src={videoSrc} type="video/mp4" />
        </video>

        {/* Dark Overlay for Text Readability */}
        <div className="absolute inset-0 bg-black/40 pointer-events-none z-0" />

        <div className="relative z-20 w-full">
          <Header theme="dark" />
        </div>

        {/* Hero Title Split (Left / Right) */}
        <div className="flex max-md:flex-col justify-between max-md:justify-center items-center flex-1 z-10 w-full max-md:gap-3">
          <h1 className="font-dm-sans text-[5.5vw] max-md:text-[42px] font-bold text-white m-0 leading-[1.05] tracking-[-2px] text-left max-md:text-center">
            Explore
          </h1>
          <h1 className="font-dm-sans text-[5.5vw] max-md:text-[42px] font-bold text-white m-0 leading-[1.05] tracking-[-2px] text-right max-md:text-center">
            o mundo.
          </h1>
        </div>

        {/* Footer Section */}
        <footer className="flex flex-col gap-4 z-10 w-full">
          <div className="h-[1px] w-full bg-white/30" />
          <button
            type="button"
            onClick={handleScrollDown}
            className="flex justify-between items-center w-full bg-transparent border-none cursor-pointer group text-left p-0 font-inherit"
            aria-label="Rolar para explorar"
          >
            <div className="flex items-center justify-center w-8 h-8 border border-white/40 rounded-none text-base text-white animate-bounce group-hover:border-white group-hover:bg-white/10 transition-all">
              ↓
            </div>
            <span className="text-white font-inter text-sm font-medium opacity-80 group-hover:opacity-100 transition-opacity">
              Scroll to explore
            </span>
          </button>
        </footer>
      </section>
    </>
  )
}
