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
    .select('id, level, status, current_block')
    .eq('id', sessionId)
    .eq('user_id', user.id)
    .single()

  if (!session) {
    return NextResponse.json({ error: 'Session not found' }, { status: 404 })
  }

  // Buscar questão com correct_answer (service role)
  if (session.status !== 'in_progress' || session.current_block !== blockNumber) {
    return NextResponse.json({ error: 'Invalid session state' }, { status: 409 })
  }

  const serviceClient = createServiceClient()

  type QuestionData = {
    type: 'multiple_choice' | 'essay'
    correct_answer: string
    time_limit_seconds: number
    explanation: string
    study_tip: string
    question_text: string
  }

  // Verifica se questão foi emitida para esta sessão/bloco
  const { data: issuedRow } = await serviceClient
    .from('quiz_session_questions')
    .select('question_id')
    .eq('session_id', sessionId)
    .eq('block_number', blockNumber)
    .eq('question_id', questionId)
    .single()

  // Sessões sem linhas em quiz_session_questions (criadas antes do sistema de emissão)
  // são tratadas via fallback: valida que a questão pertence ao level/block correto
  if (!issuedRow) {
    const { count: issuedCount } = await serviceClient
      .from('quiz_session_questions')
      .select('id', { count: 'exact', head: true })
      .eq('session_id', sessionId)
      .eq('block_number', blockNumber)

    if ((issuedCount ?? 0) > 0) {
      return NextResponse.json({ error: 'Question was not issued for this block' }, { status: 403 })
    }
  }

  // Busca dados da questão diretamente (evita join PostgREST que depende de schema cache)
  const { data: questionData } = await serviceClient
    .from('questions')
    .select('type, correct_answer, time_limit_seconds, explanation, study_tip, question_text, level, difficulty')
    .eq('id', questionId)
    .single()

  if (!questionData || questionData.level !== session.level || questionData.difficulty !== blockNumber) {
    return NextResponse.json({ error: 'Question was not issued for this block' }, { status: 403 })
  }

  const question = questionData as QuestionData

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
  // Inserir resposta
  const { data: inserted, error: insertError } = await serviceClient
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

  if (insertError || !inserted) {
    return NextResponse.json({ error: 'Question already answered' }, { status: 409 })
  }

  const [{ count: answerCount }, { count: issuedCount }] = await Promise.all([
    serviceClient
      .from('quiz_answers')
      .select('id', { count: 'exact', head: true })
      .eq('session_id', sessionId)
      .eq('block_number', blockNumber),
    serviceClient
      .from('quiz_session_questions')
      .select('id', { count: 'exact', head: true })
      .eq('session_id', sessionId)
      .eq('block_number', blockNumber),
  ])

  // Se é a 10ª questão do bloco: calcular e salvar score do bloco
  if (issuedCount && answerCount === issuedCount) {
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

  // Para essay: disparar avaliação assíncrona apenas para VIPs (fire-and-forget)
  if (question.type === 'essay' && userAnswer && inserted) {
    const { data: profile } = await serviceClient
      .from('profiles')
      .select('is_vip')
      .eq('user_id', user.id)
      .single()

    if (profile?.is_vip) {
      evaluateAndUpdate(
        serviceClient,
        inserted.id,
        sessionId,
        blockNumber,
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
    } else {
      await serviceClient
        .from('quiz_answers')
        .update({ ai_feedback: 'vip_required' })
        .eq('id', inserted.id)

      return NextResponse.json({
        is_correct: null,
        correct_answer: question.correct_answer,
        explanation: question.explanation,
        study_tip: question.study_tip,
        score: null,
        pending: false,
        vip_required: true,
        answerId: inserted.id,
      })
    }
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
  sessionId: string,
  blockNumber: Difficulty,
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
      .update({
        score: result.score,
        ai_feedback: JSON.stringify({
          correction: result.correction,
          explanation_en: result.explanation_en,
          explanation_pt: result.explanation_pt,
        }),
      })
      .eq('id', answerId)

    // A nota do essay chegou depois do bloco fechar: recalcular bloco + total
    await recomputeScores(supabase, sessionId, blockNumber)
  } else {
    console.error('[evaluateAndUpdate] evaluation failed for answerId:', answerId)
    await supabase
      .from('quiz_answers')
      .update({ ai_feedback: 'evaluation_failed' })
      .eq('id', answerId)
  }
}

// Recalcula o score do bloco (e o total, se a sessão já estiver completa) a partir
// das notas atuais no banco — necessário porque essays são avaliados de forma assíncrona.
async function recomputeScores(
  supabase: ReturnType<typeof createServiceClient>,
  sessionId: string,
  blockNumber: Difficulty
) {
  const { data: blockAnswers } = await supabase
    .from('quiz_answers')
    .select('score')
    .eq('session_id', sessionId)
    .eq('block_number', blockNumber)

  const blockScore = calculateBlockScore(
    (blockAnswers ?? []).map((a: { score: number }) => a.score)
  )

  await supabase
    .from('quiz_sessions')
    .update({ [`block_${blockNumber}_score`]: blockScore })
    .eq('id', sessionId)

  // Se a sessão já terminou, recalcular o total com o bloco atualizado
  const { data: sess } = await supabase
    .from('quiz_sessions')
    .select('status, block_1_score, block_2_score, block_3_score')
    .eq('id', sessionId)
    .single()

  if (sess?.status === 'completed') {
    // Média dos blocos concluídos (quiz pode ter sido encerrado antes do bloco 3)
    const blockScores = [sess.block_1_score, sess.block_2_score, sess.block_3_score]
      .filter((s): s is number => s !== null)
    const totalScore = blockScores.length
      ? blockScores.reduce((a, b) => a + b, 0) / blockScores.length
      : 0
    await supabase
      .from('quiz_sessions')
      .update({ total_score: totalScore })
      .eq('id', sessionId)
  }
}
