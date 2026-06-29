import { create } from "zustand";

/**
 * Navigation store using Zustand.
 * Syncs the current page state with the browser URL via History API.
 * On refresh, the page is derived from `window.location.pathname`.
 */
export const useNavigationStore = create((set) => ({
  // Derive initial page from the current browser URL
  currentPage: typeof window !== "undefined" && window.location.pathname === "/checkout" ? "checkout" : "home",

  navigateTo: (page) => {
    const path = page === "checkout" ? "/checkout" : "/";
    window.history.pushState({ page }, "", path);
    set({ currentPage: page });
  },

  goBack: () => {
    window.history.back();
  },

  // Called from popstate listener to sync state with browser navigation
  syncFromUrl: () => {
    const page = window.location.pathname === "/checkout" ? "checkout" : "home";
    set({ currentPage: page });
  },
}));
