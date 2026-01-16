import { ResearchState } from "../state";
import { search, TavilySearchResult } from "@/lib/services/tavily";
import { SourceCitation } from "@/lib/schema/research";

export async function quickScanNode(state: ResearchState) {
  const lastMessage = state.messages[state.messages.length - 1];
  const originalQuery = typeof lastMessage.content === 'string' ? lastMessage.content : '';
  const query = `${originalQuery} (답변은 한국어로, 아주 구체적이고 상세하게 길게 작성해줘)`;

  const searchResults: TavilySearchResult = await search(query, {
    searchDepth: "basic",
    maxResults: 5,
    includeAnswer: true,
  });

  const newCitations: SourceCitation[] = searchResults.results.map((r) => ({
    id: Buffer.from(r.url).toString('base64'),
    url: r.url,
    title: r.title,
    snippet: r.content,
    accessDate: new Date().toISOString(),
  }));

  return {
    results: searchResults.results,
    report: searchResults.answer || "요약 내용을 찾을 수 없습니다.",
    citations: newCitations,
  };
}
