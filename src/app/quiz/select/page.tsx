import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { LevelSelector } from '@/components/quiz/LevelSelector'
import { CEFR_LEVELS } from '@/lib/constants'

export default async function SelectLevelPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // Histórico de quizzes por nível
  const { data: sessions } = await supabase
    .from('quiz_sessions')
    .select('level')
    .eq('user_id', user.id)
    .eq('status', 'completed')

  const countByLevel = (sessions ?? []).reduce((acc: Record<string, number>, s: { level: string }) => {
    acc[s.level] = (acc[s.level] ?? 0) + 1
    return acc
  }, {})

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-bold text-text-main">Selecione o nível</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Escolha seu nível CEFR para iniciar um quiz de 30 questões
        </p>
      </div>
      <LevelSelector levels={CEFR_LEVELS} countByLevel={countByLevel} />
    </div>
  )
}
