import { NextRequest, NextResponse } from 'next/server'
import { createClient, createServiceClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const serviceClient = createServiceClient()

  // VIP only
  const { data: profile } = await serviceClient
    .from('profiles')
    .select('is_vip')
    .eq('user_id', user.id)
    .single()
  if (!profile?.is_vip) {
    return NextResponse.json({ error: 'VIP only', vip_required: true }, { status: 403 })
  }

  const { topicId, questionId, userAnswer } = (await request.json()) as {
    topicId: string
    questionId: string
    userAnswer: string | null
  }
  if (!topicId || !questionId) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
  }

  // Buscar questão com correct_answer (apenas MC na prática)
  const { data: question } = await serviceClient
    .from('questions')
    .select('correct_answer, explanation, study_tip, type')
    .eq('id', questionId)
    .single()
  if (!question || question.type !== 'multiple_choice') {
    return NextResponse.json({ error: 'Question not found' }, { status: 404 })
  }

  const isCorrect = userAnswer === question.correct_answer
  const score = isCorrect ? 100 : 0

  // Atualizar progresso (read-modify-write; single-user, sem corrida relevante)
  const { data: existing } = await serviceClient
    .from('study_progress')
    .select('id, exercises_done, exercises_correct')
    .eq('user_id', user.id)
    .eq('topic_id', topicId)
    .single()

  const done = (existing?.exercises_done ?? 0) + 1
  const correct = (existing?.exercises_correct ?? 0) + (isCorrect ? 1 : 0)
  const accuracy = Math.round((correct / done) * 100)
  const now = new Date().toISOString()

  if (existing) {
    await serviceClient
      .from('study_progress')
      .update({
        exercises_done: done,
        exercises_correct: correct,
        best_score: accuracy,
        last_practiced_at: now,
      })
      .eq('id', existing.id)
  } else {
    await serviceClient.from('study_progress').insert({
      user_id: user.id,
      topic_id: topicId,
      exercises_done: done,
      exercises_correct: correct,
      best_score: accuracy,
      last_practiced_at: now,
    })
  }

  return NextResponse.json({
    is_correct: isCorrect,
    correct_answer: question.correct_answer,
    explanation: question.explanation,
    study_tip: question.study_tip,
    score,
    pending: false,
  })
}
