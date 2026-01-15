# Feature Specification: Core Agent Orchestration

**Feature Branch**: `001-core-agent-orchestration`  
**Created**: 2026-01-15  
**Status**: Draft  
**Input**: User description: "@docs/recommendation.md 파일을 참고해서 001-core-agent-archestration 진행해봐."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Query Analysis & Mode Selection (Priority: P1)

As a user, when I input a research topic, I want the system to automatically analyze my intent and select the appropriate research strategy (Quick Scan vs. Deep Probe) so that I get the right depth of information without manual configuration.

**Why this priority**: This is the entry point of the entire system. Without correct mode selection, the subsequent planning and research will be inefficient or insufficient.

**Independent Test**: Can be tested by feeding various queries (simple vs. complex) and verifying that the "Analyzer" module outputs the correct mode and rationale without executing the full search.

**Acceptance Scenarios**:

1. **Given** a simple factual query (e.g., "Weather in Seoul"), **When** the analyzer runs, **Then** it selects 'Quick Scan' mode.
2. **Given** a complex analytical query (e.g., "Impact of AI on medical ethics"), **When** the analyzer runs, **Then** it selects 'Deep Probe' mode.
3. **Given** any query, **When** analysis is complete, **Then** the system transitions state from 'Idle' to 'Planning'.

---

### User Story 2 - Research Plan Generation (Priority: P1)

As a user (or the system), I need a concrete list of research steps generated based on the selected mode, so that the research process is structured and actionable.

**Why this priority**: The "Researcher" module needs a plan to execute. This translates the high-level goal into executable tasks.

**Independent Test**: Verify that for a given query and mode, the "Planner" outputs a structured JSON/Object containing specific search queries and analysis steps.

**Acceptance Scenarios**:

1. **Given** 'Quick Scan' mode is selected, **When** the planner runs, **Then** it generates a simple plan with 1-2 parallel search steps.
2. **Given** 'Deep Probe' mode is selected, **When** the planner runs, **Then** it generates a multi-stage plan (e.g., Search -> Analyze -> Cross-verify).
3. **Given** a generated plan, **When** inspected, **Then** each step has a clear type (Search, Read, Synthesize) and description.

---

### User Story 3 - State Management & Orchestration (Priority: P2)

As a developer/system, I need a robust state machine to track the agent's progress (Thinking, Planning, Waiting for Approval), so that the UI can reflect the current status and the system handles flow correctly.

**Why this priority**: Essential for the "Human-in-the-Loop" feature and UI feedback, though the core logic (US1, US2) can theoretically run statelessly for a simple script.

**Independent Test**: Simulate events (Plan Generated, Plan Approved, Error) and verify state transitions.

**Acceptance Scenarios**:

1. **Given** the agent is 'Planning', **When** the plan is generated successfully, **Then** the state transitions to 'ReviewPending' (if manual) or 'Executing' (if auto).
2. **Given** the agent is processing, **When** a critical error occurs, **Then** the state transitions to 'Error' with context.

### Edge Cases

- What happens when the query is nonsense or empty? (Should return validation error or 'Clarification Needed' state).
- How does the system handle extremely long queries? (Truncate or summarize before analysis).

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST accept a text string as the user's research goal.
- **FR-002**: The Analyzer MUST classify the query complexity and select either 'Quick Scan' or 'Deep Probe' mode.
- **FR-003**: The Analyzer MUST provide a brief one-sentence text rationale for the mode selection.
- **FR-004**: The Planner MUST generate a sequence of tasks (ResearchPlan) based on the query and mode.
- **FR-005**: In 'Quick Scan' mode, the plan MUST prioritize breadth and recent data (limit steps to ~3).
- **FR-006**: In 'Deep Probe' mode, the plan MUST include steps for finding opposing views or cross-verification.
- **FR-007**: The Orchestrator MUST expose the current state (Idle, Analyzing, Planning, ReviewPending, Executing, Completed, Error).
  - Note: Transition to `ReviewPending` is skipped in 'Quick Scan' mode (auto-execute), but mandatory in 'Deep Probe' mode.
- **FR-008**: The system MUST allow overriding the automatically selected mode via API input (for future UI toggle support).
- **FR-009**: The Orchestrator MUST support concurrent sessions by using unique UUIDs for each ResearchSession, ensuring file-based storage path isolation.

## Clarifications

### Session 2026-01-15
- Q: Which mechanism should be used for persisting ResearchSession and ResearchPlan data? → A: File-based JSON storage.
- Q: How should the system determine if a Research Plan requires manual user approval? → A: Mode-based (Quick Scan: Auto, Deep Probe: Manual).
- Q: What specific LLM provider and model class should be the default? → A: Google Gemini Flash.
- Q: How should the system handle concurrent research sessions? → A: Stateless per-request UUIDs (each session is its own file).
- Q: What is the format for the "Research Strategy Rationale"? → A: One-sentence justification.

### Key Entities *(include if feature involves data)*

- **ResearchSession**:
  - `id`: UUID
  - `query`: String
  - `mode`: Enum (QUICK_SCAN, DEEP_PROBE)
  - `status`: Enum (IDLE, ANALYZING, PLANNING, REVIEW_PENDING, EXECUTING, COMPLETED, ERROR)
  - `persistence`: Saved as JSON in a local `.data/` directory.
  - `createdAt`: Timestamp

- **ResearchPlan**:
  - `sessionId`: UUID
  - `rationale`: String
  - `steps`: List[PlanStep]

- **PlanStep**:
  - `stepId`: Integer/UUID
  - `type`: Enum (SEARCH, BROWSE, ANALYZE)
  - `description`: String
  - `searchQueries`: List[String] (optional)

### Non-Functional Requirements

- **NFR-001**: **Latency**: LLM-based analysis and planning steps MUST target < 3 seconds per turn.
- **NFR-002**: **Security**: API keys for LLM providers MUST NOT be hardcoded and should be loaded via `.env`.

### Technical Constraints

- **LLM Provider**: Google Gemini Flash (default for Analyzer/Planner).
- **Storage**: Local filesystem JSON (`.data/` directory).

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: **Latency**: Plan generation (Analysis + Planning) completes in under 5 seconds for 95% of queries.
- **SC-002**: **Accuracy**: Mode selection matches a pre-labeled test set of 50 queries with at least 90% accuracy.
- **SC-003**: **Structure**: 100% of generated plans contain at least one valid search step with executable queries.
- **SC-004**: **Reliability**: State machine handles valid transitions without raising illegal state exceptions in 100% of test flows.
