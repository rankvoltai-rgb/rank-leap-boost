/**
 * The roster planner's arithmetic, kept apart from the component so the page
 * test can check it. It runs only on the visitor's own inputs (clients, a
 * pace each, minutes of editing per article) and on the plan's allowance from
 * facts.ts. No prices: what a roster costs is /white-label/pricing's job.
 */
import { PLAN } from "@/sublanding/_shared/facts";

/**
 * Articles a month at a pace of `perWeek`, the way Settings → Autopilot
 * reports it ("About N articles a month"): round(pace × 52 ÷ 12).
 */
export function monthlyAt(perWeek: number): number {
  return Math.round((perWeek * 52) / 12);
}

/** What one site can take in a month at that pace: never past its allowance. */
export function siteMonth(perWeek: number, cap: number = PLAN.articlesPerMonth): number {
  return Math.min(monthlyAt(perWeek), cap);
}

/** Whether the pace asks for more than the site's allowance. */
export function isCapped(perWeek: number, cap: number = PLAN.articlesPerMonth): boolean {
  return monthlyAt(perWeek) > cap;
}

export interface RosterRow {
  id: string;
  name: string;
  /** Articles a week, one of PACE_OPTIONS. */
  pace: number;
}

export interface RosterTotals {
  sites: number;
  articles: number;
  /** Editing time in minutes, or null while the minutes input is invalid. */
  minutes: number | null;
  /** The same in hours, to one decimal place. */
  hours: number | null;
}

/**
 * Parse the minutes field: whole minutes from 1 to 600, or null for anything
 * else (empty, zero, negative, fractional, text).
 */
export function parseMinutes(raw: string): number | null {
  const trimmed = raw.trim();
  if (!/^\d{1,3}$/.test(trimmed)) return null;
  const n = Number(trimmed);
  return n >= 1 && n <= 600 ? n : null;
}

export function rosterTotals(rows: RosterRow[], minutesPerArticle: number | null): RosterTotals {
  const articles = rows.reduce((sum, r) => sum + siteMonth(r.pace), 0);
  const minutes = minutesPerArticle === null ? null : articles * minutesPerArticle;
  return {
    sites: rows.length,
    articles,
    minutes,
    hours: minutes === null ? null : Math.round((minutes / 60) * 10) / 10,
  };
}

/** 22 → "22", 22.5 → "22.5", 1234 → "1,234". */
export function formatHours(hours: number): string {
  return hours.toLocaleString("en-US", { maximumFractionDigits: 1 });
}
