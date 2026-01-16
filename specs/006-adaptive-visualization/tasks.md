## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and environment setup

- [X] T001 Create project structure for visualization module in `lib/research/` and `tests/`
- [X] T002 [P] Configure Mermaid.js and Zod dependencies in `package.json`
- [X] T003 [P] Initialize Vitest configuration for research tests in `vitest.config.ts`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core schemas, interfaces, and utilities required for all visualization types

- [X] T004 Implement Zod schemas for `VisualizationObject` and `CitationMap` in `lib/research/schemas.ts`
- [X] T005 [P] Define `IVisualizer` interface and shared types in `lib/research/types.ts`
- [X] T006 [P] Implement Mermaid syntax helper functions and ProbeAI theme configuration in `lib/utils/visualization.ts` (FR-011)
- [X] T007 Create base `Visualizer` class with `process` and `validate` method stubs in `lib/research/visualizer.ts`
- [X] T008 [P] Setup base unit test suite in `tests/unit/research/visualizer.test.ts`

**Checkpoint**: Foundation ready - pattern detection and generation can begin.

---

## Phase 3: User Story 1 - Automatic Data Structuring (Priority: P1) 🎯 MVP

**Goal**: Automatically convert numerical trends and chronological events into Mermaid charts.

**Independent Test**: Provide text with clear numerical trends and verify valid Mermaid Bar/Line chart generation.

### Tests for User Story 1

- [X] T009 [P] [US1] Unit test for numerical trend pattern detection in `tests/unit/research/visualizer.test.ts`
- [X] T010 [P] [US1] Unit test for chronological event detection in `tests/unit/research/visualizer.test.ts`
- [X] T011 [P] [US1] Unit test for Mermaid syntax validation in `tests/unit/research/visualizer.test.ts`

### Implementation for User Story 1

- [X] T012 [US1] Implement numerical pattern matcher logic (FR-001) in `lib/research/visualizer.ts`
- [X] T013 [US1] Implement chronological/flow pattern matcher logic (FR-001) in `lib/research/visualizer.ts`
- [X] T014 [US1] Implement Mermaid Bar, Line, and Pie chart generators (FR-002, FR-003) in `lib/research/visualizer.ts`
- [X] T015 [US1] Implement Mermaid Flowchart, Gantt, and Journey Map generators (FR-002, FR-003) in `lib/research/visualizer.ts`
- [X] T016 [US1] Implement citation mapping to caption footnotes (FR-004) in `lib/utils/citations.ts` and `lib/research/visualizer.ts`
- [X] T017 [US1] Implement `validate` method using Mermaid's parser or regex check (FR-005) in `lib/research/visualizer.ts`
- [X] T017a [US1] Implement contextual placement logic by including text anchor markers in `VisualizationObject` (FR-009) in `lib/research/visualizer.ts`

**Checkpoint**: User Story 1 (Charts) functional and testable.

---

## Phase 4: User Story 2 - Comparison Table Generation (Priority: P2)

**Goal**: Consolidate fragmented entity information into structured Markdown tables.

**Independent Test**: Provide text comparing products/entities and verify correctly formatted Markdown table output.

### Tests for User Story 2

- [X] T018 [P] [US2] Unit test for entity comparison detection in `tests/unit/research/visualizer.test.ts`
- [X] T019 [P] [US2] Unit test for Markdown table generation accuracy in `tests/unit/research/visualizer.test.ts`

### Implementation for User Story 2

- [X] T020 [US2] Implement structural similarity pattern matcher for entities (FR-001, FR-002) in `lib/research/visualizer.ts`
- [X] T021 [US2] Implement Markdown table generator (FR-002) in `lib/research/visualizer.ts`
- [X] T022 [US2] Add citation support for table cell data (FR-004) in `lib/research/visualizer.ts`

**Checkpoint**: User Story 2 (Tables) functional and testable.

---

## Phase 5: User Story 3 - Visualization Refinement & Fallback (Priority: P3)

**Goal**: Ensure reliability by falling back to tables or suppressing low-confidence visualizations.

**Independent Test**: Provide 20+ data points and verify fallback to Table (FR-008). Provide ambiguous data and verify suppression (FR-010).

### Tests for User Story 3

- [X] T023 [P] [US3] Unit test for complexity threshold (20+ points) in `tests/unit/research/visualizer.test.ts`
- [X] T024 [P] [US3] Unit test for confidence score suppression (< 0.8) in `tests/unit/research/visualizer.test.ts`

### Implementation for User Story 3

- [X] T025 [US3] Implement Complexity Gate logic to force Table type for > 20 points (FR-008) in `lib/research/visualizer.ts`
- [X] T026 [US3] Implement Confidence Gate to suppress objects with score < 0.8 (FR-010) in `lib/research/visualizer.ts`
- [X] T027 [US3] Implement automatic fallback from Chart to Table if Mermaid validation fails (FR-005) in `lib/research/visualizer.ts`

**Checkpoint**: All user stories functional with robust error handling and constraints.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Integration, limits, and final optimizations

- [X] T028 Implement limit of max 3 visualizations per section (FR-006) in `lib/research/visualizer.ts`
- [X] T029 [P] Integration test for full synthesis-to-visualization flow in `tests/integration/research/visualization-flow.test.ts`
- [X] T030 [P] Documentation update for visualization capabilities in `README.md` and `docs/`
- [X] T031 [P] Implement 'View Source Data' toggle support and data structure mapping (FR-007) in `lib/research/visualizer.ts`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: Can start immediately.
- **Foundational (Phase 2)**: Depends on Phase 1 completion.
- **User Stories (Phases 3, 4, 5)**: Depend on Foundational completion. US1, US2, and US3 can proceed in parallel once the base Visualizer structure is in place.
- **Polish (Phase 6)**: Depends on all user stories completion.

### Parallel Opportunities

- T002 and T003 (Dependencies and Test Setup).
- T005, T006, and T008 (Foundational types, helpers, and test setup).
- All [P] marked tests for different user stories can run in parallel.
- US1, US2, and US3 logic can be developed in parallel after T007.

---

## Implementation Strategy

### MVP First (User Story 1 & 2)

1. Complete Setup & Foundation.
2. Complete US1 (Charts) and US2 (Tables) as these provide the core value.
3. Validate with basic research snippets.

### Incremental Delivery

1. Foundation → Detection framework ready.
2. US1 → Mermaid charts capability.
3. US2 → Comparison tables capability.
4. US3 → Reliability and constraints (Gates/Fallbacks).
5. Polish → Final integration and branding.
