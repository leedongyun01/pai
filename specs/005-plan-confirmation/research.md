# Research: Plan Confirmation (Human-in-the-Loop)

## Decision: Feedback-driven Regeneration
**Rationale**: Users provide text feedback (e.g., "focus more on X"). The Planner agent receives the original query, the current plan, and the feedback to generate an improved plan.
**Alternatives considered**: Manual editing only (Rejected because users might not know the best way to structure tasks for the agent).

## Decision: Explicit State Transitions for Feedback
**Rationale**: When feedback is provided, the session status moves from `review_pending` back to `planning`. This allows the UI to show a "Regenerating plan..." state.
**Verification**: Legal transitions in `orchestrator.ts` must be updated: `review_pending -> planning`.

## Decision: Manual Override Data Model
**Rationale**: Manual overrides (add/remove/edit steps) are handled as a direct state update to the `ResearchPlan.steps` array. This is the "final word" from the user.
**Consistency**: The UI will ensure each manual step conforms to the `PlanStep` schema.

## Best Practices: Auto-Pilot Persistence
**Decision**: Auto-Pilot is a per-session setting. It defaults to `false`.
**Rationale**: Safety first. Power users can toggle it per session, but we don't want global "forgetfulness" to cause unintended resource consumption.

## Implementation Patterns: Warning on Overwrite
**Pattern**: When the user provides text feedback *after* making manual edits, a warning modal must be shown.
**Technical detail**: The client-side should track "isDirty" for manual edits.
