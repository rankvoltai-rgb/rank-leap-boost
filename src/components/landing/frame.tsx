/**
 * The landing page's frame, after Rankaria: hairline rails down both sides of
 * a 72rem column, a full-width hairline over every band, and blank spacer
 * bands between sections. The hero opens the frame and the last band closes
 * it above the footer.
 *
 * Every landing section is built from these, so the rails line up from the
 * navbar to the footer and the hairlines never double up: a band draws only
 * its top line, and only the closing band draws a bottom one.
 */
import type { ComponentType, ReactNode } from "react";
import { cn } from "@/lib/utils";

/** The hairline colour, for borders drawn outside these components. */
export const LINE = "border-ink/[0.07]";
/** The same hairline as a fill, for `gap-px` cell grids. */
export const LINE_FILL = "bg-ink/[0.07]";
/** The grey panel tone some bands sit on, inside the rails only. */
export const PANEL = "bg-[color-mix(in_oklab,var(--surface)_70%,white)]";

export function Band({
  children,
  id,
  className,
  inner,
  closing = false,
}: {
  children?: ReactNode;
  id?: string;
  /** On the full-width band, outside the rails. */
  className?: string;
  /** On the railed column itself. */
  inner?: string;
  /** Draw the bottom hairline too: the last band before the footer. */
  closing?: boolean;
}) {
  return (
    <div id={id} className={cn("border-t", closing && "border-b", LINE, className)}>
      <div className={cn("relative mx-auto max-w-6xl border-x", LINE, inner)}>{children}</div>
    </div>
  );
}

/** An empty band: the pause between two sections. */
export function Spacer({ closing = false }: { closing?: boolean }) {
  return <Band closing={closing} inner="h-12 sm:h-16" />;
}

/** The blue, bold phrase that closes a section title. */
export function Accent({ children }: { children: ReactNode }) {
  return <span className="font-bold text-brand-blue">{children}</span>;
}

/** A small white label with an icon, above a section title. */
export function Pill({
  icon: Icon,
  children,
  className,
}: {
  icon: ComponentType<{ className?: string }>;
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-lg border border-ink/[0.08] bg-white py-1 pl-1 pr-2.5 text-[0.8rem] font-medium text-ink shadow-[0_1px_2px_rgba(16,24,40,0.04)]",
        className,
      )}
    >
      <span className="flex h-5 w-5 items-center justify-center rounded-md bg-cta-soft text-brand-blue">
        <Icon className="h-3 w-3" />
      </span>
      {children}
    </span>
  );
}

function IconTile({ icon: Icon }: { icon: ComponentType<{ className?: string }> }) {
  return (
    <span className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl border border-ink/[0.08] bg-white text-brand-blue shadow-[0_1px_2px_rgba(16,24,40,0.05)]">
      <Icon className="h-5 w-5" />
    </span>
  );
}

/**
 * A section's opening band: pill, title, subtitle, centred. Rankaria gives
 * every section header a band of its own, ruled off from the content below.
 */
export function SectionHead({
  id,
  icon,
  eyebrow,
  title,
  subtitle,
  children,
}: {
  id?: string;
  icon: ComponentType<{ className?: string }>;
  /** The pill's label. Without one, the icon stands alone as a larger tile. */
  eyebrow?: string;
  title: ReactNode;
  subtitle?: ReactNode;
  /** Anything that sits under the subtitle, inside the header band. */
  children?: ReactNode;
}) {
  return (
    <Band id={id} inner="px-5 py-12 text-center sm:px-8 sm:py-16">
      {eyebrow ? <Pill icon={icon}>{eyebrow}</Pill> : <IconTile icon={icon} />}
      <h2 className="mx-auto mt-5 max-w-3xl text-balance font-display text-[1.9rem] font-medium leading-[1.12] tracking-[-0.03em] text-ink sm:text-[2.4rem]">
        {title}
      </h2>
      {subtitle && (
        <p className="mx-auto mt-4 max-w-2xl text-balance text-[0.98rem] leading-relaxed text-muted-foreground sm:text-[1.05rem]">
          {subtitle}
        </p>
      )}
      {children}
    </Band>
  );
}

/** A small hairline button, Rankaria's "Learn more". */
export const GHOST_BUTTON =
  "inline-flex items-center gap-1.5 rounded-lg border border-ink/[0.1] bg-white px-3 py-1.5 text-[0.8rem] font-medium text-ink shadow-[0_1px_2px_rgba(16,24,40,0.04)] transition-[border-color,background-color] hover:border-ink/[0.18] hover:bg-ink/[0.02]";
