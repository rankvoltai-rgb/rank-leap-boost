/**
 * One customer quote at the foot of the onboarding rail. Quiet on purpose: it
 * reassures while the user works and never competes with the step. The earlier
 * layout gave three full testimonials their own column.
 */
import { Avatar, Stars } from "@/components/landing/shared";
import { TESTIMONIALS } from "@/components/landing/Testimonials";

/** Picked by name so reordering the landing page's quotes doesn't change it. */
const QUOTED = "Priya Raman";

export function ProofQuote() {
  const t = TESTIMONIALS.find((q) => q.n === QUOTED);
  if (!t) return null;
  return (
    <figure className="px-1 pt-1">
      <Stars className="[&_svg]:h-3 [&_svg]:w-3" />
      <blockquote className="mt-2 text-[0.8rem] leading-relaxed text-muted-foreground">
        &ldquo;{t.q}&rdquo;
      </blockquote>
      <figcaption className="mt-2.5 flex items-center gap-2">
        <Avatar name={t.n} src={t.a} className="h-6 w-6" />
        <span className="text-xs font-medium text-ink">
          {t.n}
          <span className="font-normal text-muted-foreground">
            {" "}
            · {t.r}, {t.c}
          </span>
        </span>
      </figcaption>
    </figure>
  );
}
