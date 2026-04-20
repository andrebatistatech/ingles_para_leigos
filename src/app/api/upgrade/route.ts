import { NextRequest, NextResponse } from 'next/server'
import { createClient, createServiceClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { full_name, email, message } = await request.json() as {
    full_name: string
    email: string
    message?: string
  }

  if (!full_name?.trim() || !email?.trim()) {
    return NextResponse.json({ error: 'Nome e email obrigatórios' }, { status: 400 })
  }

  const serviceClient = createServiceClient()

  // Checar se já enviou pedido pendente
  const { data: existing } = await serviceClient
    .from('vip_requests')
    .select('id, status')
    .eq('user_id', user.id)
    .eq('status', 'pending')
    .single()

  if (existing) {
    return NextResponse.json({ error: 'already_requested' }, { status: 409 })
  }

  const { error } = await serviceClient
    .from('vip_requests')
    .insert({
      user_id: user.id,
      full_name: full_name.trim().slice(0, 200),
      email: email.trim().slice(0, 200),
      message: message?.trim().slice(0, 1000) ?? null,
    })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ ok: true })
}
