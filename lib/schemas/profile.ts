import { z } from "zod";

export const nicknameSchema = z.object({
  display_name: z.string()
    .min(2, "Nickname must be at least 2 characters")
    .max(50, "Nickname must be at most 50 characters")
});

export const passwordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z.string().min(8, "New password must be at least 8 characters"),
  confirmPassword: z.string()
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export type NicknameFormValues = z.infer<typeof nicknameSchema>;
export type PasswordFormValues = z.infer<typeof passwordSchema>;
