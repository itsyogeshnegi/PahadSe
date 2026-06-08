import { Analytics } from "@vercel/analytics/react";

import { ContactSection } from "@/components/home/ContactSection";
import { Footer } from "@/components/home/Footer";
import { Header } from "@/components/home/Header";
import { HeroSection } from "@/components/home/HeroSection";
import { ProductsSection } from "@/components/home/ProductsSection";
import { PromisesSection } from "@/components/home/PromisesSection";
import { StorySection } from "@/components/home/StorySection";
import { useHomeSeo } from "@/components/home/use-home-seo";

export default function App() {
  useHomeSeo();

  return (
    <>
      <Analytics />
      <div className="min-h-screen bg-background text-foreground">
        <Header />
        <HeroSection />
        <PromisesSection />
        <ProductsSection />
        <StorySection />
        <ContactSection />
        <Footer />
      </div>
    </>
  );
}
