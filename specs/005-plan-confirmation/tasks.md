---

description: "Task list for Plan Confirmation feature implementation"
---

# Tasks: Human-in-the-Loop Interaction (Plan Confirmation)

**Input**: Design documents from `/specs/005-plan-confirmation/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/api.yaml

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [X] T001 Update session types in `lib/types/session.ts` to include `autoPilot`, `feedbackHistory`, and `review_pending` status
- [X] T002 Update plan and session schemas in `lib/agents/schemas.ts` to reflect state and metadata changes
- [X] T003 [P] Configure `vitest` to include new integration test directory for plan confirmation

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [X] T004 Update `lib/storage/session-store.ts` to persist `autoPilot` and `feedbackHistory` fields
- [X] T005 Update `lib/orchestrator.ts` to include `review_pending` state and logic to transition from `planning` (if !autoPilot and Deep Probe)
- [X] T006 [P] Enhance `lib/agents/planner.ts` to support feedback-driven regeneration by accepting previous plan + user feedback

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Review and Approve (Priority: P1) 🎯 MVP

**Goal**: Allow users to review a structured research plan and approve it to start execution.

**Independent Test**: Start a deep probe session, verify it pauses at `review_pending`, call `POST /api/research/[id]/approve`, and verify it transitions to `executing`.

### Tests for User Story 1 (Requested in quickstart.md)

- [X] T007 [P] [US1] Create integration test for approval flow in `tests/integration/plan-confirmation.test.ts`

### Implementation for User Story 1

- [X] T008 [US1] Implement `app/api/research/[id]/approve/route.ts` to transition session state to `executing`
- [X] T009 [US1] Update `app/(protected)/dashboard/page.tsx` (or plan display component) to show the task list when in `review_pending` status
- [X] T010 [US1] Implement "Approve Plan" button in UI that triggers the approval API call

**Checkpoint**: At this point, User Story 1 is fully functional and the agent can be manually "released" to execute.

---

## Phase 4: User Story 2 - Edit Plan or Provide Feedback (Priority: P2)

**Goal**: Enable steering the agent via text feedback or direct manual modification of plan steps.

**Independent Test**: Provide feedback via API and verify a new plan is generated; manually delete a step and verify it is not executed.

### Tests for User Story 2 (Requested in quickstart.md)

- [X] T011 [P] [US2] Create integration test for feedback regeneration in `tests/integration/plan-confirmation.test.ts`
- [X] T012 [P] [US2] Create integration test for manual step modification in `tests/integration/plan-confirmation.test.ts`

### Implementation for User Story 2

- [X] T013 [P] [US2] Implement `app/api/research/[id]/feedback/route.ts` to handle text feedback and trigger `lib/orchestrator.ts` back to `planning`
- [X] T014 [P] [US2] Implement `app/api/research/[id]/modify/route.ts` to update the plan steps array with manual overrides
- [X] T015 [US2] Add feedback text area and "Regenerate" button to the plan review UI
- [X] T016 [US2] Implement manual step editing UI (delete, edit description, reorder) in the dashboard
- [X] T017 [US2] Implement "isDirty" tracking in UI to show warning modal when feedback is submitted after manual edits
- [X] T017b [US2] Implement UI to handle "Clarification Requested" state when LLM feedback response requires more input

**Checkpoint**: User can now actively collaborate with the agent to refine the research scope.

---

## Phase 5: User Story 3 - Auto-Pilot Mode (Priority: P3)

**Goal**: Skip the confirmation step for routine or trusted queries.

**Independent Test**: Toggle Auto-Pilot ON, start session, verify it transitions directly from `planning` to `executing`.

### Implementation for User Story 3

- [X] T018 [US3] Implement `app/api/research/[id]/settings/route.ts` to toggle the `autoPilot` boolean in session state
- [X] T019 [US3] Update `lib/orchestrator.ts` to skip `review_pending` and move straight to `executing` if `autoPilot` is enabled
- [X] T020 [US3] Add Auto-Pilot toggle switch to the UI (Session settings or Dashboard header)

**Checkpoint**: Efficiency mode is now available for power users.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [X] T021 Implement validation in `lib/orchestrator.ts` to prevent entering `executing` state if the plan has zero steps
- [X] T022 Add loading states and transitions for the "Regenerating..." phase in UI
- [X] T023 Update `specs/005-plan-confirmation/quickstart.md` with final verified manual testing steps
- [X] T024 Run all integration tests in `tests/integration/plan-confirmation.test.ts` to ensure no regressions
- [X] T025 [US2] Implement simple "Was this regeneration helpful?" (Thumb Up/Down) rating to satisfy SC-003

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: Can start immediately.
- **Foundational (Phase 2)**: Depends on Setup - BLOCKS all user stories.
- **User Stories (Phase 3+)**: Depend on Foundational completion.
- **Polish (Final Phase)**: Depends on all user stories.

### Parallel Opportunities

- T001 and T002 can be done together.
- T013 and T014 (Feedback vs Modify endpoints) are parallelizable.
- T018 (Settings API) is parallelizable with US1/US2 implementation.

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1 & 2 (Foundational).
2. Complete Phase 3 (US1: Approve).
3. **VALIDATE**: User can now at least see and approve a plan.

### Incremental Delivery

1. Foundation -> State machine supports pausing.
2. US1 -> Human-in-the-loop "Pause/Resume" works.
3. US2 -> Human can now "Steer" the agent.
4. US3 -> Automation for routine tasks.
