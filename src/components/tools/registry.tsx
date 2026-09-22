import type { ComponentType } from "react";
import { AiCrawlerLogAnalyzer } from "./AiCrawlerLogAnalyzer";
import { AiFaqGenerator } from "./AiFaqGenerator";
import { AiQuestionGenerator } from "./AiQuestionGenerator";
import { AiSearchReadinessCheck } from "./AiSearchReadinessCheck";
import { AiVisibilityPromptKit } from "./AiVisibilityPromptKit";
import { BlogTitleGenerator } from "./BlogTitleGenerator";
import { CitationReadinessChecker } from "./CitationReadinessChecker";
import { ContentBriefGenerator } from "./ContentBriefGenerator";
import { HeadingStructureChecker } from "./HeadingStructureChecker";
import { HreflangGenerator } from "./HreflangGenerator";
import { KeywordDensityChecker } from "./KeywordDensityChecker";
import { LlmsTxtGenerator } from "./LlmsTxtGenerator";
import { MetaWriter } from "./MetaWriter";
import { OpenGraphGenerator } from "./OpenGraphGenerator";
import { PersonalAiVisibility } from "./PersonalAiVisibility";
import { RedirectGenerator } from "./RedirectGenerator";
import { RobotsTxtGenerator } from "./RobotsTxtGenerator";
import { RobotsTxtTester } from "./RobotsTxtTester";
import { SchemaGenerator } from "./SchemaGenerator";
import { SitemapGenerator } from "./SitemapGenerator";
import { SnippetPreview } from "./SnippetPreview";
import { UrlSlugGenerator } from "./UrlSlugGenerator";
import { UtmLinkBuilder } from "./UtmLinkBuilder";

/** Slug → the interactive part of the tool page. Copy lives in src/data/tools.ts. */
export const TOOL_COMPONENTS: Record<string, ComponentType> = {
  // AI crawlers
  "llms-txt-generator": LlmsTxtGenerator,
  "ai-robots-txt-generator": RobotsTxtGenerator,
  "robots-txt-tester": RobotsTxtTester,
  "ai-crawler-log-analyzer": AiCrawlerLogAnalyzer,
  "ai-search-readiness-check": AiSearchReadinessCheck,
  // Schema & tags
  "schema-generator": SchemaGenerator,
  "open-graph-generator": OpenGraphGenerator,
  "hreflang-generator": HreflangGenerator,
  "sitemap-generator": SitemapGenerator,
  // Content & on-page
  "serp-snippet-preview": SnippetPreview,
  "ai-citation-readiness-checker": CitationReadinessChecker,
  "keyword-density-checker": KeywordDensityChecker,
  "heading-structure-checker": HeadingStructureChecker,
  "url-slug-generator": UrlSlugGenerator,
  "meta-description-writer": MetaWriter,
  "content-brief-generator": ContentBriefGenerator,
  "ai-question-generator": AiQuestionGenerator,
  "ai-faq-generator": AiFaqGenerator,
  "blog-title-generator": BlogTitleGenerator,
  // URLs & links
  "redirect-generator": RedirectGenerator,
  "utm-link-builder": UtmLinkBuilder,
  // AI visibility
  "get-recommended-by-chatgpt": PersonalAiVisibility,
  "ai-visibility-prompt-generator": AiVisibilityPromptKit,
};
