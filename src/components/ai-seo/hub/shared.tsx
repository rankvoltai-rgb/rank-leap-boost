/**
 * Small pieces the hub's sections share: the section opener, the blue trial
 * button and the matrix's row type. The hub is drawn in the landing page's
 * frame (hairline rails and bands), so everything here builds on it.
 */
import type { ComponentType, ReactNode } from "react";
import { ArrowRight } from "lucide-react";
import { Band, Pill } from "@/components/landing/frame";
import { TRIAL_NOTE } from "@/components/features/FeatureSections";
import type { EngineSlug } from "@/data/ai-seo/engines";
import type { EngineProfile } from "@/data/ai-seo/types";
import { cn } from "@/lib/utils";

/** What the route's loader ships per guide: never a guide's body. */
export interface ProfileRow {
  slug: EngineSlug;
  profile: EngineProfile;
}

/** A section's opening band: pill, title (an h2 with an id), subtitle. */
export function HubHead({
  id,
  icon,
  eyebrow,
  title,
  subtitle,
  align = "center",
}: {
  /** The h2's id, for the section's aria-labelledby. */
  id: string;
  icon: ComponentType<{ className?: string }>;
  eyebrow: string;
  title: ReactNode;
  subtitle?: ReactNode;
  align?: "center" | "left";
}) {
  const left = align === "left";
  return (
    <Band inner={cn("px-6 py-12 sm:px-10 sm:py-16 lg:px-12", left ? "text-left" : "text-center")}>
      <Pill icon={icon}>{eyebrow}</Pill>
      <h2
        id={id}
        className={cn(
          "mt-5 max-w-3xl text-balance font-display text-[1.9rem] font-medium leading-[1.12] tracking-[-0.03em] text-ink sm:text-[2.4rem]",
          !left && "mx-auto",
        )}
      >
        {title}
      </h2>
      {subtitle && (
        <p
          className={cn(
            "mt-4 max-w-2xl text-balance text-[0.98rem] leading-relaxed text-muted-foreground sm:text-[1.05rem]",
            !left && "mx-auto",
          )}
        >
          {subtitle}
        </p>
      )}
    </Band>
  );
}

/** The blue trial button with its note. `onBlue` flips it for the bg-cta band. */
export function TrialButton({
  label = "Start your free trial",
  onBlue = false,
  className,
}: {
  label?: string;
  onBlue?: boolean;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col items-center gap-2.5 sm:items-start", className)}>
      <a
        href="/auth"
        className={cn(
          "group inline-flex h-11 items-center justify-center gap-2 rounded-lg px-5 text-[0.95rem] font-semibold transition-[transform,background-color] duration-200 focus-visible:outline-none",
          onBlue
            ? "bg-white text-cta shadow-[0_1px_2px_rgba(4,24,72,0.2),0_8px_24px_-12px_rgba(4,24,72,0.5)] hover:-translate-y-0.5 hover:bg-white/95 focus-visible:ring-4 focus-visible:ring-white/40"
            : "bg-cta text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.16),0_1px_2px_rgba(16,24,40,0.14)] hover:bg-cta-hover focus-visible:ring-4 focus-visible:ring-cta/25",
        )}
      >
        {label}
        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none" />
      </a>
      <p className={cn("text-[0.8rem]", onBlue ? "text-white/85" : "text-muted-foreground")}>
        {TRIAL_NOTE}
      </p>
    </div>
  );
}
