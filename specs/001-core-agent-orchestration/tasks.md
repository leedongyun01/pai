# Tasks: 001-core-agent-orchestration

**Input**: Design documents from `specs/001-core-agent-orchestration/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/api.yaml

**Tests**: Vitest-based unit and integration tests are included as per the research and specification requirements.

**Organization**: Tasks are grouped by user story (US1-US4) following the priority order defined in spec.md (P1 for US1/US2, P2 for US3).

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: US1 (Query Analysis), US2 (Plan Generation), US3 (State Monitoring), US4 (Plan Approval)

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and environment configuration

- [x] T001 Install core dependencies: `ai`, `@ai-sdk/google`, `zod`
- [x] T002 [P] Install development dependencies: `vitest`
- [x] T003 [P] Configure vitest in `package.json` and create `vitest.config.ts` if needed
- [x] T004 Setup `.env.local` template with `GOOGLE_GENERATIVE_AI_API_KEY` placeholder
- [x] T005 [P] Initialize `.data/sessions` directory and add it to `.gitignore`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core data structures and persistence layer

- [x] T006 [P] Define core domain types and enums in `lib/types/session.ts` (per data-model.md)
- [x] T007 Implement file-based persistence in `lib/storage/session-store.ts` (Read/Write/List)
- [x] T008 [P] Unit test for Session Store in `tests/unit/storage.test.ts`
- [x] T009 Create basic Orchestrator state machine skeleton in `lib/orchestrator.ts`
- [x] T010 [P] Define Zod schemas for LLM structured output in `lib/agents/schemas.ts`

**Checkpoint**: Foundation ready - Core agents and API implementation can begin.

---

## Phase 3: User Story 1 - Query Analysis & Mode Selection (Priority: P1) 🎯 MVP

**Goal**: Automatically select research mode (Quick Scan vs. Deep Probe) based on query intent.

**Independent Test**: Run Analyzer agent with test queries and verify mode selection rationale.

- [x] T011 [P] [US1] Unit test for Analyzer agent in `tests/unit/analyzer.test.ts`
- [x] T012 [US1] Implement Analyzer agent in `lib/agents/analyzer.ts` using Gemini Flash
- [x] T013 [US1] Implement `createSession` logic in `lib/orchestrator.ts` integrating Analyzer
- [x] T014 [US1] Implement POST endpoint in `app/api/research/route.ts` (FR-001, FR-002)
- [x] T015 [US1] Add error handling for empty/nonsense queries in `lib/orchestrator.ts`

**Checkpoint**: User can now create a session and see the auto-selected mode.

---

## Phase 4: User Story 2 - Research Plan Generation (Priority: P1) 🎯 MVP

**Goal**: Generate a structured research plan (steps) based on the query and mode.

**Independent Test**: Verify that plans have steps with types (Search, Analyze) and descriptions.

### Tests for User Story 2

- [x] T016 [P] [US2] Unit test for Planner agent in `tests/unit/planner.test.ts`

### Implementation for User Story 2

- [x] T017 [US2] Implement Planner agent in `lib/agents/planner.ts` with mode-specific logic (FR-005, FR-006)
- [x] T018 [US2] Update `lib/orchestrator.ts` to transition session to `PLANNING` and then `REVIEW_PENDING` (Deep) or `COMPLETED` (Quick)
- [x] T019 [US2] Integrate Planner into the session creation flow in `app/api/research/route.ts`

**Checkpoint**: Sessions now include a complete research plan upon creation.

---

## Phase 5: User Story 3 - State Management & Status Monitoring (Priority: P2)

**Goal**: Retrieve session status and verify state transitions.

**Independent Test**: Fetch session by ID and confirm current status matches expected state.

- [x] T020 [P] [US3] Unit test for state transition logic in `tests/unit/orchestrator.test.ts`
- [x] T021 [P] [US3] API integration test for status retrieval in `tests/api/research.test.ts`
- [x] T022 [US3] Implement GET endpoint in `app/api/research/[id]/route.ts` (FR-007, FR-009)
- [x] T023 [US3] Add robust state validation in `lib/orchestrator.ts` to prevent illegal transitions

---

## Phase 6: User Story 4 - Plan Approval (Priority: P2)

**Goal**: Allow users to approve plans for Deep Probe sessions.

**Independent Test**: PATCH a session in `review_pending` and verify it moves to `completed`.

- [x] T024 [P] [US4] API integration test for plan approval in `tests/api/approval.test.ts`
- [x] T025 [US4] Implement PATCH endpoint in `app/api/research/[id]/route.ts` (action: approve)
- [x] T026 [US4] Implement approval logic in `lib/orchestrator.ts` (transition from `review_pending` to `completed`)

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Final cleanup and validation

- [x] T027 [P] Update `README.md` with API usage instructions from `quickstart.md`
- [x] T028 Perform final validation run using manual steps in `quickstart.md`
- [x] T029 [P] Optimize LLM prompts for better accuracy (per SC-002)
- [x] T030 [P] Implement performance benchmark tests in `tests/integration/performance.test.ts` (NFR-001)
- [x] T031 Implement citation format validation logic in `lib/utils/citations.ts` (Constitution Compliance)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 & 2**: Prerequisites for all user stories.
- **US1 & US2**: Both P1 - US2 depends on US1 (Mode selection needed for planning).
- **US3 & US4**: P2 - Depend on US1/US2 being functional.

### Parallel Opportunities

- T002, T003, T005 (Setup)
- T006, T008, T010 (Foundational)
- All agent unit tests (T011, T016, T020, T024) can be written in parallel.
- Once Foundation is complete, agents (US1/US2) can be implemented in parallel if mocked.

---

## Implementation Strategy

### MVP First (User Story 1 & 2)

1. Complete Setup and Foundational layers.
2. Implement Analyzer (US1) and Planner (US2).
3. Verify POST `/api/research` returns a session with a plan.

### Incremental Delivery

1. Foundation -> Core session lifecycle ready.
2. US1 & US2 -> Agent logic ready (MVP).
3. US3 & US4 -> Monitoring and interaction gates (Approval) ready.
4. Polish -> Production readiness.
