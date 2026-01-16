import { describe, it, expect, vi, beforeEach } from 'vitest'
import { updateNickname, changePassword } from '@/lib/actions/profile'
import * as supabaseServer from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn(),
}))

vi.mock('next/navigation', () => ({
  redirect: vi.fn(),
}))

vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
}))

describe('Settings Page Integration', () => {
  const mockSupabase = {
    auth: {
      getUser: vi.fn(),
      signInWithPassword: vi.fn(),
      updateUser: vi.fn(),
      signOut: vi.fn(),
    },
    from: vi.fn(() => ({
      update: vi.fn(() => ({
        eq: vi.fn(() => Promise.resolve({ error: null })),
      })),
    })),
  }

  beforeEach(() => {
    vi.clearAllMocks()
    ;(supabaseServer.createClient as any).mockResolvedValue(mockSupabase)
  })

  it('should update nickname and return success', async () => {
    mockSupabase.auth.getUser.mockResolvedValue({ data: { user: { id: '123' } }, error: null })
    
    const formData = new FormData()
    formData.append('display_name', 'Integration Test Name')

    const result = await updateNickname(formData)

    expect(result.success).toBe(true)
    expect(result.message).toBe('Nickname updated')
    expect(mockSupabase.from).toHaveBeenCalledWith('profiles')
  })

  it('should return error if database update fails', async () => {
    mockSupabase.auth.getUser.mockResolvedValue({ data: { user: { id: '123' } }, error: null })
    
    const mockUpdate = vi.fn().mockReturnValue({
      eq: vi.fn().mockResolvedValue({ error: { message: 'DB Error' } })
    })
    mockSupabase.from.mockReturnValue({ update: mockUpdate })

    const formData = new FormData()
    formData.append('display_name', 'Integration Test Name')

    const result = await updateNickname(formData)

    expect(result.success).toBe(false)
    expect(result.message).toBe('DB Error')
  })

  it('should verify current password before updating', async () => {
    mockSupabase.auth.getUser.mockResolvedValue({ data: { user: { email: 'test@example.com' } }, error: null })
    mockSupabase.auth.signInWithPassword.mockResolvedValue({ error: { message: 'Invalid' } })

    const formData = new FormData()
    formData.append('currentPassword', 'wrong')
    formData.append('newPassword', 'newpassword123')
    formData.append('confirmPassword', 'newpassword123')

    const result = await changePassword(formData)

    expect(result.success).toBe(false)
    expect(result.message).toBe('Incorrect current password')
    expect(mockSupabase.auth.updateUser).not.toHaveBeenCalled()
  })
})
