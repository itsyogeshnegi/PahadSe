import { MessageCircle } from "lucide-react";
import { motion } from "motion/react";

import { ContactDialog } from "@/components/ContactDialog";
import { flavours } from "@/components/home/home-data";
import { fadeUp } from "@/components/home/home-motion";
import { Button } from "@/components/ui/button";

export function ProductsSection() {
  return (
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
  );
}
