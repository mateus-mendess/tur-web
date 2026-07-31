import { createFileRoute } from '@tanstack/react-router';
import { Hero } from '../components/Hero/Hero';
import { ScrollRevealSection } from '../components/Intro/ScrollRevealSection';
import { FeaturedSpotsSection } from '../components/Spots/FeaturedSpotsSection';
import { CommunitySection } from '../components/Community/CommunitySection';
import { Footer } from '../components/Footer/Footer';

export const Route = createFileRoute('/')({ component: Home });

function Home() {
  return (
    <main className="min-h-screen bg-tur-bg">
      <Hero />
      <ScrollRevealSection />
      <FeaturedSpotsSection />
      <CommunitySection />
      <Footer />
    </main>
  );
}
