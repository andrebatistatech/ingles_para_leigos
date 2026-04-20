import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { scoreColor, formatDuration } from '@/lib/constants'

export default async function ResultPage({ params }: { params: { sessionId: string } }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: session } = await supabase
    .from('quiz_sessions')
    .select('*')
    .eq('id', params.sessionId)
    .eq('user_id', user.id)
    .single()

  if (!session) redirect('/dashboard')

  const { data: answers } = await supabase
    .from('quiz_answers')
    .select('*, questions(question_text, type)')
    .eq('session_id', params.sessionId)
    .order('answered_at', { ascending: true })

  const blocks = [1, 2, 3] as const

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 space-y-8">
      {/* Nota total */}
      <div className="text-center">
        <p className="text-sm text-muted-foreground">Resultado Final</p>
        <p className="text-sm font-medium text-text-main mt-1">
          Nível <Badge>{session.level}</Badge>
        </p>
        <p className={`mt-4 text-7xl font-bold ${scoreColor(session.total_score ?? 0)}`}>
          {(session.total_score ?? 0).toFixed(0)}
        </p>
        <p className="text-muted-foreground">pontos</p>
        {session.finished_at && (
          <p className="mt-2 text-xs text-muted-foreground">
            Tempo total: {formatDuration(session.started_at, session.finished_at)}
          </p>
        )}
      </div>

      {/* Scores por bloco */}
      <div className="grid grid-cols-3 gap-3">
        {blocks.map(b => {
          const score = session[`block_${b}_score`] ?? 0
          return (
            <div key={b} className="rounded-xl border bg-card p-4 text-center shadow-sm">
              <p className="text-xs text-muted-foreground">Bloco {b}</p>
              <p className={`text-2xl font-bold ${scoreColor(score)}`}>{score.toFixed(0)}</p>
            </div>
          )
        })}
      </div>

      {/* Lista de respostas */}
      <div className="space-y-2">
        <h2 className="font-semibold text-text-main">Detalhes</h2>
        {(answers ?? []).map((a: Record<string, unknown>, i: number) => (
          <div key={a.id as string} className="flex items-center gap-3 rounded-lg border bg-card p-3">
            <span className={`text-lg ${a.is_correct ? 'text-success' : a.is_correct === null ? 'text-primary' : 'text-error'}`}>
              {a.is_correct ? '✓' : a.is_correct === null ? '✍️' : '✗'}
            </span>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-text-main truncate">
                Q{i + 1} — {(a.questions as Record<string, string>)?.question_text}
              </p>
            </div>
            <span className="text-sm font-medium text-muted-foreground shrink-0">
              {(a.score as number) ?? 0} pts
            </span>
          </div>
        ))}
      </div>

      {/* Ações */}
      <div className="flex gap-3">
        <Link href="/quiz/select" className="flex-1">
          <Button className="w-full bg-primary hover:bg-primary/90">Novo Quiz</Button>
        </Link>
        <Link href="/dashboard" className="flex-1">
          <Button variant="outline" className="w-full">Dashboard</Button>
        </Link>
      </div>
    </div>
  )
}
