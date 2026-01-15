# Feature Specification: Human-in-the-Loop Interaction (Plan Confirmation)

**Feature Branch**: `005-plan-confirmation`  
**Created**: 2026-01-15  
**Status**: Draft  
**Input**: User description: "Human-in-the-Loop Interaction (Plan Confirmation): 에이전트가 수립한 계획을 사용자가 검토하고 승인/수정하는 프로세스. 계획 승인 대기 상태 처리, 사용자 피드백 반영 및 계획 수정 로직, Auto-Pilot 모드 토글 처리를 포함합니다."

## Clarifications

### Session 2026-01-15
- Q: Modification Workflow → A: Feedback-First (LLM regeneration) with manual overrides.
- Q: Feedback Iteration Limit → A: Unlimited iterations.
- Q: Plan Expiration → A: Persistent (Indefinite pending state).
- Q: Preservation of Manual Edits → A: Overwrite with Warning (LLM regeneration replaces manual edits).
- Q: Plan Version History → A: Current Only (No history/revert).

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Review and Approve Research Plan (Priority: P1)

After the Agent (Planner) analyzes a query and creates a set of sub-tasks (research plan), the system pauses and presents the plan to the user for confirmation. The user reviews the plan to ensure it covers their intent and approves it to start the research.

**Why this priority**: Core safety and alignment mechanism (Principle 5: Human-in-the-Loop). Ensures the agent doesn't waste resources on an incorrect path.

**Independent Test**: Can be fully tested by submitting a query, waiting for the plan to appear, and clicking "Approve". Delivers value by giving user control over agent behavior.

**Acceptance Scenarios**:

1. **Given** a research plan has been generated, **When** the user views the plan, **Then** the system MUST display all sub-tasks clearly.
2. **Given** a plan is in "Pending Approval" state, **When** the user clicks "Approve", **Then** the system MUST transition the session to "Executing" state.

---

### User Story 2 - Edit Plan or Provide Feedback (Priority: P2)

If the user finds the plan lacking or irrelevant, they can provide feedback or directly modify the plan (add/remove/edit tasks). The agent then updates the plan accordingly.

**Why this priority**: Allows for steering the agent. Improves final output quality by incorporating human expertise.

**Independent Test**: Can be tested by providing a feedback text (e.g., "Focus more on price comparison") and verifying that the sub-tasks are updated.

**Acceptance Scenarios**:

1. **Given** a research plan is presented, **When** the user submits feedback text, **Then** the Agent MUST regenerate or update the sub-tasks based on that feedback.
2. **Given** a list of sub-tasks, **When** the user removes a specific task, **Then** that task MUST NOT be executed during the research phase.

---

### User Story 3 - Auto-Pilot Mode (Priority: P3)

For experienced users or routine queries, the user can toggle "Auto-Pilot" mode. When enabled, the system skips the plan confirmation step and proceeds directly to execution.

**Why this priority**: Enhances efficiency for power users (Principle 4: Dual-Mode Operation).

**Independent Test**: Can be tested by toggling Auto-Pilot "ON" and submitting a query; the system should move to "Executing" without pausing.

**Acceptance Scenarios**:

1. **Given** Auto-Pilot is toggled "ON", **When** a query is submitted, **Then** the system MUST NOT wait for user approval after planning.
2. **Given** Auto-Pilot is "OFF" by default, **When** a session starts, **Then** the system MUST default to requiring plan approval.

---

### Edge Cases

- **Timeout on Approval**: The system MUST persist the pending state indefinitely. Sessions will not auto-expire or cancel while waiting for plan approval, allowing users to return to the task at any time.
- **Empty Plan**: How does the system handle an agent failing to generate any sub-tasks? It must notify the user and allow for manual task entry or re-generation.
- **Conflict in Feedback**: If user feedback contradicts the core objective, the system should ask for clarification.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST support a "Pending Approval" state for research sessions.
- **FR-002**: System MUST display a structured list of sub-tasks to the user for review.
- **FR-003**: System MUST provide a mechanism for users to approve the plan.
- **FR-004**: System MUST allow users to input text feedback which triggers LLM regeneration of the plan (supports unlimited iterations). The system MUST warn the user that regeneration will overwrite any existing manual edits.
- **FR-005**: System MUST allow manual addition, deletion, or reordering of sub-tasks as final overrides after any regeneration.
- **FR-006**: System MUST treat Auto-Pilot as a per-session setting. It defaults to OFF for 'Deep Probe' sessions and ON for 'Quick Scan' sessions to satisfy Principle IV.
- **FR-007**: System MUST prevent transition to execution phase if the plan is empty.

### Key Entities *(include if feature involves data)*

- **ResearchPlan**: Represents the collection of tasks to be performed. Attributes: sub-tasks (list of strings/objects), status (Draft, Pending, Approved), version.
- **UserFeedback**: Represents the input provided by the user during the planning phase.
- **SessionSettings**: Includes the Auto-Pilot toggle state.

## Constitution Adherence

- **Principle II (Verifiable Reliability)**: This feature allows users to verify the agent's intended sources and search queries *before* execution, preventing the agent from pursuing irrelevant or unreliable paths.
- **Principle V (Human-in-the-Loop)**: This feature is the primary implementation of Principle V, ensuring human oversight is available for all deep research tasks.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can review and approve/edit a plan in under 45 seconds on average.
- **SC-002**: Zero sessions proceed to execution without explicit approval when Auto-Pilot is OFF.
- **SC-003**: 90% of sessions where feedback was provided result in a final report that the user rates as "accurate" or "helpful".
- **SC-004**: Plan regeneration based on feedback takes less than 5 seconds.