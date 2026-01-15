import { google } from '@ai-sdk/google';
import { generateObject } from 'ai';
import { ResearchPlanSchema, ResearchPlanResult } from './schemas';
import { ResearchMode } from '../types/session';

const SYSTEM_PROMPT = `
You are the "Planner" agent for ProbeAI.
Your task is to generate a structured research plan based on the user's query and the selected research mode.

Modes:
- quick_scan: Generate 2-3 simple steps to get a quick answer.
- deep_probe: Generate 5-7 detailed steps for a thorough investigation, including search queries and analysis tasks.

Each step MUST be verifiable. Include instructions on what to look for to verify the information.

Plan Format:
- rationale: Why this plan was chosen.
- steps: A list of steps, each with an id, type (search or analyze), and description.
`;

export async function generatePlan(query: string, mode: ResearchMode): Promise<ResearchPlanResult> {
  /*
  const { object } = await generateObject({
    model: google('gemini-2.5-flash'),
    schema: ResearchPlanSchema,
    prompt: `Query: ${query}\nMode: ${mode}`,
    system: SYSTEM_PROMPT,
  });

  return object;
  */
  return {
    rationale: 'Gemini is temporarily disabled. Providing a default plan.',
    steps: [
      { id: '1', type: 'search', description: `Search for information about: ${query}` },
      { id: '2', type: 'analyze', description: 'Analyze the search results.' },
    ],
  };
}
