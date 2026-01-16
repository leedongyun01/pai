import { ResearchState } from "../state";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { SUMMARIZER_PROMPT } from "../prompts";
import { config } from "@/lib/config";
import { SystemMessage } from "@langchain/core/messages";

export async function summarizerNode(state: ResearchState) {
  const model = new ChatGoogleGenerativeAI({
    apiKey: config.GEMINI_API_KEY,
    model: "gemini-2.5-flash-lite",
    apiVersion: config.GEMINI_API_VERSION,
  });

  const messages = state.messages;
  if (messages.length < 10) {
    return {};
  }

  const summary = state.summary || "";
  const newMessages = messages.slice(0, -2); // Summarize all but last 2
  
  const prompt = SUMMARIZER_PROMPT
    .replace("{summary}", summary)
    .replace("{new_messages}", JSON.stringify(newMessages));

  const userMessages = messages.filter(m => m._getType() !== 'system');
  
  const response = await model.invoke([
    new SystemMessage(prompt),
    ...userMessages
  ]);

  return {
    summary: response.content as string,
    // Note: To properly implement context window management, we should delete old messages here.
    // However, returning messages.slice(-2) in LangGraph appends them rather than replacing.
    // For now, we only update the summary. Future work: Implement RemoveMessage logic.
  };
}
