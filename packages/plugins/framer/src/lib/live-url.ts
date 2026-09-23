/**
 * Composing the public URL of an article page on the published Framer site.
 *
 * The site's collection page path is something only the user knows, so they
 * supply it once. The marketing page's own mockup shows it as `/blog/:slug`,
 * so that exact string is accepted and understood to mean `/blog`.
 */

export const DEFAULT_BLOG_PATH = "/blog";

export function normalizeBlogPath(raw: string | null | undefined): string {
  let path = (raw ?? "").trim();
  if (!path) return DEFAULT_BLOG_PATH;

  // Accept a full URL and keep only its path.
  if (/^https?:\/\//i.test(path)) {
    try {
      path = new URL(path).pathname;
    } catch {
      // Fall through and treat it as a path.
    }
  }

  if (!path.startsWith("/")) path = `/${path}`;
  // Drop a trailing route parameter: "/blog/:slug" means "/blog".
  path = path.replace(/\/:[A-Za-z_][\w-]*\/?$/, "");
  path = path.replace(/\/+$/, "");
  path = path.replace(/\/{2,}/g, "/");
  return path || DEFAULT_BLOG_PATH;
}

/**
 * Compose `{origin}{path}/{slug}`, preserving any base path already present in
 * the production URL and collapsing duplicate slashes.
 */
export function composeLiveUrl(
  productionUrl: string,
  blogPath: string,
  slug: string,
): string | null {
  if (!productionUrl || !slug) return null;
  let base: URL;
  try {
    base = new URL(productionUrl);
  } catch {
    return null;
  }
  const path = normalizeBlogPath(blogPath);
  const cleanSlug = slug.replace(/^\/+|\/+$/g, "");
  const basePath = base.pathname.replace(/\/+$/, "");
  const joined = `${basePath}${path}/${cleanSlug}`.replace(/\/{2,}/g, "/");
  return `${base.origin}${joined}`;
}

/** Compare two hosts the way the API's own domain check does: ignore `www.`. */
export function sameSite(a: string | null | undefined, b: string | null | undefined): boolean {
  const host = (value: string | null | undefined): string => {
    if (!value) return "";
    const raw = /^https?:\/\//i.test(value) ? value : `https://${value}`;
    try {
      return new URL(raw).hostname.replace(/^www\./i, "").toLowerCase();
    } catch {
      return "";
    }
  };
  const left = host(a);
  const right = host(b);
  if (!left || !right) return false;
  // The API accepts subdomains of the registered site domain.
  return left === right || left.endsWith(`.${right}`) || right.endsWith(`.${left}`);
}
