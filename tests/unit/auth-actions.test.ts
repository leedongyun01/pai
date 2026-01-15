import { describe, it, expect, vi, beforeEach } from 'vitest'
import { signup } from '@/lib/actions/auth'
import * as supabaseServer from '@/lib/supabase/server'

vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn(),
}))

describe('Auth Actions: Signup', () => {
  const mockSupabase = {
    auth: {
      signUp: vi.fn(),
    },
  }

  beforeEach(() => {
    vi.clearAllMocks()
    ;(supabaseServer.createClient as any).mockResolvedValue(mockSupabase)
  })

  it('should call signUp with correct credentials', async () => {
    const formData = new FormData()
    formData.append('email', 'test@example.com')
    formData.append('password', 'password123')
    formData.append('displayName', 'Test User')

    mockSupabase.auth.signUp.mockResolvedValue({
      data: { user: { id: '123' } },
      error: null,
    })

    const result = await signup(formData)

    expect(mockSupabase.auth.signUp).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'password123',
      options: {
        data: {
          display_name: 'Test User',
        },
      },
    })
    expect(result).toEqual({ success: true })
  })

  it('should return error if signUp fails', async () => {
    const formData = new FormData()
    formData.append('email', 'test@example.com')
    formData.append('password', 'password123')

    mockSupabase.auth.signUp.mockResolvedValue({
      data: { user: null },
      error: { message: 'Signup failed' },
    })

    const result = await signup(formData)

    expect(result).toEqual({ success: false, error: 'Signup failed' })
  })
})
