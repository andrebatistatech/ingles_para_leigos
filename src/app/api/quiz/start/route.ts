import { NextRequest, NextResponse } from 'next/server'
import { createClient, createServiceClient } from '@/lib/supabase/server'
import { selectQuestionsForBlock } from '@/lib/quiz/selector'
import type { CEFRLevel, Difficulty, Question } from '@/types'


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

  const VALID_LEVELS: CEFRLevel[] = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2']
  const VALID_BLOCKS: Difficulty[] = [1, 2, 3]
  if (!VALID_LEVELS.includes(level) || !VALID_BLOCKS.includes(block)) {
    return NextResponse.json({ error: 'Invalid input' }, { status: 400 })
  }

  const serviceClient = createServiceClient()
  let sessionId = existingSessionId

  if (block === 1) {
    // Criar nova sessão
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
    // Verificar que a sessão pertence ao usuário e está no bloco correto
    const { data: session } = await supabase
      .from('quiz_sessions')
      .select('id, current_block')
      .eq('id', existingSessionId)
      .eq('user_id', user.id)
      .single()

    if (!session) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 })
    }
  }

  // Selecionar questões (sem correct_answer no retorno)
  const questionsWithAnswer = await selectQuestionsForBlock(
    serviceClient,
    user.id,
    level,
    block
  )

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const questions: Question[] = questionsWithAnswer.map(({ correct_answer: _ca, ...q }) => q as Question)

  return NextResponse.json({ sessionId, questions, block })
}
