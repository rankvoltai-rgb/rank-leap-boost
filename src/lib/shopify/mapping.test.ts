import { describe, expect, it } from "vitest";
import { bodyHtmlForShopify } from "./body";
import { composeLiveUrl, hashArticle, toCreateInput, toUpdateInput } from "./mapping";

const article = {
  id: "0f3c2a9e-1111-2222-3333-444455556666",
  title: "How to Dial In a Pour-Over",
  description: "Grind, ratio & time, in one place.",
  body_html: "<p>Body.</p>",
  tags: ["Coffee", " brewing ", "coffee", ""],
};

describe("toUpdateInput", () => {
  it("fills the fields the integrations page lists", () => {
    expect(toUpdateInput(article)).toEqual({
      title: "How to Dial In a Pour-Over",
      body: "<p>Body.</p>",
      summary: "<p>Grind, ratio &amp; time, in one place.</p>",
      tags: ["Coffee", "brewing"],
      metafields: [
        {
          namespace: "global",
          key: "description_tag",
          type: "single_line_text_field",
          value: "Grind, ratio & time, in one place.",
        },
      ],
    });
  });

  it("leaves the search description alone when the article has none", () => {
    const input = toUpdateInput({ ...article, description: "" });
    expect(input.summary).toBe("");
    expect(input).not.toHaveProperty("metafields");
  });
});

describe("toCreateInput", () => {
  it("adds what is only set once: blog, handle, author, visibility", () => {
    expect(
      toCreateInput(article, {
        blogId: "gid://shopify/Blog/1",
        handle: "how-to-dial-in-a-pour-over",
        author: "Fernwood Team",
        visible: false,
      }),
    ).toMatchObject({
      blogId: "gid://shopify/Blog/1",
      handle: "how-to-dial-in-a-pour-over",
      author: { name: "Fernwood Team" },
      isPublished: false,
    });
  });

  it("never sends a blank author, which Shopify rejects", () => {
    const input = toCreateInput(article, { blogId: "b", handle: "h", author: "  ", visible: true });
    expect(input.author).toEqual({ name: "Rankbox" });
  });
});

describe("hashArticle", () => {
  it("changes with the content and ignores what isn't written", () => {
    const base = hashArticle(article);
    expect(hashArticle({ ...article })).toBe(base);
    expect(hashArticle({ ...article, body_html: "<p>New.</p>" })).not.toBe(base);
    expect(hashArticle({ ...article, id: "another-id" })).toBe(base);
  });
});

describe("composeLiveUrl", () => {
  it("builds /blogs/{blog}/{article} on the store's domain", () => {
    expect(composeLiveUrl("fernwoodcoffee.com", "news", "cold-brew")).toBe(
      "https://fernwoodcoffee.com/blogs/news/cold-brew",
    );
    expect(composeLiveUrl(null, "news", "cold-brew")).toBeNull();
  });
});

describe("bodyHtmlForShopify", () => {
  it("drops the H1, image notes and internal-link markup, and keeps the video", () => {
    const html = bodyHtmlForShopify(
      [
        "# How to Dial In a Pour-Over",
        "",
        "Start with [fresh beans](#internal: beans-guide).",
        "",
        '**[Image: kettle pouring] (alt: "A kettle")**',
        "",
        '<iframe width="560" height="315" src="https://www.youtube.com/embed/abc" allowfullscreen></iframe>',
        "",
        "```",
        "18g : 300g",
        "```",
      ].join("\n"),
    );
    expect(html).not.toContain("<h1");
    expect(html).not.toContain("Image:");
    expect(html).not.toContain("#internal");
    expect(html).toContain("Start with fresh beans.");
    expect(html).toContain('<iframe width="560"');
    expect(html).toContain("<pre><code>18g : 300g");
  });
});
