import pLimit from "p-limit";
import { searchAndExtract } from "./scraper";
import { ResearchSession, ResearchResult, PlanStep } from "@/lib/types/session";

/**
 * Base error class for Research Engine related failures
 */
export class ResearchError extends Error {
  constructor(message: string, public readonly code: string, public readonly status: number = 500) {
    super(message);
    this.name = "ResearchError";
  }
}

/**
 * Thrown when the search engine (Tavily) fails or returns an error
 */
export class SearchError extends ResearchError {
  constructor(message: string, status: number = 500) {
    super(message, "SEARCH_FAILURE", status);
    this.name = "SearchError";
  }
}

/**
 * Thrown when content extraction fails for a specific URL
 */
export class ExtractionError extends ResearchError {
  constructor(message: string, public readonly url: string, status: number = 500) {
    super(message, "EXTRACTION_FAILURE", status);
    this.name = "ExtractionError";
  }
}

/**
 * Thrown when a research session cannot be found or accessed
 */
export class SessionNotFoundError extends ResearchError {
  constructor(sessionId: string) {
    super(`Research session not found: ${sessionId}`, "SESSION_NOT_FOUND", 404);
    this.name = "SessionNotFoundError";
  }
}

/**
 * Orchestrates the research process by executing multiple queries in parallel
 */
export class ResearchEngine {
  private readonly limit: ReturnType<typeof pLimit>;

  constructor(concurrencyLimit: number = 3) {
    this.limit = pLimit(concurrencyLimit);
  }

  /**
   * Executes research for all search steps in a session
   * @param session The research session to execute
   * @returns Updated research session
   */
  async execute(session: ResearchSession): Promise<ResearchSession> {
    if (!session.plan) {
      throw new ResearchError("No plan found in session", "NO_PLAN");
    }

    const updatedSession = { 
      ...session, 
      status: "executing" as const,
      updatedAt: new Date().toISOString()
    };
    
    const resultsMap = new Map<string, ResearchResult>();
    if (updatedSession.results) {
      updatedSession.results.forEach(r => resultsMap.set(r.url, r));
    }

    const searchSteps = updatedSession.plan.steps.filter(s => s.type === 'search');

    for (const step of searchSteps) {
      if (!step.searchQueries || step.searchQueries.length === 0) continue;

      step.status = 'searching';
      
      const researchTasks = step.searchQueries.map((queryText) => 
        this.limit(async () => {
          try {
            const results = await searchAndExtract(queryText, {
              searchDepth: updatedSession.mode === "deep_probe" ? "advanced" : "basic",
              maxResults: updatedSession.mode === "deep_probe" ? 10 : 5
            });
            
            return results;
          } catch (error) {
            console.error(`Failed research for query "${queryText}":`, error);
            return [];
          }
        })
      );

      const allResults = await Promise.all(researchTasks);
      
      for (const batch of allResults) {
        for (const result of batch) {
          // FR-008: Relevance filtering
          if (result.score < 0.3) continue;

          if (!resultsMap.has(result.url)) {
            // FR-006: Enforce 20,000 character limit
            if (result.content.length > 20000) {
              result.content = result.content.substring(0, 20000) + "... [truncated]";
            }
            resultsMap.set(result.url, result);
          }
        }
      }

      step.status = 'scraped';
      step.sourceCount = resultsMap.size - (updatedSession.results?.length || 0);
    }

    updatedSession.results = Array.from(resultsMap.values());
    updatedSession.status = "completed";
    updatedSession.updatedAt = new Date().toISOString();
    
    return updatedSession;
  }
}