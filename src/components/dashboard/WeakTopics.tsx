import Link from 'next/link'
import { Button } from '@/components/ui/button'

export interface WeakTopic {
  topic: string
  count: number
  avgScore: number
}

interface Props {
  topics: WeakTopic[]
  isVip: boolean
}

function barColor(score: number): string {
  if (score < 40) return 'bg-error'
  if (score < 70) return 'bg-warning'
  return 'bg-success'
}

function formatTopic(topic: string): string {
  return topic
    .replace(/_/g, ' ')
    .replace(/\b\w/g, c => c.toUpperCase())
}

export function WeakTopics({ topics, isVip }: Props) {
  // Não-VIP: teaser com CTA
  if (!isVip) {
    return (
      <div className="rounded-xl border-2 border-amber-400/40 bg-amber-400/5 p-6 text-center space-y-3">
        <p className="text-3xl">🔒</p>
        <h2 className="font-semibold text-text-main">Descubra seus pontos fracos</h2>
        <p className="text-sm text-muted-foreground">
          Membros VIP veem em quais tópicos vão pior e recebem um plano de estudo direcionado.
        </p>
        <Link href="/upgrade">
          <Button className="bg-amber-500 hover:bg-amber-500/90 text-white">⭐ Seja VIP</Button>
        </Link>
      </div>
    )
  }

  // VIP sem dados suficientes
  if (topics.length === 0) {
    return (
      <div className="rounded-xl border bg-card p-6">
        <h2 className="font-semibold text-text-main mb-1">Seus pontos fracos</h2>
        <p className="text-sm text-muted-foreground">
          Complete mais quizzes para ver em quais tópicos você precisa melhorar.
        </p>
      </div>
    )
  }

  return (
    <div className="rounded-xl border bg-card p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold text-text-main">Seus pontos fracos</h2>
        <Link href="/quiz/select">
          <Button size="sm" variant="outline">Praticar</Button>
        </Link>
      </div>

      <ul className="space-y-3">
        {topics.map(t => (
          <li key={t.topic} className="space-y-1">
            <div className="flex items-center justify-between text-sm">
              <span className="text-text-main">{formatTopic(t.topic)}</span>
              <span className="text-muted-foreground">
                {Math.round(t.avgScore)}% · {t.count} {t.count === 1 ? 'questão' : 'questões'}
              </span>
            </div>
            <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
              <div
                className={`h-full rounded-full ${barColor(t.avgScore)}`}
                style={{ width: `${Math.max(4, Math.min(100, t.avgScore))}%` }}
              />
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
