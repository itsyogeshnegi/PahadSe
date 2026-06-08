import { Instagram, MessageCircle } from "lucide-react";

import logo from "@/assets/images/pahad-se-logo.webp";
import { ContactDialog, INSTAGRAM_URL } from "@/components/ContactDialog";
import { Button } from "@/components/ui/button";

export function Header() {
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
