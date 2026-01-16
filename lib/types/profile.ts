export type ActionResponse = {
  success: boolean;
  message?: string;
  errors?: Record<string, string[]>;
};

export type Profile = {
  id: string;
  display_name: string | null;
  email: string;
  avatar_url: string | null;
  updated_at: string;
};
