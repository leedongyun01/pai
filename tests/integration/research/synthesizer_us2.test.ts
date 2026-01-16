import { describe, it, expect, vi, beforeEach } from "vitest";
import { Synthesizer } from "../../../lib/research/synthesizer";
import { saveSession, deleteSession } from "../../../lib/storage/session-store";
import { ResearchSession } from "../../../lib/types/session";

// Mock the AI SDK
vi.mock("ai", () => ({
  generateObject: vi.fn().mockResolvedValue({
    object: {
      title: "Citation Test Report",
      sections: [
        { 
          title: "Section with Citations", 
          content: "Claim supported by source 0.", 
          citations: ["source_0"], 
          subsections: [] 
        },
      ],
    },
  }),
}));

describe("Synthesizer US2 Integration", () => {
  const sessionId = "test-session-us2";

  beforeEach(async () => {
    await deleteSession(sessionId);
  });

  it("should ensure every citation references a valid source in the bibliography", async () => {
    const mockSession: ResearchSession = {
      id: sessionId,
      query: "test query",
      mode: "quick_scan",
      status: "completed",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      results: [
        {
          id: "source_0",
          url: "https://example.com/0",
          title: "Source 0",
          content: "Content 0",
          queryMatch: "test",
          timestamp: new Date().toISOString(),
          score: 0.9,
        }
      ],
    };

    await saveSession(mockSession);

    const synthesizer = new Synthesizer();
    const report = await synthesizer.synthesize(sessionId);

    // Bibliography (references) should contain source_0
    const sourceIds = report.references.map(r => (r as any).id);
    expect(sourceIds).toContain("source_0");

    // Section citation should be source_0
    expect(report.sections[0].citations).toContain("source_0");
  });
});
