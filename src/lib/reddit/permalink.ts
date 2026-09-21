/**
 * Parsing the link a member pastes back after posting. Pure.
 *
 * This is user input claiming an outcome — "I posted this, here" — so it is
 * treated as hostile until shown otherwise: the host must really be Reddit,
 * and the post id must be the thread the opportunity was for. Whether the
 * comment is actually there is a separate question, answered by verification.
 */

export interface ParsedPermalink {
  /** Lowercase, no "r/". Null for the sub-less `/comments/<id>` form. */
  subreddit: string | null;
  postId: string;
  /** Null when the link points at the post rather than a comment on it. */
  commentId: string | null;
  /** A clean www.reddit.com URL with tracking stripped — what we store. */
  canonical: string;
}

const REDDIT_ID = /^[a-z0-9]{2,12}$/i;

/** True for reddit.com and its subdomains, and for nothing that merely contains it. */
export function isRedditHost(hostname: string): boolean {
  const host = hostname.toLowerCase().replace(/\.$/, "");
  return host === "reddit.com" || host.endsWith(".reddit.com");
}

export function parsePermalink(raw: string | null | undefined): ParsedPermalink | null {
  const text = (raw ?? "").trim();
  if (!text) return null;

  let url: URL;
  try {
    url = new URL(/^https?:\/\//i.test(text) ? text : `https://${text}`);
  } catch {
    return null;
  }
  if (url.protocol !== "https:" && url.protocol !== "http:") return null;
  // A URL with credentials in it is never something Reddit's share menu made.
  if (url.username || url.password) return null;
  if (!isRedditHost(url.hostname)) return null;

  const parts = url.pathname.split("/").filter(Boolean);
  let subreddit: string | null = null;
  let i = 0;
  if (parts[i]?.toLowerCase() === "r" && parts[i + 1]) {
    subreddit = parts[i + 1].toLowerCase();
    i += 2;
  }
  if (parts[i]?.toLowerCase() !== "comments") return null;
  const postId = parts[i + 1]?.toLowerCase();
  if (!postId || !REDDIT_ID.test(postId)) return null;

  // Two comment shapes are in the wild:
  //   /comments/<post>/<slug>/<comment>/
  //   /comments/<post>/comment/<comment>/
  const rest = parts.slice(i + 2);
  let commentId: string | null = null;
  if (rest[0]?.toLowerCase() === "comment" && rest[1]) commentId = rest[1].toLowerCase();
  else if (rest.length >= 2) commentId = rest[1].toLowerCase();
  if (commentId !== null && !REDDIT_ID.test(commentId)) return null;

  const base = subreddit ? `/r/${subreddit}/comments/${postId}` : `/comments/${postId}`;
  const canonical = `https://www.reddit.com${base}/${commentId ? `comment/${commentId}/` : ""}`;
  return { subreddit, postId, commentId, canonical };
}

/**
 * Why a pasted link can't be used, in words the member can act on — or null if
 * it is fine. `expectedPostId` is the thread the opportunity was for.
 */
export function permalinkProblem(
  raw: string | null | undefined,
  expectedPostId: string,
): string | null {
  const text = (raw ?? "").trim();
  if (!text) return "Paste the link to your comment.";

  // Reddit's mobile share sheet produces opaque /s/ links that name neither
  // the post nor the comment. We can't check them without following them.
  if (/reddit\.com\/r\/[^/]+\/s\//i.test(text) || /^https?:\/\/redd\.it\//i.test(text))
    return "That's a share link, which doesn't say which comment it points to. Open it in a browser and copy the address from the address bar instead.";

  const parsed = parsePermalink(text);
  if (!parsed) return "That doesn't look like a link to a Reddit comment.";
  if (parsed.postId !== expectedPostId.toLowerCase())
    return "That link is to a different thread than this one.";
  if (!parsed.commentId)
    return "That's a link to the thread, not to your comment. On your comment, use ⋯ → Copy link.";
  return null;
}
