/*
 * Variant 2 helpers. Load after ../kit/kit.js (it injects the logo sprite)
 * and ../ads/ads.js (the offer).
 *
 *  - <div class="v2-px"></div> gets the landing hero's white squares.
 *  - <canvas class="pxl" data-logo="chatgpt" data-px="9"></canvas> draws an
 *    AI-engine logo as a pixel mosaic: the mark is drawn into a tiny canvas
 *    (data-px squares across) and scaled up with image-rendering: pixelated.
 *    data-logo: chatgpt, claude, gemini, google, perplexity, copilot, grok,
 *    meta, deepseek, mistral. data-mode="tile" pixelates the white tile too
 *    (put it on its own, not in .pxl-wrap). data-pad sets the mark's margin
 *    (0–0.4 of the tile, default 0.2).
 */
(function () {
  const COLOR = {
    chatgpt: "#10a37f", claude: "#d97757", perplexity: "#20808d", deepseek: "#4d6bfe",
    grok: "#111111", google: "#000", copilot: "#000", meta: "#000", mistral: "#000",
  };
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
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="480" height="480" viewBox="0 0 24 24" style="color:${COLOR[name] || "#000"}"><defs>${defs ? defs.innerHTML : ""}</defs><use href="#lg-${name}" x="0" y="0" width="24" height="24"/></svg>`;
    return "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg);
  }

  async function pixelate(cv) {
    const name = cv.dataset.logo;
    const n = Math.max(4, parseInt(cv.dataset.px || "9", 10));
    const tile = cv.dataset.mode === "tile";
    const pad = cv.dataset.pad != null ? parseFloat(cv.dataset.pad) : 0.2;
    cv.width = n; cv.height = n;
    if (tile) cv.classList.add("tile");
    const ctx = cv.getContext("2d");
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";
    if (tile) {
      ctx.fillStyle = "#fff";
      ctx.fillRect(0, 0, n, n);
    }
    try {
      const img = await loadImage(markSource(name));
      // Downsample in two steps so the colours average instead of aliasing.
      const mid = document.createElement("canvas");
      mid.width = mid.height = n * 8;
      const m = mid.getContext("2d");
      m.imageSmoothingQuality = "high";
      const p = mid.width * pad;
      m.drawImage(img, p, p, mid.width - 2 * p, mid.height - 2 * p);
      ctx.drawImage(mid, 0, 0, n, n);
    } catch (e) { /* leave the tile plain */ }
  }

  document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll(".v2-px").forEach((el) => {
      el.innerHTML = PX.map(([t, l, s, o]) =>
        `<i style="top:${t}%;left:${l}%;width:${s}px;height:${s}px;opacity:${o}"></i>`).join("");
    });
    document.querySelectorAll("canvas.pxl").forEach(pixelate);
  });
})();
