import { Instagram, MessageCircle, Minus, Plus, ShoppingBag } from "lucide-react";

import logo from "@/assets/images/pahad-se-logo.webp";
import { ContactDialog } from "@/components/ContactDialog";
import { Button } from "@/components/ui/button";
import { INSTAGRAM_URL } from "@/lib/contact";
import { useCart } from "@/contexts/CartContext";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export function Header() {
  const {
    cart,
    cartCount,
    subtotal,
    deliveryCharge,
    total,
    updateQuantity,
    removeFromCart,
    shippingRegion,
    setShippingRegion,
  } = useCart();

  return (
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

          {/* Shopping Cart Drawer */}
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="relative cursor-pointer h-10 w-10 text-primary hover:bg-secondary rounded-full"
              >
                <ShoppingBag className="size-6" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-accent text-xs font-bold text-accent-foreground select-none animate-in zoom-in duration-200">
                    {cartCount}
                  </span>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent className="flex h-full w-full flex-col sm:max-w-md bg-background border-l border-border/60 p-6">
              <SheetHeader className="pb-6 border-b border-border/50 text-left">
                <SheetTitle className="text-2xl font-display text-primary flex items-center gap-2">
                  <ShoppingBag className="size-6 text-primary" /> Your Cart
                </SheetTitle>
                <SheetDescription>Verify your Himalayan spices before checkout.</SheetDescription>
              </SheetHeader>

              {/* Items Container */}
              <div className="flex-1 overflow-y-auto py-6 space-y-4">
                {cart.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center p-6 space-y-3">
                    <ShoppingBag className="size-16 text-muted-foreground/30" />
                    <p className="text-lg font-medium text-foreground">Your cart is empty</p>
                    <p className="text-sm text-muted-foreground">
                      Add some natural Uttarakhand flavors to start!
                    </p>
                    <SheetClose asChild>
                      <Button className="mt-2 cursor-pointer" variant="outline">
                        Browse Products
                      </Button>
                    </SheetClose>
                  </div>
                ) : (
                  cart.map((item) => (
                    <div
                      key={item.id}
                      className="flex gap-4 p-4 rounded-2xl border border-border/50 bg-card/50 shadow-[var(--shadow-soft)]/5"
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-16 w-16 rounded-xl object-cover border border-border/50 bg-secondary/20"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-foreground truncate text-sm">
                          {item.name}
                        </h4>
                        <p className="text-sm font-medium text-muted-foreground mt-0.5">
                          Rs. {item.price}
                        </p>
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center rounded-md border border-border bg-background p-0.5 shadow-sm">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="h-7 w-7 rounded cursor-pointer select-none text-muted-foreground hover:text-foreground"
                            >
                              <Minus className="size-3.5" />
                            </Button>
                            <span className="w-6 text-center text-xs font-semibold select-none">
                              {item.quantity}
                            </span>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="h-7 w-7 rounded cursor-pointer select-none text-muted-foreground hover:text-foreground"
                            >
                              <Plus className="size-3.5" />
                            </Button>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeFromCart(item.id)}
                            className="text-xs text-destructive hover:text-destructive/80 hover:bg-destructive/10 rounded px-2 py-1 cursor-pointer"
                          >
                            Remove
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Region Selector */}
              {cart.length > 0 && (
                <div className="border-t border-border/50 pt-4 space-y-2">
                  <label
                    htmlFor="region-select"
                    className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block text-left"
                  >
                    Shipping Region
                  </label>
                  <select
                    id="region-select"
                    value={shippingRegion}
                    onChange={(e) => setShippingRegion(e.target.value)}
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer font-medium"
                  >
                    <option value="delhi_ncr">Delhi NCR (Rs. 50, Free above Rs. 299)</option>
                    <option value="other">Other States (Calculated on WhatsApp)</option>
                  </select>
                </div>
              )}

              {/* Totals Breakdown */}
              {cart.length > 0 && (
                <div className="border-t border-border/50 pt-4 space-y-4 bg-background">
                  <div className="space-y-1.5 text-sm text-left">
                    <div className="flex justify-between text-muted-foreground">
                      <span>Subtotal</span>
                      <span>Rs. {subtotal}</span>
                    </div>
                    <div className="flex justify-between text-muted-foreground">
                      <span>Delivery Charges</span>
                      <span>
                        {shippingRegion === "delhi_ncr"
                          ? (deliveryCharge === 0 ? "FREE" : `Rs. ${deliveryCharge}`)
                          : "Talk on WhatsApp"}
                      </span>
                    </div>
                    <div className="flex justify-between font-bold text-foreground text-base pt-2 border-t border-border/40">
                      <span>Total Amount</span>
                      <span>
                        {shippingRegion === "delhi_ncr"
                          ? `Rs. ${total}`
                          : `Rs. ${subtotal} + Shipping`}
                      </span>
                    </div>
                  </div>
                  <ContactDialog
                    cartCheckout={true}
                    trigger={
                      <Button
                        size="lg"
                        className="w-full gap-2 cursor-pointer shadow-sm hover:scale-[1.01] active:scale-[0.99] transition-transform duration-200"
                      >
                        <MessageCircle className="size-5" /> Checkout on WhatsApp
                      </Button>
                    }
                  />
                </div>
              )}
            </SheetContent>
          </Sheet>

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
  );
}
