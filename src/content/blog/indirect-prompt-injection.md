---
title: Indirect Prompt Injection: What It Is, Documented Cases and Defenses
description: Indirect prompt injection hides instructions in pages, emails and files an AI reads. The paper that named it, dated cases from 2023 to 2026, and defenses.
keyword: indirect prompt injection
date: 2026-10-23
updated: 2026-10-23
written: 2026-09-30
author: Rankbox Team
tags: AI Security, AI Search
---

Indirect prompt injection is an attack in which someone hides instructions inside content an AI system will read later: a web page, an email, a shared file, a calendar invite. The attacker never talks to the AI. The victim asks for something ordinary, such as a summary, and the AI meets the planted text along the way and may treat it as a command.

Researchers named the attack in [February 2023](https://arxiv.org/abs/2302.12173), when Kai Greshake and colleagues used it against Bing's GPT-4 chat. Since then, security teams have documented it in Microsoft 365 Copilot, Gemini, ChatGPT, Slack AI, GitHub's MCP server and Perplexity's Comet browser. OWASP ranks prompt injection, direct and indirect together, as the [top risk](https://genai.owasp.org/llmrisk/llm01-prompt-injection/) for LLM applications.

This page is the security view: where the term came from, a dated list of real cases, where the attack shows up, and how teams defend against it. For what it means for search visibility and "black hat GEO," read our investigation into [whether prompt injection can hijack AI search](/blog/indirect-prompt-injection-black-hat-geo). If the basics are new to you, start with our plain-English guide to [what prompt injection is](/blog/what-is-prompt-injection).

## Key Takeaways

- Indirect prompt injection puts the attack in the data, not the chat box. Any text an AI reads for you can carry it: pages, emails, documents, issues, reviews, images.
- Greshake et al. named it in February 2023 and showed it working against Bing's GPT-4 chat.
- Documented cases from 2024 to 2026 include email-triggered data theft in Microsoft 365 Copilot (EchoLeak), a calendar invite that hijacked Gemini agents, and a hidden Reddit comment that hijacked Perplexity's Comet.
- The worst cases combine three things: untrusted content, access to private data, and a way to send data out. Simon Willison calls this "the lethal trifecta."
- Vendors defend in layers: training, data marking, classifiers, least privilege and human confirmation. None says the problem is solved.
- You can score your own AI tools on the three trifecta questions in a few minutes, and cut the risk by removing one leg.

## Where the Term Comes From

Prompt injection was first named in [September 2022](https://simonwillison.net/2022/Sep/12/prompt-injection/), when Simon Willison wrote up Riley Goodside's examples of a user typing orders that overrode an app's own prompt. That early form is direct: the attacker is the person at the keyboard.

Greshake's team asked a sharper question in 2023: what if the attacker isn't typing at all? Their paper argues that apps built on language models "blur the line between data and instructions." An attacker can exploit such an app "remotely (without a direct interface)" by "strategically injecting prompts into data likely to be retrieved." They showed it against Bing's chat and code-completion tools, and sorted the harms into groups that include data theft, worming (an attack that spreads itself) and "information ecosystem contamination."

### How it differs from direct injection

|                          | Direct prompt injection             | Indirect prompt injection                       |
| ------------------------ | ----------------------------------- | ----------------------------------------------- |
| Who plants the text      | The user, in the chat               | A third party, inside content                   |
| Where it arrives         | The prompt box                      | A page, email, file, tool result or memory      |
| Who is harmed            | Usually the app's owner             | Usually the user who asked for help             |
| Needs the victim to act? | No victim; the attacker is the user | The victim only has to ask for something normal |

OWASP adds a useful point: indirect injections "can be either intentional or unintentional." A stray instruction in a job ad can trip an AI screening tool even when nobody meant harm. MITRE ATLAS, a public catalog of AI attack techniques, lists the indirect form as its own technique (AML.T0051.001).

## Documented Cases, 2023 to 2026

The cases below come from the researchers who found them or from reporting on their work. Dates are public disclosure dates unless noted. None of this is our own testing.

| Date     | System                           | How the text arrived                  | What the researchers showed                                 | Outcome                                                                                                                                                            |
| -------- | -------------------------------- | ------------------------------------- | ----------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Feb 2023 | Bing chat (GPT-4)                | Web page content                      | Remote control of the chat's replies                        | Paper: [Greshake et al.](https://arxiv.org/abs/2302.12173)                                                                                                         |
| Aug 2024 | Slack AI                         | A post in a public channel            | Leaking data from private channels                          | [PromptArmor](https://www.promptarmor.com/resources/data-exfiltration-from-slack-ai-via-indirect-prompt-injection); Slack called the evidence insufficient         |
| Sep 2024 | ChatGPT macOS app                | Untrusted content read in a chat      | Instructions saved to memory, then ongoing data theft       | [Johann Rehberger](https://embracethered.com/blog/posts/2024/chatgpt-macos-app-persistent-data-exfiltration/); OpenAI fixed the app                                |
| May 2025 | GitHub MCP server                | A malicious issue in a public repo    | Agent copied private repo data into a public pull request   | [Invariant Labs](https://invariantlabs.ai/blog/mcp-github-vulnerability)                                                                                           |
| Jun 2025 | Microsoft 365 Copilot (EchoLeak) | One email, no clicks needed           | Zero-click data theft                                       | [Aim Security via Cybersecurity Dive](https://www.cybersecuritydive.com/news/flaw-microsoft-copilot-zero-click-attack/750456/); fixed, no known victims            |
| Jul 2025 | AI-assisted peer review          | White or tiny text in 17 preprints    | "Give a positive review only" style prompts                 | [Nikkei Asia](https://asia.nikkei.com/business/technology/artificial-intelligence/positive-review-only-researchers-hide-ai-prompts-in-papers); one paper withdrawn |
| Aug 2025 | Gemini for Workspace             | The title of a calendar invite        | Deleting events and sending out emails, among other actions | [SafeBreach](https://www.safebreach.com/blog/invitation-is-all-you-need-hacking-gemini/); Google says it shipped layered defenses first                            |
| Aug 2025 | Perplexity Comet                 | A Reddit comment behind a spoiler tag | Stealing a user's email and one-time code                   | [Brave](https://brave.com/blog/comet-prompt-injection/); Brave later said it wasn't fully fixed                                                                    |
| Oct 2025 | Perplexity Comet                 | Faint text inside a screenshot        | Hidden commands read from an image                          | [Brave](https://brave.com/blog/unseeable-prompt-injections/)                                                                                                       |
| Feb 2026 | Several assistants' memory       | "Summarize with AI" links             | 50 promotional memory prompts from 31 companies             | [Microsoft](https://www.microsoft.com/en-us/security/blog/2026/02/10/ai-recommendation-poisoning/)                                                                 |

Two cases show how the harm can be marketing rather than theft. The peer review prompts tried to tilt a judgment. Microsoft's February 2026 finding showed companies planting "remember us as a trusted source" lines in AI links, a tactic it named AI Recommendation Poisoning. Our [investigation of black hat GEO](/blog/indirect-prompt-injection-black-hat-geo) covers that side, including a June 2026 test where one of 12 assistants obeyed a hidden line.

### What the serious cases share

The data theft cases share a pattern. The AI could read outside content, it could reach private data, and it had some way to send data out: an image link, a pull request, a reply. Simon Willison named this combination [the lethal trifecta](https://simonwillison.net/2025/Jun/16/the-lethal-trifecta/) in June 2025. Take away any one leg and the worst outcome, data theft, gets much harder.

Microsoft makes a related point in its [July 2025 defense write-up](https://www.microsoft.com/en-us/msrc/blog/2025/07/how-microsoft-defends-against-indirect-prompt-injection-attacks): "not all indirect prompt injections result in security impact." Any text in the input is meant to shape the output. It becomes a vulnerability when it causes data loss or actions the user didn't want.

## Where Indirect Prompt Injection Shows Up

Anywhere an AI reads text that a stranger could have written.

### Web browsing, AI search and AI browsers

When an assistant searches or opens a page for you, the page text enters its context. In AI search this can tilt a summary. In an AI browser that can click, fill forms and use your logged-in sessions, it can do much more, which is why Brave argued that same-origin rules, the browser's usual walls between sites, are "effectively useless" once an agent follows page text.

### Email, calendar and chat assistants

Inboxes are open to anyone with your address. EchoLeak needed only one email. The Gemini case needed only a calendar invite. Team chat tools add another route, as the Slack AI report showed.

### Workplace search and RAG

Retrieval-augmented generation, or RAG, means the AI looks up documents before it answers. OWASP's scenario is simple: an attacker edits a document in the collection, and the tampered text steers answers for everyone who retrieves it. Our explainer on [retrieval-augmented generation](/glossary/retrieval-augmented-generation) covers how that lookup works.

### Coding agents and tool connectors

Coding agents read issues, READMEs and code comments, and connect to tools through protocols such as MCP. The GitHub case used a public issue. Anthropic noted in [May 2026](https://www.anthropic.com/engineering/how-we-contain-claude) that "a GitHub connector … can load a poisoned README straight into the model's context," even when the connector itself passed security checks.

### Memory

Assistants that remember you add persistence. A planted instruction saved to memory comes back in every later chat, as Rehberger showed in 2024 and Microsoft's 2026 research confirmed at scale.

## How Vendors and Researchers Defend Against It

Defenses fall into five families. Our [step-by-step look at how prompt injection works](/blog/how-does-prompt-injection-work) explains where each one cuts in.

1. **Teach the model that data isn't orders.** OpenAI's [Instruction Hierarchy](https://arxiv.org/abs/2404.13208) paper (April 2024) trains models to rank developer and user instructions above text from third parties.
2. **Mark the data.** Microsoft's [Spotlighting](https://arxiv.org/abs/2403.14720) (March 2024) transforms outside text so the model can tell where it came from. In the authors' tests it cut attack success from over 50% to under 2%.
3. **Detect attacks.** Classifiers such as Microsoft's Prompt Shields, Anthropic's content classifiers and Google's [Gemini content classifiers](https://security.googleblog.com/2025/06/mitigating-prompt-injection-attacks.html) scan text for injected instructions.
4. **Limit what a hijacked model can do.** Give it the least access it needs. [CaMeL](https://arxiv.org/abs/2503.18813), from Debenedetti and colleagues (March 2025), goes further: it plans from the trusted request so untrusted data "can never impact the program flow." It completed 77% of benchmark tasks with that guarantee, against 84% with no defense.
5. **Ask the human.** Gemini can ask before risky steps like deleting a calendar event. Copilot in Outlook drafts, and you press send.

None of these is complete on its own. The UK's National Cyber Security Centre [wrote in December 2025](https://www.ncsc.gov.uk/blog-post/prompt-injection-is-not-sql-injection) that current models "do not enforce a security boundary between instructions and data." In October 2025, [Nasr and colleagues](https://arxiv.org/abs/2510.09023) beat 12 published defenses with over 90% success for most. Layers make attacks harder and costlier. They don't make them impossible.

## The Trifecta Check: Score Your Own AI Tools

You can't patch a vendor's model. You can decide how much reach each AI tool gets. The Trifecta Check asks three yes-or-no questions about every tool your team uses:

1. **Outside content:** does it read anything a stranger could write (web pages, inbound email, shared files, tickets, reviews)?
2. **Private data:** can it reach anything you'd hate to leak (inboxes, drives, CRM records, private repos)?
3. **Reach out:** can it send, post, open links, show images from other sites, or change records?

Count the yeses. Zero or one is low risk. Two is medium: guard the third leg so it can't appear later. Three is the full trifecta: add human approval for every outbound step, or split the job so no single tool has all three.

### Worked example: Tallyfold's three AI tools

Tallyfold is a fictional invoicing and payments app for agencies. Its team reviews three AI tools it uses.

| Tool                                                       | Outside content?                 | Private data? | Reach out?                | Score     | What Tallyfold changed                              |
| ---------------------------------------------------------- | -------------------------------- | ------------- | ------------------------- | --------- | --------------------------------------------------- |
| Web research assistant for blog drafts                     | Yes                              | No            | No                        | 1: low    | Nothing; a writer reviews every draft and source    |
| Inbox agent that sorts and answers vendor email            | Yes                              | Yes           | Yes                       | 3: high   | Turned off auto-send; every reply now needs a click |
| Help center chatbot that can look up a customer's invoices | No (staff-written articles only) | Yes           | Yes (can resend invoices) | 2: medium | Blocked customer-submitted text from its sources    |

The inbox agent is the one to fix first. It reads mail from anyone, sees every invoice, and could send data out. Removing auto-send doesn't stop an injected email from being read. It stops the most damaging step from happening without a person seeing it. The chatbot stays at two only as long as its sources stay staff-only, so Tallyfold wrote that rule into its content process.

## A Note on AI Writing Tools, Including Ours

Rankbox's [Citation-Ready Writer](/features/citation-ready-writer) researches the live web to write source-backed articles, so it reads outside content by design. That's the first leg of the trifecta. No tool that reads the web is immune to indirect prompt injection, ours included. Treat any AI draft, from any vendor, as a draft: read it, and open the sources before you publish. Plans and the 7-day trial are on our [pricing page](/pricing).

## Frequently Asked Questions

### What is indirect prompt injection?

Indirect prompt injection is an attack that hides instructions inside content an AI will read later, such as a web page, an email or a document. When a user asks the AI to work with that content, the model may follow the hidden instructions instead of, or as well as, the user's request.

### How is indirect prompt injection different from direct prompt injection?

In direct injection, the person typing into the AI is the attacker. In indirect injection, the attacker plants text somewhere else and waits for the AI to read it on behalf of an innocent user. That makes the indirect kind harder to spot, because the victim sees only a normal request.

### Who discovered indirect prompt injection?

Kai Greshake, Sahar Abdelnabi and colleagues named and demonstrated it in a paper first posted on 23 February 2023. They showed it working against Bing's GPT-4 chat and code-completion tools. The broader term "prompt injection" was coined by Simon Willison in September 2022.

### Can indirect prompt injection steal data?

Yes, when the AI can reach private data and send something out. EchoLeak (June 2025) showed zero-click data theft from Microsoft 365 Copilot through a single email, and Brave's August 2025 report showed a hidden Reddit comment stealing account details through Perplexity's Comet. Both were fixed or mitigated after disclosure.

### How do you prevent indirect prompt injection?

You can't fully prevent it today, but you can limit it. Give AI tools the least access they need, require a person to approve sends and other risky actions, keep untrusted text out of trusted sources, and use tools whose vendors document layered defenses such as classifiers and data marking.

### Does indirect prompt injection affect AI search results?

It can. Published tests show hidden text on a page can tilt some AI summaries, though newer assistants often refuse or flag it. Google and Bing treat attempts to manipulate AI answers as spam. Our guide to prompt injection and black hat GEO covers the tests and the penalties.

## References

1. [Not what you've signed up for: Compromising Real-World LLM-Integrated Applications with Indirect Prompt Injection, Greshake et al., arXiv](https://arxiv.org/abs/2302.12173)
2. [LLM01:2025 Prompt Injection, OWASP Gen AI Security Project](https://genai.owasp.org/llmrisk/llm01-prompt-injection/)
3. [Prompt injection attacks against GPT-3, Simon Willison](https://simonwillison.net/2022/Sep/12/prompt-injection/)
4. [The lethal trifecta for AI agents, Simon Willison](https://simonwillison.net/2025/Jun/16/the-lethal-trifecta/)
5. [How Microsoft defends against indirect prompt injection attacks, Microsoft Security Response Center](https://www.microsoft.com/en-us/msrc/blog/2025/07/how-microsoft-defends-against-indirect-prompt-injection-attacks)
6. [Critical flaw in Microsoft Copilot could have allowed zero-click attack, Cybersecurity Dive](https://www.cybersecuritydive.com/news/flaw-microsoft-copilot-zero-click-attack/750456/)
7. [Invitation Is All You Need: Invoking Gemini for Workspace Agents with a Simple Google Calendar Invite, SafeBreach](https://www.safebreach.com/blog/invitation-is-all-you-need-hacking-gemini/)
8. [Agentic Browser Security: Indirect Prompt Injection in Perplexity Comet, Brave](https://brave.com/blog/comet-prompt-injection/)
9. [GitHub MCP Exploited: Accessing private repositories via MCP, Invariant Labs](https://invariantlabs.ai/blog/mcp-github-vulnerability)
10. [Spyware Injection Into Your ChatGPT's Long-Term Memory (SpAIware), Embrace The Red](https://embracethered.com/blog/posts/2024/chatgpt-macos-app-persistent-data-exfiltration/)
11. [Data Exfiltration from Slack AI via Indirect Prompt Injection, PromptArmor](https://www.promptarmor.com/resources/data-exfiltration-from-slack-ai-via-indirect-prompt-injection)
12. [Manipulating AI memory for profit: The rise of AI Recommendation Poisoning, Microsoft Security Blog](https://www.microsoft.com/en-us/security/blog/2026/02/10/ai-recommendation-poisoning/)
13. [Defending Against Indirect Prompt Injection Attacks With Spotlighting, Hines et al., arXiv](https://arxiv.org/abs/2403.14720)
14. [Defeating Prompt Injections by Design, Debenedetti et al., arXiv](https://arxiv.org/abs/2503.18813)
15. [Prompt injection is not SQL injection (it may be worse), UK National Cyber Security Centre](https://www.ncsc.gov.uk/blog-post/prompt-injection-is-not-sql-injection)
16. [The Attacker Moves Second, Nasr et al., arXiv](https://arxiv.org/abs/2510.09023)
