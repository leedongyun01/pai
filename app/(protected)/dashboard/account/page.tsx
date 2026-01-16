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
        <section className="bg-gray-50 p-6 rounded-md">
          <h2 className="text-xl font-semibold mb-4">계정 정보</h2>
          <div className="space-y-2 text-sm text-gray-600">
            <p><strong>이메일:</strong> {user.email}</p>
            <p><strong>사용자 ID:</strong> {user.id}</p>
            <p><strong>최근 로그인:</strong> {user.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleString() : 'N/A'}</p>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">공개 프로필</h2>
          <DisplayNameForm initialName={profile?.display_name || ''} />
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">보안</h2>
          <PasswordForm />
        </section>
      </div>
    </div>
  )
}
