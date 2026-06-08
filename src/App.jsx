import { Suspense, useEffect } from "react";
import { Analytics } from "@vercel/analytics/react";

import {
  ContactSectionFallback,
  FooterFallback,
  ProductsSectionFallback,
  StorySectionFallback,
} from "@/components/home/HomeSectionFallbacks";
import { Header } from "@/components/home/Header";
import { HeroSection } from "@/components/home/HeroSection";
import { PromisesSection } from "@/components/home/PromisesSection";
import {
  LazyContactSection,
  LazyFooter,
  LazyProductsSection,
  LazyStorySection,
  preloadHomeSections,
} from "@/components/home/home-lazy";
import { useHomeSeo } from "@/components/home/use-home-seo";
import { preloadContactDialog } from "@/components/ContactDialog";

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
    <>
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
        <Suspense fallback={<ContactSectionFallback />}>
          <LazyContactSection />
        </Suspense>
        <Suspense fallback={<FooterFallback />}>
          <LazyFooter />
        </Suspense>
      </div>
    </>
  );
}
