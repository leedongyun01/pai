import { Report } from "../research/types";

export type ResearchMode = 'quick_scan' | 'deep_probe';

export type ResearchStatus = 
  | 'idle'           // Initial state
  | 'analyzing'      // Determining mode
  | 'planning'       // Generating plan
  | 'review_pending' // Waiting for user approval (Deep Probe only)
  | 'clarification_requested' // LLM needs more info
  | 'executing'      // Running tasks
  | 'completed'      // Finished
  | 'error';         // Failed

export type PlanStepType = 'search' | 'analyze';

export type PlanStepStatus = 'queued' | 'searching' | 'scraped' | 'failed' | 'completed';

export interface PlanStep {
  id: string;
  type: PlanStepType;
  description: string;
  status: PlanStepStatus;
  searchQueries?: string[];
  sourceCount?: number;
}

export interface ResearchPlan {
  sessionId: string;
  rationale: string;
  steps: PlanStep[];
}

export interface UserFeedback {
  timestamp: string; // ISO Date
  content: string;
}

export interface ResearchResult {
  id: string;
  url: string;
  title: string;
  content: string;
  queryMatch: string;
  timestamp: string;
  score: number;
}

export interface ResearchSession {
  id: string;
  userId?: string; // Owner ID for DB sessions
  query: string;
  mode: ResearchMode;
  status: ResearchStatus;
  autoPilot?: boolean;
  feedbackHistory?: UserFeedback[];
  plan?: ResearchPlan;
  results?: ResearchResult[];
  report?: Report;
  tavilyAnswer?: string;
  createdAt: string; // ISO Date
  updatedAt: string; // ISO Date
  error?: string;
}
