import { NextRequest, NextResponse } from 'next/server'
import { createClient, createServiceClient } from '@/lib/supabase/server'

// Encerra um quiz a qualquer momento (ao fim de um bloco), marcando como completo
// com a média dos blocos já concluídos.
export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { sessionId } = (await request.json()) as { sessionId: string }
  if (!sessionId) return NextResponse.json({ error: 'Missing sessionId' }, { status: 400 })

  const serviceClient = createServiceClient()
  const { data: session } = await serviceClient
    .from('quiz_sessions')
    .select('id, status, block_1_score, block_2_score, block_3_score')
    .eq('id', sessionId)
    .eq('user_id', user.id)
    .single()

  if (!session) return NextResponse.json({ error: 'Session not found' }, { status: 404 })
  if (session.status === 'completed') return NextResponse.json({ ok: true })

  const scores = [session.block_1_score, session.block_2_score, session.block_3_score]
    .filter((s): s is number => s !== null)
  const total = scores.length ? scores.reduce((a, b) => a + b, 0) / scores.length : 0

  await serviceClient
    .from('quiz_sessions')
    .update({
      status: 'completed',
      finished_at: new Date().toISOString(),
      total_score: total,
    })
    .eq('id', sessionId)

  return NextResponse.json({ ok: true })
}
