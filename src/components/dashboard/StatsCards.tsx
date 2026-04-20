import { memo } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { scoreColor } from '@/lib/constants'

interface Props {
  totalQuizzes: number
  avgScore: number | null
  lastQuiz: { level: string; score: number } | null
}

export const StatsCards = memo(function StatsCards({ totalQuizzes, avgScore, lastQuiz }: Props) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      <Card>
        <CardContent className="pt-6">
          <p className="text-sm text-muted-foreground">Total de quizzes</p>
          <p className="mt-1 text-3xl font-bold text-text-main">{totalQuizzes}</p>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <p className="text-sm text-muted-foreground">Nota média geral</p>
          <p className={`mt-1 text-3xl font-bold ${avgScore !== null ? scoreColor(avgScore) : 'text-muted-foreground'}`}>
            {avgScore !== null ? avgScore.toFixed(0) : '—'}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <p className="text-sm text-muted-foreground">Último quiz</p>
          {lastQuiz ? (
            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-xl font-bold text-primary">{lastQuiz.level}</span>
              <span className={`text-2xl font-bold ${scoreColor(lastQuiz.score)}`}>
                {lastQuiz.score.toFixed(0)} pts
              </span>
            </div>
          ) : (
            <p className="mt-1 text-2xl font-bold text-muted-foreground">—</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
})
