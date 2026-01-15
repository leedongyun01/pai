import { z } from "zod";

/**
 * Operational modes for the Research Engine
 */
export type ResearchMode = "quick_scan" | "deep_probe";

/**
 * Status of a specific search query
 */
export const SearchQueryStatusSchema = z.enum([
  "queued",
  "searching",
  "scraped",
  "failed",
]);
export type SearchQueryStatus = z.infer<typeof SearchQueryStatusSchema>;

/**
 * Individual search query entity
 */
export const SearchQuerySchema = z.object({
  text: z.string().min(3).max(500),
  status: SearchQueryStatusSchema.default("queued"),
  sourceCount: z.number().default(0),
});
export type SearchQuery = z.infer<typeof SearchQuerySchema>;

/**
 * Individual research result (scraped document)
 */
export const ResearchResultSchema = z.object({
  url: z.string().url(),
  title: z.string(),
  content: z.string().max(20000),
  queryMatch: z.string(),
  timestamp: z.string().datetime(),
  score: z.number(),
});
export type ResearchResult = z.infer<typeof ResearchResultSchema>;

/**
 * Research Session state
 */
export const ResearchSessionStatusSchema = z.enum([
  "pending",
  "running",
  "completed",
  "failed",
]);
export type ResearchSessionStatus = z.infer<typeof ResearchSessionStatusSchema>;

export const ResearchSessionSchema = z.object({
  id: z.string().uuid(),
  mode: z.enum(["quick_scan", "deep_probe"]).default("quick_scan"),
  queries: z.array(SearchQuerySchema).default([]),
  results: z.array(ResearchResultSchema).default([]),
  status: ResearchSessionStatusSchema.default("pending"),
  error: z.string().optional(),
});
export type ResearchSession = z.infer<typeof ResearchSessionSchema>;

export type { Conflict, ReportSection, Report } from "./schemas";
