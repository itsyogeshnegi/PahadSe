import { QRCodeSVG } from "qrcode.react";
import { MessageCircle, Instagram } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
const WHATSAPP_URL =
  "https://wa.me/919310309829?text=Hi%20Pahad%20Se!%20I%27d%20like%20to%20order.";
const INSTAGRAM_URL = "https://www.instagram.com/pahadse.store/";
export function ContactDialog({ trigger }) {
  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl text-primary">Order on WhatsApp</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-center gap-5 pt-2">
          <div className="rounded-2xl border border-border bg-card p-4 shadow-[var(--shadow-soft)]">
            <QRCodeSVG
              value={WHATSAPP_URL}
              size={196}
              bgColor="transparent"
              fgColor="#2d4a36"
              level="M"
            />
          </div>
          <p className="text-center text-sm text-muted-foreground">
            Scan the code, or tap below to chat with us directly.
          </p>
          <div className="flex w-full flex-col gap-3">
            <Button asChild size="lg" className="w-full">
              <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer">
                <MessageCircle className="size-5" /> Chat: +91 93103 09829
              </a>
            </Button>
            <Button asChild variant="outline" size="lg" className="w-full">
              <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer">
                <Instagram className="size-5" /> @pahadse.store
              </a>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
export { WHATSAPP_URL, INSTAGRAM_URL };
