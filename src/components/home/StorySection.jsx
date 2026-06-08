import { Leaf } from "lucide-react";
import { motion } from "motion/react";

import twoFlavours from "@/assets/images/about.webp";
import { fadeUp } from "@/components/home/home-motion";

const storyPoints = [
  "Sourced from Himalayan farms",
  "Stone-ground in small batches",
  "Zero additives, zero preservatives",
];

export function StorySection() {
  return (
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
            {storyPoints.map((item) => (
              <li key={item} className="flex items-center gap-3 text-foreground">
                <Leaf className="size-5 shrink-0 text-gold" /> {item}
              </li>
            ))}
          </ul>
        </motion.div>
      </div>
    </section>
  );
}
