import { useMemo, useState } from "react";
import { headingsFromHtml, headingsFromMarkdown, type Heading } from "@/lib/html-signals";
import { cn } from "@/lib/utils";
import {
  CheckList,
  EmptyState,
  Pane,
  Stat,
  StatGrid,
  TextArea,
  Workbench,
  type CheckItem,
} from "./shared";

const QUESTION = /\?$|^(how|what|why|when|where|which|who|can|should|does|do|is|are)\b/i;

const LEVEL_TONE = [
  "",
  "bg-ink text-background",
  "bg-volt/15 text-volt",
  "bg-secondary text-ink",
  "bg-secondary text-ink/70",
  "bg-secondary text-ink/60",
  "bg-secondary text-ink/50",
];

export function HeadingStructureChecker() {
  const [raw, setRaw] = useState("");

  const r = useMemo(() => {
    if (!raw.trim()) return null;
    const isHtml = /<h[1-6]\b/i.test(raw);
    const hs: Heading[] = isHtml ? headingsFromHtml(raw) : headingsFromMarkdown(raw);
    const checks: CheckItem[] = [];
    const h1 = hs.filter((h) => h.level === 1);
    if (!hs.length)
      return {
        hs,
        checks: [
          {
            id: "none",
            status: "fail" as const,
            label: "No headings found",
            fix: "Paste HTML with <h1>–<h6> tags or Markdown with # headings.",
          },
        ],
        counts: [],
      };

    checks.push(
      h1.length === 1
        ? { id: "h1", status: "pass", label: "Exactly one H1" }
        : h1.length === 0
          ? {
              id: "h1",
              status: "fail",
              label: "No H1",
              fix: "Give the page one H1 that states what it is. Every extractor treats it as the title.",
            }
          : {
              id: "h1",
              status: "fail",
              label: `${h1.length} H1 tags`,
              fix: "Keep one H1; demote the rest to H2.",
            },
    );
    if (hs[0] && hs[0].level !== 1)
      checks.push({
        id: "first",
        status: "warn",
        label: `First heading is an H${hs[0].level}`,
        fix: "The H1 should come before any other heading.",
      });

    const skips: string[] = [];
    for (let i = 1; i < hs.length; i += 1) {
      if (hs[i].level > hs[i - 1].level + 1)
        skips.push(`H${hs[i - 1].level} → H${hs[i].level} at “${hs[i].text.slice(0, 40)}”`);
    }
    checks.push(
      skips.length
        ? {
            id: "skip",
            status: "warn",
            label: `${skips.length} skipped level${skips.length === 1 ? "" : "s"}`,
            detail: skips.slice(0, 3).join("; "),
            fix: "Step down one level at a time so the outline nests cleanly.",
          }
        : { id: "skip", status: "pass", label: "No skipped levels" },
    );

    const empty = hs.filter((h) => !h.text.trim()).length;
    if (empty)
      checks.push({
        id: "empty",
        status: "fail",
        label: `${empty} empty heading${empty === 1 ? "" : "s"}`,
        fix: "Remove empty heading tags or give them text.",
      });

    const texts = hs.map((h) => h.text.trim().toLowerCase());
    const dupes = [...new Set(texts.filter((t, i) => t && texts.indexOf(t) !== i))];
    if (dupes.length)
      checks.push({
        id: "dupes",
        status: "warn",
        label: `Duplicate heading text: ${dupes
          .slice(0, 3)
          .map((d) => `“${d}”`)
          .join(", ")}`,
        fix: "Make each heading distinct so a passage can be identified by it.",
      });

    const long = hs.filter((h) => h.text.length > 70).length;
    if (long)
      checks.push({
        id: "long",
        status: "warn",
        label: `${long} heading${long === 1 ? "" : "s"} over 70 characters`,
        fix: "Shorten. Headings are read as labels, not sentences.",
      });

    const h2 = hs.filter((h) => h.level === 2);
    const q = h2.filter((h) => QUESTION.test(h.text.trim())).length;
    if (h2.length >= 2) {
      checks.push({
        id: "q",
        status: q / h2.length >= 0.3 ? "pass" : "info",
        label: `${q} of ${h2.length} H2s are phrased as questions`,
        fix: "Turn the H2s that answer something into the question a reader would ask. That's the passage an engine lifts.",
      });
    }
    if (hs.length < 3)
      checks.push({
        id: "few",
        status: "info",
        label: "Fewer than three headings",
        detail: "Long pages without sub-headings are hard to extract from.",
      });

    const counts = [1, 2, 3, 4, 5, 6]
      .map((l) => ({ l, n: hs.filter((h) => h.level === l).length }))
      .filter((c) => c.n);
    return { hs, checks, counts };
  }, [raw]);

  return (
    <Workbench
      sticky={false}
      input={
        <Pane title="Page source or Markdown">
          <TextArea
            value={raw}
            onChange={(e) => setRaw(e.target.value)}
            placeholder={
              "<h1>AI crawlers</h1>\n<h2>What are the main AI crawlers?</h2>\n<h3>OpenAI</h3>\n…\n\nor\n\n# AI crawlers\n## What are the main AI crawlers?"
            }
            className="min-h-[26rem]"
            mono
            spellCheck={false}
          />
        </Pane>
      }
      output={
        !r ? (
          <EmptyState
            title="Paste HTML or Markdown"
            body="You'll see the heading outline as a tree, with duplicate H1s, skipped levels and empty headings flagged."
          />
        ) : (
          <>
            {r.counts.length > 0 && (
              <StatGrid cols={r.counts.length > 3 ? 4 : 3}>
                {r.counts.map((c) => (
                  <Stat key={c.l} value={c.n} label={`H${c.l}`} />
                ))}
              </StatGrid>
            )}
            <Pane title="Checks" flush>
              <CheckList items={r.checks} />
            </Pane>
            {r.hs.length > 0 && (
              <Pane title="Outline" flush>
                <ol className="py-2">
                  {r.hs.map((h, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-2.5 px-5 py-1.5"
                      style={{ paddingLeft: `${1.25 + (h.level - 1) * 1.25}rem` }}
                    >
                      <span
                        className={cn(
                          "mt-0.5 shrink-0 rounded px-1.5 py-0.5 font-mono text-[0.65rem] font-bold",
                          LEVEL_TONE[h.level],
                        )}
                      >
                        H{h.level}
                      </span>
                      <span
                        className={cn(
                          "text-sm leading-snug",
                          h.level === 1
                            ? "font-semibold text-ink"
                            : h.level === 2
                              ? "font-medium text-ink"
                              : "text-ink/80",
                          !h.text.trim() && "italic text-destructive",
                        )}
                      >
                        {h.text.trim() || "(empty)"}
                      </span>
                    </li>
                  ))}
                </ol>
              </Pane>
            )}
          </>
        )
      }
    />
  );
}
