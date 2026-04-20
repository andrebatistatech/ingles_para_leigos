import { createClient, createServiceClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { AdminUsersTable } from '@/components/admin/AdminUsersTable'
import { Badge } from '@/components/ui/badge'

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

  const [{ data: profiles }, { data: requests }] = await Promise.all([
    serviceClient
      .from('profiles')
      .select('id, user_id, full_name, avatar_url, is_vip, is_admin, created_at')
      .order('created_at', { ascending: false }),
    serviceClient
      .from('vip_requests')
      .select('id, full_name, email, message, status, created_at')
      .order('created_at', { ascending: false }),
  ])

  const pending = (requests ?? []).filter((r: { status: string }) => r.status === 'pending')

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 space-y-10">
      <div>
        <h1 className="text-2xl font-bold text-text-main">Admin</h1>
      </div>

      {/* Pedidos VIP */}
      {pending.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <h2 className="font-semibold text-text-main">Pedidos VIP pendentes</h2>
            <Badge className="bg-amber-500/15 text-amber-500 border-amber-500/30">{pending.length}</Badge>
          </div>
          <div className="space-y-2">
            {pending.map((r: Record<string, string>) => (
              <div key={r.id} className="rounded-xl border border-amber-400/30 bg-amber-400/5 p-4 text-sm space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-text-main">{r.full_name}</span>
                  <span className="text-muted-foreground">{r.email}</span>
                </div>
                {r.message && (
                  <p className="text-muted-foreground italic">&ldquo;{r.message}&rdquo;</p>
                )}
                <p className="text-xs text-muted-foreground">
                  {new Date(r.created_at).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            ))}
          </div>
          <p className="text-xs text-muted-foreground">Para aprovar, ative o VIP do usuário na tabela abaixo.</p>
        </div>
      )}

      {/* Usuários */}
      <div className="space-y-3">
        <h2 className="font-semibold text-text-main">Usuários</h2>
        <AdminUsersTable users={profiles ?? []} />
      </div>
    </div>
  )
}
