import { Report } from "../research/types";

export type ResearchMode = 'quick_scan' | 'deep_probe';

export type ResearchStatus = 
  | 'idle'           // Initial state
  | 'analyzing'      // Determining mode
  | 'planning'       // Generating plan
  | 'review_pending' // Waiting for user approval (Deep Probe only)
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
  query: string;
  mode: ResearchMode;
  status: ResearchStatus;
  plan?: ResearchPlan;
  results?: ResearchResult[];
  report?: Report;
  createdAt: string; // ISO Date
  updatedAt: string; // ISO Date
  error?: string;
}
