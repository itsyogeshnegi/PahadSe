import { Suspense, useEffect } from "react";
import { Analytics } from "@vercel/analytics/react";

import {
  ContactSectionFallback,
  FooterFallback,
  ProductsSectionFallback,
  StorySectionFallback,
  TestimonialsSectionFallback,
} from "@/components/home/HomeSectionFallbacks";
import { Header } from "@/components/home/Header";
import { HeroSection } from "@/components/home/HeroSection";
import { PromisesSection } from "@/components/home/PromisesSection";
import {
  LazyContactSection,
  LazyFooter,
  LazyProductsSection,
  LazyStorySection,
  LazyTestimonialsSection,
  preloadHomeSections,
} from "@/components/home/home-lazy";
import { useHomeSeo } from "@/components/home/use-home-seo";
import { preloadContactDialog } from "@/components/ContactDialog";
import { CartProvider } from "@/contexts/CartContext";

function scheduleIdleTask(callback) {
  if (typeof window === "undefined") {
    return () => {};
  }

  if ("requestIdleCallback" in window) {
    const idleId = window.requestIdleCallback(callback, { timeout: 1500 });
    return () => window.cancelIdleCallback(idleId);
  }

  const timeoutId = window.setTimeout(callback, 600);
  return () => window.clearTimeout(timeoutId);
}

export default function App() {
  useHomeSeo();

  useEffect(() => {
    return scheduleIdleTask(() => {
      preloadHomeSections();
      preloadContactDialog();
    });
  }, []);

  return (
    <CartProvider>
      <Analytics />
      <div className="min-h-screen bg-background text-foreground">
        <Header />
        <HeroSection />
        <PromisesSection />
        <Suspense fallback={<ProductsSectionFallback />}>
          <LazyProductsSection />
        </Suspense>
        <Suspense fallback={<StorySectionFallback />}>
          <LazyStorySection />
        </Suspense>
        <Suspense fallback={<TestimonialsSectionFallback />}>
          <LazyTestimonialsSection />
        </Suspense>
        <Suspense fallback={<ContactSectionFallback />}>
          <LazyContactSection />
        </Suspense>
        <Suspense fallback={<FooterFallback />}>
          <LazyFooter />
        </Suspense>
      </div>
    </CartProvider>
  );
}
