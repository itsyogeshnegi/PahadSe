import { QRCodeSVG } from "qrcode.react";
import { Instagram, MessageCircle } from "lucide-react";

import { INSTAGRAM_URL } from "@/lib/contact";
import { Button } from "@/components/ui/button";

export function ContactDialogBody({ whatsappUrl }) {
  return (
    <div className="flex flex-col items-center gap-5 pt-2">
      <div className="rounded-2xl border border-border bg-card p-4 shadow-[var(--shadow-soft)]">
        <QRCodeSVG
          value={whatsappUrl}
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
          <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
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
  );
}
