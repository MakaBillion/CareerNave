import { MotionConfig } from "motion/react";
import SiteHeader from "@/src/components/site/SiteHeader";
import Hero from "@/src/components/site/Hero";
import AboutSection from "@/src/components/site/AboutSection";
import EcosystemSection from "@/src/components/site/EcosystemSection";
import SectorsSection from "@/src/components/site/SectorsSection";
import SetasSection from "@/src/components/site/SetasSection";
import ContactSection from "@/src/components/site/ContactSection";
import SiteFooter from "@/src/components/site/SiteFooter";

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <div className="min-h-screen bg-white font-body text-ink">
        <SiteHeader />
        <main>
          <Hero />
          <AboutSection />
          <EcosystemSection />
          <SectorsSection />
          <SetasSection />
          <ContactSection />
        </main>
        <SiteFooter />
      </div>
    </MotionConfig>
  );
}
