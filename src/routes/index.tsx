import { createFileRoute } from '@tanstack/react-router'
import { HeroCarousel } from '#/components/HeroCarousel/HeroCarousel'
import { NavBar } from '#/components/NavBar/NavBar'
import { AboutSection } from '#/components/About/AboutSection'
import { FeaturedSpotsSection } from '#/components/Spots/FeaturedSpotsSection'
import { CommunitySection } from '#/components/Community/CommunitySection'
import { Footer } from '#/components/Footer/Footer'

export const Route = createFileRoute('/')({ component: Home })

function Home() {
  return (
    <main className="min-h-screen bg-background">
      <NavBar />
      <HeroCarousel />
      <AboutSection />
      <FeaturedSpotsSection />
      <CommunitySection />
      <Footer />
    </main>
  )
}
