import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { StatsCards } from '@/components/dashboard/StatsCards'
import { ScoreChart } from '@/components/dashboard/ScoreChart'
import { QuizHistory } from '@/components/dashboard/QuizHistory'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: sessions } = await supabase
    .from('quiz_sessions')
    .select('id, level, total_score, started_at, finished_at')
    .eq('user_id', user.id)
    .eq('status', 'completed')
    .order('finished_at', { ascending: false })

  const completed = sessions ?? []

  const totalQuizzes = completed.length
  const avgScore = totalQuizzes > 0
    ? completed.reduce((sum, s) => sum + (s.total_score ?? 0), 0) / totalQuizzes
    : null
  const bestScore = totalQuizzes > 0
    ? Math.max(...completed.map(s => s.total_score ?? 0))
    : null
  const lastQuiz = completed[0]
    ? { level: completed[0].level, score: completed[0].total_score ?? 0 }
    : null

  // Stats por nível
  const byLevel = completed.reduce<Record<string, number[]>>((acc, s) => {
    if (!acc[s.level]) acc[s.level] = []
    acc[s.level].push(s.total_score ?? 0)
    return acc
  }, {})
  const levelStats = Object.entries(byLevel)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([level, scores]) => ({
      level,
      count: scores.length,
      avg: scores.reduce((s, v) => s + v, 0) / scores.length,
      best: Math.max(...scores),
    }))

  const chartData = [...completed]
    .reverse()
    .slice(-20)
    .map(s => ({
      date: s.finished_at ?? s.started_at,
      score: s.total_score ?? 0,
      level: s.level,
    }))

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-main">Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-1">Acompanhe sua evolução</p>
        </div>
        <Link href="/quiz/select">
          <Button className="bg-primary hover:bg-primary/90">Novo Quiz</Button>
        </Link>
      </div>

      <StatsCards
        totalQuizzes={totalQuizzes}
        avgScore={avgScore}
        bestScore={bestScore}
        lastQuiz={lastQuiz}
        levelStats={levelStats}
      />

      <ScoreChart data={chartData} />

      <div>
        <h2 className="mb-4 font-semibold text-text-main">Histórico</h2>
        <QuizHistory sessions={completed} />
      </div>
    </div>
  )
}
