/*
 * f02 · Paste your website. Get a month of content.
 *
 * The onboarding's three real steps, top to bottom: the Website field and its
 * "Find my keywords" button, "Pick the searches to win" (keyword, intent,
 * searches, trend), and "Your first month of content" with its Autopilot
 * queue ("DAY 1", title, keyword, "+N visits/mo"). Each variant is one use
 * case on an invented business, each web-checked for a real company with
 * that name: Mossbark BBQ and Sablewood Dental (2026-10-03), Driftmoor Coffee
 * and Plotbright (2026-10-04). The site's own samples are not safe to use:
 * Fernwood Coffee (fernwoodcoffee.com) and Plannora (plannora.io) are real.
 * Searches and visits are sample numbers. A variant page sets window.F02.
 */
(function () {
  const VARIANTS = {
    bbq: {
      for: "For restaurants", icon: "rb-flame",
      domain: "mossbarkbbq.com",
      keywords: [
        ["best bbq san francisco", "Commercial", "2,900", "Rising"],
        ["brisket near me", "Transactional", "4,400", "Rising"],
        ["how long to smoke brisket", "Informational", "6,600", "Steady"],
      ],
      plan: [
        ["Where to Get the Best BBQ in San Francisco", "best bbq san francisco", "+420"],
        ["How Long to Smoke a Brisket", "how long to smoke brisket", "+610"],
        ["BBQ Catering for 50: What to Order", "bbq catering bay area", "+130"],
      ],
    },
    coffee: {
      for: "For online stores", icon: "ic-tag",
      domain: "driftmoorcoffee.com",
      keywords: [
        ["best espresso beans", "Commercial", "5,400", "Rising"],
        ["buy single origin coffee", "Transactional", "1,300", "Steady"],
        ["light vs dark roast", "Informational", "9,900", "Steady"],
      ],
      plan: [
        ["Which Roast Is Best for Espresso at Home?", "best espresso beans", "+760"],
        ["Light vs Dark Roast: What Actually Changes?", "light vs dark roast", "+1,100"],
        ["Is Single-Origin Coffee Worth the Price?", "buy single origin coffee", "+150"],
      ],
    },
    saas: {
      for: "For SaaS", icon: "ic-layers",
      domain: "plotbright.io",
      keywords: [
        ["planning tool for small teams", "Commercial", "1,600", "Rising"],
        ["jira alternative", "Commercial", "3,600", "Rising"],
        ["weekly planning meeting", "Informational", "880", "Steady"],
      ],
      plan: [
        ["What’s the Best Planning Tool for a Small Team?", "planning tool for small teams", "+290"],
        ["Kanban vs Gantt: Which Fits a Small Team?", "kanban vs gantt", "+340"],
        ["How to Run a Weekly Planning Meeting", "weekly planning meeting", "+120"],
      ],
    },
    dental: {
      for: "For dental practices", icon: "ic-shield",
      domain: "sablewooddental.com",
      keywords: [
        ["best dentist in austin", "Commercial", "1,900", "Steady"],
        ["emergency dentist near me", "Transactional", "12,100", "Rising"],
        ["teeth cleaning frequency", "Informational", "2,900", "Steady"],
      ],
      plan: [
        ["How to Choose a Dentist in Austin", "best dentist in austin", "+260"],
        ["What Counts as a Dental Emergency?", "emergency dentist near me", "+880"],
        ["How Often Should You Get Your Teeth Cleaned?", "teeth cleaning frequency", "+410"],
      ],
    },
  };

  const v = VARIANTS[window.F02] || VARIANTS.bbq;
  const esc = (t) => String(t).replace(/&/g, "&amp;").replace(/</g, "&lt;");
  const trend = (t) =>
    t === "Rising"
      ? '<svg class="t Rising" viewBox="0 0 24 24"><path d="M3 17 9 11l4 4 8-8M15 7h6v6" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>'
      : '<svg class="t Steady" viewBox="0 0 24 24"><path d="M5 12h14" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/></svg>';

  const html = `
    <div class="field"><div class="glow g3"></div><div class="glow g1"></div><div class="glow g2"></div></div>
    <div class="f-dots"></div>
    <div class="grain"></div>

    <div class="mo-logo"><svg><use href="#lg-rankbox"/></svg>Rankbox</div>
    <div class="mo-for"><svg><use href="#${v.icon}"/></svg>${esc(v.for)}</div>
    <h1 class="mo-hl"><span class="q">Paste your website.</span><span class="a">Get a month of content.</span></h1>

    <svg class="mo-spine" id="spine">
      <defs><filter id="mo-glow" x="-50%" y="-10%" width="200%" height="120%"><feGaussianBlur stdDeviation="7"/></filter></defs>
      <path id="spine-glow" fill="none" stroke="#1877f2" stroke-width="12" opacity=".5" filter="url(#mo-glow)"/>
      <path id="spine-line" fill="none" stroke="#5aa2ff" stroke-width="5" stroke-linecap="round"/>
    </svg>

    <section class="mo-card" id="s1" style="top: 868px">
      <div class="mo-head"><div class="mo-title">Website</div><div class="mo-step">Brand</div></div>
      <div class="mo-url">
        <div class="mo-field"><svg><use href="#ic-globe"/></svg>${esc(v.domain)}<i></i></div>
        <div class="mo-go" id="go">Find my keywords</div>
      </div>
    </section>

    <section class="mo-card" id="s2" style="top: 1214px">
      <div class="mo-head"><div class="mo-title">Pick the searches to win</div><div class="mo-step">Keywords</div></div>
      <div class="mo-kws">
        <div class="mo-kwh"><span>Keyword</span><span>Intent</span><span>Searches</span><span></span></div>
        ${v.keywords.map(([k, i, n, t]) => `<div class="mo-kw"><span class="k">${esc(k)}</span><span class="in ${i}">${i}</span><span class="v">${n}</span>${trend(t)}</div>`).join("")}
      </div>
    </section>

    <section class="mo-card" id="s3" style="top: 1772px">
      <div class="mo-head"><div class="mo-title">Your first month of content</div><div class="mo-step">Plan</div></div>
      <div class="mo-q">
        <div class="mo-qh"><svg><use href="#rb-calendar"/></svg>Autopilot queue<em>30 articles, published one a day</em></div>
        ${v.plan.map(([tt, kk, vv], i) => `<div class="mo-row${i === 0 ? " first" : ""}"><span class="d">DAY ${i + 1}</span><div><div class="tt">${esc(tt)}</div><div class="kk">${esc(kk)}</div></div><div class="vv">${vv}<small>visits/mo</small></div></div>`).join("")}
      </div>
    </section>

    <div class="mo-node" id="n1">1</div>
    <div class="mo-node" id="n2">2</div>
    <div class="mo-node" id="n3">3</div>

    <svg class="cur" id="cur"><use href="#ic-cursor"/></svg>
  `;

  document.addEventListener("DOMContentLoaded", () => {
    const canvas = document.querySelector(".canvas");
    canvas.insertAdjacentHTML("beforeend", html);

    // Nodes sit on the spine level with each step's title; the cursor rests on
    // "Find my keywords".
    document.fonts.ready.then(() => {
      const c = canvas.getBoundingClientRect();
      const box = (el) => { const b = el.getBoundingClientRect(); return { x: b.left - c.left, y: b.top - c.top, w: b.width, h: b.height }; };
      const X = 150;
      const ys = ["s1", "s2", "s3"].map((id) => { const t = box(document.querySelector(`#${id} .mo-title`)); return t.y + t.h / 2; });
      ys.forEach((y, i) => { const n = document.getElementById(`n${i + 1}`); n.style.left = X + "px"; n.style.top = y + "px"; });
      const d = `M${X} ${ys[0]} V${ys[2]}`;
      document.getElementById("spine-line").setAttribute("d", d);
      document.getElementById("spine-glow").setAttribute("d", d);

      const go = box(document.getElementById("go"));
      const cur = document.getElementById("cur");
      cur.style.left = (go.x + go.w * 0.9) + "px";
      cur.style.top = (go.y + go.h * 0.86) + "px";
    });
  });
})();
