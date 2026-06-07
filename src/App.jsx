import { useEffect } from "react";
import { motion } from "motion/react";
import { HeartHandshake, Instagram, Leaf, MessageCircle, Mountain, Sparkles } from "lucide-react";

import garlicChilli from "@/assets/images/red-chilli.webp";
import hariMirch from "@/assets/images/green-chilli.webp";
import lineup from "@/assets/images/hero-banner.webp";
import logo from "@/assets/images/pahad-se-logo.webp";
import twoFlavours from "@/assets/images/about.webp";
import { ContactDialog, INSTAGRAM_URL, WHATSAPP_URL } from "@/components/ContactDialog";
import { Button } from "@/components/ui/button";
import {
  SITE_DESCRIPTION,
  SITE_INSTAGRAM_HANDLE,
  SITE_NAME,
  SITE_TAGLINE,
  getAbsoluteSiteUrl,
} from "@/lib/site";

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
};

const flavours = [
  {
    name: "Garlic with Red Chilli",
    tags: ["Spicy", "Tangy", "Flavorful"],
    image: garlicChilli,
    desc: "A warm, smoky blend of sun-dried red chilli and pahadi garlic - a little sprinkle wakes up everything from dal to dosa.",
    accent: "text-chili",
  },
  {
    name: "Hari Mirch & Jeera",
    tags: ["Fresh", "Zesty", "Aromatic"],
    image: hariMirch,
    desc: "Bright green chilli folded with toasted cumin - fresh, fragrant, and gently fiery, the way the hills make it.",
    accent: "text-primary",
  },
];

const promises = [
  { icon: Leaf, label: "100% Natural" },
  { icon: Sparkles, label: "No Preservatives" },
  { icon: Mountain, label: "Authentic Pahadi Taste" },
  { icon: HeartHandshake, label: "Made with Love" },
];

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

export default function App() {
  useEffect(() => {
    const pageUrl = getAbsoluteSiteUrl("/", window.location.href);
    const imageUrl = getAbsoluteSiteUrl(lineup.url, window.location.href);

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

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-2">
          <img src={logo} alt="Pahad Se logo" className="h-20 w-auto" />
          <nav className="hidden items-center gap-20 text-l font-semibold text-foreground md:flex">
            <a href="#products" className="transition-colors hover:text-primary">
              Products
            </a>
            <a href="#story" className="transition-colors hover:text-primary">
              Story
            </a>
            <a href="#contact" className="transition-colors hover:text-primary">
              Contact
            </a>
          </nav>
          <div className="flex items-center gap-2">
            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="grid size-10 place-items-center rounded-full text-primary transition-colors hover:bg-secondary"
            >
              <Instagram className="size-6" />
            </a>
            <ContactDialog
              trigger={
                <Button size="sm" className="gap-2">
                  <MessageCircle className="size-7" /> Order
                </Button>
              }
            />
          </div>
        </div>
      </header>

      <section className="relative overflow-hidden" style={{ background: "var(--gradient-hero)" }}>
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-5 py-16 md:grid-cols-2 md:py-24">
          <motion.div {...fadeUp}>
            <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
              <Leaf className="size-4" /> Introducing our 2 natural flavours
            </span>
            <h1 className="mt-6 text-5xl leading-[1.05] text-primary md:text-7xl">
              Pahadon ka <span className="italic text-gold">asli</span> swaad
            </h1>
            <p className="mt-5 max-w-md text-lg text-muted-foreground">
              Handcrafted spice blends made with natural Uttarakhand ingredients. The calm, honest
              taste of the Himalayas - in every pinch.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <ContactDialog
                trigger={
                  <Button size="lg" className="gap-2">
                    <MessageCircle className="size-5" /> Order on WhatsApp
                  </Button>
                }
              />
              <Button asChild variant="outline" size="lg" className="gap-2">
                <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer">
                  <Instagram className="size-5" /> Follow us
                </a>
              </Button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="relative"
          >
            <div className="animate-float overflow-hidden rounded-3xl border border-border bg-card shadow-[var(--shadow-soft)]">
              <img src={lineup} alt="Pahad Se spice pouches lineup" className="w-full" />
            </div>
          </motion.div>
        </div>
      </section>

      <section className="border-y border-border/60 bg-card">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-6 px-5 py-10 md:grid-cols-4">
          {promises.map((promise) => (
            <motion.div
              key={promise.label}
              {...fadeUp}
              className="flex flex-col items-center gap-3 text-center"
            >
              <span className="grid size-14 place-items-center rounded-full bg-primary/10 text-primary">
                <promise.icon className="size-6" />
              </span>
              <span className="text-sm font-semibold text-foreground">{promise.label}</span>
            </motion.div>
          ))}
        </div>
      </section>

      <section id="products" className="mx-auto max-w-6xl px-5 py-20">
        <motion.div {...fadeUp} className="mx-auto max-w-2xl text-center">
          <h2 className="text-4xl text-primary md:text-5xl">Two flavours, endless meals</h2>
          <p className="mt-4 text-muted-foreground">
            Small-batch, sun-dried and stone-ground. Sprinkle over anything and taste the hills.
          </p>
        </motion.div>

        <div className="mt-14 grid gap-8 md:grid-cols-2">
          {flavours.map((flavour) => (
            <motion.article
              key={flavour.name}
              {...fadeUp}
              className="group overflow-hidden rounded-3xl border border-border bg-card shadow-[var(--shadow-soft)]"
            >
              <div className="overflow-hidden">
                <img
                  src={flavour.image}
                  alt={flavour.name}
                  className="aspect-[4/3] w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <div className="p-7">
                <div className="mb-3 flex flex-wrap gap-2">
                  {flavour.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <h3 className={`text-3xl ${flavour.accent}`}>{flavour.name}</h3>
                <p className="mt-3 text-muted-foreground">{flavour.desc}</p>
                <ContactDialog
                  productName={flavour.name}
                  trigger={
                    <Button variant="outline" className="mt-6 gap-2">
                      <MessageCircle className="size-4" /> Order this
                    </Button>
                  }
                />
              </div>
            </motion.article>
          ))}
        </div>
      </section>

      <section id="story" className="bg-card">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-5 py-20 md:grid-cols-2">
          <motion.div
            {...fadeUp}
            className="overflow-hidden rounded-3xl border border-border shadow-[var(--shadow-soft)]"
          >
            <img src={twoFlavours} alt="Two Pahad Se flavours up close" className="w-full" />
          </motion.div>
          <motion.div {...fadeUp}>
            <h2 className="text-4xl text-primary md:text-5xl">From the mountains, with care</h2>
            <p className="mt-5 text-muted-foreground">
              Pahad Se is a little tribute to Uttarakhand kitchens - where spices are dried in the
              sun, ground by hand, and never touched by preservatives. We bottle that same quiet,
              wholesome flavour so you can carry a piece of the pahad to your table.
            </p>
            <ul className="mt-6 space-y-3">
              {[
                "Sourced from Himalayan farms",
                "Stone-ground in small batches",
                "Zero additives, zero preservatives",
              ].map((item) => (
                <li key={item} className="flex items-center gap-3 text-foreground">
                  <Leaf className="size-5 shrink-0 text-gold" /> {item}
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </section>

      <section id="contact" className="mx-auto max-w-6xl px-5 py-20">
        <motion.div
          {...fadeUp}
          className="rounded-3xl border border-border bg-primary px-6 py-14 text-center text-primary-foreground shadow-[var(--shadow-soft)]"
        >
          <h2 className="text-4xl md:text-5xl">Ready to taste ?</h2>
          <p className="mx-auto mt-4 max-w-md text-primary-foreground/80">
            Message us on WhatsApp to place your order. Pahadon ka asli swaad.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <ContactDialog
              trigger={
                <Button size="lg" variant="secondary" className="gap-2">
                  <MessageCircle className="size-5" /> Order on WhatsApp
                </Button>
              }
            />
            <Button
              asChild
              size="lg"
              variant="outline"
              className="gap-2 border-primary-foreground/40 bg-transparent text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
            >
              <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer">
                <Instagram className="size-5" /> {SITE_INSTAGRAM_HANDLE}
              </a>
            </Button>
          </div>
        </motion.div>
      </section>

      <footer className="border-t border-border/60 bg-card">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-5 py-2 text-center">
          <img src={logo} alt="Pahad Se logo" className="h-20 w-auto" />
          <p className="text-sm italic text-muted-foreground">"Pahadon ka asli swaad"</p>
          <div className="flex items-center gap-4">
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp"
              className="text-primary hover:text-gold"
            >
              <MessageCircle className="size-5" />
            </a>
            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="text-primary hover:text-gold"
            >
              <Instagram className="size-5" />
            </a>
          </div>
          <p className="text-xs text-muted-foreground">
            Copyright {new Date().getFullYear()} {SITE_NAME} | +91 93103 09829
          </p>
        </div>
      </footer>
    </div>
  );
}
