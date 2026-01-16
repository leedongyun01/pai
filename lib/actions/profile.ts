'use server'

import { createClient } from '@/lib/supabase/server'
import { nicknameSchema, passwordSchema } from '@/lib/schemas/profile'
import { ActionResponse } from '@/lib/types/profile'
import { revalidatePath } from 'next/cache'

export async function updateNickname(formData: FormData): Promise<ActionResponse> {
  const supabase = await createClient()
  
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    return { success: false, message: "Not authenticated" }
  }

  const rawData = Object.fromEntries(formData.entries())
  const validated = nicknameSchema.safeParse(rawData)

  if (!validated.success) {
    return {
      success: false,
      message: "Validation error",
      errors: validated.error.flatten().fieldErrors,
    }
  }

  const { display_name } = validated.data

  const { error: dbError } = await supabase
    .from('profiles')
    .update({ display_name })
    .eq('id', user.id)

  if (dbError) {
    return { success: false, message: dbError.message }
  }

  revalidatePath('/dashboard/account')
  return { success: true, message: "Nickname updated" }
}

export async function changePassword(formData: FormData): Promise<ActionResponse> {
  const supabase = await createClient()

  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    return { success: false, message: "Not authenticated" }
  }

  const rawData = Object.fromEntries(formData.entries())
  const validated = passwordSchema.safeParse(rawData)

  if (!validated.success) {
    return {
      success: false,
      message: "Validation error",
      errors: validated.error.flatten().fieldErrors,
    }
  }

  const { currentPassword, newPassword } = validated.data

  // FR-003: Verify current password via re-auth
  const { error: reAuthError } = await supabase.auth.signInWithPassword({
    email: user.email!,
    password: currentPassword,
  })

  if (reAuthError) {
    return { success: false, message: "Incorrect current password" }
  }

  // Update password
  const { error: updateError } = await supabase.auth.updateUser({
    password: newPassword,
  })

  if (updateError) {
    return { success: false, message: updateError.message }
  }

  // Session termination upon successful password change
  await supabase.auth.signOut()
  
  return { success: true, message: "Password updated successfully. Please login again." }
}
