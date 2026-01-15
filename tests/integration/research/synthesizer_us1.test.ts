import { describe, it, expect, vi, beforeEach } from "vitest";
import { Synthesizer } from "../../../lib/research/synthesizer";
import { saveSession, getSession, deleteSession } from "../../../lib/storage/session-store";
import { ResearchSession } from "../../../lib/types/session";

import { generateObject } from "ai";

// Mock the AI SDK
vi.mock("ai", () => ({
  generateObject: vi.fn().mockImplementation(async ({ system }) => {
    if (system && system.includes("Identify any contradictions")) {
      return { object: { conflicts: [] } };
    }
    return {
      object: {
        title: "Synthesized Report",
        sections: [
          { title: "Overview", content: "Overview content", citations: ["source_0"], subsections: [] },
          { title: "Body", content: "Body content", citations: ["source_1"], subsections: [] },
          { title: "Conclusion", content: "Conclusion content", citations: [], subsections: [] },
        ],
      },
    };
  }),
}));

describe("Synthesizer US1 Integration", () => {
  const sessionId = "test-session-us1";

  beforeEach(async () => {
    await deleteSession(sessionId);
    vi.clearAllMocks();
  });

  it("should synthesize a report from research results", async () => {
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
        },
        {
          id: "source_1",
          url: "https://example.com/1",
          title: "Source 1",
          content: "Content 1",
          queryMatch: "test",
          timestamp: new Date().toISOString(),
          score: 0.8,
        },
      ],
    };

    await saveSession(mockSession);

    const synthesizer = new Synthesizer();
    const report = await synthesizer.synthesize(sessionId);

    expect(report).toBeDefined();
    expect(report.title).toBe("Synthesized Report");
    expect(report.sections).toHaveLength(3);
    
    // Verify session was updated
    const updatedSession = await getSession(sessionId);
    expect(updatedSession?.report).toBeDefined();
    expect(updatedSession?.status).toBe("completed");
  });

  it("should perform two-pass synthesis in deep_probe mode", async () => {
    const mockSession: ResearchSession = {
      id: "test-session-deep",
      query: "complex query",
      mode: "deep_probe",
      status: "completed",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      results: [
        { id: "s1", url: "url1", title: "T1", content: "C1", queryMatch: "q", timestamp: "now", score: 0.9 },
      ],
    };

    await saveSession(mockSession);

    const synthesizer = new Synthesizer();
    const report = await synthesizer.synthesize("test-session-deep");

    expect(report).toBeDefined();
    expect(vi.mocked(generateObject)).toHaveBeenCalledTimes(2); // Pass 1 (Conflicts) + Pass 2 (Synthesis)
  });
});
