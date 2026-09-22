import { useMemo, useState } from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  CopyButton,
  EmptyState,
  Field,
  Pane,
  ScoreRing,
  Stat,
  StatGrid,
  TextInput,
  Workbench,
  useCopied,
} from "./shared";

interface Prompt {
  stage: string;
  text: string;
}

function generate(
  brand: string,
  category: string,
  audience: string,
  competitor: string,
  location: string,
): Prompt[] {
  const b = brand.trim();
  const c = category.trim();
  const a = audience.trim();
  const k = competitor.trim();
  const loc = location.trim();
  if (!b || !c) return [];
  const forA = a ? ` for ${a}` : "";
  const inLoc = loc ? ` in ${loc}` : "";
  const out: Prompt[] = [];
  const add = (stage: string, ...texts: string[]) =>
    texts.forEach((text) => out.push({ stage, text }));

  add(
    "Discovery",
    `What are the best ${c}${forA}?`,
    `Recommend a ${c}${forA}${inLoc}.`,
    `Top 5 ${c} in 2026`,
    `Which ${c} do experts recommend${forA}?`,
    `What ${c} should a ${a || "small team"} use?`,
    `Best ${c} for beginners`,
  );
  add(
    "Problem-led",
    `I need help with ${c.replace(/\b(tool|tools|software|platform|service|agency)s?\b/gi, "").trim() || c}. What should I use?`,
    `How do I choose a ${c}?`,
    `What's the easiest ${c} to get started with?`,
    `Is there a ${c} that doesn't require technical skills?`,
    `Cheapest ${c} that's still good`,
    `${c}: what features matter most?`,
  );
  add(
    "Evaluation",
    `Is ${b} any good?`,
    `What do people say about ${b}?`,
    `${b} reviews`,
    `${b} pricing — is it worth it?`,
    `What are the pros and cons of ${b}?`,
    `Who is ${b} best for?`,
  );
  if (k) {
    add(
      "Comparison",
      `${b} vs ${k}: which is better?`,
      `Compare ${b} and ${k}${forA}.`,
      `Is ${b} better than ${k}?`,
      `${k} vs ${b} pricing`,
      `Should I switch from ${k} to ${b}?`,
      `${b} or ${k} for ${a || "a growing company"}?`,
    );
    add(
      "Alternatives",
      `Best alternatives to ${k}`,
      `${k} alternatives that are cheaper`,
      `What can I use instead of ${k}?`,
      `${k} competitors`,
      `Tools like ${k} but simpler`,
      `Who competes with ${k} in ${c}?`,
    );
  } else {
    add(
      "Alternatives",
      `Best alternatives to ${b}`,
      `What can I use instead of ${b}?`,
      `${b} competitors`,
      `Tools like ${b}`,
      `Cheaper alternatives to ${b}`,
      `Who competes with ${b} in ${c}?`,
    );
    add(
      "Comparison",
      `How does ${b} compare to other ${c}?`,
      `${b} vs the leading ${c}`,
      `Is ${b} the best ${c}${forA}?`,
      `What makes ${b} different from other ${c}?`,
      `${b} compared to free ${c}`,
      `Rank the top ${c} including ${b}`,
    );
  }
  return out.slice(0, 30);
}

export function AiVisibilityPromptKit() {
  const [brand, setBrand] = useState("");
  const [category, setCategory] = useState("");
  const [audience, setAudience] = useState("");
  const [competitor, setCompetitor] = useState("");
  const [location, setLocation] = useState("");
  const [hits, setHits] = useState<Record<string, boolean>>({});
  const [copied, copy] = useCopied();

  const prompts = useMemo(
    () => generate(brand, category, audience, competitor, location),
    [brand, category, audience, competitor, location],
  );
  const stages = useMemo(() => [...new Set(prompts.map((p) => p.stage))], [prompts]);
  const mentioned = prompts.filter((p) => hits[p.text]).length;
  const sov = prompts.length ? Math.round((mentioned / prompts.length) * 100) : 0;
  const all = prompts.map((p) => p.text).join("\n");

  return (
    <Workbench
      sticky={false}
      input={
        <Pane title="Your brand">
          <Field label="Brand name" required>
            <TextInput
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
              placeholder="Rankbox"
            />
          </Field>
          <Field label="What you sell" required hint="the category">
            <TextInput
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="AI SEO software"
            />
          </Field>
          <Field label="Who it's for" hint="Optional">
            <TextInput
              value={audience}
              onChange={(e) => setAudience(e.target.value)}
              placeholder="startups and small agencies"
            />
          </Field>
          <Field label="Main competitor" hint="Optional, unlocks comparison prompts">
            <TextInput
              value={competitor}
              onChange={(e) => setCompetitor(e.target.value)}
              placeholder="Semrush"
            />
          </Field>
          <Field label="Location" hint="Optional, for local businesses">
            <TextInput
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Austin, TX"
            />
          </Field>
          <p className="text-xs leading-relaxed text-muted-foreground">
            Paste each prompt into ChatGPT, Perplexity and Gemini. Tick the ones that mention you.
            Run each two or three times — answers vary.
          </p>
        </Pane>
      }
      output={
        !prompts.length ? (
          <EmptyState
            title="Enter a brand and category"
            body="You'll get 30 prompts across discovery, evaluation, comparison and alternatives, with a scorecard."
          />
        ) : (
          <>
            <Pane title="Scorecard" actions={<CopyButton value={all} label="Copy all prompts" />}>
              <ScoreRing
                score={sov}
                label="Share of voice"
                caption={`${mentioned} of ${prompts.length} prompts mention ${brand.trim()}. Below 30% means buyers rarely hear your name.`}
              />
              <StatGrid cols={stages.length > 4 ? 4 : 3}>
                {stages.map((s) => {
                  const ps = prompts.filter((p) => p.stage === s);
                  const n = ps.filter((p) => hits[p.text]).length;
                  return <Stat key={s} value={`${n}/${ps.length}`} label={s} />;
                })}
              </StatGrid>
            </Pane>
            {stages.map((s) => (
              <Pane key={s} title={s} flush>
                <ul className="divide-y divide-border">
                  {prompts
                    .filter((p) => p.stage === s)
                    .map((p) => {
                      const on = !!hits[p.text];
                      return (
                        <li key={p.text} className="flex items-center gap-3 px-5 py-2.5">
                          <button
                            type="button"
                            role="checkbox"
                            aria-checked={on}
                            aria-label="Mentioned"
                            onClick={() => setHits((h) => ({ ...h, [p.text]: !on }))}
                            className={cn(
                              "flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition-colors",
                              on
                                ? "border-success bg-success text-white"
                                : "border-border bg-background hover:border-ink/40",
                            )}
                          >
                            {on && <Check className="h-3.5 w-3.5" strokeWidth={3} />}
                          </button>
                          <button
                            type="button"
                            onClick={() => copy(p.text, p.text)}
                            title="Click to copy"
                            className={cn(
                              "min-w-0 flex-1 text-left text-sm leading-snug transition-colors hover:text-volt",
                              on ? "text-ink" : "text-ink/80",
                            )}
                          >
                            {copied === p.text ? (
                              <span className="text-success">Copied</span>
                            ) : (
                              p.text
                            )}
                          </button>
                        </li>
                      );
                    })}
                </ul>
              </Pane>
            ))}
          </>
        )
      }
    />
  );
}
