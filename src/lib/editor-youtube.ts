/**
 * Keeps a generated article's YouTube embed intact inside the editor.
 *
 * Without this the editor would drop the <iframe> the writer puts in the body:
 * TipTap discards tags it has no node for, so the first edit-and-save would
 * silently delete the video. This teaches it the one iframe shape we emit, and
 * turndown-side (editor-markdown.ts) writes it back out unchanged.
 *
 * @tiptap/extension-youtube would also do this, but it won't install against
 * the TipTap versions here without forcing peer resolution.
 */
import { Node, mergeAttributes } from "@tiptap/core";

const EMBED_HOST = /^https:\/\/(?:www\.)?(?:youtube\.com|youtube-nocookie\.com)\/embed\/[\w-]{11}/;

export const IFRAME_ALLOW =
  "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";

/** True for the embeds this app produces — anything else stays untouched. */
export function isYoutubeEmbedSrc(src: string | null | undefined): boolean {
  return !!src && EMBED_HOST.test(src);
}

export const YoutubeEmbed = Node.create({
  name: "youtubeEmbed",
  group: "block",
  atom: true,
  draggable: true,

  addAttributes() {
    return {
      src: { default: null },
      title: { default: null },
      width: { default: "560" },
      height: { default: "315" },
    };
  },

  parseHTML() {
    return [
      {
        tag: "iframe[src]",
        getAttrs: (element) =>
          isYoutubeEmbedSrc((element as HTMLElement).getAttribute("src")) && null,
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "iframe",
      mergeAttributes(HTMLAttributes, {
        frameborder: "0",
        allow: IFRAME_ALLOW,
        referrerpolicy: "strict-origin-when-cross-origin",
        allowfullscreen: "true",
        class: "aspect-video w-full rounded-xl border border-border",
      }),
    ];
  },
});
