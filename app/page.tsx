import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/sections/Hero";
import { About } from "@/components/sections/About";
import { HowItWorksStory } from "@/components/sections/HowItWorksStory";
import { Seasons } from "@/components/sections/Seasons";
import { Trust } from "@/components/sections/Trust";
import { Why } from "@/components/sections/Why";
import { SEOContent } from "@/components/sections/SEOContent";
import { FAQ } from "@/components/sections/FAQ";
import { FinalCTA } from "@/components/sections/FinalCTA";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <div className="section-divider" />
        <About />
        <div className="section-divider" />
        <SEOContent />
        <div className="section-divider" />
        <HowItWorksStory />
        <div className="section-divider" />
        <Seasons />
        <Trust />
        <Why />
        <div className="section-divider" />
        <FAQ />
        <div className="section-divider" />
        <FinalCTA />
      </main>
      <Footer />
    </>
  );
}
