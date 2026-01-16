---
description: "Task list for Citation-Aware Synthesizer implementation"
---

# Tasks: Citation-Aware Synthesizer

**Input**: Design documents from `specs/003-citation-aware-synthesizer/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/api.yaml

**Tests**: Included as requested in spec.md for verification of principles.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [X] T001 [P] Define TypeScript interfaces for Report, Section, and Conflict in lib/research/types.ts
- [X] T002 [P] Create Zod schemas for structured output validation in lib/research/schemas.ts
- [X] T003 Setup mock research data for testing in tests/mocks/research-data.json

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure for synthesis

- [X] T004 Implement basic synthesis prompt template in lib/research/prompts.ts
- [X] T005 Setup base synthesizer class with session store integration in lib/research/synthesizer.ts
- [X] T005b [P] Implement guard logic for empty or insufficient research data in lib/research/synthesizer.ts
- [X] T006 [P] Configure environment variables for Gemini API in .env.local

**Checkpoint**: Foundation ready - synthesis logic implementation can begin.

---

## Phase 3: User Story 1 - Generate Structured Report (Priority: P1) 🎯 MVP

**Goal**: Synthesize raw data into Overview, Body, and Conclusion.

**Independent Test**: Verify output JSON contains all three required sections with valid content.

### Tests for User Story 1

- [X] T007 [P] [US1] Create unit test for report structure validation in tests/unit/research/synthesizer.test.ts
- [X] T008 [US1] Create integration test for structured report generation in tests/integration/research/synthesizer_us1.test.ts

### Implementation for User Story 1

- [X] T009 [US1] Implement "Quick Scan" synthesis logic using Vercel AI SDK generateObject in lib/research/synthesizer.ts
- [X] T010 [US1] Implement section grouping logic for logical subsections in lib/research/synthesizer.ts
- [X] T011 [US1] Integrate with session-store to read research sources in lib/research/synthesizer.ts

**Checkpoint**: User Story 1 functional - system can generate structured reports without citations.

---

## Phase 4: User Story 2 - Verifiable Citations (Priority: P1)

**Goal**: Link every claim to its source with inline markers and a bibliography.

**Independent Test**: Verify every claim in a section's content has an ID that exists in the section's citations array and the report's references list.

### Tests for User Story 2

- [X] T012 [P] [US2] Create test for citation mapping accuracy in tests/unit/research/synthesizer.test.ts
- [X] T013 [US2] Create integration test for citation-to-source mapping in tests/integration/research/synthesizer_us2.test.ts

### Implementation for User Story 2

- [X] T014 [US2] Update Zod schemas to include citation IDs in lib/research/schemas.ts
- [X] T015 [US2] Refine synthesis prompt to enforce source mapping per claim in lib/research/prompts.ts
- [X] T016 [US2] Implement post-generation bibliography generation in lib/research/synthesizer.ts
- [X] T017 [US2] Add citation validity check (SC-001, SC-002) in lib/research/synthesizer.ts

**Checkpoint**: User Story 2 functional - reports now have verifiable citations.

---

## Phase 5: User Story 3 - Conflict Resolution (Priority: P2)

**Goal**: Identify and handle conflicting information from different sources.

**Independent Test**: Provide conflicting snippets and verify "conflicts" array in the output is populated.

### Tests for User Story 3

- [X] T018 [P] [US3] Create test case for conflicting data handling in tests/unit/research/synthesizer.test.ts

### Implementation for User Story 3

- [X] T019 [US3] Implement "Deep Probe" two-pass logic (Extraction -> Conflict Detection) in lib/research/synthesizer.ts
- [X] T020 [US3] Update prompt to explicitly search for contradictions in lib/research/prompts.ts
- [X] T021 [US3] Implement conflict reporting structure in report output in lib/research/synthesizer.ts

**Checkpoint**: All user stories functional - advanced hallucination prevention and conflict detection active.

---

## Phase 6: API & Integration

**Purpose**: Expose the synthesizer via API and connect to the Orchestrator.

- [X] T022 [P] Create synthesis API route in app/api/research/[id]/synthesize/route.ts
- [X] T023 [P] Update Orchestrator to trigger synthesis automatically in lib/orchestrator.ts
- [X] T024 [P] Implement citation-aware visualization for frontend (Markdown tables/Mermaid) in lib/utils/visualization.ts

---

## Phase 7: Polish & Cross-Cutting Concerns

- [X] T025 [P] Performance optimization: Ensure synthesis < 30s (SC-003) in lib/research/synthesizer.ts
- [X] T025b [US2] Refine citation metadata generation to handle broken/inaccessible source links in lib/research/synthesizer.ts
- [X] T025c [US3] Implement "cautious language" fallback for low-confidence or ambiguous claims in lib/research/prompts.ts
- [X] T026 Update quickstart.md with actual synthesis commands
- [X] T027 Run full test suite for regression testing

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: Can start immediately.
- **Foundational (Phase 2)**: Depends on T001, T002.
- **User Story 1 (Phase 3)**: Depends on Phase 2.
- **User Story 2 (Phase 4)**: Depends on US1 (for base report).
- **User Story 3 (Phase 5)**: Depends on US2 (for deep verification).
- **API & Integration (Phase 6)**: Depends on US1.

### Parallel Opportunities

- T001, T002, T006 can run in parallel.
- All Phase 3-5 tests marked [P] can be written in parallel.
- API route (T022) can be drafted while synthesis logic is being implemented.

---

## Implementation Strategy

### MVP First (User Story 1 & 2)

1. Complete Setup and Foundation.
2. Implement US1 and US2 (P1 priorities).
3. **STOP and VALIDATE**: Ensure structured reports with valid citations work.

### Incremental Delivery

1. Add US3 (Conflict Resolution) after MVP is stable.
2. Finalize API integration and frontend visualization.
