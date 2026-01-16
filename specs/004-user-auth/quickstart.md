# Quickstart: User Authentication

## Prerequisites
- Supabase Project URL and Anon Key.
- GitHub OAuth App configured (optional for basic testing).

## Setup
1. Add environment variables to `.env.local`:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your-project-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   ```
2. Run database migrations (see `data-model.md` for schema).
3. Install dependencies:
   ```bash
   npm install @supabase/supabase-js @supabase/ssr
   ```

## Local Development
1. Start the development server: `npm run dev`.
2. Navigate to `/login` to sign up or log in.
3. Protected routes will redirect you to `/login` if not authenticated.

## Testing
- **Unit**: Test auth utility functions.
- **Integration**: Test login/signup flow with a mock Supabase client or a test project.
- **End-to-End**: Use Playwright/Cypress to verify redirection and session persistence.
