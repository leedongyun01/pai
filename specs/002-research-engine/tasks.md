---
description: "Task list for Research Engine feature implementation"
---

# Tasks: Research Engine

**Input**: Design documents from `/specs/002-research-engine/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/api.yaml

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- File paths are relative to repository root

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and environment setup

- [X] T001 Create project structure: `lib/research/`, `tests/unit/research/`, `tests/integration/research/`
- [X] T002 Install dependencies: `p-limit`, `zod`
- [X] T003 Setup `TAVILY_API_KEY` in `.env.local` and configure it in the application environment

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure and types that MUST be complete before ANY user story work begins

- [X] T004 Define core domain types (SearchQuery, ResearchResult, ResearchSession) in `lib/research/types.ts` per data-model.md
- [X] T005 Implement Zod validation schemas for research entities in `lib/research/types.ts`
- [X] T006 [P] Configure base error handling classes for Research Engine in `lib/research/engine.ts`
- [X] T007 [P] Create mock Tavily response data in `tests/mocks/tavily.json`

**Checkpoint**: Foundation ready - user story implementation can now begin

---

## Phase 3: User Story 1 - Automated Information Gathering (Priority: P1) 🎯 MVP

**Goal**: Execute web searches for multiple queries and extract cleaned text content.

**Independent Test**: Provide 3 queries to the engine; verify it returns at least 3 unique cleaned documents with correct source URLs and titles.

### Tests for User Story 1 (Required per plan.md)

- [X] T008 [P] [US1] Create unit tests for Tavily scraper in `tests/unit/research/scraper.test.ts`
- [X] T009 [P] [US1] Create integration tests for Research Engine orchestration in `tests/integration/research/engine.test.ts`

### Implementation for User Story 1

- [X] T010 [P] [US1] Implement Tavily Search & Extract wrapper in `lib/research/scraper.ts`
- [X] T011 [US1] Implement parallel research orchestration logic in `lib/research/engine.ts` using `p-limit`
- [X] T012 [US1] Implement API endpoint `POST /api/research/[id]/execute` in `app/api/research/[id]/execute/route.ts`
- [X] T013 [US1] Update API endpoint `GET /api/research/[id]` in `app/api/research/[id]/route.ts` to return research results
- [X] T014 [US1] Integrate engine with `lib/storage/session-store.ts` to persist results and status

**Checkpoint**: MVP complete - Research Engine can perform searches and extract content.

---

## Phase 4: User Story 2 - Robust Error Handling (Priority: P2)

**Goal**: Handle network failures, dead links (404s), and oversized pages gracefully.

**Independent Test**: Run research on a list containing a dead URL and a very large page; verify the session completes with error logs for failures and truncated content for the large page.

### Tests for User Story 2

- [X] T015 [P] [US2] Add test cases for 404 and timeout handling to `tests/unit/research/scraper.test.ts`
- [X] T016 [P] [US2] Add test case for content length enforcement to `tests/integration/research/engine.test.ts`

### Implementation for User Story 2

- [X] T017 [US2] Implement retry logic and explicit timeout handling (FR-004) in `lib/research/scraper.ts`
- [X] T018 [US2] Implement binary/non-textual file identification and skip logic (FR-007) in `lib/research/scraper.ts`
- [X] T019 [US2] Enforce 20,000 character limit per extracted page (FR-006) in `lib/research/engine.ts`
- [X] T020 [US2] Add detailed error reporting to the session state in `lib/research/types.ts` and storage

**Checkpoint**: Reliability improved - System handles common web failures without crashing.

---

## Phase 5: User Story 3 - Content Quality Filtering (Priority: P3)

**Goal**: Ensure extracted content is high-quality and free of boilerplate noise.

**Independent Test**: Compare raw HTML output with researcher output for a known blog post; verify navigation and footer text are absent.

### Tests for User Story 3

- [X] T021 [P] [US3] Add tests for noise filtering and content relevance to `tests/unit/research/scraper.test.ts`

### Implementation for User Story 3

- [X] T022 [US3] Implement post-extraction content cleaning logic (whitespace normalization, junk removal) in `lib/research/scraper.ts`
- [X] T023 [US3] Implement relevance scoring/filtering based on query match in `lib/research/engine.ts`

**Checkpoint**: Quality improved - Extracted data is clean and highly relevant.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Documentation, final verification, and performance tuning.

- [X] T024 [P] Update `GEMINI.md` with Research Engine implementation status
- [X] T025 Perform final code review for type safety and project conventions
- [X] T026 [P] Verify `SC-002` (performance) by running benchmark in `tests/integration/performance.test.ts`
- [X] T027 Run full validation against `specs/002-research-engine/quickstart.md`