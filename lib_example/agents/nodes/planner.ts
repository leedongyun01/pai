import { ResearchState } from "../state";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { PLANNER_PROMPT } from "../prompts";
import { config } from "@/lib/config";
import { SystemMessage } from "@langchain/core/messages";
import { z } from "zod";

const PlanSchema = z.object({
  steps: z.array(z.string()).min(1).max(5),
  reasoning: z.string(),
});

export async function plannerNode(state: ResearchState) {
  const model = new ChatGoogleGenerativeAI({
    apiKey: config.GEMINI_API_KEY,
    model: "gemini-2.5-flash-lite",
    apiVersion: config.GEMINI_API_VERSION,
  }).withStructuredOutput(PlanSchema);

  const lastMessage = state.messages[state.messages.length - 1];
  const query = typeof lastMessage.content === 'string' ? lastMessage.content : '';

  const userMessages = state.messages.filter(m => m._getType() !== 'system');

  const response = await model.invoke([
    new SystemMessage(PLANNER_PROMPT.replace("{query}", query).replace("{state}", JSON.stringify(state))),
    ...userMessages
  ]);

  return {
    plan: response.steps,
    currentStep: 0,
  };
}
