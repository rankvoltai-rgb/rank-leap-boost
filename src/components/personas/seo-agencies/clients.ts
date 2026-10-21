/**
 * The agency page's sample client book: placeholders, not businesses. Each
 * is a niche and a numbered domain ("client-one.com"), so no real company
 * stands in as a customer, with the tint, voice and articles its card shows.
 */
import { useEffect, useRef, useState, type ComponentType } from "react";
import { Building, Headset, Leaf, Smile, Thermometer } from "lucide-react";

/* The landing's feature-row tints, one per client, so the book reads as
   several accounts rather than one repeated. */
export const TINTS = {
  orange: { panel: "#fdefe7", tile: "#fbdccb", ink: "#ea580c" },
  green: { panel: "#e9f6ee", tile: "#d6efdf", ink: "#16a34a" },
  violet: { panel: "#f1eefd", tile: "#e3ddfb", ink: "#7c3aed" },
  amber: { panel: "#fdf4e4", tile: "#fbe7c4", ink: "#d97706" },
  rose: { panel: "#fdedf1", tile: "#fbd9e2", ink: "#e11d48" },
  blue: { panel: "#eaf2fe", tile: "#dbe8fd", ink: "#1877f2" },
} as const;
export type Tint = keyof typeof TINTS;

export interface Client {
  domain: string;
  /** What the client does: the only name a placeholder gets. */
  niche: string;
  icon: ComponentType<{ className?: string }>;
  tint: Tint;
  voice: string;
  line: string;
  /** Published so far this cycle, before the card's turn. */
  published: number;
  /** In review (flips to published on the card's turn), published, scheduled. */
  articles: [string, string, string];
}

export const CLIENTS: Client[] = [
  {
    domain: "client-one.com",
    niche: "HVAC contractor",
    icon: Thermometer,
    tint: "orange",
    voice: "Plain-spoken",
    line: "Change the filter every 90 days. It's the cheapest repair you'll ever make.",
    published: 18,
    articles: [
      "How often should you service an AC?",
      "Heat pump or furnace for a cold winter?",
      "Why is my AC blowing warm air?",
    ],
  },
  {
    domain: "client-two.com",
    niche: "Organic grocer",
    icon: Leaf,
    tint: "green",
    voice: "Warm",
    line: "Good produce starts long before market day, with soil you can smell.",
    published: 21,
    articles: [
      "How to store leafy greens so they last",
      "What does “regenerative” actually mean?",
      "What's in season this month?",
    ],
  },
  {
    domain: "client-three.com",
    niche: "Help-desk software",
    icon: Headset,
    tint: "violet",
    voice: "Technical",
    line: "Route by intent, not by keyword. Your queue will thank you by Friday.",
    published: 15,
    articles: [
      "Ticket routing rules that scale",
      "SLA vs SLO: what support teams mean",
      "How to write a macro customers don't hate",
    ],
  },
  {
    domain: "client-four.com",
    niche: "Facilities firm",
    icon: Building,
    tint: "amber",
    voice: "Formal",
    line: "A planned maintenance schedule reduces reactive call-outs across a portfolio.",
    published: 12,
    articles: [
      "Planned vs reactive maintenance",
      "What a facilities audit should cover",
      "How to budget for building maintenance",
    ],
  },
  {
    domain: "client-five.com",
    niche: "Dental clinic",
    icon: Smile,
    tint: "rose",
    voice: "Reassuring",
    line: "Most people put off a check-up because of one bad visit. Let's replace it.",
    published: 24,
    articles: [
      "How often should you see a dentist?",
      "Is whitening safe for sensitive teeth?",
      "What happens at a first cleaning?",
    ],
  },
];

/**
 * True while at least about half the element is on screen. Turns back off
 * when it leaves, so the deck idles (and starts over) out of sight.
 */
export function useHalfOnScreen<T extends Element>() {
  const ref = useRef<T>(null);
  const [on, setOn] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setOn(e.intersectionRatio >= 0.45), {
      threshold: [0, 0.45, 0.6],
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return [ref, on] as const;
}
