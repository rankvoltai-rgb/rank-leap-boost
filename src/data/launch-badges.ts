/*
 * Launch-directory badges, rotated one at a time at the foot of the footer.
 *
 * Each `html` is the directory's embed code pasted verbatim. Their crawlers
 * check the page HTML for their link (and often the image), so don't reformat
 * or convert it to JSX: the footer renders the string as-is, and sizing and
 * dimming come from the footer's own CSS. To add one, paste its snippet as a
 * new entry.
 */

export interface LaunchBadge {
  /** The directory, for keys. The badge's own alt text is what's announced. */
  name: string;
  html: string;
}

export const LAUNCH_BADGES: LaunchBadge[] = [
  {
    name: "PeerPush",
    html: `<a href="https://peerpush.com/p/rankbox-gblk"
  target="_blank"
  rel="noopener"
>
  <img
    src="https://peerpush.com/p/rankbox-gblk/badge.png"
    alt="Rankbox on PeerPush"
    style="width: 230px;"
  />
</a>`,
  },
  {
    name: "LaunchClash",
    html: `<a target="_blank" href="https://launchclash.com/product/rankbox"><img src="https://launchclash.com/assets/images/badge.png" alt="LaunchClash" height="54" loading="lazy"></a>`,
  },
  {
    name: "Solver Tools",
    html: `<a target="_blank" href="https://solvertools.com/tool/rankbox"><img src="https://solvertools.com/assets/images/badge.png" alt="Solver Tools" height="54" loading="lazy"></a>`,
  },
  {
    name: "Toolfame",
    html: `<a href="https://toolfame.com/item/rankbox" target="_blank" rel="noopener noreferrer">
<img src="https://toolfame.com/badge-light.svg" alt="Featured on toolfame.com" style="height: 54px; width: auto;" />
</a>`,
  },
];
