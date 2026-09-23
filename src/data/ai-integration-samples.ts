/**
 * What the AI tool pages show before a visitor runs anything: one worked
 * example per kind of tool, in the exact shape Rankbox's three MCP tools
 * return, plus the scenarios the "Use cases" section walks through.
 *
 * Every example is marked "Sample" where it renders. They're written the way
 * the tools actually answer, on invented but plausible topics; none of it is a
 * customer's data or a claim about results. The live "Run it" button replaces
 * a sample with a real answer from the same tools.
 */
import type { ContentBrief, QuestionGroup } from "@/lib/tools.functions";

export type AiCategory = "assistant" | "builder" | "coding" | "automation";
export type RankboxTool = "questions" | "brief" | "meta";

export const TOOL_NAMES: Record<RankboxTool, { label: string; mcp: string; arg: string }> = {
  questions: { label: "AI search questions", mcp: "generate_ai_questions", arg: "topic" },
  brief: { label: "Content brief", mcp: "generate_content_brief", arg: "keyword" },
  meta: { label: "Meta descriptions", mcp: "write_meta_descriptions", arg: "topic" },
};

export interface ToolSample {
  /** The input each tool was called with. */
  input: Record<RankboxTool, string>;
  questions: QuestionGroup[];
  brief: ContentBrief;
  meta: string[];
}

export const SAMPLES: Record<AiCategory, ToolSample> = {
  assistant: {
    input: {
      questions: "home solar batteries",
      brief: "best home battery for solar",
      meta: "A page comparing home solar batteries by capacity, warranty and price",
    },
    questions: [
      {
        intent: "Informational",
        questions: [
          "How long do home solar batteries last?",
          "How much of my house can one battery power during an outage?",
          "Is a home battery worth it without solar panels?",
        ],
      },
      {
        intent: "Commercial",
        questions: [
          "Which home battery is best to pair with solar?",
          "Is a Tesla Powerwall worth the price?",
          "Which solar batteries have the longest warranty?",
        ],
      },
      {
        intent: "Comparison",
        questions: [
          "Powerwall vs Enphase IQ Battery: which is better?",
          "LFP vs NMC batteries for home storage?",
          "Home battery vs generator for power outages?",
        ],
      },
      {
        intent: "Transactional",
        questions: [
          "How much does it cost to install a home battery?",
          "Can I get a tax credit for adding a battery?",
          "Who installs solar batteries near me?",
        ],
      },
    ],
    brief: {
      title: "Best Home Battery for Solar: How to Choose",
      outline: [
        { heading: "How a home battery works with solar", points: [] },
        { heading: "Capacity, power, and depth of discharge", points: [] },
        { heading: "LFP vs NMC: why chemistry matters", points: [] },
        { heading: "The leading batteries compared", points: [] },
        { heading: "What installation really costs", points: [] },
        { heading: "Incentives and payback time", points: [] },
      ],
      questions: [
        "How many kWh does a typical home need?",
        "Can a battery run my air conditioning?",
      ],
      entities: ["kWh capacity", "Round-trip efficiency", "LFP", "Powerwall", "Time-of-use rates"],
    },
    meta: [
      "Compare home solar batteries side by side: capacity, warranty, and real installed cost, so you can pick the right one for your roof and budget.",
      "Not sure which solar battery to buy? See how the leading home batteries stack up on storage, lifespan, and price, with the trade-offs explained.",
      "Find the best home battery for your solar setup. We compare capacity, chemistry, warranties, and installed price so you can choose with confidence.",
    ],
  },
  builder: {
    input: {
      questions: "meal-prep delivery",
      brief: "meal prep for beginners",
      meta: "The pricing page for a weekly meal-prep delivery service",
    },
    questions: [
      {
        intent: "Informational",
        questions: [
          "How does meal-prep delivery work?",
          "How long do prepared meals stay fresh?",
          "Is meal-prep delivery healthier than takeout?",
        ],
      },
      {
        intent: "Commercial",
        questions: [
          "What's the best meal-prep delivery for weight loss?",
          "Which meal-prep services have vegetarian plans?",
          "Is meal-prep delivery worth the money?",
        ],
      },
      {
        intent: "Comparison",
        questions: [
          "Meal-prep delivery vs meal kits: which saves more time?",
          "Factor vs CookUnity: which is better?",
          "Meal-prep delivery vs cooking at home: cost per meal?",
        ],
      },
      {
        intent: "Transactional",
        questions: [
          "How much does weekly meal-prep delivery cost?",
          "Can I pause or skip a meal-prep delivery week?",
          "Which meal-prep services deliver to my area?",
        ],
      },
    ],
    brief: {
      title: "Meal Prep for Beginners: A Simple First Week",
      outline: [
        { heading: "What meal prep is, and what it isn't", points: [] },
        { heading: "The five containers you actually need", points: [] },
        { heading: "A beginner's first-week menu", points: [] },
        { heading: "How long each meal keeps", points: [] },
        { heading: "When a delivery service beats doing it yourself", points: [] },
      ],
      questions: ["How many meals should I prep at once?", "Can I freeze prepped meals?"],
      entities: ["Batch cooking", "Food safety", "Macros", "Glass containers", "Meal kits"],
    },
    meta: [
      "See exactly what weekly meal-prep delivery costs, with no hidden fees. Pick a plan, choose your meals, and skip or pause any week you like.",
      "Fresh, ready-to-eat meals delivered every week. Compare plans and prices, then choose how many meals you want and change it any time you need.",
      "Simple, transparent pricing for chef-prepared meals. Start with as few as six meals a week, pause anytime, and cancel whenever you want online.",
    ],
  },
  coding: {
    input: {
      questions: "project management software",
      brief: "kanban vs scrum",
      meta: "The pricing page of a project management app for small teams",
    },
    questions: [
      {
        intent: "Informational",
        questions: [
          "What does project management software actually do?",
          "What's the difference between a task manager and a project manager?",
          "How do small teams track projects without a PM?",
        ],
      },
      {
        intent: "Commercial",
        questions: [
          "What's the best project management software for small teams?",
          "Which project management tools have a free plan?",
          "Is project management software worth it for a five-person team?",
        ],
      },
      {
        intent: "Comparison",
        questions: [
          "Asana vs Trello: which is better for startups?",
          "Linear vs Jira for a small engineering team?",
          "Notion vs a dedicated project management tool?",
        ],
      },
      {
        intent: "Transactional",
        questions: [
          "How much does project management software cost per user?",
          "Can I import my Trello boards into another tool?",
          "Which project management tools offer a free trial?",
        ],
      },
    ],
    brief: {
      title: "Kanban vs Scrum: Which Should Your Team Pick?",
      outline: [
        { heading: "What Kanban and Scrum each optimise for", points: [] },
        { heading: "Roles, rituals, and the work in between", points: [] },
        { heading: "Which fits a team that ships continuously", points: [] },
        { heading: "How to switch without losing a sprint", points: [] },
      ],
      questions: ["Can you mix Kanban and Scrum?", "Does Scrum work for a team of three?"],
      entities: ["WIP limits", "Sprint review", "Cycle time", "Backlog", "Scrumban"],
    },
    meta: [
      "Simple pricing for teams that ship. Plan projects, track work, and see who's doing what, free for small teams and fair per-seat pricing after that.",
      "Compare plans for our project management app: free for up to five people, then one flat price per seat with every feature included from day one.",
      "Project management without the enterprise price tag. See what each plan includes, start free, and upgrade only when your growing team needs more.",
    ],
  },
  automation: {
    input: {
      questions: "CRM for startups",
      brief: "best CRM for startups",
      meta: "A guide comparing the best CRMs for early-stage startups",
    },
    questions: [
      {
        intent: "Informational",
        questions: [
          "When does a startup actually need a CRM?",
          "What should an early-stage CRM track?",
          "Can a spreadsheet replace a CRM at the start?",
        ],
      },
      {
        intent: "Commercial",
        questions: [
          "What's the best CRM for a seed-stage startup?",
          "Which CRMs have a free plan for startups?",
          "Which CRM is easiest for a founder-led sales team?",
        ],
      },
      {
        intent: "Comparison",
        questions: [
          "HubSpot vs Pipedrive for startups?",
          "Attio vs HubSpot: which suits a small team?",
          "Salesforce vs HubSpot for a growing startup?",
        ],
      },
      {
        intent: "Transactional",
        questions: [
          "How much does a startup CRM cost per seat?",
          "Which CRMs offer startup discounts?",
          "How long does it take to set up a CRM?",
        ],
      },
    ],
    brief: {
      title: "Best CRM for Startups: How to Choose Your First One",
      outline: [
        { heading: "When a startup outgrows the spreadsheet", points: [] },
        { heading: "The five features that matter early", points: [] },
        { heading: "Top CRMs compared by stage and price", points: [] },
        { heading: "Startup discounts and free plans", points: [] },
        { heading: "Setting it up in an afternoon", points: [] },
      ],
      questions: ["Is HubSpot free for startups?", "Do I need a CRM before product-market fit?"],
      entities: ["Pipeline stages", "Deal tracking", "Email sync", "HubSpot", "Pipedrive"],
    },
    meta: [
      "Compare the best CRMs for early-stage startups by price, setup time, and features, and find the one that fits a founder-led sales team right now.",
      "Choosing your first CRM? We compare the top options for startups on free plans, startup discounts, and how quickly you can get up and running.",
      "The best CRM for your startup depends on your stage. See which tools suit seed-stage teams, what they cost, and when it makes sense to switch.",
    ],
  },
};

/* ── Use cases ─────────────────────────────────────────────────── */

export interface Scenario {
  title: string;
  tool: RankboxTool;
  /** What the user asks, in the tool. `{name}` is the tool's name. */
  prompt: string;
  /** What Rankbox hands back. */
  returns: string;
  /** What the tool does with it next. */
  then: string;
}

export const SCENARIOS: Record<AiCategory, Scenario[]> = {
  assistant: [
    {
      title: "Plan next month's articles",
      tool: "questions",
      prompt: "What do people ask AI about home solar batteries? Group them so I can plan posts.",
      returns: "The questions people put to ChatGPT, Perplexity, and Gemini, grouped by intent.",
      then: "{name} turns the Commercial and Comparison questions into a month of post ideas.",
    },
    {
      title: "Brief before you write",
      tool: "brief",
      prompt: "Build a content brief for “best home battery for solar”.",
      returns: "A working title, an H2 outline, questions to answer, and entities to mention.",
      then: "{name} drafts the introduction from the outline, in your voice.",
    },
    {
      title: "Fix a page's search snippet",
      tool: "meta",
      prompt: "Write meta descriptions for our battery comparison page.",
      returns: "Three options, each 120 to 160 characters.",
      then: "You pick one and paste it into your CMS.",
    },
  ],
  builder: [
    {
      title: "Research before you build",
      tool: "questions",
      prompt:
        "Before you build the pricing page, use Rankbox to see what people ask AI about meal-prep delivery prices.",
      returns: "The real questions, grouped from Informational to Transactional.",
      then: "{name} builds the page's FAQ from the Comparison and Transactional questions.",
    },
    {
      title: "Build a post from a brief",
      tool: "brief",
      prompt: "Get a Rankbox brief for “meal prep for beginners” and build the blog post page.",
      returns: "A title, an outline, the questions to answer, and entities to cover.",
      then: "{name} builds the page with one section per H2.",
    },
    {
      title: "Launch with the metadata done",
      tool: "meta",
      prompt: "Add a meta description to every page before we publish.",
      returns: "Three options per page, each 120 to 160 characters.",
      then: "{name} sets the strongest one on each page.",
    },
  ],
  coding: [
    {
      title: "Metadata in the same change",
      tool: "meta",
      prompt: "Write meta descriptions for the pricing page and add the best one to its metadata.",
      returns: "Three options, each 120 to 160 characters.",
      then: "{name} edits the page's metadata in your codebase.",
    },
    {
      title: "Scaffold a page from a brief",
      tool: "brief",
      prompt: "Get a Rankbox brief for “kanban vs scrum” and scaffold the article page from it.",
      returns: "The brief as structured data: title, outline, questions, entities.",
      then: "{name} creates the page with a section for each H2 in the outline.",
    },
    {
      title: "Answer what people ask",
      tool: "questions",
      prompt:
        "What do people ask AI about project management software? Add an FAQ that answers the top five.",
      returns: "The questions, grouped by intent.",
      then: "{name} writes the FAQ component and its answers.",
    },
  ],
  automation: [
    {
      title: "A brief for every new keyword",
      tool: "brief",
      prompt:
        "When a keyword is added to the sheet, create a Rankbox brief and send it to the team.",
      returns: "A structured brief for each new keyword.",
      then: "{name} passes it to the next step, wherever your team plans content.",
    },
    {
      title: "A weekly questions digest",
      tool: "questions",
      prompt: "Every Monday, get the AI search questions for our five core topics.",
      returns: "Fresh questions for each topic, grouped by intent.",
      then: "{name} collects them into one digest for the week's planning.",
    },
    {
      title: "Meta descriptions in bulk",
      tool: "meta",
      prompt: "For each URL in the list, write a meta description with Rankbox.",
      returns: "Three options per page.",
      then: "{name} writes the first option back next to each URL.",
    },
  ],
};
