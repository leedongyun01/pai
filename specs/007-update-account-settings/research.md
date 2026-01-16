# Research: 007-update-account-settings

## Summary of Findings

The feature requires two distinct update flows: one for public profile metadata (display name) and one for authentication credentials (password). Both will be implemented using Supabase and Next.js Server Actions.

### 1. Display Name Update
- **Mechanism**: Direct update to the `public.profiles` table.
- **Security**: Controlled by RLS (Row Level Security) ensuring `auth.uid() = id`.
- **Validation**: 2-50 characters.
- **Persistence**: Updates the `display_name` column in the `profiles` table.

### 2. Password Change Flow
- **Challenge**: Supabase `updateUser` allows password changes without the current password if authenticated. To meet **FR-003**, we must manually verify the current password.
- **Solution**:
  1. Fetch the current user's email.
  2. Attempt a "re-authentication" using `supabase.auth.signInWithPassword({ email, password: currentPassword })`.
  3. If re-auth fails, return a "Current password incorrect" error.
  4. If re-auth succeeds, call `supabase.auth.updateUser({ password: newPassword })`.
  5. Immediately call `supabase.auth.signOut()` to invalidate the session across all tabs and redirect to the login page.
- **Edge Case**: If the user signed in via OAuth (Google/GitHub), they might not have a password. We should handle the case where `auth.users.encrypted_password` is null (though for this feature we assume standard email/password users).

### 3. Navigation & UX
- **Settings Page**: Located at `/dashboard/account`.
- **Feedback**: Use `sonner` or a similar toast library (check `package.json` for installed UI libraries).
- **Navigation**:
  - Nickname Update: Stay on page, update UI state.
  - Password Update: Redirect to `/login` with a "Password updated, please sign in again" message.

## Decision Log

| Decision | Rationale | Alternatives Considered |
|----------|-----------|-------------------------|
| Re-auth for Password | Ensures user intent and prevents session hijacking if someone leaves a tab open. | Direct `updateUser` (Rejected: violates FR-003). |
| Server Actions | Secure way to handle sensitive data like passwords without exposing them in client-side logs. | API Routes (Rejected: Server Actions are more idiomatic in Next.js 15+). |
| Inline Nickname Update | Better UX than a full page reload. | Redirect to profile (Rejected: Spec says stay on page). |

## Dependencies to Verify
- `lucide-react` (icons)
- `shadcn/ui` (components) - I'll check if it's already in the project.

## References
- [Supabase Auth Documentation - Update User](https://supabase.com/docs/reference/javascript/auth-updateuser)
- [Next.js Server Actions](https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations)
