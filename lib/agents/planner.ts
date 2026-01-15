import { google } from '@ai-sdk/google';
import { generateObject } from 'ai';
import { ResearchPlanSchema, ResearchPlanResult, UserFeedback } from './schemas';
import { ResearchMode, ResearchPlan } from '../types/session';

const SYSTEM_PROMPT = `
You are the "Planner" agent for ProbeAI.
Your task is to generate a structured research plan based on the user's query and the selected research mode.

Modes:
- quick_scan: Generate 2-3 simple steps to get a quick answer.
- deep_probe: Generate 5-7 detailed steps for a thorough investigation, including search queries and analysis tasks.

Each step MUST be verifiable. Include instructions on what to look for to verify the information.

If providing feedback-driven regeneration:
- Review the PREVIOUS PLAN and the USER FEEDBACK.
- Adjust the plan to address the user's concerns or new directions.
- Explain in the rationale how the feedback was incorporated.

Plan Format:
- rationale: Why this plan was chosen.
- steps: A list of steps, each with an id, type (search or analyze), and description.
`;

export async function generatePlan(
  query: string, 
  mode: ResearchMode, 
  previousPlan?: ResearchPlan, 
  feedback?: UserFeedback[]
): Promise<ResearchPlanResult> {
  const prompt = previousPlan && feedback 
    ? `Query: ${query}\nMode: ${mode}\n\nPREVIOUS PLAN:\n${JSON.stringify(previousPlan, null, 2)}\n\nUSER FEEDBACK:\n${feedback.map(f => `[${f.timestamp}] ${f.content}`).join('\n')}`
    : `Query: ${query}\nMode: ${mode}`;

  try {
    const { object } = await generateObject({
      model: google('gemini-1.5-flash-latest'),
      schema: ResearchPlanSchema,
      prompt: prompt,
      system: SYSTEM_PROMPT,
    });

    return object;
  } catch (error) {
    console.warn('Failed to generate plan with Gemini, using fallback:', error);
    return {
      rationale: 'Gemini is temporarily unavailable. Providing a default plan.',
      steps: [
        { 
          id: '1', 
          type: 'search', 
          description: `Search for information about: ${query}`,
          searchQueries: [query]
        },
        { id: '2', type: 'analyze', description: 'Analyze the search results.' },
      ],
    };
  }
}
