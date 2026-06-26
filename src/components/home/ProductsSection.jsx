import { MessageCircle, Minus, Plus, ShoppingBag } from "lucide-react";
import { motion } from "motion/react";

import { useCart } from "@/contexts/CartContext";
import { flavours } from "@/components/home/home-data";
import { fadeUp } from "@/components/home/home-motion";
import { Button } from "@/components/ui/button";

export function ProductsSection() {
  const { cart, addToCart, updateQuantity } = useCart();

  return (
    <section id="products" className="mx-auto max-w-6xl px-5 py-20">
      <motion.div {...fadeUp} className="mx-auto max-w-2xl text-center">
        <h2 className="text-4xl text-primary md:text-5xl">Two flavours, endless meals</h2>
        <p className="mt-4 text-muted-foreground">
          Small-batch, sun-dried and stone-ground. Sprinkle over anything and taste the hills.
        </p>
      </motion.div>

      <div className="mt-14 grid gap-8 md:grid-cols-2">
        {flavours.map((flavour) => {
          const cartItem = cart.find((item) => item.id === flavour.id);

          return (
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
                <div className="mt-1 text-xl font-bold text-foreground">
                  Rs. {flavour.price}
                </div>
                <p className="mt-3 text-muted-foreground">{flavour.desc}</p>
                <div className="mt-6">
                  {cartItem ? (
                    <div className="flex items-center gap-4">
                      <div className="flex items-center rounded-lg border border-border bg-background p-1 shadow-sm">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => updateQuantity(flavour.id, cartItem.quantity - 1)}
                          className="h-8 w-8 rounded-md cursor-pointer select-none text-muted-foreground hover:text-foreground"
                        >
                          <Minus className="size-4" />
                        </Button>
                        <span className="w-8 text-center text-sm font-semibold select-none">
                          {cartItem.quantity}
                        </span>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => updateQuantity(flavour.id, cartItem.quantity + 1)}
                          className="h-8 w-8 rounded-md cursor-pointer select-none text-muted-foreground hover:text-foreground"
                        >
                          <Plus className="size-4" />
                        </Button>
                      </div>
                      <span className="text-xs text-muted-foreground font-medium">In your cart</span>
                    </div>
                  ) : (
                    <Button
                      onClick={() => addToCart(flavour)}
                      className="gap-2 cursor-pointer select-none font-semibold shadow-sm hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
                    >
                      <ShoppingBag className="size-4" /> Add to Cart
                    </Button>
                  )}
                </div>
              </div>
            </motion.article>
          );
        })}
      </div>
    </section>
  );
}
