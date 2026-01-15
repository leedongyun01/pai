# Data Model: User Authentication

## Entities

### `auth.users` (Supabase Internal)
*Managed by Supabase Auth.*

| Field | Type | Description |
| :--- | :--- | :--- |
| `id` | `uuid` | Primary Key (UID) |
| `email` | `string` | User email address |
| `created_at` | `timestamp` | Account creation time |

### `public.profiles`
*Extends user data with application-specific fields.*

| Field | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `uuid` | PK, FK (auth.users.id) | Matches Auth UID |
| `email` | `text` | NOT NULL | Mirrored email for easy access |
| `display_name` | `text` | | User's public name |
| `avatar_url` | `text` | | URL to user's profile image |
| `created_at` | `timestamp` | DEFAULT now() | |
| `updated_at` | `timestamp` | DEFAULT now() | |

## Relationships

- **User (1) <-> (1) Profile**: Every authenticated user has exactly one profile record in the public schema.

## Validation Rules

- **Email**: Must be a valid email format.
- **Password**: Minimum 8 characters (Supabase default).
- **Profile.id**: Must exist in `auth.users`.

## State Transitions

- **Signup**: `auth.users` created -> Trigger creates `public.profiles`.
- **Login**: Session established in cookies.
- **Logout**: Session cookie cleared.
