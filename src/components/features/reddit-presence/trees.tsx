/**
 * The page's motif: a Reddit comment tree drawn as a skeleton (avatars,
 * name bars, lines of text, the curved indent guides) with one reply in each
 * tree picked out: yours, joining the conversation. The hero opens on it in
 * ink and the closing band ends on it in white. Static SVG, so the server and
 * client agree, and decorative throughout.
 */
import { cn } from "@/lib/utils";

interface Node {
  depth: number;
  y: number;
  /** Name bar, then the comment's lines. */
  w: [number, number, number?];
  you?: boolean;
}

const TREE_A: Node[] = [
  { depth: 0, y: 34, w: [54, 150, 118] },
  { depth: 1, y: 104, w: [44, 132] },
  { depth: 2, y: 158, w: [40, 104, 70], you: true },
  { depth: 1, y: 232, w: [50, 126, 92] },
  { depth: 0, y: 312, w: [60, 156] },
  { depth: 1, y: 370, w: [46, 120, 84] },
];

const TREE_B: Node[] = [
  { depth: 0, y: 30, w: [48, 140] },
  { depth: 1, y: 88, w: [56, 128, 96] },
  { depth: 1, y: 162, w: [42, 114] },
  { depth: 0, y: 228, w: [58, 150, 110] },
  { depth: 1, y: 298, w: [44, 120, 86], you: true },
  { depth: 2, y: 370, w: [50, 98] },
];

const X0 = 12;
const STEP = 26;

const TONES = {
  ink: {
    line: "stroke-ink/[0.09]",
    lineYou: "stroke-brand-blue/30",
    dot: "fill-ink/[0.07]",
    dotYou: "fill-brand-blue/30",
    bar: "fill-ink/[0.06]",
    barYou: "fill-brand-blue/25",
  },
  white: {
    line: "stroke-white/20",
    lineYou: "stroke-white/55",
    dot: "fill-white/15",
    dotYou: "fill-white/60",
    bar: "fill-white/[0.13]",
    barYou: "fill-white/50",
  },
} as const;

const TREES = { a: TREE_A, b: TREE_B } as const;

export function CommentTree({
  tree,
  tone = "ink",
  className,
}: {
  tree: keyof typeof TREES;
  tone?: keyof typeof TONES;
  className?: string;
}) {
  const nodes = TREES[tree];
  const c = TONES[tone];
  const x = (d: number) => X0 + d * STEP;
  return (
    <svg viewBox="0 0 220 420" className={cn("block", className)} fill="none" aria-hidden>
      {nodes.map((n, i) => {
        if (n.depth === 0) return null;
        // The nearest node above, one level up, is the parent.
        const parent = nodes
          .slice(0, i)
          .reverse()
          .find((p) => p.depth === n.depth - 1);
        if (!parent) return null;
        const px = x(parent.depth);
        const cx = x(n.depth);
        return (
          <path
            key={`l-${i}`}
            d={`M ${px} ${parent.y + 9} V ${n.y - 8} Q ${px} ${n.y} ${cx - 8} ${n.y}`}
            className={n.you ? c.lineYou : c.line}
            strokeWidth="1.25"
          />
        );
      })}
      {nodes.map((n, i) => {
        const cx = x(n.depth);
        const bar = n.you ? c.barYou : c.bar;
        return (
          <g key={`n-${i}`}>
            <circle cx={cx} cy={n.y} r="7" className={n.you ? c.dotYou : c.dot} />
            <rect x={cx + 13} y={n.y - 7} width={n.w[0]} height="5" rx="2.5" className={bar} />
            <rect x={cx + 13} y={n.y + 3} width={n.w[1]} height="5" rx="2.5" className={bar} />
            {n.w[2] && (
              <rect x={cx + 13} y={n.y + 13} width={n.w[2]} height="5" rx="2.5" className={bar} />
            )}
          </g>
        );
      })}
    </svg>
  );
}
