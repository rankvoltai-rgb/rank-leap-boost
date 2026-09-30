---
title: Podcast SEO: How to Get Your Show Found in Search, Apps and AI
description: Podcast SEO for your show in 2026: what Apple, Spotify, YouTube and Google document about titles, feeds, artwork and search, plus a 30-minute audit.
keyword: podcast SEO
date: 2026-11-10
updated: 2026-11-10
written: 2026-09-30
author: Rankbox Team
tags: SEO, Content Strategy
---

Podcast SEO is the work of making your show and its episodes easy to find in three places: podcast apps, Google, and AI assistants. Each one reads different signals. Apple ranks shows on metadata, popularity and engagement, Google ranks the web pages and YouTube videos around a show, and AI answers cite text they can read.

The ground has shifted in two years. Google closed its own podcast app in 2024 and moved listeners to YouTube Music. In [Edison Research's podcast data](https://www.edisonresearch.com/youtube-is-the-preferred-podcast-listening-service/) published in October 2024, YouTube was the service weekly US listeners used most for podcasts: 31%, ahead of Spotify at 27% and Apple Podcasts at 15%.

This guide covers the show itself: platform rules for titles and descriptions, the feed fields that carry your metadata, YouTube, and your own episode pages. Transcripts are the one part of podcast SEO that feeds every surface at once, so they get their own guide: read our [deep dive on podcast transcripts and how spoken audio becomes search citations](/blog/podcast-transcripts-ai-search-citations).

## Key Takeaways

- Apple Podcasts orders search results by metadata (show name, channel name, episode title), popularity and engagement. It says ratings and reviews don't count.
- Apple warns that stuffing a show title with keywords can get the show removed from its directory, and its RSS guide doesn't list an `<itunes:keywords>` tag.
- Google shut down Google Podcasts in 2024, and its structured data gallery lists no podcast rich result. Listeners were sent to YouTube Music.
- On YouTube a podcast is a playlist. YouTube asks you to use your show's exact name as the title and not to add the word "podcast" unless it's part of the name.
- Search Console can now report a YouTube channel's Google Search clicks through platform properties, a feature Google says is still rolling out.
- Your own episode pages are the only podcast SEO asset that Google, AI engines and listeners can all read in full.

## Where People Look for Podcasts in 2026

Listening is at a record high. [Edison's Infinite Dial 2026](https://www.edisonresearch.com/the-infinite-dial-2026/), based on a January 2026 survey of 2,050 Americans age 12 and older, found 58% had consumed a podcast in the past month, and 57% had both listened to and watched one.

That split between audio and video shapes podcast SEO. A show found in Apple Podcasts is found by its feed metadata. A show found on YouTube is found as videos in a playlist. A show found in Google is usually found through a web page or a YouTube video. Plan for all three. The feed takes the least work, YouTube more, and your own pages the most.

## What Google Offers Podcasters Now

Much podcast SEO advice still describes Google tools that no longer exist.

### Google Podcasts is gone

Google [announced in September 2023](https://blog.youtube/news-and-events/podcast-destination-on-youtube-music/) that it would discontinue Google Podcasts in 2024 and move listeners to YouTube Music. Its [December 2023 update](https://blog.youtube/news-and-events/migrating-your-podcasts/) set the US end of listening for March 2024, with subscription exports open through July. Listeners can now add any show to YouTube Music by its RSS feed URL.

### There is no podcast rich result

Google's [structured data gallery](https://developers.google.com/search/docs/appearance/structured-data/search-gallery), last updated June 2026, has no podcast type. Schema.org's `PodcastEpisode` still exists, but no Google feature is documented to use it.

What Google does support for episodes is video. If an episode is on YouTube or embedded on your page, Google's [video guidance](https://developers.google.com/search/docs/appearance/video) covers indexing, thumbnails and key moments.

### Search Console can report on your YouTube channel

Google now offers [platform properties](https://support.google.com/webmasters/answer/17148418) in Search Console for YouTube, Instagram and TikTok accounts. Once verified, a YouTube channel gets its own report of clicks, impressions and the queries that found its videos in Google Search. Google says it's "rolling out this feature gradually," so you may not see it yet. Its [how-to page](https://developers.google.com/search/docs/monitor-debug/analyze-social-video-content) suggests using the queries to plan new episodes.

## Titles and Descriptions Each Platform Rewards

On titles, the podcast SEO advice from the three big platforms agrees more than it differs. Each wants a specific, recognisable show name and an honest description.

| Platform       | Show title                                                              | Description                                                                                   | Hard rule                                         |
| -------------- | ----------------------------------------------------------------------- | --------------------------------------------------------------------------------------------- | ------------------------------------------------- |
| Apple Podcasts | Specific and unique; Apple "uses this field for search"                 | Up to 4,000 bytes; write for listeners                                                        | Keyword lists "may" get the show removed          |
| Spotify        | Short (three to four words), with a word that says what the show covers | First 250 characters show before a listener taps to expand; full sentences, not keyword lists | Avoid special characters and generic words        |
| YouTube        | The show's exact name; don't add "podcast" unless it's part of the name | "Detailed," to help new listeners find the show                                               | Only full-length episodes in the podcast playlist |

Sources: Apple's [RSS guide](https://help.apple.com/itc/podcasts_connect/#/itcb54353390) and [search page](https://podcasters.apple.com/support/3686-search-on-apple-podcasts), Spotify's [podcast SEO guide](https://creators.spotify.com/resources/grow/podcast-seo) (August 2026), and YouTube's [podcast discovery tips](https://support.google.com/youtube/answer/12950577?hl=en).

### Resolve the one conflict

Spotify suggests putting a topic word in the show title. YouTube says to use the show's name and nothing extra. Apple says to be specific but warns it may remove shows over keyword lists. The safe path satisfies all three: pick a name that already says what the show covers, then use that exact name everywhere. "Paid on Time" (a fictional show from Tallyfold, a fictional invoicing app) works on every platform. "Paid on Time Podcast | Invoicing, Cash Flow, Agency Billing Tips" breaks YouTube's advice and flirts with Apple's rule.

### Write episode titles like questions

Apple says not to put episode or season numbers in the title, because it has separate tags for them, and not to repeat the show name. Spotify's guide suggests titling episodes the way people search. Put together:

| Weak episode title    | Better episode title                               | Why                                                  |
| --------------------- | -------------------------------------------------- | ---------------------------------------------------- |
| Ep. 31: Maren Castell | Why do agency clients pay late? With Maren Castell | Numbers go in their own tag; the topic is searchable |
| Paid on Time #12, Q&A | What to put in a retainer contract                 | Drops the show name and number; names the topic      |
| Cash flow chat 🚀     | How to forecast cash flow for a 10-person agency   | Apple advises against emojis in titles               |

## The Feed Fields Behind Your Podcast SEO

Your RSS feed is the file every app reads. Apple's guide splits tags into required, recommended and situational. The ones that shape how your show is found are below.

| Feed field             | Level             | What it controls                | Rule to follow                                      |
| ---------------------- | ----------------- | ------------------------------- | --------------------------------------------------- |
| `<title>`              | Show, required    | Show name in apps and search    | Specific; no keyword lists                          |
| `<description>`        | Show, required    | The "about" text                | Up to 4,000 bytes; sentences, not tags              |
| `<itunes:image>`       | Show, required    | Cover art                       | 1400 to 3000 px square, JPEG or PNG, RGB            |
| `<language>`           | Show, required    | The language of the show        | Valid ISO 639 code or the feed fails validation     |
| `<itunes:category>`    | Show, required    | Where the show is filed         | Apple reads only the first category and subcategory |
| `<itunes:author>`      | Show, recommended | The person or company behind it | Same name you use everywhere else                   |
| `<link>`               | Show, recommended | Your website                    | Point it at your podcast page, not a link tree      |
| `<title>` (episode)    | Episode, required | Episode name                    | No episode number or show name inside it            |
| `<guid>`               | Episode, required | Permanent episode ID            | Never change it, or apps show duplicates            |
| `<podcast:transcript>` | Episode, optional | Transcript file                 | VTT preferred by Apple                              |
| `<podcast:chapters>`   | Episode, optional | Chapter titles and times        | Apple suggests titles of 45 characters or fewer     |

Apple says it picks up feed changes [within 24 hours](https://podcasters.apple.com/support/832-podcast-metadata). Its [content guidelines](https://podcasters.apple.com/support/891-content-and-subscription-guidelines) also require metadata that "accurately represent[s]" the episode, and ban attempts "to influence search using inaccurate or inappropriate terms." If an episode uses AI-generated voices or hosts, Apple requires you to disclose it in the content and the metadata.

## YouTube as a Podcast Platform

YouTube treats a podcast as a playlist, with each episode as a video. Its [creation guide](https://support.google.com/youtube/answer/12751636?hl=en) says marking a playlist as a podcast can bring badges, inclusion in YouTube Music, a spot on youtube.com/podcasts and "improved search features." It also needs a square podcast thumbnail, with 1280 by 1280 pixels recommended.

Audio-first shows don't have to make video. YouTube's [RSS delivery](https://support.google.com/youtube/answer/13525207?hl=en) builds a static-image video from your show art for each episode and uploads new ones automatically. That puts the show on YouTube, but a still image gives viewers little reason to stay. Treat it as a floor, not the goal.

Three habits matter most for podcast SEO on YouTube:

1. **Fix the captions.** YouTube's [automatic captions](https://support.google.com/youtube/answer/6373554?hl=en) come from speech recognition, and YouTube says to review them because they "might misrepresent the spoken content."
2. **Add timestamps to the description.** Google says it prioritises key moments you mark this way when showing videos in Google Search.
3. **Match titles to the playlist rule.** Episode name first, show name optional, as YouTube's discovery tips suggest.

YouTube's [search help](https://support.google.com/youtube/answer/16090438?hl=en) says it weighs how well the "title, tags, description, and video content" match a query, then engagement and quality. Watch time for a query is one of the engagement signals it names.

## Episode Pages on Your Own Site

Apps and YouTube pages belong to someone else. An episode page on your own domain is the podcast SEO asset you fully control, and the one Google's web index and AI engines read most easily.

Give every episode its own URL with:

- a title built from the topic and the guest, not the episode number;
- a short summary that answers the episode's main question;
- the player, or the embedded YouTube video;
- chapter headings with timestamps;
- the guest's bio and links;
- the corrected transcript, formatted as the hub guide describes.

Then connect the pieces. Point your feed's `<link>` at the podcast section of your site. Add episode pages to your sitemap. Link each page from the episode's show notes in every app. Our guide on [how a podcast can increase SEO](/blog/how-can-a-podcast-increase-seo) scores these steps, and our note on [podcast images and SEO](/blog/does-podcast-image-help-seo) covers the pictures on these pages.

## The 30-Minute Show Findability Audit

Run this once a quarter. Each check names where to look, so you can finish it in half an hour.

1. **Name check.** Search your show's exact name in Apple Podcasts, Spotify, YouTube and Google. Does your show come first in each?
2. **Title rules.** Does the show title avoid keyword lists, episode numbers and the extra word "podcast" (unless it's in the name)?
3. **Description opening.** Do the first 250 characters say who the show is for and what it covers, in a sentence?
4. **Feed validity.** Is Apple Podcasts Connect free of feed warnings for language, category and artwork?
5. **Episode titles.** Do the last five episode titles name a topic someone would search for?
6. **Author consistency.** Is the host's name spelled the same in `<itunes:author>`, YouTube, Spotify and your site?
7. **YouTube playlist.** Is there one public podcast playlist per show, full episodes only, in order?
8. **Captions.** Were the captions on the last three YouTube episodes reviewed and corrected?
9. **Episode pages.** Does each recent episode have its own page on your site, in your sitemap?
10. **Google data.** Do Search Console and, if you have it, the YouTube platform property show which queries found your episodes?

Score one point per yes. By our rule of thumb, 8 or more means your podcast SEO basics are in place, and the next gains come from transcripts and guest appearances. Below 6, fix the failing checks before you publish more episodes.

## Where Rankbox Fits

Rankbox doesn't host podcasts, transcribe audio or publish to podcast apps, and it doesn't track AI citations. It can help with the written half of podcast SEO. Its [Answer-Space Research](/features/answer-space-research) maps the questions buyers ask ChatGPT, Perplexity and Google, which makes a good source of episode topics. Its Citation-Ready Writer turns those questions into 2,000 to 3,500-word source-backed articles for your site, delivered through Rankbox's API. The Business plan is $49.50 a month with a 7-day trial; see [pricing](/pricing).

## Frequently Asked Questions

### What is podcast SEO?

Podcast SEO is making a show and its episodes easy to find in podcast apps, Google and AI assistants. It covers show and episode titles, descriptions, feed fields, cover art, YouTube uploads, episode pages on your own site and transcripts. Each surface ranks differently, so the work spans all of them.

### Does Google still have a podcast directory?

No. Google discontinued Google Podcasts in 2024 and moved listeners to YouTube Music, where people can add shows by RSS feed. Google lists no podcast rich result in its structured data gallery. Your show reaches Google Search through your website's episode pages and through YouTube videos.

### Do keywords in a podcast title help?

A little, if the words are part of a real name. Apple uses the title for search but warns that keyword lists can get a show removed. YouTube asks you not to add extra words. Choose a name that already describes the show, and put the detail in episode titles and descriptions.

### Does Apple Podcasts use the itunes:keywords tag?

Apple doesn't list it. Apple's RSS guide covers required, recommended and situational tags, and `<itunes:keywords>` isn't among them. Apple's search page names metadata such as the show name, channel name and episode title, plus popularity and engagement, as its main factors.

### Should a podcast have its own website?

Yes, or at least its own section on your company site. Apps and YouTube control their pages, but an episode page on your domain can rank in Google, carry a transcript and appear in AI answers. Link it from your feed and from every episode's show notes.

### How do AI assistants find podcasts?

Mostly through text and YouTube. Google says pages need to be indexed with important content "available in textual form" to appear in AI Overviews and AI Mode, and in [Ahrefs' September 2026 data](https://ahrefs.com/blog/most-cited-domains-ai-overviews/) YouTube was the most cited domain in Google's AI Overviews. Episode pages with transcripts and captioned YouTube videos give assistants something to read.

## References

1. [YouTube is the preferred podcast listening service, Edison Research (October 2024)](https://www.edisonresearch.com/youtube-is-the-preferred-podcast-listening-service/)
2. [The Infinite Dial 2026, Edison Research](https://www.edisonresearch.com/the-infinite-dial-2026/)
3. [Creating a centralized podcast destination on YouTube Music, YouTube Official Blog (September 2023)](https://blog.youtube/news-and-events/podcast-destination-on-youtube-music/)
4. [Migrating your podcasts from Google Podcasts, YouTube Official Blog (December 2023)](https://blog.youtube/news-and-events/migrating-your-podcasts/)
5. [Structured data markup that Google Search supports, Google Search Central](https://developers.google.com/search/docs/appearance/structured-data/search-gallery)
6. [About platform properties in Search Console, Search Console Help](https://support.google.com/webmasters/answer/17148418)
7. [A Podcaster's Guide to RSS, Apple Podcasts Connect Help](https://help.apple.com/itc/podcasts_connect/#/itcb54353390)
8. [How Search works on Apple Podcasts, Apple Podcasts for Creators](https://podcasters.apple.com/support/3686-search-on-apple-podcasts)
9. [Apple Podcasts content guidelines, Apple Podcasts for Creators](https://podcasters.apple.com/support/891-content-and-subscription-guidelines)
10. [Words matter: how to get your podcast SEO right, Spotify for Creators (August 2026)](https://creators.spotify.com/resources/grow/podcast-seo)
11. [Create a podcast in YouTube Studio, YouTube Help](https://support.google.com/youtube/answer/12751636?hl=en)
12. [Podcast discovery tips, YouTube Help](https://support.google.com/youtube/answer/12950577?hl=en)
13. [Deliver podcasts using an RSS feed, YouTube Help](https://support.google.com/youtube/answer/13525207?hl=en)
14. [How YouTube search works, YouTube Help](https://support.google.com/youtube/answer/16090438?hl=en)
15. [Video SEO best practices, Google Search Central](https://developers.google.com/search/docs/appearance/video)
16. [Use automatic captioning, YouTube Help](https://support.google.com/youtube/answer/6373554?hl=en)
17. [The 50 most-cited websites in Google AI Overviews (September 2026), Ahrefs](https://ahrefs.com/blog/most-cited-domains-ai-overviews/)
