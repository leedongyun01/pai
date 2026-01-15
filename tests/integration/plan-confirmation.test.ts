import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createSession, approvePlan, submitFeedback, modifyPlan, updateSessionSettings } from '@/lib/orchestrator';
import * as sessionStore from '@/lib/storage/session-store';
import * as analyzer from '@/lib/agents/analyzer';
import * as planner from '@/lib/agents/planner';
import { ResearchSession } from '@/lib/types/session';

vi.mock('@/lib/storage/session-store', () => ({
  saveSession: vi.fn(),
  getSession: vi.fn(),
}));

vi.mock('@/lib/agents/analyzer', () => ({
  analyzeQuery: vi.fn(),
}));

vi.mock('@/lib/agents/planner', () => ({
  generatePlan: vi.fn(),
}));

// Mock ResearchEngine and Synthesizer as well because orchestrator uses them
vi.mock('@/lib/research/engine', () => {
  return {
    ResearchEngine: class {
      execute = vi.fn().mockImplementation(async (session: any) => ({ ...session, status: 'completed' }))
    }
  };
});

vi.mock('@/lib/research/synthesizer', () => {
  return {
    Synthesizer: class {
      synthesize = vi.fn().mockResolvedValue({})
    }
  };
});

describe('Plan Confirmation Integration', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('should transition to review_pending for deep_probe sessions', async () => {
    (analyzer.analyzeQuery as any).mockResolvedValue({ mode: 'deep_probe' });
    (planner.generatePlan as any).mockResolvedValue({
      rationale: 'Deep dive needed',
      steps: [{ id: '1', type: 'search', description: 'Step 1' }]
    });

    const session = await createSession('complex research topic');

    expect(session.status).toBe('review_pending');
    expect(session.autoPilot).toBe(false);
    expect(sessionStore.saveSession).toHaveBeenCalled();
  });

  it('should skip review_pending if autoPilot is ON (default for quick_scan)', async () => {
    (analyzer.analyzeQuery as any).mockResolvedValue({ mode: 'quick_scan' });
    (planner.generatePlan as any).mockResolvedValue({
      rationale: 'Quick scan',
      steps: [{ id: '1', type: 'search', description: 'Step 1' }]
    });
    
    // getSession will be called inside executeResearch
    // And also as the return value of executeResearch
    let callCount = 0;
    (sessionStore.getSession as any).mockImplementation(async (id: string) => {
      callCount++;
      return {
        id,
        status: callCount > 1 ? 'completed' : 'executing',
        plan: { steps: [{ id: '1' }] },
        autoPilot: true
      };
    });

    const session = await createSession('quick question');

    expect(session.status).toBe('completed');
    expect(session.autoPilot).toBe(true);
  });

  it('should transition from review_pending to executing on approval', async () => {
    const mockSession: ResearchSession = {
      id: 'session-123',
      query: 'test',
      mode: 'deep_probe',
      status: 'review_pending',
      plan: { sessionId: 'session-123', rationale: 'test', steps: [{ id: '1', type: 'search', description: 'test', status: 'queued' }] },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    let status = 'review_pending';
    (sessionStore.getSession as any).mockImplementation(async () => {
      const s = { ...mockSession, status };
      if (status === 'review_pending') status = 'completed'; // For next call
      return s;
    });

    const session = await approvePlan('session-123');
    expect(session.status).toBe('completed');
  });

  it('should regenerate plan when feedback is submitted', async () => {
    const mockSession: ResearchSession = {
      id: 'session-123',
      query: 'test',
      mode: 'deep_probe',
      status: 'review_pending',
      plan: { sessionId: 'session-123', rationale: 'v1', steps: [{ id: '1', type: 'search', description: 'v1' }] },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    (sessionStore.getSession as any).mockResolvedValue(mockSession);
    (planner.generatePlan as any).mockResolvedValue({
      rationale: 'v2 based on feedback',
      steps: [{ id: '1', type: 'search', description: 'v2' }]
    });

    const session = await submitFeedback('session-123', 'Please focus on X');

    expect(session.status).toBe('review_pending');
    expect(session.plan?.rationale).toContain('v2');
    expect(session.feedbackHistory).toHaveLength(1);
    expect(session.feedbackHistory![0].content).toBe('Please focus on X');
  });

  it('should allow manual modification of plan steps', async () => {
    const mockSession: ResearchSession = {
      id: 'session-123',
      query: 'test',
      mode: 'deep_probe',
      status: 'review_pending',
      plan: { sessionId: 'session-123', rationale: 'test', steps: [{ id: '1', type: 'search', description: 'original' }] },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    (sessionStore.getSession as any).mockResolvedValue(mockSession);

    const newSteps = [{ id: '1', type: 'search', description: 'modified' }];
    const session = await modifyPlan('session-123', newSteps);

    expect(session.plan?.steps[0].description).toBe('modified');
  });

  it('should toggle autoPilot settings', async () => {
    const mockSession: ResearchSession = {
      id: 'session-123',
      query: 'test',
      mode: 'deep_probe',
      status: 'review_pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    (sessionStore.getSession as any).mockResolvedValue(mockSession);

    const session = await updateSessionSettings('session-123', { autoPilot: true });
    expect(session.autoPilot).toBe(true);
  });

  it('should prevent execution with empty plan', async () => {
    const mockSession: ResearchSession = {
      id: 'session-123',
      query: 'test',
      mode: 'deep_probe',
      status: 'review_pending',
      plan: { sessionId: 'session-123', rationale: 'test', steps: [] },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    (sessionStore.getSession as any).mockResolvedValue(mockSession);

    await expect(approvePlan('session-123')).rejects.toThrow('Cannot execute research with an empty plan');
  });
});
