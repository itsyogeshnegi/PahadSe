import { Instagram, Leaf, MessageCircle } from "lucide-react";
import { motion } from "motion/react";

import lineup from "@/assets/images/hero-banner.webp";
import { ContactDialog, INSTAGRAM_URL } from "@/components/ContactDialog";
import { Button } from "@/components/ui/button";
import { fadeUp } from "@/components/home/home-motion";

export function HeroSection() {
  return (
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
  );
}
