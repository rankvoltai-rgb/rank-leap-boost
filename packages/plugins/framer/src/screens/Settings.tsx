import { Checkbox, ExternalLink } from "../components";
import { composeLiveUrl, normalizeBlogPath } from "../lib/live-url";

export interface SettingsValue {
  blogPath: string;
  autoReport: boolean;
  seoEnabled: boolean;
  followSlugRenames: boolean;
}

export function Settings({
  value,
  productionUrl,
  sampleSlug,
  onChange,
}: {
  value: SettingsValue;
  productionUrl: string | null;
  sampleSlug: string | null;
  onChange: (patch: Partial<SettingsValue>) => void;
}) {
  const path = normalizeBlogPath(value.blogPath);
  const preview = productionUrl
    ? composeLiveUrl(productionUrl, path, sampleSlug ?? "your-article")
    : null;

  return (
    <div className="rb-stack">
      <div className="rb-field">
        <label className="rb-label" htmlFor="rb-path">
          Collection page path
        </label>
        <input
          id="rb-path"
          className="rb-input"
          type="text"
          placeholder="/blog"
          value={value.blogPath}
          onChange={(e) => onChange({ blogPath: e.currentTarget.value })}
        />
        {preview ? (
          <span className="rb-preview">{preview}</span>
        ) : (
          <span className="rb-muted">
            Publish this project and Rankbox can record where each article lives.
          </span>
        )}
      </div>

      <Checkbox
        label="Report live URLs to Rankbox"
        hint="Tells Rankbox where each article went live, which is what the backlink exchange verifies against. Only runs once the site is published."
        checked={value.autoReport}
        onChange={(autoReport) => onChange({ autoReport })}
      />

      <Checkbox
        label="Add article structured data"
        hint="Writes JSON-LD into your site's head so search and AI engines can read your articles. Framer can't add this per CMS page on its own."
        checked={value.seoEnabled}
        onChange={(seoEnabled) => onChange({ seoEnabled })}
      />

      <Checkbox
        label="Follow slug changes from Rankbox"
        hint="Off by default: renaming an article in Rankbox would otherwise change a published page's URL."
        checked={value.followSlugRenames}
        onChange={(followSlugRenames) => onChange({ followSlugRenames })}
      />
    </div>
  );
}

export function FieldList() {
  const rows: Array<[string, string]> = [
    ["Title", "Title"],
    ["Slug", "Slug"],
    ["Article body", "Content"],
    ["Meta description", "Description"],
    ["Tags", "Tags"],
    ["SEO score", "SEO Score"],
    ["Live URL", "Live URL"],
  ];
  return (
    <div className="rb-card">
      <span className="rb-label">What Rankbox writes</span>
      {rows.map(([from, to]) => (
        <div key={from} className="rb-spread">
          <span className="rb-muted">{from}</span>
          <span className="rb-faint">{to}</span>
        </div>
      ))}
      <span className="rb-faint">
        Bind these to your own collection page — Rankbox supplies the words, Framer does the layout.
      </span>
    </div>
  );
}

export function Help({ baseUrl }: { baseUrl: string }) {
  return (
    <ExternalLink href={`${baseUrl}/integrations/framer`}>Setup &amp; troubleshooting</ExternalLink>
  );
}
