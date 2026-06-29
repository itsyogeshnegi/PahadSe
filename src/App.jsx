import { Suspense, useEffect, useState } from "react";
import { Analytics } from "@vercel/analytics/react";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SpinWheelDialog } from "@/components/SpinWheelDialog";
import { CheckoutPage } from "@/components/CheckoutPage";
import { useNavigationStore } from "@/stores/navigationStore";

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

  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstallBtn, setShowInstallBtn] = useState(false);

  const { currentPage, navigateTo, syncFromUrl } = useNavigationStore();

  // Sync navigation state when user presses browser back/forward
  useEffect(() => {
    const handlePopState = () => syncFromUrl();
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [syncFromUrl]);

  useEffect(() => {
    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallBtn(true);
    };
    window.addEventListener("beforeinstallprompt", handler);

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    console.log(`User installed PWA response: ${outcome}`);
    setDeferredPrompt(null);
    setShowInstallBtn(false);
  };

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
          {currentPage === "checkout" ? (
            <CheckoutPage onBack={() => { navigateTo("home"); window.scrollTo(0, 0); }} />
          ) : (
            <>
              <Header onCheckout={() => { navigateTo("checkout"); window.scrollTo(0, 0); }} />
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
            </>
          )}

          {/* Floating PWA Download Button on Mobile/Tablet */}
          {showInstallBtn && (
            <div className="fixed bottom-6 left-6 z-50 md:hidden">
              <Button
                onClick={handleInstallClick}
                className="h-12 w-12 rounded-full shadow-lg bg-gold hover:bg-gold/90 text-gold-foreground flex items-center justify-center p-0 cursor-pointer animate-pulse border-2 border-background"
                aria-label="Download App"
              >
                <Download className="size-6" />
              </Button>
            </div>
          )}

          {/* Floating PWA Spin the Wheel game widget */}
          <SpinWheelDialog />
        </div>
      </CartProvider>
    </AuthProvider>
  );
}
