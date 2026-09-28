// A8 test set. Each paragraph = lead + 4 sentences; sentence i is a definition (D) when i < k,
// otherwise filler (F). Slots {alt|kwForm} are either a pronoun/alt phrase or the exact keyword
// (KW), so keyword density changes while the meaning stays the same.
export const TOPICS = [
  {
    id: "llms-txt",
    kw: "llms.txt file",
    lead: "Here is a short guide to the KW.",
    prompts: [
      "What is an llms.txt file?",
      "How does an llms.txt file work?",
      "Should my website have an llms.txt file?",
      "Is there a text file I can add to my site to help AI assistants understand it?",
    ],
    F: [
      "{It|An KW} is something more and more website owners seem to be talking about these days.",
      "Plenty of experts believe {it|an KW} could matter a great deal for the future of your online presence.",
      "Getting {it|your KW} right may help you stay ahead of competitors who choose to ignore {it|the KW}.",
      "{It|An KW} is well worth considering if you care about how your brand shows up online.",
    ],
    D: [
      "{It|An KW} is a plain Markdown file served from the root of a website, at the path /llms.txt.",
      "{It|An KW} opens with an H1 title and a blockquote summary, followed by H2 sections that list links to key pages.",
      "Jeremy Howard of Answer.AI proposed {it|the KW} in September 2024 as a guide for language models reading a site.",
      "{It|An KW} does not control crawling or indexing, which robots.txt and meta tags still handle for every search engine.",
    ],
  },
  {
    id: "project-management",
    kw: "project management software",
    lead: "Here is a short guide to KW.",
    prompts: [
      "What is project management software?",
      "How does project management software help a team?",
      "What features should project management software have?",
      "What tool can my team use to plan tasks, deadlines and who is working on what?",
    ],
    F: [
      "{It|KW} is something almost every growing company ends up thinking about at some point.",
      "Plenty of people say {it|KW} has completely changed the way they approach a working week.",
      "Choosing {it|KW} carefully can save you headaches, because switching {it|KW} later is a big decision.",
      "{It|KW} comes in many shapes and sizes, so there is an option out there for almost everyone.",
    ],
    D: [
      "{It|KW} is an application in which a team plans work as tasks, each with an owner, a due date and a status.",
      "{It|KW} displays those tasks as a Kanban board, a list, a calendar or a Gantt chart with dependencies.",
      "{It|KW} tracks progress against deadlines, flags blocked tasks and shows the workload of each person on the team.",
      "Asana, Jira, Trello and Monday.com are common examples of {this category|KW}, usually priced per user per month.",
    ],
  },
  {
    id: "roth-ira",
    kw: "Roth IRA",
    lead: "Here is a short guide to the KW.",
    prompts: [
      "What is a Roth IRA?",
      "How does a Roth IRA work?",
      "Is a Roth IRA better than a traditional IRA?",
      "Which retirement account lets me pay tax now and take the money out tax-free later?",
    ],
    F: [
      "{It|A KW} is one of those topics that tends to come up whenever people start thinking about money.",
      "A lot of personal finance writers are big fans of {it|the KW}, and for plenty of good reasons.",
      "Opening {one|a KW} is a step many people wish they had taken much earlier in their lives.",
      "{It|A KW} can be a smart move, depending on your personal situation and your long-term goals.",
    ],
    D: [
      "{It|A KW} is a US individual retirement account funded with after-tax dollars, so contributions are not deductible.",
      "Qualified withdrawals from {it|a KW} are tax-free once the owner is 59½ and the account is five years old.",
      "{It|A KW} has an annual contribution limit set by the IRS, and eligibility phases out at higher incomes.",
      "Unlike a traditional IRA, {it|a KW} has no required minimum distributions during the original owner's lifetime.",
    ],
  },
  {
    id: "heat-pump",
    kw: "heat pump",
    lead: "Here is a short guide to the KW.",
    prompts: [
      "What is a heat pump?",
      "How does a heat pump work?",
      "Is a heat pump worth it compared with a gas furnace?",
      "What system can both heat and cool my house using only electricity?",
    ],
    F: [
      "{It|A KW} is getting plenty of attention from homeowners who want to upgrade their homes this year.",
      "Many people who install {one|a KW} say they only wish they had done it years earlier.",
      "{It|A KW} can be a great choice, but it pays to do your homework before you buy {one|a KW}.",
      "There are lots of options on the market, so finding {the right one|the right KW} for your home is possible.",
    ],
    D: [
      "{It|A KW} is an electric appliance that moves heat between indoors and outdoors instead of burning fuel.",
      "In winter {it|a KW} pulls heat from outdoor air or the ground, and in summer {it|the KW} runs in reverse to cool.",
      "Because it moves heat rather than creating it, {it|a KW} can deliver three to four units of heat per unit of electricity.",
      "{Cold-climate models|Cold-climate KW models} keep heating efficiently at outdoor temperatures well below freezing.",
    ],
  },
  {
    id: "cold-brew",
    kw: "cold brew coffee",
    lead: "Here is a short guide to KW.",
    prompts: [
      "What is cold brew coffee?",
      "How do you make cold brew coffee?",
      "What is the difference between cold brew coffee and iced coffee?",
      "How can I make smooth coffee at home without using hot water?",
    ],
    F: [
      "{It|KW} has become a favorite drink for lots of people, especially during the warmer months of the year.",
      "Many coffee lovers swear by {it|KW} and say they would never go back to anything else.",
      "{It|KW} is easy to enjoy at home or on the go, whatever your daily routine looks like.",
      "Trying {it|KW} is a fun way to shake up your habits and treat yourself a little.",
    ],
    D: [
      "{It|KW} is made by steeping coarsely ground coffee in cold or room-temperature water for 12 to 24 hours.",
      "After steeping, {it|KW} is filtered to remove the grounds, leaving a concentrate that is diluted with water or milk.",
      "Because no heat is used, {it|KW} extracts fewer bitter compounds, so many drinkers find {it|KW} tastes smoother.",
      "{It|KW} differs from iced coffee, which is brewed hot in the usual way and then poured over ice.",
    ],
  },
  {
    id: "zero-trust",
    kw: "zero trust security",
    lead: "Here is a short guide to KW.",
    prompts: [
      "What is zero trust security?",
      "How does zero trust security work?",
      "How is zero trust security different from a VPN?",
      "How do we stop attackers moving around our network after one laptop is hacked?",
    ],
    F: [
      "{It|KW} is a hot topic in boardrooms and IT departments all around the world right now.",
      "Plenty of security leaders now describe {it|KW} as a must-have for any modern business.",
      "Adopting {it|KW} is a journey, and every organization will move toward {it|KW} at its own pace.",
      "{It|KW} can give your team real peace of mind in an uncertain and fast-changing threat landscape.",
    ],
    D: [
      "{It|KW} is a model in which no user or device is trusted by default, even inside the corporate network.",
      "Under {it|KW}, every request is verified using identity, device health and context before access is granted.",
      "{It|KW} grants least-privilege access to single applications rather than whole networks, which limits lateral movement.",
      "NIST defines {it|KW} in Special Publication 800-207, which describes policy engines and policy enforcement points.",
    ],
  },
  {
    id: "email-deliverability",
    kw: "email deliverability",
    lead: "Here is a short guide to KW.",
    prompts: [
      "What is email deliverability?",
      "How can I improve email deliverability?",
      "Why are my marketing emails going to spam?",
      "How do I make sure the messages I send actually reach people's inboxes?",
    ],
    F: [
      "{It|KW} is something every marketer should keep an eye on, whatever the size of the list.",
      "Many brands only start worrying about {it|KW} once something has already gone badly wrong.",
      "{Getting it right|Getting KW right} can make a big difference to how well your campaigns perform over time.",
      "{It|KW} is a topic full of myths, so it pays to stay curious and keep learning about {it|KW}.",
    ],
    D: [
      "{It|KW} is the share of sent emails that reach recipients' inboxes rather than spam folders or bounces.",
      "Mailbox providers judge {it|KW} partly by authentication, meaning SPF, DKIM and DMARC records published in DNS.",
      "Since February 2024, Gmail and Yahoo have tied {it|KW} for bulk senders to authentication and one-click unsubscribe.",
      "{It|KW} also depends on spam complaint rates, which Google requires bulk senders to keep under 0.3 percent.",
    ],
  },
  {
    id: "vector-database",
    kw: "vector database",
    lead: "Here is a short guide to the KW.",
    prompts: [
      "What is a vector database?",
      "How does a vector database work?",
      "Do I need a vector database for a RAG chatbot?",
      "Where should I store embeddings so I can search my documents by meaning?",
    ],
    F: [
      "{It|A KW} is one of the buzziest pieces of technology in the AI world at the moment.",
      "Many developers are excited about {it|the KW} and what {it|a KW} could mean for their next project.",
      "Picking {the right one|the right KW} can feel overwhelming, because there are so many options available today.",
      "{It|A KW} is definitely worth learning about if you want to keep up with modern software.",
    ],
    D: [
      "{It|A KW} stores data as embeddings, which are lists of numbers that represent the meaning of text, images or audio.",
      "{It|A KW} answers a query by finding the stored vectors closest to the query vector, often by cosine similarity.",
      "To stay fast at scale, {it|a KW} uses approximate nearest-neighbour indexes such as HNSW instead of comparing every vector.",
      "Retrieval-augmented generation apps use {it|a KW} to fetch relevant passages before a language model writes an answer.",
    ],
  },
];

/** Classic keyword-stuffing tail, appended to the most stuffed paragraph as an extreme case. */
export const TAIL = ["Best KW.", "KW guide.", "KW tips.", "KW 2026."];

const SLOT = /\{([^|{}]*)\|([^{}]*)\}/g;

function slotsIn(sentences) {
  let n = 0;
  for (const s of sentences) n += [...s.matchAll(SLOT)].length;
  return n;
}

function cap(s) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

/** Fills the first m slots (in reading order) with the keyword form, the rest with the alt. */
function realize(topic, sentences, m) {
  let i = 0;
  const out = sentences.map((s) => {
    const filled = s.replace(SLOT, (_, alt, kwForm) => (i++ < m ? kwForm : alt));
    return cap(filled.replaceAll("KW", topic.kw));
  });
  return out.join(" ");
}

export function words(text) {
  return text.split(/\s+/).filter(Boolean).length;
}

export function kwCount(text, kw) {
  return text.toLowerCase().split(kw.toLowerCase()).length - 1;
}

/** Every (k definitions, m keyword slots) paragraph for a topic, plus a stuffed-tail extreme per k. */
export function variants(topic) {
  const out = [];
  for (let k = 0; k <= 4; k++) {
    const body = [0, 1, 2, 3].map((i) => (i < k ? topic.D[i] : topic.F[i]));
    const sentences = [topic.lead, ...body];
    const nSlots = slotsIn(body);
    for (let m = 0; m <= nSlots; m++) {
      const text = realize(topic, sentences, m);
      out.push({ topic: topic.id, k, m, tail: false, text });
    }
    const stuffed =
      realize(topic, sentences, nSlots) +
      " " +
      TAIL.map((t) => cap(t.replaceAll("KW", topic.kw))).join(" ");
    out.push({ topic: topic.id, k, m: nSlots, tail: true, text: stuffed });
  }
  for (const v of out) {
    v.words = words(v.text);
    v.kwCount = kwCount(v.text, topic.kw);
    v.kwDensity = (100 * v.kwCount) / v.words;
    v.defDensity = (100 * v.k) / v.words;
  }
  return out;
}
