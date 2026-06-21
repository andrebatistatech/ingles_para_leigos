import { NextRequest, NextResponse } from 'next/server'
import { createClient, createServiceClient } from '@/lib/supabase/server'
import type { Question } from '@/types'

function shuffle<T>(arr: T[]): T[] {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}

const PRACTICE_SIZE = 8

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

  const { slug } = (await request.json()) as { slug: string }
  if (!slug) return NextResponse.json({ error: 'Missing slug' }, { status: 400 })

  const { data: topic } = await serviceClient
    .from('study_topics')
    .select('id, title, question_topics')
    .eq('slug', slug)
    .single()
  if (!topic) return NextResponse.json({ error: 'Topic not found' }, { status: 404 })

  // Tópicos de questão: o atual + os de tópicos já estudados (variedade)
  const { data: studied } = await serviceClient
    .from('study_progress')
    .select('study_topics(question_topics)')
    .eq('user_id', user.id)
    .not('lesson_studied_at', 'is', null)

  const slugSet = new Set<string>(topic.question_topics)
  for (const row of studied ?? []) {
    const st = (row as { study_topics?: { question_topics?: string[] } | null }).study_topics
    for (const qt of st?.question_topics ?? []) slugSet.add(qt)
  }

  // Buscar questões MC sem correct_answer
  const { data: questions } = await serviceClient
    .from('questions')
    .select('id, level, difficulty, type, topic, question_text, options, explanation, study_tip, time_limit_seconds')
    .eq('type', 'multiple_choice')
    .in('topic', Array.from(slugSet))
    .limit(PRACTICE_SIZE * 4)

  const selected = shuffle((questions ?? []) as Question[]).slice(0, PRACTICE_SIZE)

  return NextResponse.json({
    topicId: topic.id,
    title: topic.title,
    questions: selected,
  })
}
