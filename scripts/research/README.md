# Research scripts

The data behind three Rankbox posts, first run on 28 September 2026:

- `/blog/state-of-llms-txt-adoption` (B4) and `/blog/ai-bot-crawler-census` (B2): one crawl of `/robots.txt`, `/llms.txt` and `/llms-full.txt` across about 21,000 sites.
- `/blog/vector-distance-vs-keyword-density` (A8): 263 test paragraphs scored by 8 open embedding models, a reranker and BM25, all run locally.

The census promises a quarterly re-run. Re-running these steps in order reproduces it. Nothing here is part of the site build. Outputs are git-ignored; the numbers that matter end up in the posts and in `src/data/study-charts.ts`.

```sh
cd scripts/research
npm install
```

## Crawl (B4, B2)

1. Download the inputs. Note the Tranco list ID for the methodology section: it's in the URL `https://tranco-list.eu/latest_list` redirects to.
   ```sh
   curl -sL -o tranco.zip https://tranco-list.eu/top-1m.csv.zip && unzip -o tranco.zip
   curl -sL -A "Mozilla/5.0" -o f500-2026.json https://fortune.com/api/getRankingSearchYear/fortune500/2026/
   curl -sL -o yc.json https://yc-oss.github.io/api/companies/all.json
   ```
   Change the year in the Fortune URL (and in `f500.mjs`) for a new list.
2. `node f500.mjs`: fetches each Fortune 500 company's website from its Fortune profile page (4 at a time).
3. `node wd.mjs` then `node wd3.mjs`: Wikidata lists (news, e-commerce, then software/SaaS one class at a time, since the combined query times out).
4. `node build-domains.mjs`: merges everything into `domains.json`, with the platform filter and the hand-checked exclusions for the news and e-commerce top 500s. Re-check the top of both lists by eye each quarter.
5. `C=120 node crawl.mjs`: the crawl. Resumable; it appends to `crawl.jsonl` and skips hosts already there. About 45 minutes for 21,000 sites.
6. `node --max-old-space-size=6144 analyze-crawl.mjs`: classifies every file and writes `hosts.json` and `crawl-summary.json`.
7. `node --max-old-space-size=6144 linkcheck.mjs`: checks 3 random links in 1,000 random llms.txt files (seeded).
8. `node gen-sheets.mjs`: writes `data/B4.md` and `data/B2.md`, the data sheets the posts are written from.

The crawler identifies itself as `RankboxResearchBot/1.0` and only ever requests those three paths, one request at a time per site.

## Embedding experiment (A8)

```sh
cd a8
DTYPE=q8 node run.mjs              # 8 embedding models, bge-reranker-base, BM25 (models download once, ~1.5 GB)
DTYPE=fp32 ONLY="Xenova/all-MiniLM-L6-v2,Xenova/bge-small-en-v1.5" node run.mjs   # precision check
node analyze.mjs && DTYPE=fp32 node analyze.mjs
node pca.mjs llms-txt              # coordinates for the embedding-map chart
node sheet.mjs                     # writes ../data/A8.md
```

`corpus.mjs` holds the test set: 8 topics, 4 prompts each, and the filler and definition sentences the paragraphs are built from.
