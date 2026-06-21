import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { ChangePasswordForm } from '@/components/account/ChangePasswordForm'

export default async function AccountPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  return (
    <div className="mx-auto max-w-lg px-4 py-16">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-text-main">Minha conta</h1>
        <p className="mt-2 text-muted-foreground">{user.email}</p>
      </div>

      <div className="rounded-xl border bg-card p-6 shadow-sm">
        <h2 className="font-semibold text-text-main mb-4">Alterar senha</h2>
        <ChangePasswordForm />
      </div>
    </div>
  )
}
