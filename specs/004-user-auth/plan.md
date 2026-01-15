# Implementation Plan: User Authentication with Supabase

**Branch**: `004-user-auth` | **Date**: 2026-01-15 | **Spec**: `/specs/004-user-auth/spec.md`
**Input**: Feature specification from `/specs/004-user-auth/spec.md`

## Summary
Implement a robust authentication system using Supabase Auth. The solution includes Email/Password registration and login, GitHub OAuth integration, and secure route protection via Next.js Middleware. User profiles will be automatically synchronized using a database trigger.

## Technical Context

**Language/Version**: TypeScript 5.x (Next.js 16.1.2 environment)
**Primary Dependencies**: @supabase/supabase-js, @supabase/ssr, zod, lucide-react
**Storage**: Supabase (PostgreSQL)
**Testing**: vitest
**Target Platform**: Web (Next.js App Router)
**Project Type**: web
**Performance Goals**: Authentication interactions (login/logout) < 1s response time.
**Constraints**: Must use secure, server-side cookies for session management.
**Scale/Scope**: Core authentication module for ProbeAI.

## Constitution Check

| Principle | Adherence |
| :--- | :--- |
| I. Autonomous Execution | Plan covers full implementation from DB schema to UI. |
| II. Verifiable Reliability | Uses official Supabase SSR libraries for secure session handling. |
| III. Adaptive Visualization | N/A for auth flow. |
| IV. Dual-Mode Operation | N/A. |
| V. Human-in-the-Loop | This plan is submitted for review before implementation. |

## Project Structure

### Documentation (this feature)

```text
specs/004-user-auth/
├── plan.md              # This file
├── research.md          # Research findings (Supabase SSR, GitHub OAuth)
├── data-model.md        # Profiles schema and triggers
├── quickstart.md        # Setup guide
├── contracts/
│   └── api.yaml         # Auth endpoints contract
└── checklists/
    └── requirements.md  # Verification checklist
```

### Source Code (repository root)

```text
app/
├── (auth)/               # Auth-related routes
│   ├── login/
│   │   └── page.tsx      # Login UI
│   ├── signup/
│   │   └── page.tsx      # Signup UI
│   └── auth/
│       └── callback/
│           └── route.ts  # OAuth callback handler
├── (protected)/          # Protected routes
│   └── dashboard/
│       └── page.tsx
└── layout.tsx

lib/
├── supabase/
│   ├── client.ts         # Browser client
│   ├── server.ts         # Server client
│   └── middleware.ts     # Session refresh logic
└── actions/
    └── auth.ts           # Server Actions for login/signup/logout

middleware.ts             # Route protection middleware
```

**Structure Decision**: Using Next.js App Router with Route Groups (`(auth)`, `(protected)`) for clean organization and shared layouts.

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
| :--- | :--- | :--- |
| Database Trigger | Auto-profile creation | Application logic is prone to race conditions or partial failures. |