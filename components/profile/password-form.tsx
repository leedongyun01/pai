'use client'

import { useActionState } from 'react'
import { changePassword } from '@/lib/actions/profile'
import { ActionResponse } from '@/lib/types/profile'

export function PasswordForm() {
  const [state, action, isPending] = useActionState<ActionResponse, FormData>(
    async (prevState, formData) => {
      const result = await changePassword(formData)
      if (result.success) {
        // Redirect to login is handled by the server action's signOut usually,
        // but since we are in a client component, we might want to force it
        // or the server action might trigger a redirect.
        window.location.href = '/login?message=' + encodeURIComponent('비밀번호가 업데이트되었습니다. 다시 로그인해주세요.')
      }
      return result
    },
    { success: false }
  )

  return (
    <form action={action} className="space-y-4 p-4 border rounded-lg bg-white shadow-sm">
      <h3 className="text-lg font-semibold">비밀번호 변경</h3>
      
      <div>
        <label htmlFor="currentPassword" record-id="" className="block text-sm font-medium text-gray-700">
          현재 비밀번호
        </label>
        <input
          type="password"
          name="currentPassword"
          id="currentPassword"
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          required
        />
        {state.errors?.currentPassword && (
          <p className="mt-1 text-sm text-red-600">{state.errors.currentPassword[0]}</p>
        )}
      </div>

      <div>
        <label htmlFor="newPassword" record-id="" className="block text-sm font-medium text-gray-700">
          새 비밀번호
        </label>
        <input
          type="password"
          name="newPassword"
          id="newPassword"
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          required
        />
        {state.errors?.newPassword && (
          <p className="mt-1 text-sm text-red-600">{state.errors.newPassword[0]}</p>
        )}
      </div>

      <div>
        <label htmlFor="confirmPassword" record-id="" className="block text-sm font-medium text-gray-700">
          새 비밀번호 확인
        </label>
        <input
          type="password"
          name="confirmPassword"
          id="confirmPassword"
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          required
        />
        {state.errors?.confirmPassword && (
          <p className="mt-1 text-sm text-red-600">{state.errors.confirmPassword[0]}</p>
        )}
      </div>

      {state.message && (
        <p className={`text-sm ${state.success ? 'text-green-600' : 'text-red-600'}`}>
          {state.message === "Incorrect current password" ? "현재 비밀번호가 일치하지 않습니다." : 
           state.message === "Password updated successfully. Please login again." ? "비밀번호가 성공적으로 변경되었습니다. 다시 로그인해주세요." : 
           state.message}
        </p>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
      >
        {isPending ? '업데이트 중...' : '비밀번호 변경'}
      </button>
    </form>
  )
}
