import { NextRequest, NextResponse } from 'next/server'
import { createClient, createServiceClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const serviceClient = createServiceClient()
  const { data: profile } = await serviceClient
    .from('profiles')
    .select('is_vip')
    .eq('user_id', user.id)
    .single()
  if (!profile?.is_vip) {
    return NextResponse.json({ error: 'VIP only' }, { status: 403 })
  }

  const { topicId } = (await request.json()) as { topicId: string }
  if (!topicId) return NextResponse.json({ error: 'Missing topicId' }, { status: 400 })

  const now = new Date().toISOString()
  const { data: existing } = await serviceClient
    .from('study_progress')
    .select('id')
    .eq('user_id', user.id)
    .eq('topic_id', topicId)
    .single()

  if (existing) {
    await serviceClient
      .from('study_progress')
      .update({ lesson_studied_at: now })
      .eq('id', existing.id)
  } else {
    await serviceClient
      .from('study_progress')
      .insert({ user_id: user.id, topic_id: topicId, lesson_studied_at: now })
  }

  return NextResponse.json({ ok: true })
}
