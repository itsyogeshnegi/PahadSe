import { Instagram, MessageCircle } from "lucide-react";
import { motion } from "motion/react";

import { ContactDialog, INSTAGRAM_URL } from "@/components/ContactDialog";
import { fadeUp } from "@/components/home/home-motion";
import { Button } from "@/components/ui/button";
import { SITE_INSTAGRAM_HANDLE } from "@/lib/site";

export function ContactSection() {
  return (
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
  );
}
