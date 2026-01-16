import { z } from 'zod';

export const AnalysisSchema = z.object({
  mode: z.enum(['quick_scan', 'deep_probe']),
  rationale: z.string(),
});

export const PlanStepSchema = z.object({
  id: z.string(),
  type: z.enum(['search', 'analyze']),
  description: z.string(),
  searchQueries: z.array(z.string()).optional(),
});

export const ResearchPlanSchema = z.object({
  rationale: z.string(),
  steps: z.array(PlanStepSchema),
});

export const UserFeedbackSchema = z.object({
  timestamp: z.string(),
  content: z.string(),
});

export const SessionSettingsSchema = z.object({
  autoPilot: z.boolean(),
});

export type AnalysisResult = z.infer<typeof AnalysisSchema>;
export type ResearchPlanResult = z.infer<typeof ResearchPlanSchema>;
export type UserFeedback = z.infer<typeof UserFeedbackSchema>;
export type SessionSettings = z.infer<typeof SessionSettingsSchema>;
