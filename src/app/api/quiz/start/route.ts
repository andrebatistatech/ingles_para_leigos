import { NextRequest, NextResponse } from 'next/server'
import { createClient, createServiceClient } from '@/lib/supabase/server'
import { selectQuestionsForBlock } from '@/lib/quiz/selector'
import type { CEFRLevel, Difficulty, Question, QuestionWithAnswer } from '@/types'


function toSafeQuestion(question: QuestionWithAnswer): Question {
  const safeQuestion = { ...question }
  delete (safeQuestion as Partial<QuestionWithAnswer>).correct_answer
  return safeQuestion as Question
}

async function getIssuedQuestions(
  supabase: ReturnType<typeof createServiceClient>,
  sessionId: string,
  block: Difficulty
): Promise<Question[]> {
  const { data: rows } = await supabase
    .from('quiz_session_questions')
    .select('position, question_id')
    .eq('session_id', sessionId)
    .eq('block_number', block)
    .order('position')

  if (!rows || rows.length === 0) return []

  const questionIds = rows.map(r => r.question_id)
  const { data: questions } = await supabase
    .from('questions')
    .select('*')
    .in('id', questionIds)

  if (!questions) return []

  const byId = Object.fromEntries(questions.map(q => [q.id, q]))
  return rows
    .map(r => byId[r.question_id])
    .filter(Boolean)
    .map(q => toSafeQuestion(q as QuestionWithAnswer))
}

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const { level, block, sessionId: existingSessionId } = body as {
    level: CEFRLevel
    block: Difficulty
    sessionId?: string
  }

  const validLevels: CEFRLevel[] = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2']
  const validBlocks: Difficulty[] = [1, 2, 3]
  if (!validLevels.includes(level) || !validBlocks.includes(block)) {
    return NextResponse.json({ error: 'Invalid input' }, { status: 400 })
  }

  const serviceClient = createServiceClient()
  let sessionId = existingSessionId

  if (block === 1) {
    const { data: session, error } = await serviceClient
      .from('quiz_sessions')
      .insert({ user_id: user.id, level, current_block: 1 })
      .select('id')
      .single()

    if (error || !session) {
      return NextResponse.json({ error: 'Failed to create session' }, { status: 500 })
    }
    sessionId = session.id
  } else {
    const { data: session } = await supabase
      .from('quiz_sessions')
      .select('id, level, current_block, status')
      .eq('id', existingSessionId)
      .eq('user_id', user.id)
      .single()

    if (!session || session.status !== 'in_progress') {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 })
    }

    if (session.level !== level || session.current_block !== block) {
      return NextResponse.json({ error: 'Invalid session state' }, { status: 409 })
    }
  }

  if (!sessionId) {
    return NextResponse.json({ error: 'Failed to create session' }, { status: 500 })
  }

  const issuedQuestions = await getIssuedQuestions(serviceClient, sessionId, block)
  if (issuedQuestions.length > 0) {
    return NextResponse.json({ sessionId, questions: issuedQuestions, block })
  }

  const { data: profile } = await serviceClient
    .from('profiles')
    .select('is_vip')
    .eq('user_id', user.id)
    .single()

  const isVip = profile?.is_vip === true
  const questionsWithAnswer = await selectQuestionsForBlock(
    serviceClient,
    user.id,
    level,
    block,
    isVip
  )

  const { error: issueError } = await serviceClient
    .from('quiz_session_questions')
    .insert(questionsWithAnswer.map((question, index) => ({
      session_id: sessionId,
      question_id: question.id,
      block_number: block,
      position: index + 1,
    })))

  if (issueError) {
    const concurrentQuestions = await getIssuedQuestions(serviceClient, sessionId, block)
    if (concurrentQuestions.length > 0) {
      return NextResponse.json({ sessionId, questions: concurrentQuestions, block })
    }
    return NextResponse.json({ error: 'Failed to issue questions' }, { status: 500 })
  }

  const questions = questionsWithAnswer.map(toSafeQuestion)

  return NextResponse.json({ sessionId, questions, block })
}
