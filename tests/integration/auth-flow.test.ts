import { describe, it, expect, vi, beforeEach } from 'vitest'
import { login } from '@/lib/actions/auth'
import * as supabaseServer from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn(),
}))

vi.mock('next/navigation', () => ({
  redirect: vi.fn(),
}))

describe('Auth Flow: Login Integration', () => {
  const mockSupabase = {
    auth: {
      signInWithPassword: vi.fn(),
    },
  }

  beforeEach(() => {
    vi.clearAllMocks()
    ;(supabaseServer.createClient as any).mockResolvedValue(mockSupabase)
  })

  it('should redirect to dashboard on successful login', async () => {
    const formData = new FormData()
    formData.append('email', 'test@example.com')
    formData.append('password', 'password123')

    mockSupabase.auth.signInWithPassword.mockResolvedValue({
      data: { user: { id: '123' } },
      error: null,
    })

    await login(formData)

    expect(mockSupabase.auth.signInWithPassword).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'password123',
    })
    expect(redirect).toHaveBeenCalledWith('/dashboard')
  })

  it('should return error on invalid credentials', async () => {
    const formData = new FormData()
    formData.append('email', 'test@example.com')
    formData.append('password', 'wrongpassword')

    mockSupabase.auth.signInWithPassword.mockResolvedValue({
      data: { user: null },
      error: { message: 'Invalid login credentials' },
    })

    const result = await login(formData)

    expect(result).toEqual({ success: false, error: 'Invalid login credentials' })
    expect(redirect).not.toHaveBeenCalled()
  })
})
