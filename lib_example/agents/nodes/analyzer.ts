import { ResearchState } from "../state";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { ANALYZER_PROMPT } from "../prompts";
import { config } from "@/lib/config";
import { SystemMessage } from "@langchain/core/messages";
import { z } from "zod";

const AnalysisSchema = z.object({
  isAmbiguous: z.boolean(),
  clarificationQuestion: z.string().optional(),
  processedQuery: z.string(),
  reasoning: z.string(),
});

export async function analyzerNode(state: ResearchState) {
  console.log("--- STARTING ANALYZER NODE ---");
  const model = new ChatGoogleGenerativeAI({
    apiKey: config.GEMINI_API_KEY,
    model: "gemini-2.5-flash-lite",
    apiVersion: config.GEMINI_API_VERSION,
  }).withStructuredOutput(AnalysisSchema);

  const lastMessage = state.messages[state.messages.length - 1];
  const query = typeof lastMessage.content === 'string' ? lastMessage.content : '';

  const userMessages = state.messages.filter(m => m._getType() !== 'system');

  const response = await model.invoke([
    new SystemMessage(ANALYZER_PROMPT.replace("{query}", query)),
    ...userMessages
  ]);

  console.log("--- ANALYZER NODE COMPLETED ---");

  if (response.isAmbiguous && response.clarificationQuestion) {
    return {
      messages: [new SystemMessage(`CLARIFICATION_NEEDED: ${response.clarificationQuestion}`)],
    };
  }

  return {
    messages: [new SystemMessage(`ANALYSIS_COMPLETE: ${response.processedQuery}`)],
  };
}
