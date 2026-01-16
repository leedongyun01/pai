# Implementation Plan: Research Engine

**Branch**: `002-research-engine` | **Date**: 2026-01-15 | **Spec**: /specs/002-research-engine/spec.md
**Input**: Feature specification from `/specs/002-research-engine/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

The Research Engine is an autonomous module responsible for performing web searches and extracting cleaned content from web pages using the Tavily Search API. It prioritizes data acquisition reliability, content quality filtering, and metadata preservation for downstream citation generation. The technical approach involves a parallel execution strategy with concurrency limits to ensure high performance while maintaining system stability.

## Technical Context

**Language/Version**: TypeScript 5.x (Next.js 16 environment)  
**Primary Dependencies**: Tavily API (JS client or REST), `zod` for validation, `ai` SDK  
**Storage**: Local Filesystem JSON (for session state persistence)  
**Testing**: `vitest`  
**Target Platform**: Node.js (Next.js API Routes / Edge Functions)
**Project Type**: Web application (Next.js)  
**Performance Goals**: Search and scrape top 5 results for a single query in under 20 seconds.  
**Constraints**: 20,000 character limit per page; Concurrency limits on API calls.  
**Scale/Scope**: Core research acquisition layer for the ProbeAI agent.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

1. **Principle I: Autonomous Execution**: ✅ The Researcher operates autonomously based on query input from the orchestrator.
2. **Principle II: Verifiable Reliability**: ✅ Mandatory inclusion of source URLs and page titles for all extracted content to support citation.
3. **Principle III: Adaptive Visualization**: N/A - This module provides raw text data.
4. **Principle IV: Dual-Mode Operation**: ✅ Supports both Quick Scan and Deep Probe by providing configurable search depth and result count.
5. **Principle V: Human-in-the-Loop**: N/A - This module is a worker execution layer.

## Project Structure

### Documentation (this feature)

```text
specs/002-research-engine/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
lib/
├── research/
│   ├── engine.ts       # Main Researcher logic
│   ├── scraper.ts      # Scraper/Extraction logic (Tavily wrapper)
│   └── types.ts        # Domain types
└── storage/            # (Existing) Session store

app/
└── api/
    └── research/
        └── [id]/
            └── execute/ # New endpoint to trigger research tasks
```

**Structure Decision**: Option 1: Single project (Next.js structure). Logic resides in `lib/research/` and exposed via API routes in `app/api/research/`.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| [e.g., 4th project] | [current need] | [why 3 projects insufficient] |
| [e.g., Repository pattern] | [specific problem] | [why direct DB access insufficient] |
