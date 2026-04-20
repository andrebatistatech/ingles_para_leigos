import { Button } from '@/components/ui/button'
import type { AnswerFeedback, Difficulty } from '@/types'

interface Props {
  blockNumber: Difficulty
  score: number
  feedbacks: AnswerFeedback[]
  timeSeconds: number
  onContinue: () => void
}

const BLOCK_NAMES: Record<Difficulty, string> = { 1: 'Fácil', 2: 'Médio', 3: 'Difícil' }

function scoreColor(score: number) {
  if (score >= 75) return 'text-success'
  if (score >= 50) return 'text-warning'
  return 'text-error'
}

function formatTime(s: number) {
  const m = Math.floor(s / 60)
  const sec = s % 60
  return m > 0 ? `${m}m ${sec}s` : `${sec}s`
}

export function BlockResult({ blockNumber, score, feedbacks, timeSeconds, onContinue }: Props) {
  const isLast = blockNumber === 3

  return (
    <div className="mx-auto max-w-lg space-y-6 py-8">
      <div className="text-center">
        <p className="text-sm text-muted-foreground">Bloco {blockNumber} — {BLOCK_NAMES[blockNumber]}</p>
        <p className={`mt-2 text-6xl font-bold ${scoreColor(score)}`}>
          {score.toFixed(0)}
        </p>
        <p className="text-sm text-muted-foreground">pontos</p>
        <p className="mt-2 text-xs text-muted-foreground">Tempo: {formatTime(timeSeconds)}</p>
      </div>

      <div className="space-y-2">
        {feedbacks.map((f, i) => (
          <div key={i} className="flex items-center gap-3 rounded-lg border bg-card p-3">
            <span className={`text-lg ${f.is_correct ? 'text-success' : f.is_correct === null ? 'text-primary' : 'text-error'}`}>
              {f.is_correct ? '✓' : f.is_correct === null ? '✍️' : '✗'}
            </span>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-muted-foreground truncate">
                Q{i + 1} — {f.score !== null ? `${f.score} pts` : 'Pendente'}
              </p>
            </div>
          </div>
        ))}
      </div>

      <Button onClick={onContinue} className="w-full bg-primary hover:bg-primary/90" size="lg">
        {isLast ? 'Ver Resultado Final' : `Continuar para Bloco ${blockNumber + 1}`}
      </Button>
    </div>
  )
}
