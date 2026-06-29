import { useState, useEffect } from "react";
import { QRCodeSVG } from "qrcode.react";
import { Instagram, MessageCircle, ArrowLeft, ShoppingBag } from "lucide-react";

import { INSTAGRAM_URL, getWhatsAppCartUrl, getWhatsAppCustomOrderUrl } from "@/lib/contact";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { db } from "@/lib/firebase";
import { doc, getDoc, collection, addDoc, setDoc } from "firebase/firestore";

export function CheckoutPage({ onBack }) {
  const { cart, subtotal, deliveryCharge, total, shippingRegion, freePacketsCount } = useCart();
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);

  const [shippingName, setShippingName] = useState("");
  const [shippingAddress, setShippingAddress] = useState("");
  const [shippingPincode, setShippingPincode] = useState("");

  const primaryUrl = getWhatsAppCartUrl(cart, shippingRegion);
  const customUrl = getWhatsAppCustomOrderUrl();

  useEffect(() => {
    if (!user) return;
    const fetchProfile = async () => {
      try {
        const docRef = doc(db, "user_detail", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setProfile(data);
          if (data.name) setShippingName(data.name);
          if (data.address) setShippingAddress(data.address);
          if (data.pincode) setShippingPincode(String(data.pincode));
        }
      } catch (err) {
        console.error("Failed to load user profile", err);
      }
    };
    fetchProfile();
  }, [user]);

  // Append shipping details to URL
  let finalUrl = primaryUrl;
  if (shippingName || shippingAddress || shippingPincode) {
    const extraText = `\n\n*Shipping Details:*\n- Name: ${shippingName}\n- Address: ${shippingAddress}\n- Pincode: ${shippingPincode}`;
    try {
      const parsedUrl = new URL(primaryUrl);
      const textParam = parsedUrl.searchParams.get("text");
      if (textParam) {
        parsedUrl.searchParams.set("text", textParam + extraText);
        finalUrl = parsedUrl.toString();
      }
    } catch (e) {
      console.error(e);
    }
  }

  const handleCheckoutClick = async () => {
    if (!shippingName.trim() || !shippingAddress.trim() || !shippingPincode.trim()) {
      alert("Please enter your name, address, and pincode before checking out.");
      return;
    }
    try {
      if (user) {
        await addDoc(collection(db, "order_history"), {
          userId: user.uid,
          items: cart.map((item) => ({
            Item: item.name,
            count: Number(item.quantity),
            price: Number(item.price),
          })),
          subtotal: Number(subtotal),
          deliveryCharge: Number(deliveryCharge),
          total: Number(shippingRegion === "delhi_ncr" ? total : subtotal),
          shippingRegion,
          shippingDetails: {
            name: shippingName,
            address: shippingAddress,
            pincode: shippingPincode,
          },
          createdAt: new Date().toISOString(),
          status: "Sent via WhatsApp",
        });

        const docRef = doc(db, "user_detail", user.uid);
        await setDoc(
          docRef,
          {
            name: shippingName,
            address: shippingAddress,
            pincode: parseInt(shippingPincode, 10) || 0,
            updatedAt: new Date().toISOString(),
          },
          { merge: true }
        );
      }
    } catch (err) {
      console.error("Failed to log order or update profile", err);
    }

    // Mark spin coupon as redeemed
    const savedPrize = localStorage.getItem("pahadse_last_spin_prize");
    if (savedPrize) {
      localStorage.setItem("pahadse_coupon_redeemed_date", new Date().toDateString());
      localStorage.removeItem("pahadse_last_spin_prize");
    }

    window.open(finalUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Top bar */}
      <div className="sticky top-0 z-40 border-b border-border/60 bg-background/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-4xl items-center gap-3 px-5 py-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={onBack}
            className="cursor-pointer rounded-full h-9 w-9"
          >
            <ArrowLeft className="size-5" />
          </Button>
          <h1 className="text-lg font-display font-bold text-primary flex items-center gap-2">
            <ShoppingBag className="size-5" /> Checkout
          </h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-4xl px-5 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* LEFT COLUMN: Order Details & Shipping */}
          <div className="space-y-6">
            {/* Order Summary */}
            {cart.length > 0 && (
              <div className="rounded-2xl border border-border/60 bg-card p-5 shadow-sm space-y-3">
                <h2 className="text-sm font-bold text-foreground uppercase tracking-wider flex items-center gap-2">
                  <ShoppingBag className="size-4" /> Order Summary
                </h2>
                <div className="space-y-2 text-sm text-muted-foreground">
                  {cart.map((item) => (
                    <div key={item.id} className="flex justify-between">
                      <span>{item.name} x {item.quantity}</span>
                      <span className="font-medium text-foreground">Rs. {item.price * item.quantity}</span>
                    </div>
                  ))}
                  {freePacketsCount > 0 && (
                    <div className="flex justify-between text-primary font-medium">
                      <span>🎁 Gift Spices Packets x 2</span>
                      <span>Rs. 0</span>
                    </div>
                  )}
                </div>
                <div className="border-t border-border/40 pt-3 space-y-1.5 text-sm">
                  <div className="flex justify-between text-muted-foreground">
                    <span>Subtotal</span>
                    <span>Rs. {subtotal}</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>Shipping ({shippingRegion === "delhi_ncr" ? "Delhi NCR" : "Other State"})</span>
                    <span>
                      {shippingRegion === "delhi_ncr"
                        ? (deliveryCharge === 0 ? "FREE" : `Rs. ${deliveryCharge}`)
                        : "Talk on WhatsApp"}
                    </span>
                  </div>
                  <div className="flex justify-between font-bold text-foreground text-base pt-2 border-t border-border/40">
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

            {/* Shipping Address Form */}
            <div className="rounded-2xl border border-border/60 bg-card p-5 shadow-sm space-y-4">
              <h2 className="text-sm font-bold text-foreground uppercase tracking-wider">
                Shipping Address
              </h2>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground uppercase">Full Name</label>
                <input
                  type="text"
                  placeholder="Enter recipient name"
                  value={shippingName}
                  onChange={(e) => setShippingName(e.target.value)}
                  className="w-full text-sm rounded-lg border border-border bg-background px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-shadow"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground uppercase">Delivery Address</label>
                <input
                  type="text"
                  placeholder="Street, City, State"
                  value={shippingAddress}
                  onChange={(e) => setShippingAddress(e.target.value)}
                  className="w-full text-sm rounded-lg border border-border bg-background px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-shadow"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground uppercase">Pincode</label>
                <input
                  type="text"
                  placeholder="110001"
                  value={shippingPincode}
                  onChange={(e) => setShippingPincode(e.target.value)}
                  className="w-full text-sm rounded-lg border border-border bg-background px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-shadow max-w-[200px]"
                  required
                />
              </div>
            </div>

            {/* Prepaid order notice */}
            <div className="flex gap-3 rounded-2xl bg-primary/5 border border-primary/20 p-4">
              <span className="text-xl select-none mt-0.5">💳</span>
              <div className="text-xs text-muted-foreground leading-relaxed">
                <span className="font-bold text-primary block mb-1 uppercase tracking-wide text-[11px]">
                  Prepaid Orders & Email Confirmation
                </span>
                All orders are prepaid. We will send you a confirmation email once your payment and order details are verified.
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: QR Code & Actions */}
          <div className="space-y-6">
            <div className="rounded-2xl border border-border/60 bg-card p-6 shadow-sm flex flex-col items-center gap-5">
              <h2 className="text-sm font-bold text-foreground uppercase tracking-wider self-start">
                Scan to Order
              </h2>
              <div className="rounded-2xl border border-border bg-white p-5 shadow-[var(--shadow-soft)]">
                <QRCodeSVG
                  value={finalUrl}
                  size={200}
                  bgColor="transparent"
                  fgColor="#2d4a36"
                  level="M"
                />
              </div>
              <p className="text-center text-sm text-muted-foreground">
                Scan this QR code with your phone to send the order details directly to our WhatsApp.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-3">
              <Button
                size="lg"
                className="w-full gap-2 cursor-pointer shadow-md hover:scale-[1.01] active:scale-[0.99] transition-transform duration-200 text-base py-6"
                onClick={handleCheckoutClick}
              >
                <MessageCircle className="size-5" />
                Checkout on WhatsApp
              </Button>

              <Button asChild variant="outline" size="lg" className="w-full cursor-pointer">
                <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer">
                  <Instagram className="size-5" /> @pahadse.store
                </a>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
