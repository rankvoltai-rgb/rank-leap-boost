/*
 * The offer every ad in the set carries, in one place. The brief says price
 * and trial terms must match everywhere; change them here, re-render every
 * cluster, re-export.
 *
 * Price and articles come from src/data/pricing.ts. The trial follows the
 * product (TRIAL_DAYS = 7); the user's brief says 2 days, pending a decision.
 *
 * In a scene: <span data-offer="price"></span>, "articles", "trial", "cta",
 * or "line" for "price · articles · trial".
 */
window.OFFER = {
  price: "$49.50/month",
  articles: "30 articles a month",
  trial: "7-day free trial",
  cta: "Get Started Free",
};
window.OFFER.line = [window.OFFER.price, window.OFFER.articles, window.OFFER.trial].join(" · ");

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll("[data-offer]").forEach((el) => {
    const v = window.OFFER[el.dataset.offer];
    if (v) el.textContent = v;
  });
});
