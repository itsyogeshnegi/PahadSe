import { motion } from "motion/react";

import { promises } from "@/components/home/home-data";
import { fadeUp } from "@/components/home/home-motion";

export function PromisesSection() {
  return (
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
  );
}
