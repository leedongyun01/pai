import { describe, it, expect, vi, beforeEach } from "vitest";
import { Visualizer } from "@/lib/research/visualizer";
import * as ai from "ai";

vi.mock("ai", () => ({
  generateObject: vi.fn(),
}));

describe("Visualization Integration Flow", () => {
  let visualizer: Visualizer;

  beforeEach(() => {
    process.env.GOOGLE_GENERATIVE_AI_API_KEY = 'test-key';
    visualizer = new Visualizer();
    vi.clearAllMocks();
  });

  afterEach(() => {
    delete process.env.GOOGLE_GENERATIVE_AI_API_KEY;
  });

  it("should handle a full flow from text to multiple visualizations", async () => {
    const complexText = `
      The market grew steadily over the last three years. 
      In 2021, the revenue was $10M. In 2022, it reached $15M. 
      By 2023, it was $22M.
      
      The process for onboarding is: 
      1. Sign up.
      2. Verify email.
      3. Complete profile.
      This text is long enough to pass the length check that we implemented in the visualizer class to avoid processing very short snippets.
    `;

    (ai.generateObject as any).mockResolvedValue({
      object: {
        visualizations: [
          {
            type: "mermaid",
            chartType: "bar",
            rawData: [{ year: 2021, value: 10 }, { year: 2022, value: 15 }, { year: 2023, value: 22 }],
            code: "graph TD; 2021-->2022-->2023",
            citations: [],
            caption: "Revenue Growth",
            confidence: 0.95,
          },
          {
            type: "mermaid",
            chartType: "flowchart",
            rawData: ["Sign up", "Verify email", "Complete profile"],
            code: "graph LR; A[Sign up]-->B[Verify email]-->C[Complete profile]",
            citations: [],
            caption: "Onboarding Flow",
            confidence: 0.9,
          }
        ]
      }
    });

    const results = await visualizer.process(complexText);

    expect(results).toHaveLength(2);
    expect(results[0].type).toBe("mermaid");
    expect(results[1].type).toBe("mermaid");
    expect(results[0].caption).toBe("Revenue Growth");
    expect(results[1].caption).toBe("Onboarding Flow");
  });

  it("should trigger fallback when mermaid code is invalid", async () => {
    const text = "Some data that results in invalid mermaid code. This text is also long enough to pass the length check and trigger the AI generation logic as expected by our implementation.";

    (ai.generateObject as any).mockResolvedValue({
      object: {
        visualizations: [
          {
            type: "mermaid",
            chartType: "bar",
            rawData: [{ category: "A", value: 10 }],
            code: "INVALID MERMAID CODE",
            citations: [],
            caption: "Failed Chart",
            confidence: 0.9,
          }
        ]
      }
    });

    const results = await visualizer.process(text);

    expect(results).toHaveLength(1);
    expect(results[0].type).toBe("table"); // Fallback to table
    expect(results[0].code).toContain("| category | value |");
  });

  it("should enforce the limit of 3 visualizations per process call", async () => {
    const longText = "This is a very long text that describes many different things that could be visualized. For example, market trends, user flows, comparison of different products, and more. We want to ensure that we don't overwhelm the user with too many charts in a single section.";

    (ai.generateObject as any).mockResolvedValue({
      object: {
        visualizations: [
          { type: "mermaid", code: "graph TD; A", confidence: 0.9, rawData: {}, caption: "C1" },
          { type: "mermaid", code: "graph TD; B", confidence: 0.9, rawData: {}, caption: "C2" },
          { type: "mermaid", code: "graph TD; C", confidence: 0.9, rawData: {}, caption: "C3" },
          { type: "mermaid", code: "graph TD; D", confidence: 0.9, rawData: {}, caption: "C4" },
        ]
      }
    });

    const results = await visualizer.process(longText);
    expect(results).toHaveLength(3);
  });
});
