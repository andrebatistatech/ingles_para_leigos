import { createClient, createServiceClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { UpgradeForm } from '@/components/upgrade/UpgradeForm'

export default async function UpgradePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const serviceClient = createServiceClient()

  const { data: profile } = await serviceClient
    .from('profiles')
    .select('is_vip, full_name')
    .eq('user_id', user.id)
    .single()

  if (profile?.is_vip) redirect('/dashboard')

  const { data: existing } = await serviceClient
    .from('vip_requests')
    .select('id, status')
    .eq('user_id', user.id)
    .eq('status', 'pending')
    .single()

  return (
    <div className="mx-auto max-w-lg px-4 py-16">
      <div className="text-center mb-10">
        <span className="text-4xl">⭐</span>
        <h1 className="mt-3 text-3xl font-bold text-text-main">Seja VIP</h1>
        <p className="mt-2 text-muted-foreground">
          VIPs têm acesso a questões de redação com correção por IA (GPT-4).
        </p>
      </div>

      <div className="rounded-xl border bg-card p-6 shadow-sm mb-8">
        <h2 className="font-semibold text-text-main mb-3">Benefícios VIP</h2>
        <ul className="space-y-2">
          {[
            '2 questões de redação por bloco (6 por quiz)',
            'Correção automática por GPT-4',
            'Feedback personalizado por nível CEFR',
            'Badge ⭐ VIP exclusivo no header',
          ].map(b => (
            <li key={b} className="flex items-start gap-2 text-sm text-muted-foreground">
              <span className="text-amber-500 mt-0.5">⭐</span>
              {b}
            </li>
          ))}
        </ul>
      </div>

      <UpgradeForm
        defaultName={profile?.full_name ?? ''}
        defaultEmail={user.email ?? ''}
        alreadyRequested={!!existing}
      />
    </div>
  )
}
