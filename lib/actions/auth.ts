'use server'

import { createClient } from '@/lib/supabase/server'
import { signupSchema, loginSchema } from '@/lib/schemas/auth'
import { redirect } from 'next/navigation'

export async function signup(formData: FormData) {
  const supabase = await createClient()

  const rawData = Object.fromEntries(formData.entries())
  const validated = signupSchema.safeParse(rawData)

  if (!validated.success) {
    return {
      success: false,
      error: validated.error.issues[0]?.message || 'Invalid input',
    }
  }

  const { email, password, displayName } = validated.data
  const trimmedEmail = email.trim().toLowerCase()
  const trimmedPassword = password.trim()

  console.log('Signup Attempt Details:')
  console.log('- Raw Email:', email)
  console.log('- Trimmed/Lowered Email:', trimmedEmail)
  console.log('- Email Length:', trimmedEmail.length)
  console.log('- Email Hex:', Buffer.from(trimmedEmail).toString('hex'))

  const { data, error } = await supabase.auth.signUp({
    email: trimmedEmail,
    password: trimmedPassword,
    options: {
      data: {
        display_name: displayName,
      },
    },
  })

  if (error) {
    console.error('Supabase signup error:', error)
    return {
      success: false,
      error: error.message,
    }
  }

  return { success: true }
}

export async function login(formData: FormData) {
  const supabase = await createClient()

  const rawData = Object.fromEntries(formData.entries())
  const validated = loginSchema.safeParse(rawData)

  if (!validated.success) {
    return {
      success: false,
      error: validated.error.issues[0]?.message || 'Invalid input',
    }
  }

  const { email, password } = validated.data

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return {
      success: false,
      error: error.message,
    }
  }

  redirect('/account')
}

export async function logout() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/login')
}

export async function signInWithGitHub() {
  const supabase = await createClient()
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'github',
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/auth/callback`,
    },
  })

  if (error) {
    return { success: false, error: error.message }
  }

  if (data.url) {
    redirect(data.url)
  }
}
