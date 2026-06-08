import { useEffect } from "react";

import { INSTAGRAM_URL } from "@/components/ContactDialog";
import {
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_TAGLINE,
  getAbsoluteSiteUrl,
} from "@/lib/site";
import lineup from "@/assets/images/hero-banner.webp";

function ensureMeta(selector, attrs) {
  let element = document.head.querySelector(selector);
  if (!element) {
    element = document.createElement("meta");
    document.head.appendChild(element);
  }

  Object.entries(attrs).forEach(([key, value]) => {
    element.setAttribute(key, value);
  });
}

function ensureLink(selector, attrs) {
  let element = document.head.querySelector(selector);
  if (!element) {
    element = document.createElement("link");
    document.head.appendChild(element);
  }

  Object.entries(attrs).forEach(([key, value]) => {
    element.setAttribute(key, value);
  });
}

export function useHomeSeo() {
  useEffect(() => {
    const pageUrl = getAbsoluteSiteUrl("/", window.location.href);
    const imageUrl = getAbsoluteSiteUrl(lineup, window.location.href);

    document.title = `${SITE_NAME} | ${SITE_TAGLINE}`;
    ensureMeta('meta[name="description"]', { name: "description", content: SITE_DESCRIPTION });
    ensureMeta('meta[property="og:title"]', {
      property: "og:title",
      content: `${SITE_NAME} | ${SITE_TAGLINE}`,
    });
    ensureMeta('meta[property="og:description"]', {
      property: "og:description",
      content: SITE_DESCRIPTION,
    });
    ensureMeta('meta[property="og:type"]', { property: "og:type", content: "website" });
    ensureMeta('meta[property="og:url"]', { property: "og:url", content: pageUrl });
    ensureMeta('meta[property="og:image"]', { property: "og:image", content: imageUrl });
    ensureMeta('meta[name="twitter:card"]', {
      name: "twitter:card",
      content: "summary_large_image",
    });
    ensureMeta('meta[name="twitter:title"]', {
      name: "twitter:title",
      content: `${SITE_NAME} | ${SITE_TAGLINE}`,
    });
    ensureMeta('meta[name="twitter:description"]', {
      name: "twitter:description",
      content: SITE_DESCRIPTION,
    });
    ensureMeta('meta[name="twitter:image"]', { name: "twitter:image", content: imageUrl });
    ensureLink('link[rel="canonical"]', { rel: "canonical", href: pageUrl });

    let script = document.getElementById("brand-schema");
    if (!script) {
      script = document.createElement("script");
      script.id = "brand-schema";
      script.type = "application/ld+json";
      document.head.appendChild(script);
    }

    script.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Brand",
      name: SITE_NAME,
      slogan: SITE_TAGLINE,
      sameAs: [INSTAGRAM_URL],
    });
  }, []);
}
