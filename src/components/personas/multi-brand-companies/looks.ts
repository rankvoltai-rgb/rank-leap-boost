/**
 * The non-component pieces of /use-cases/multi-brand-companies: the section
 * title style, each sample brand's look (in the order of
 * the data file), and the hook that runs a scene only while about half of it
 * is on screen. Kept apart from the components so fast refresh stays clean.
 */
import { useEffect, useRef, useState } from "react";
import { Bone, CalendarClock, Flame, ReceiptText, type LucideIcon } from "lucide-react";
import { multiBrand } from "@/data/persona-pages/multi-brand-companies";

/** Section titles, as the landing sets them. */
export const H2 =
  "font-display text-[1.9rem] font-medium leading-[1.12] tracking-[-0.03em] text-ink sm:text-[2.4rem]";

/* ---------- The sample brands' looks, in the order of the data file ---------- */

export interface BrandLook {
  icon: LucideIcon;
  /** The tile behind the icon. */
  tile: string;
  /** The icon and accent ink. */
  ink: string;
  /** A wash for panels that belong to the brand. */
  wash: string;
}

/* Four tints from the landing's feature rows, one per brand, so the account
   reads as four businesses rather than one repeated. */
export const LOOKS: BrandLook[] = [
  { icon: Flame, tile: "#fbe7c4", ink: "#c2650a", wash: "#fdf6ea" },
  { icon: ReceiptText, tile: "#e3ddfb", ink: "#6d3ad6", wash: "#f5f2fe" },
  { icon: Bone, tile: "#fbd9e2", ink: "#d4234f", wash: "#fdf1f4" },
  { icon: CalendarClock, tile: "#d4f0ea", ink: "#0f8a74", wash: "#eef9f6" },
];

export const BRANDS = multiBrand.account.brands;

/* ---------- Motion ---------- */

/**
 * True while about half the element is on screen. It turns off again when
 * the element leaves, so a scene idles out of sight. Starts false, so the
 * server and the first client render agree.
 */
export function useHalfOnScreen<T extends Element>() {
  const ref = useRef<T>(null);
  const [on, setOn] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(([e]) => setOn(e.intersectionRatio >= 0.45), {
      threshold: [0, 0.45, 0.7],
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return [ref, on] as const;
}
