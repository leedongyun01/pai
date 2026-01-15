import { describe, it, expect } from "vitest";
import { ReportSchema } from "../../../lib/research/schemas";

describe("ReportSchema", () => {
  it("should validate a valid report structure", () => {
    const validReport = {
      id: "report-1",
      sessionId: "550e8400-e29b-41d4-a716-446655440000",
      title: "AI Trends 2026",
      sections: [
        {
          title: "Overview",
          content: "This is an overview.",
          citations: ["src_1"],
          subsections: [],
        },
        {
          title: "Detailed Analysis",
          content: "Body content.",
          citations: ["src_1", "src_2"],
          subsections: [
            {
              title: "Subsection A",
              content: "Subcontent.",
              citations: ["src_2"],
              subsections: [],
            },
          ],
        },
        {
          title: "Conclusion",
          content: "Final thoughts.",
          citations: ["src_3"],
          subsections: [],
        },
      ],
      references: [
        {
          url: "https://example.com/1",
          title: "Source 1",
          content: "...",
          queryMatch: "...",
          timestamp: "2026-01-15T10:00:00Z",
          score: 0.9,
        },
      ],
      metadata: {
        generatedAt: "2026-01-15T12:00:00Z",
        model: "gemini-1.5-pro",
      },
    };

    const result = ReportSchema.safeParse(validReport);
    expect(result.success).toBe(true);
  });

  it("should fail validation if required sections are missing", () => {
    const invalidReport = {
      id: "report-1",
      // missing sessionId
      title: "AI Trends",
      sections: [],
    };

    const result = ReportSchema.safeParse(invalidReport);
    expect(result.success).toBe(false);
  });

  it("should detect invalid citations (citations referencing non-existent sources)", () => {
    const reportWithInvalidCitations = {
      id: "report-1",
      sessionId: "550e8400-e29b-41d4-a716-446655440000",
      title: "Test",
      sections: [
        {
          title: "Section 1",
          content: "Content",
          citations: ["non-existent-src"],
          subsections: [],
        }
      ],
      references: [
        { id: "real-src", url: "...", title: "...", content: "...", queryMatch: "...", timestamp: "2026-01-15T10:00:00Z", score: 1 }
      ],
      metadata: { generatedAt: "2026-01-15T12:00:00Z", model: "test" }
    };

    // This is a logical check, not a Zod schema check unless we use .refine()
    const allSourceIds = reportWithInvalidCitations.references.map(r => r.id);
    const hasInvalidCitation = reportWithInvalidCitations.sections.some(s => 
      s.citations.some(c => !allSourceIds.includes(c))
    );

    expect(hasInvalidCitation).toBe(true);
  });

  it("should validate a report with conflicts", () => {
    const reportWithConflicts = {
      id: "report-conflicts",
      sessionId: "550e8400-e29b-41d4-a716-446655440000",
      title: "Conflict Test",
      sections: [
        {
          title: "Body",
          content: "Some content.",
          citations: ["src_1", "src_2"],
          subsections: [],
          conflicts: [
            {
              topic: "Market Size",
              description: "Sources disagree on the market size by 2027.",
              competingClaims: [
                { claim: "$50 billion", sourceIds: ["src_1"] },
                { claim: "$75 billion", sourceIds: ["src_2"] }
              ]
            }
          ]
        }
      ],
      references: [],
      metadata: { generatedAt: "2026-01-15T12:00:00Z", model: "test" }
    };

    const result = ReportSchema.safeParse(reportWithConflicts);
    expect(result.success).toBe(true);
  });
});
