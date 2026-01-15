import { ResearchSession, ResearchStatus, ResearchMode } from './types/session';
import { saveSession, getSession } from './storage/session-store';
import { crypto } from 'node:crypto';
import { analyzeQuery } from './agents/analyzer';
import { generatePlan } from './agents/planner';
import { ResearchEngine } from './research/engine';
import { Synthesizer } from './research/synthesizer';

const engine = new ResearchEngine();
const synthesizer = new Synthesizer();

export async function createSession(query: string, options?: { autoPilot?: boolean }): Promise<ResearchSession> {
  if (!query || query.trim().length < 3) {
    throw new Error('Query is too short or empty');
  }

  const id = (globalThis.crypto || crypto).randomUUID();
  const now = new Date().toISOString();
  
  let session: ResearchSession = {
    id,
    query,
    mode: 'quick_scan',
    status: 'analyzing',
    createdAt: now,
    updatedAt: now,
  };
  
  await saveSession(session);

  try {
    // 1. Analyze
    const analysis = await analyzeQuery(query);
    session = {
      ...session,
      mode: analysis.mode,
      status: 'planning',
      updatedAt: new Date().toISOString(),
    };
    await saveSession(session);

    // 2. Plan
    const planResult = await generatePlan(query, analysis.mode);
    
    // Default: ON for quick_scan, OFF for deep_probe. Override if provided.
    const isAutoPilot = options?.autoPilot !== undefined 
      ? options.autoPilot 
      : (analysis.mode === 'quick_scan');
    
    session = {
      ...session,
      autoPilot: isAutoPilot,
      plan: {
        sessionId: id,
        rationale: planResult.rationale,
        steps: planResult.steps.map(s => ({ ...s, status: 'queued' })),
      },
      status: isAutoPilot ? 'executing' : 'review_pending',
      updatedAt: new Date().toISOString(),
    };
    
    await saveSession(session);

    // Auto-execute if status is executing
    if (session.status === 'executing') {
      return executeResearch(id);
    }
  } catch (error) {
    session = {
      ...session,
      status: 'error',
      error: (error as Error).message,
      updatedAt: new Date().toISOString(),
    };
    await saveSession(session);
    throw error;
  }

  return session;
}

const LEGAL_TRANSITIONS: Record<ResearchStatus, ResearchStatus[]> = {
  idle: ['analyzing', 'error'],
  analyzing: ['planning', 'error'],
  planning: ['review_pending', 'clarification_requested', 'executing', 'completed', 'error'],
  review_pending: ['planning', 'executing', 'completed', 'error'],
  clarification_requested: ['planning', 'error'],
  executing: ['completed', 'error'],
  completed: ['error'], 
  error: ['analyzing'], 
};

function canTransition(from: ResearchStatus, to: ResearchStatus): boolean {
  return LEGAL_TRANSITIONS[from].includes(to);
}

export async function updateSessionStatus(
  id: string, 
  status: ResearchStatus, 
  error?: string
): Promise<ResearchSession> {
  const session = await getSession(id);
  if (!session) {
    throw new Error(`Session ${id} not found`);
  }

  if (!canTransition(session.status, status)) {
    throw new Error(`Illegal transition from ${session.status} to ${status}`);
  }
  
  const updatedSession: ResearchSession = {
    ...session,
    status,
    error: error || session.error,
    updatedAt: new Date().toISOString(),
  };
  
  await saveSession(updatedSession);
  return updatedSession;
}

export async function approvePlan(id: string): Promise<ResearchSession> {
  const session = await getSession(id);
  if (!session) {
    throw new Error(`Session ${id} not found`);
  }

  if (session.status !== 'review_pending') {
    throw new Error(`Cannot approve plan in status ${session.status}`);
  }

  return executeResearch(id);
}

export async function executeResearch(id: string): Promise<ResearchSession> {
  const session = await getSession(id);
  if (!session) {
    throw new Error(`Session ${id} not found`);
  }

  // FR-007: Prevent execution if plan is empty
  if (!session.plan || session.plan.steps.length === 0) {
    throw new Error('Cannot execute research with an empty plan');
  }

  try {
    const updatedSession = await engine.execute(session);
    await saveSession(updatedSession);
    
    // Auto-synthesize report
    await synthesizer.synthesize(id);
    
    return await getSession(id) as ResearchSession;
  } catch (error) {
    const failedSession: ResearchSession = {
      ...session,
      status: 'error',
      error: (error as Error).message,
      updatedAt: new Date().toISOString(),
    };
    await saveSession(failedSession);
    throw error;
  }
}

export async function submitFeedback(id: string, feedbackContent: string): Promise<ResearchSession> {
  let session = await getSession(id);
  if (!session) {
    throw new Error(`Session ${id} not found`);
  }

  if (session.status !== 'review_pending') {
    throw new Error(`Cannot submit feedback in status ${session.status}`);
  }

  const now = new Date().toISOString();
  const feedback = { timestamp: now, content: feedbackContent };
  
  session = {
    ...session,
    status: 'planning',
    feedbackHistory: [...(session.feedbackHistory || []), feedback],
    updatedAt: now,
  };
  await saveSession(session);

  try {
    const planResult = await generatePlan(
      session.query, 
      session.mode, 
      session.plan, 
      session.feedbackHistory
    );

    session = {
      ...session,
      plan: {
        sessionId: id,
        rationale: planResult.rationale,
        steps: planResult.steps.map(s => ({ ...s, status: 'queued' })),
      },
      status: 'review_pending',
      updatedAt: new Date().toISOString(),
    };
    await saveSession(session);
    return session;
  } catch (error) {
    session = {
      ...session,
      status: 'error',
      error: (error as Error).message,
      updatedAt: new Date().toISOString(),
    };
    await saveSession(session);
    throw error;
  }
}

export async function modifyPlan(id: string, steps: any[]): Promise<ResearchSession> {
  const session = await getSession(id);
  if (!session) {
    throw new Error(`Session ${id} not found`);
  }

  if (session.status !== 'review_pending') {
    throw new Error(`Cannot modify plan in status ${session.status}`);
  }

  const updatedSession: ResearchSession = {
    ...session,
    plan: session.plan ? { ...session.plan, steps } : { sessionId: id, rationale: 'Manual override', steps },
    updatedAt: new Date().toISOString(),
  };

  await saveSession(updatedSession);
  return updatedSession;
}

export async function updateSessionSettings(id: string, settings: { autoPilot?: boolean }): Promise<ResearchSession> {
  const session = await getSession(id);
  if (!session) {
    throw new Error(`Session ${id} not found`);
  }

  const updatedSession: ResearchSession = {
    ...session,
    ...settings,
    updatedAt: new Date().toISOString(),
  };

  await saveSession(updatedSession);
  return updatedSession;
}