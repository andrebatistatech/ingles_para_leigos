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
  difficulty: Difficulty
): Promise<QuestionWithAnswer[]> {
  const answeredIds = await getAnsweredIds(supabase, userId, level, difficulty)

  // Buscar questões novas (excluindo já respondidas)
  let mcQuestions = await fetchQuestions(supabase, level, difficulty, 'multiple_choice', answeredIds, 8)
  let essayQuestions = await fetchQuestions(supabase, level, difficulty, 'essay', answeredIds, 2)

  // Se insuficiente, completar com as mais antigas (permit repetition)
  if (mcQuestions.length < 8) {
    const extra = await fetchQuestions(supabase, level, difficulty, 'multiple_choice', [], 8)
    const newIds = new Set(mcQuestions.map(q => q.id))
    const oldest = extra.filter(q => !newIds.has(q.id))
    mcQuestions = [...mcQuestions, ...oldest].slice(0, 8)
  }

  if (essayQuestions.length < 2) {
    const extra = await fetchQuestions(supabase, level, difficulty, 'essay', [], 2)
    const newIds = new Set(essayQuestions.map(q => q.id))
    const oldest = extra.filter(q => !newIds.has(q.id))
    essayQuestions = [...essayQuestions, ...oldest].slice(0, 2)
  }

  // Sortear dentro de cada tipo e combinar
  const selected = [
    ...shuffle(mcQuestions).slice(0, 8),
    ...shuffle(essayQuestions).slice(0, 2),
  ]

  return shuffle(selected)
}
