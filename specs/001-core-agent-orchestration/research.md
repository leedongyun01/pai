# Phase 0: Research & Key Decisions

## 1. AI SDK Selection
**Decision**: Use Vercel AI SDK (`ai`) with Google Gemini provider (`@ai-sdk/google`).
**Rationale**: 
- Native integration with Next.js.
- `generateObject` function provides structured output (JSON) out-of-the-box, essential for the "Planner" and "Analyzer" to return typed data (`zod` schemas).
- Streaming support if needed later.
**Alternatives**: 
- `langchain`: Overkill for this specific scope; adds unnecessary abstraction weight.
- Direct API calls: More boilerplate, harder to maintain type safety.

## 2. State Management Strategy
**Decision**: Functional State Transitions (Redux-like pattern in `lib/orchestrator.ts`).
**Rationale**: 
- The state machine is linear but has specific gates (ReviewPending). 
- A simple `transition(session, event)` function that returns a new `ResearchSession` is sufficient and testable.
- No need for `xstate` complexity for < 10 states.
**Schema**:
```typescript
type ResearchStatus = 'idle' | 'analyzing' | 'planning' | 'review_pending' | 'executing' | 'completed' | 'error';
```

## 3. Persistence Layer
**Decision**: Native Node.js `fs/promises`.
**Rationale**: 
- Requirement explicitly states "File-based JSON storage".
- Simple to implement for local usage.
- **Pattern**: `lib/storage/session-store.ts` handling `read`, `write`, `list`.
- **Path**: `.data/sessions/<uuid>.json`.

## 4. UUID Generation
**Decision**: `crypto.randomUUID()`
**Rationale**: Native to Node.js (v19+) and Web Standards. No external dependency needed.

## 5. Testing Strategy
**Decision**: Add `vitest` to project.
**Rationale**: 
- Next.js currently has no test runner.
- `vitest` is faster and config-free compared to Jest for TypeScript/Vite/Next environments (mostly).
- Allows testing `analyzer.ts` and `planner.ts` in isolation without running the Next.js server.
