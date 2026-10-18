/*
 * Variant 4 helpers. Load after ../kit/kit.js and ../ads/ads.js.
 *  - <i class="v4-hand"></i> gets the white pointing-hand cursor the
 *    references use (FeedSpring, Formflow).
 */
(function () {
  const HAND = `<svg viewBox="0 0 32 32"><path d="M12.6 4.6c1.3 0 2.3 1 2.3 2.3v7.6l.6-.1c1.2-.2 2.3.4 2.7 1.5 1.2-.4 2.5.2 2.9 1.3 1.2-.3 2.4.4 2.8 1.6.1.3.1.6.1.9v4.4c0 3.6-2.9 6.4-6.4 6.4h-3.2c-2 0-3.9-.9-5.1-2.5l-4.4-5.9c-.8-1-.6-2.5.4-3.3.9-.7 2.2-.7 3 .1l2 2V6.9c0-1.3 1-2.3 2.3-2.3Z" fill="#fff" stroke="#0c1018" stroke-width="1.5" stroke-linejoin="round"/><path d="M15 15v4.6M18.3 16.5v3.5M21.4 18.4v2.4" stroke="#0c1018" stroke-width="1.5" stroke-linecap="round"/></svg>`;
  document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll(".v4-hand").forEach((el) => { el.innerHTML = HAND; });
  });
})();
