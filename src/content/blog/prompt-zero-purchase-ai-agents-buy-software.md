---
title: The "Prompt-Zero" Purchase: When AI Agents Buy Software Without a Human Ever Seeing the SERP
description: A prompt-zero purchase is when an AI agent picks and starts software with no person on the results page. What agents do today, and a SaaS checklist.
keyword: prompt-zero
date: 2026-10-01
updated: 2026-10-01
written: 2026-09-30
author: Rankbox Team
tags: AI Search, AI Agents
---

A prompt-zero purchase is a software purchase where one instruction to an AI agent replaces the whole search journey. The agent finds the options, checks prices and integrations, and starts a trial, and no person ever looks at a results page. As of September 2026, the first half of that is real: agents already research vendors, compare them and write purchase proposals. The second half, where an agent creates the account and pays, exists only in narrow lanes, and most agent products are built to stop and hand control back to a person.

Buyers are ready for the first half and wary of the second. In G2's [July 2026 survey of more than 1,000 software buyers](https://company.g2.com/news/buyer-behavior-2026), 61% said they use or plan to use AI agents when buying. Only 9% were comfortable letting an agent execute purchases within approved guardrails, and just 2% would allow it without pre-approval.

A popular prediction goes further: by 2027, an operations team will tell an agent to find a tool that connects with Shopify, costs under $100 a month, and set up the trial. We treat that as a forecast, and keep apart what exists today (checked on vendor pages and dated), what others project (named), and our own view (labelled). Then comes the practical part: a checklist, a fictional agent run and the steps where people still sign off. For the wider discipline, read our guide to [agentic SEO for autonomous AI buyers](/blog/agentic-seo-autonomous-ai-buyers), or start with the plain definition in [what is agentic SEO](/blog/what-is-agentic-seo).

## Key Takeaways

- A prompt-zero purchase has two halves. Prompt-zero evaluation (research, comparison, a proposal) is common today. The purchase itself (signup and payment by the agent) is rare outside a few lanes.
- The clearest live lane for software is Stripe Projects: coding agents create accounts and pick paid plans with 49 providers, after a person adds a payment method.
- OpenAI scaled back Instant Checkout in March 2026 and now lets merchants use their own checkout. The Agentic Commerce Protocol it runs with Stripe is still in beta.
- Agent products stop at the same doors. Claude in Chrome is barred from creating accounts and making purchases, the cloud browser in ChatGPT Work pauses for sign-ins and asks before payments, and AWS Marketplace's agent mode skips private pricing and purchases.
- Gartner projects that 90% of B2B buying will be "AI agent intermediated" by 2028. That's a forecast with no public method, and "intermediated" doesn't mean "autonomous."
- The sites that win prompt-zero evaluations publish pricing as text, plan limits, integration docs, public API docs, a security page and plain trial terms. Our ten-point checklist scores them.
- Payment, contracts and security review still end with a person. Publish what those people need too.

## What a Prompt-Zero Purchase Means

The name describes who does the typing. In a classic journey, the buyer types a keyword, scans results, opens tabs and compares. In a prompt-zero purchase, the buyer writes one instruction and the agent does everything after it, so nothing a vendor shows is seen first by a person.

### The results page doesn't vanish; it goes out of sight

Agents still search. OpenAI's [search help page](https://help.openai.com/en/articles/9237897-chatgpt-search) says ChatGPT search "typically rewrites your query into one or more targeted queries" that it sends to its search providers. In Nectiv's [August 2026 re-run of about 4,000 prompts](https://nectivdigital.com/blog/chatgpt-tripled-fan-out-queries-data-study), software prompts averaged 10.7 of these [fan-out searches](/glossary/query-fan-out) each, the most of any category, and 64% of all fan-out queries were `site:` searches aimed at specific domains.

So the search results still exist, and your site is still read. The buyer just never sees either. That changes what "ranking" means for a prompt-zero buyer. A human skims the top three results. An agent reads your pricing, integration and security pages, often through a `site:` search on your domain, and either finds the facts or reports that it couldn't.

### The Prompt-Zero Ladder

This ladder is Rankbox's planning model, not an industry standard.

| Level                  | Who does what                                                  | Does a person see the results page? | Evidence as of September 2026                                                                                                                                                                                                                  |
| ---------------------- | -------------------------------------------------------------- | ----------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 0. Search              | The buyer searches, clicks and compares                        | Yes                                 | Classic search                                                                                                                                                                                                                                 |
| 1. Answer              | An AI answer builds the shortlist; the buyer clicks through    | No, only the answer                 | 51% of software buyers start research in a chatbot more often than in Google ([G2, April 2026](https://www.prnewswire.com/news-releases/new-g2-research-half-of-b2b-software-buyers-now-start-their-research-with-ai-chatbots-302742807.html)) |
| 2. Evaluation          | An agent researches, compares and proposes; the buyer signs up | No                                  | AWS Marketplace agent mode; 61% of buyers use or plan to use agents                                                                                                                                                                            |
| 3. Delegated signup    | An agent signs up and starts a plan inside limits a person set | No                                  | Stripe Projects, with 49 providers                                                                                                                                                                                                             |
| 4. Autonomous purchase | An agent buys and renews with no pre-approval                  | No                                  | 2% of buyers would allow it                                                                                                                                                                                                                    |

We call levels 2 to 4 prompt-zero. Of those, level 2 is the one buyers widely use today, while levels 3 and 4 are still narrow. That's why the rest of this post spends so much time on what an agent needs to evaluate you.

## What Exists Today: Agentic Commerce Rails as of 30 September 2026

"Agentic commerce" covers a stack of new protocols and programs. Most were built for retail goods, not software. Every row below comes from the vendor's own page.

| Program                                                                                                                                | Who runs it                              | What it does                                                         | Status                                                                              | Fit for SaaS                                                                 |
| -------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------- | -------------------------------------------------------------------- | ----------------------------------------------------------------------------------- | ---------------------------------------------------------------------------- |
| [Agentic Commerce Protocol (ACP)](https://github.com/agentic-commerce-protocol/agentic-commerce-protocol)                              | OpenAI and Stripe                        | Open standard for agent checkout, feeds and orders                   | Beta; latest stable spec 17 April 2026                                              | Its [site](https://agenticcommerce.dev) lists "digital goods, subscriptions" |
| Instant Checkout in ChatGPT                                                                                                            | OpenAI                                   | Pay without leaving ChatGPT                                          | Scaled back in March 2026; still offered "for some eligible products and merchants" | Built for retail products                                                    |
| [Agent Payments Protocol (AP2)](https://cloud.google.com/blog/products/ai-machine-learning/announcing-agents-to-payments-ap2-protocol) | Google, with more than 60 organizations  | Signed "mandates" that prove what a user authorized                  | Announced 16 September 2025                                                         | Google names software-license scaling as a possible B2B use                  |
| [Universal Commerce Protocol (UCP)](https://developers.googleblog.com/under-the-hood-universal-commerce-protocol-ucp/)                 | Google, with Shopify and large retailers | Discovery and checkout; capabilities published at `/.well-known/ucp` | Released 11 January 2026                                                            | Shopping only in the current spec                                            |
| [Agentic Commerce Suite and Link wallets for agents](https://stripe.com/newsroom/news/sessions-2026)                                   | Stripe                                   | Sell inside AI apps; one-time card per agent task                    | Link wallets launched 29 April 2026; "you approve each payment"                     | Consumer checkout                                                            |
| [Stripe Projects](https://docs.stripe.com/projects)                                                                                    | Stripe and 49 providers                  | Agents create provider accounts, pick plans and sync API keys        | Open to all since April 2026                                                        | Yes, for developer services                                                  |
| [AWS Marketplace agent mode](https://docs.aws.amazon.com/marketplace/latest/buyerguide/agent-mode.html)                                | AWS                                      | Discovery, comparison and purchase proposals                         | Announced before re:Invent 2025                                                     | Yes, but no purchase transactions                                            |
| [Trusted Agent Protocol](https://usa.visa.com/about-visa/newsroom/press-releases.releaseId.21716.html)                                 | Visa, built with Cloudflare              | Helps merchants tell approved agents from bots                       | Unveiled 14 October 2025                                                            | Any site with bot protection                                                 |
| [Agent Pay](https://www.mastercard.com/us/en/news-and-trends/stories/2025/agentic-commerce-momentum.html)                              | Mastercard                               | Agentic tokens with user-set limits, even for recurring payments     | All US cardholders due by mid-November 2025, per Mastercard                         | Card rail, not a storefront                                                  |

Consumer checkout inside assistants, such as Copilot Checkout, Perplexity's Instant Buy and Google's Universal Cart, is covered in our [guide to the four conversational buyer stages](/blog/ai-search-intent-conversational-buyer-stages).

### What got pulled back

OpenAI launched Instant Checkout with ACP in September 2025 and changed course in March 2026. Its [product discovery post](https://openai.com/index/powering-product-discovery-in-chatgpt/) says "the initial version of Instant Checkout did not offer the level of flexibility that we aspire to provide, so we're allowing merchants to use their own checkout experiences while we focus our efforts on product discovery." The protocol lives on, and OpenAI's [commerce docs](https://developers.openai.com/commerce/guides/get-started.md) still onboard merchant feeds for approved partners.

The biggest AI platform put its effort into discovery and handed checkout back to the merchant. For a SaaS company, your own signup and trial pages remain the checkout, even in a prompt-zero purchase.

### The clearest lane where agents already buy software

Stripe Projects is the clearest prompt-zero purchase you can point to today. Stripe's [docs](https://docs.stripe.com/projects) say one command can "create your accounts, sync credentials to your `.env`, and handle billing through Stripe." A `catalog` command lists "all available providers, their service categories, plan tiers, add-ons, and pricing." When an agent selects a paid plan, Stripe passes the provider a Shared Payment Token instead of your card details.

In that flow, nobody needs to search. A coding agent can read a machine-readable catalog, compare plan tiers and buy one, because the providers "co-designed the integration protocol with Stripe," which "standardizes provisioning, plan selection, upgrades, and credential handoff."

The human is still there, one step earlier: a person signs in to Stripe, links or creates provider accounts and adds a payment method before the session. Stripe's [June 2026 update](https://stripe.com/blog/stripe-projects-adds-new-agents-providers-developer-controls) added per-provider spend caps and a development environment by default. It also said agents make up "nearly 40%" of traffic to Stripe's docs, while steps like "setting up accounts" were "still too hard for agents to do on their own."

## What Agents Do at a SaaS Signup Page Today

Our [agentic SEO guide](/blog/agentic-seo-autonomous-ai-buyers) covers how agents read pages. This section covers the moment that decides a prompt-zero purchase: the signup form, as each vendor describes it.

| Agent                             | Creating an account                                                        | Paying                                                                            | Logins and checks                                             | Source                                                                                                   |
| --------------------------------- | -------------------------------------------------------------------------- | --------------------------------------------------------------------------------- | ------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| Cloud browser in ChatGPT Work     | Enters information into forms on "supported public and signed-in websites" | Asks in chat before a "financial, legal, account, or other real-world commitment" | Pauses for sign-in through a secure form; some sites block it | [OpenAI Help](https://help.openai.com/en/articles/20001280-using-cloud-browser-in-chatgpt)               |
| Claude in Chrome                  | Prohibited in every permission mode                                        | "Making purchases or financial transactions" is prohibited                        | Won't bypass bot authorizations                               | [Anthropic Help](https://support.claude.com/en/articles/12902446-claude-in-chrome-permissions-guide)     |
| Gemini in Chrome auto browse      | Fills in forms                                                             | Pauses to ask you to confirm or complete purchases                                | Can use Google Password Manager if you allow it               | [Google, January 2026](https://blog.google/products-and-platforms/products/chrome/gemini-3-auto-browse/) |
| AWS Marketplace agent mode        | Doesn't sign up                                                            | Doesn't handle "direct procurement or purchase transactions"                      | Also skips private pricing                                    | [AWS docs](https://docs.aws.amazon.com/marketplace/latest/buyerguide/agent-mode.html)                    |
| Coding agents via Stripe Projects | Creates or links provider accounts                                         | Paid plans through a Shared Payment Token                                         | A person signs in to Stripe first                             | [Stripe docs](https://docs.stripe.com/projects)                                                          |

OpenAI's browser agent changed name and shape this year. Its help page for ChatGPT agent, [updated in mid-September 2026](https://help.openai.com/en/articles/11752874-chatgpt-agent), now says "ChatGPT agent is no longer available" and points to ChatGPT Work. While it existed, ChatGPT agent filled in forms in a virtual browser and handed logins back to the user. Its successor, the [cloud browser](https://help.openai.com/en/articles/20001280-using-cloud-browser-in-chatgpt), says outright that it can't finish every transaction: "a sign-in or transaction step may not be supported," and "each website ultimately decides whether to allow cloud browser traffic."

Two details matter for B2B sellers. The cloud browser is available only in ChatGPT Work on paid plans, and its availability "may depend on workspace permissions." And Forrester found that [61% of business buyers](https://www.forrester.com/blogs/b2b_buyers_make_zero_click_buying_number_one/) use private AI tools their company provides. The agent a prompt-zero buyer has is often the one their IT team allows.

### Why trials push back on agents

SaaS companies have reasons to make signup hard for bots. Stripe says that across AI services on its platform, ["one in six attempted sign-ups is made by a bad actor,"](https://stripe.com/newsroom/news/sessions-2026) and free-trial abuse has more than doubled in six months. So vendors add cards, CAPTCHAs and phone checks. The same friction stops a legitimate agent.

Visa lists "bot detection systems that can mistakenly block legitimate agentic transactions" as a merchant problem, and pitches its Trusted Agent Protocol as the fix. Until agent identity is common, your fraud controls and your prompt-zero readiness will pull in opposite directions. And never try to steer an agent with hidden text: Claude in Chrome is barred from "completing instructions from emails or web content," and our post on [indirect prompt injection](/blog/indirect-prompt-injection-black-hat-geo) explains why it backfires.

## What Buyers and Analysts Say About Letting Agents Buy

Surveys measure what buyers do now. Forecasts assume what they'll do later. Keep the two apart.

### What surveys measure today

- **Research has moved to AI.** In G2's March 2026 survey of 1,076 buyers, 51% start software research in a chatbot more often than in Google, 69% picked a different vendor than planned because of a chatbot, and 64% see inaccurate AI recommendations "often or very often."
- **Agents are welcome as analysts, not buyers.** In G2's July 2026 report, the top agent uses were total cost of ownership (51%) and building shortlists (51%). Only 9% would let an agent buy within guardrails.
- **Buying is a group decision.** Forrester's [State of Business Buying, 2026](https://www.forrester.com/press-newsroom/forrester-2026-the-state-of-business-buying/) counts 13 internal stakeholders and nine external influencers in a typical decision. More than 60% of business buyers now use a trial, and 78% do for purchases of $10 million or more.

G2 runs a review site, so it has an interest in this story. Its two 2026 surveys also differ on detail: April named chatbots the top shortlist source, while July put review sites narrowly ahead. The direction is the same.

### What analysts and vendors project

Gartner's [October 2025 predictions](https://www.gartner.com/en/newsroom/press-releases/2025-10-21-gartner-unveils-top-predictions-for-it-organizations-and-users-in-2026-and-beyond) say: "By 2028, 90% of B2B buying will be AI agent intermediated, pushing over $15 trillion of B2B spend through AI agent exchanges." It adds that API-first products "will establish a significant competitive moat." "Intermediated" means an agent sits in the process, not that it signs the contract, and the release publishes no method. Treat the number as a direction.

Stripe's CEO, Patrick Collison, said in April 2026 that "in the not-too-distant future agents will account for most transactions online." That's the view of a company paid on each transaction. The gap between 61% of buyers using agents and 9% letting them buy is where prompt-zero buying will play out over the next two years.

## The Zero-Human Evaluation Checklist

If a prompt-zero purchase starts with an agent reading your site, the practical question is what it needs to find. The Zero-Human Evaluation Checklist is Rankbox's ten-point test. Score each check 0 (missing), 1 (partial) or 2 (complete), for a maximum of 20.

| #   | Check                   | What the agent needs                                    | Score 2 when                                            | How to test it                                              |
| --- | ----------------------- | ------------------------------------------------------- | ------------------------------------------------------- | ----------------------------------------------------------- |
| 1   | Pricing as text         | Plan names, prices, currency and billing period         | Every price is HTML text on a public page               | Fetch the page with `curl` and search for your price        |
| 2   | Worked totals           | The cost for common team sizes                          | Totals for three or more sizes                          | Ask an assistant "what would five users cost?"              |
| 3   | Plan limits             | Seats, usage caps and overage prices                    | A limits table for every plan                           | Ask what happens when a team exceeds the cap                |
| 4   | Integrations list       | Each integration, what syncs and on which plan          | One doc page per integration                            | Ask "does it sync with X?" and check the cited page         |
| 5   | Public API docs         | Endpoints, auth and rate limits                         | Public docs plus an OpenAPI file at a stable URL        | Open the docs logged out                                    |
| 6   | Security and compliance | Certifications with dates, data location, subprocessors | A public page plus a questionnaire                      | Ask "is it SOC 2 compliant?" and check the source           |
| 7   | Trial terms             | Length, card rule, usage caps, what happens at the end  | One paragraph, identical on pricing and signup pages    | Ask "is there a free trial, and do I need a card?"          |
| 8   | Signup path             | Labelled fields and a list of steps that need a person  | A plain HTML form, with human steps stated              | Try the signup with a browser agent and note where it stops |
| 9   | Contract documents      | Terms, data processing agreement, SLA                   | All public at stable URLs                               | Look for them without logging in                            |
| 10  | Dated facts             | When each fact was last true                            | Update dates on pricing, security and integration pages | Look for a date on each key page                            |

Scoring: 17 to 20 means an agent can evaluate you without help. 11 to 16 means it will finish with open questions. 10 or less means you're likely to be dropped from a prompt-zero shortlist or listed as "couldn't verify."

### Pricing an agent can read

Hidden pricing stalls an evaluation fast. AWS says its agent mode doesn't handle "private pricing information (for products without public pricing)." An agent can't compare a price it can't see, so it guesses or leaves you out. Our post on [hallucination by omission](/blog/hallucination-by-omission-pricing-page) shows how to publish even enterprise pricing in a form machines can quote.

### Integrations and API docs an agent can verify

"Works with Shopify" in a logo strip proves nothing to an agent. A doc page saying what syncs, in which direction and on which plan does.

For the API itself, the standard format is OpenAPI. The [OpenAPI Specification](https://spec.openapis.org/oas/latest.html), at version 3.2.1 since September 2026, describes an API so that "both humans and computers" can understand it "without requiring access to source code." Its sister format, [Arazzo](https://spec.openapis.org/arazzo/latest.html), describes a sequence of calls toward a goal, such as account, then API key, then connection. No agent vendor requires either one for evaluation as of September 2026. They help the agents and developers that read them, and cost little if you already have an API. For assistants that connect to your product directly, see our guide to [MCP as the new sitemap](/blog/mcp-protocol-new-sitemap).

### Security and compliance without a sales call

Security review is where B2B deals slow down: G2 found it was the biggest source of delay, cited by 39% of buyers and 50% at enterprises. An agent can gather security documents, but only public ones. Publish your certifications and their dates, where data is stored, and your subprocessors. If you've completed the Cloud Security Alliance's [CAIQ questionnaire](https://cloudsecurityalliance.org/artifacts/star-level-1-security-questionnaire-caiq-v4), a set of "Yes/No questions" about a SaaS provider's controls, link it. Structured answers are easier for an agent to check than a PDF behind a form.

### Manifests: which ones exist

There's no single standard "agent manifest" for SaaS as of September 2026. What exists is narrower:

- **`/.well-known/ucp`**: UCP's manifest of commerce capabilities. The current spec covers shopping.
- **`/.well-known/agent-card.json`**: the [A2A protocol's](https://a2a-protocol.org/latest/specification/) "self-describing manifest for an agent," for companies that run their own agent.
- **An MCP server**: tools an assistant can call once someone connects it.
- **An OpenAPI file**: the description of your API.

ACP's own site says its backers are "working to create discovery mechanisms" for businesses that implement it. Until that's solved, text on public pages is the one format every prompt-zero agent can read.

## A Fictional Agent Task: Tallyfold, Brindlework and Kestrelyn

Tallyfold is a fictional B2B invoicing and payments app for agencies. Brindlework and Kestrelyn are its fictional rivals. The list prices match our [comparison page example](/blog/comparison-page-formula). Everything else here, including the agent's steps and output, is invented for illustration and wasn't run against any real product.

The prompt-zero instruction, from the operations lead at a design agency:

> "Find invoicing software for our agency. It must sync with QuickBooks Online and our Shopify store, cost under $100 a month for five users, and I want a trial set up. Don't pay for anything."

The agency sends about 40 invoices a month. Here is what the agent could confirm on each vendor's public pages.

| What the agent checked           | Tallyfold                                   | Brindlework             | Kestrelyn                             |
| -------------------------------- | ------------------------------------------- | ----------------------- | ------------------------------------- |
| Price as text                    | $39 a month with 3 users, then $12 per user | $25 per user a month    | Free up to 20 invoices, then $59 flat |
| Cost for five users, 40 invoices | $39 + (2 × $12) = $63                       | 5 × $25 = $125          | $59                                   |
| Under $100?                      | Yes                                         | No                      | Yes                                   |
| QuickBooks Online                | Doc page                                    | Doc page                | Logo only                             |
| Shopify                          | Doc page: order-to-invoice sync, one way    | Doc page                | Logo only                             |
| Public API docs                  | Yes, with an OpenAPI file                   | Yes, no OpenAPI file    | Behind a login                        |
| Security page                    | Yes, dated                                  | Yes, dated              | None                                  |
| Trial                            | 14 days, no card, stated in text            | 14 days, stated in text | "Book a demo to start your trial"     |
| Checklist score                  | 18 of 20                                    | 16 of 20                | 5 of 20                               |

Tallyfold lost a point each for not saying signup needs email verification and for undated integration pages. Brindlework lost the same two, plus one each for per-user pricing with no totals and for having no OpenAPI file. Kestrelyn scored 2 for pricing as text, 1 each for totals, limits and contract documents, and 0 on the other six.

The agent's report back to the operations lead:

1. **Tallyfold fits all three requirements at $63 a month.** The trial form is filled in. It needs the code sent to your email to finish, so that step is yours.
2. **Kestrelyn fits the budget at $59 a month, but its Shopify and QuickBooks sync couldn't be confirmed.** A demo is required before a trial.
3. **Brindlework was excluded.** Five users cost $125 a month, over your $100 limit.

Brindlework lost fairly: its price was clear, and too high for this buyer. Kestrelyn may be a fine product, but the agent never found out, because every fact it needed sat behind a logo, a login or a demo. And Tallyfold, the best-documented vendor, still stopped at a human step. That's a prompt-zero evaluation followed by a human purchase, which is where most real software buying sits in September 2026.

## Where Humans Still Sign Off

A prompt-zero purchase hits several gates that belong to people: some set by policy, some by law, and some by trust.

| Step                      | Can an agent do it today?                                                                                               | Who signs off       | What to publish                             |
| ------------------------- | ----------------------------------------------------------------------------------------------------------------------- | ------------------- | ------------------------------------------- |
| Create the account        | Claude in Chrome won't; ChatGPT's cloud browser asks before account commitments; Stripe Projects can, for its providers | The buyer           | Which signup steps need a person            |
| Verify email or phone     | Only with access to the inbox or phone                                                                                  | The buyer           | Say that verification is required           |
| Add a payment method      | Link asks you to approve each payment; AP2 uses a signed mandate                                                        | The card holder     | When the card is charged, and how to cancel |
| Accept terms              | Allowed in law if attributable to the buyer (see below)                                                                 | Buyer or legal team | Public terms, DPA and order form            |
| Security review           | An agent can collect public documents                                                                                   | IT or security      | Security page and questionnaire             |
| Budget approval           | An agent can draft the business case                                                                                    | Finance             | Worked totals and annual cost               |
| Contract above self-serve | No                                                                                                                      | Procurement         | Where self-serve ends and sales begins      |

The law is less of a barrier than people assume. In the US, the E-SIGN Act says a contract ["may not be denied legal effect"](https://www.law.cornell.edu/uscode/text/15/7001) just because "one or more electronic agents" formed it, as long as the agent's action is "legally attributable to the person to be bound." That's not legal advice, and other countries differ. The real barriers are trust and company policy: procurement teams are decision-makers in 53% of business buying cycles, per Forrester, and nearly half of buyers in G2's survey had seen a CFO veto an approved deal in the past year.

Payment rails are built around a person's consent. In AP2, a present buyer approves a cart; an absent one signs an "Intent Mandate" in advance with "price limits, timing, and other conditions." Google's B2B example is "the automatic scaling of software licenses based upon real-time needs," a stated possibility in its announcement, not a live product we could find.

## Our Forecast for 2027, Labelled as Ours

Everything in this section is Rankbox's opinion, built on the verified facts and named projections above. It isn't a measurement. Here is what we expect by the end of 2027:

1. **Prompt-zero evaluation becomes the normal start for small self-serve tools.** For software a team can buy on a card, we expect the shortlist to be built by an assistant or agent before anyone opens a vendor site.
2. **Prompt-zero purchases stay in lanes.** Full agent signups will grow where a provisioning protocol exists, as with Stripe Projects, and where a person has pre-set a budget. Contracts, security review and anything above a self-serve price will stay human.
3. **Account creation, not payment, is the bottleneck.** The payment rails are further along than any shared standard for agent signup.
4. **A shared way to publish plans and trial terms for agents may appear.** We don't know which one. ACP, UCP and MCP all have pieces of it.

As for the popular 2027 scenario, our reading of the vendor docs above is that finding a tool that "connects with Shopify, costs under $100 a month" is already possible today, if vendors publish those facts as text. "Configure the trial" is possible today only where a provisioning protocol exists.

**What would change our minds:** an agent vendor lifting its account-creation block, a major software marketplace allowing agent purchase transactions, or G2's 9% jumping sharply in its 2027 survey.

## How Rankbox's Own Trial Measures Up

It's fair to run our own site through the prompt-zero checklist. Rankbox publishes its price as text on its [pricing page](/pricing): the Business plan is $49.50 a month for 30 articles on one site. You can sign up free without a card. You add a card to start the 7-day trial, which includes up to 7 articles, and that card step needs a person. Rankbox's [pull API](/integrations/api) and its [MCP server](/integrations/mcp), which offers three research tools, have public pages. Rankbox doesn't publish an OpenAPI manifest or an agent manifest, and it doesn't sell through any agentic checkout. So it scores well on text facts and trial terms, and it isn't agent-ready beyond that.

Where Rankbox helps is the evaluation content. [Answer-Space Research](/features/answer-space-research) maps the questions buyers ask AI engines in your category, and the Citation-Ready Writer researches the live web and drafts 2,000 to 3,500-word, source-backed articles that answer the fan-out questions an agent asks. It doesn't build pricing pages, API docs or signup flows, and doesn't track AI citations today. For how SaaS teams fit AI writing into their process, read [how SaaS companies use AI for SEO content creation](/blog/how-saas-companies-use-ai-for-seo-content-creation).

## Frequently Asked Questions

### What is a prompt-zero purchase?

It's a software purchase where one instruction to an AI agent replaces the search journey: the agent finds, compares and signs up, and no person sees the search results. As of September 2026, agents often do the research and comparison; signup and payment by an agent are still rare.

### Can AI agents buy software on their own today?

Only in narrow cases. Stripe Projects lets coding agents create accounts and choose paid plans with 49 providers after a person adds a payment method. Most agents stop earlier: Claude in Chrome won't create accounts or make purchases, and the cloud browser in ChatGPT Work pauses for sign-in and asks you to confirm payments.

### Do I need an OpenAPI file or an agent manifest for AI agents to evaluate my SaaS?

No agent vendor requires one as of September 2026. Agents mostly read public pages, so plain-text pricing, limits, integrations and trial terms matter most. An OpenAPI file helps agents and developers that use your API. No single agent-manifest standard for SaaS exists yet.

### Did OpenAI stop Instant Checkout?

OpenAI scaled it back. In March 2026 it said the first version "did not offer the level of flexibility that we aspire to provide" and began letting merchants use their own checkout while it focuses on product discovery. Its help page still mentions Instant Checkout for some eligible products and merchants.

### What should a SaaS pricing page include for a prompt-zero buyer?

Every price as HTML text, with billing period and currency, what each plan includes, seat and usage limits, overage prices, and totals for common team sizes. Add trial terms and an update date. An agent can't compare a price hidden behind a demo form.

### Will AI agents replace B2B software buyers by 2027?

Unlikely. Gartner forecasts that 90% of B2B buying will be "AI agent intermediated" by 2028, but intermediated means assisted. In G2's July 2026 survey, only 9% of buyers would let an agent buy within guardrails, and Forrester counts 13 internal stakeholders in a typical decision.

## References

1. [2026 Buyer Behavior Report: The Evaluation Maze, G2 (July 2026)](https://company.g2.com/news/buyer-behavior-2026)
2. [New G2 research: half of B2B software buyers now start their research with AI chatbots, G2 via PR Newswire (April 2026)](https://www.prnewswire.com/news-releases/new-g2-research-half-of-b2b-software-buyers-now-start-their-research-with-ai-chatbots-302742807.html)
3. [The State Of Business Buying, 2026, Forrester (January 2026)](https://www.forrester.com/press-newsroom/forrester-2026-the-state-of-business-buying/)
4. [Gartner Unveils Top Predictions for IT Organizations and Users in 2026 and Beyond, Gartner (October 2025)](https://www.gartner.com/en/newsroom/press-releases/2025-10-21-gartner-unveils-top-predictions-for-it-organizations-and-users-in-2026-and-beyond)
5. [Agentic Commerce Protocol repository, OpenAI and Stripe](https://github.com/agentic-commerce-protocol/agentic-commerce-protocol)
6. [Powering Product Discovery in ChatGPT, OpenAI (March 2026)](https://openai.com/index/powering-product-discovery-in-chatgpt/)
7. [Announcing Agent Payments Protocol (AP2), Google Cloud (September 2025)](https://cloud.google.com/blog/products/ai-machine-learning/announcing-agents-to-payments-ap2-protocol)
8. [Under the Hood: Universal Commerce Protocol (UCP), Google for Developers (January 2026)](https://developers.googleblog.com/under-the-hood-universal-commerce-protocol-ucp/)
9. [Stripe builds out the economic infrastructure for AI with 288 launches, Stripe (April 2026)](https://stripe.com/newsroom/news/sessions-2026)
10. [Stripe Projects documentation, Stripe](https://docs.stripe.com/projects)
11. [Stripe Projects adds new agent integrations, more providers, and custom developer controls, Stripe (June 2026)](https://stripe.com/blog/stripe-projects-adds-new-agents-providers-developer-controls)
12. [Agent mode for AWS Marketplace, AWS Marketplace Buyer Guide](https://docs.aws.amazon.com/marketplace/latest/buyerguide/agent-mode.html)
13. [Visa Introduces Trusted Agent Protocol, Visa (October 2025)](https://usa.visa.com/about-visa/newsroom/press-releases.releaseId.21716.html)
14. [Using cloud browser in ChatGPT, OpenAI Help Center](https://help.openai.com/en/articles/20001280-using-cloud-browser-in-chatgpt)
15. [Claude in Chrome permissions guide, Anthropic Help Center](https://support.claude.com/en/articles/12902446-claude-in-chrome-permissions-guide)
16. [The new era of browsing: Putting Gemini to work in Chrome, Google (January 2026)](https://blog.google/products-and-platforms/products/chrome/gemini-3-auto-browse/)
17. [ChatGPT tripled its fan-out queries and looks for authoritative sources, Nectiv (August 2026)](https://nectivdigital.com/blog/chatgpt-tripled-fan-out-queries-data-study)
18. [OpenAPI Specification v3.2.1, OpenAPI Initiative](https://spec.openapis.org/oas/latest.html)
19. [15 U.S. Code § 7001, General rule of validity (E-SIGN Act), Cornell Legal Information Institute](https://www.law.cornell.edu/uscode/text/15/7001)
20. [ChatGPT agent (now retired; page notes it is no longer available), OpenAI Help Center](https://help.openai.com/en/articles/11752874-chatgpt-agent)
