import { Instagram, MessageCircle } from "lucide-react";

import logo from "@/assets/images/pahad-se-logo.webp";
import { INSTAGRAM_URL, WHATSAPP_URL } from "@/lib/contact";
import { SITE_NAME } from "@/lib/site";

export function Footer() {
  return (
    <footer className="border-t border-border/60 bg-card">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-5 py-2 text-center">
        <img src={logo} alt="Pahad Se logo" className="h-20 w-auto" />
        <p className="text-sm italic text-muted-foreground">"Pahadon ka asli swaad"</p>
        <div className="flex items-center gap-4">
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="WhatsApp"
            className="text-primary hover:text-gold"
          >
            <MessageCircle className="size-5" />
          </a>
          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
            className="text-primary hover:text-gold"
          >
            <Instagram className="size-5" />
          </a>
        </div>
        <p className="text-xs text-muted-foreground">
          Copyright {new Date().getFullYear()} {SITE_NAME} | +91 93103 09829
        </p>
      </div>
    </footer>
  );
}
