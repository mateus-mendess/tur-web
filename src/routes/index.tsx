import { createFileRoute } from '@tanstack/react-router';
import { Hero } from '../components/Hero/Hero';
import { ScrollRevealSection } from '../components/Intro/ScrollRevealSection';
import { FeaturedSpotsSection } from '../components/Spots/FeaturedSpotsSection';

export const Route = createFileRoute('/')({ component: Home });

function Home() {
  return (
    <main className="min-h-screen bg-tur-bg">
      <Hero />
      <ScrollRevealSection />
      <FeaturedSpotsSection />
    </main>
  );
}
