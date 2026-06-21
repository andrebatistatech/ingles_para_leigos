import { createClient, createServiceClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { LessonMarkdown } from '@/components/study/LessonMarkdown'
import { MarkStudiedButton } from '@/components/study/MarkStudiedButton'
import { generateLesson } from '@/lib/ai/lesson'
import type { CEFRLevel, LessonExample, StudyCategory } from '@/types'

export default async function LessonPage({ params }: { params: { slug: string } }) {
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

  const { data: topic } = await serviceClient
    .from('study_topics')
    .select('id, level, slug, title, category, explanation, examples')
    .eq('slug', params.slug)
    .single()
  if (!topic) notFound()

  let explanation: string | null = topic.explanation
  let examples: LessonExample[] | null = topic.examples

  // Gera e cacheia o conteúdo na primeira visita
  if (!explanation) {
    const generated = await generateLesson(
      topic.level as CEFRLevel,
      topic.title,
      topic.category as StudyCategory
    )
    if (generated) {
      explanation = generated.explanation
      examples = generated.examples
      await serviceClient
        .from('study_topics')
        .update({
          explanation: generated.explanation,
          examples: generated.examples,
          content_generated_at: new Date().toISOString(),
        })
        .eq('id', topic.id)
    }
  }

  const { data: progress } = await serviceClient
    .from('study_progress')
    .select('lesson_studied_at')
    .eq('user_id', user.id)
    .eq('topic_id', topic.id)
    .single()

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 space-y-6">
      <div>
        <Link href="/estudar" className="text-sm text-muted-foreground hover:text-primary">← Estudar</Link>
        <div className="mt-2 flex items-center gap-2">
          <h1 className="text-2xl font-bold text-text-main">{topic.title}</h1>
          <Badge variant="outline" className="text-primary">{topic.level}</Badge>
          <Badge variant="outline" className="text-muted-foreground">
            {topic.category === 'grammar' ? 'Gramática' : 'Expressões'}
          </Badge>
        </div>
      </div>

      <div className="rounded-xl border bg-card p-6">
        {explanation ? (
          <LessonMarkdown content={explanation} />
        ) : (
          <p className="text-sm text-muted-foreground">
            Não foi possível gerar a lição agora. Tente recarregar a página em instantes.
          </p>
        )}
      </div>

      {examples && examples.length > 0 && (
        <div className="rounded-xl border bg-card p-6 space-y-3">
          <h2 className="font-semibold text-text-main">Exemplos</h2>
          <ul className="space-y-3">
            {examples.map((ex, i) => (
              <li key={i} className="text-sm">
                <p className="text-text-main">🇺🇸 {ex.en}</p>
                <p className="text-muted-foreground">🇧🇷 {ex.pt}</p>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="grid gap-2 sm:grid-cols-2">
        <MarkStudiedButton topicId={topic.id} alreadyStudied={!!progress?.lesson_studied_at} />
        <Link href={`/estudar/${topic.slug}/exercicios`}>
          <Button className="w-full bg-primary hover:bg-primary/90">Fazer exercícios</Button>
        </Link>
      </div>
    </div>
  )
}
