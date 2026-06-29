import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export function MissingShippingDetailsDialog({ open, onOpenChange }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm rounded-2xl border border-border/80 bg-background p-6 shadow-lg">
        <DialogHeader className="text-center">
          <DialogTitle className="text-2xl font-display font-bold text-primary">
            Complete your shipping details
          </DialogTitle>
          <DialogDescription className="mt-2 text-sm text-muted-foreground">
            Please enter your name, address, and pincode before checking out.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="mt-2">
          <Button
            type="button"
            size="lg"
            className="w-full"
            onClick={() => onOpenChange(false)}
          >
            Okay, I&apos;ll fill it in
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
