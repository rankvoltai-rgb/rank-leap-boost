/**
 * Onboarding's left column: the landing page's citation badge, then three
 * customer quotes. Static on purpose — it reassures while the user works and
 * never competes with the step in the middle.
 */
import { Avatar, Stars } from "@/components/landing/shared";
import { ProofBadges } from "@/components/landing/proof-badges";
import { TESTIMONIALS } from "@/components/landing/Testimonials";

/** Picked by name so reordering the landing page's quotes doesn't change these. */
const QUOTED = ["Priya Raman", "Sofia Marin", "Lena Brandt"];

export function ProofColumn() {
  const quotes = QUOTED.map((name) => TESTIMONIALS.find((t) => t.n === name)).filter(
    (t): t is (typeof TESTIMONIALS)[number] => Boolean(t),
  );

  return (
    <div>
      <ProofBadges tone="onLight" badges={["cited"]} className="lg:justify-center" />

      <ul className="mt-7 grid gap-6 border-t border-border pt-7 sm:grid-cols-2 lg:grid-cols-1">
        {quotes.map((t) => (
          <li key={t.n}>
            <figure>
              <Stars className="[&_svg]:h-3.5 [&_svg]:w-3.5" />
              <blockquote className="mt-2.5 text-sm leading-relaxed text-ink">
                &ldquo;{t.q}&rdquo;
              </blockquote>
              <figcaption className="mt-3 flex items-center gap-2.5">
                <Avatar name={t.n} src={t.a} className="h-8 w-8" />
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-ink">{t.n}</p>
                  <p className="text-xs text-muted-foreground">
                    {t.r}
                    {t.c ? ` · ${t.c}` : ""}
                  </p>
                </div>
              </figcaption>
            </figure>
          </li>
        ))}
      </ul>
    </div>
  );
}
