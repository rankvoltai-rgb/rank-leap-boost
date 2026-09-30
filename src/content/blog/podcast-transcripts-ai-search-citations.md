---
title: Podcast Transcripts & Whisper AI: How Spoken Audio Becomes Search Citations
description: How podcast transcripts turn spoken audio into search citations, what OpenAI documents about Whisper, and a transcript page format AI engines can quote.
keyword: podcast transcripts
date: 2026-10-27
updated: 2026-10-27
written: 2026-09-30
author: Rankbox Team
tags: AI Search, Content Strategy
---

Podcast transcripts are how spoken audio becomes a search citation. Search engines and AI answer engines find, rank and quote text. Google's [list of indexable file types](https://developers.google.com/search/docs/crawling-indexing/indexable-file-types) names image and video formats but no audio format, so an interview that lives only as an MP3 gives them very little to cite. Publish podcast transcripts with timestamps and speaker labels on your own domain, and every sentence you said on air becomes a passage an engine can find and quote.

The plan behind this guide makes a second claim: that AI training pipelines now transcribe podcasts with Whisper, OpenAI's speech recognition model. Part of that is documented and part of it is only reported. OpenAI says Whisper learned from [680,000 hours of audio](https://github.com/openai/whisper/blob/main/model-card.md) paired with transcripts collected from the internet. The claim that OpenAI used Whisper on more than a million hours of YouTube video to train GPT-4 comes from a New York Times report in April 2024, as [The Verge summarized it](https://www.theverge.com/2024/4/6/24122915/openai-youtube-transcripts-gpt-4-training-data-google). OpenAI didn't confirm that detail. This guide keeps the two apart.

The audience is large. [Edison Research's Infinite Dial 2026](https://www.edisonresearch.com/the-infinite-dial-2026/) found that 58% of Americans age 12 and older had listened to or watched a podcast in the past month. Yet most founders treat a guest spot as a one-off conversation. Few publish podcast transcripts of their interviews, so the text they could own never exists.

This guide grades the Whisper claims, shows which platforms turn audio into searchable text, and gives you a transcript page format, a guesting plan and a worked example. For narrower questions, read our answers on [how a podcast can increase SEO](/blog/how-can-a-podcast-increase-seo), [podcast SEO for your show](/blog/podcast-seo) and [whether a podcast image helps SEO](/blog/does-podcast-image-help-seo).

## Key Takeaways

- Engines cite text. Google lists no audio format among the files it indexes, and it tells site owners to keep important content "available in textual form" for AI Overviews and AI Mode.
- OpenAI documents that Whisper learned from 680,000 hours of audio paired with internet transcripts. Its paper names no source websites, and it says machine-made transcripts were filtered out.
- The claim that OpenAI transcribed YouTube with Whisper to train GPT-4 rests on a New York Times report and a lawsuit. It is reported and alleged, not documented by OpenAI.
- Apple has auto-generated podcast transcripts since March 2024, and Spotify does for eligible episodes. Those transcripts live inside the apps, not on your website.
- Google shut down Google Podcasts in 2024 and lists no podcast structured data. VideoObject with Clip markup is the Google-supported option when a video is the page's main content.
- Good podcast transcripts open with a summary and a few quotable lines, then give chaptered, timestamped text with a speaker label on every turn.
- Check every machine transcript. Whisper's own model card warns it can output words "not actually spoken," and one study found invented phrases in about 1% of transcriptions.

## What Whisper Is, and What OpenAI Has Documented

Whisper is an automatic speech recognition (ASR) model: software that turns speech into text. OpenAI [announced it on 21 September 2022](https://openai.com/index/whisper/) and released the models and code as open source. It splits audio into 30-second chunks and predicts the text, with special tokens for tasks like language detection and phrase-level timestamps.

### What the paper and model card say about training data

The [Whisper paper](https://arxiv.org/abs/2212.04356) (Radford and colleagues, December 2022) says the team built its dataset "from audio that is paired with transcripts on the Internet." It gives no list of websites. The model card adds the mix: 438,000 hours of English audio with English transcripts, 126,000 hours of other languages with English transcripts, and 117,000 hours of other languages with matching transcripts, across 98 languages.

Two details matter for anyone publishing podcast transcripts:

- **The team removed machine-made transcripts.** The paper says many transcripts online are "the output of existing ASR systems," and that the team "developed many heuristics to detect and remove machine-generated transcripts" to avoid learning "transcript-ese." An all-lowercase transcript, or one that never uses a comma, was the kind of sign they looked for.
- **Podcasts appear only in the test sets.** The paper's one podcast reference is Rev16, 16 episodes from Rev.AI's podcast benchmark, used to measure accuracy after training. Nothing in the paper says podcasts were a training source, or that they weren't.

Later versions grew. OpenAI's [model card for large-v3](https://huggingface.co/openai/whisper-large-v3) (November 2023) says it was trained on 1 million hours of weakly labeled audio and 4 million hours of audio labeled by the earlier large-v2 model.

### Whisper in 2026

Whisper is no longer OpenAI's default transcription model. As of September 2026, OpenAI's [transcription guide](https://developers.openai.com/api/docs/guides/speech-to-text) recommends `gpt-transcribe` for recorded speech. It keeps `whisper-1` for word timestamps, subtitle formats and translation into English, and a separate `gpt-4o-transcribe-diarize` model for labelling who spoke when. Files can be up to 25 MB.

### What is reported or alleged, but not documented

On 6 April 2024 The New York Times reported that OpenAI, running short of training text, used Whisper to transcribe over a million hours of YouTube videos to train GPT-4. The Times also said OpenAI discussed transcribing podcasts and audiobooks. An OpenAI spokesperson [told The Verge](https://www.theverge.com/2024/4/6/24122915/openai-youtube-transcripts-gpt-4-training-data-google) only that the company curates "unique" datasets from "numerous sources including publicly available data and partnerships for non-public data."

In the same story, a Google spokesperson said YouTube's robots.txt and terms "prohibit unauthorized scraping or downloading of YouTube content." He added that Google had trained its own models "on some YouTube content, in accordance with our agreements with YouTube creators."

The claim then reached court. In Millette v. OpenAI, filed in 2024, a YouTube creator seeks to represent a class of creators whose video transcripts, the complaint says, were used to train OpenAI's models. On 3 April 2025 the federal [Judicial Panel on Multidistrict Litigation](https://www.jpml.uscourts.gov/sites/jpml/files/MDL-3143-Transfer_Order-3-25.pdf) moved it into the consolidated OpenAI copyright cases in New York. A complaint is an allegation, not a finding.

YouTube now gives creators a choice. Its [third-party training setting](https://support.google.com/youtube/answer/15509945?hl=en) is off by default and lets a channel allow named AI companies, or all of them, to train on its public videos.

### How the plan's claims grade

| Claim                                               | Evidence behind it                                                                         | Grade                                               |
| --------------------------------------------------- | ------------------------------------------------------------------------------------------ | --------------------------------------------------- |
| Whisper learned from web audio with transcripts     | Paper and model card                                                                       | Documented by OpenAI                                |
| Whisper's training audio included podcasts          | No sources named; podcasts appear only in test sets                                        | Not documented either way                           |
| OpenAI used Whisper on YouTube to train GPT-4       | NYT report with unnamed sources (April 2024); a lawsuit                                    | Reported and alleged                                |
| Google trained on YouTube content                   | Google spokesperson, April 2024                                                            | Stated by Google, scope not given                   |
| Search engines transcribe and index podcasts        | Google Podcasts did in 2019 and closed in 2024; Apple and Spotify transcribe in their apps | True for apps; not documented for Google web search |
| Transcripts on your domain help AI engines cite you | Google: keep important content in text; no vendor promises citations                       | Well-grounded inference                             |

The practical point: you can't see or edit what any lab trained on. Our [shadow training data audit](/blog/shadow-training-data-audit) explains why that inclusion is mostly unknowable. What you do control is the text of your podcast transcripts on your own site, which live search can read today. See [LLM training data](/glossary/llm-training-data) for the difference between memory and live retrieval.

## Where Spoken Audio Turns Into Searchable Text

Several platforms now make podcast transcripts automatically. Each uses them for its own purpose, and none of those copies lives on your site. That's why the first row matters most.

| Surface                         | Transcribes automatically?   | What the vendor documents about search                                   | What you should do                         |
| ------------------------------- | ---------------------------- | ------------------------------------------------------------------------ | ------------------------------------------ |
| Google Search                   | No audio indexing documented | Indexable media are images and video; key moments are detected in videos | Publish the text on a web page             |
| YouTube                         | Yes, automatic captions      | Relevance uses "title, tags, description, and video content"             | Upload corrected captions and chapters     |
| Apple Podcasts                  | Yes, since March 2024        | Search ranks on metadata, popularity and engagement                      | Supply a VTT file with speaker names       |
| Spotify                         | Yes, for eligible episodes   | Spotify says transcripts give its systems full text to index             | Review, then upload a corrected VTT or SRT |
| Google AI Overviews and AI Mode | Not applicable               | A supporting link must be indexed and eligible for a snippet             | Make the page indexable and text-first     |

### Google Search

Google indexes web pages and the images and videos on them. Its [video guidance](https://developers.google.com/search/docs/appearance/video) (last updated December 2025) covers watch pages, thumbnails and key moments, and says Google "tries to automatically detect the segments in your video." It says nothing about captions or transcripts. So whether Google reads YouTube's automatic captions for web ranking is not documented.

Old advice says "Google transcribes podcasts." That came from the Google Podcasts app, which [transcribed episodes in 2019](https://9to5google.com/2019/03/27/google-podcasts-transcribing-episodes/) to power its own search. Google then [announced in 2023](https://blog.youtube/news-and-events/podcast-destination-on-youtube-music/) that it would shut the app down and move podcasts to YouTube Music, and the US shutdown came in 2024.

### YouTube

YouTube can create [automatic captions](https://support.google.com/youtube/answer/6373554?hl=en) with speech recognition, and warns they "might misrepresent the spoken content due to mispronunciations, accents, dialects, or background noise." Its [search help](https://support.google.com/youtube/answer/16090438?hl=en) says relevance weighs "title, tags, description, and video content," without defining video content.

YouTube also matters for AI answers. In [Ahrefs' September 2026 data](https://ahrefs.com/blog/most-cited-domains-ai-overviews/) across more than 3 million US queries, youtube.com took 22.9% of citations among the top cited domains in Google's AI Overviews, more than any other site.

### Apple Podcasts and Spotify

Apple [introduced transcripts on 5 March 2024](https://www.apple.com/newsroom/2024/03/apple-introduces-transcripts-for-apple-podcasts/). Its [creator guide](https://podcasters.apple.com/support/5316-transcripts-on-apple-podcasts) now lists 11 languages and says Apple generates a transcript after each new episode is published. You can supply your own podcast transcripts through the `<podcast:transcript>` tag in your feed, and a VTT file lets you name every speaker. Apple's [search factors](https://podcasters.apple.com/support/3686-search-on-apple-podcasts) are metadata, popularity and engagement. Transcripts aren't on that list.

Spotify says it [auto-generates podcast transcripts](https://support.spotify.com/us/creators/article/managing-episode-transcripts-on-spotify/) for eligible episodes, which you can download, correct and re-upload as VTT or SRT. In an [August 2026 guide](https://creators.spotify.com/resources/grow/podcast-seo), Spotify says transcripts give "Spotify's systems a full-text version of your episode to index." That is Spotify describing its own search. It is not evidence about Google or ChatGPT.

## The Transcript Page Format

Podcast transcripts on the web have two readers. A person wants the gist fast and a way to jump to the good part. An engine wants passages that stand alone and name who said what. This format serves both.

| Element          | What to put there                                                                                        | Why it earns its place                                      |
| ---------------- | -------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------- |
| Title and H1     | Guest name, topic and show: "How agencies cut late invoices, with Oren Falk on The Retainer Room"        | Matches how people search; "Episode 47" matches nothing     |
| Summary          | 60 to 100 words that answer the episode's main question first                                            | Gives engines a quotable opening passage                    |
| Quotable lines   | Three to five exact quotes, each with speaker and timestamp                                              | Short, attributed claims are the easiest text to cite       |
| Chapter headings | H2 or H3 per topic, phrased as the question it answers, with a start time                                | Splits a long text into passages that each answer one thing |
| Speaker labels   | Full name and role on first turn, then first name on every turn                                          | Ties each claim to a named person                           |
| Timestamps       | One per chapter and roughly every two minutes, linked to the player                                      | Lets readers and editors check the audio                    |
| Transcript body  | Clean verbatim: drop filler words and false starts, keep meaning                                         | Readable text without changing what anyone said             |
| People and links | Guest and host bios, profile links, sources mentioned on air                                             | Connects the speakers to their other pages                  |
| Player           | The audio player, or the YouTube video if one exists                                                     | Keeps the original one click away                           |
| Structured data  | Article or BlogPosting with author; VideoObject plus Clip only when the video is the page's main content | Only markup Google documents for this page type             |
| Feed link        | `<podcast:transcript>` pointing to the VTT file, and optionally to the HTML page                         | Lets apps show your corrected text                          |

### Clean verbatim or full verbatim

Full verbatim keeps every "um," restart and cough. Clean verbatim removes them but keeps every claim, number and name exactly as spoken. Use clean verbatim for podcast transcripts you publish. Keep the raw file for your records. If you tidy a sentence so much that its meaning shifts, it's no longer a transcript. Put it in the summary as a paraphrase instead.

### Structured data that fits

Google's [structured data gallery](https://developers.google.com/search/docs/appearance/structured-data/search-gallery) lists no podcast type, although schema.org defines `PodcastEpisode`. Adding it won't earn a Google rich result, and Google's [AI features guide](https://developers.google.com/search/docs/appearance/ai-features) says there is "no special schema.org structured data" needed for AI Overviews or AI Mode. Use `Article` or `BlogPosting` with the author marked up for text-first podcast transcripts. If the episode's video is the main thing on the page, add [VideoObject with Clip](https://developers.google.com/search/docs/appearance/structured-data/video) for each chapter, with `name`, `startOffset`, `endOffset` and `url`. Our [schema generator](/tools/schema-generator) builds the JSON-LD.

### Link the page from your feed

The [Podcasting 2.0 transcript tag](https://github.com/Podcastindex-org/podcast-namespace/blob/main/docs/tags/transcript.md) allows several entries per episode. Apple accepts only closed-caption formats (VTT or SRT) in it, so list the VTT file first and your HTML page as a second entry for apps that read it:

```xml
<item>
  <title>How agencies cut late invoices</title>
  <podcast:transcript url="https://tallyfold.example/podcast/late-invoices.vtt" type="text/vtt" />
  <podcast:transcript url="https://tallyfold.example/podcast/late-invoices" type="text/html" />
</item>
```

## The Quote-Ready Transcript Method

This is our seven-step routine for turning recordings into podcast transcripts an engine can quote. Steps 3 and 4 protect accuracy. Steps 5 and 6 make the text quotable.

1. **Record each voice on its own track.** Separate tracks make speaker labels easier. Apple notes that cross-talk makes episodes "more difficult to transcribe."
2. **Transcribe with timestamps and speakers.** Download the app's transcript, run the audio through a speech-to-text model that returns speaker labels, or use a service. Keep the timestamps.
3. **Correct names and terms first.** Fix the guest's name, your brand, product names and numbers before anything else. These are the words machines miss most, and the words you most want quoted.
4. **Spot-check accuracy.** Measure errors on three short samples, as shown in the next section.
5. **Cut it into chapters.** Break the text wherever the topic changes and give each chapter a question heading and a start time.
6. **Write the summary and pull the quotes.** Answer the episode's main question in the first 60 to 100 words. Pick three to five lines that make one clear, sourced claim each.
7. **Publish, link and submit.** Put the page on your domain, add it to your sitemap, link it from the episode's show notes and your feed, and request indexing.

Step 6 is where most podcast transcripts fall short. A transcript is long and loosely ordered, because talk is. The summary and quotable lines give an engine a tight passage to lift. Our guide to [writing blog posts for AI citation](/blog/how-to-write-blog-posts-for-ai-citation) covers those passage patterns in more depth, and the free [AI citation readiness checker](/tools/ai-citation-readiness-checker) scores the result.

## Accuracy Checks for Machine Transcripts

Machine-made podcast transcripts are good and still wrong in ways that matter. A misheard price or a sentence nobody said, published under your guest's name, is worse than no transcript.

### Know the failure modes

- **Invented text.** Whisper's model card warns that outputs "may include texts that are not actually spoken." In a 2024 study, [Koenecke and colleagues](https://arxiv.org/abs/2402.08021) found that about 1% of Whisper transcriptions contained whole invented phrases or sentences, more often for speakers who paused for long stretches. They judged 38% of those inventions harmful, such as false associations or violence.
- **Names and jargon.** Brand names split in two ("Tally fold") or turn into common words. Apple advises putting host and guest names in your show and episode descriptions so its transcripts spell them right.
- **Wrong speaker.** Overlapping speech confuses speaker labels. YouTube's help says captions may fail entirely when "multiple speakers" overlap.
- **Hints that backfire.** OpenAI's newer models accept keyword hints, but the guide says to check that hints don't cause "unspoken terms to appear."
- **Numbers.** "Fifteen" and "fifty" sound alike. Check every figure against the audio.

### Measure a word error rate

Word error rate (WER) is the standard accuracy measure in speech recognition, and the one the Whisper paper reports. Take a sample, correct it by ear, and count:

**WER = (substitutions + deletions + insertions) ÷ words in the corrected text**

Sample three two-minute stretches: the opening, the densest technical part and the part with the most cross-talk. At normal talking speed that's roughly 900 words. If your error rate is above about 5%, correct the whole file by ear rather than just fixing names. That threshold is our rule of thumb, not an industry standard.

### Accuracy is also a platform rule

Apple's [content guidelines](https://podcasters.apple.com/support/891-content-and-subscription-guidelines) say the podcast transcripts you supply "must accurately reflect and correspond to" the content, and its transcript guide says files that fall below its quality standards won't be shown. Whisper's model card also cautions against transcribing recordings of people "taken without their consent." For a guest spot, that means asking the host before you publish their show's words.

## The Guesting Co-Citation Plan

Guest spots create mentions you don't write yourself. When a host introduces you as "Tallyfold, the invoicing tool for agencies" next to a well-known rival, that's a co-citation: an independent source naming you in the same breath as a category leader. Our guide to [co-citation and link building](/blog/link-building-ai-visibility-co-citation) grades the evidence for why that matters.

The best data point for audio is indirect. In [Ahrefs' study of 75,000 brands](https://ahrefs.com/blog/ai-brand-visibility-correlations/) (December 2025), YouTube mentions, which Ahrefs counts from video titles, transcripts and descriptions, had the strongest correlation with AI visibility, about 0.737, across ChatGPT, AI Mode and AI Overviews. That is a correlation from Ahrefs' own tool data, not proof that mentions cause citations. Big brands may simply win on every measure. See [brand mentions](/glossary/brand-mentions) for how this fits with other off-site signals.

| Stage  | What to do                                                                                                       | Why                                                           |
| ------ | ---------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------- |
| Before | Pick shows whose episode pages or videos already appear in AI answers for your category prompts                  | Those pages are already in the sources engines read           |
| Before | Send the host a one-page fact sheet: correct spellings, your category in one sentence, one number you can source | Prevents misheard names in their show notes and transcript    |
| On air | Say your full brand name with your category and a rival in the same sentence at least once                       | Creates the co-citation in the audio, captions and transcript |
| On air | Make one specific, sourced claim you'd be happy to see quoted                                                    | Gives the transcript a line worth lifting                     |
| After  | Ask for a show-notes link to your most relevant page                                                             | An editorial link and a written mention                       |
| After  | Publish your own companion page with your quotes and a link to the episode                                       | Text you own, reviewed by you                                 |
| After  | Post a short clip with corrected captions on YouTube                                                             | Adds a YouTube mention with an accurate transcript            |

### Keep the links and copies clean

Two rules keep a guesting program on the right side of Google's policies. First, if you pay to appear, the show-notes link shouldn't pass ranking credit. Google's [spam policies](https://developers.google.com/search/docs/essentials/spam-policies) list "exchanging money for links, or posts that contain links" as link spam, so a paid spot needs a `rel="sponsored"` link.

Second, don't copy the host's full transcript onto your site as an indexable page. Google's [canonicalization guidance](https://developers.google.com/search/docs/crawling-indexing/canonicalization-troubleshooting) says the best fix for syndicated copies is for the partner to "block indexing." A companion page that quotes your own lines, adds context and links to the episode is original. A full copy of someone else's episode is not, and mass-transcribing other shows edges toward what Google calls [scaled content abuse](/glossary/scaled-content-abuse).

## Worked Example: Tallyfold on The Retainer Room

Tallyfold is a fictional invoicing and payments app for agencies. Its fictional founder, Oren Falk, is a guest on The Retainer Room, a made-up podcast for agency owners. The rival brands Brindlework and Kestrelyn are also fictional, and every figure below is illustrative.

### The episode and the transcript

The episode runs 42 minutes. At about 150 spoken words a minute, the transcript is roughly 42 × 150 = 6,300 words. The host's platform produces an automatic transcript within a day, and Tallyfold downloads it with the host's permission.

Oren's team runs the WER check on three two-minute samples totalling 912 words:

| Sample                     | Words   | Substitutions | Deletions | Insertions | Errors |
| -------------------------- | ------- | ------------- | --------- | ---------- | ------ |
| Opening (0:00–2:00)        | 318     | 4             | 1         | 0          | 5      |
| Pricing talk (18:40–20:40) | 301     | 7             | 1         | 0          | 8      |
| Cross-talk (33:10–35:10)   | 293     | 3             | 1         | 2          | 6      |
| **Total**                  | **912** | **14**        | **3**     | **2**      | **19** |

WER = 19 ÷ 912 = 2.1%. That's under the 5% rule, so the team fixes the known problems rather than re-transcribing everything. Nine of the 14 substitutions are names: "Tally fold" twice, "Brindle work" three times and Oren's surname four times. The pricing sample misheard "a 15-day payment term" as "a 50-day payment term," which would have been a false claim in Oren's voice. The two insertions are a short phrase nobody said, added during a pause. All get fixed against the audio.

### The companion page

The host controls the show's own podcast transcripts, so Tallyfold publishes a companion page at `tallyfold.example/podcast/retainer-room-late-invoices`, not a copy of the whole show:

- **H1:** How agencies cut late invoices: Oren Falk on The Retainer Room
- **Summary (84 words):** answers "why do agency invoices get paid late?" in the first sentence.
- **Four quotable lines**, each with speaker and time, such as Oren at 18:52: "Most late invoices we see aren't disputes. They're invoices sent to the wrong person."
- **Five chapters** with question headings, the corrected excerpts Oren spoke, and links to the host's episode page at each time.
- **Markup:** BlogPosting with Oren as author, linked to his bio page.

### The co-citation tally

Before the episode, Tallyfold's team ran 20 category prompts by hand ("best invoicing tool for agencies" and similar) and logged the 12 pages the answers cited. Brindlework appeared on 9 of the 12 pages, Kestrelyn on 7 and Tallyfold on 1. Ten of the 12 pages named at least one rival, and Tallyfold sat beside a rival on just 1 of those 10: 10%.

The episode can add two independent pages that name Tallyfold beside Brindlework: the host's episode page and the YouTube video with its captions. Tallyfold's own companion page doesn't count, because a brand's page about itself isn't independent. If engines begin citing both new pages for those prompts, the cited set grows to 14 pages, 12 of them naming a rival, and Tallyfold sits beside a rival on 3 of those 12: 25%. Nothing guarantees they will. The team re-runs the same 20 prompts after six weeks to see, using the method in our guide to [measuring GEO](/blog/how-to-measure-geo).

## Where Rankbox Fits

Rankbox doesn't transcribe audio, host podcasts or publish episodes, and it doesn't track AI citations today. Transcribing, correcting and publishing podcast transcripts is yours to do with the steps above.

What Rankbox does is the written content around your podcast transcripts. Answer-Space Research finds the questions buyers ask ChatGPT, Perplexity and Google about your topic. The [Citation-Ready Writer](/features/citation-ready-writer) researches the live web and writes 2,000 to 3,500-word source-backed articles on those questions, in your Brand Voice, delivered to your site through Rankbox's API. The Business plan is $49.50 a month with a 7-day trial; see [pricing](/pricing).

## Frequently Asked Questions

### Does Google index podcast audio?

Google doesn't document indexing audio files. Its list of indexable file types covers text, documents, images and video, with no audio format. Google indexes the pages around a podcast (episode pages, show notes, podcast transcripts) and YouTube videos, including key moments. Whether it reads YouTube's automatic captions for web ranking isn't stated.

### Did OpenAI use Whisper to transcribe podcasts for training?

OpenAI hasn't said so. It documents that Whisper itself learned from 680,000 hours of web audio paired with transcripts, without naming sources. The New York Times reported in April 2024 that OpenAI used Whisper on over a million hours of YouTube video for GPT-4, and said it discussed podcasts. A 2024 lawsuit makes a similar claim. Both are reports or allegations.

### Should I publish full podcast transcripts or just show notes?

Publish both on your own episodes. Show notes help people decide to listen. A full, corrected transcript adds every name, number and claim as text an engine can quote. Add a summary and chapter headings so the page isn't one long block. For guest spots on other shows, publish a companion page with your quotes instead of copying the host's transcript.

### Can I use YouTube's automatic captions as my transcript?

Yes, as a first draft. YouTube itself warns that automatic captions can misrepresent speech and tells creators to review them. Download the captions, correct names and numbers against the audio, add speaker labels and chapters, then publish the cleaned version on your site and upload it back to YouTube as captions.

### Does PodcastEpisode schema help SEO?

Not for Google rich results. Schema.org defines PodcastEpisode, but Google's structured data gallery lists no podcast type. Google also says AI Overviews and AI Mode need no special markup. Use Article or BlogPosting for text-first podcast transcripts, and VideoObject with Clip markup when the episode video is the page's main content.

### How accurate are AI podcast transcripts?

Machine-made podcast transcripts are usually accurate enough for a first draft, but not to publish unchecked. Whisper's model card warns it can output text nobody said, and a 2024 study found invented phrases in about 1% of Whisper transcriptions. Names, jargon and numbers are the most common misses. Check a sample and fix every name and figure before publishing.

## References

1. [Introducing Whisper, OpenAI (21 September 2022)](https://openai.com/index/whisper/)
2. [Robust Speech Recognition via Large-Scale Weak Supervision (Radford et al., 2022)](https://arxiv.org/abs/2212.04356)
3. [Whisper model card, OpenAI on GitHub](https://github.com/openai/whisper/blob/main/model-card.md)
4. [Whisper large-v3 model card, OpenAI on Hugging Face](https://huggingface.co/openai/whisper-large-v3)
5. [File transcription guide, OpenAI API docs](https://developers.openai.com/api/docs/guides/speech-to-text)
6. [OpenAI transcribed over a million hours of YouTube videos to train GPT-4, The Verge (6 April 2024)](https://www.theverge.com/2024/4/6/24122915/openai-youtube-transcripts-gpt-4-training-data-google)
7. [Transfer Order, In re: OpenAI, Inc. Copyright Infringement Litigation, MDL No. 3143 (3 April 2025)](https://www.jpml.uscourts.gov/sites/jpml/files/MDL-3143-Transfer_Order-3-25.pdf)
8. [Careless Whisper: Speech-to-Text Hallucination Harms (Koenecke et al., 2024)](https://arxiv.org/abs/2402.08021)
9. [File types indexable by Google, Google Search Central](https://developers.google.com/search/docs/crawling-indexing/indexable-file-types)
10. [AI features and your website, Google Search Central](https://developers.google.com/search/docs/appearance/ai-features)
11. [Video SEO best practices, Google Search Central](https://developers.google.com/search/docs/appearance/video)
12. [Video (VideoObject, Clip) structured data, Google Search Central](https://developers.google.com/search/docs/appearance/structured-data/video)
13. [Transcripts on Apple Podcasts, Apple Podcasts for Creators](https://podcasters.apple.com/support/5316-transcripts-on-apple-podcasts)
14. [How Search works on Apple Podcasts, Apple Podcasts for Creators](https://podcasters.apple.com/support/3686-search-on-apple-podcasts)
15. [Managing episode transcripts on Spotify, Spotify for Creators](https://support.spotify.com/us/creators/article/managing-episode-transcripts-on-spotify/)
16. [Use automatic captioning, YouTube Help](https://support.google.com/youtube/answer/6373554?hl=en)
17. [The transcript tag, Podcasting 2.0 namespace](https://github.com/Podcastindex-org/podcast-namespace/blob/main/docs/tags/transcript.md)
18. [Top brand visibility factors in ChatGPT, AI Mode and AI Overviews, Ahrefs (December 2025)](https://ahrefs.com/blog/ai-brand-visibility-correlations/)
19. [The Infinite Dial 2026, Edison Research](https://www.edisonresearch.com/the-infinite-dial-2026/)
20. [Spam policies for Google web search, Google Search Central](https://developers.google.com/search/docs/essentials/spam-policies)
