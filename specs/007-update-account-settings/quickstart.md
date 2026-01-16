# Quickstart: 007-update-account-settings

## Prerequisites
- Supabase local instance running or connected to a remote project.
- User profile created (via signup).

## Manual Testing Steps

### 1. Update Nickname
1. Log in to the application.
2. Navigate to `/dashboard/account`.
3. Locate the "Display Name" section.
4. Enter a new nickname (e.g., "Alice") and click "Save".
5. Verify the success message appears.
6. Refresh the page or navigate to the dashboard to see the updated name in the header.

### 2. Change Password
1. Log in to the application.
2. Navigate to `/dashboard/account`.
3. Locate the "Security" section.
4. Enter your current password.
5. Enter a new password (min 8 chars).
6. Click "Update Password".
7. Verify you are automatically logged out and redirected to `/login`.
8. Log in with the **new** password to confirm success.

## Error Case Testing
- Try saving a nickname with only 1 character (should show error).
- Try changing the password with an incorrect current password (should show error).
- Try setting a new password shorter than 8 characters (should show error).
