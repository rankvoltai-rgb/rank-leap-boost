/*
 * Launch-directory badges, rotated one at a time at the foot of the footer.
 *
 * Each `html` is the directory's embed code pasted verbatim. Their crawlers
 * check the page HTML for their link (and often the image), so don't reformat
 * or convert it to JSX: the footer renders the string as-is, and sizing and
 * dimming come from the footer's own CSS. To add one, paste its snippet as a
 * new entry.
 *
 * The exception is Authoriflow, which publishes no embed: that badge is ours,
 * drawn here in their palette. It is markup rather than an image so the link
 * carries "Authoriflow" as real anchor text, which is the point of a link
 * exchange; everything else in this list is an image with alt text. Sizing
 * that the footer's CSS applies through `img` is therefore inline on it.
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
  {
    name: "ProductFame",
    html: `<a href="https://productfame.com" target="_blank" rel="noopener noreferrer">
  <img src="https://productfame.com/badges/featured-light.svg" alt="Featured on ProductFame" width="245" height="54" />
</a>`,
  },
  {
    name: "Smol Launch",
    html: `<a href="https://smollaunch.com" target="_blank" rel="noopener">
  <img src="https://smollaunch.com/badges/featured.svg" alt="Rankbox — Featured on Smol Launch" loading="lazy" width="250" height="60" />
</a>`,
  },
  {
    name: "Good AI Tools",
    html: `<a target="_blank" href="https://goodaitools.com/ai/rankbox"><img src="https://goodaitools.com/assets/images/badge.png" alt="Good AI Tools" height="54" loading="lazy"></a>`,
  },
  {
    name: "ShinyLaunch",
    html: `<a target="_blank" href="https://shinylaunch.com/product/rankbox"><img src="https://shinylaunch.com/assets/images/badge-dark.png" alt="ShinyLaunch" height="54" loading="lazy"></a>`,
  },
  {
    name: "Million Dot Homepage",
    html: `<a target="_blank" href="https://milliondothomepage.com/product/rankbox"><img src="https://milliondothomepage.com/assets/images/badge.png" alt="Million Dot Homepage" height="54" loading="lazy"></a>`,
  },
  {
    name: "Authoriflow",
    html: `<a href="https://authoriflow.com" target="_blank" rel="noopener" style="display:flex;align-items:center;gap:8px;box-sizing:border-box;width:max-content;height:40px;padding:0 12px 0 6px;border:1px solid #8f7cd6;border-radius:10px;background:#f8f7f5;text-decoration:none"><span style="display:flex;align-items:center;justify-content:center;flex:none;width:28px;height:28px;border-radius:8px;background:#8f7cd6"><svg viewBox="6.6 12.55 46.8 34.91" width="18" height="13.4" aria-hidden="true" style="display:block"><path fill="#f8f7f5" fill-rule="evenodd" clip-rule="evenodd" d="M13.952,20.157l20.077,0c1.547,-0.004 3.679,-7.604 6.221,-7.61l5.797,0c4.089,0.916 6.568,3.479 7.352,7.775l0,10.753c-0.53,4.539 -2.93,7.367 -7.069,8.602l-20.36,0c-2.505,0.007 -3.066,7.845 -6.504,7.775l-5.09,0c-3.559,-0.59 -6.745,-2.588 -7.776,-8.602l0,-10.091c0.611,-4.778 3.13,-7.575 7.352,-8.602Zm0.6,16.311c-0.045,1.205 0.481,1.786 1.564,1.759l8.637,0c1.381,0.017 3.432,-6.648 6.094,-6.651l13.372,0c0.713,-0.228 1.167,-0.74 1.384,-1.511l0,-7c-0.179,-0.772 -0.606,-1.271 -1.328,-1.45l-9.099,0c-2.278,0.006 -3.201,6.567 -6.023,6.574l-13.012,0c-0.86,0.217 -1.42,0.762 -1.588,1.733l0,6.545Z"/></svg></span><span style="font:600 15px/1 'Plus Jakarta Sans Variable',-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;letter-spacing:-0.01em;color:#0c0c0c;white-space:nowrap">Authoriflow</span></a>`,
  },
  {
    name: "Fazier",
    html: `<a href="https://fazier.com/launches/rankbox.xyz" target="_blank"><img src="https://fazier.com/api/v1//public/badges/launch_badges.svg?badge_type=featured&theme=light" width=250 alt="Fazier badge" /></a>`,
  },
  {
    name: "findalternative.to",
    html: `<a href="https://findalternative.to/rankbox/about?utm_source=badge" title="See Rankbox on findalternative.to"><img src="https://findalternative.to/api/badge/01M5EDDSPDTNBZWT8Q8QAAR5ME.svg?theme=light&amp;variant=hero" alt="See Rankbox on findalternative.to" width="250" height="54" style="border:0" loading="lazy" /></a>`,
  },
];
