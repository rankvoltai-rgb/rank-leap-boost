/**
 * The free marketing tools' AI calls and lead capture.
 *
 * Mock mode (VITE_MOCK_DATA=1) answers from templates in src/lib/mock/ai.ts;
 * otherwise the server functions call the AI provider and Supabase.
 */
import { IS_MOCK } from "@/lib/mock/mode";
import * as mock from "@/lib/mock/ai";
import * as real from "@/lib/tools.functions";
import { captureToolLead as realCaptureToolLead } from "@/lib/leads.functions";
import type { ContentBrief, PersonalAiPlan, QuestionGroup } from "@/lib/tools.functions";

export type { ContentBrief, PersonalAiPlan, QuestionGroup };

export function generateAiQuestions(data: { topic: string }): Promise<QuestionGroup[]> {
  return IS_MOCK ? mock.generateAiQuestions(data) : real.generateAiQuestions({ data });
}

export function generateContentBrief(data: { keyword: string }): Promise<ContentBrief> {
  return IS_MOCK ? mock.generateContentBrief(data) : real.generateContentBrief({ data });
}

export function writeMetaDescriptions(data: { topic: string }): Promise<string[]> {
  return IS_MOCK ? mock.writeMetaDescriptions(data) : real.writeMetaDescriptions({ data });
}

export function generatePersonalAiPlan(data: {
  name: string;
  role: string;
  current?: string;
}): Promise<PersonalAiPlan> {
  return IS_MOCK ? mock.generatePersonalAiPlan(data) : real.generatePersonalAiPlan({ data });
}

export function captureToolLead(data: {
  email: string;
  name?: string;
  role?: string;
  tool?: string;
}): Promise<{ ok: true }> {
  return IS_MOCK ? mock.captureToolLead(data) : realCaptureToolLead({ data });
}
