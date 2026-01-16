import { TavilyClient } from "tavily";
import { config } from "@/lib/config";

let tvly: TavilyClient | null = null;

function getTavilyClient() {
  if (!tvly) {
    if (!config.TAVILY_API_KEY) {
      throw new Error("TAVILY_API_KEY is not configured");
    }
    tvly = new TavilyClient({ apiKey: config.TAVILY_API_KEY });
  }
  return tvly;
}

export async function search(query: string, options: { 
  searchDepth?: "basic" | "advanced";
  maxResults?: number;
  includeAnswer?: boolean;
} = {}) {
  let attempts = 0;
  const maxAttempts = 3;
  const client = getTavilyClient();

  while (attempts < maxAttempts) {
    try {
      const response = await client.search({
        query,
        search_depth: options.searchDepth || "basic",
        max_results: options.maxResults || 5,
        include_answer: options.includeAnswer || false,
      });
      return response;
    } catch (error) {
      attempts++;
      console.error(`Tavily search attempt ${attempts} failed:`, error);
      if (attempts === maxAttempts) throw error;
      await new Promise(resolve => setTimeout(resolve, 1000 * attempts));
    }
  }
  throw new Error("Failed to complete Tavily search after retries");
}

export type TavilySearchResult = Awaited<ReturnType<typeof search>>;
