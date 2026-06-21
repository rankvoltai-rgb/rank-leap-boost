import { Logo } from "./shared";

const COLS = [
  { title: "Product", links: ["How It Works", "Sample Articles", "Pricing", "Proof"] },
  { title: "Features", links: ["Growth Automation", "Citation-Ready Writer", "Answer-Space Research", "Backlinks"] },
  { title: "Company", links: ["About", "Blog", "Careers", "Contact"] },
  { title: "Legal", links: ["Privacy", "Terms", "Refunds", "Affiliates"] },
];

export function Footer() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="mx-auto max-w-6xl px-5 py-14">
        <div className="grid gap-10 md:grid-cols-[1.5fr_repeat(4,1fr)]">
          <div>
            <Logo />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
              The AI search growth engine for founders. Daily published articles engineered
              to get you cited by AI and ranked on Google.
            </p>
          </div>
          {COLS.map((c) => (
            <div key={c.title}>
              <p className="text-sm font-semibold text-ink">{c.title}</p>
              <ul className="mt-3 space-y-2">
                {c.links.map((l) => (
                  <li key={l}>
                    <a href="#top" className="text-sm text-muted-foreground transition-colors hover:text-ink">
                      {l}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-border pt-6 sm:flex-row">
          <p className="text-xs text-muted-foreground">© 2026 Rankvolt. All rights reserved.</p>
          <p className="text-xs text-muted-foreground">Built to be the answer on Google &amp; AI search.</p>
        </div>
      </div>
    </footer>
  );
}