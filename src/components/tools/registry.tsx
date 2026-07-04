import type { ComponentType } from "react";
import { LlmsTxtGenerator } from "./LlmsTxtGenerator";
import { RobotsTxtGenerator } from "./RobotsTxtGenerator";
import { SchemaGenerator } from "./SchemaGenerator";
import { SnippetPreview } from "./SnippetPreview";
import { AiQuestionGenerator } from "./AiQuestionGenerator";
import { ContentBriefGenerator } from "./ContentBriefGenerator";
import { MetaWriter } from "./MetaWriter";
import { PersonalAiVisibility } from "./PersonalAiVisibility";

export const TOOL_COMPONENTS: Record<string, ComponentType> = {
  "llms-txt-generator": LlmsTxtGenerator,
  "ai-robots-txt-generator": RobotsTxtGenerator,
  "schema-generator": SchemaGenerator,
  "serp-snippet-preview": SnippetPreview,
  "ai-question-generator": AiQuestionGenerator,
  "content-brief-generator": ContentBriefGenerator,
  "meta-description-writer": MetaWriter,
  "get-recommended-by-chatgpt": PersonalAiVisibility,
};