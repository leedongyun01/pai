import { createClient } from '@/lib/supabase/server'
import { logout } from '@/lib/actions/auth'
import { redirect } from 'next/navigation'

export default async function DashboardPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <div className="p-8 bg-white shadow-md rounded-lg w-full max-w-4xl">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">대시보드</h1>
          <form action={logout}>
            <button
              type="submit"
              className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              로그아웃
            </button>
          </form>
        </div>
        <div className="bg-gray-50 p-6 rounded-md">
          <h2 className="text-lg font-semibold mb-4">환영합니다, {user.user_metadata.display_name || user.email}님</h2>
          <div className="space-y-2 text-sm text-gray-600">
            <p><strong>이메일:</strong> {user.email}</p>
            <p><strong>사용자 ID:</strong> {user.id}</p>
            <p><strong>최근 로그인:</strong> {new Date(user.last_sign_in_at!).toLocaleString()}</p>
          </div>
        </div>
      </div>
    </div>
  )
}