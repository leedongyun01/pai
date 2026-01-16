'use client'

import { useActionState } from 'react'
import { updateNickname } from '@/lib/actions/profile'
import { ActionResponse } from '@/lib/types/profile'

interface DisplayNameFormProps {
  initialName: string | null
}

export function DisplayNameForm({ initialName }: DisplayNameFormProps) {
  const [state, action, isPending] = useActionState<ActionResponse, FormData>(
    async (prevState, formData) => {
      return await updateNickname(formData)
    },
    { success: false }
  )

  return (
    <form action={action} className="space-y-4 p-4 border rounded-lg bg-white shadow-sm">
      <h3 className="text-lg font-semibold">닉네임 변경</h3>
      <div>
        <label htmlFor="display_name" className="block text-sm font-medium text-gray-700">
          표시될 이름
        </label>
        <input
          type="text"
          name="display_name"
          id="display_name"
          defaultValue={initialName || ''}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          required
        />
        {state.errors?.display_name && (
          <p className="mt-1 text-sm text-red-600">{state.errors.display_name[0]}</p>
        )}
      </div>

      {state.message && (
        <p className={`text-sm ${state.success ? 'text-green-600' : 'text-red-600'}`}>
          {state.message === "Nickname updated" ? "닉네임이 성공적으로 업데이트되었습니다." : state.message}
        </p>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
      >
        {isPending ? '업데이트 중...' : '닉네임 업데이트'}
      </button>
    </form>
  )
}
