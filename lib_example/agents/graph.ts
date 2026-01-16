import { StateGraph, END, START } from "@langchain/langgraph";
import { ResearchAnnotation, ResearchState } from "./state";
import { analyzerNode } from "./nodes/analyzer";
import { plannerNode } from "./nodes/planner";
import { quickScanNode } from "./nodes/quick_scan";
import { researcherNode } from "./nodes/researcher";
import { synthesizerNode } from "./nodes/synthesizer";
import { summarizerNode } from "./nodes/summarizer";
import { getCheckpointer } from "./checkpoint";

function route(state: ResearchState) {
  const lastMessage = state.messages[state.messages.length - 1];
  if (typeof lastMessage.content === 'string' && lastMessage.content.includes("CLARIFICATION_NEEDED")) {
    return END;
  }
  
  if (state.mode === 'quick_scan') {
    return "quick_scan";
  }
  return "planner";
}

function shouldContinue(state: ResearchState) {
  if (state.mode === 'quick_scan') return END;
  if (!state.plan || state.currentStep === undefined) return "synthesizer";
  if (state.currentStep >= state.plan.length || state.currentStep >= 5) {
    return "synthesizer";
  }
  return "researcher";
}

function entryRoute(state: ResearchState) {
  if (state.mode === 'quick_scan') {
    return "quick_scan";
  }
  return "analyzer";
}

const workflow = new StateGraph(ResearchAnnotation)
  .addNode("analyzer", analyzerNode)
  .addNode("planner", plannerNode)
  .addNode("quick_scan", quickScanNode)
  .addNode("researcher", researcherNode)
  .addNode("synthesizer", synthesizerNode)
  .addNode("summarizer", summarizerNode)
  
  .addConditionalEdges(START, entryRoute, {
    "quick_scan": "quick_scan",
    "analyzer": "analyzer",
  })
  .addConditionalEdges("analyzer", route, {
    "quick_scan": "quick_scan",
    "planner": "planner",
    [END]: END,
  })
  .addEdge("planner", "researcher")
  .addConditionalEdges("researcher", shouldContinue, {
    "researcher": "researcher",
    "synthesizer": "synthesizer",
    [END]: END,
  })
  .addEdge("quick_scan", END)
  .addEdge("synthesizer", "summarizer")
  .addEdge("summarizer", END);

export const graph = workflow.compile({
  checkpointer: getCheckpointer(),
});
