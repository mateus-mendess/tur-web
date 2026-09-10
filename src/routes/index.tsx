import { createFileRoute } from '@tanstack/react-router'
import { HeroCarousel } from '#/components/HeroCarousel/HeroCarousel'
import { AboutSection } from '#/components/About/AboutSection'
import { FeaturedSpotsSection } from '#/components/Spots/FeaturedSpotsSection'
import { CommunitySection } from '#/components/Community/CommunitySection'

export const Route = createFileRoute('/')({ component: Home })

function Home() {
  return (
    <main className="min-h-screen bg-background">
      <HeroCarousel showArrows={false} />
      <AboutSection />
      <FeaturedSpotsSection />
      <CommunitySection />
    </main>
  )
}
