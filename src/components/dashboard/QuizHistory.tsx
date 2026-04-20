import { memo } from 'react'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { scoreColor, formatDuration } from '@/lib/constants'

interface Session {
  id: string
  level: string
  total_score: number | null
  started_at: string
  finished_at: string | null
}

interface Props {
  sessions: Session[]
}

export const QuizHistory = memo(function QuizHistory({ sessions }: Props) {
  if (sessions.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        Nenhum quiz completado ainda.{' '}
        <Link href="/quiz/select" className="text-primary underline">Começar agora</Link>
      </p>
    )
  }

  return (
    <div className="overflow-hidden rounded-xl border bg-card shadow-sm">
      <table className="w-full text-sm">
        <thead className="border-b bg-muted/30">
          <tr>
            <th className="px-4 py-3 text-left font-medium text-muted-foreground">Data</th>
            <th className="px-4 py-3 text-left font-medium text-muted-foreground">Nível</th>
            <th className="px-4 py-3 text-left font-medium text-muted-foreground">Nota</th>
            <th className="px-4 py-3 text-left font-medium text-muted-foreground">Duração</th>
            <th className="px-4 py-3 text-left font-medium text-muted-foreground"></th>
          </tr>
        </thead>
        <tbody>
          {sessions.map(s => (
            <tr key={s.id} className="border-b last:border-0 hover:bg-muted/10">
              <td className="px-4 py-3 text-muted-foreground">
                {format(new Date(s.started_at), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
              </td>
              <td className="px-4 py-3">
                <Badge variant="outline">{s.level}</Badge>
              </td>
              <td className="px-4 py-3">
                <span className={`font-semibold ${s.total_score !== null ? scoreColor(s.total_score) : 'text-muted-foreground'}`}>
                  {s.total_score !== null ? `${s.total_score.toFixed(0)} pts` : '—'}
                </span>
              </td>
              <td className="px-4 py-3 text-muted-foreground">
                {formatDuration(s.started_at, s.finished_at)}
              </td>
              <td className="px-4 py-3">
                <Link href={`/quiz/${s.id}/result`} className="text-primary hover:underline">
                  Ver detalhes
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
})
