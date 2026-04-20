import { createClient, createServiceClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ResultAnswerCard } from '@/components/quiz/ResultAnswerCard'
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

  const serviceClient = createServiceClient()
  const { data: answers } = await serviceClient
    .from('quiz_answers')
    .select(`
      id, block_number, user_answer, is_correct, score, ai_feedback,
      questions(question_text, type, correct_answer, explanation, study_tip)
    `)
    .eq('session_id', params.sessionId)
    .order('answered_at', { ascending: true })

  const blocks = [1, 2, 3] as const
  const allAnswers = answers ?? []

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 space-y-8">
      {/* Score total */}
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
          const blockAnswers = allAnswers.filter((a: Record<string, unknown>) => a.block_number === b)
          const correct = blockAnswers.filter((a: Record<string, unknown>) => a.is_correct === true).length
          return (
            <div key={b} className="rounded-xl border bg-card p-4 text-center shadow-sm">
              <p className="text-xs text-muted-foreground mb-1">Bloco {b}</p>
              <p className={`text-2xl font-bold ${scoreColor(score)}`}>{score.toFixed(0)}</p>
              <p className="text-xs text-muted-foreground mt-1">{correct}/{blockAnswers.length} corretas</p>
            </div>
          )
        })}
      </div>

      {/* Respostas por bloco */}
      {blocks.map(b => {
        const blockAnswers = allAnswers.filter((a: Record<string, unknown>) => a.block_number === b)
        if (blockAnswers.length === 0) return null
        return (
          <div key={b} className="space-y-2">
            <h2 className="font-semibold text-text-main">Bloco {b}</h2>
            {blockAnswers.map((a: Record<string, unknown>, i: number) => {
              const q = a.questions as Record<string, string> | null
              return (
                <ResultAnswerCard
                  key={a.id as string}
                  index={i + 1}
                  questionText={q?.question_text ?? ''}
                  questionType={q?.type ?? 'multiple_choice'}
                  userAnswer={a.user_answer as string | null}
                  correctAnswer={q?.correct_answer ?? ''}
                  explanation={q?.explanation ?? ''}
                  studyTip={q?.study_tip ?? ''}
                  isCorrect={a.is_correct as boolean | null}
                  score={a.score as number ?? 0}
                  aiFeedback={a.ai_feedback as string | null}
                />
              )
            })}
          </div>
        )
      })}

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
