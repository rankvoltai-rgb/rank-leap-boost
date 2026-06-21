import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Logo } from "./shared";

const LINKS = [
  { label: "How It Works", href: "#how-it-works" },
  { label: "Proof", href: "#proof" },
  { label: "Sample Articles", href: "#examples" },
  { label: "Pricing", href: "#pricing" },
  { label: "FAQ", href: "#faq" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-md">
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
        <div className="flex shrink-0 items-center gap-3">
          <a href="#top">
            <Logo />
          </a>
          <span className="hidden rounded-full border border-border bg-surface/60 px-2.5 py-0.5 text-[0.7rem] font-medium text-muted-foreground lg:inline-flex">
            AI-search growth engine
          </span>
        </div>
        <div className="hidden items-center gap-6 md:flex lg:gap-7">
          {LINKS.map((l) => (
            <a
              key={l.label}
              href={l.href}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-ink"
            >
              {l.label}
            </a>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <a
            href="/auth"
            className="hidden rounded-xl border border-border bg-card px-4 py-2 text-sm font-semibold text-ink shadow-sm transition-colors hover:bg-secondary md:inline-flex"
          >
            Sign In
          </a>
          <a
            href="/auth"
            className="hidden rounded-xl bg-ink px-4 py-2 text-sm font-semibold text-background shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md md:inline-flex"
          >
            Get Started Free
          </a>
          <button
            onClick={() => setOpen((v) => !v)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-card text-ink md:hidden"
            aria-label="Toggle menu"
          >
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </nav>
      {open && (
        <div className="border-t border-border bg-background px-5 py-4 md:hidden">
          <div className="flex flex-col gap-1">
            {LINKS.map((l) => (
              <a
                key={l.label}
                href={l.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-2 py-2.5 text-sm font-medium text-muted-foreground hover:bg-secondary hover:text-ink"
              >
                {l.label}
              </a>
            ))}
            <a
              href="/auth"
              onClick={() => setOpen(false)}
              className="mt-2 rounded-xl bg-ink px-4 py-2.5 text-center text-sm font-semibold text-background"
            >
              Get Started Free
            </a>
            <a
              href="/auth"
              onClick={() => setOpen(false)}
              className="rounded-xl border border-border bg-card px-4 py-2.5 text-center text-sm font-semibold text-ink"
            >
              Sign In
            </a>
          </div>
        </div>
      )}
    </header>
  );
}