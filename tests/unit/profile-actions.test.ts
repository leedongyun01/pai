import { describe, it, expect, vi, beforeEach } from 'vitest'
import { updateNickname, changePassword } from '@/lib/actions/profile'
import * as supabaseServer from '@/lib/supabase/server'

vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn(),
}))

vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
}))

describe('Profile Actions: updateNickname', () => {
  const mockSupabase = {
    auth: {
      getUser: vi.fn(),
    },
    from: vi.fn(),
  }

  beforeEach(() => {
    vi.clearAllMocks()
    ;(supabaseServer.createClient as any).mockResolvedValue(mockSupabase)
  })

  it('should return error if not authenticated', async () => {
    mockSupabase.auth.getUser.mockResolvedValue({ data: { user: null }, error: null })
    
    const formData = new FormData()
    formData.append('display_name', 'New Name')

    const result = await updateNickname(formData)

    expect(result.success).toBe(false)
    expect(result.message).toBe('Not authenticated')
  })

  it('should return error if validation fails', async () => {
    mockSupabase.auth.getUser.mockResolvedValue({ data: { user: { id: '123' } }, error: null })
    
    const formData = new FormData()
    formData.append('display_name', 'a') // Too short

    const result = await updateNickname(formData)

    expect(result.success).toBe(false)
    expect(result.errors).toBeDefined()
  })

  it('should update nickname successfully', async () => {
    mockSupabase.auth.getUser.mockResolvedValue({ data: { user: { id: '123' } }, error: null })
    
    const mockUpdate = vi.fn().mockReturnValue({
      eq: vi.fn().mockResolvedValue({ error: null })
    })
    mockSupabase.from.mockReturnValue({ update: mockUpdate })

    const formData = new FormData()
    formData.append('display_name', 'Valid Nickname')

    const result = await updateNickname(formData)

    expect(result.success).toBe(true)
    expect(result.message).toBe('Nickname updated')
    expect(mockSupabase.from).toHaveBeenCalledWith('profiles')
    expect(mockUpdate).toHaveBeenCalledWith({ display_name: 'Valid Nickname' })
  })
})

describe('Profile Actions: changePassword', () => {
  const mockSupabase = {
    auth: {
      getUser: vi.fn(),
      signInWithPassword: vi.fn(),
      updateUser: vi.fn(),
      signOut: vi.fn(),
    },
  }

  beforeEach(() => {
    vi.clearAllMocks()
    ;(supabaseServer.createClient as any).mockResolvedValue(mockSupabase)
  })

  it('should return error if not authenticated', async () => {
    mockSupabase.auth.getUser.mockResolvedValue({ data: { user: null }, error: null })
    
    const formData = new FormData()
    formData.append('currentPassword', 'old')
    formData.append('newPassword', 'newpassword123')
    formData.append('confirmPassword', 'newpassword123')

    const result = await changePassword(formData)

    expect(result.success).toBe(false)
    expect(result.message).toBe('Not authenticated')
  })

  it('should return error if current password re-auth fails', async () => {
    mockSupabase.auth.getUser.mockResolvedValue({ data: { user: { email: 'test@example.com' } }, error: null })
    mockSupabase.auth.signInWithPassword.mockResolvedValue({ error: { message: 'Invalid password' } })
    
    const formData = new FormData()
    formData.append('currentPassword', 'wrong')
    formData.append('newPassword', 'newpassword123')
    formData.append('confirmPassword', 'newpassword123')

    const result = await changePassword(formData)

    expect(result.success).toBe(false)
    expect(result.message).toBe('Incorrect current password')
  })

  it('should update password and sign out on success', async () => {
    mockSupabase.auth.getUser.mockResolvedValue({ data: { user: { email: 'test@example.com' } }, error: null })
    mockSupabase.auth.signInWithPassword.mockResolvedValue({ error: null })
    mockSupabase.auth.updateUser.mockResolvedValue({ error: null })
    mockSupabase.auth.signOut.mockResolvedValue({ error: null })

    const formData = new FormData()
    formData.append('currentPassword', 'correct')
    formData.append('newPassword', 'newpassword123')
    formData.append('confirmPassword', 'newpassword123')

    const result = await changePassword(formData)

    expect(result.success).toBe(true)
    expect(mockSupabase.auth.updateUser).toHaveBeenCalledWith({ password: 'newpassword123' })
    expect(mockSupabase.auth.signOut).toHaveBeenCalled()
  })
})
