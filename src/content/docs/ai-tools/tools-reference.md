---
title: MCP tool reference
nav_title: Tool reference
description: Exhaustive reference for the three Rankbox MCP tools, with every input and limit, the output shape, real example results, errors and example prompts.
order: 3
updated: 2026-10-02
---

The Rankbox MCP server at `https://rankbox.xyz/mcp` exposes three tools: `generate_ai_questions`, `generate_content_brief` and `write_meta_descriptions`. This page documents each one in full, for people choosing a prompt and for agents and developers calling the tools directly.

For transport, access and testing, see [The Rankbox MCP server](/docs/ai-tools/mcp-server). For adding the server to a client, see [Connect your AI tools](/docs/ai-tools/connect-ai-tools).

## Rules shared by all three tools

These rules apply to every Rankbox MCP tool.

| Rule | Detail |
| --- | --- |
| Inputs | One required string argument. Leading and trailing spaces are trimmed before the length check. No other arguments are accepted (`additionalProperties: false`) |
| Account | None needed. The tools don't read or change any Rankbox account |
| Cost and limits | Free to call. Rankbox applies no per-client quota to the MCP server |
| Work done | One live AI model call per tool call. Nothing is saved |
| Output | `content`: one Markdown text block. `structuredContent`: the same result as JSON |
| Output schema | None declared (`outputSchema` is null). The JSON shapes below come from the tool code and are stable |
| Annotations | `readOnlyHint: true`, `idempotentHint: false`, `openWorldHint: true` |
| Task support | `execution.taskSupport` is `forbidden`: call the tools synchronously |
| Determinism | None. The same input gives different output on each call |

Model output is a draft. It can name products that don't exist, quote figures nobody measured, or describe features a vendor doesn't offer. Check names, numbers and claims before you publish anything a tool wrote.

## generate_ai_questions

Lists the questions people ask AI assistants about a topic, grouped by search intent. Use it to plan articles, H2 headings, FAQ entries, or the prompts you test your own AI visibility with.

| Property | Value |
| --- | --- |
| Name | `generate_ai_questions` |
| Title | Generate AI search questions |
| Description | Given a topic, list the real questions people ask AI assistants (ChatGPT, Perplexity, Gemini, Google AI Overviews), grouped by intent (Informational, Commercial, Comparison, Transactional). Use it to plan content that gets cited by AI engines. |
| Time on a test call | About 11 seconds |

### generate_ai_questions input

| Parameter | Type | Required | Limits | Description |
| --- | --- | --- | --- | --- |
| `topic` | string | Yes | 2 to 200 characters after trimming | The topic, product, or niche to research |

```json title="Input schema"
{
  "type": "object",
  "properties": {
    "topic": {
      "type": "string",
      "minLength": 2,
      "maxLength": 200,
      "description": "The topic, product, or niche to research."
    }
  },
  "required": ["topic"],
  "additionalProperties": false
}
```

### generate_ai_questions output

The model is asked for four groups, one per intent (Informational, Commercial, Comparison, Transactional), with four to six questions each. Rankbox then applies these limits:

- At most 6 groups and at most 8 questions per group.
- Groups with no questions are dropped.
- A group with no intent name is labelled `Questions`.

`structuredContent` has this shape:

| Field | Type | Description |
| --- | --- | --- |
| `groups` | array | One entry per intent, in the model's order |
| `groups[].intent` | string | The intent name, such as `Informational` |
| `groups[].questions` | array of strings | The questions, each a full sentence |

The `content` text is each group as a `##` heading followed by a bulleted list, with a blank line between groups.

### generate_ai_questions example

```json title="tools/call params"
{
  "name": "generate_ai_questions",
  "arguments": { "topic": "project management software for agencies" }
}
```

A real result, shortened to two questions per group:

```json title="structuredContent"
{
  "groups": [
    {
      "intent": "Informational",
      "questions": [
        "What are the key features agencies need in project management software?",
        "What integrations are most important for agency project management software?"
      ]
    },
    {
      "intent": "Commercial",
      "questions": [
        "Are there project management tools built specifically for marketing or PR agencies?",
        "Which tools provide built-in resource management and capacity planning for agency teams?"
      ]
    },
    {
      "intent": "Comparison",
      "questions": [
        "Monday.com vs. Wrike vs. Hive: which has the strongest client collaboration features for agencies?",
        "How does Basecamp stack up against ProofHub for small creative agencies prioritizing simplicity?"
      ]
    },
    {
      "intent": "Transactional",
      "questions": [
        "How do I upgrade my Teamwork plan to include unlimited clients and custom reporting?",
        "Can I migrate from Asana to FunctionFox without losing historical time logs and task data?"
      ]
    }
  ]
}
```

```text title="content[0].text (start)"
## Informational
- What are the key features agencies need in project management software?
- What integrations are most important for agency project management software?

## Commercial
- Are there project management tools built specifically for marketing or PR agencies?
```

The full result had six questions in each of the four groups.

### Prompts that trigger generate_ai_questions

- "What questions do people ask AI about home solar batteries?"
- "Use Rankbox to find what people ask ChatGPT about meal-prep delivery, grouped by intent."
- "Before you build the landing page, use Rankbox to find what people ask AI about kanban boards."

## generate_content_brief

Builds a content brief for a target keyword: a working title, an H2 outline with talking points, the questions the article must answer, and the entities and terms to mention.

| Property | Value |
| --- | --- |
| Name | `generate_content_brief` |
| Title | Generate SEO content brief |
| Description | Build a content brief for a target keyword: a working title, an H2 outline with talking points, questions the article must answer, and key entities to mention. Optimized to rank on Google and get cited by AI engines. |
| Time on a test call | About 18 seconds |

### generate_content_brief input

| Parameter | Type | Required | Limits | Description |
| --- | --- | --- | --- | --- |
| `keyword` | string | Yes | 2 to 200 characters after trimming | The target keyword or phrase |

```json title="Input schema"
{
  "type": "object",
  "properties": {
    "keyword": {
      "type": "string",
      "minLength": 2,
      "maxLength": 200,
      "description": "The target keyword or phrase."
    }
  },
  "required": ["keyword"],
  "additionalProperties": false
}
```

### generate_content_brief output

The model is asked for a working title under 60 characters, six to nine outline sections with two to four points each, six to eight questions, and eight to twelve entities. It is told the current year so it doesn't present an earlier year as current. Rankbox then applies these limits:

- At most 10 outline sections; sections without a heading are dropped.
- At most 6 points per section, 10 questions and 16 entities.
- If the model gives no title, the title is the keyword.
- If no outline section survives, the call fails.

`structuredContent` has this shape:

| Field | Type | Description |
| --- | --- | --- |
| `brief.title` | string | The working H1 |
| `brief.outline` | array | The H2 sections, in order |
| `brief.outline[].heading` | string | The H2 heading |
| `brief.outline[].points` | array of strings | Talking points for the section |
| `brief.questions` | array of strings | Questions the article must answer |
| `brief.entities` | array of strings | Entities and terms to mention |

The `content` text is Markdown: the title as `#`, then `## Outline` with each section as a `###` heading and its points as bullets, then `## Questions to answer` and `## Entities to mention` as bulleted lists.

### generate_content_brief example

```json title="tools/call params"
{
  "name": "generate_content_brief",
  "arguments": { "keyword": "project management software for agencies" }
}
```

A real result, shortened to two sections, three questions and four entities:

```json title="structuredContent"
{
  "brief": {
    "title": "Best Project Management Software for Agencies in 2026",
    "outline": [
      {
        "heading": "Why Agencies Need Specialized Project Management Software",
        "points": [
          "Agencies face unique challenges like client-facing workflows, multi-project resource balancing, and rapid scope changes",
          "Generic tools lack built-in agency-specific features such as time-based billing, creative asset handoffs, and white-label reporting"
        ]
      },
      {
        "heading": "Key Features That Separate Agency-Grade Tools from General PM Software",
        "points": [
          "White-label client dashboards with branded UI and controlled access tiers",
          "Automated time-to-invoice pipelines with retainer consumption alerts"
        ]
      }
    ],
    "questions": [
      "How does agency-specific PM software differ from tools like Trello or Jira?",
      "Which tools support white-label client portals and branded reporting?",
      "How do agencies evaluate security and compliance when selecting PM software?"
    ],
    "entities": ["ClickUp", "Wrike", "Asana", "Teamwork.com"]
  }
}
```

The full result had seven sections, eight questions and twelve entities. It also listed a product plan name that the vendor may not use, which is why every brief needs a fact check before writing.

### Prompts that trigger generate_content_brief

- "Use Rankbox to build a content brief for “best CRM for startups”."
- "Get a Rankbox content brief for “kanban vs scrum” and scaffold the article page from its outline."
- "When a keyword is added to the sheet, create a Rankbox content brief and post it to the team."

## write_meta_descriptions

Writes up to three meta descriptions for a web page from its topic or a short summary of its content.

| Property | Value |
| --- | --- |
| Name | `write_meta_descriptions` |
| Title | Write meta descriptions |
| Description | Generate 3 compelling, click-worthy SEO meta descriptions (120-160 characters each) for a web page, given a topic or short page summary. |
| Time on a test call | About 4 seconds |

### write_meta_descriptions input

| Parameter | Type | Required | Limits | Description |
| --- | --- | --- | --- | --- |
| `topic` | string | Yes | 2 to 600 characters after trimming | The page topic or a short summary of its content |

```json title="Input schema"
{
  "type": "object",
  "properties": {
    "topic": {
      "type": "string",
      "minLength": 2,
      "maxLength": 600,
      "description": "The page topic or a short summary of its content."
    }
  },
  "required": ["topic"],
  "additionalProperties": false
}
```

A short summary of what the page says gives better results than a bare topic, because the descriptions can only promise what you describe.

### write_meta_descriptions output

The model is asked for three descriptions of 120 to 160 characters each, in active voice, with a clear value or call to action. Rankbox keeps at most three options and drops any shorter than 40 characters. It doesn't trim or reject options longer than 160 characters, so measure them before you paste.

| Field | Type | Description |
| --- | --- | --- |
| `options` | array of strings | One to three meta descriptions |

The `content` text is a numbered list: `1. …`, `2. …`, `3. …`.

### write_meta_descriptions example

```json title="tools/call params"
{
  "name": "write_meta_descriptions",
  "arguments": {
    "topic": "A guide to choosing project management software for a 10-person agency"
  }
}
```

```json title="structuredContent"
{
  "options": [
    "Cut through the noise: Discover the 5 must-have features for project management software that scales perfectly for your 10-person agency—start evaluating today.",
    "Stop wasting time on clunky tools. Get our free checklist to compare top PM software side-by-side—and pick the one that boosts your agency’s productivity in <1 hour.",
    "Find the right project management software for your 10-person agency in under 30 minutes. We break down pricing, integrations, and ease-of-use—so you choose with confidence."
  ]
}
```

This real result has options of 160, 165 and 173 characters, and the second promises a free checklist the page didn't mention. Edit length and claims to match your page.

### Prompts that trigger write_meta_descriptions

- "Write three meta descriptions for our pricing page."
- "Use Rankbox to write meta descriptions for the pricing page, then add them to its metadata."
- "For each URL in the list, write a meta description with Rankbox."

## Errors from the Rankbox MCP tools

A tool error comes back as a normal `tools/call` result with `isError: true` and one text block that says what went wrong. Agents should read `isError` before using `structuredContent`, which is absent on errors.

| Text in the result | Cause | What to do |
| --- | --- | --- |
| `MCP error -32602: Input validation error: Invalid arguments for tool <name>` | The argument is missing, not a string, shorter than 2 characters or over the maximum | Send the one required argument within its limits |
| `MCP error -32602: Tool <name> not found` | The tool name is misspelled | Use `generate_ai_questions`, `generate_content_brief` or `write_meta_descriptions` |
| `tool execution failed` | The AI model returned nothing usable: no question groups, no outline sections or no meta descriptions | Retry, or rephrase the topic or keyword |

A validation error includes the details, for example a `too_small` code with `"minimum": 2` and the path `["topic"]`. The server doesn't pass on the underlying reason for `tool execution failed`; a retry usually succeeds.

```json title="A validation error result"
{
  "result": {
    "content": [
      {
        "type": "text",
        "text": "MCP error -32602: Input validation error: Invalid arguments for tool generate_ai_questions: [\n  {\n    \"code\": \"too_small\",\n    \"minimum\": 2,\n    \"type\": \"string\",\n    \"inclusive\": true,\n    \"exact\": false,\n    \"message\": \"String must contain at least 2 character(s)\",\n    \"path\": [\n      \"topic\"\n    ]\n  }\n]"
      }
    ],
    "isError": true
  },
  "jsonrpc": "2.0",
  "id": 3
}
```

Transport-level errors, such as a missing `Accept` header or invalid JSON, return an HTTP error status instead. They are listed in [The Rankbox MCP server](/docs/ai-tools/mcp-server#errors-from-the-rankbox-mcp-server).

## Rate limits for the Rankbox MCP tools

Rankbox applies no per-client quota or rate limit to the MCP tools. Each call still runs a live model call that takes several seconds, so:

- Set a tool timeout of at least 60 seconds.
- Run batches one call at a time rather than in parallel.
- Cache results you want to reuse; calling again gives different output, not the same answer faster.

The website's free AI tools are a separate service with their own limit of 6 runs a minute per IP address. See [Free SEO and AI search tools](/docs/growth/free-tools).

## Related

- [The Rankbox MCP server](/docs/ai-tools/mcp-server) — transport, access, testing with curl and privacy
- [Connect your AI tools](/docs/ai-tools/connect-ai-tools) — setup in Claude, ChatGPT, Cursor and more
- [Free SEO and AI search tools](/docs/growth/free-tools) — the same kinds of research on the website
- [Research: the questions buyers ask AI](/docs/content/research) — how Rankbox researches for your own site
