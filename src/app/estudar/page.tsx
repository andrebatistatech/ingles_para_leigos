import { createClient, createServiceClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import type { CEFRLevel, StudyTopic, StudyProgress } from '@/types'

const LEVELS: CEFRLevel[] = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2']

export default async function StudyHubPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const serviceClient = createServiceClient()
  const { data: profile } = await serviceClient
    .from('profiles')
    .select('is_vip')
    .eq('user_id', user.id)
    .single()
  if (!profile?.is_vip) redirect('/upgrade')

  const [{ data: topics }, { data: progress }] = await Promise.all([
    serviceClient
      .from('study_topics')
      .select('id, level, slug, title, category, sort_order')
      .order('level', { ascending: true })
      .order('sort_order', { ascending: true }),
    serviceClient
      .from('study_progress')
      .select('topic_id, lesson_studied_at, exercises_done, best_score')
      .eq('user_id', user.id),
  ])

  const progressByTopic = new Map<string, Pick<StudyProgress, 'lesson_studied_at' | 'exercises_done' | 'best_score'>>(
    (progress ?? []).map(p => [p.topic_id, p])
  )

  const byLevel = (topics ?? []).reduce<Record<string, StudyTopic[]>>((acc, t) => {
    ;(acc[t.level] ??= []).push(t as StudyTopic)
    return acc
  }, {})

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-text-main">Estudar</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Gramática e expressões por nível. Estude o tópico e pratique com exercícios.
        </p>
      </div>

      {LEVELS.filter(lv => byLevel[lv]?.length).map(lv => (
        <section key={lv} className="space-y-3">
          <h2 className="font-semibold text-text-main flex items-center gap-2">
            <span className="text-primary">{lv}</span>
          </h2>
          <div className="grid gap-2 sm:grid-cols-2">
            {byLevel[lv].map(t => {
              const p = progressByTopic.get(t.id)
              const studied = !!p?.lesson_studied_at
              return (
                <Link
                  key={t.id}
                  href={`/estudar/${t.slug}`}
                  className="rounded-xl border bg-card p-4 hover:border-primary hover:shadow-sm transition-all"
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="font-medium text-text-main">{t.title}</span>
                    {studied && <span className="text-success text-sm" title="Estudado">✓</span>}
                  </div>
                  <div className="mt-2 flex items-center gap-2 text-xs">
                    <Badge variant="outline" className="text-muted-foreground">
                      {t.category === 'grammar' ? 'Gramática' : 'Expressões'}
                    </Badge>
                    {p?.exercises_done ? (
                      <span className="text-muted-foreground">
                        {p.exercises_done} exercícios · {p.best_score ?? 0}%
                      </span>
                    ) : null}
                  </div>
                </Link>
              )
            })}
          </div>
        </section>
      ))}
    </div>
  )
}
