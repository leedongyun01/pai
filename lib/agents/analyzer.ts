import { google } from '@ai-sdk/google';
import { generateObject } from 'ai';
import { AnalysisSchema, AnalysisResult } from './schemas';

const SYSTEM_PROMPT = `
You are the "Analyzer" agent for ProbeAI. 
Your task is to analyze the user's research query and determine the appropriate research mode.

Modes:
- quick_scan: Use for simple, direct questions or topics that require a high-level overview.
- deep_probe: Use for complex, multi-faceted questions, technical deep-dives, or topics requiring extensive investigation.

Provide a brief rationale for your choice.
`;

export async function analyzeQuery(query: string): Promise<AnalysisResult> {
  try {
    const { object } = await generateObject({
      model: google('gemini-1.5-flash-latest'),
      schema: AnalysisSchema,
      prompt: query,
      system: SYSTEM_PROMPT,
    });

    return object;
  } catch (error) {
    console.warn('Failed to analyze with Gemini, using fallback:', error);
    return {
      mode: 'quick_scan',
      rationale: 'Gemini is temporarily unavailable. Defaulting to quick_scan.',
    };
  }
}
