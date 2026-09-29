---
title: Author Bio SEO: How to Write an Author Bio That Search and AI Can Use
description: Author bio SEO in practice: what an author bio should include, short, medium and long templates, a bio page layout, and valid Person JSON-LD to copy.
keyword: author bio
date: 2026-09-29
updated: 2026-09-29
author: Rankbox Team
tags: SEO, AI Search
---

Author bio SEO means writing a short, factual author bio that tells readers, search engines and AI tools who wrote a page and why that person can be trusted on the topic, then backing it with a bio page and Person markup. A good author bio names the person, states work they have actually done, points to proof that others can check, and reads the same wherever it appears.

Don't expect the bio to rank a page by itself. In January 2024, Google's Search Liaison said bylines ["don't help you rank better"](https://x.com/searchliaison/status/1744373098432864386), and our post on [whether author bios help SEO](/blog/do-author-bios-help-seo) walks through Google's statements and tests. What Google does ask is whether bylines "lead to further information about the author." The bio is that information.

This post is the practical half. It covers what to include, three templates you can fill in, the layout of a bio page, and Person JSON-LD for a made-up Tallyfold author that passes validation. For the bigger question of how authors affect ChatGPT, Perplexity and AI Overviews, read our guide on [whether author bios help AI search visibility](/blog/do-author-bios-help-ai-search-visibility).

## Key Takeaways

- An author bio should cover six things: exact name, current role, specific experience, checkable credentials, three to five topics, and links to proof.
- Write three lengths from one set of facts: 20 to 30 words under the byline, 50 to 80 at the end of an article, and 150 to 250 on the bio page.
- Give every author a bio page on your domain. Google treats "an employee page on a company website" as a valid profile page.
- Mark the bio page up as a `ProfilePage` with a `Person` as its `mainEntity`, and point each article's `author` at that person.
- Every claim in the markup must appear on the page. Fake or inflated author profiles get the Lowest rating in Google's rater guidelines.

## What to Put in an Author Bio

Google's quality raters are told to start with "what the website or content creators say about themselves," then check what others say. So a strong author bio does two jobs. It makes claims, and it makes them easy to verify.

We use a six-line checklist. Each line maps to a field in the markup, so the words and the code stay in step.

| Line           | What to write                                        | Weak version                         | Strong version                                                                            | Markup property        |
| -------------- | ---------------------------------------------------- | ------------------------------------ | ----------------------------------------------------------------------------------------- | ---------------------- |
| 1. Name        | The full name, spelled the same everywhere           | "Ada M."                             | "Adaeze Morrow"                                                                           | `name`                 |
| 2. Role        | Current job title and employer                       | "Content team"                       | "Senior Payments Analyst at Tallyfold"                                                    | `jobTitle`, `worksFor` |
| 3. Experience  | What they did, for how long, with a number           | "Passionate finance expert"          | "Ran billing for creative agencies for eight years"                                       | `description`          |
| 4. Credentials | Degrees, licenses or certifications, with the issuer | "Certified professional"             | "Certified Treasury Professional (CTP), from the Association for Financial Professionals" | `hasCredential`        |
| 5. Topics      | Three to five subjects they cover                    | "Finance, business, tech, marketing" | "Agency invoicing, late payments, cross-border fees"                                      | `knowsAbout`           |
| 6. Proof links | Places others confirm the story                      | None                                 | LinkedIn, a conference talk, bylines on trade sites                                       | `sameAs`               |

The strong column is specific, and that's the point. Google's rater guidelines list "educational degrees, peer validation, expert co-authors, and citations" as evidence of a good reputation, plus "employment history" where experience matters. Numbers and named issuers give a reader something to look up.

Three to five topics is also a common pattern. When Seer Interactive studied the agency blogs AI engines cite most, it found their bylines listed ["3-5 named focus areas"](https://www.seerinteractive.com/work/case-studies/author-bylines) and a numeric claim of years in the field.

### What to leave out

- **Adjectives with nothing behind them.** "Passionate," "guru" and "thought leader" tell nobody anything.
- **Keyword lists.** Google's John Mueller [wrote in February 2025](https://bsky.app/profile/johnmu.com/post/3lhiuwlnhsc2a) that "people can tell when author bios are used purely as an SEO tactic. It's kinda awkward, not reassuring."
- **Claims you can't support.** If a credential lapsed, remove it. If a number came from memory, check it.
- **Private details.** A home city is fine. A home address, phone number or birth date is not.

## Three Author Bio Templates: Short, Medium and Long

Write one set of facts, then cut it to three lengths. The short one sits under the byline, the medium one at the end of each article, and the long one on the bio page. Keep them consistent so every version tells the same story.

The examples use Adaeze Morrow, a made-up analyst at Tallyfold, a fictional invoicing and payments app for agencies. Her career details are invented to show the pattern.

### The short author bio (20 to 30 words)

Use this under the headline or byline, where space is tight.

> **Template:** [Name] is [role] at [company]. [One sentence of experience, with a number.]
>
> **Example:** Adaeze Morrow is a Senior Payments Analyst at Tallyfold. She ran billing for creative agencies for eight years before joining.

### The medium author bio (50 to 80 words)

Use this in the author box at the end of every article. It adds credentials, topics and one link.

> **Template:** [Name] is [role] at [company], where [what they do day to day]. Before that, [previous experience with a number]. [Credential, with issuer.] [They] write about [topic 1], [topic 2] and [topic 3]. [Link to bio page.]
>
> **Example:** Adaeze Morrow is a Senior Payments Analyst at Tallyfold, where she studies how agencies get paid and why invoices go late. Before that, she ran billing for creative agencies for eight years, chasing around 400 invoices a month. She is a Certified Treasury Professional, certified by the Association for Financial Professionals. She writes about agency invoicing, late payments and cross-border fees. [Read Adaeze's full bio.]

### The long author bio (150 to 250 words)

Use this on the bio page itself. Write it in the third person, like a good conference bio, so it reads the same when others quote it.

> **Template:** Open with name, role and company. Then two or three sentences on past work, each with a specific result. Add credentials with issuers, the topics covered, where else the person has been published or spoken, and a closing line on how readers can reach them or send corrections.
>
> **Example:** Adaeze Morrow is a Senior Payments Analyst at Tallyfold. She joined in 2025 after eight years running billing for creative agencies, most recently at a 60-person design studio. There she moved invoicing from spreadsheets to automatic reminders and cut the average time to payment from 41 days to 26. At Tallyfold she studies payment data across agency accounts and writes the guides the support team sends to new customers. She holds the Certified Treasury Professional credential from the Association for Financial Professionals. Her articles cover agency invoicing, late-payment follow-up and the fees on cross-border payments. She has spoken about invoice terms at regional finance meetups and writes for trade newsletters on agency operations. She also mentors finance staff at small studios who are setting up their first billing process. Spot an error in one of her articles? Email the editors, and she will correct it within two working days.

That example runs to about 150 words. Say what's true and stop. Padding a bio to hit a length helps no one.

## How to Structure an Author Bio Page

A bio at the foot of a post is easy to skip and hard to link. A page of its own gives the byline somewhere to point, gives markup a `url`, and gives outside profiles a place to link back to. Google's [ProfilePage guidelines](https://developers.google.com/search/docs/appearance/structured-data/profile-page) say the page's main focus "must be a single person or organization that is affiliated with the overall website," and list "an employee page on a company website" as a valid example.

Build each author bio page in this order:

1. **Heading with name and role.** "Adaeze Morrow, Senior Payments Analyst." Use one clean URL, such as `/authors/adaeze-morrow`, and never change it.
2. **A real photo.** Google's docs say not to use a placeholder image in the markup. If there's no photo, leave the field out.
3. **The long bio.** The 150 to 250 words from the template above.
4. **Credentials, each with its issuer.** Link to the issuer's site where it helps a reader check.
5. **Topics.** The same three to five you put in the medium bio.
6. **Her articles.** A list, newest first, generated by your CMS so it never goes stale.
7. **Elsewhere on the web.** Links to LinkedIn, talks, podcasts and bylines on other sites. These become `sameAs` in the markup.
8. **Corrections and contact.** How to report an error, and a link to your editorial policy if you have one.

Link to this page from every byline, with a normal `<a href>` link. Link from it back to your About page, so the person and the company connect. For how that fits into your site's wider structured data, see our [SEO knowledge graph walkthrough](/blog/seo-knowledge-graph).

## Person JSON-LD for the Author Bio Page

Here's the [schema markup](/glossary/schema-markup) for Adaeze's bio page. It wraps a `Person` inside a `ProfilePage`, as Google recommends, and uses `hasPart` to list one of her articles, following the pattern in Google's ProfilePage docs. Adaeze, Tallyfold and every URL and profile below are made up. The credential and its issuer are real, and are there to show the pattern.

```json
{
  "@context": "https://schema.org",
  "@type": "ProfilePage",
  "url": "https://tallyfold.example/authors/adaeze-morrow",
  "dateCreated": "2025-03-10T09:00:00+00:00",
  "dateModified": "2026-09-15T14:30:00+00:00",
  "mainEntity": {
    "@type": "Person",
    "@id": "https://tallyfold.example/authors/adaeze-morrow#person",
    "name": "Adaeze Morrow",
    "jobTitle": "Senior Payments Analyst",
    "description": "Payments analyst who ran billing for creative agencies for eight years.",
    "image": "https://tallyfold.example/images/authors/adaeze-morrow.jpg",
    "worksFor": {
      "@type": "Organization",
      "name": "Tallyfold",
      "url": "https://tallyfold.example/"
    },
    "knowsAbout": ["Agency invoicing", "Late payment follow-up", "Cross-border payment fees"],
    "hasCredential": {
      "@type": "EducationalOccupationalCredential",
      "credentialCategory": "Professional certification",
      "name": "Certified Treasury Professional (CTP)",
      "recognizedBy": {
        "@type": "Organization",
        "name": "Association for Financial Professionals"
      }
    },
    "sameAs": [
      "https://www.linkedin.com/in/example-adaeze-morrow",
      "https://events.example/speakers/adaeze-morrow"
    ]
  },
  "hasPart": [
    {
      "@type": "BlogPosting",
      "headline": "Net 30 or Net 15? What Agency Payment Terms Do to Cash Flow",
      "url": "https://tallyfold.example/blog/agency-payment-terms",
      "datePublished": "2026-08-04",
      "author": { "@id": "https://tallyfold.example/authors/adaeze-morrow#person" }
    }
  ]
}
```

On each of her articles, the `author` field points back to the same person, with the bio page as her `url`:

```json
{
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "headline": "Net 30 or Net 15? What Agency Payment Terms Do to Cash Flow",
  "datePublished": "2026-08-04",
  "author": {
    "@type": "Person",
    "@id": "https://tallyfold.example/authors/adaeze-morrow#person",
    "name": "Adaeze Morrow",
    "url": "https://tallyfold.example/authors/adaeze-morrow"
  }
}
```

Both blocks returned 0 errors and 0 warnings in the [Schema Markup Validator](https://validator.schema.org/) on 29 September 2026. The validator checks schema.org rules. Once the page is live, also run Google's Rich Results Test on the URL, which Google's ProfilePage docs recommend for its own checks.

### Why each property is there

| Property            | What it holds                            | Rule to follow                                                                                                                         |
| ------------------- | ---------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| `name`              | The author's real name only              | Google says to put nothing else in the name: no job title, no "Posted by"                                                              |
| `jobTitle`          | Their current title                      | Kept separate from the name, per Google's [Article docs](https://developers.google.com/search/docs/appearance/structured-data/article) |
| `@id`               | A stable ID for the person               | Same value on the bio page and every article                                                                                           |
| `url` (on articles) | The bio page                             | Google recommends a `url` or `sameAs` so it can tell authors apart                                                                     |
| `description`       | A one-line summary                       | Google's ProfilePage docs describe it as "the user's byline or applicable credential"                                                  |
| `hasCredential`     | A certification with its issuer          | Only credentials shown on the page, and still current                                                                                  |
| `knowsAbout`        | Three to five topics                     | Match the topics listed on the page                                                                                                    |
| `sameAs`            | Outside profiles about this exact person | Real profiles only; the docs call them "other external profiles or home pages"                                                         |
| `dateModified`      | When the profile last changed            | Google wants it to reflect "human-edited" changes, not automatic ones                                                                  |

Our free [schema generator](/tools/schema-generator) builds a basic Person block you can extend with these fields.

## Author Bio Mistakes That Cost Trust

Most bio problems aren't technical. They're honesty problems, and Google's rater guidelines treat them harshly. The September 2025 edition gives the Lowest rating to sites with "AI generated content with made up 'author' profiles" and to profiles that inaccurately claim "credentials or expertise."

- **An invented expert.** An AI-generated headshot and a made-up name on AI-written posts is the textbook case the guidelines describe.
- **A credential that has lapsed.** Update the author bio when a license expires or a role changes.
- **Name drift.** "Adaeze Morrow" here, "A. Morrow" on LinkedIn, "Ada Morrow" on a podcast page. Pick one and use it everywhere.
- **Markup the page doesn't show.** If a credential appears in the JSON-LD but not in the visible bio, remove it from the JSON-LD.
- **AI listed as the author.** Google's [2023 guidance](https://developers.google.com/search/blog/2023/02/google-search-and-ai-content) calls that "probably not the best way" to disclose AI use. Name the person who checked and owns the piece.
- **A dead-end byline.** A name that links nowhere asks readers to take it on trust.

## Tools That Help

Two free Rankbox tools fit this job. The [schema generator](/tools/schema-generator) writes Person and Article JSON-LD to paste into your templates. The [Get Recommended by ChatGPT tool](/tools/get-recommended-by-chatgpt) drafts LinkedIn headlines and a quotable About-Me from your name and work, which helps keep an author's outside profiles in line with their author bio.

If you use Rankbox's [Citation-Ready Writer](/features/citation-ready-writer) for drafts, the author box still belongs to the person on your team who edits, checks and signs off each article.

## Frequently Asked Questions

### How long should an author bio be?

Write three lengths: 20 to 30 words under the byline, 50 to 80 words at the end of an article, and 150 to 250 words on the author's bio page. All three should come from the same facts, so readers and machines see one consistent story.

### What should an author bio include for SEO?

An author bio should include the person's full name, current role and employer, specific experience with numbers, credentials with their issuers, three to five topics, and links to outside profiles. Leave out vague adjectives and keyword lists, which Google's John Mueller called "kinda awkward, not reassuring."

### Do I need a separate author bio page?

Yes, for anyone who writes regularly. A bio page gives the byline a link target, gives Person markup a `url`, and gives outside profiles a page to link back to. Google lists "an employee page on a company website" as a valid profile page.

### Should an author bio be written in first or third person?

Third person works best for the medium and long versions, because it reads the same when someone quotes it. First person suits a personal blog. Pick one style per site and use it in every author bio.

### Where does Person schema go for an author?

Put the full Person markup on the author's bio page, inside a `ProfilePage`. On each article, add a shorter `Person` in the `author` field with the same `@id`, the name and a `url` pointing to the bio page.

### Does an author bio help a page rank on Google?

Not directly. Google's Search Liaison said in January 2024 that bylines "don't help you rank better." An author bio helps readers and quality raters judge who wrote a page, which supports the trust Google's systems try to reward.

## References

1. [Creating helpful, reliable, people-first content, Google Search Central](https://developers.google.com/search/docs/fundamentals/creating-helpful-content)
2. [Search Quality Rater Guidelines (September 2025), Google](https://guidelines.raterhub.com/searchqualityevaluatorguidelines.pdf)
3. [Article structured data, Google Search Central](https://developers.google.com/search/docs/appearance/structured-data/article)
4. [ProfilePage structured data, Google Search Central](https://developers.google.com/search/docs/appearance/structured-data/profile-page)
5. [Person, Schema.org](https://schema.org/Person)
6. [EducationalOccupationalCredential, Schema.org](https://schema.org/EducationalOccupationalCredential)
7. [Schema Markup Validator, Schema.org](https://validator.schema.org/)
8. [Google Search's guidance about AI-generated content, Google Search Central Blog (February 2023)](https://developers.google.com/search/blog/2023/02/google-search-and-ai-content)
9. [Google SearchLiaison on author bylines, X (8 January 2024)](https://x.com/searchliaison/status/1744373098432864386)
10. [John Mueller on author bios, Bluesky (February 2025)](https://bsky.app/profile/johnmu.com/post/3lhiuwlnhsc2a)
11. [Do Author Bylines Influence AI Visibility?, Seer Interactive (July 2026)](https://www.seerinteractive.com/work/case-studies/author-bylines)
12. [Association for Financial Professionals](https://www.financialprofessionals.org/)
