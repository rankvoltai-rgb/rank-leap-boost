/*
 * Variant 3 helpers. Load after ../kit/kit.js (it injects the logo sprite)
 * and ../ads/ads.js (the offer).
 *
 *  - <div class="v3-px"></div> gets the landing hero's pixel squares, blue on
 *    white fields and white on blue ones.
 *  - <canvas class="v3-pxl" data-logo="chatgpt" data-px="11" data-tile="white"
 *    data-tone="blue"> draws an AI engine's mark as a two-colour mosaic: the
 *    mark's silhouette, downsampled to data-px squares, quantised to three
 *    levels (tile, half tint, tone). data-tile: white | sky | blue | none.
 *    data-tone: blue | white. data-pad: margin, 0–0.4 of the tile.
 *    Logos: chatgpt, claude, gemini, google, perplexity, copilot, grok, meta,
 *    deepseek, mistral.
 *  - <i class="v3-cur"></i> gets the arrow cursor; add class "w" for a white
 *    arrow on blue.
 */
(function () {
  const BLUE = [24, 119, 242];
  const TINT = { white: [255, 255, 255], sky: [234, 243, 255], blue: BLUE };
  const PX = [
    [3,31,14,.10],[7,66,20,.08],[11,9,22,.12],[5,88,16,.09],[16,48,12,.07],[14,79,24,.11],[9,20,10,.07],
    [27,3,26,.13],[31,94,18,.10],[24,70,12,.07],[38,58,22,.09],[44,88,14,.08],[41,16,10,.06],[52,2,20,.11],
    [49,97,24,.12],[63,7,24,.14],[68,35,16,.10],[72,62,26,.12],[66,84,14,.09],[79,18,28,.15],[83,47,18,.11],
    [77,73,22,.13],[86,91,26,.14],[90,5,20,.12],[88,29,14,.09],[93,56,24,.13],[91,68,16,.10],[95,81,22,.12],
    [97,13,18,.11],[58,44,10,.06],[20,36,12,.08],[35,77,16,.10],
  ];

  function loadImage(src) {
    return new Promise((ok, fail) => { const i = new Image(); i.onload = () => ok(i); i.onerror = fail; i.src = src; });
  }

  function markSource(name) {
    if (name === "gemini") return new URL("../kit/gemini.png", document.baseURI).href;
    const defs = document.querySelector("svg defs");
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="480" height="480" viewBox="0 0 24 24" style="color:#000"><defs>${defs ? defs.innerHTML : ""}</defs><use href="#lg-${name}" x="0" y="0" width="24" height="24"/></svg>`;
    return "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg);
  }

  async function pixelate(cv) {
    const n = Math.max(5, parseInt(cv.dataset.px || "11", 10));
    const pad = cv.dataset.pad != null ? parseFloat(cv.dataset.pad) : 0.2;
    const tone = cv.dataset.tone === "white" ? TINT.white : BLUE;
    const tileName = cv.dataset.tile || "white";
    const tile = TINT[tileName] || null;
    cv.width = cv.height = n;
    const ctx = cv.getContext("2d");
    try {
      const img = await loadImage(markSource(cv.dataset.logo));
      // Silhouette at 8x, then average down to n x n so edges become partial cover.
      const mid = document.createElement("canvas");
      mid.width = mid.height = n * 8;
      const m = mid.getContext("2d");
      const p = mid.width * pad;
      m.drawImage(img, p, p, mid.width - 2 * p, mid.height - 2 * p);
      m.globalCompositeOperation = "source-in";
      m.fillStyle = "#000";
      m.fillRect(0, 0, mid.width, mid.height);
      const small = document.createElement("canvas");
      small.width = small.height = n;
      const s = small.getContext("2d");
      s.imageSmoothingEnabled = true;
      s.imageSmoothingQuality = "high";
      s.drawImage(mid, 0, 0, n, n);
      const src = s.getImageData(0, 0, n, n).data;
      const out = ctx.createImageData(n, n);
      for (let i = 0; i < n * n; i++) {
        const a = src[i * 4 + 3] / 255;
        const lvl = a < 0.22 ? 0 : a < 0.6 ? 0.42 : 1; // three levels: two colours and one tint
        const base = tile || tone;
        for (let c = 0; c < 3; c++) out.data[i * 4 + c] = Math.round(base[c] + (tone[c] - base[c]) * lvl);
        out.data[i * 4 + 3] = tile ? 255 : Math.round(255 * lvl);
      }
      ctx.putImageData(out, 0, 0);
    } catch (e) {
      if (tile) { ctx.fillStyle = `rgb(${tile.join(",")})`; ctx.fillRect(0, 0, n, n); }
    }
  }

  const ARROW = (fill, edge) => `<svg viewBox="0 0 26 34"><path d="M3 2.5v25.2l6.6-6.4 4.6 10.4 4.3-1.9-4.5-10.2h9.2z" fill="${fill}" stroke="${edge}" stroke-width="2.4" stroke-linejoin="round"/></svg>`;

  document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll(".v3-px").forEach((el) => {
      el.innerHTML = PX.map(([t, l, s, o]) =>
        `<i style="top:${t}%;left:${l}%;width:${s}px;height:${s}px;opacity:${o}"></i>`).join("");
    });
    document.querySelectorAll(".v3-cur").forEach((el) => {
      el.innerHTML = el.classList.contains("w") ? ARROW("#fff", "#1877f2") : ARROW("#1877f2", "#fff");
    });
    document.querySelectorAll("canvas.v3-pxl").forEach(pixelate);
  });
})();
