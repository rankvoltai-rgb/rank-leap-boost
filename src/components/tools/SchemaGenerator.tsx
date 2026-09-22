import { useMemo, useState } from "react";
import {
  CheckList,
  Field,
  OutputBox,
  Pane,
  Select,
  TextArea,
  TextInput,
  Workbench,
  lines,
  type CheckItem,
} from "./shared";

type Values = Record<string, string>;

/** Stable empty form so memoized output does not recompute on every render. */
const EMPTY: Values = {};

interface FieldSpec {
  key: string;
  label: string;
  hint?: string;
  required?: boolean;
  kind?: "text" | "textarea" | "date" | "select";
  placeholder?: string;
  options?: string[];
  /** Puts two fields on one row. */
  half?: boolean;
}

interface SchemaSpec {
  id: string;
  label: string;
  blurb: string;
  fields: FieldSpec[];
  build: (v: Values) => Record<string, unknown>;
  /** Google's documented requirements, shown as notes. */
  notes: string[];
}

const omitEmpty = (obj: Record<string, unknown>): Record<string, unknown> =>
  Object.fromEntries(
    Object.entries(obj).filter(
      ([, v]) => v !== "" && v !== undefined && v !== null && !(Array.isArray(v) && !v.length),
    ),
  );

const pairs = (text: string) =>
  lines(text)
    .map((l) => l.split("|").map((s) => s.trim()))
    .filter((p) => p[0]);

const SCHEMAS: SchemaSpec[] = [
  {
    id: "Organization",
    label: "Organization",
    blurb: "Your company on the homepage: name, logo and profiles engines use to identify you.",
    fields: [
      { key: "name", label: "Organization name", required: true, placeholder: "Rankbox" },
      { key: "url", label: "Website URL", required: true, placeholder: "https://yoursite.com" },
      { key: "logo", label: "Logo URL", placeholder: "https://yoursite.com/logo.png" },
      {
        key: "description",
        label: "Description",
        kind: "textarea",
        placeholder: "What the company does, in one or two sentences.",
      },
      {
        key: "sameAs",
        label: "Profiles",
        hint: "One URL per line",
        kind: "textarea",
        placeholder: "https://www.linkedin.com/company/…\nhttps://x.com/…",
      },
      { key: "email", label: "Contact email", half: true, placeholder: "hello@yoursite.com" },
      { key: "telephone", label: "Phone", half: true, placeholder: "+1-555-0100" },
    ],
    build: (v) =>
      omitEmpty({
        "@context": "https://schema.org",
        "@type": "Organization",
        name: v.name,
        url: v.url,
        logo: v.logo,
        description: v.description,
        sameAs: lines(v.sameAs ?? ""),
        email: v.email,
        telephone: v.telephone,
      }),
    notes: [
      "Logo should be at least 112×112 px and crawlable.",
      "sameAs links help engines merge your profiles into one entity.",
    ],
  },
  {
    id: "Article",
    label: "Article / Blog post",
    blurb:
      "Authorship, dates and publisher for a post — the fields AI engines use to judge freshness and credibility.",
    fields: [
      {
        key: "headline",
        label: "Headline",
        required: true,
        placeholder: "How AI search picks its sources",
      },
      {
        key: "description",
        label: "Description",
        kind: "textarea",
        placeholder: "One-paragraph summary.",
      },
      { key: "image", label: "Image URL", placeholder: "https://yoursite.com/cover.jpg" },
      { key: "url", label: "Article URL", placeholder: "https://yoursite.com/blog/post" },
      {
        key: "authorName",
        label: "Author name",
        required: true,
        half: true,
        placeholder: "Jane Doe",
      },
      {
        key: "authorUrl",
        label: "Author page URL",
        half: true,
        placeholder: "https://yoursite.com/authors/jane",
      },
      { key: "datePublished", label: "Date published", kind: "date", required: true, half: true },
      { key: "dateModified", label: "Date modified", kind: "date", half: true },
      { key: "publisherName", label: "Publisher name", half: true, placeholder: "Rankbox" },
      {
        key: "publisherLogo",
        label: "Publisher logo URL",
        half: true,
        placeholder: "https://yoursite.com/logo.png",
      },
    ],
    build: (v) =>
      omitEmpty({
        "@context": "https://schema.org",
        "@type": "Article",
        headline: v.headline,
        description: v.description,
        image: v.image ? [v.image] : undefined,
        url: v.url,
        mainEntityOfPage: v.url ? { "@type": "WebPage", "@id": v.url } : undefined,
        author: v.authorName
          ? omitEmpty({ "@type": "Person", name: v.authorName, url: v.authorUrl })
          : undefined,
        datePublished: v.datePublished,
        dateModified: v.dateModified || v.datePublished,
        publisher: v.publisherName
          ? omitEmpty({
              "@type": "Organization",
              name: v.publisherName,
              logo: v.publisherLogo ? { "@type": "ImageObject", url: v.publisherLogo } : undefined,
            })
          : undefined,
      }),
    notes: [
      "Keep headline under 110 characters.",
      "Images: provide 16:9, 4:3 and 1:1 versions for the best rich-result eligibility.",
      "Dates in ISO 8601, ideally with a timezone.",
    ],
  },
  {
    id: "FAQPage",
    label: "FAQ page",
    blurb: "Question–answer pairs engines can quote whole.",
    fields: [
      {
        key: "faqs",
        label: "Questions & answers",
        hint: "One per line — Question? | Answer",
        kind: "textarea",
        required: true,
        placeholder:
          "What is llms.txt? | A Markdown file at the root of a domain that maps the site for AI assistants.\nIs it free? | Yes, completely free.",
      },
    ],
    build: (v) => ({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: pairs(v.faqs ?? "")
        .filter((p) => p[1])
        .map(([q, a]) => ({
          "@type": "Question",
          name: q,
          acceptedAnswer: { "@type": "Answer", text: a },
        })),
    }),
    notes: [
      "Every question must be visible on the page with its full answer.",
      "Google shows FAQ rich results only for government and health sites since 2023; the markup still helps AI extraction.",
    ],
  },
  {
    id: "HowTo",
    label: "How-to",
    blurb: "Ordered steps for a task page.",
    fields: [
      {
        key: "name",
        label: "Task title",
        required: true,
        placeholder: "How to add llms.txt to a Next.js site",
      },
      { key: "description", label: "Description", kind: "textarea" },
      {
        key: "totalTime",
        label: "Total time",
        hint: "ISO 8601, e.g. PT15M",
        half: true,
        placeholder: "PT15M",
      },
      { key: "image", label: "Image URL", half: true },
      {
        key: "steps",
        label: "Steps",
        hint: "One per line — Step name | Instructions",
        kind: "textarea",
        required: true,
        placeholder:
          "Create the file | Add llms.txt to the public folder.\nWrite the header | Start with an H1 and a blockquote summary.",
      },
    ],
    build: (v) =>
      omitEmpty({
        "@context": "https://schema.org",
        "@type": "HowTo",
        name: v.name,
        description: v.description,
        totalTime: v.totalTime,
        image: v.image,
        step: pairs(v.steps ?? "").map(([name, text], i) =>
          omitEmpty({ "@type": "HowToStep", position: i + 1, name, text: text || name }),
        ),
      }),
    notes: [
      "HowTo rich results were retired by Google in 2023; the markup still gives engines clean, ordered steps.",
    ],
  },
  {
    id: "Product",
    label: "Product",
    blurb: "A product with price, availability and ratings.",
    fields: [
      { key: "name", label: "Product name", required: true, placeholder: "Pro plan" },
      { key: "description", label: "Description", kind: "textarea" },
      { key: "image", label: "Image URL" },
      { key: "brand", label: "Brand", half: true, placeholder: "Rankbox" },
      { key: "sku", label: "SKU", half: true },
      { key: "price", label: "Price", required: true, half: true, placeholder: "49.00" },
      { key: "currency", label: "Currency", half: true, placeholder: "USD" },
      {
        key: "availability",
        label: "Availability",
        kind: "select",
        options: ["InStock", "OutOfStock", "PreOrder", "Discontinued"],
        half: true,
      },
      { key: "url", label: "Product URL", half: true },
      { key: "ratingValue", label: "Rating (1–5)", half: true, placeholder: "4.8" },
      { key: "reviewCount", label: "Review count", half: true, placeholder: "127" },
    ],
    build: (v) =>
      omitEmpty({
        "@context": "https://schema.org",
        "@type": "Product",
        name: v.name,
        description: v.description,
        image: v.image,
        brand: v.brand ? { "@type": "Brand", name: v.brand } : undefined,
        sku: v.sku,
        offers: v.price
          ? omitEmpty({
              "@type": "Offer",
              price: v.price,
              priceCurrency: v.currency || "USD",
              availability: `https://schema.org/${v.availability || "InStock"}`,
              url: v.url,
            })
          : undefined,
        aggregateRating:
          v.ratingValue && v.reviewCount
            ? { "@type": "AggregateRating", ratingValue: v.ratingValue, reviewCount: v.reviewCount }
            : undefined,
      }),
    notes: [
      "Google requires either offers, review or aggregateRating.",
      "Ratings must come from real reviews shown on the page.",
    ],
  },
  {
    id: "LocalBusiness",
    label: "Local business",
    blurb: "Address, hours and phone for a physical location.",
    fields: [
      { key: "name", label: "Business name", required: true },
      {
        key: "type",
        label: "Business type",
        kind: "select",
        options: [
          "LocalBusiness",
          "Restaurant",
          "Store",
          "Dentist",
          "LegalService",
          "MedicalClinic",
          "RealEstateAgent",
          "HomeAndConstructionBusiness",
          "ProfessionalService",
          "Hotel",
          "GymOrFitnessCenter",
          "BeautySalon",
          "AutoRepair",
        ],
      },
      { key: "street", label: "Street address", required: true },
      { key: "city", label: "City", required: true, half: true },
      { key: "region", label: "State / region", half: true },
      { key: "postal", label: "Postal code", half: true },
      { key: "country", label: "Country code", half: true, placeholder: "US" },
      { key: "telephone", label: "Phone", half: true, placeholder: "+1-555-0100" },
      { key: "url", label: "Website", half: true },
      { key: "priceRange", label: "Price range", half: true, placeholder: "$$" },
      { key: "image", label: "Image URL", half: true },
      {
        key: "hours",
        label: "Opening hours",
        hint: "One per line — Mo-Fr 09:00-17:00",
        kind: "textarea",
        placeholder: "Mo-Fr 09:00-17:00\nSa 10:00-14:00",
      },
    ],
    build: (v) =>
      omitEmpty({
        "@context": "https://schema.org",
        "@type": v.type || "LocalBusiness",
        name: v.name,
        image: v.image,
        url: v.url,
        telephone: v.telephone,
        priceRange: v.priceRange,
        address: omitEmpty({
          "@type": "PostalAddress",
          streetAddress: v.street,
          addressLocality: v.city,
          addressRegion: v.region,
          postalCode: v.postal,
          addressCountry: v.country,
        }),
        openingHours: lines(v.hours ?? ""),
      }),
    notes: [
      "Use the most specific subtype that fits.",
      "Match the name, address and phone exactly to your Google Business Profile.",
    ],
  },
  {
    id: "Person",
    label: "Person",
    blurb: "An author or founder page — the entity AI engines attach expertise to.",
    fields: [
      { key: "name", label: "Full name", required: true },
      { key: "jobTitle", label: "Job title", half: true, placeholder: "Head of Growth" },
      { key: "worksFor", label: "Company", half: true },
      { key: "url", label: "Profile page URL", half: true },
      { key: "image", label: "Photo URL", half: true },
      { key: "description", label: "Bio", kind: "textarea" },
      {
        key: "sameAs",
        label: "Profiles",
        hint: "One URL per line",
        kind: "textarea",
        placeholder: "https://www.linkedin.com/in/…\nhttps://x.com/…",
      },
    ],
    build: (v) =>
      omitEmpty({
        "@context": "https://schema.org",
        "@type": "Person",
        name: v.name,
        jobTitle: v.jobTitle,
        worksFor: v.worksFor ? { "@type": "Organization", name: v.worksFor } : undefined,
        url: v.url,
        image: v.image,
        description: v.description,
        sameAs: lines(v.sameAs ?? ""),
      }),
    notes: ["Put this on the author page and reference it from Article.author via url."],
  },
  {
    id: "SoftwareApplication",
    label: "Software / SaaS",
    blurb: "An app or SaaS product with pricing and ratings.",
    fields: [
      { key: "name", label: "Product name", required: true },
      {
        key: "category",
        label: "Category",
        kind: "select",
        options: [
          "BusinessApplication",
          "DeveloperApplication",
          "WebApplication",
          "MobileApplication",
          "UtilitiesApplication",
          "DesignApplication",
          "FinanceApplication",
          "EducationalApplication",
        ],
      },
      { key: "os", label: "Operating system", half: true, placeholder: "Web" },
      { key: "url", label: "Product URL", half: true },
      { key: "description", label: "Description", kind: "textarea" },
      { key: "price", label: "Starting price", half: true, placeholder: "0" },
      { key: "currency", label: "Currency", half: true, placeholder: "USD" },
      { key: "ratingValue", label: "Rating (1–5)", half: true },
      { key: "ratingCount", label: "Rating count", half: true },
    ],
    build: (v) =>
      omitEmpty({
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        name: v.name,
        applicationCategory: v.category || "BusinessApplication",
        operatingSystem: v.os || "Web",
        url: v.url,
        description: v.description,
        offers:
          v.price !== "" && v.price !== undefined
            ? { "@type": "Offer", price: v.price, priceCurrency: v.currency || "USD" }
            : undefined,
        aggregateRating:
          v.ratingValue && v.ratingCount
            ? { "@type": "AggregateRating", ratingValue: v.ratingValue, ratingCount: v.ratingCount }
            : undefined,
      }),
    notes: [
      "Google requires offers or aggregateRating for rich results.",
      "Use price 0 for a free tier.",
    ],
  },
  {
    id: "BreadcrumbList",
    label: "Breadcrumbs",
    blurb: "The path to this page, shown in results instead of the raw URL.",
    fields: [
      {
        key: "crumbs",
        label: "Trail",
        hint: "One per line, top first — Name | URL",
        kind: "textarea",
        required: true,
        placeholder:
          "Home | https://yoursite.com/\nBlog | https://yoursite.com/blog\nThis post | https://yoursite.com/blog/post",
      },
    ],
    build: (v) => ({
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: pairs(v.crumbs ?? "").map(([name, item], i) =>
        omitEmpty({ "@type": "ListItem", position: i + 1, name, item }),
      ),
    }),
    notes: ["The last item may omit the URL.", "Order matters: top level first."],
  },
  {
    id: "WebSite",
    label: "Website + sitelinks search",
    blurb: "Site-level identity and the search box Google can show under your listing.",
    fields: [
      { key: "name", label: "Site name", required: true },
      { key: "url", label: "Homepage URL", required: true, placeholder: "https://yoursite.com" },
      {
        key: "search",
        label: "Search URL template",
        hint: "Use {search_term_string}",
        placeholder: "https://yoursite.com/search?q={search_term_string}",
      },
    ],
    build: (v) =>
      omitEmpty({
        "@context": "https://schema.org",
        "@type": "WebSite",
        name: v.name,
        url: v.url,
        potentialAction: v.search
          ? {
              "@type": "SearchAction",
              target: { "@type": "EntryPoint", urlTemplate: v.search },
              "query-input": "required name=search_term_string",
            }
          : undefined,
      }),
    notes: ["Put this on the homepage only.", "The search URL must return results for the query."],
  },
];

export function SchemaGenerator() {
  const [typeId, setTypeId] = useState(SCHEMAS[0].id);
  const [values, setValues] = useState<Record<string, Values>>({});
  const spec = SCHEMAS.find((s) => s.id === typeId) ?? SCHEMAS[0];
  const v = values[typeId] ?? EMPTY;

  function set(key: string, value: string) {
    setValues((prev) => ({ ...prev, [typeId]: { ...(prev[typeId] ?? {}), [key]: value } }));
  }

  const json = useMemo(() => {
    const data = spec.build(v);
    return `<script type="application/ld+json">\n${JSON.stringify(data, null, 2)}\n</script>`;
  }, [spec, v]);

  const checks = useMemo<CheckItem[]>(() => {
    const missing = spec.fields.filter((f) => f.required && !(v[f.key] ?? "").trim());
    return [
      ...missing.map((f) => ({
        id: f.key,
        status: "fail" as const,
        label: `${f.label} is required`,
      })),
      ...(missing.length
        ? []
        : [{ id: "ok", status: "pass" as const, label: "All required fields present" }]),
      ...spec.notes.map((n, i) => ({ id: `n${i}`, status: "info" as const, label: n })),
    ];
  }, [spec, v]);

  return (
    <Workbench
      input={
        <Pane title="Details">
          <Field label="Schema type">
            <Select value={typeId} onChange={(e) => setTypeId(e.target.value)}>
              {SCHEMAS.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.label}
                </option>
              ))}
            </Select>
          </Field>
          <p className="-mt-2 text-[0.82rem] leading-relaxed text-muted-foreground">{spec.blurb}</p>
          <div className="grid gap-4 sm:grid-cols-2">
            {spec.fields.map((f) => (
              <div key={f.key} className={f.half ? "" : "sm:col-span-2"}>
                <Field label={f.label} hint={f.hint} required={f.required}>
                  {f.kind === "textarea" ? (
                    <TextArea
                      value={v[f.key] ?? ""}
                      onChange={(e) => set(f.key, e.target.value)}
                      placeholder={f.placeholder}
                      className="min-h-24"
                    />
                  ) : f.kind === "select" ? (
                    <Select
                      value={v[f.key] ?? f.options?.[0] ?? ""}
                      onChange={(e) => set(f.key, e.target.value)}
                    >
                      {f.options?.map((o) => (
                        <option key={o} value={o}>
                          {o}
                        </option>
                      ))}
                    </Select>
                  ) : (
                    <TextInput
                      type={f.kind === "date" ? "date" : "text"}
                      value={v[f.key] ?? ""}
                      onChange={(e) => set(f.key, e.target.value)}
                      placeholder={f.placeholder}
                    />
                  )}
                </Field>
              </div>
            ))}
          </div>
        </Pane>
      }
      output={
        <>
          <OutputBox
            value={json}
            filename={`${spec.id.toLowerCase()}-schema.html`}
            language="json-ld"
            mime="text/html"
            lineNumbers
          />
          <Pane title="Checks & notes" flush>
            <CheckList items={checks} />
          </Pane>
        </>
      }
    />
  );
}
