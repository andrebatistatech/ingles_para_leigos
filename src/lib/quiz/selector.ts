import type { SupabaseClient } from '@supabase/supabase-js'
import type { CEFRLevel, Difficulty, QuestionWithAnswer } from '@/types'

function shuffle<T>(arr: T[]): T[] {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}

async function getAnsweredIds(
  supabase: SupabaseClient,
  userId: string,
  level: CEFRLevel,
  difficulty: Difficulty
): Promise<string[]> {
  const { data: sessions } = await supabase
    .from('quiz_sessions')
    .select('id')
    .eq('user_id', userId)
    .eq('level', level)

  if (!sessions || sessions.length === 0) return []

  const sessionIds = sessions.map((s: { id: string }) => s.id)

  const { data: answers } = await supabase
    .from('quiz_answers')
    .select('question_id, answered_at')
    .in('session_id', sessionIds)
    .eq('block_number', difficulty)
    .order('answered_at', { ascending: true })

  return answers?.map((a: { question_id: string }) => a.question_id) ?? []
}

async function fetchQuestions(
  supabase: SupabaseClient,
  level: CEFRLevel,
  difficulty: Difficulty,
  type: 'multiple_choice' | 'essay',
  excludeIds: string[],
  limit: number
): Promise<QuestionWithAnswer[]> {
  let query = supabase
    .from('questions')
    .select('*')
    .eq('level', level)
    .eq('difficulty', difficulty)
    .eq('type', type)

  if (excludeIds.length > 0) {
    query = query.not('id', 'in', `(${excludeIds.join(',')})`)
  }

  const { data } = await query.limit(limit * 3) // buscar mais para ter de onde sortear
  return (data ?? []) as QuestionWithAnswer[]
}

export async function selectQuestionsForBlock(
  supabase: SupabaseClient,
  userId: string,
  level: CEFRLevel,
  difficulty: Difficulty,
  isVip: boolean = false
): Promise<QuestionWithAnswer[]> {
  const answeredIds = await getAnsweredIds(supabase, userId, level, difficulty)

  // Non-VIP: 10 MC only. VIP: 8 MC + 2 essay.
  const mcCount = 10
  const essayCount = isVip ? 2 : 0
  const mcTarget = isVip ? 8 : 10

  let mcQuestions = await fetchQuestions(supabase, level, difficulty, 'multiple_choice', answeredIds, mcTarget)

  if (mcQuestions.length < mcTarget) {
    const extra = await fetchQuestions(supabase, level, difficulty, 'multiple_choice', [], mcTarget)
    const newIds = new Set(mcQuestions.map(q => q.id))
    const oldest = extra.filter(q => !newIds.has(q.id))
    mcQuestions = [...mcQuestions, ...oldest].slice(0, mcTarget)
  }

  if (!isVip) {
    return shuffle(mcQuestions).slice(0, mcCount)
  }

  let essayQuestions = await fetchQuestions(supabase, level, difficulty, 'essay', answeredIds, essayCount)

  if (essayQuestions.length < essayCount) {
    const extra = await fetchQuestions(supabase, level, difficulty, 'essay', [], essayCount)
    const newIds = new Set(essayQuestions.map(q => q.id))
    const oldest = extra.filter(q => !newIds.has(q.id))
    essayQuestions = [...essayQuestions, ...oldest].slice(0, essayCount)
  }

  return shuffle([
    ...shuffle(mcQuestions).slice(0, 8),
    ...shuffle(essayQuestions).slice(0, 2),
  ])
}
