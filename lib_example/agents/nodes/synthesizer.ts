import { ResearchState } from "../state";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { SYNTHESIZER_PROMPT } from "../prompts";
import { config } from "@/lib/config";
import { SystemMessage } from "@langchain/core/messages";

export async function synthesizerNode(state: ResearchState) {
  const model = new ChatGoogleGenerativeAI({
    apiKey: config.GEMINI_API_KEY,
    model: "gemini-2.5-flash-lite",
    apiVersion: config.GEMINI_API_VERSION,
  });

  const findings = JSON.stringify(state.results);
  
  const userMessages = state.messages.filter(m => m._getType() !== 'system');
  
  const response = await model.invoke([
    new SystemMessage(SYNTHESIZER_PROMPT.replace("{results}", findings)),
    ...userMessages
  ]);

  return {
    report: response.content as string,
  };
}
