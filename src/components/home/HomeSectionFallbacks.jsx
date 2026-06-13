function PlaceholderBlock({ className }) {
  return <div className={`animate-pulse rounded-3xl bg-secondary/70 ${className}`} />;
}

export function ProductsSectionFallback() {
  return (
    <section id="products" className="mx-auto max-w-6xl px-5 py-20">
      <div className="mx-auto max-w-2xl text-center">
        <PlaceholderBlock className="mx-auto h-12 w-80 max-w-full" />
        <PlaceholderBlock className="mx-auto mt-4 h-5 w-96 max-w-full" />
      </div>
      <div className="mt-14 grid gap-8 md:grid-cols-2">
        {[0, 1].map((index) => (
          <div
            key={index}
            className="overflow-hidden rounded-3xl border border-border bg-card p-0 shadow-[var(--shadow-soft)]"
          >
            <PlaceholderBlock className="aspect-[4/3] w-full rounded-none" />
            <div className="space-y-4 p-7">
              <div className="flex gap-2">
                <PlaceholderBlock className="h-7 w-20 rounded-full" />
                <PlaceholderBlock className="h-7 w-20 rounded-full" />
                <PlaceholderBlock className="h-7 w-24 rounded-full" />
              </div>
              <PlaceholderBlock className="h-10 w-56 max-w-full" />
              <PlaceholderBlock className="h-5 w-full" />
              <PlaceholderBlock className="h-5 w-5/6" />
              <PlaceholderBlock className="mt-6 h-10 w-36" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export function StorySectionFallback() {
  return (
    <section id="story" className="bg-card">
      <div className="mx-auto grid max-w-6xl items-center gap-10 px-5 py-20 md:grid-cols-2">
        <PlaceholderBlock className="aspect-[4/3] w-full" />
        <div className="space-y-5">
          <PlaceholderBlock className="h-12 w-80 max-w-full" />
          <PlaceholderBlock className="h-5 w-full" />
          <PlaceholderBlock className="h-5 w-full" />
          <PlaceholderBlock className="h-5 w-4/5" />
          <div className="space-y-3 pt-3">
            <PlaceholderBlock className="h-5 w-52 max-w-full" />
            <PlaceholderBlock className="h-5 w-56 max-w-full" />
            <PlaceholderBlock className="h-5 w-60 max-w-full" />
          </div>
        </div>
      </div>
    </section>
  );
}

export function ContactSectionFallback() {
  return (
    <section id="contact" className="mx-auto max-w-6xl px-5 py-20">
      <div className="rounded-3xl border border-border bg-primary px-6 py-14 text-center shadow-[var(--shadow-soft)]">
        <PlaceholderBlock className="mx-auto h-12 w-72 max-w-full bg-primary-foreground/25" />
        <PlaceholderBlock className="mx-auto mt-4 h-5 w-80 max-w-full bg-primary-foreground/20" />
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <PlaceholderBlock className="h-11 w-48 bg-primary-foreground/25" />
          <PlaceholderBlock className="h-11 w-44 bg-primary-foreground/20" />
        </div>
      </div>
    </section>
  );
}

export function TestimonialsSectionFallback() {
  return (
    <section className="bg-card px-5 py-20">
      <div className="mx-auto max-w-6xl rounded-[2rem] border border-border/60 bg-[#224d2f] px-6 py-14 shadow-[var(--shadow-soft)] md:px-10">
        <div className="mx-auto max-w-3xl text-center">
          <PlaceholderBlock className="mx-auto h-4 w-36 bg-primary-foreground/20" />
          <PlaceholderBlock className="mx-auto mt-4 h-12 w-96 max-w-full bg-primary-foreground/25" />
          <PlaceholderBlock className="mx-auto mt-4 h-5 w-[32rem] max-w-full bg-primary-foreground/15" />
        </div>
        <div className="mt-12 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {[0, 1, 2].map((index) => (
            <div
              key={index}
              className="rounded-[1.75rem] border border-primary-foreground/10 bg-primary-foreground/6 p-8"
            >
              <PlaceholderBlock className="h-10 w-10 rounded-full bg-gold/50" />
              <PlaceholderBlock className="mt-6 h-5 w-full bg-primary-foreground/15" />
              <PlaceholderBlock className="mt-3 h-5 w-full bg-primary-foreground/15" />
              <PlaceholderBlock className="mt-3 h-5 w-5/6 bg-primary-foreground/15" />
              <PlaceholderBlock className="mt-12 h-5 w-36 bg-primary-foreground/20" />
              <PlaceholderBlock className="mt-3 h-4 w-28 bg-primary-foreground/15" />
              <PlaceholderBlock className="mt-4 h-7 w-36 rounded-full bg-primary-foreground/15" />
            </div>
          ))}
        </div>
        <div className="mt-10 flex items-center justify-center gap-2">
          <PlaceholderBlock className="h-2.5 w-8 rounded-full bg-gold/60" />
          <PlaceholderBlock className="h-2.5 w-2.5 rounded-full bg-primary-foreground/20" />
        </div>
      </div>
    </section>
  );
}

export function FooterFallback() {
  return (
    <footer className="border-t border-border/60 bg-card">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-5 py-6 text-center">
        <PlaceholderBlock className="h-20 w-20 rounded-full" />
        <PlaceholderBlock className="h-4 w-44 max-w-full" />
        <div className="flex gap-4">
          <PlaceholderBlock className="h-6 w-6 rounded-full" />
          <PlaceholderBlock className="h-6 w-6 rounded-full" />
        </div>
        <PlaceholderBlock className="h-4 w-56 max-w-full" />
      </div>
    </footer>
  );
}
