import { IVisualizer, VisualizationObject } from "./types";
import { v4 as uuidv4 } from "uuid";
import { google } from "@ai-sdk/google";
import { generateObject } from "ai";
import { VisualizationObjectSchema } from "./schemas";
import { VISUALIZATION_SYSTEM_PROMPT, getVisualizationUserPrompt } from "./prompts";
import { z } from "zod";

import { AI_MODELS, isMockMode } from "../utils/ai";

export class Visualizer implements IVisualizer {
  private model = google(AI_MODELS.PRO);

  /**
   * Processes text to detect patterns and generate visualizations.
   */
  async process(text: string): Promise<VisualizationObject[]> {
    if (isMockMode() || !text || text.trim().length < 50) return [];

    try {
      const { object } = await generateObject({
        model: this.model,
        schema: z.object({
          visualizations: z.array(VisualizationObjectSchema.omit({ id: true })),
        }),
        system: VISUALIZATION_SYSTEM_PROMPT,
        prompt: getVisualizationUserPrompt(text),
      });

      // Assign IDs, apply gates, and handle fallbacks
      return object.visualizations
        .filter((v) => {
          console.log(`[Visualizer] Pattern: ${v.type}, Confidence: ${v.confidence}`);
          return true; // Proceed regardless of confidence as requested by user
        }) // Confidence Gate (FR-010) bypassed
        .map((v) => {
          let type = v.type;
          let code = v.code;

          // Complexity Gate (FR-008): Force Table if data points > 20
          const dataPoints = Array.isArray(v.rawData)
            ? v.rawData.length
            : Object.keys(v.rawData || {}).length;

          if (dataPoints > 20 && type === "mermaid") {
            type = "table";
            code = this.convertToTable(v.rawData, v.caption);
          }

          // Syntax Gate (FR-005): Fallback to table if Mermaid validation fails
          if (type === "mermaid" && !this.validate(code, "mermaid")) {
            type = "table";
            code = this.convertToTable(v.rawData, v.caption);
          }

          return {
            ...v,
            id: uuidv4(),
            type,
            code,
          };
        })
        .slice(0, 3) as VisualizationObject[]; // FR-006: Max 3 per section
    } catch (error) {
      console.error("Error generating visualizations:", error);
      return [];
    }
  }

  /**
   * Simple converter from raw data to Markdown table for fallback scenarios.
   */
  private convertToTable(data: any, caption: string): string {
    if (!data) return `| Error | \n|---| \n| No data available for ${caption} |`;

    if (Array.isArray(data)) {
      if (data.length === 0) return `| ${caption} | \n|---| \n| No data |`;
      
      const headers = Object.keys(data[0]);
      const headerRow = `| ${headers.join(" | ")} |`;
      const separatorRow = `| ${headers.map(() => "---").join(" | ")} |`;
      const bodyRows = data
        .map((row) => `| ${headers.map((h) => row[h]).join(" | ")} |`)
        .join("\n");

      return `${headerRow}\n${separatorRow}\n${bodyRows}`;
    }

    // Fallback for object-based data
    return `| Property | Value |\n|---|---|\n${Object.entries(data)
      .map(([k, v]) => `| ${k} | ${v} |`)
      .join("\n")}`;
  }

  /**
   * Validates the generated visualization code.
   * Adheres to FR-005 (Syntax Validation).
   */
  validate(code: string, type: "mermaid" | "table"): boolean {
    if (!code || code.trim().length === 0) return false;

    if (type === "table") {
      // Basic markdown table validation: check for header separator
      return /\|?\s*:?-+:?\s*\|/.test(code);
    }

    if (type === "mermaid") {
      // Basic mermaid validation: check for supported chart types
      const trimmedCode = code.trim();
      const supportedTypes = [
        "graph",
        "flowchart",
        "gantt",
        "pie",
        "sequenceDiagram",
        "journey",
      ];
      return supportedTypes.some((t) => trimmedCode.startsWith(t));
    }

    return false;
  }
}
