# Quickstart: Plan Confirmation

## Testing Workflow (UI)

### 1. Manual Approval
1. Open the app and enter a complex research query.
2. Wait for the analysis and planning to complete.
3. Observe the "Research Plan" displayed with "Approve & Start Research" button.
4. Click "Approve & Start Research".
5. Verify the session transitions to "executing" and eventually "completed".

### 2. Feedback & Regeneration
1. Start a session, wait for the plan to appear.
2. Enter feedback in the text area (e.g., "Add more steps for cost analysis").
3. Click "Update Plan".
4. Verify the rationale and steps are updated.
5. Rate the regeneration using 👍/👎 buttons.

### 3. Manual Step Removal
1. Start a session, wait for the plan to appear.
2. Hover over a plan step and click the "✕" button.
3. Verify the step is removed from the list.
4. Observe the "Modified manually" indicator.
5. If you try to "Update Plan" now, verify the warning message appears.

### 4. Auto-Pilot Toggle
1. Toggle the "Auto-Pilot" switch in the header.
2. Start a new research session.
3. Verify it skips the "review_pending" state and goes straight to "executing".

## Testing Workflow (API)

### 1. Manual Approval
1. Start a new research session.
2. Wait until status is `review_pending`.
3. Call `POST /api/research/{id}/approve`.
4. Verify session status is `executing`.

### 2. Feedback Loop
1. Start session, wait for `review_pending`.
2. Call `POST /api/research/{id}/feedback` with `{"feedback": "Focus more on X"}`.
3. Verify status transitions: `review_pending` -> `planning` -> `review_pending` (with new steps).

### 3. Manual Override
1. Start session, wait for `review_pending`.
2. Call `POST /api/research/{id}/modify` with a modified steps array.
3. Verify the plan reflects changes and execute it.

## Integration Tests
Run `npx vitest tests/integration/plan-confirmation.test.ts`.
