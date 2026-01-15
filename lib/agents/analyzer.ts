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
  /*
  const { object } = await generateObject({
    model: google('gemini-2.5-flash'),
    schema: AnalysisSchema,
    prompt: query,
    system: SYSTEM_PROMPT,
  });

  return object;
  */
  return {
    mode: 'quick_scan',
    rationale: 'Gemini is temporarily disabled. Defaulting to quick_scan.',
  };
}
