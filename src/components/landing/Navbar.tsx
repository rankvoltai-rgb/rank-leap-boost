import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Logo } from "./shared";

const LINKS = [
  { label: "What's Inside", href: "#whats-inside" },
  { label: "Success Stories", href: "#success-stories" },
  { label: "Examples", href: "#examples" },
  { label: "Pricing", href: "#pricing" },
  { label: "FAQ", href: "#faq" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-md">
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
        <a href="#top" className="shrink-0">
          <Logo />
        </a>
        <div className="hidden items-center gap-7 md:flex">
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
            href="#pricing"
            className="hidden rounded-xl border border-border bg-card px-4 py-2 text-sm font-semibold text-ink shadow-sm transition-colors hover:bg-secondary md:inline-flex"
          >
            Sign In
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
              href="#pricing"
              onClick={() => setOpen(false)}
              className="mt-2 rounded-xl bg-ink px-4 py-2.5 text-center text-sm font-semibold text-background"
            >
              Sign In
            </a>
          </div>
        </div>
      )}
    </header>
  );
}