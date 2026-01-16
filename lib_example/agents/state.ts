import { Annotation, MessagesAnnotation } from "@langchain/langgraph";
import { SourceCitation, SearchResult } from "@/lib/schema/research";

export const ResearchAnnotation = Annotation.Root({
  ...MessagesAnnotation.spec,
  summary: Annotation<string>(),
  plan: Annotation<string[]>(),
  currentStep: Annotation<number>(),
  results: Annotation<SearchResult[]>(),
  report: Annotation<string>(),
  citations: Annotation<SourceCitation[]>(),
  mode: Annotation<'quick_scan' | 'deep_probe'>(),
});

export type ResearchState = typeof ResearchAnnotation.State;
