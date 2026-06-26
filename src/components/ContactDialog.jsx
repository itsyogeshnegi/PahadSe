import { Suspense, cloneElement, isValidElement, lazy } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { getWhatsAppUrl, getWhatsAppCartUrl } from "@/lib/contact";
import { useCart } from "@/contexts/CartContext";

const loadContactDialogBody = () => import("@/components/ContactDialogBody");

const LazyContactDialogBody = lazy(() => loadContactDialogBody().then((module) => ({
  default: module.ContactDialogBody,
})));

function combineHandlers(...handlers) {
  return (event) => {
    handlers.forEach((handler) => handler?.(event));
  };
}

function ContactDialogFallback({ whatsappUrl }) {
  return (
    <div className="flex flex-col items-center gap-5 pt-2">
      <div className="grid h-[228px] w-[228px] animate-pulse place-items-center rounded-2xl border border-border bg-secondary/70 shadow-[var(--shadow-soft)]">
        <div className="h-28 w-28 rounded-2xl border border-border/50 bg-card/80" />
      </div>
      <p className="text-center text-sm text-muted-foreground">
        Preparing your WhatsApp order options...
      </p>
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex w-full items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90"
      >
        Open WhatsApp
      </a>
    </div>
  );
}

export function preloadContactDialog() {
  void loadContactDialogBody();
}

export function ContactDialog({ trigger, productName, cartCheckout = false }) {
  const { cart, shippingRegion } = useCart();
  const whatsappUrl = cartCheckout ? getWhatsAppCartUrl(cart, shippingRegion) : getWhatsAppUrl(productName);
  const warmDialog = () => preloadContactDialog();
  const preparedTrigger = isValidElement(trigger)
    ? cloneElement(trigger, {
        onClick: combineHandlers(trigger.props.onClick, warmDialog),
        onFocus: combineHandlers(trigger.props.onFocus, warmDialog),
        onMouseEnter: combineHandlers(trigger.props.onMouseEnter, warmDialog),
        onPointerEnter: combineHandlers(trigger.props.onPointerEnter, warmDialog),
        onTouchStart: combineHandlers(trigger.props.onTouchStart, warmDialog),
      })
    : trigger;

  return (
    <Dialog>
      <DialogTrigger asChild>{preparedTrigger}</DialogTrigger>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl text-primary">Order on WhatsApp</DialogTitle>
        </DialogHeader>
        <Suspense fallback={<ContactDialogFallback whatsappUrl={whatsappUrl} />}>
          <LazyContactDialogBody
            primaryUrl={whatsappUrl}
            isCartCheckout={cartCheckout}
            cartItems={cart}
          />
        </Suspense>
      </DialogContent>
    </Dialog>
  );
}
