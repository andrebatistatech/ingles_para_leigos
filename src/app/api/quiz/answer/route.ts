import { NextRequest, NextResponse } from 'next/server'
import { createClient, createServiceClient } from '@/lib/supabase/server'
import { calculateBlockScore, calculateTotalScore } from '@/lib/quiz/scorer'
import { evaluateEssay } from '@/lib/ai/evaluate'
import type { Difficulty } from '@/types'

function sanitizeEssay(input: string): string {
  return input.replace(/<[^>]*>/g, '').trim().slice(0, 2000)
}

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const {
    sessionId,
    questionId,
    blockNumber,
    userAnswer: rawAnswer,
    questionStartedAt,
  } = body as {
    sessionId: string
    questionId: string
    blockNumber: Difficulty
    userAnswer: string | null
    questionStartedAt: string
  }

  if (![1, 2, 3].includes(blockNumber)) {
    return NextResponse.json({ error: 'Invalid block' }, { status: 400 })
  }

  // Verificar que a sessão pertence ao usuário
  const { data: session } = await supabase
    .from('quiz_sessions')
    .select('id, level, status')
    .eq('id', sessionId)
    .eq('user_id', user.id)
    .single()

  if (!session) {
    return NextResponse.json({ error: 'Session not found' }, { status: 404 })
  }

  // Buscar questão com correct_answer (service role)
  const serviceClient = createServiceClient()
  const { data: question } = await serviceClient
    .from('questions')
    .select('*')
    .eq('id', questionId)
    .single()

  if (!question) {
    return NextResponse.json({ error: 'Question not found' }, { status: 404 })
  }

  // Validação server-side do timer (5s de tolerância para latência)
  const elapsed = Math.max(0, (Date.now() - new Date(questionStartedAt).getTime()) / 1000)
  let userAnswer = rawAnswer
  if (elapsed > question.time_limit_seconds + 5) {
    userAnswer = null
  }

  // Sanitizar essay
  if (question.type === 'essay' && userAnswer) {
    userAnswer = sanitizeEssay(userAnswer)
  }

  // Calcular score para MC
  const isCorrect = question.type === 'multiple_choice'
    ? userAnswer === question.correct_answer
    : null
  const score = question.type === 'multiple_choice' ? (isCorrect ? 100 : 0) : 0

  // Contar respostas do bloco para detectar a 10ª questão
  const { count } = await serviceClient
    .from('quiz_answers')
    .select('id', { count: 'exact', head: true })
    .eq('session_id', sessionId)
    .eq('block_number', blockNumber)

  const answerCount = (count ?? 0) + 1 // inclui a atual

  // Inserir resposta
  const { data: inserted } = await serviceClient
    .from('quiz_answers')
    .insert({
      session_id: sessionId,
      question_id: questionId,
      block_number: blockNumber,
      user_answer: userAnswer,
      is_correct: isCorrect,
      score,
      time_spent_seconds: Math.round(elapsed),
      question_started_at: questionStartedAt,
    })
    .select('id')
    .single()

  // Se é a 10ª questão do bloco: calcular e salvar score do bloco
  if (answerCount === 10) {
    const { data: blockAnswers } = await serviceClient
      .from('quiz_answers')
      .select('score')
      .eq('session_id', sessionId)
      .eq('block_number', blockNumber)

    const blockScore = calculateBlockScore(
      (blockAnswers ?? []).map((a: { score: number }) => a.score)
    )

    const blockField = `block_${blockNumber}_score`

    if (blockNumber === 3) {
      // Buscar scores dos blocos anteriores para calcular total
      const { data: sess } = await serviceClient
        .from('quiz_sessions')
        .select('block_1_score, block_2_score')
        .eq('id', sessionId)
        .single()

      const totalScore = calculateTotalScore(
        sess?.block_1_score ?? 0,
        sess?.block_2_score ?? 0,
        blockScore
      )

      await serviceClient
        .from('quiz_sessions')
        .update({
          [blockField]: blockScore,
          total_score: totalScore,
          status: 'completed',
          finished_at: new Date().toISOString(),
          current_block: 3,
        })
        .eq('id', sessionId)
    } else {
      await serviceClient
        .from('quiz_sessions')
        .update({
          [blockField]: blockScore,
          current_block: (blockNumber + 1) as Difficulty,
        })
        .eq('id', sessionId)
    }
  }

  // Para essay: disparar avaliação assíncrona (fire-and-forget)
  if (question.type === 'essay' && userAnswer && inserted) {
    evaluateAndUpdate(
      serviceClient,
      inserted.id,
      session.level,
      question.question_text,
      question.correct_answer,
      userAnswer
    )

    return NextResponse.json({
      is_correct: null,
      correct_answer: question.correct_answer,
      explanation: question.explanation,
      study_tip: question.study_tip,
      score: null,
      pending: true,
      answerId: inserted.id,
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

async function evaluateAndUpdate(
  supabase: ReturnType<typeof createServiceClient>,
  answerId: string,
  level: string,
  questionText: string,
  correctAnswer: string,
  studentAnswer: string
) {
  const result = await evaluateEssay(
    level as Parameters<typeof evaluateEssay>[0],
    questionText,
    correctAnswer,
    studentAnswer
  )

  if (result) {
    await supabase
      .from('quiz_answers')
      .update({ score: result.score, ai_feedback: `${result.feedback}\n\n💡 ${result.suggestion}` })
      .eq('id', answerId)
  } else {
    console.error('[evaluateAndUpdate] evaluation failed for answerId:', answerId)
    await supabase
      .from('quiz_answers')
      .update({ ai_feedback: 'evaluation_failed' })
      .eq('id', answerId)
  }
}
