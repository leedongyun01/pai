# Research: User Authentication with Supabase in Next.js 16

## Technical Context

- **Framework**: Next.js 16.1.2 (App Router)
- **Auth Provider**: Supabase Auth
- **Social Provider**: GitHub
- **Persistence**: Local Filesystem (for sessions, but Supabase handles Auth sessions)

## Unknowns & Clarifications

1. **Supabase Client**: Best way to handle SSR vs CSR clients in Next.js 16.
2. **Route Protection**: Middleware implementation for App Router.
3. **Profile Creation**: Preference for DB trigger vs API logic.
4. **GitHub OAuth**: Required configuration in Supabase dashboard and GitHub.

## Research Findings

### 1. Supabase Client in Next.js 16 (App Router)
Supabase provides `@supabase/ssr` for Next.js App Router.
- **Server Client**: Used in Server Components, Server Actions, and Route Handlers.
- **Browser Client**: Used in Client Components.
- **Middleware Client**: Used to refresh sessions.

### 2. Route Protection (Middleware)
Next.js Middleware is the standard way to protect routes. It should check the session and redirect to `/login` if not authenticated.
Supabase SSR documentation recommends a specific middleware pattern to ensure the session remains active by refreshing the token.

### 3. Profile Creation Pattern
**Decision**: Use a Postgres Trigger.
**Rationale**: More robust. Ensures that even if a user is created through the Supabase dashboard or another path, the profile record is created. Reduces application code complexity.
**Alternatives**: Create in Server Action after `signUp`. (Risk: if the action fails after signup, user exists without profile).

### 4. GitHub OAuth
Requires:
- GitHub OAuth App (Client ID, Client Secret).
- Redirect URI: `https://<project-id>.supabase.co/auth/v1/callback`.
- Supabase side: Enable GitHub provider, add secrets.
- App side: `signInWithOAuth({ provider: 'github' })`.

## Conclusions & Decisions

- **Auth Strategy**: Email/Password + GitHub OAuth.
- **Libraries**: `@supabase/supabase-js`, `@supabase/ssr`.
- **Profile Setup**: SQL migration for `profiles` table and trigger on `auth.users`.
- **Environment**: Need `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`.

## Rationale
Using `@supabase/ssr` is the official and most secure way to integrate Supabase with Next.js App Router, handling cookies correctly across server and client.
