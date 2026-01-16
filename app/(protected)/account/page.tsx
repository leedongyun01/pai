import { createClient } from '@/lib/supabase/server'
import { DisplayNameForm } from '@/components/profile/display-name-form'
import { PasswordForm } from '@/components/profile/password-form'
import { redirect } from 'next/navigation'

export default async function AccountSettingsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('display_name')
    .eq('id', user.id)
    .single()

  return (
    <div className="max-w-4xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold mb-8">계정 설정</h1>
      
      <div className="space-y-8">
        <section className="bg-gray-50 p-6 rounded-md shadow-sm">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">기본 정보</h2>
          <div className="space-y-3 text-sm text-gray-600">
            <p><span className="font-bold w-24 inline-block">이메일:</span> {user.email}</p>
            <p><span className="font-bold w-24 inline-block">사용자 ID:</span> {user.id}</p>
            <p><span className="font-bold w-24 inline-block">최근 로그인:</span> {user.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleString() : 'N/A'}</p>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4 text-gray-800">프로필 설정</h2>
          <DisplayNameForm initialName={profile?.display_name || ''} />
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4 text-gray-800">보안 및 비밀번호</h2>
          <PasswordForm />
        </section>
      </div>
    </div>
  )
}
