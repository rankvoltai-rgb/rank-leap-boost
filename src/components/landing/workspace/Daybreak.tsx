/**
 * The stage the workspace window stands on: Profound's dark hero turned to
 * daylight. The white page turns, down the section, into a morning sky and
 * then into brand blue (the footer's), with the light rising from behind the
 * window. A fine grain over it keeps the gradient from banding and gives it
 * the tooth of print rather than a screen.
 *
 * The page's rails run on through it, grey on the white and white on the
 * blue, crossing over where the sky turns.
 */
import { cn } from "@/lib/utils";
import { LINE } from "../frame";

const svgUrl = (svg: string) => `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;

/* Fractal noise as alpha only, so the blend mode decides how it reads. */
const GRAIN = svgUrl(
  `<svg xmlns='http://www.w3.org/2000/svg' width='180' height='180'><filter id='g'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.5 0'/></filter><rect width='100%' height='100%' filter='url(#g)'/></svg>`,
);

const RAIL = "absolute inset-y-0 left-1/2 w-full max-w-6xl -translate-x-1/2 border-x";

export function Daybreak() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0">
      <div className="absolute inset-0 bg-[linear-gradient(180deg,#ffffff_0%,#f3f8ff_14%,#d9e9fe_34%,#9cc5fa_55%,#4a94f5_76%,var(--brand-blue)_90%,color-mix(in_oklab,var(--brand-blue)_82%,var(--brand-blue-deep))_100%)]" />
      {/* The sun, behind the window, a little below its middle. */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_48%_36%_at_50%_58%,rgba(255,255,255,0.62),rgba(255,255,255,0.18)_45%,transparent_72%)]" />
      <div
        className="absolute inset-0 opacity-[0.22] mix-blend-soft-light"
        style={{ backgroundImage: GRAIN, backgroundSize: "180px 180px" }}
      />
      {/* The rails: grey fading out as the white does, white fading in with the blue. */}
      <div
        className={cn(RAIL, LINE, "[mask-image:linear-gradient(180deg,#000_30%,transparent_62%)]")}
      />
      <div
        className={cn(
          RAIL,
          "border-white/[0.22] [mask-image:linear-gradient(180deg,transparent_50%,#000_82%)]",
        )}
      />
    </div>
  );
}
