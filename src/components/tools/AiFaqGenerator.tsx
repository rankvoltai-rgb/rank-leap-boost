import { useMemo, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { generateFaq, type FaqPair } from "@/lib/tools.functions";
import {
  CopyButton,
  ErrorNote,
  Field,
  OutputBox,
  Pane,
  RunButton,
  Segmented,
  Stack,
  TextArea,
  Thinking,
  readAiError,
} from "./shared";

export function AiFaqGenerator() {
  const run = useServerFn(generateFaq);
  const [topic, setTopic] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [faqs, setFaqs] = useState<FaqPair[]>([]);
  const [format, setFormat] = useState<"markdown" | "jsonld" | "html">("markdown");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!topic.trim() || loading) return;
    setLoading(true);
    setError("");
    try {
      setFaqs(await run({ data: { topic: topic.trim() } }));
    } catch (err) {
      setError(readAiError(err));
      setFaqs([]);
    } finally {
      setLoading(false);
    }
  }

  const output = useMemo(() => {
    if (!faqs.length) return "";
    if (format === "markdown") return faqs.map((f) => `### ${f.q}\n\n${f.a}`).join("\n\n");
    if (format === "html") {
      const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;");
      return [
        `<section class="faq">`,
        `  <h2>Frequently asked questions</h2>`,
        ...faqs.flatMap((f) => [`  <h3>${esc(f.q)}</h3>`, `  <p>${esc(f.a)}</p>`]),
        `</section>`,
      ].join("\n");
    }
    const data = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faqs.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    };
    return `<script type="application/ld+json">\n${JSON.stringify(data, null, 2)}\n</script>`;
  }, [faqs, format]);

  return (
    <Stack>
      <form
        onSubmit={submit}
        className="space-y-4 rounded-2xl border border-border bg-card p-5 shadow-1"
      >
        <Field
          label="Page or topic"
          hint="Product, service, how-to — the more specific, the better"
        >
          <TextArea
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="Our llms.txt generator: a free tool that writes a valid llms.txt file with sections and an Optional block. Used by founders and marketers without a dev team."
            className="min-h-24"
          />
        </Field>
        <RunButton type="submit" loading={loading}>
          {loading ? "Writing" : "Generate FAQ"}
        </RunButton>
      </form>

      <ErrorNote message={error} />
      {loading && <Thinking lines={6} />}

      {faqs.length > 0 && (
        <div className="grid gap-5 lg:grid-cols-2">
          <Pane
            title={`${faqs.length} questions`}
            description="Read each answer for accuracy before publishing"
            flush
          >
            <ul className="divide-y divide-border">
              {faqs.map((f) => (
                <li key={f.q} className="flex items-start gap-3 px-5 py-4">
                  <div className="min-w-0 flex-1">
                    <p className="text-[0.95rem] font-semibold leading-snug text-ink">{f.q}</p>
                    <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{f.a}</p>
                  </div>
                  <CopyButton value={`${f.q}\n${f.a}`} />
                </li>
              ))}
            </ul>
          </Pane>
          <div className="space-y-4 lg:sticky lg:top-24 lg:self-start">
            <Segmented
              value={format}
              onChange={setFormat}
              options={[
                { value: "markdown", label: "Markdown" },
                { value: "html", label: "HTML" },
                { value: "jsonld", label: "FAQPage JSON-LD" },
              ]}
            />
            <OutputBox
              value={output}
              filename={
                format === "markdown"
                  ? "faq.md"
                  : format === "html"
                    ? "faq.html"
                    : "faq-schema.html"
              }
              language={format}
              mime={format === "markdown" ? "text/markdown" : "text/html"}
            />
          </div>
        </div>
      )}
    </Stack>
  );
}
