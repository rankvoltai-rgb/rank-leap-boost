import { useMemo, useState } from "react";
import { Field, TextInput, TextArea, Select, OutputBox, ToolGrid, Panel } from "./shared";

type SchemaType = "Organization" | "Article" | "FAQPage" | "Product";

export function SchemaGenerator() {
  const [type, setType] = useState<SchemaType>("Organization");

  // Organization
  const [orgName, setOrgName] = useState("");
  const [orgUrl, setOrgUrl] = useState("");
  const [orgLogo, setOrgLogo] = useState("");

  // Article
  const [artTitle, setArtTitle] = useState("");
  const [artAuthor, setArtAuthor] = useState("");
  const [artDate, setArtDate] = useState("");
  const [artImage, setArtImage] = useState("");

  // FAQ
  const [faqText, setFaqText] = useState("");

  // Product
  const [prodName, setProdName] = useState("");
  const [prodDesc, setProdDesc] = useState("");
  const [prodPrice, setProdPrice] = useState("");
  const [prodCurrency, setProdCurrency] = useState("USD");

  const json = useMemo(() => {
    let data: Record<string, unknown> = {};
    if (type === "Organization") {
      data = {
        "@context": "https://schema.org",
        "@type": "Organization",
        name: orgName || "Your Company",
        url: orgUrl || "https://yoursite.com",
        ...(orgLogo ? { logo: orgLogo } : {}),
      };
    } else if (type === "Article") {
      data = {
        "@context": "https://schema.org",
        "@type": "Article",
        headline: artTitle || "Your article title",
        ...(artImage ? { image: [artImage] } : {}),
        author: { "@type": "Person", name: artAuthor || "Author Name" },
        ...(artDate ? { datePublished: artDate } : {}),
      };
    } else if (type === "FAQPage") {
      const pairs = faqText
        .split("\n")
        .map((l) => l.trim())
        .filter(Boolean)
        .map((line) => {
          const [q, a] = line.split("|");
          return { q: (q ?? "").trim(), a: (a ?? "").trim() };
        })
        .filter((p) => p.q && p.a);
      data = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: (pairs.length ? pairs : [{ q: "Question?", a: "Answer." }]).map((p) => ({
          "@type": "Question",
          name: p.q,
          acceptedAnswer: { "@type": "Answer", text: p.a },
        })),
      };
    } else {
      data = {
        "@context": "https://schema.org",
        "@type": "Product",
        name: prodName || "Product name",
        ...(prodDesc ? { description: prodDesc } : {}),
        ...(prodPrice
          ? {
              offers: {
                "@type": "Offer",
                price: prodPrice,
                priceCurrency: prodCurrency || "USD",
              },
            }
          : {}),
      };
    }
    return `<script type="application/ld+json">\n${JSON.stringify(data, null, 2)}\n</script>`;
  }, [
    type,
    orgName,
    orgUrl,
    orgLogo,
    artTitle,
    artAuthor,
    artDate,
    artImage,
    faqText,
    prodName,
    prodDesc,
    prodPrice,
    prodCurrency,
  ]);

  return (
    <ToolGrid>
      <Panel title="Details">
        <Field label="Schema type">
          <Select value={type} onChange={(e) => setType(e.target.value as SchemaType)}>
            <option value="Organization">Organization</option>
            <option value="Article">Article</option>
            <option value="FAQPage">FAQ Page</option>
            <option value="Product">Product</option>
          </Select>
        </Field>

        {type === "Organization" && (
          <>
            <Field label="Organization name">
              <TextInput value={orgName} onChange={(e) => setOrgName(e.target.value)} placeholder="Rankvolt" />
            </Field>
            <Field label="Website URL">
              <TextInput value={orgUrl} onChange={(e) => setOrgUrl(e.target.value)} placeholder="https://yoursite.com" />
            </Field>
            <Field label="Logo URL" hint="Optional">
              <TextInput value={orgLogo} onChange={(e) => setOrgLogo(e.target.value)} placeholder="https://yoursite.com/logo.png" />
            </Field>
          </>
        )}

        {type === "Article" && (
          <>
            <Field label="Headline">
              <TextInput value={artTitle} onChange={(e) => setArtTitle(e.target.value)} placeholder="How AI search works" />
            </Field>
            <Field label="Author name">
              <TextInput value={artAuthor} onChange={(e) => setArtAuthor(e.target.value)} placeholder="Jane Doe" />
            </Field>
            <Field label="Date published" hint="YYYY-MM-DD">
              <TextInput value={artDate} onChange={(e) => setArtDate(e.target.value)} placeholder="2026-06-23" />
            </Field>
            <Field label="Image URL" hint="Optional">
              <TextInput value={artImage} onChange={(e) => setArtImage(e.target.value)} placeholder="https://yoursite.com/cover.jpg" />
            </Field>
          </>
        )}

        {type === "FAQPage" && (
          <Field label="Questions & answers" hint="One per line — Question? | Answer">
            <TextArea
              value={faqText}
              onChange={(e) => setFaqText(e.target.value)}
              placeholder={"What is llms.txt? | A file that maps your content for AI engines.\nIs it free? | Yes, completely free."}
              className="min-h-40"
            />
          </Field>
        )}

        {type === "Product" && (
          <>
            <Field label="Product name">
              <TextInput value={prodName} onChange={(e) => setProdName(e.target.value)} placeholder="Pro plan" />
            </Field>
            <Field label="Description" hint="Optional">
              <TextArea value={prodDesc} onChange={(e) => setProdDesc(e.target.value)} placeholder="Unlimited AI search optimization." className="min-h-20" />
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Price">
                <TextInput value={prodPrice} onChange={(e) => setProdPrice(e.target.value)} placeholder="49.00" />
              </Field>
              <Field label="Currency">
                <TextInput value={prodCurrency} onChange={(e) => setProdCurrency(e.target.value)} placeholder="USD" />
              </Field>
            </div>
          </>
        )}
      </Panel>
      <Panel title="JSON-LD">
        <OutputBox value={json} filename="schema.html" language="json-ld" />
      </Panel>
    </ToolGrid>
  );
}