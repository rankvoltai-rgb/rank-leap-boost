---
title: How to Create a Wikidata Item for Your Company (Without Getting It Deleted)
description: How to create a Wikidata item for your company that survives review: check notability, gather references, request it, disclose your role and keep it accurate.
keyword: Wikidata item
date: 2026-11-13
updated: 2026-11-13
written: 2026-10-01
author: Rankbox Team
tags: Technical SEO, AI Search
---

To create a Wikidata item for your company without getting it deleted, first prove the company meets Wikidata's notability policy with independent coverage. Then ask an independent editor to create it on Wikidata's Requests for new items page, and say how you're connected. If you make the Wikidata item yourself, which Wikidata's own essay strongly discourages, it has to prove itself on day one: a neutral label and description, "instance of", key facts, and a reference on each.

Speed matters, because review is fast. A Wikidata admin's guide to [creating items that survive](https://www.wikidata.org/wiki/User:Bovlb/How_to_create_an_item_on_Wikidata_so_that_it_won%27t_get_deleted) warns that new items "are typically reviewed very quickly and, if they don't clearly establish notability, swiftly deleted." Wikidata's public deletion log shows the scale. On 30 September 2026, admins and bots deleted 286 items, and 129 of the logged reasons cited notability.

This is the step-by-step version. For why Wikidata matters to search and AI, what's documented and what isn't, read our full guide to [Wikidata SEO and machine-readable authority](/blog/wikidata-seo). Nothing in this post was created on live Wikidata; the one step we checked by hand used Wikidata's separate test site.

## Key Takeaways

- Check first. Search for an existing item, then test your evidence against the notability policy before you touch the create form.
- A common rule of thumb is three independent sources that cover your company in depth. Crunchbase, LinkedIn, your website and press releases don't count toward it.
- If you're connected to the company, request the Wikidata item on Requests for new items and disclose the connection. Paid editors must disclose who pays them.
- Build the whole item in one sitting: label, description, "instance of", official website, inception, headquarters and a reference on every fact.
- Most deletions come from missing notability, empty items, lost Wikipedia links, spam and re-created items. Each one is avoidable.

## Step 1: Check Before You Create

Three checks come before the form: does an item exist, does the company qualify, and who should create it.

### Search for an existing item

Search Wikidata for your company name, its legal name and any old names. Then search by website, since name search misses odd labels. Our [entity authority guide](/blog/entity-authority-in-the-ai-era) has the exact website lookup. If an item exists, improve it within the rules instead of making a second one. A duplicate splits your facts across two IDs.

### Test notability honestly

Wikidata's [notability policy](https://www.wikidata.org/wiki/Wikidata:Notability) accepts an item with a Wikipedia link, one that "can be described using serious and publicly available references," or one that meets a structural need. For a company without a Wikipedia article, the middle test is the one that matters.

Two rules of thumb help. The [self-promotion essay](https://www.wikidata.org/wiki/Wikidata:Self-promotion) suggests "at least three independent, reputable sources that provide substantial coverage of you." The admin's guide says two articles from different national newspapers, "primarily about the target concept," will settle it. Either way, these don't count:

- your website, blog, press releases or sponsored posts;
- profile IDs such as Crunchbase, LinkedIn, X and GitHub, which Wikidata itself tags as IDs that don't imply notability;
- interviews, podcasts, passing quotes and directory listings.

The hub's [Evidence Ladder](/blog/wikidata-seo) sorts every common kind of evidence in one table.

### Decide who creates it

| Route                                 | When it fits                                | What Wikidata's pages say                                            |
| ------------------------------------- | ------------------------------------------- | -------------------------------------------------------------------- |
| Request it from an independent editor | You work for or own the company             | The request page is meant for people with "a conflict of interest"   |
| Create it yourself, with disclosure   | You're connected but confident it qualifies | The essay says this is "strongly discouraged"                        |
| Hire someone to create it             | Rarely wise                                 | "Paid promotion is still self-promotion," and they must disclose you |

The first route is the safe one, and it may soon be the only one. A [draft policy](https://www.wikidata.org/wiki/Wikidata:Requests_for_comment/Notability_policy_reform) posted on 9 June 2026 says "creating an Item about yourself, your close relatives or your business is not permitted." As of 1 October 2026 the vote is still open.

## Step 2: Gather References Before You Open the Form

Collect every source first, so each fact goes in with its proof. Wikidata's [sources guideline](https://www.wikidata.org/wiki/Help:Sources) asks a web reference to carry the page URL (P854), its title (P1476), and a publication date (P577) or the date you read it (P813). An archived copy (P1065) helps if the page later moves.

A few rules save trouble:

- **Use the best source for each fact.** A registry for the legal name and legal form. Independent press for the founding date, founders and industry.
- **Your own site is fine for plain facts.** Wikidata's [autobiography page](https://www.wikidata.org/wiki/Wikidata:Autobiography) says your own website may be used "as references for information about yourself, not others." It can't prove notability.
- **Don't cite Wikipedia.** The sources guideline says such references "should be removed if other sources are already present."
- **IDs prove themselves.** A Crunchbase or LEI value that links to its own record needs no extra reference.
- **Skip what you can't source.** An unsourced revenue figure invites a closer look at everything else.

## Step 3: Create or Request the Wikidata Item

### The Pre-Flight Sheet

Before anything goes live, fill in one sheet that holds the whole item. Here's the sheet for Tallyfold, a fictional invoicing and payments app for agencies, a year after it earned three independent features. The company, its sources and its IDs are invented for this example.

| Field                   | Value                                   | Reference                       |
| ----------------------- | --------------------------------------- | ------------------------------- |
| Label (English)         | Tallyfold                               | None needed                     |
| Description (English)   | invoicing and payments software company | None needed                     |
| Alias                   | Tallyfold Software                      | Registry entry                  |
| Instance of (P31)       | business (Q4830453)                     | None needed                     |
| Official name (P1448)   | Tallyfold Software Ltd                  | Registry entry                  |
| Official website (P856) | https://tallyfold.example/              | The site itself                 |
| Inception (P571)        | 2021                                    | Trade magazine feature          |
| Headquarters (P159)     | Bristol (Q23154)                        | Registry entry                  |
| Country (P17)           | United Kingdom (Q145)                   | Registry entry                  |
| Industry (P452)         | financial software (Q16000093)          | Regional business paper feature |
| Crunchbase ID (P2088)   | tallyfold                               | Its own record                  |

Note what's missing. Tallyfold's founders have no items of their own, so "founded by" waits; making founder items just to link them is a known trap. And note the Q-numbers. On 1 October 2026, the first match for "Bristol" in Wikidata's search API was a city in Connecticut. Check every description before you pick.

Then run the go or no-go check. Every answer must be yes.

1. Is there no existing item, by name or website?
2. Do at least three independent sources cover the company in depth?
3. Does every fact in the sheet have a source or an ID?
4. Is the description 2 to 12 words, lowercase and neutral, as the [description guideline](https://www.wikidata.org/wiki/Help:Description) asks?
5. Have you written down how you're connected to the company?
6. Can the whole sheet go in during one sitting?

### Requesting the item

Post on [Requests for new items](https://www.wikidata.org/wiki/Wikidata:Requests_for_new_items). Its form asks for a label, a description, a reason for the request, evidence of notability, sources and identifiers. The page asks people connected to the subject to "briefly explain your connection." Paste your sheet's sources into the evidence field and state the connection in the reason field.

Expect a real review. In the requests archived for August 2026, nine of 28 were marked not done, with notes like "Sources are not independent. No valid identifiers." If yours is declined, the reply tells you what's missing. Add evidence later instead of arguing now.

### Creating it yourself

If you do create the Wikidata item, sign in to an account first. The admin's guide calls an account "highly recommended," and it gives reviewers someone to talk to. Open Special:NewItem. It asks for four things: language, label, description and aliases separated by a pipe. Save, then add every statement and reference from your sheet straight away. The guide's warning is blunt: creating "a bare item with the intention of coming back later" is a common way to lose it.

### Practising on Wikidata's test site

Wikidata runs a separate sandbox at test.wikidata.org. We loaded its create form on 1 October 2026 and saved nothing; it shows the same four fields as the live site. One catch if you practise there: property numbers differ. On the test site, P31 is a "website" property and "instance of" is P82. Search properties by name, and never copy test IDs into the live site.

## Step 4: Connect Identifiers and Your Markup

Add your profile and registry IDs as their own statements. Enter the ID part only. Wikidata's guide calls pasting whole URLs "a common new-user mistake," and the X property says "do not include the '@' symbol."

| Profile                 | Property | Enter                                |
| ----------------------- | -------- | ------------------------------------ |
| Crunchbase              | P2088    | The part after /organization/        |
| LinkedIn company page   | P4264    | The part after /company/             |
| X                       | P2002    | The username, no @                   |
| GitHub                  | P2037    | The account name                     |
| YouTube                 | P2397    | The channel ID, not the channel name |
| Legal Entity Identifier | P1278    | The 20-character code                |

Then close the loop on your own site. Add the item's URL to `sameAs` in your Organization markup, next to your other profiles. Our free [schema generator](/tools/schema-generator) builds that block, and the hub's ID crosswalk shows how an LEI maps to Google's `iso6523Code`. For the wider picture of how `sameAs` and `@id` tie a brand together, see [building a knowledge graph for AI](/blog/knowledge-graph-for-ai).

## Step 5: Disclose and Keep It Accurate

Disclosure isn't optional when money is involved. Wikimedia's [Terms of Use](https://foundation.wikimedia.org/wiki/Policy:Terms_of_Use) require you to "disclose each and any employer, client, intended beneficiary and affiliation" for paid edits, on your user page, a talk page or in edit summaries. Wikidata's [paid editing policy](https://www.wikidata.org/wiki/Wikidata:Disclosure_of_paid_editing) asks for it on your user page, and says a clearly disruptive editor can be blocked without a warning. If editing is part of your job, you're a paid editor.

Use one account. Wikidata's [account policy](https://www.wikidata.org/wiki/Wikidata:Alternate_accounts) treats a second account used "to appear as a neutral third-party" as sockpuppetry. After that, add the Wikidata item to your watchlist, fix clear errors with a source, and leave sourced claims alone. For anything you'd rather not edit yourself, post on the item's talk page. When facts change, add the new value and keep the old one with an end date, as our [semantic drift guide](/blog/semantic-drift-ai-memory-reset) explains.

## What Gets a Wikidata Item Deleted

Wikidata's [deletion policy](https://www.wikidata.org/wiki/Wikidata:Deletion_policy) lets admins delete items that aren't notable, are vandalism, or contain "no data." To see which reasons dominate, we grouped the public deletion log for one day, 30 September 2026, by the reason written in each entry.

| Reason logged                                                   | Items deleted | Share    |
| --------------------------------------------------------------- | ------------- | -------- |
| Doesn't meet the notability policy                              | 129           | 45%      |
| Bot: its Wikipedia link was deleted and nothing else held it up | 113           | 40%      |
| Empty item                                                      | 15            | 5%       |
| Spam, advertising or promotion                                  | 5             | 2%       |
| Recreation of a deleted item                                    | 4             | 1%       |
| Vandalism                                                       | 1             | Under 1% |
| Other reasons                                                   | 19            | 7%       |
| **Total**                                                       | **286**       | **100%** |

Each row has a fix:

- **Not notable.** Wait until three independent sources exist, and put them on the item.
- **Lost Wikipedia link.** Don't rely on a new Wikipedia article. If it's deleted, a bot removes items with no other good facts. Never write a Wikipedia article about your own company; Wikipedia's [conflict-of-interest guideline](https://en.wikipedia.org/wiki/Wikipedia:Conflict_of_interest) says "COI editing is strongly discouraged."
- **Empty.** Add every fact in the first sitting.
- **Spam.** Keep the description neutral and the facts plain.
- **Recreated.** If your item is deleted, ask the deleting admin to restore it and explain which test it meets. Making it again gets a fresh deletion and can get you blocked.

Two traps don't show up as log reasons but cause the same result. Don't rewrite an existing item about something else into your company. And don't create items for your founders and brands just to link them together; the admin's guide says it "tends to invite batch deletion."

## Where Rankbox Fits

Rankbox doesn't create, request or edit Wikidata items, and it doesn't track citations. It helps with the part you control. The [Citation-Ready Writer](/features/citation-ready-writer) writes source-backed articles, such as a facts page, that state your founding date, founders and category in plain sentences on your own site. The Business plan is $49.50 a month with a 7-day trial when you add a card. [See pricing](/pricing).

## Frequently Asked Questions

### How long does it take to create a Wikidata item?

The form itself takes minutes. Adding every fact with its reference takes longer, so gather sources first. Review is fast: an admin's guide says new items are "typically reviewed very quickly." Requests vary more. In the August 2026 archive, some got an answer within days and others were archived with no decision.

### Can I pay someone to create a Wikidata item for my company?

You can, but they must disclose who pays them, under Wikimedia's Terms of Use and Wikidata's paid editing policy. Paying doesn't change the notability test. Wikidata's self-promotion essay says "paid promotion is still self-promotion," so a paid item faces the same scrutiny as one you make yourself.

### Does a company need a Wikipedia article to get a Wikidata item?

No. A company can qualify through serious, publicly available references instead. A Wikipedia article is the clearest route, but if it's deleted later, a Wikidata item that depended on it can be deleted by a bot. Don't write a Wikipedia article about your own company.

### What should my company's Wikidata description say?

A short, neutral noun phrase that tells you apart from namesakes, such as "invoicing and payments software company." Wikidata's guideline asks for 2 to 12 words, lowercase unless a proper noun, no full stop, and no promotional words like "leading" or "best."

### What happens if my Wikidata item is deleted?

Don't create it again. Find the reason in the deletion log, then ask the deleting admin, or the administrators' noticeboard, to restore it. Name the notability test it meets and link the sources. Re-creating a deleted item usually leads to a quick second deletion and can get your account blocked.

### Do I need an account to create a Wikidata item?

No, but an admin's guide calls one "highly recommended." An account lets reviewers contact you, keeps your edit history in one place, and gives you a user page for any paid editing disclosure. It also makes an undeletion request easier, since admins can see your past edits.

## References

1. [How to create an item on Wikidata so that it won't get deleted (essay), Wikidata](https://www.wikidata.org/wiki/User:Bovlb/How_to_create_an_item_on_Wikidata_so_that_it_won%27t_get_deleted)
2. [Wikidata: Notability, Wikidata](https://www.wikidata.org/wiki/Wikidata:Notability)
3. [Wikidata: Self-promotion, Wikidata](https://www.wikidata.org/wiki/Wikidata:Self-promotion)
4. [Requests for new items, Wikidata](https://www.wikidata.org/wiki/Wikidata:Requests_for_new_items)
5. [Help: Sources, Wikidata](https://www.wikidata.org/wiki/Help:Sources)
6. [Help: Description, Wikidata](https://www.wikidata.org/wiki/Help:Description)
7. [Disclosure of paid editing, Wikidata](https://www.wikidata.org/wiki/Wikidata:Disclosure_of_paid_editing)
8. [Terms of Use, Wikimedia Foundation](https://foundation.wikimedia.org/wiki/Policy:Terms_of_Use)
9. [Alternate accounts, Wikidata](https://www.wikidata.org/wiki/Wikidata:Alternate_accounts)
10. [Deletion policy, Wikidata](https://www.wikidata.org/wiki/Wikidata:Deletion_policy)
11. [Deletion log, Wikidata](https://www.wikidata.org/wiki/Special:Log/delete)
12. [Notability policy reform, Wikidata](https://www.wikidata.org/wiki/Wikidata:Requests_for_comment/Notability_policy_reform)
