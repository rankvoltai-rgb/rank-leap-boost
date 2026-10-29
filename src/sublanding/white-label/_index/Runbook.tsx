import { useEffect, useRef, useState } from "react";
import { Check, ClipboardCopy, TriangleAlert } from "lucide-react";
import { cn } from "@/lib/utils";
import { RUNBOOK, type Owner, type RunStep } from "./content";
import { Go } from "./Go";
import { runbookText } from "./runbook-text";
import { SectionHead } from "./SectionHead";
import { StudioButton } from "./StudioButton";
import { CARD, FOCUS, LIFT, SECTION, TEXT_LINK, WRAP } from "./ui";

type CopyState = "idle" | "done" | "failed";

const OWNER_STYLE: Record<Owner, string> = {
  you: "border-cta/30 bg-cta-soft text-cta",
  rankbox: "border-border bg-surface text-ink/75",
  developer: "border-border bg-card text-ink/75",
  client: "border-border bg-card text-ink/75",
};

async function writeClipboard(text: string): Promise<boolean> {
  try {
    if (!navigator.clipboard?.writeText) return false;
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

/** For browsers that refuse the async clipboard: a hidden textarea and execCommand. */
function legacyCopy(text: string): boolean {
  try {
    const area = document.createElement("textarea");
    area.value = text;
    area.setAttribute("readonly", "");
    area.style.position = "fixed";
    area.style.opacity = "0";
    document.body.appendChild(area);
    area.select();
    const ok = document.execCommand("copy");
    area.remove();
    return ok;
  } catch {
    return false;
  }
}

function CopyButton() {
  const [state, setState] = useState<CopyState>("idle");
  const timer = useRef<number | undefined>(undefined);
  useEffect(() => () => window.clearTimeout(timer.current), []);

  const copy = async () => {
    window.clearTimeout(timer.current);
    const text = runbookText();
    const ok = (await writeClipboard(text)) || legacyCopy(text);
    setState(ok ? "done" : "failed");
    if (ok) timer.current = window.setTimeout(() => setState("idle"), 2400);
  };

  return (
    <div className="flex flex-col items-start gap-2 sm:items-end">
      <p role="status" aria-live="polite" className="sr-only">
        {state === "done" ? RUNBOOK.copy.done : ""}
      </p>
      <button
        type="button"
        onClick={copy}
        className={cn(
          "inline-flex h-9 items-center gap-2 rounded-lg border px-3.5 text-[0.84rem] font-semibold transition-colors duration-150",
          FOCUS,
          state === "done"
            ? "border-cta/30 bg-cta-soft text-cta"
            : "border-border bg-card text-ink hover:border-cta/40 hover:text-cta",
        )}
      >
        {state === "done" ? (
          <Check aria-hidden className="h-4 w-4" />
        ) : (
          <ClipboardCopy aria-hidden className="h-4 w-4" />
        )}
        {state === "done" ? RUNBOOK.copy.done : RUNBOOK.copy.idle}
      </button>
      {state === "failed" && (
        <p
          role="alert"
          className="inline-flex items-center gap-1.5 text-[0.76rem] text-destructive"
        >
          <TriangleAlert aria-hidden className="h-3.5 w-3.5 shrink-0" />
          {RUNBOOK.copy.failed}
        </p>
      )}
    </div>
  );
}

function Steps({
  title,
  steps,
  prefix,
}: {
  title: string;
  steps: readonly RunStep[];
  prefix: string;
}) {
  return (
    <div>
      <h3 className="px-5 pb-1 pt-6 text-[0.74rem] font-semibold uppercase tracking-[0.1em] text-muted-foreground sm:px-7">
        {title}
      </h3>
      <ol>
        {steps.map((s, i) => (
          <li
            key={s.title}
            className="grid grid-cols-[2rem_minmax(0,1fr)] gap-x-4 border-b border-border px-5 py-5 last:border-b-0 sm:px-7"
          >
            <span
              aria-hidden
              className="mt-0.5 flex h-7 w-7 items-center justify-center rounded-md border border-border bg-card font-mono text-[0.72rem] font-medium text-ink/70"
            >
              {prefix}
              {i + 1}
            </span>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
                <p className="text-[0.98rem] font-semibold tracking-tight text-ink">{s.title}</p>
                <span className="flex flex-wrap gap-1.5">
                  {s.owners.map((o) => (
                    <span
                      key={o}
                      className={cn(
                        "rounded-full border px-2 py-px text-[0.68rem] font-medium",
                        OWNER_STYLE[o],
                      )}
                    >
                      {RUNBOOK.owners[o]}
                    </span>
                  ))}
                </span>
              </div>
              <p className="mt-1.5 max-w-3xl text-[0.9rem] leading-relaxed text-muted-foreground">
                {s.body}
              </p>
              {s.ui && (
                <p className="mt-2.5 text-[0.74rem] text-muted-foreground">
                  {RUNBOOK.copy.uiPrefix}{" "}
                  <kbd className="rounded-md border border-border bg-surface px-1.5 py-0.5 font-sans text-[0.74rem] font-medium text-ink">
                    {s.ui}
                  </kbd>
                </p>
              )}
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}

/**
 * The runbook: two steps once, seven for each client, with the dashboard's
 * own button names and who does each step. "Copy as a checklist" puts the
 * same steps on the clipboard as Markdown; it shows Copied, or says plainly
 * when the browser refuses.
 */
export function Runbook() {
  return (
    <section id="onboarding" aria-labelledby="onboarding-title" className={SECTION}>
      <div className={WRAP}>
        <SectionHead id="onboarding" kicker={RUNBOOK.kicker} intro={RUNBOOK.intro} />

        <div className={cn(CARD, LIFT, "mt-12 overflow-hidden")}>
          <div className="flex flex-col gap-3 border-b border-border bg-surface px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-7">
            <p className="font-mono text-[0.78rem] text-muted-foreground">{RUNBOOK.copy.heading}</p>
            <CopyButton />
          </div>
          <div className="border-b border-border">
            <Steps title={RUNBOOK.once.title} steps={RUNBOOK.once.steps} prefix="A" />
          </div>
          <Steps title={RUNBOOK.each.title} steps={RUNBOOK.each.steps} prefix="" />
        </div>

        <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-4">
          <StudioButton />
          <Go href="/docs/account/studio" className={cn(TEXT_LINK, "text-[0.92rem]")}>
            {RUNBOOK.guide}
          </Go>
        </div>
      </div>
    </section>
  );
}
