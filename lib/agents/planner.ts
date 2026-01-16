import { google } from '@ai-sdk/google';
import { generateObject } from 'ai';
import { ResearchPlanSchema, ResearchPlanResult, UserFeedback } from './schemas';
import { ResearchMode, ResearchPlan } from '../types/session';
import { AI_MODELS, isMockMode } from '../utils/ai';

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
  // US-MODE: Quick scan uses a fixed, simple plan to trigger Tavily's answer generation
  if (mode === 'quick_scan') {
    return {
      rationale: 'Quick scan mode: Using Tavily search and integrated answer generation.',
      steps: [
        { 
          id: '1', 
          type: 'search', 
          description: `Direct search and answer generation for: ${query}`,
          searchQueries: [query]
        }
      ],
    };
  }

  if (isMockMode()) {
    return {
      rationale: 'Mock mode enabled. Providing a default stable plan.',
      steps: [
        { 
          id: '1', 
          type: 'search', 
          description: `Research: ${query}`,
          searchQueries: [query]
        },
        { id: '2', type: 'analyze', description: 'Analyze results and synthesize findings.' },
      ],
    };
  }

  const prompt = previousPlan && feedback 
    ? `Query: ${query}\nMode: ${mode}\n\nPREVIOUS PLAN:\n${JSON.stringify(previousPlan, null, 2)}\n\nUSER FEEDBACK:\n${feedback.map(f => `[${f.timestamp}] ${f.content}`).join('\n')}`
    : `Query: ${query}\nMode: ${mode}`;

  try {
    const { object } = await generateObject({
      model: google(AI_MODELS.FLASH),
      schema: ResearchPlanSchema,
      prompt: prompt,
      system: SYSTEM_PROMPT,
    });

    return object;
  } catch (error) {
    console.error('Gemini Planning Error:', error);
    return {
      rationale: 'Gemini API error occurred. Providing a default stable plan.',
      steps: [
        { 
          id: '1', 
          type: 'search', 
          description: `Research: ${query}`,
          searchQueries: [query]
        },
        { id: '2', type: 'analyze', description: 'Analyze results and synthesize findings.' },
      ],
    };
  }
}
