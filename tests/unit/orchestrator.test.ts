import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createSession, updateSessionStatus } from '@/lib/orchestrator';
import * as sessionStore from '@/lib/storage/session-store';
import * as analyzer from '@/lib/agents/analyzer';
import * as planner from '@/lib/agents/planner';
import { ResearchEngine } from '@/lib/research/engine';
import { Synthesizer } from '@/lib/research/synthesizer';

vi.mock('@/lib/storage/session-store');
vi.mock('@/lib/agents/analyzer');
vi.mock('@/lib/agents/planner');
vi.mock('@/lib/research/engine', () => ({
  ResearchEngine: vi.fn().mockImplementation(function() {
    return {
      execute: vi.fn().mockImplementation(async (session) => ({
        ...session,
        status: 'completed',
        results: [{ url: 'http://test.com', title: 'Test', content: 'Content' }]
      }))
    };
  })
}));
vi.mock('@/lib/research/synthesizer', () => ({
  Synthesizer: vi.fn().mockImplementation(function() {
    return {
      synthesize: vi.fn().mockResolvedValue({ title: 'Test Report' })
    };
  })
}));

describe('Orchestrator', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should create a session and transition to completed for quick_scan', async () => {
    vi.mocked(analyzer.analyzeQuery).mockResolvedValue({
      mode: 'quick_scan',
      rationale: 'Simple query',
    });
    vi.mocked(planner.generatePlan).mockResolvedValue({
      rationale: 'Quick plan',
      steps: [{ id: '1', type: 'search', description: 'Step 1' }],
    });

    let savedSession: any;
    vi.mocked(sessionStore.saveSession).mockImplementation(async (session) => {
      savedSession = session;
    });
    vi.mocked(sessionStore.getSession).mockImplementation(async () => savedSession);

    const session = await createSession('Test query');
    
    expect(session.mode).toBe('quick_scan');
    expect(session.status).toBe('completed');
    expect(session.plan).toBeDefined();
    expect(sessionStore.saveSession).toHaveBeenCalled();
  });

  it('should transition to review_pending for deep_probe', async () => {
    vi.mocked(analyzer.analyzeQuery).mockResolvedValue({
      mode: 'deep_probe',
      rationale: 'Complex query',
    });
    vi.mocked(planner.generatePlan).mockResolvedValue({
      rationale: 'Deep plan',
      steps: [{ id: '1', type: 'search', description: 'Step 1' }],
    });

    const session = await createSession('Complex query');
    
    expect(session.mode).toBe('deep_probe');
    expect(session.status).toBe('review_pending');
  });

  it('should throw error for short query', async () => {
    await expect(createSession('ab')).rejects.toThrow('Query is too short');
  });
});
