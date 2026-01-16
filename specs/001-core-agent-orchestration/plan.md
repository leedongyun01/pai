# Implementation Plan: Core Agent Orchestration

**Branch**: `001-core-agent-orchestration` | **Date**: 2026-01-15 | **Spec**: [specs/001-core-agent-orchestration/spec.md](specs/001-core-agent-orchestration/spec.md)
**Input**: Feature specification from `/specs/001-core-agent-orchestration/spec.md`

## Summary

This feature implements the core backend orchestration for the ProbeAI research agent. It includes:
1.  **Analysis Module**: Classifies user queries to select 'Quick Scan' vs 'Deep Probe' mode.
2.  **Planning Module**: Generates a JSON research plan using Google Gemini.
3.  **State Management**: Tracks session state (Idle, Planning, ReviewPending, etc.) backed by local file storage.
4.  **API**: Endpoints to create sessions, retrieve status, and approve plans.

## Technical Context

**Language/Version**: TypeScript 5.x (Next.js 16 environment)
**Primary Dependencies**: 
- `ai` (Vercel AI SDK)
- `@ai-sdk/google` (Gemini Provider)
- `zod` (Validation & Schemas)
**Storage**: Local Filesystem JSON (`.data/` directory as per spec)
**Testing**: `vitest` (Proposed - currently no test runner in project)
**Target Platform**: Next.js Server Actions / API Routes (Node.js runtime)
**Project Type**: Web Application (Next.js App Router)
**Performance Goals**: < 3s latency for Analysis/Planning steps.
**Constraints**: Stateless server-side logic; Persistence via file I/O.
**Scale/Scope**: Single-user, local development focus.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **I. Autonomous Execution**: ✅ 'Quick Scan' mode defaults to auto-execution.
- **II. Verifiable Reliability**: ⚠️ Planner must ensure generated steps include verification instructions (enforced in Prompts).
- **III. Adaptive Visualization**: ⚪ Not directly applicable to orchestration, but API must support returning structured data for UI.
- **IV. Dual-Mode Operation**: ✅ Explicitly handles Quick Scan vs Deep Probe modes.
- **V. Human-in-the-Loop**: ✅ 'Deep Probe' mode enforces 'ReviewPending' state.

## Project Structure

### Documentation (this feature)

```text
specs/001-core-agent-orchestration/
├── plan.md              # This file
├── research.md          # Technology choices & trade-offs
├── data-model.md        # Session & Plan schemas
├── quickstart.md        # Usage guide
├── contracts/           # API definitions
│   └── api.yaml         # OpenAPI spec
└── tasks.md             # Implementation tasks
```

### Source Code (repository root)

```text
app/
├── api/
│   └── research/        # API Routes
│       ├── route.ts     # POST (Create), GET (List)
│       └── [id]/
│           └── route.ts # GET (Status), PATCH (Update/Approve)
└── ...

lib/
├── agents/              # AI Logic
│   ├── analyzer.ts      # Mode selection
│   ├── planner.ts       # Plan generation
│   └── prompt.ts        # System prompts
├── storage/             # Persistence
│   └── session-store.ts # File I/O for sessions
└── types/               # Shared types
    └── research.ts
```

**Structure Decision**: Using standard Next.js `app/` directory for API routes and `lib/` for business logic to keep concerns separated.
