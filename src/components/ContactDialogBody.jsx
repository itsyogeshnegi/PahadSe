import { useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { Instagram, MessageCircle } from "lucide-react";

import { INSTAGRAM_URL, getWhatsAppCustomOrderUrl } from "@/lib/contact";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";

export function ContactDialogBody({ primaryUrl, isCartCheckout = false, cartItems = [] }) {
  const customUrl = getWhatsAppCustomOrderUrl();
  const [currentMode, setCurrentMode] = useState(isCartCheckout ? "cart" : "custom");
  const { subtotal, deliveryCharge, total, shippingRegion } = useCart();

  const activeUrl = currentMode === "cart" ? primaryUrl : customUrl;

  return (
    <div className="flex flex-col items-center gap-5 pt-2">
      {/* Segmented control tabs (Cart checkout vs Custom inquiry) */}
      {isCartCheckout && (
        <div className="flex w-full rounded-lg bg-secondary p-1 text-xs select-none">
          <button
            onClick={() => setCurrentMode("cart")}
            className={`flex-1 rounded py-1.5 text-center font-medium transition-colors cursor-pointer ${
              currentMode === "cart"
                ? "bg-background text-primary shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Checkout Cart
          </button>
          <button
            onClick={() => setCurrentMode("custom")}
            className={`flex-1 rounded py-1.5 text-center font-medium transition-colors cursor-pointer ${
              currentMode === "custom"
                ? "bg-background text-primary shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Custom Inquiry
          </button>
        </div>
      )}

      {/* Cart Summary displayed in Dialog */}
      {currentMode === "cart" && cartItems.length > 0 && (
        <div className="w-full text-xs text-muted-foreground bg-secondary/40 rounded-xl p-3 border border-border/40 max-h-[140px] overflow-y-auto space-y-1 text-left">
          <div className="font-semibold text-foreground mb-1">Order Summary:</div>
          {cartItems.map((item) => (
            <div key={item.id} className="flex justify-between">
              <span>
                {item.name} x {item.quantity}
              </span>
              <span>Rs. {item.price * item.quantity}</span>
            </div>
          ))}
          <div className="border-t border-border/60 mt-1.5 pt-1.5 space-y-0.5">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>Rs. {subtotal}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping ({shippingRegion === "delhi_ncr" ? "Delhi NCR" : "Other State"})</span>
              <span>
                {shippingRegion === "delhi_ncr"
                  ? (deliveryCharge === 0 ? "FREE" : `Rs. ${deliveryCharge}`)
                  : "Talk on WhatsApp"}
              </span>
            </div>
            <div className="flex justify-between font-semibold text-foreground border-t border-border/40 mt-1 pt-1">
              <span>Total</span>
              <span>
                {shippingRegion === "delhi_ncr"
                  ? `Rs. ${total}`
                  : `Rs. ${subtotal} + Shipping`}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* QR Code Container */}
      <div className="rounded-2xl border border-border bg-card p-4 shadow-[var(--shadow-soft)] transition-all duration-300">
        <QRCodeSVG
          value={activeUrl}
          size={180}
          bgColor="transparent"
          fgColor="#2d4a36"
          level="M"
        />
      </div>

      <p className="text-center text-sm text-muted-foreground px-2">
        {currentMode === "cart"
          ? "Scan the code, or tap below to send your cart details to WhatsApp."
          : "Scan the code, or tap below to discuss a custom order on WhatsApp."}
      </p>

      {/* Action Buttons */}
      <div className="flex w-full flex-col gap-3">
        <Button asChild size="lg" className="w-full cursor-pointer">
          <a href={activeUrl} target="_blank" rel="noopener noreferrer">
            <MessageCircle className="size-5" />
            {currentMode === "cart" ? "Checkout on WhatsApp" : "Talk Custom Order"}
          </a>
        </Button>

        {/* Dynamic toggle link if not launched from a cart checkout */}
        {!isCartCheckout && cartItems.length > 0 && (
          <button
            onClick={() => setCurrentMode((prev) => (prev === "cart" ? "custom" : "cart"))}
            className="text-xs text-primary font-medium hover:underline cursor-pointer py-1 self-center"
          >
            {currentMode === "custom"
              ? "Have items in cart? Checkout cart instead"
              : "Need a custom order? Chat with us here"}
          </button>
        )}

        <Button asChild variant="outline" size="lg" className="w-full cursor-pointer">
          <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer">
            <Instagram className="size-5" /> @pahadse.store
          </a>
        </Button>
      </div>
    </div>
  );
}
