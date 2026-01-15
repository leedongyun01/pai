---
description: "Task list for User Authentication with Supabase feature implementation"
---

# Tasks: User Authentication with Supabase

**Input**: Design documents from `/specs/004-user-auth/`
**Prerequisites**: plan.md, spec.md, data-model.md, contracts/api.yaml

**Tests**: Included as per project quality standards and `plan.md` (vitest).

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [x] T001 Create project structure per implementation plan (directories for (auth), (protected), lib/supabase, lib/actions)
- [x] T002 Configure Supabase project and local environment variables in `.env.local`
- [x] T003 [P] Install dependencies: `@supabase/supabase-js`, `@supabase/ssr`, `zod`, `lucide-react`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T004 Setup database schema: Create migration for `public.profiles` table in Supabase
- [x] T005 Setup database trigger: Create migration for auto-profile creation on `auth.users` insert
- [x] T006 [P] Implement Supabase browser client in `lib/supabase/client.ts`
- [x] T007 [P] Implement Supabase server client in `lib/supabase/server.ts`
- [x] T008 [P] Implement Supabase middleware client in `lib/supabase/middleware.ts`
- [x] T009 [P] Configure route protection and session refresh in `middleware.ts`

**Checkpoint**: Foundation ready - user story implementation can now begin

---

## Phase 3: User Story 2 - New User Registration (Priority: P1) 🎯 MVP

**Goal**: Allow new visitors to create an account and auto-generate their profile.

**Independent Test**: Sign up with a new email address and verify that a new user record is created in Supabase Auth and a matching record exists in `public.profiles`.

### Tests for User Story 2

- [x] T010 [P] [US2] Write unit tests for signup Server Action in `tests/unit/auth-actions.test.ts`

### Implementation for User Story 2

- [x] T011 [P] [US2] Create Zod schema for signup validation in `lib/schemas/auth.ts`
- [x] T012 [US2] Implement signup Server Action with profile synchronization in `lib/actions/auth.ts`
- [x] T013 [US2] Create Signup page UI with form validation in `app/(auth)/signup/page.tsx`

**Checkpoint**: User Story 2 should be fully functional and testable independently.

---

## Phase 4: User Story 1 - Secure Email/Password Login (Priority: P1) 🎯 MVP

**Goal**: Allow returning users to securely log in.

**Independent Test**: Attempt to log in with valid and invalid credentials. Success is reaching the dashboard on valid entry.

### Tests for User Story 1

- [x] T014 [P] [US1] Write integration tests for login flow in `tests/integration/auth-flow.test.ts`

### Implementation for User Story 1

- [x] T015 [P] [US1] Create Zod schema for login validation in `lib/schemas/auth.ts`
- [x] T016 [US1] Implement login Server Action in `lib/actions/auth.ts`
- [x] T017 [US1] Create Login page UI in `app/(auth)/login/page.tsx`

**Checkpoint**: User Story 1 should be fully functional and testable independently.

---

## Phase 5: User Story 3 - Secure Logout (Priority: P2)

**Goal**: Allow logged-in users to terminate their session securely.

**Independent Test**: Click logout and then attempt to access `/dashboard`, which should redirect back to `/login`.

### Implementation for User Story 3

- [x] T018 [US3] Implement logout Server Action in `lib/actions/auth.ts`
- [x] T019 [US3] Create protected Dashboard page in `app/(protected)/dashboard/page.tsx`
- [x] T020 [US3] Add logout button and session status display to Dashboard page

**Checkpoint**: User Story 3 should be fully functional and testable independently.

---

## Phase 6: User Story 4 - GitHub Social Authentication (Priority: P3)

**Goal**: Allow users to log in using their GitHub account.

**Independent Test**: Click GitHub login button and verify successful authentication through the GitHub flow.

### Implementation for User Story 4

- [x] T021 [US4] Configure GitHub OAuth provider in Supabase Dashboard and update `.env.local`
- [x] T022 [US4] Implement OAuth callback handler in `app/(auth)/auth/callback/route.ts`
- [x] T023 [US4] Add GitHub login button to Login and Signup pages

**Checkpoint**: User Story 4 should be functional.

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [x] T024 [P] Add loading states and detailed error feedback to all auth forms
- [x] T025 [P] Update navigation in root `layout.tsx` to reflect auth status (Login/Logout buttons)
- [x] T026 Code cleanup, refactoring, and documentation updates in `README.md`
- [x] T027 Run final verification against all success criteria in `spec.md`
- [x] T028 [P] Configure session persistence in `lib/supabase/client.ts` (Set `persistSession: true` as per FR-008)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately.
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories.
- **User Stories (Phase 3+)**: All depend on Foundational phase completion.
  - US2 (Signup) is recommended before US1 (Login) to provide a test user.
  - US3 (Logout) depends on the existence of a protected page and login capability.
- **Polish (Final Phase)**: Depends on all desired user stories being complete.

### Parallel Opportunities

- T003 (Dependencies), T006-T008 (Supabase clients) can run in parallel.
- Once Foundation is ready, US1, US2, and US4 can technically be developed in parallel, though US2 is the logical first step.
- Test tasks marked [P] can run in parallel with their respective story implementation.

---

## Implementation Strategy

### MVP First (User Story 1 & 2)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL)
3. Complete Phase 3: User Story 2 (Registration)
4. Complete Phase 4: User Story 1 (Login)
5. **VALIDATE**: Sign up a new user, log out, then log in again.

### Incremental Delivery

1. Foundation ready.
2. Add Registration (US2) -> Test profile creation.
3. Add Login (US1) -> Test session establishment.
4. Add Logout & Dashboard (US3) -> Test route protection.
5. Add GitHub OAuth (US4) -> Test social login.
