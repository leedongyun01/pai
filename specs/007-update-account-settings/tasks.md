# Tasks: 007-update-account-settings

**Input**: Design documents from `/specs/007-update-account-settings/`
**Prerequisites**: plan.md (required), spec.md (required), research.md, data-model.md, contracts/

**Tests**: Vitest unit tests and integration tests are included as per plan and project conventions.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [X] T001 Initialize settings page directory structure in `app/(protected)/dashboard/account/`
- [X] T002 [P] Create Zod schemas for display name and password validation in `lib/schemas/profile.ts`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [X] T003 [P] Define `ActionResponse` and profile-related types in `lib/types/profile.ts`
- [X] T004 [P] Create server action shells for `updateNickname` and `changePassword` in `lib/actions/profile.ts`
- [X] T005 [P] Setup base integration test file for settings page in `tests/integration/settings.test.ts`

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Update Display Name (Priority: P1) 🎯 MVP

**Goal**: Allow authenticated users to update their public display name.

**Independent Test**: Update name via `DisplayNameForm`, verify immediate UI update, and confirm record update in `public.profiles` table.

### Tests for User Story 1

- [X] T006 [P] [US1] Create unit tests for `updateNickname` server action in `tests/unit/profile-actions.test.ts`
- [X] T007 [P] [US1] Add integration test for display name update flow in `tests/integration/settings.test.ts`

### Implementation for User Story 1

- [X] T008 [US1] Implement `updateNickname` server action in `lib/actions/profile.ts` (updates `display_name` in `public.profiles`)
- [X] T009 [P] [US1] Create `DisplayNameForm` component with validation in `components/profile/display-name-form.tsx`
- [X] T010 [US1] Integrate `DisplayNameForm` into the settings page `app/(protected)/dashboard/account/page.tsx`

**Checkpoint**: User Story 1 (Nickname Update) is fully functional and testable independently.

---

## Phase 4: User Story 2 - Reset/Change Password (Priority: P1)

**Goal**: Securely update user password by verifying the current password and forcing a re-login.

**Independent Test**: Change password via `PasswordForm`, verify automatic logout, and successful login with the new password.

### Tests for User Story 2

- [X] T011 [P] [US2] Create unit tests for `changePassword` server action in `tests/unit/profile-actions.test.ts`
- [X] T012 [P] [US2] Add integration test for password change flow in `tests/integration/settings.test.ts`

### Implementation for User Story 2

- [X] T013 [US2] Implement `changePassword` server action in `lib/actions/profile.ts` (verifies current password via re-auth, updates password, triggers `signOut`)
- [X] T014 [P] [US2] Create `PasswordForm` component with validation and confirmation in `components/profile/password-form.tsx`
- [X] T015 [US2] Integrate `PasswordForm` into the settings page `app/(protected)/dashboard/account/page.tsx`

**Checkpoint**: User Story 2 (Password Change) is fully functional and testable independently.

---

## Phase 5: Polish & Cross-Cutting Concerns

**Purpose**: UI/UX improvements and final validation.

- [X] T016 [P] Add loading states and success/error feedback (toast/alert) to all forms
- [X] T017 [P] Implement responsive layout for the settings page in `app/(protected)/dashboard/account/page.tsx`
- [X] T018 [P] Verify performance criteria: Display name update < 20s (SC-001) and validation response < 1s (SC-003)
- [X] T019 Run final validation against scenarios in `specs/007-update-account-settings/quickstart.md`
- [X] T020 [P] Cleanup unused imports and format all new files

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately.
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories.
- **User Stories (Phase 3+)**: All depend on Foundational phase completion.
- **Polish (Final Phase)**: Depends on all user stories being complete.

### User Story Dependencies

- **User Story 1 (P1)**: Independent.
- **User Story 2 (P1)**: Independent.

### Within Each User Story

- Write unit/integration tests first and ensure they fail.
- Implement server actions before UI components.
- Integrate UI components into the page last.

### Parallel Opportunities

- T002, T003, T004, and T005 can run in parallel.
- Once Phase 2 is complete, US1 (T006-T010) and US2 (T011-T015) can be implemented in parallel.
- All Polish tasks (T016-T019) can run in parallel once stories are functional.

---

## Parallel Example: User Story 1

```bash
# Implement logic and tests in parallel:
Task: "Create unit tests for updateNickname server action in tests/unit/profile-actions.test.ts"
Task: "Create DisplayNameForm component with validation in components/profile/display-name-form.tsx"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational
3. Complete Phase 3: User Story 1
4. **VALIDATE**: Test Display name update in the dashboard.

### Incremental Delivery

1. Foundation ready (Phase 2)
2. MVP: Display name update (Phase 3)
3. Security: Password change (Phase 4)
4. Polish (Phase 5)

---

## Notes

- **Password Verification**: Must use `signInWithPassword` for re-authentication before `updateUser` as per research.md.
- **Session Termination**: `supabase.auth.signOut()` must be called upon successful password change.
- **Display Name**: No uniqueness requirement, 2-50 characters.
