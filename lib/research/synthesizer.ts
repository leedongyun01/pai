import { google } from "@ai-sdk/google";
import { generateObject } from "ai";
import { ReportSchema, ConflictSchema } from "./schemas";
import { Report, Conflict } from "./types";
import { getSession, saveSession } from "../storage/session-store";
import { SYNTHESIS_SYSTEM_PROMPT, getSynthesisUserPrompt, CONFLICT_DETECTION_PROMPT } from "./prompts";
import { ResearchSession as SessionStoreType } from "../types/session";
import { z } from "zod";

export class Synthesizer {
  private model = google("gemini-1.5-pro");

  /**
   * Orchestrates the synthesis process for a given session
   */
  async synthesize(sessionId: string): Promise<Report> {
    const session = await getSession(sessionId);

    if (!session) {
      throw new Error(`Session ${sessionId} not found`);
    }

    if (!session.results || session.results.length === 0) {
      throw new Error("No research results found for synthesis");
    }

    const sourcesForPrompt = session.results.map((r, i) => ({
      id: r.id || `source_${i}`,
      content: r.content,
      title: r.title,
    }));

    let detectedConflicts: Conflict[] = [];

    // T019: Implement "Deep Probe" two-pass logic
    if (session.mode === "deep_probe") {
      console.log(`Performing Deep Probe synthesis for session ${sessionId}...`);
      
      // Pass 1: Conflict Detection
      const { object: conflictResults } = await generateObject({
        model: this.model,
        schema: z.object({ conflicts: z.array(ConflictSchema) }),
        system: CONFLICT_DETECTION_PROMPT,
        prompt: getSynthesisUserPrompt(session.query, sourcesForPrompt),
      });
      
      detectedConflicts = conflictResults.conflicts;
      console.log(`Detected ${detectedConflicts.length} conflicts.`);
    }

    // T009: Quick Scan or Phase 2 of Deep Probe
    const synthesisPrompt = session.mode === "deep_probe" 
      ? `${getSynthesisUserPrompt(session.query, sourcesForPrompt)}\n\nInclude the following detected conflicts in the report:\n${JSON.stringify(detectedConflicts)}`
      : getSynthesisUserPrompt(session.query, sourcesForPrompt);

    /*
    const { object: report } = await generateObject({
      model: this.model,
      schema: ReportSchema,
      system: SYNTHESIS_SYSTEM_PROMPT,
      prompt: synthesisPrompt,
    });
    */

    const report: Report = {
      id: crypto.randomUUID(),
      sessionId: session.id,
      title: `Research Report: ${session.query}`,
      summary: "Gemini is temporarily disabled. This is a mock report summary.",
      sections: [
        {
          title: "Introduction",
          content: "This is a placeholder section because Gemini is disabled.",
          citations: [],
          subsections: [],
        },
      ],
      references: session.results.map((r, i) => ({
        ...r,
        id: r.id || `source_${i}`,
      })) as any,
      metadata: {
        generatedAt: new Date().toISOString(),
        model: "mock-model",
      },
    };

    // Save report back to session
    const updatedSession: SessionStoreType = {
      ...session,
      report: report as any,
      status: "completed",
      updatedAt: new Date().toISOString(),
    };

    await saveSession(updatedSession);

    // T017: Add citation validity check
    this.validateCitations(report);

    return report as Report;
  }

  /**
   * Validates that all citations in the report point to existing references
   */
  private validateCitations(report: Report): void {
    const validSourceIds = new Set(report.references.map((r) => (r as any).id));

    const checkSection = (section: any) => {
      for (const citationId of section.citations) {
        if (!validSourceIds.has(citationId)) {
          console.warn(`Invalid citation found: ${citationId} in section "${section.title}"`);
          // In a strict mode, we might want to throw or remove the invalid citation
        }
      }
      for (const sub of section.subsections) {
        checkSection(sub);
      }
    };

    for (const section of report.sections) {
      checkSection(section);
    }
  }
}
