import { describe, it, expect, vi } from 'vitest';
import { analyzeQuery } from '@/lib/agents/analyzer';
import { ResearchEngine } from '@/lib/research/engine';
import * as scraper from '@/lib/research/scraper';
import { ResearchSession } from '@/lib/types/session';

vi.mock('@ai-sdk/google', () => ({
  google: vi.fn(),
}));

vi.mock('ai', () => ({
  generateObject: vi.fn().mockImplementation(async () => {
    // Simulate some latency
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      object: { mode: 'quick_scan', rationale: 'Simple' }
    };
  }),
}));

vi.mock('@/lib/research/scraper', () => ({
  searchAndExtract: vi.fn().mockImplementation(async () => {
    // Simulate Tavily latency
    await new Promise(resolve => setTimeout(resolve, 1000));
    return [{ url: 'https://test.com', title: 'Test', content: 'Content', queryMatch: 'query', timestamp: new Date().toISOString(), score: 0.9 }];
  }),
}));

describe('Performance Benchmarks', () => {
  it('Analysis should complete within 3 seconds', async () => {
    const start = Date.now();
    await analyzeQuery('Test query');
    const duration = Date.now() - start;
    expect(duration).toBeLessThan(3000);
  });

  it('Research Engine should complete 3 parallel queries within 5 seconds', async () => {
    const engine = new ResearchEngine(3);
    const session: ResearchSession = {
      id: 'perf-test',
      query: 'test',
      mode: 'quick_scan',
      status: 'review_pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      plan: {
        sessionId: 'perf-test',
        rationale: 'test',
        steps: [
          { id: '1', type: 'search', description: 's1', status: 'queued', searchQueries: ['q1'] },
          { id: '2', type: 'search', description: 's2', status: 'queued', searchQueries: ['q2'] },
          { id: '3', type: 'search', description: 's3', status: 'queued', searchQueries: ['q3'] },
        ]
      },
      results: [],
    };

    const start = Date.now();
    await engine.execute(session);
    const duration = Date.now() - start;
    
    // Since concurrency is 3 and each takes 1s, it should take ~1s + overhead
    expect(duration).toBeLessThan(5000);
  });
});
