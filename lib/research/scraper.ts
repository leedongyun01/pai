import { ResearchResult, ResearchResultSchema } from "./types";
import { SearchError } from "./engine";

/**
 * Searches the web using Tavily API and extracts page content
 * @param query The search query string
 * @param options Configuration for search depth and result count
 */
export async function searchAndExtract(
  query: string,
  options: { searchDepth?: "basic" | "advanced"; maxResults?: number } = {}
): Promise<ResearchResult[]> {
  const apiKey = process.env.TAVILY_API_KEY;

  if (!apiKey || apiKey === "your_api_key_here") {
    throw new SearchError("TAVILY_API_KEY is not configured", 500);
  }

  const MAX_RETRIES = 2;
  const TIMEOUT_MS = 15000;

  let lastError: any;
  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

      const response = await fetch("https://api.tavily.com/search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        signal: controller.signal,
        body: JSON.stringify({
          api_key: apiKey,
          query,
          search_depth: options.searchDepth || "basic",
          include_answer: false,
          include_images: false,
          include_raw_content: false, 
          max_results: options.maxResults || 5,
        }),
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        if (response.status >= 500 && attempt < MAX_RETRIES) {
          continue; // Retry on 5xx
        }
        throw new SearchError(`Tavily API error: ${response.status} ${response.statusText}`, response.status);
      }

      const data = await response.json();
      const results = data.results || [];

      return results
        .filter((res: any) => {
          // FR-007: Skip binary/non-textual files based on URL extension
          const binaryExtensions = ['.pdf', '.zip', '.exe', '.dmg', '.mp4', '.mp3', '.jpg', '.png'];
          return !binaryExtensions.some(ext => res.url.toLowerCase().endsWith(ext));
        })
        .map((res: any) => {
          // FR-005: Content cleaning (whitespace normalization)
          const rawContent = res.content || "";
          const cleanedContent = rawContent
            .replace(/\s+/g, ' ')
            .trim();

          return {
            url: res.url,
            title: res.title || "No Title",
            content: cleanedContent,
            queryMatch: query,
            timestamp: new Date().toISOString(),
            score: res.score || 0,
          };
        });
    } catch (error) {
      lastError = error;
      if (error instanceof Error && error.name === 'AbortError') {
        if (attempt < MAX_RETRIES) continue;
        throw new SearchError(`Tavily API timeout after ${TIMEOUT_MS}ms`);
      }
      if (attempt === MAX_RETRIES) break;
      // Exponential backoff
      await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
    }
  }

  throw new SearchError(`Failed to perform search: ${lastError instanceof Error ? lastError.message : String(lastError)}`);
}
