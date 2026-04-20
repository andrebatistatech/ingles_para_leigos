import { Progress } from '@/components/ui/progress'
import type { Difficulty } from '@/types'

const BLOCK_LABELS: Record<Difficulty, string> = {
  1: 'Fácil',
  2: 'Médio',
  3: 'Difícil',
}

interface Props {
  current: number  // 1-10
  total: number
  blockNumber: Difficulty
}

export function ProgressBar({ current, total, blockNumber }: Props) {
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>Bloco {blockNumber} — {BLOCK_LABELS[blockNumber]}</span>
        <span>Questão {current} de {total}</span>
      </div>
      <Progress value={(current / total) * 100} className="h-2" />
    </div>
  )
}
