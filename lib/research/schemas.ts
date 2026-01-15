import { z } from "zod";
import { ResearchResultSchema } from "./types";

/**
 * Represents a conflict in research data where sources disagree
 */
export const ConflictSchema = z.object({
  topic: z.string(),
  description: z.string(),
  competingClaims: z.array(
    z.object({
      claim: z.string(),
      sourceIds: z.array(z.string()),
    })
  ),
});

/**
 * A section of the generated report, supporting recursive subsections
 */
export const ReportSectionSchema: z.ZodType<any> = z.lazy(() =>
  z.object({
    title: z.string(),
    content: z.string(),
    citations: z.array(z.string()),
    subsections: z.array(ReportSectionSchema),
    conflicts: z.array(ConflictSchema).optional(),
  })
);

/**
 * Final synthesized report
 */
export const ReportSchema = z.object({
  id: z.string(),
  sessionId: z.string().uuid(),
  title: z.string(),
  sections: z.array(ReportSectionSchema),
  references: z.array(ResearchResultSchema),
  metadata: z.object({
    generatedAt: z.string().datetime(),
    model: z.string(),
    tokenUsage: z.number().optional(),
  }),
});

export type Conflict = z.infer<typeof ConflictSchema>;
export type ReportSection = z.infer<typeof ReportSectionSchema>;
export type Report = z.infer<typeof ReportSchema>;

/**
 * Maps a specific visual element or data point to its source
 */
export const CitationMapSchema = z.object({
  label: z.string(),
  sourceId: z.string(),
  index: z.number(),
});

/**
 * Represents a single generated visualization (chart or table)
 */
export const VisualizationObjectSchema = z.object({
  id: z.string().uuid(),
  type: z.enum(["mermaid", "table"]),
  chartType: z.string().optional(),
  rawData: z.any(),
  code: z.string(),
  citations: z.array(CitationMapSchema),
  caption: z.string(),
  confidence: z.number().min(0).max(1),
  anchorMarker: z.string().optional(),
});

export type CitationMap = z.infer<typeof CitationMapSchema>;
export type VisualizationObject = z.infer<typeof VisualizationObjectSchema>;
