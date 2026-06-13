import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Instagram, Quote } from "lucide-react";

import { fadeUp } from "@/components/home/home-motion";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const testimonials = [
  {
    quote:
      "The masala salt by Pahad Se was really good. I used it yesterday in Bundi Raita and it elevated the taste beautifully. Highly recommended!",
    name: "Tarun Singh",
    subtitle: "Digital Marketing Manager, Delhi",
    username: "@arvindharitsinger",
  },
  {
    quote:
      "Har ghar mein ek baar zaroor try karna chahiye. Cucumber, fruits aur dahi ke saath iska taste next level ho jata hai. Definitely recommend!",
    name: "Atul Rawal",
    subtitle: "Talent Acquisition Manager, Delhi",
    username: "@theatullraawall",
  },
  {
    quote:
      "Pahad Se was full of flavors. One try was enough to make my meal go from dull to mouthwatering, and now it's going to be a part of every side dish. Must try!",
    name: "Akshay Raathore",
    subtitle: "Project Engineer, Delhi",
    username: "@akshayraathore",
  },
  {
    quote:
      "Got this beautiful and yummy product from Pahad Se. I've tried many flavored salts, but this one stands out. Can't wait to try more products from them!",
    name: "Grace Darpan",
    subtitle: "UI/UX Designer, Delhi",
    username: "@graceophile",
  },
  {
    quote:
      "Excellent quality and flavor. This spicy salt delivers a unique blend of seasoning and heat that elevates everyday meals. The taste is fresh, aromatic, and versatile enough to be used across a wide range of dishes. A must-have in the kitchen.",
    name: "Shivani",
    subtitle: "Sales Head, Delhi",
    username: "@_instagirl_shivi",
  },
  {
    quote:
      "Maine is product ko try kiya aur overall experience kaafi achha raha. Taste balanced tha aur flavor unique laga. Packaging bhi achhi hai. Price ke hisaab se value for money lagta hai. Agar aap kuch naya try karna chahte hain, toh ise ek baar zaroor try kar sakte hain.",
    name: "Anuj Singh Rajput",
    subtitle: "Software Developer, UP",
    username: "@anujsinghrj",
  },

];
export function TestimonialsSection() {
  const [api, setApi] = useState();
  const [activeIndex, setActiveIndex] = useState(0);
  const [snapCount, setSnapCount] = useState(0);

  useEffect(() => {
    if (!api) return;

    const updateCarouselState = () => {
      setActiveIndex(api.selectedScrollSnap());
      setSnapCount(api.scrollSnapList().length);
    };

    updateCarouselState();
    api.on("select", updateCarouselState);
    api.on("reInit", updateCarouselState);

    return () => {
      api.off("select", updateCarouselState);
      api.off("reInit", updateCarouselState);
    };
  }, [api]);

  return (
    <section className="bg-card px-5 py-20">
      <motion.div
        {...fadeUp}
        className="mx-auto max-w-6xl overflow-hidden rounded-[2rem] border border-border/60 bg-[#224d2f] px-6 py-10 text-primary-foreground shadow-[var(--shadow-soft)] md:px-10"
      >
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-primary-foreground/60">
            Testimonials
          </p>
          <h2 className="mt-4 text-4xl leading-tight md:text-5xl">
            What our customers are <span className="text-gold">saying</span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm text-primary-foreground/70 md:text-base">
            A few kind words from people bringing Pahad Se to their everyday meals.
          </p>
        </div>

        <div className="relative mt-12 px-1 md:px-12">
          <Carousel
            setApi={setApi}
            opts={{
              align: "start",
              loop: false,
              slidesToScroll: 1,
            }}
            className="w-full"
          >
            <CarouselContent>
              {testimonials.map((testimonial) => (
                <CarouselItem
                  key={testimonial.name}
                  className="basis-full md:basis-1/2 xl:basis-1/3"
                >
                  <article className="flex h-full min-h-[250px] flex-col rounded-[1.75rem] border border-primary-foreground/10 bg-primary-foreground/6 p-6 text-center backdrop-blur-sm">
                    <Quote className="mx-auto size-8 text-gold" fill="currentColor" strokeWidth={1.5} />
                    <p className="mt-4 text-[15px] leading-6 text-primary-foreground/90">
                      "{testimonial.quote}"
                    </p>
                    <div className="mt-auto pt-5">
                      <h3 className="text-base font-semibold text-primary-foreground">
                        {testimonial.name}
                      </h3>
                      <p className="mt-1.5 text-sm text-primary-foreground/60">
                        {testimonial.subtitle}
                      </p>
                      <div className="mt-2.5 inline-flex items-center gap-2 rounded-full border border-primary-foreground/12 bg-primary-foreground/8 px-3 py-1 text-xs font-medium text-primary-foreground/80">
                        <Instagram className="size-3.5" />
                        <span>{testimonial.username}</span>
                      </div>
                    </div>
                  </article>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-0 border-primary-foreground/20 bg-primary-foreground/10 text-primary-foreground hover:bg-primary-foreground/20 md:-left-4" />
            <CarouselNext className="right-0 border-primary-foreground/20 bg-primary-foreground/10 text-primary-foreground hover:bg-primary-foreground/20 md:-right-4" />
          </Carousel>
        </div>

        <div className="mt-10 flex items-center justify-center gap-2">
          {Array.from({ length: snapCount || 1 }, (_, index) => (
            <button
              key={index}
              type="button"
              aria-label={`Go to testimonial slide ${index + 1}`}
              onClick={() => api?.scrollTo(index)}
              className={`h-2.5 rounded-full transition-all ${activeIndex === index
                ? "w-8 bg-gold"
                : "w-2.5 bg-primary-foreground/30 hover:bg-primary-foreground/50"
                }`}
            />
          ))}
        </div>
      </motion.div>
    </section>
  );
}
