---
title: GitHub READMEs as AI SEO Fuel: Why Developers Rank in ChatGPT Without a Blog
description: How a GitHub README reaches Google, AI search and coding assistants, what is documented versus assumed, and a README and metadata plan for dev tools.
keyword: GitHub README
date: 2026-10-22
updated: 2026-10-22
written: 2026-09-30
author: Rankbox Team
tags: AI Search, Developer Marketing
---

Developer tools can show up in ChatGPT, Claude and Cursor answers without a company blog because a GitHub README already does much of a blog's job. It is public text on a site that lets AI crawlers in, it gets copied to package registries and doc servers that coding assistants query, and some code models were trained on data that included GitHub. What nobody has shown is that AI systems treat a GitHub README as "canon" and weight it above other pages.

That gap matters, because the popular version of this idea skips the evidence. GitHub's own robots.txt, as fetched on 30 September 2026, has a group that names GPTBot, OAI-SearchBot, ClaudeBot and PerplexityBot and lets them read repo pages, with a one-second crawl delay. That part is documented. But a study accepted to ACL 2026 found that LLMs writing code lean toward popular libraries, [using widely adopted libraries such as NumPy when they weren't needed in up to 45% of cases](https://arxiv.org/abs/2503.17181). A GitHub README helps. Adoption helps more.

This guide maps every path a GitHub README travels to reach an AI answer, grades each claim by its evidence, and gives you a README and metadata plan you can copy. For the narrower jobs, read our guides to [GitHub SEO for repositories](/blog/github-seo), [GitHub Pages SEO for docs sites](/blog/github-pages-seo) and [open source SEO tools](/blog/open-source-seo-tools).

## Key Takeaways

- GitHub's robots.txt names GPTBot, OAI-SearchBot, ClaudeBot, anthropic-ai and PerplexityBot in one group. Repo home pages and `/blob/` file pages are allowed; `/tree/` folder views, `/raw/` files and commit pages are blocked.
- Training on GitHub is documented for specific datasets and models: OpenAI's Codex (54 million public repos, 2020), Meta's LLaMA (GitHub was 4.5% of the mix) and BigCode's The Stack. Current frontier model cards don't say how much GitHub they used.
- The Stack v2 kept permissively licensed and unlicensed files and dropped copyleft code, so your license choice changes which open datasets can include you.
- Coding assistants read docs at run time. Context7 parses a repo's Markdown files and always includes root-level Markdown, and Cursor now tells users that agents find docs themselves.
- Links in a GitHub README and the About website link carry `rel="nofollow"`. Their value is discovery and entity signals, not link equity.
- No published study isolates GitHub's share of AI citations as of September 2026. Treat "developers rank without a blog" as a strong pattern, not a measured fact.
- Buying stars, automated starring and bulk promotion break GitHub's Acceptable Use Policies, and researchers found fake stars help for under two months.

## The README Reach Map: Six Paths From a Repo to an AI Answer

A GitHub README doesn't reach an AI answer through one door. It travels six paths, and each has a different owner, a different level of proof and a different lever you control. We call this the README Reach Map.

| Path                        | Who reads the README                                               | What is documented                                          | Evidence grade                   | Your lever                                          |
| --------------------------- | ------------------------------------------------------------------ | ----------------------------------------------------------- | -------------------------------- | --------------------------------------------------- |
| 1. The github.com repo page | Googlebot, Bingbot, OAI-SearchBot, PerplexityBot, Claude-SearchBot | GitHub's robots.txt allows repo pages for these bots        | Documented (robots.txt)          | Name, description, first screen of the README       |
| 2. Training datasets        | Code datasets and model builders                                   | Codex, LLaMA and The Stack describe GitHub data             | Documented for named models only | License choice, opt-out tools                       |
| 3. Package registries       | npm and PyPI pages, and crawlers that read them                    | Both render your README; The Stack v2 crawled registry docs | Documented                       | README in the package, homepage and repo fields     |
| 4. Doc servers for agents   | Context7, DeepWiki                                                 | Both index public GitHub repos for coding assistants        | Documented by the vendors        | `context7.json`, `.devin/wiki.json`, clean Markdown |
| 5. Live fetch by agents     | Claude Code, Cursor agents, ChatGPT-User                           | Claude Code converts pages to Markdown and summarizes them  | Documented behavior              | A first screen that survives summarizing            |
| 6. AI search citations      | ChatGPT, Perplexity, Google AI features                            | No study isolates GitHub's share                            | Unverified                       | Measure it yourself                                 |

Read the table from top to bottom and a pattern shows. The paths you can prove are the plain ones: crawl access, registry pages and doc servers. The path people talk about most, "LLMs treat READMEs as canon", is the one with the least proof.

### What GitHub lets crawlers fetch

You don't control github.com's robots.txt. GitHub does, and its file tells you what AI crawlers can read. The file opens with a note: "If you would like to crawl GitHub contact us." Then one group names five AI user agents, sets `Crawl-delay: 1` and lists the paths they may not fetch. Googlebot has no group of its own, so it follows the catch-all `*` group, which blocks the same repo paths. Bingbot gets a much shorter block list. Bytespider is blocked from everything.

Run a sample repo's paths through those rules and you get this for Googlebot and the named AI bots:

| Path on a repo                           | Allowed? | Rule that decides it      |
| ---------------------------------------- | -------- | ------------------------- |
| `/org/repo` (home page with README)      | Yes      | No rule matches           |
| `/org/repo/blob/main/docs/quickstart.md` | Yes      | No rule matches           |
| `/org/repo/releases/tag/v1.2.0`          | Yes      | No rule matches           |
| `/org/repo/tree/main/docs`               | No       | `Disallow: /*/tree/`      |
| `/org/repo/raw/main/README.md`           | No       | `Disallow: /*/raw/`       |
| `/org/repo/commits/main`                 | No       | `Disallow: /*/*/commits/` |
| `/org/repo?tab=readme-ov-file`           | No       | `Disallow: /*?tab=*`      |

The practical lesson is small but real. Folder views are closed to these crawlers, so a docs file is found through links, not by browsing. Link each important doc from your GitHub README by its relative path, and GitHub turns it into a `/blob/` URL that crawlers may fetch. Our [AI crawler directory](/blog/ai-crawler-directory) explains each bot's job; OpenAI [describes GPTBot](https://developers.openai.com/api/docs/bots) as the crawler for content that "may be used in training" and OAI-SearchBot as the one that surfaces sites in ChatGPT search.

### What's documented about GitHub code in model training

Here the record is solid for older and open models, and thin for today's closed ones.

- **Codex (OpenAI, 2021).** The [Codex paper](https://arxiv.org/abs/2107.03374) says its data "was collected in May 2020 from 54 million public software repositories hosted on GitHub", 159 GB of Python after filtering. A production version of Codex powered GitHub Copilot.
- **LLaMA (Meta, 2023).** The [LLaMA paper](https://arxiv.org/abs/2302.13971) lists GitHub as 4.5% of its pretraining mix, from the public GitHub dataset on Google BigQuery, keeping only Apache, BSD and MIT licensed projects.
- **The Stack (BigCode).** [Version 1](https://arxiv.org/abs/2211.15533) holds 3.1 TB of permissively licensed code. [Version 2](https://arxiv.org/abs/2402.19173), built on the Software Heritage archive, adds GitHub issues and pull requests plus documentation crawled from npm, PyPI and other registries. The authors took it from project homepages or "extracted information from the provided README or documentation files on the platform."
- **GitHub Copilot today.** GitHub's [Copilot FAQ](https://github.com/features/copilot) says its models were "trained on natural language text and source code from publicly available sources, including code in public repositories on GitHub."

What the record doesn't say is how much GitHub text any current frontier model saw, or how it was weighted. Our [shadow training data audit](/blog/shadow-training-data-audit) covers what each lab's model cards disclose, and the glossary entry on [LLM training data](/glossary/llm-training-data) explains why "captured" isn't the same as "learned".

### How coding assistants pull docs at run time

Training is a snapshot. Retrieval is live, and it's where a GitHub README earns its keep week to week.

- **Context7.** Upstash's Context7 "pulls up-to-date, version-specific documentation and code examples straight from the source" into a coding agent's prompt. Its [indexing docs](https://context7.com/docs/adding-libraries) say it parses `.md`, `.mdx`, `.rst`, `.txt` and `.ipynb` files and extracts code examples. Anyone can add a public library by pasting the repo URL.
- **DeepWiki.** Cognition's free [DeepWiki](https://docs.devin.ai/work-with-devin/deepwiki) builds wikis, diagrams and source links for public GitHub repos, and its MCP server needs no login.
- **Claude Code.** Its [WebFetch tool](https://code.claude.com/docs/en/tools-reference) converts a page to Markdown, truncates large pages and runs a small model over it. Claude usually gets that model's answer, not the raw page.
- **Cursor.** In August 2026 a Cursor staff member [wrote on the forum](https://forum.cursor.com/t/where-did-the-docs-go/161651) that the @Docs feature "has been removed" because "agents are good enough now at finding the docs themselves."

So your GitHub README gets read by machines that summarize, excerpt and rank chunks. A clear first screen and self-contained code blocks survive that trip better than a page of badges. That last point is inference from how these tools say they work, not a measured result. For the protocol behind these servers, see [MCP as the new sitemap](/blog/mcp-protocol-new-sitemap); for the llms.txt angle, see [how agents actually read llms.txt](/blog/how-to-get-indexed-by-llms-with-llms-txt).

## Grading the Claims Behind "GitHub README as AI SEO Fuel"

The idea behind this post comes with five strong claims. Here is what backs each one, as of September 2026.

| Claim                                                                    | Verdict                                                               | Evidence type                                                                                                       |
| ------------------------------------------------------------------------ | --------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| Language models ingest GitHub READMEs                                    | True for named datasets and models; unknown for current closed models | Vendor papers and model docs (Codex, LLaMA, The Stack, Copilot FAQ)                                                 |
| They weight READMEs as "technical canon"                                 | Unproven                                                              | No vendor documents README weighting                                                                                |
| A repo creates a lasting entity footprint in AI assistants               | Partly true                                                           | Training snapshots persist per model; live tools read the current repo; one independent study shows popularity bias |
| Tools get recommended because READMEs have clean tables and quick starts | Plausible, not shown                                                  | Inference from how Context7 and Claude Code process pages                                                           |
| Developers rank in ChatGPT without a blog                                | A pattern, not a measurement                                          | No study isolates GitHub citations                                                                                  |

Two corrections are worth spelling out.

First, copies don't multiply your weight the way people assume. Training pipelines remove duplicates. LLaMA deduplicated GitHub files at the file level, and The Stack's authors report that near-deduplicating the data improved results across all their experiments. Forks and mirrors of your GitHub README are likely collapsed, not counted many times.

Second, the "footprint" is only as lasting as your project. A model trained last year keeps last year's snapshot. Live tools like Context7 re-read your repo, and Context7 says it refreshes libraries based on popularity. The independent evidence points the same way: [Twist et al.](https://arxiv.org/abs/2503.17181), accepted to Findings of ACL 2026, found eight LLMs favored familiar, popular options, and in high-performance tasks where Python wasn't the best fit, it was still the pick 58% of the time. Popularity compounds. A GitHub README can't replace users.

On citations, the best available source is a PR firm's synthesis of six third-party studies, the [AI Platform Citation Source Index](https://everything-pr.com/ai-platform-citation-source-index-2026). It ranks GitHub 36th of 50 and calls it "dominant for repo and library queries", but it gives no share figure. Semrush's [three-month study](https://www.semrush.com/blog/most-cited-domains-ai/) of the most-cited domains doesn't mention GitHub in its text. That's thin. Test your own category before you bet a roadmap on it.

## A GitHub README Built for Humans and Machines

A good GitHub README answers the same questions for a person skimming on a phone and a model summarizing a chunk. GitHub's [README guidance](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/about-readmes) lists them: what the project does, why it's useful, how to start, where to get help and who maintains it. The table turns that into sections.

| Section                       | What to write                                                                  | Why people need it              | Why machines need it                                 |
| ----------------------------- | ------------------------------------------------------------------------------ | ------------------------------- | ---------------------------------------------------- |
| Title and one-line definition | "`invoice-sdk` is a Node.js library for creating and sending agency invoices." | Know in five seconds if it fits | A definitional sentence is the easiest line to quote |
| Install                       | One command per package manager                                                | Copy and go                     | Exact package name, so agents don't guess one        |
| Quick start                   | The smallest example that runs, under 15 lines                                 | First success fast              | A self-contained code block survives chunking        |
| Features table                | Feature, one-line description, since which version                             | Scan scope                      | Tables keep facts paired with their labels           |
| Compatibility                 | Runtimes and versions supported                                                | Avoid a bad install             | Version facts answer "does X support Y" prompts      |
| Configuration                 | Option, type, default, meaning                                                 | Tune it                         | Option names match what users paste into prompts     |
| Docs and links                | Relative links to docs files, changelog, registry page                         | Go deeper                       | Crawlers find `/blob/` docs through these links      |
| Support and license           | Where to ask, license name, citation                                           | Trust and legal clarity         | License shapes dataset inclusion                     |

Package names deserve their own warning. [Spracklen et al.](https://arxiv.org/abs/2406.10279) found code models suggest packages that don't exist, at least 5.2% of the time for commercial models and 21.7% for open ones. Printing your exact install command near the top of your GitHub README gives every reader, human or model, the real name.

### Rules for the first screen of a GitHub README

- **Lead with the definition, not a logo.** Text inside an image is invisible to a text parser. Put the sentence first and the badge row after it.
- **Keep one idea per heading.** GitHub builds a table of contents from your headings, and chunkers split on them too.
- **Use relative links.** GitHub rewrites them to the current branch, and they resolve to crawlable `/blob/` pages.
- **Stay well under the limit.** GitHub truncates README content beyond 500 KiB on the page.
- **Move long docs out.** GitHub's own advice is that a README "should only contain information necessary for developers to get started." Longer docs belong on a docs site, and our [GitHub Pages SEO guide](/blog/github-pages-seo) covers hosting one.

Don't put your docs in the repo wiki if you want them found. GitHub's [wiki docs](https://docs.github.com/en/communities/documenting-your-project-with-wikis/about-wikis) say search engines "will only index wikis with 500 or more stars" that block public editing.

## Repository Metadata That Travels With Your GitHub README

The GitHub README is the body. The metadata is the title tag, the snippet and the label that other systems copy. On a live repo page we inspected, GitHub built the HTML `<title>` as "GitHub - owner/repo: description" and reused the description as the meta description and Open Graph text.

1. **Description.** One sentence with your category word in it. It becomes the page title and snippet, and GitHub's repo search looks only at the name, description and topics unless someone adds `in:readme`.
2. **Website link.** Point it at your docs site. It's marked `nofollow`, but it tells readers and crawlers where the official docs live.
3. **Topics.** Up to 20, lowercase, hyphens allowed, 50 characters each, per GitHub's [topics docs](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/classifying-your-repository-with-topics). Use the words your buyers type, like `invoicing` and `payments-api`.
4. **Releases.** Tagged releases with notes give dated, versioned facts. They also give Context7 tags to index older versions from.
5. **License.** Add a `LICENSE` file. GitHub detects it with the open source Licensee gem. Without one, default copyright applies. The Stack v1 only took permissively licensed code, while v2 also took unlicensed files.
6. **CITATION.cff.** A machine-readable citation file adds a "Cite this repository" button with APA and BibTeX output. It's small, and it states your authors, version and URL in a standard format.
7. **Social preview.** A 1280 × 640 image controls how the repo looks when shared.

Our [GitHub SEO guide](/blog/github-seo) goes deeper on each field and on GitHub's own search.

## Connect the Repo to Your Entity

An AI answer can only credit your company for a repo if the web says, in several places, that the repo is yours. That's [entity SEO](/glossary/entity-seo): making the same name, definition and links agree everywhere. We call the pattern for developer tools the Repo Entity Loop. Every node points to the others.

- **Your docs site to the repo.** On the docs site, add Organization markup with `sameAs` links to your GitHub org and registry pages. Google's [Organization docs](https://developers.google.com/search/docs/appearance/structured-data/organization) define `sameAs` as a page "on another website with additional information about your organization." Schema.org's `SoftwareSourceCode` type has a [`codeRepository`](https://schema.org/SoftwareSourceCode) property for the repo URL.
- **The repo to your domain.** Set the About website link, and verify your domain for the GitHub organization. GitHub's [domain verification](https://docs.github.com/en/organizations/managing-organization-settings/verifying-or-approving-a-domain-for-your-organization) uses a DNS TXT record and adds a "Verified" badge to the org profile.
- **The registries to both.** Fill npm's `homepage` and `repository` fields, and PyPI's `[project.urls]`. PyPI marks URLs as [verified](https://docs.pypi.org/project_metadata/) when you publish through Trusted Publishing from GitHub Actions, which covers the repo and its `github.io` pages.
- **The same sentence everywhere.** Use one definition on the docs home page, the repo description, the registry summary and the README's first line.

This is the developer version of the checklist in [Entity Authority in the AI Era](/blog/entity-authority-in-the-ai-era). For the JSON-LD graph itself, see [building a knowledge graph for AI](/blog/knowledge-graph-for-ai).

## Worked Example: Tallyfold's Open-Source Invoicing SDK

Tallyfold is a made-up invoicing and payments app for agencies. Its developers publish a small open-source SDK, `tallyfold/invoice-sdk`, so agencies can create invoices from their own tools. The names here are fictional; we checked that the GitHub org name and the npm and PyPI package names are unused, so don't go looking for them.

### Before: a repo only its authors could love

The repo had no description and no topics. The GitHub README opened with a logo image, six badges and an "Overview" paragraph about Tallyfold's mission, with the install command buried below it. Setup lived in the wiki. With 40 stars and open wiki editing, the repo fell short of GitHub's rule for wiki indexing. There was no license and no release, and the npm page had an empty `homepage` field.

### After: the first screen

```markdown
# invoice-sdk

invoice-sdk is a Node.js library for creating, sending and tracking
agency invoices through the Tallyfold API.

npm install @tallyfold/invoice-sdk

## Quick start

(12-line example that creates and sends one invoice)

## Features

| Feature | What it does | Since |
| Recurring invoices | Schedules monthly or weekly invoices | 1.1 |
| Multi-currency | Bills in 30 currencies with stored FX rates | 1.2 |

Docs: docs/quickstart.md · Changelog: CHANGELOG.md · License: MIT
```

They also added a description ("Node.js SDK for creating and sending agency invoices"), six topics, the docs site as the website link, an MIT license, a `CITATION.cff`, a tagged 1.2.0 release and a `context7.json` that points Context7 at the `docs` folder.

### Scoring the change

We score ten yes-or-no checks, one point each.

| Check                                                   | Before      | After        |
| ------------------------------------------------------- | ----------- | ------------ |
| Definition in the first sentence                        | 0           | 1            |
| Install command with exact package name                 | 1           | 1            |
| Runnable quick start under 15 lines                     | 0           | 1            |
| Features or options in a table                          | 0           | 1            |
| Docs linked by relative path, not the wiki              | 0           | 1            |
| Description and topics filled                           | 0           | 1            |
| License file                                            | 0           | 1            |
| Tagged release with notes                               | 0           | 1            |
| Website link and registry fields point to the docs site | 0           | 1            |
| Same one-line definition on docs, repo and registry     | 0           | 1            |
| **Total**                                               | **1 of 10** | **10 of 10** |

The score measures readiness, not results. To see whether it changed anything, Tallyfold watches three things for a quarter: the repo's Traffic page, which [lists referring sites](https://docs.github.com/en/repositories/viewing-activity-and-data-for-your-repository/viewing-traffic-to-a-repository) for the last 14 days; a fixed panel of prompts such as "best Node.js invoicing library for agencies"; and whether Context7 and DeepWiki return the new quick start.

## Platform Rules: What Not to Do

Everything above is allowed on GitHub and fits Google's rules. A few shortcuts don't.

- **Don't buy or automate stars.** GitHub's [Acceptable Use Policies](https://docs.github.com/en/site-policy/acceptable-use-policies/github-acceptable-use-policies) ban "rank abuse, such as automated starring or following," fake accounts and secondary markets for inauthentic activity. A [study accepted to ICSE 2026](https://arxiv.org/abs/2412.13459) of six million suspected fake stars found they "only have a promotion effect in the short term (i.e., less than two months) and become a liability in the long term."
- **Keep promotion tied to the project.** GitHub allows "static images, links, and promotional text" in a README, but they "must be related to the project you are hosting." A README that's really an ad page breaks the policy.
- **Don't mass-produce thin repos.** Google's spam policies define [scaled content abuse](/glossary/scaled-content-abuse) as many pages made to manipulate rankings, and list "spammy accounts on hosting services that anyone can register for" as user-generated spam.
- **Don't plant hidden instructions for AI.** Text aimed at steering an assistant, hidden in comments or white text, is a security problem for your users and a trust problem for you. Our investigation of [indirect prompt injection and black hat GEO](/blog/indirect-prompt-injection-black-hat-geo) explains the risks. Write for the reader you can see.

## How Rankbox Fits for Developer Tools

Rankbox isn't built to write a GitHub README, and it doesn't publish anything to GitHub. Where it helps is the docs site and blog around the repo: its [Citation-Ready Writer](/features/citation-ready-writer) researches the live web and writes 2,000 to 3,500-word, source-backed articles, such as a guide to sending agency invoices from Node.js, that reach your site through Rankbox's API. Developer teams can also call Rankbox's three research tools from Cursor, Claude or ChatGPT's Developer mode through the [MCP server](/integrations/mcp).

Rankbox doesn't track AI citations today, so measure results with your own prompt panel, as our guide to [measuring GEO](/blog/how-to-measure-geo) explains. The Business plan is $49.50 a month with a 7-day trial on the [pricing page](/pricing).

## Frequently Asked Questions

### Does ChatGPT read a GitHub README?

It can. GitHub's robots.txt allows OAI-SearchBot, which OpenAI uses to surface pages in ChatGPT search, to fetch repo home pages where the README appears. OpenAI hasn't published how often ChatGPT cites GitHub, and no independent study isolates it as of September 2026.

### Do AI models train on GitHub code?

Some are documented to. OpenAI's Codex used 54 million public GitHub repos, Meta's LLaMA drew 4.5% of its data from GitHub, and BigCode's The Stack is built from public code. GitHub says Copilot's models were trained on public repos. Current frontier model cards don't give a GitHub share.

### Are links in a GitHub README nofollow?

Yes. On repo pages inspected on 30 September 2026, README links carried `rel="nofollow"` and the About website link carried `rel="noopener noreferrer nofollow"`. Google says nofollow asks it not to associate your page with the target, and that linked pages may still be found through other means. Don't expect ranking credit from them.

### What should a GitHub README include for AI search?

Start with a one-sentence definition, then the exact install command, a short runnable quick start, a features table, supported versions, relative links to docs, and the license. Keep each section under its own heading so it still makes sense when a tool lifts it out alone.

### Does my license affect whether my code ends up in training data?

It can for open datasets. The Stack v1 kept only permissively licensed code, and The Stack v2 kept permissive and unlicensed files but dropped copyleft ones. Closed labs don't publish license filters, so for them the effect is unknown.

### Can I stop AI crawlers from reading my public repo?

Not through robots.txt, because GitHub controls github.com's file. You can make the repo private, or ask to be removed from specific open datasets: The Stack offers an "Am I in The Stack" lookup and an opt-out process.

## References

1. [GitHub robots.txt, GitHub](https://github.com/robots.txt)
2. [Overview of OpenAI crawlers, OpenAI](https://developers.openai.com/api/docs/bots)
3. [Evaluating Large Language Models Trained on Code (Chen et al., 2021)](https://arxiv.org/abs/2107.03374)
4. [LLaMA: Open and Efficient Foundation Language Models (Touvron et al., 2023)](https://arxiv.org/abs/2302.13971)
5. [The Stack: 3 TB of permissively licensed source code (Kocetkov et al., 2022)](https://arxiv.org/abs/2211.15533)
6. [StarCoder 2 and The Stack v2 (Lozhkov et al., 2024)](https://arxiv.org/abs/2402.19173)
7. [GitHub Copilot features and FAQ, GitHub](https://github.com/features/copilot)
8. [A Study of LLMs' Preferences for Libraries and Programming Languages (Twist et al., ACL Findings 2026)](https://arxiv.org/abs/2503.17181)
9. [We Have a Package for You! (Spracklen et al., USENIX Security 2025)](https://arxiv.org/abs/2406.10279)
10. [Six Million (Suspected) Fake Stars in GitHub (He et al., ICSE 2026)](https://arxiv.org/abs/2412.13459)
11. [Adding Libraries, Context7](https://context7.com/docs/adding-libraries)
12. [DeepWiki repository wikis, Devin Docs](https://docs.devin.ai/work-with-devin/deepwiki)
13. [Tools reference: WebFetch, Claude Code Docs](https://code.claude.com/docs/en/tools-reference)
14. [Where did the @docs go?, Cursor Community Forum](https://forum.cursor.com/t/where-did-the-docs-go/161651)
15. [About the repository README file, GitHub Docs](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/about-readmes)
16. [About wikis, GitHub Docs](https://docs.github.com/en/communities/documenting-your-project-with-wikis/about-wikis)
17. [GitHub Acceptable Use Policies, GitHub Docs](https://docs.github.com/en/site-policy/acceptable-use-policies/github-acceptable-use-policies)
18. [Organization structured data, Google Search Central](https://developers.google.com/search/docs/appearance/structured-data/organization)
19. [Project metadata, PyPI Docs](https://docs.pypi.org/project_metadata/)
20. [AI Platform Citation Source Index 2026, Everything-PR](https://everything-pr.com/ai-platform-citation-source-index-2026)
