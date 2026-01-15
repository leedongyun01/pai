import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ResearchEngine } from '@/lib/research/engine';
import * as scraper from '@/lib/research/scraper';
import { ResearchSession } from '@/lib/research/types';

vi.mock('@/lib/research/scraper', () => ({
  searchAndExtract: vi.fn(),
}));

describe('Research Engine Orchestration', () => {
  let engine: ResearchEngine;

  beforeEach(() => {
    vi.resetAllMocks();
    engine = new ResearchEngine();
  });

  it('should execute research for multiple queries in parallel', async () => {
    const mockResults = [
      { url: 'https://test1.com', title: 'Test 1', content: 'Content 1', queryMatch: 'query 1', timestamp: new Date().toISOString(), score: 0.9 },
      { url: 'https://test2.com', title: 'Test 2', content: 'Content 2', queryMatch: 'query 2', timestamp: new Date().toISOString(), score: 0.8 },
    ];

    (scraper.searchAndExtract as any)
      .mockResolvedValueOnce({ results: [mockResults[0]] })
      .mockResolvedValueOnce({ results: [mockResults[1]] });

    const session: ResearchSession = {
      id: '123e4567-e89b-12d3-a456-426614174000',
      query: 'test query',
      mode: 'quick_scan',
      status: 'review_pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      plan: {
        sessionId: '123e4567-e89b-12d3-a456-426614174000',
        rationale: 'test',
        steps: [
          { id: '1', type: 'search', description: 'step 1', status: 'queued', searchQueries: ['query 1'] },
          { id: '2', type: 'search', description: 'step 2', status: 'queued', searchQueries: ['query 2'] },
        ]
      },
      results: [],
    };

    const updatedSession = await engine.execute(session);

    expect(updatedSession.status).toBe('completed');
    expect(updatedSession.results).toHaveLength(2);
    expect(updatedSession.plan?.steps.every(s => s.status === 'scraped')).toBe(true);
    expect(scraper.searchAndExtract).toHaveBeenCalledTimes(2);
  });

  it('should handle partial failures gracefully', async () => {
    (scraper.searchAndExtract as any)
      .mockResolvedValueOnce({ results: [{ url: 'https://test1.com', title: 'Test 1', content: 'Content 1', queryMatch: 'query 1', timestamp: new Date().toISOString(), score: 0.9 }] })
      .mockRejectedValueOnce(new Error('Search failed'));

    const session: ResearchSession = {
      id: '123e4567-e89b-12d3-a456-426614174000',
      query: 'test query',
      mode: 'quick_scan',
      status: 'review_pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      plan: {
        sessionId: '123e4567-e89b-12d3-a456-426614174000',
        rationale: 'test',
        steps: [
          { id: '1', type: 'search', description: 'step 1', status: 'queued', searchQueries: ['query 1'] },
          { id: '2', type: 'search', description: 'step 2', status: 'queued', searchQueries: ['query 2'] },
        ]
      },
      results: [],
    };

    const updatedSession = await engine.execute(session);

    expect(updatedSession.status).toBe('completed');
    expect(updatedSession.results).toHaveLength(1);
    expect(updatedSession.plan?.steps[0].status).toBe('scraped');
    expect(updatedSession.plan?.steps[1].status).toBe('scraped'); 
  });

  it('should enforce 20,000 character limit per extracted page', async () => {
    const longContent = 'A'.repeat(25000);
    (scraper.searchAndExtract as any).mockResolvedValueOnce({
      results: [{ url: 'https://test.com', title: 'Test', content: longContent, queryMatch: 'query', timestamp: new Date().toISOString(), score: 0.9 }]
    });

    const session: ResearchSession = {
      id: '123e4567-e89b-12d3-a456-426614174001',
      query: 'test',
      mode: 'quick_scan',
      status: 'review_pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      plan: {
        sessionId: '123e4567-e89b-12d3-a456-426614174001',
        rationale: 'test',
        steps: [{ id: '1', type: 'search', description: 'step 1', status: 'queued', searchQueries: ['query'] }]
      },
      results: [],
    };

    const updatedSession = await engine.execute(session);
    expect(updatedSession.results![0].content.length).toBeLessThanOrEqual(20000 + "... [truncated]".length);
    expect(updatedSession.results![0].content).toContain("... [truncated]");
  });
});

