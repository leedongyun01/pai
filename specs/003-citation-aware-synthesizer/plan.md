# Implementation Plan: Citation-Aware Synthesizer

**Feature Branch**: `003-citation-aware-synthesizer`
**Project Type**: Next.js App
**Language/Version**: TypeScript 5.x
**Primary Dependencies**: Vercel AI SDK (`ai`), `@ai-sdk/google` (Gemini)
**Storage**: Local Filesystem (.data/sessions)

## Technical Context

### Existing Systems
- **Research Engine (002)**: Provides `Source` objects via session storage.
- **Orchestrator (001)**: Manages session lifecycle and state.

### Dependencies & Integration
- Integration with `lib/storage/session-store.ts` for reading research results and saving reports.

## Constitution Check

| Principle | Adherence Plan |
|---|---|
| I. Autonomous Execution | Synthesizer runs automatically after research phase finishes. |
| II. Verifiable Reliability | Use structured output to force 1:1 mapping between claims and source IDs. |
| III. Adaptive Visualization | Identify trends in research snippets and render as Markdown tables. |
| IV. Dual-Mode Operation | 'Quick' mode synthesizes directly; 'Deep' mode performs multi-pass verification. |
| V. Human-in-the-Loop | N/A (Synthesizer output is for human consumption, but plan confirmation is handled by Orchestrator). |

## Design Gates

- [x] **RES-001 (Citation Pattern)**: Resolved in feature-specific research.md (using Zod structured output)
- [x] **RES-002 (Conflict Detection)**: Resolved in feature-specific research.md (two-pass verification)
- [x] **RES-003 (Hallucination Prevention)**: Resolved in feature-specific research.md (grounding prompts & ID validation)

## Implementation Phases

### Phase 2: Core Synthesis Logic
- Implement `lib/research/synthesizer.ts`.
- Define Zod schemas for structured report output.
- Implement "Quick Scan" synthesis prompt.

### Phase 3: Advanced Features & Verification
- Implement "Deep Probe" multi-pass synthesis (Extraction -> Conflict Detection -> Synthesis).
- Implement post-generation citation validation logic.

### Phase 4: API & Integration
- Create `/api/research/[id]/synthesize` route.
- Connect Orchestrator to trigger synthesis.

## Verification Plan

### Automated Tests
- Unit tests for Zod schema validation.
- Integration tests for synthesis API with mock research data.
- Citation validity check: Ensure all cited IDs exist in the references list.

### Manual Verification
- Verify report structure (Overview, Body, Conclusion).
- Check that citations accurately reflect the source content.