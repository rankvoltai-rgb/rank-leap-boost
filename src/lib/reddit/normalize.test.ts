import { describe, expect, it } from "vitest";
import {
  groupScrape,
  redditIdsCitedIn,
  redditResultsOf,
  toRedditComment,
  toRedditPost,
} from "./normalize";

/** trudax/reddit-scraper-lite's shape. */
const TRUDAX = {
  id: "t3_1kq3m8a",
  parsedId: "1kq3m8a",
  url: "https://www.reddit.com/r/startups/comments/1kq3m8a/whats_the_best_project_tool/",
  username: "tiny_team_tom",
  title: "What's the best project tool for a 4-person startup?",
  communityName: "r/startups",
  parsedCommunityName: "startups",
  body: "We've outgrown a shared spreadsheet.",
  numberOfComments: 37,
  upVotes: 124,
  createdAt: "2026-09-17T05:23:15.000Z",
  dataType: "post",
};

/** A Reddit-JSON-flavoured actor: different names for everything. */
const RAW_API = {
  name: "t3_1jx9t2c",
  permalink: "/r/ProjectManagement/comments/1jx9t2c/trello_vs_asana/",
  author: "bounce_between",
  title: "Trello vs Asana for a small product team?",
  subreddit: "ProjectManagement",
  selftext: "Six people, two engineers.",
  num_comments: "52",
  score: 89,
  created_utc: 1789000000,
  locked: true,
  archived: false,
};

describe("toRedditPost", () => {
  it("reads the trudax shape", () => {
    expect(toRedditPost(TRUDAX)).toMatchObject({
      redditId: "1kq3m8a",
      subreddit: "startups",
      permalink: "https://www.reddit.com/r/startups/comments/1kq3m8a/",
      author: "tiny_team_tom",
      upVotes: 124,
      numComments: 37,
      postedAt: "2026-09-17T05:23:15.000Z",
      isLocked: false,
      isRemoved: false,
    });
  });

  it("reads a differently-named shape to the same result", () => {
    const p = toRedditPost({ ...RAW_API, permalink: `https://www.reddit.com${RAW_API.permalink}` });
    expect(p).toMatchObject({
      redditId: "1jx9t2c",
      subreddit: "projectmanagement",
      author: "bounce_between",
      upVotes: 89,
      numComments: 52,
      isLocked: true,
      isArchived: false,
      body: "Six people, two engineers.",
    });
    // created_utc is in seconds.
    expect(p?.postedAt).toBe(new Date(1789000000 * 1000).toISOString());
  });

  it("falls back to ids and names when there is no usable URL", () => {
    const p = toRedditPost({ ...RAW_API, permalink: undefined });
    expect(p?.redditId).toBe("1jx9t2c");
    expect(p?.subreddit).toBe("projectmanagement");
  });

  it("leaves archived UNKNOWN when the actor did not say — never false", () => {
    expect(toRedditPost(TRUDAX)?.isArchived).toBeNull();
    expect(toRedditPost({ ...TRUDAX, archived: true })?.isArchived).toBe(true);
    expect(toRedditPost({ ...TRUDAX, archived: false })?.isArchived).toBe(false);
  });

  it("recognises a removed post however it is signalled", () => {
    expect(toRedditPost({ ...TRUDAX, body: "[removed]" })?.isRemoved).toBe(true);
    expect(toRedditPost({ ...TRUDAX, body: "[removed]" })?.body).toBe("");
    expect(toRedditPost({ ...TRUDAX, title: "[deleted by user]" })?.isRemoved).toBe(true);
    expect(toRedditPost({ ...TRUDAX, removed_by_category: "moderator" })?.isRemoved).toBe(true);
  });

  it("survives missing and malformed fields", () => {
    const p = toRedditPost({
      url: TRUDAX.url,
      dataType: "post",
      upVotes: "1,204",
      numberOfComments: null,
    });
    expect(p).toMatchObject({
      title: "",
      body: "",
      author: "",
      upVotes: 1204,
      numComments: 0,
      postedAt: null,
    });
    expect(toRedditPost({ ...TRUDAX, upVotes: -5 })?.upVotes).toBe(0);
    expect(toRedditPost({ ...TRUDAX, createdAt: "not a date" })?.postedAt).toBeNull();
  });

  it("rejects what is not a usable post", () => {
    for (const bad of [
      null,
      "string",
      [],
      {},
      { ...TRUDAX, dataType: "comment" },
      { ...TRUDAX, dataType: "community" },
      { dataType: "post", title: "no id, no url" },
      { dataType: "post", url: "https://reddit.com.evil.tld/r/x/comments/1abc23/y/" },
      { dataType: "post", id: "../../etc", communityName: "r/x" },
    ])
      expect(toRedditPost(bad), JSON.stringify(bad)).toBeNull();
  });
});

describe("comments", () => {
  const COMMENT = {
    id: "t1_kx9y8z7",
    url: "https://www.reddit.com/r/startups/comments/1kq3m8a/slug/kx9y8z7/",
    username: "ops_nina",
    body: "Honestly Trello until it hurts. Then reassess.",
    upVotes: 41,
    dataType: "comment",
  };

  it("reads a comment and ties it to its post", () => {
    expect(toRedditComment(COMMENT)).toMatchObject({
      commentId: "kx9y8z7",
      postId: "1kq3m8a",
      author: "ops_nina",
      score: 41,
      isRemoved: false,
    });
  });

  it("recognises removed and deleted comments", () => {
    expect(toRedditComment({ ...COMMENT, body: "[removed]" })?.isRemoved).toBe(true);
    expect(toRedditComment({ ...COMMENT, username: "[deleted]" })?.isRemoved).toBe(true);
  });

  it("attaches a run's loose comments to their post, best first, dropping the removed", () => {
    const posts = groupScrape([
      COMMENT,
      TRUDAX,
      {
        ...COMMENT,
        id: "t1_aaa1111",
        url: COMMENT.url.replace("kx9y8z7", "aaa1111"),
        upVotes: 90,
        body: "Linear if you're mostly engineers.",
      },
      {
        ...COMMENT,
        id: "t1_bbb2222",
        url: COMMENT.url.replace("kx9y8z7", "bbb2222"),
        body: "[removed]",
      },
      TRUDAX,
    ]);
    expect(posts).toHaveLength(1);
    expect(posts[0].topComments.map((c) => c.score)).toEqual([90, 41]);
  });
});

describe("redditResultsOf", () => {
  const ORGANIC = [
    { position: 1, url: "https://www.asana.com/compare", title: "Asana vs Trello" },
    {
      position: 2,
      url: "https://www.reddit.com/r/projectmanagement/",
      title: "r/projectmanagement",
    },
    {
      position: 3,
      url: "https://www.reddit.com/r/startups/comments/1kq3m8a/whats_the_best/",
      title: "What's the best project tool? : r/startups",
    },
    { position: 4, url: "https://www.reddit.com/user/someone/", title: "someone" },
    {
      position: 6,
      url: "https://old.reddit.com/r/SaaS/comments/1m2p7vd/alternatives/?utm=1",
      title: "Alternatives to ClickUp - Reddit",
    },
    { position: 7, url: "https://reddit.com.evil.tld/r/x/comments/1bad000/y/", title: "fake" },
    {
      position: 9,
      url: "https://www.reddit.com/r/startups/comments/1kq3m8a/whats_the_best/kx9y8z7/",
      title: "a comment deep link",
    },
  ];

  it("keeps threads only, with their measured positions", () => {
    expect(redditResultsOf(ORGANIC)).toEqual([
      {
        redditId: "1kq3m8a",
        subreddit: "startups",
        permalink: "https://www.reddit.com/r/startups/comments/1kq3m8a/",
        title: "What's the best project tool?",
        position: 3,
      },
      {
        redditId: "1m2p7vd",
        subreddit: "saas",
        permalink: "https://www.reddit.com/r/saas/comments/1m2p7vd/",
        title: "Alternatives to ClickUp",
        position: 6,
      },
    ]);
  });

  it("keeps the better position when a thread appears twice", () => {
    const hit = redditResultsOf(ORGANIC).find((h) => h.redditId === "1kq3m8a");
    expect(hit?.position).toBe(3);
  });

  it("falls back to order when positions are missing, and ignores junk", () => {
    expect(
      redditResultsOf([{ url: "https://x.example" }, { url: ORGANIC[2].url }])[0].position,
    ).toBe(2);
    expect(redditResultsOf(null)).toEqual([]);
    expect(redditResultsOf("nope")).toEqual([]);
    expect(redditResultsOf([null, 3, "x"])).toEqual([]);
  });
});

describe("redditIdsCitedIn", () => {
  it("finds cited threads anywhere in an answer, in text or in sources", () => {
    const ids = redditIdsCitedIn({
      answer:
        "Founders often recommend simple tools (see https://www.reddit.com/r/startups/comments/1kq3m8a/x/).",
      sources: [
        { url: "https://www.asana.com" },
        { url: "https://old.reddit.com/r/SaaS/comments/1m2p7vd/alternatives/kx9y8z7/" },
      ],
    });
    expect([...ids].sort()).toEqual(["1kq3m8a", "1m2p7vd"]);
  });

  it("is not fooled by lookalike hosts, and returns nothing for nothing", () => {
    expect(redditIdsCitedIn("https://reddit.com.evil.tld/r/x/comments/1bad000/y/").size).toBe(0);
    expect(redditIdsCitedIn(null).size).toBe(0);
    expect(redditIdsCitedIn({ answer: "no links here" }).size).toBe(0);
  });
});

describe("aiResultsOf", () => {
  const ITEM = {
    searchQuery: { term: "project management tool", page: 1 },
    organicResults: [{ position: 1, url: "https://x.example", title: "X" }],
    perplexityResult: {
      engine: "Perplexity",
      text: "Founders often recommend simple tools.",
      sources: [{ url: "https://www.reddit.com/r/startups/comments/1kq3m8a/x/" }],
    },
    chatGptSearchResult: { provider: "OpenAI", text: "Several tools fit.", sources: [] },
    aiModeResult: { text: "An overview.", sources: [{ url: "https://asana.com" }] },
    relatedQueries: [{ title: "kanban" }],
  };

  it("finds answers by shape and names their engine, whatever the key is called", async () => {
    const { aiResultsOf, redditIdsCitedIn: cited } = await import("./normalize");
    const results = aiResultsOf(ITEM);
    expect(results.map((r) => r.engine).sort()).toEqual([
      "chatgpt",
      "google_ai_overview",
      "perplexity",
    ]);
    const perplexity = results.find((r) => r.engine === "perplexity")!;
    expect([...cited(perplexity.payload)]).toEqual(["1kq3m8a"]);
    const chatgpt = results.find((r) => r.engine === "chatgpt")!;
    // Asked, answered, and did not cite us: a real negative result.
    expect(cited(chatgpt.payload).size).toBe(0);
  });

  it("does not mistake ordinary SERP fields for answers, or guess an unnamed engine", async () => {
    const { aiResultsOf } = await import("./normalize");
    expect(aiResultsOf({ searchQuery: { term: "x" }, organicResults: [] })).toEqual([]);
    expect(aiResultsOf({ mystery: { text: "An answer from who knows where." } })).toEqual([]);
    expect(aiResultsOf(null)).toEqual([]);
  });
});

describe("serp helpers", () => {
  it("reads the query and page", async () => {
    const { serpQueryOf } = await import("./normalize");
    expect(serpQueryOf({ searchQuery: { term: " kanban ", page: 2 } })).toEqual({
      term: "kanban",
      page: 2,
    });
    expect(serpQueryOf({})).toEqual({ term: "", page: 1 });
  });

  it("makes a per-page position absolute, and leaves an absolute one alone", async () => {
    const { absolutePosition } = await import("./normalize");
    expect(absolutePosition(3, 1)).toBe(3);
    expect(absolutePosition(3, 2)).toBe(13);
    expect(absolutePosition(13, 2)).toBe(13);
    expect(absolutePosition(10, 3)).toBe(30);
  });
});

describe("toSubredditInfo", () => {
  it("reads rules given as strings or as objects", async () => {
    const { toSubredditInfo } = await import("./normalize");
    const info = toSubredditInfo(
      [
        { dataType: "post", title: "noise" },
        {
          dataType: "community",
          communityName: "r/SaaS",
          title: "SaaS",
          description: "Software as a service",
          numberOfMembers: "298,000",
          rules: ["Be helpful.", { short_name: "No spam", description: "Follow the 9:1 rule." }],
        },
      ],
      "saas",
    );
    expect(info).toMatchObject({ name: "saas", subscribers: 298000, rulesFound: true });
    expect(info?.rules).toEqual(["Be helpful.", "No spam — Follow the 9:1 rule."]);
  });

  it("says so when a community comes back with no rules — that is not 'no rules'", async () => {
    const { toSubredditInfo } = await import("./normalize");
    const info = toSubredditInfo(
      [{ dataType: "community", communityName: "r/agile", title: "Agile" }],
      "agile",
    );
    expect(info?.rulesFound).toBe(false);
    expect(info?.rules).toEqual([]);
    expect(info?.subscribers).toBeNull();
  });

  it("ignores a different subreddit's item, and returns null for nothing", async () => {
    const { toSubredditInfo } = await import("./normalize");
    expect(
      toSubredditInfo([{ dataType: "community", communityName: "r/other", rules: ["x"] }], "saas"),
    ).toBeNull();
    expect(toSubredditInfo([], "saas")).toBeNull();
  });
});

describe("bestKeywordFor", () => {
  it("attributes a thread to the keyword its title answers", async () => {
    const { bestKeywordFor } = await import("./normalize");
    const kws = ["project management tool", "clickup alternatives", "sprint planning tool"];
    expect(bestKeywordFor("Alternatives to ClickUp that aren't overwhelming?", kws)).toBe(
      "clickup alternatives",
    );
    expect(bestKeywordFor("Sprint planning for a tiny team", kws)).toBe("sprint planning tool");
    expect(bestKeywordFor("Completely unrelated", kws)).toBe("project management tool");
    expect(bestKeywordFor("anything", [])).toBe("");
  });
});
