import { createClient, createServiceClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { AdminUsersTable } from '@/components/admin/AdminUsersTable'

export default async function AdminPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const serviceClient = createServiceClient()
  const { data: profile } = await serviceClient
    .from('profiles')
    .select('is_admin')
    .eq('user_id', user.id)
    .single()

  if (!profile?.is_admin) redirect('/dashboard')

  const { data: profiles } = await serviceClient
    .from('profiles')
    .select('id, user_id, full_name, avatar_url, is_vip, is_admin, created_at')
    .order('created_at', { ascending: false })

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-text-main">Admin — Usuários</h1>
        <p className="text-sm text-muted-foreground mt-1">Gerencie status VIP dos usuários</p>
      </div>
      <AdminUsersTable users={profiles ?? []} />
    </div>
  )
}
