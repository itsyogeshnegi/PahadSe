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
import { AuthProvider } from "@/contexts/AuthContext";
import { ErrorBoundary } from "@/components/ErrorBoundary";

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
    <AuthProvider>
      <CartProvider>
        <Analytics />
        <div className="min-h-screen bg-background text-foreground">
          <Header />
          <HeroSection />
          <PromisesSection />
          <ErrorBoundary>
            <Suspense fallback={<ProductsSectionFallback />}>
              <LazyProductsSection />
            </Suspense>
          </ErrorBoundary>
          <ErrorBoundary>
            <Suspense fallback={<StorySectionFallback />}>
              <LazyStorySection />
            </Suspense>
          </ErrorBoundary>
          <ErrorBoundary>
            <Suspense fallback={<TestimonialsSectionFallback />}>
              <LazyTestimonialsSection />
            </Suspense>
          </ErrorBoundary>
          <ErrorBoundary>
            <Suspense fallback={<ContactSectionFallback />}>
              <LazyContactSection />
            </Suspense>
          </ErrorBoundary>
          <ErrorBoundary>
            <Suspense fallback={<FooterFallback />}>
              <LazyFooter />
            </Suspense>
          </ErrorBoundary>
        </div>
      </CartProvider>
    </AuthProvider>
  );
}
