import { useId, useRef, useState, type KeyboardEvent } from "react";
import { motion } from "motion/react";
import { RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";
import { STYLES, TONES, VOICE } from "./content";
import { MoreLinks } from "./MoreLinks";
import { SectionShell } from "./SectionShell";
import { SelectField } from "./SelectField";
import { OWN, briefFor, fieldsFrom, sameFields, type VoiceFields } from "./voice-brief";

const FIELD =
  "w-full rounded-lg border border-ink/[0.12] bg-white px-3 py-2 text-[0.88rem] text-ink shadow-[0_1px_1px_rgba(16,24,40,0.03)] placeholder:text-muted-foreground/70 focus-visible:border-cta/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cta/30";
const LABEL = "mb-1.5 block text-[0.78rem] font-medium text-ink/80";

/**
 * 02. The brief composer: three sample clients as tabs, their writing
 * settings as fields, and beside them the brief the writer reads, built live
 * by composeStyleBrief. Typing over a sample marks it "Edited" and offers
 * Reset; blank fields show the writer's defaults in the brief, which is the
 * empty state. Nothing is sent anywhere.
 */
export function BriefComposer() {
  const presets = VOICE.presets;
  const [active, setActive] = useState(0);
  const [fields, setFields] = useState<VoiceFields>(() => fieldsFrom(presets[0]));
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const uid = useId();

  const original = fieldsFrom(presets[active]);
  const edited = !sameFields(fields, original);
  const brief = briefFor(fields);

  const choose = (i: number) => {
    setActive(i);
    setFields(fieldsFrom(presets[i]));
  };

  const onTabKey = (e: KeyboardEvent<HTMLButtonElement>, i: number) => {
    const last = presets.length - 1;
    const to =
      e.key === "ArrowRight"
        ? i === last
          ? 0
          : i + 1
        : e.key === "ArrowLeft"
          ? i === 0
            ? last
            : i - 1
          : e.key === "Home"
            ? 0
            : e.key === "End"
              ? last
              : null;
    if (to === null) return;
    e.preventDefault();
    choose(to);
    tabs.current[to]?.focus();
  };

  const set = (key: keyof VoiceFields) => (value: string) =>
    setFields((f) => ({ ...f, [key]: value }));
  const id = (name: string) => `${uid}-${name}`;

  return (
    <SectionShell id="voice" intro={VOICE.intro}>
      <div className="overflow-hidden rounded-2xl border border-ink/[0.08] bg-white shadow-[0_1px_2px_rgba(16,24,40,0.04)]">
        {/* Tabs and status. */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-ink/[0.07] px-3 py-2.5 sm:px-4">
          <div role="tablist" aria-label={VOICE.tabsLabel} className="flex flex-wrap gap-1">
            {presets.map((p, i) => {
              const on = i === active;
              return (
                <button
                  key={p.brand}
                  ref={(el) => {
                    tabs.current[i] = el;
                  }}
                  type="button"
                  role="tab"
                  id={id(`tab-${i}`)}
                  aria-selected={on}
                  aria-controls={id("panel")}
                  tabIndex={on ? 0 : -1}
                  onClick={() => choose(i)}
                  onKeyDown={(e) => onTabKey(e, i)}
                  className={cn(
                    "relative rounded-lg px-3 py-1.5 text-[0.84rem] font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cta/40",
                    on ? "text-brand-blue" : "text-ink/65 hover:text-ink",
                  )}
                >
                  {on && (
                    <motion.span
                      layoutId={`${uid}-tab`}
                      aria-hidden
                      className="absolute inset-0 rounded-lg bg-cta-soft"
                      transition={{ type: "spring", bounce: 0.15, duration: 0.4 }}
                    />
                  )}
                  <span className="relative">{p.brand}</span>
                </button>
              );
            })}
          </div>
          <div className="flex items-center gap-2 pr-1">
            <span className="rounded-md border border-ink/[0.1] px-2 py-0.5 text-[0.7rem] font-medium text-muted-foreground">
              {edited ? VOICE.edited : VOICE.sample}
            </span>
            <button
              type="button"
              onClick={() => setFields(original)}
              disabled={!edited}
              className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-[0.78rem] font-medium text-ink/70 transition-colors hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cta/40 disabled:cursor-default disabled:opacity-40"
            >
              <RotateCcw aria-hidden className="h-3.5 w-3.5" />
              {VOICE.reset}
            </button>
          </div>
        </div>

        <div
          role="tabpanel"
          id={id("panel")}
          aria-labelledby={id(`tab-${active}`)}
          className="grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]"
        >
          {/* The settings. */}
          <form className="grid gap-4 p-4 sm:p-6" onSubmit={(e) => e.preventDefault()}>
            <div>
              <label htmlFor={id("brand")} className={LABEL}>
                {VOICE.fields.brand}
              </label>
              <input
                id={id("brand")}
                className={FIELD}
                value={fields.brand}
                onChange={(e) => set("brand")(e.target.value)}
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor={id("tone")} className={LABEL}>
                  {VOICE.fields.tone}
                </label>
                <SelectField
                  id={id("tone")}
                  value={fields.tone}
                  onChange={(e) => set("tone")(e.target.value)}
                >
                  {TONES.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                  <option value={OWN}>{VOICE.fields.own}</option>
                </SelectField>
                {fields.tone === OWN && (
                  <input
                    aria-label={VOICE.fields.ownTone}
                    placeholder={VOICE.fields.ownTone}
                    className={cn(FIELD, "mt-2")}
                    value={fields.toneOwn}
                    onChange={(e) => set("toneOwn")(e.target.value)}
                  />
                )}
              </div>
              <div>
                <label htmlFor={id("style")} className={LABEL}>
                  {VOICE.fields.style}
                </label>
                <SelectField
                  id={id("style")}
                  value={fields.style}
                  onChange={(e) => set("style")(e.target.value)}
                >
                  {STYLES.map((st) => (
                    <option key={st} value={st}>
                      {st}
                    </option>
                  ))}
                  <option value={OWN}>{VOICE.fields.own}</option>
                </SelectField>
                {fields.style === OWN && (
                  <input
                    aria-label={VOICE.fields.ownStyle}
                    placeholder={VOICE.fields.ownStyle}
                    className={cn(FIELD, "mt-2")}
                    value={fields.styleOwn}
                    onChange={(e) => set("styleOwn")(e.target.value)}
                  />
                )}
              </div>
            </div>
            <div>
              <label htmlFor={id("audience")} className={LABEL}>
                {VOICE.fields.audience}
              </label>
              <input
                id={id("audience")}
                className={FIELD}
                value={fields.audience}
                onChange={(e) => set("audience")(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor={id("product")} className={LABEL}>
                {VOICE.fields.product}
              </label>
              <textarea
                id={id("product")}
                rows={2}
                className={cn(FIELD, "resize-none")}
                value={fields.product}
                onChange={(e) => set("product")(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor={id("rules")} className={LABEL}>
                {VOICE.fields.rules}
                <span className="ml-2 font-normal text-muted-foreground">
                  {VOICE.fields.rulesHint}
                </span>
              </label>
              <textarea
                id={id("rules")}
                rows={4}
                className={cn(FIELD, "resize-y font-mono text-[0.8rem]")}
                value={fields.rules}
                onChange={(e) => set("rules")(e.target.value)}
              />
            </div>
          </form>

          {/* What the writer reads. */}
          <div className="border-t border-ink/[0.07] bg-surface/70 p-4 sm:p-6 lg:border-l lg:border-t-0">
            <div className="flex items-center justify-between gap-3">
              <p className="text-[0.78rem] font-semibold text-ink">{VOICE.outputLabel}</p>
              <p className="truncate font-mono text-[0.7rem] text-muted-foreground">
                {presets[active].domain}
              </p>
            </div>
            <pre className="mt-3 min-h-[15rem] overflow-x-auto whitespace-pre-wrap break-words rounded-xl border border-ink/[0.08] bg-white p-4 font-mono text-[0.76rem] leading-[1.7] text-ink/85">
              {brief}
            </pre>
            <p className="mt-3 text-[0.75rem] text-muted-foreground">{VOICE.outputNote}</p>
          </div>
        </div>
      </div>

      <div className="mt-10 max-w-3xl">
        <h3 className="text-[1rem] font-semibold tracking-tight text-ink">{VOICE.notesTitle}</h3>
        <ul className="mt-4 grid gap-3">
          {VOICE.notes.map((n) => (
            <li key={n} className="flex gap-3 text-[0.92rem] leading-relaxed text-ink/75">
              <span aria-hidden className="mt-[0.6rem] h-1 w-1 shrink-0 rounded-full bg-ink/40" />
              {n}
            </li>
          ))}
        </ul>
      </div>
      <MoreLinks links={VOICE.links} />
    </SectionShell>
  );
}
