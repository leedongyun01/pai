import { z } from 'zod';

export const SourceCitationSchema = z.object({
  id: z.string(),
  url: z.string().url(),
  title: z.string(),
  snippet: z.string(),
  accessDate: z.string(),
});

export type SourceCitation = z.infer<typeof SourceCitationSchema>;

export const SearchResultSchema = z.object({
  title: z.string(),
  url: z.string(),
  content: z.string(),
  rawContent: z.string().optional(),
  score: z.number().optional(),
});

export type SearchResult = z.infer<typeof SearchResultSchema>;

export const ResearchStateSchema = z.object({
  messages: z.array(z.any()), // BaseMessage objects
  summary: z.string().optional(),
  plan: z.array(z.string()).optional(),
  currentStep: z.number().optional(),
  results: z.array(SearchResultSchema).optional(), // Raw search results
  report: z.string().optional(),
  citations: z.array(SourceCitationSchema).optional(),
});

export type ResearchState = z.infer<typeof ResearchStateSchema>;

export const ResearchSessionSchema = z.object({
  id: z.string().uuid(),
  userId: z.string(),
  query: z.string().min(5).max(500),
  mode: z.enum(['quick_scan', 'deep_probe']),
  status: z.enum(['idle', 'analyzing', 'searching', 'synthesizing', 'completed', 'failed']),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type ResearchSession = z.infer<typeof ResearchSessionSchema>;
