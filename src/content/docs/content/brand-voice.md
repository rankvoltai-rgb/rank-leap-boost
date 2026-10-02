---
title: Brand voice and writing settings
nav_title: Brand voice
description: Set the brand, audience, tone, writing style and house rules Rankbox writes with, see the exact brief the writer reads, and write house rules that work.
order: 5
updated: 2026-10-02
---

Your brand voice settings tell Rankbox who it writes for and how. They live in two sections of **Dashboard → Settings**: **Your brand** and **How autopilot writes**. Rankbox turns them into a short brief and puts that brief at the top of every article it writes and every AI rewrite in the editor. Set them once, check the preview, and every new article follows them.

## Where the settings live

Open **Dashboard → Settings**. The page edits the site that's active in the sidebar. With [Studio](/docs/account/studio), every site has its own brand and writing settings, so switch sites to edit another one.

Settings save as you type. The section header shows "Saving…" while a change is pending and "Saved" once it's stored, a moment after you stop typing. If a save fails, you see "Couldn't save" with **Retry**. Leaving the page saves anything still pending.

## Your brand

"Who autopilot writes for. Every article is built around this."

| Field | What to enter | Used by the writer |
| --- | --- | --- |
| **Brand name** | How articles refer to you when they mention what you offer, for example "Plannora" | Yes, as `Brand` |
| **Website** | The site your articles are published to. Typing `example.com` saves as `https://example.com` | No |
| **What you sell** | Two or three sentences on what you offer and who it's for. The writer uses it to tie every article back to you | Yes, as `Product context` |

## How autopilot writes

"The voice every article is written in. Changes apply to the next article it writes."

| Field | Options | Default when blank |
| --- | --- | --- |
| **Audience** | Free text. Quick picks: **Founders / Entrepreneurs**, **Marketers**, **Small business owners**, **Developers**, **Agencies** | Founders / Entrepreneurs |
| **Tone** | **Professional**, **Friendly**, **Confident**, **Conversational**, **Authoritative**, **Playful**, or **Your own** | Professional |
| **Writing style** | **Balanced**, **Concise and actionable**, **In-depth and data-driven**, **Story-led**, **Step-by-step**, or **Your own** | Balanced |
| **House rules** | Free text: anything the writer must always or never do. One rule per line works best | None |
| **What autopilot reads** | A read-only preview of the brief, built from the fields above | Not editable |

Audience sets what the writer explains and what it can assume. Tone is how it feels to read. Writing style is how ideas are laid out on the page. Choose **Your own** under Tone or Writing style to describe it in a few words. A blank Tone or Writing style shows its default as the selected option, and a blank Audience shows its default as grey placeholder text, so you always see what's in effect.

## What autopilot reads

**What autopilot reads** shows the exact brief the writer receives. It's built by the same code the writer uses, so the preview and the real brief never differ. With the example values from the Settings placeholders, it looks like this:

```text
Brand: Plannora
Product context: Plannora is a project manager for teams of 2–20 who find Jira too heavy. It replaces standups with a daily digest.
Tone: Professional
Writing style: Balanced
Target audience: Founders / Entrepreneurs
Brand voice instructions: Say "teams", not "users".
Never name competitors.
Use US spelling.
Always apply Rankbox core rules: keyword optimization, clear heading structure, internal linking logic, and high readability.
```

Each line maps to one setting:

| Brief line | Setting | If the setting is blank |
| --- | --- | --- |
| `Brand:` | **Brand name** | "the brand" |
| `Product context:` | **What you sell** | Left empty |
| `Tone:` | **Tone** | "Professional" |
| `Writing style:` | **Writing style** | "Balanced" |
| `Target audience:` | **Audience** | "Founders / Entrepreneurs" |
| `Brand voice instructions:` | **House rules** | Left empty |

The last line is fixed and always present.

## How the brief feeds generation

The brief is the first thing in each of these prompts:

- **The article draft.** It comes before Rankbox's article blueprint, the live research and any backlink-exchange instruction. See [How articles are written](/docs/content/writing).
- **Every revision pass.** When the draft is rewritten to fix failing score checks, the brief rides along, so the voice survives the rewrite.
- **The editor's AI actions.** **Improve SEO**, **Rewrite**, **Expand** and **Shorten** rewrite your selection in the site's voice. See [Editing articles](/docs/content/editor).

Autopilot and **Write now** read the same brief. Changes take effect from the next article written or the next AI action. Articles already written aren't rewritten. Research and the content plan don't use these settings; they work from your website. [Reddit Presence](/docs/growth/reddit-presence) reuses **Brand name**, **What you sell** and **Audience** when it drafts replies, and **Tone** unless Reddit Presence has a tone of its own.

## Settings filled in by onboarding

[Onboarding](/docs/get-started/onboarding) fills most of these settings from your website so the first articles aren't generic. Review them before your first article.

| Setting | Filled from |
| --- | --- |
| **Brand name** | Step 1, **Brand name** |
| **Website** | Step 1, **Website** |
| **What you sell** | Step 1, **What you do** |
| **Tone** | Step 2, **Brand voice** (a few words describing how your site writes, shown as **Your own**) |
| **Audience** | Step 2, **Who you're writing for** |
| **House rules** | A line in the form "Niche: … Geo: …" built from the niche and market in step 2 |

Replace the "Niche: … Geo: …" line with real house rules, or keep it and add yours below it.

## Write house rules that work

House rules are instructions to the language model, written in plain sentences. The best ones are specific and checkable.

```text
Say "teams", not "users".
Use US spelling.
Write the product name as "Plannora", never "PlanNora".
Write as "we" when talking about our product.
Don't promise rankings, revenue or guaranteed results.
Don't give legal or medical advice; tell readers to ask a professional.
Use sentence case in headings.
Show prices in US dollars.
End the conclusion by pointing readers to our free plan.
```

Some rules fight the article blueprint and the score, and are likely to be ignored or undone by the revision passes:

| Rule to avoid | Why it doesn't hold |
| --- | --- |
| "Keep articles under 800 words." | The writer targets 2,750 words, and the depth check passes at 1,500 |
| "No FAQ section." / "No headings." | The blueprint requires both, and the score checks for them |
| "Mention the keyword only once." | The score checks the keyword in the title, the introduction and a 0.5% to 2.5% density |
| "Never link to other sites." | The writer cites the live sources it researched, and the score checks for links |

> [!IMPORTANT]
> House rules guide the model; they don't filter its output. Rankbox doesn't check finished articles against your rules. When a rule matters, such as legal or compliance wording, review each article before it's published.

Whether and where an article mentions your product is up to the model, guided by **What you sell** and your house rules. If you want a specific mention or call to action, write it as a house rule.

## Troubleshooting

| What you see | What to do |
| --- | --- |
| Articles call you "the brand" | **Brand name** is empty. Fill it in |
| Articles don't connect back to your product | Make **What you sell** concrete: what it does, for whom, and the main problem it solves |
| A rule is ignored | Make it concrete, check it doesn't conflict with the blueprint, and read **What autopilot reads** to confirm it's there |
| Old articles still use the old voice | Settings apply only to new writing. Use **Rewrite** in the editor on passages you want to change |
| "Couldn't save" | Click **Retry** in the section header |

## Related

- [How articles are written](/docs/content/writing): the full pipeline the brief feeds into
- [Editing articles](/docs/content/editor): AI rewrites in your voice
- [Autopilot and the publishing schedule](/docs/content/autopilot): the other half of the Settings page
- [Account and site settings](/docs/account/settings): the rest of Settings
- [Research: the questions buyers ask AI](/docs/content/research): how onboarding learns your brand
