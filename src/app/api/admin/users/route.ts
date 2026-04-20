import { NextRequest, NextResponse } from 'next/server'
import { createClient, createServiceClient } from '@/lib/supabase/server'

async function requireAdmin() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const serviceClient = createServiceClient()
  const { data: profile } = await serviceClient
    .from('profiles')
    .select('is_admin')
    .eq('user_id', user.id)
    .single()

  if (!profile?.is_admin) return null
  return serviceClient
}

export async function GET() {
  const serviceClient = await requireAdmin()
  if (!serviceClient) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const { data: profiles } = await serviceClient
    .from('profiles')
    .select('id, user_id, full_name, avatar_url, is_vip, is_admin, created_at')
    .order('created_at', { ascending: false })

  return NextResponse.json({ users: profiles ?? [] })
}

export async function PATCH(request: NextRequest) {
  const serviceClient = await requireAdmin()
  if (!serviceClient) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const { userId, is_vip } = await request.json() as { userId: string; is_vip: boolean }

  if (typeof is_vip !== 'boolean' || !userId) {
    return NextResponse.json({ error: 'Invalid input' }, { status: 400 })
  }

  const { error } = await serviceClient
    .from('profiles')
    .update({ is_vip })
    .eq('user_id', userId)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ ok: true })
}
