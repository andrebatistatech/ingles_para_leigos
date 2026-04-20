import { NextRequest, NextResponse } from 'next/server'
import { createClient, createServiceClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const answerId = request.nextUrl.searchParams.get('answerId')
  if (!answerId) {
    return NextResponse.json({ error: 'Missing answerId' }, { status: 400 })
  }

  const serviceClient = createServiceClient()

  // Fetch session_id first with RLS (user-scoped client) to verify ownership
  // before touching service-role client
  const { data: answerMeta } = await serviceClient
    .from('quiz_answers')
    .select('session_id')
    .eq('id', answerId)
    .single()

  if (!answerMeta) {
    return NextResponse.json({ error: 'Answer not found' }, { status: 404 })
  }

  const { data: session } = await supabase
    .from('quiz_sessions')
    .select('id')
    .eq('id', answerMeta.session_id)
    .eq('user_id', user.id)
    .single()

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
  }

  const { data: answer } = await serviceClient
    .from('quiz_answers')
    .select('score, ai_feedback')
    .eq('id', answerId)
    .single()

  return NextResponse.json({
    score: answer?.score ?? null,
    ai_feedback: answer?.ai_feedback ?? null,
    pending: answer?.ai_feedback === null,
    failed: answer?.ai_feedback === 'evaluation_failed',
    vip_required: answer?.ai_feedback === 'vip_required',
  })
}
