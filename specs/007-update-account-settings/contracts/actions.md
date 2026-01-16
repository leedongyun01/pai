# Server Action Contracts: 007-update-account-settings

## Profile Actions

### `updateNickname(formData: FormData): Promise<ActionResponse>`
Updates the authenticated user's display name.

- **Input**: `display_name` (string)
- **Rules**: Must be authenticated. Validates length (2-50).
- **Success**: Returns `{ success: true, message: "Nickname updated" }`.
- **Error**: Returns `{ success: false, message: "Validation error" }`.

### `changePassword(formData: FormData): Promise<ActionResponse>`
Updates the authenticated user's password.

- **Input**: `currentPassword` (string), `newPassword` (string)
- **Rules**: 
  1. Must be authenticated.
  2. Verify `currentPassword` via re-auth.
  3. Validates `newPassword` length (min 8).
- **Success**: Returns `{ success: true }` and triggers `signOut()`.
- **Error**: Returns `{ success: false, message: "Incorrect password" | "Complexity error" }`.

## Types

```typescript
type ActionResponse = {
  success: boolean;
  message?: string;
  errors?: Record<string, string[]>;
};
```
