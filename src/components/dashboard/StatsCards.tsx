import { memo } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { scoreColor } from '@/lib/constants'

interface LevelStat {
  level: string
  count: number
  avg: number
  best: number
}

interface Props {
  totalQuizzes: number
  avgScore: number | null
  lastQuiz: { level: string; score: number } | null
  bestScore: number | null
  levelStats: LevelStat[]
}

export const StatsCards = memo(function StatsCards({ totalQuizzes, avgScore, lastQuiz, bestScore, levelStats }: Props) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Total de quizzes</p>
            <p className="mt-1 text-3xl font-bold text-text-main">{totalQuizzes}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Nota média</p>
            <p className={`mt-1 text-3xl font-bold ${avgScore !== null ? scoreColor(avgScore) : 'text-muted-foreground'}`}>
              {avgScore !== null ? avgScore.toFixed(0) : '—'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Melhor nota</p>
            <p className={`mt-1 text-3xl font-bold ${bestScore !== null ? scoreColor(bestScore) : 'text-muted-foreground'}`}>
              {bestScore !== null ? bestScore.toFixed(0) : '—'}
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
                  {lastQuiz.score.toFixed(0)}
                </span>
              </div>
            ) : (
              <p className="mt-1 text-2xl font-bold text-muted-foreground">—</p>
            )}
          </CardContent>
        </Card>
      </div>

      {levelStats.length > 0 && (
        <div className="rounded-xl border bg-card p-4 shadow-sm">
          <p className="mb-3 text-sm font-medium text-text-main">Desempenho por nível</p>
          <div className="flex flex-wrap gap-3">
            {levelStats.map(s => (
              <div key={s.level} className="flex items-center gap-2 rounded-lg border bg-muted/30 px-3 py-2">
                <Badge variant="outline" className="text-xs">{s.level}</Badge>
                <span className={`text-sm font-semibold ${scoreColor(s.avg)}`}>{s.avg.toFixed(0)}</span>
                <span className="text-xs text-muted-foreground">média</span>
                <span className="text-xs text-muted-foreground">·</span>
                <span className="text-xs text-muted-foreground">{s.count} quiz{s.count !== 1 ? 'zes' : ''}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
})
