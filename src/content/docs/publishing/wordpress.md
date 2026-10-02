---
title: Publish to WordPress
nav_title: WordPress
description: Publish finished Rankbox articles as WordPress posts today, with a complete plugin file or a scheduled script that uses the WordPress REST API.
order: 5
updated: 2026-10-02
---

WordPress sites publish Rankbox articles through the Rankbox REST API: a small piece of code pulls your finished articles on a schedule, creates or updates WordPress posts, and reports each post's address back to Rankbox. This page gives you that code in two complete forms, so you can copy one and be running in a few minutes.

{{availability:wordpress}}

## How WordPress publishing works today

There is no Rankbox code that runs inside WordPress on its own. Instead you add one of the two integrations below. Both are your own integration code: you install it, you own it, and you can change it. Both follow the same rules as Rankbox's Webflow and Shopify apps:

1. Pull every finished article changed since the last run with `GET /api/public/v1/articles?since=…&limit=100`.
2. Create a post for each new article, with the article's slug, and remember which post belongs to which article.
3. Update the post when the article changes in Rankbox, unless someone edited the post in WordPress since the last sync.
4. Report the post's permalink to Rankbox with `PATCH /api/public/v1/articles/{id}` once the post is published.

Only finished articles are returned, so drafts and scheduled articles never reach WordPress. See [How publishing works](/docs/publishing/overview#what-finished-means).

## Choose an approach

| | Option 1: a plugin file | Option 2: a REST API script |
| --- | --- | --- |
| Runs | Inside WordPress, on WP-Cron, hourly | Anywhere Node.js 18+ runs, on your own schedule |
| WordPress access | None needed, it calls WordPress functions directly | An application password for an Editor or Administrator |
| Best for | Most sites, including managed WordPress hosting that allows plugins | Sites where you can't add plugins, or teams that keep integrations outside WordPress |
| State | Post meta and one option in your WordPress database | A JSON state file next to the script |

Both use the same Rankbox API key. Use one approach per site, not both.

## Create a Rankbox API key

1. In Rankbox, open **Dashboard → Integrations** and click the **WordPress** tile.
2. Click **Connect with the API**.
3. Keep the name "WordPress site" or type your own, and click **Create key**.
4. Click **Copy key** and store the key with your site's secrets. It starts with `rv_live_` and is shown only once.

The key belongs to the Rankbox site that is selected in the dashboard, and it can only read that site's finished articles and report their live URLs. The setup's last step, **See it connect**, turns green the first time your integration calls the API. See [Authentication and API keys](/docs/api/authentication).

## Option 1: a plugin file

This plugin pulls articles every hour with WP-Cron, writes them as posts with WordPress's own functions, and reports permalinks back. It is your own integration code, not a plugin from the WordPress directory.

1. Add your key to `wp-config.php`, above the line that says "That's all, stop editing!":

```php title="wp-config.php"
define( 'RANKBOX_API_KEY', 'rv_live_xxxxxxxxxxxx' );
// Optional. New posts are drafts unless you set 'publish'.
define( 'RANKBOX_POST_STATUS', 'draft' );
// Optional. The WordPress user id that authors new posts, and a category id (0 = default).
define( 'RANKBOX_AUTHOR_ID', 1 );
define( 'RANKBOX_CATEGORY_ID', 0 );
```

2. Create the folder `wp-content/plugins/rankbox-sync/` and save this file in it as `rankbox-sync.php`:

```php title="wp-content/plugins/rankbox-sync/rankbox-sync.php"
<?php
/**
 * Plugin Name: Rankbox Sync (custom)
 * Description: Pulls finished articles from the Rankbox REST API into WordPress posts. Your own integration code.
 * Version: 1.0.0
 * Requires PHP: 7.4
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

if ( ! defined( 'RANKBOX_POST_STATUS' ) ) {
	define( 'RANKBOX_POST_STATUS', 'draft' );
}
if ( ! defined( 'RANKBOX_AUTHOR_ID' ) ) {
	define( 'RANKBOX_AUTHOR_ID', 1 );
}
if ( ! defined( 'RANKBOX_CATEGORY_ID' ) ) {
	define( 'RANKBOX_CATEGORY_ID', 0 );
}

const RANKBOX_API  = 'https://rankbox.xyz/api/public/v1';
const RANKBOX_PAGE = 100;

register_activation_hook( __FILE__, function () {
	if ( ! wp_next_scheduled( 'rankbox_sync' ) ) {
		wp_schedule_event( time() + 60, 'hourly', 'rankbox_sync' );
	}
} );
register_deactivation_hook( __FILE__, function () {
	wp_clear_scheduled_hook( 'rankbox_sync' );
} );
add_action( 'rankbox_sync', 'rankbox_sync_run' );

/** One call to the Rankbox API. Returns the decoded body or a WP_Error. */
function rankbox_request( $method, $path, $body = null ) {
	$args = array(
		'method'  => $method,
		'timeout' => 20,
		'headers' => array(
			'Authorization' => 'Bearer ' . RANKBOX_API_KEY,
			'Accept'        => 'application/json',
		),
	);
	if ( null !== $body ) {
		$args['headers']['Content-Type'] = 'application/json';
		$args['body']                    = wp_json_encode( $body );
	}
	$response = wp_remote_request( RANKBOX_API . $path, $args );
	if ( is_wp_error( $response ) ) {
		return $response;
	}
	$status = (int) wp_remote_retrieve_response_code( $response );
	$data   = json_decode( wp_remote_retrieve_body( $response ), true );
	if ( $status < 200 || $status >= 300 ) {
		$message = is_array( $data ) && isset( $data['error'] ) ? $data['error'] : 'HTTP ' . $status;
		return new WP_Error( 'rankbox_' . $status, $message, array( 'status' => $status ) );
	}
	return is_array( $data ) ? $data : array();
}

/** Pull everything that changed since the last run, then report live URLs. */
function rankbox_sync_run() {
	if ( ! defined( 'RANKBOX_API_KEY' ) || get_transient( 'rankbox_sync_lock' ) ) {
		return;
	}
	set_transient( 'rankbox_sync_lock', 1, 10 * MINUTE_IN_SECONDS );

	try {
		$since = (string) get_option( 'rankbox_next_since', '' );
		for ( $page = 0; $page < 20; $page++ ) {
			$query = array( 'limit' => RANKBOX_PAGE );
			if ( '' !== $since ) {
				$query['since'] = $since;
			}
			$data = rankbox_request( 'GET', '/articles?' . http_build_query( $query ) );
			if ( is_wp_error( $data ) ) {
				error_log( 'Rankbox sync stopped: ' . $data->get_error_message() );
				return;
			}
			foreach ( $data['articles'] as $article ) {
				if ( ! rankbox_upsert_post( $article ) ) {
					return; // The cursor stays put, so this page is fetched again next run.
				}
			}
			$next = isset( $data['next_since'] ) ? (string) $data['next_since'] : '';
			$more = RANKBOX_PAGE === (int) $data['count'] && '' !== $next && $next !== $since;
			if ( '' !== $next ) {
				$since = $next;
				update_option( 'rankbox_next_since', $since, false );
			}
			if ( ! $more ) {
				break;
			}
		}
		rankbox_report_live_urls();
	} finally {
		delete_transient( 'rankbox_sync_lock' );
	}
}

/** The body usually opens with an <h1> that repeats the title, which the theme already shows. */
function rankbox_clean_body( $html ) {
	return preg_replace( '/^\s*<h1[^>]*>.*?<\/h1>\s*/is', '', (string) $html, 1 );
}

/** Create or update the post for one article. Returns false only on a write failure. */
function rankbox_upsert_post( array $article ) {
	$found   = get_posts( array(
		'post_type'        => 'post',
		'post_status'      => array( 'publish', 'future', 'draft', 'pending', 'private', 'trash' ),
		'numberposts'      => 1,
		'fields'           => 'ids',
		'meta_key'         => '_rankbox_id',
		'meta_value'       => $article['id'],
		'suppress_filters' => true,
	) );
	$post_id = $found ? (int) $found[0] : 0;
	$hash    = md5( wp_json_encode( array( $article['title'], $article['description'], $article['body_html'], $article['tags'] ) ) );

	if ( $post_id ) {
		if ( 'trash' === get_post_status( $post_id ) ) {
			return true; // Deleted in WordPress: leave it deleted.
		}
		if ( get_post_meta( $post_id, '_rankbox_hash', true ) === $hash ) {
			return true; // Nothing this plugin writes has changed.
		}
		$written = get_post_meta( $post_id, '_rankbox_written_gmt', true );
		if ( $written && get_post_field( 'post_modified_gmt', $post_id ) !== $written ) {
			return true; // Edited in WordPress since the last sync: never overwrite it.
		}
	}

	$postarr = array(
		'post_type'    => 'post',
		'post_title'   => wp_strip_all_tags( $article['title'] ),
		'post_content' => rankbox_clean_body( $article['body_html'] ),
		'post_excerpt' => $article['description'],
	);
	if ( $post_id ) {
		$postarr['ID'] = $post_id;
		$result        = wp_update_post( wp_slash( $postarr ), true );
	} else {
		$postarr['post_status'] = RANKBOX_POST_STATUS;
		$postarr['post_name']   = $article['slug']; // Set once; never changed by later syncs.
		$postarr['post_author'] = (int) RANKBOX_AUTHOR_ID;
		if ( RANKBOX_CATEGORY_ID ) {
			$postarr['post_category'] = array( (int) RANKBOX_CATEGORY_ID );
		}
		$result = wp_insert_post( wp_slash( $postarr ), true );
	}

	if ( is_wp_error( $result ) || ! $result ) {
		error_log( 'Rankbox: could not save "' . $article['title'] . '": ' . ( is_wp_error( $result ) ? $result->get_error_message() : 'unknown error' ) );
		return false;
	}

	wp_set_post_tags( $result, $article['tags'], false );
	update_post_meta( $result, '_rankbox_id', $article['id'] );
	update_post_meta( $result, '_rankbox_hash', $hash );
	clean_post_cache( $result );
	update_post_meta( $result, '_rankbox_written_gmt', get_post_field( 'post_modified_gmt', $result ) );
	return true;
}

/** Tell Rankbox where published posts live. Up to 50 per run. */
function rankbox_report_live_urls() {
	$posts = get_posts( array(
		'post_type'        => 'post',
		'post_status'      => 'publish',
		'numberposts'      => 50,
		'fields'           => 'ids',
		'meta_query'       => array(
			array( 'key' => '_rankbox_id', 'compare' => 'EXISTS' ),
			array( 'key' => '_rankbox_reported', 'compare' => 'NOT EXISTS' ),
		),
		'suppress_filters' => true,
	) );

	foreach ( $posts as $post_id ) {
		$url    = get_permalink( $post_id );
		$result = rankbox_request(
			'PATCH',
			'/articles/' . rawurlencode( get_post_meta( $post_id, '_rankbox_id', true ) ),
			array( 'published_url' => $url )
		);
		if ( is_wp_error( $result ) ) {
			$data   = $result->get_error_data();
			$status = is_array( $data ) && isset( $data['status'] ) ? (int) $data['status'] : 0;
			if ( 404 === $status ) {
				update_post_meta( $post_id, '_rankbox_reported', 'gone' ); // Deleted in Rankbox.
				continue;
			}
			// A 400 (URL not on your Rankbox site's domain), 402 or network error affects every post alike.
			error_log( 'Rankbox: live URL not reported: ' . $result->get_error_message() );
			return;
		}
		update_post_meta( $post_id, '_rankbox_reported', $url );
	}
}
```

3. In WordPress, open **Plugins**, find **Rankbox Sync (custom)** and click **Activate**. Activation schedules the first run about a minute later, then hourly.

WP-Cron runs when your site gets traffic. On a quiet site, or if your host disables WP-Cron, trigger it from a real scheduler, for example a server cron job that runs `wp cron event run rankbox_sync` with WP-CLI.

To start over from the beginning of your article list, delete the `rankbox_next_since` option. Existing posts are matched by their `_rankbox_id` meta, so nothing is duplicated.

## Option 2: a script that uses the WordPress REST API

This script runs outside WordPress. It reads articles from Rankbox and writes posts through the WordPress REST API, signing in with an application password. It is your own integration code; run it with Node.js 18 or later.

### Create an application password

1. In WordPress, sign in as the user the script should act as. Use an Editor or Administrator: the script creates tags, which Authors can't.
2. Open **Users → Profile** and scroll to **Application Passwords**.
3. Type a name such as "Rankbox sync" and click **Add New Application Password**.
4. Copy the password WordPress shows. It is shown once.

Application passwords need a site served over HTTPS.

### Configure and run the script

Save your settings in a `.env` file next to the script, and never commit it:

```bash title=".env"
RANKBOX_API_KEY=rv_live_xxxxxxxxxxxx
WP_URL=https://example.com
WP_USER=editor-username
WP_APP_PASSWORD="abcd efgh ijkl mnop qrst uvwx"
# Optional: "publish" puts new posts live; the default is "draft".
WP_STATUS=draft
# Optional: a category id for new posts.
WP_CATEGORY_ID=
STATE_FILE=./rankbox-state.json
```

Then save the script:

```js title="rankbox-to-wordpress.mjs"
// Your own integration code: pulls finished articles from Rankbox and creates
// or updates WordPress posts through the WordPress REST API. Node.js 18+.
import { createHash } from "node:crypto";
import { readFile, writeFile } from "node:fs/promises";

const RANKBOX = "https://rankbox.xyz/api/public/v1";
const PAGE = 100;
const {
  RANKBOX_API_KEY,
  WP_URL,
  WP_USER,
  WP_APP_PASSWORD,
  WP_STATUS = "draft",
  WP_CATEGORY_ID = "",
  STATE_FILE = "./rankbox-state.json",
} = process.env;

if (!RANKBOX_API_KEY || !WP_URL || !WP_USER || !WP_APP_PASSWORD) {
  throw new Error("Set RANKBOX_API_KEY, WP_URL, WP_USER and WP_APP_PASSWORD.");
}

const wpBase = `${WP_URL.replace(/\/+$/, "")}/wp-json/wp/v2`;
const wpAuth = "Basic " + Buffer.from(`${WP_USER}:${WP_APP_PASSWORD}`).toString("base64");

async function call(url, { method = "GET", headers = {}, body } = {}) {
  const res = await fetch(url, {
    method,
    headers: {
      Accept: "application/json",
      ...(body ? { "Content-Type": "application/json" } : {}),
      ...headers,
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err = new Error(`${method} ${url} -> ${res.status}: ${data.error ?? data.message ?? res.statusText}`);
    err.status = res.status;
    err.code = data.code;
    err.data = data.data;
    throw err;
  }
  return data;
}

const rankbox = (path, init = {}) =>
  call(`${RANKBOX}${path}`, { ...init, headers: { Authorization: `Bearer ${RANKBOX_API_KEY}` } });
const wp = (path, init = {}) =>
  call(`${wpBase}${path}`, { ...init, headers: { Authorization: wpAuth } });

async function loadState() {
  try {
    return JSON.parse(await readFile(STATE_FILE, "utf8"));
  } catch (err) {
    if (err.code === "ENOENT") return { next_since: null, posts: {} };
    throw err; // A damaged state file must stop the run, or posts would be duplicated.
  }
}
const saveState = (state) => writeFile(STATE_FILE, JSON.stringify(state, null, 2));

// The body usually opens with an <h1> that repeats the title, which the theme already shows.
const cleanBody = (html) => html.replace(/^\s*<h1[^>]*>[\s\S]*?<\/h1>\s*/i, "");

const fingerprint = (a) =>
  createHash("sha256")
    .update(JSON.stringify([a.title, a.description, a.body_html, a.tags]))
    .digest("hex");

const tagIds = new Map();
async function tagId(name) {
  const key = name.toLowerCase();
  if (!tagIds.has(key)) {
    let id;
    try {
      id = (await wp("/tags", { method: "POST", body: { name } })).id;
    } catch (err) {
      if (err.code !== "term_exists") throw err;
      id = err.data.term_id; // WordPress returns the id of the tag that already exists.
    }
    tagIds.set(key, id);
  }
  return tagIds.get(key);
}

async function upsert(article, state) {
  const known = state.posts[article.id];
  const hash = fingerprint(article);
  if (known && (known.hash === hash || known.left)) return;

  const tags = [];
  for (const name of article.tags) tags.push(await tagId(name));
  const fields = {
    title: article.title,
    content: cleanBody(article.body_html),
    excerpt: article.description,
    tags,
  };

  if (!known) {
    const post = await wp("/posts", {
      method: "POST",
      body: {
        ...fields,
        slug: article.slug, // Set once; later syncs never change it.
        status: WP_STATUS,
        ...(WP_CATEGORY_ID ? { categories: [Number(WP_CATEGORY_ID)] } : {}),
      },
    });
    state.posts[article.id] = { id: post.id, modified: post.modified_gmt, hash, reported: null };
    return;
  }

  let current;
  try {
    current = await wp(`/posts/${known.id}?context=edit`);
  } catch (err) {
    if (err.status !== 404) throw err;
    known.left = "deleted in WordPress"; // Never re-create it.
    return;
  }
  if (current.status === "trash" || current.modified_gmt !== known.modified) {
    known.left = "edited in WordPress"; // Never overwrite it.
    return;
  }
  const post = await wp(`/posts/${known.id}`, { method: "POST", body: fields });
  Object.assign(known, { modified: post.modified_gmt, hash });
}

async function reportLiveUrls(state) {
  for (const [articleId, known] of Object.entries(state.posts)) {
    if (known.reported || known.left) continue;
    let post;
    try {
      post = await wp(`/posts/${known.id}?context=edit`);
    } catch (err) {
      if (err.status === 404) continue;
      throw err;
    }
    if (post.status !== "publish") continue;
    try {
      await rankbox(`/articles/${encodeURIComponent(articleId)}`, {
        method: "PATCH",
        body: { published_url: post.link },
      });
      known.reported = post.link;
    } catch (err) {
      if (err.status === 404) {
        known.reported = "gone"; // Deleted in Rankbox.
        continue;
      }
      // A 400 means the URL isn't on your Rankbox site's domain: fix Website in Settings.
      console.error(err.message);
      return;
    }
  }
}

const state = await loadState();
let since = state.next_since;
for (let page = 0; page < 50; page++) {
  const query = new URLSearchParams({ limit: String(PAGE) });
  if (since) query.set("since", since);
  const { articles, count, next_since } = await rankbox(`/articles?${query}`);
  for (const article of articles) {
    await upsert(article, state);
    await saveState(state); // Record each post at once, so a crash never duplicates it.
  }
  const more = count === PAGE && next_since && next_since !== since;
  if (next_since) since = state.next_since = next_since;
  await saveState(state);
  if (!more) break;
}
await reportLiveUrls(state);
await saveState(state);
console.log(`Rankbox sync done. ${Object.keys(state.posts).length} posts tracked.`);
```

Run it once by hand to check it, then schedule it. With Node.js 20.6 or later, `--env-file` loads the `.env` file:

```bash title="Run once, then every hour with cron"
node --env-file=.env rankbox-to-wordpress.mjs

# crontab -e
0 * * * * cd /opt/rankbox-sync && node --env-file=.env rankbox-to-wordpress.mjs >> sync.log 2>&1
```

Keep `rankbox-state.json` between runs: it holds the sync cursor and which post belongs to which article. If you run the script somewhere that starts from a clean disk each time, such as a CI job, store the state file somewhere that persists, or the script will create every post again.

## How the examples map fields

| Rankbox field | WordPress | When |
| --- | --- | --- |
| `title` | Post title | Create and every update |
| `slug` | Post slug, which forms the permalink | Create only |
| `body_html` | Post content, with the opening `<h1>` removed | Create and every update |
| `description` | Excerpt | Create and every update |
| `tags` | Post tags, created if they don't exist | Create and every update |
| Your status setting | Post status (`draft` or `publish`) | Create only |
| Your author and category settings | Author, category | Create only |
| `id` | `_rankbox_id` post meta (plugin) or the state file (script) | Create |

The body is HTML with headings, lists, links and tables. Some articles also contain a YouTube `<iframe>` followed by a plain link to the video. WordPress keeps the iframe only when the post is saved by a user allowed to post unfiltered HTML (Administrators and Editors on a single site). The plugin file runs on WP-Cron as no user, so WordPress removes the iframe and the plain link stays.

Rankbox doesn't send images. Add a featured image in WordPress if your theme uses one. If you use an SEO plugin, you can extend either example to copy `description` into that plugin's meta description field as well.

## Edits, deletions and slugs

Both examples apply the same rules as Rankbox's own apps:

- **The first slug is kept.** Rankbox's API slug follows the article's current title, but the post keeps the slug it was created with, so its URL never breaks.
- **Unchanged articles aren't rewritten.** Each example stores a fingerprint of what it wrote and skips articles whose title, description, body and tags are unchanged. This matters because an article also comes back from the API after the live URL is reported, since reporting updates the article.
- **Posts edited in WordPress are left alone.** If a post's modified time no longer matches the one recorded after the last sync, the examples stop updating it. Publishing a draft in WordPress counts as an edit, so make Rankbox edits before you publish if you review drafts by hand.
- **Posts deleted in WordPress aren't re-created.** Both skip posts in the trash. The script also remembers posts deleted permanently; the plugin file creates a permanently deleted post again only if the article changes in Rankbox later.
- **Articles deleted in Rankbox stay in WordPress.** The API has no deletion signal. Delete the post in WordPress yourself.

## Report live URLs

Both examples report a post's permalink once it is published, which is what the backlink exchange verifies hosted links on. Drafts are reported on the first run after you publish them.

Rankbox only accepts a URL on your own domain: the **Website** in **Dashboard → Settings**, or the domain you verified for the backlink exchange. Subdomains count and `www.` is ignored. If WordPress serves posts from another domain, every report fails with a `400` and the examples stop reporting and log the message. See [Live URLs and verification](/docs/publishing/live-urls).

## Troubleshooting

| What you see | Cause | Fix |
| --- | --- | --- |
| `401` from Rankbox: "Invalid or missing API key" | The key is wrong, missing or revoked. | Create a new key and update `wp-config.php` or `.env`. |
| `402` from Rankbox with `subscription_required` | The site's trial or plan isn't active, or the site was removed from Studio. | Check **Dashboard → Plan & Billing**. The cursor is kept, so the next run catches up. |
| `400` on `PATCH`: "published_url must be on your own site" | WordPress serves posts on a different domain from your Rankbox site. | Update **Website** in **Dashboard → Settings**, or serve WordPress from that domain. |
| `429` from Rankbox | More than 120 requests a minute for your account. | Run less often. The limit resets each minute. |
| `401` from WordPress (`rest_not_logged_in`) | The application password is wrong, or your host strips the `Authorization` header. | Check the password and username. Ask your host to pass the `Authorization` header to PHP. |
| `403` from WordPress when creating tags | The user is an Author. | Use an Editor or Administrator account. |
| No posts appear with the plugin file | WP-Cron hasn't run, or the key constant is missing. | Visit the site to trigger WP-Cron, or run `wp cron event run rankbox_sync`. Check the PHP error log. |
| A post stopped updating | It was edited or published in WordPress after the last sync. | Make the change in WordPress. To let syncs update it again, delete the post's `_rankbox_written_gmt` meta (plugin), or in the state file remove the post's `left` value and set its `modified` to the post's current `modified_gmt` (script). |

## Related

- [Publish to any website with the REST API](/docs/publishing/custom-sites): the same API with recipes for other stacks, and how to render the body safely.
- [Syncing articles reliably](/docs/api/syncing): the `since` cursor and idempotent writes in depth.
- [Live URLs and verification](/docs/publishing/live-urls): what happens after you report a permalink.
- [Authentication and API keys](/docs/api/authentication): replacing or revoking the key.
- [Errors](/docs/api/errors): every status code the API returns.
