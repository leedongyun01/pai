import { google } from '@ai-sdk/google';
import { generateObject } from 'ai';
import { AnalysisSchema, AnalysisResult } from './schemas';
import { AI_MODELS, isMockMode } from '../utils/ai';

const SYSTEM_PROMPT = `
You are the "Analyzer" agent for ProbeAI. 
Your task is to analyze the user's research query and determine the appropriate research mode.

Modes:
- quick_scan: Use for simple, direct questions or topics that require a high-level overview.
- deep_probe: Use for complex, multi-faceted questions, technical deep-dives, or topics requiring extensive investigation.

Provide a brief rationale for your choice.
`;

export async function analyzeQuery(query: string): Promise<AnalysisResult> {
  if (isMockMode()) {
    return {
      mode: 'quick_scan',
      rationale: 'Mock mode enabled. Defaulting to quick_scan.',
    };
  }

  try {
    const { object } = await generateObject({
      model: google(AI_MODELS.FLASH),
      schema: AnalysisSchema,
      prompt: query,
      system: SYSTEM_PROMPT,
      // T020: Set a short timeout for analysis to fail fast
      abortSignal: AbortSignal.timeout(5000),
    });

    return object;
  } catch (error) {
    // FR-MODE: Fail silently and default to quick_scan to avoid blocking the user
    console.warn('Gemini Analysis failed (falling back to quick_scan):', (error as Error).message);
    return {
      mode: 'quick_scan',
      rationale: 'Analysis unavailable. Defaulting to Fast Search (quick_scan) for reliability.',
    };
  }
}
