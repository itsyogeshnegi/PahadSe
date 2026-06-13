import { lazy } from "react";

function pickExport(exportName) {
  return (module) => ({ default: module[exportName] });
}

const loadProductsSection = () => import("@/components/home/ProductsSection");
const loadStorySection = () => import("@/components/home/StorySection");
const loadTestimonialsSection = () => import("@/components/home/TestimonialsSection");
const loadContactSection = () => import("@/components/home/ContactSection");
const loadFooter = () => import("@/components/home/Footer");

export const LazyProductsSection = lazy(() =>
  loadProductsSection().then(pickExport("ProductsSection")),
);
export const LazyStorySection = lazy(() => loadStorySection().then(pickExport("StorySection")));
export const LazyTestimonialsSection = lazy(() =>
  loadTestimonialsSection().then(pickExport("TestimonialsSection")),
);
export const LazyContactSection = lazy(() =>
  loadContactSection().then(pickExport("ContactSection")),
);
export const LazyFooter = lazy(() => loadFooter().then(pickExport("Footer")));

export function preloadHomeSections() {
  void Promise.all([
    loadProductsSection(),
    loadStorySection(),
    loadTestimonialsSection(),
    loadContactSection(),
    loadFooter(),
  ]);
}
