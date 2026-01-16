# Data Model: 007-update-account-settings

## Entities

### Profile (`public.profiles`)
Represents the user's public-facing information.

| Field | Type | Constraint | Description |
|-------|------|------------|-------------|
| `id` | `uuid` | PK, FK (auth.users) | Unique identifier (linked to Auth) |
| `display_name` | `text` | NOT NULL, 2-50 chars | User's nickname |
| `email` | `text` | NOT NULL | User's email (synced from Auth) |
| `avatar_url` | `text` | NULLABLE | URL to user's profile picture |
| `updated_at` | `timestamptz` | DEFAULT now() | Last update timestamp |

## Validation Rules (Zod)

### Nickname Schema
```typescript
const nicknameSchema = z.object({
  display_name: z.string()
    .min(2, "Nickname must be at least 2 characters")
    .max(50, "Nickname must be at most 50 characters")
});
```

### Password Schema
```typescript
const passwordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z.string().min(8, "New password must be at least 8 characters"),
  confirmPassword: z.string()
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});
```

## State Transitions

| Action | Current State | Trigger | New State |
|--------|---------------|---------|-----------|
| Update Nickname | Old Display Name | Submit Nickname Form | New Display Name (DB Update) |
| Change Password | Active Session | Submit Password Form (Valid) | Session Terminated (Logout) |
| Change Password | Active Session | Submit Password Form (Invalid) | Error Message (Stay Logged In) |
