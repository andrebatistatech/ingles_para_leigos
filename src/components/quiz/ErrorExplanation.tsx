'use client'

import { memo, useCallback, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'

interface Props {
  questionText: string
  userAnswer: string | null
  correctAnswer: string
  level: string
  sessionId: string
}

export const ErrorExplanation = memo(function ErrorExplanation({
  questionText,
  userAnswer,
  correctAnswer,
  level,
  sessionId,
}: Props) {
  const [explanation, setExplanation] = useState<string | null>(null)
  const [remaining, setRemaining] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [vipRequired, setVipRequired] = useState(false)
  const [limitReached, setLimitReached] = useState(false)

  const fetchExplanation = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const res = await fetch('/api/quiz/explain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ questionText, userAnswer, correctAnswer, level, sessionId }),
      })

      const data = await res.json()

      if (res.status === 403 && data.vip_required) {
        setVipRequired(true)
        return
      }

      if (res.status === 429 && data.limit_reached) {
        setLimitReached(true)
        return
      }

      if (!res.ok) throw new Error(data.error)

      setExplanation(data.explanation)
      setRemaining(data.remaining)
    } catch {
      setError('Não foi possível gerar a explicação.')
    } finally {
      setLoading(false)
    }
  }, [questionText, userAnswer, correctAnswer, level, sessionId])

  if (vipRequired) {
    return (
      <div className="rounded-lg border border-amber-400/30 bg-amber-400/5 p-3 text-sm animate-fade-in">
        <p className="font-medium text-amber-500">⭐ Recurso VIP</p>
        <p className="text-muted-foreground mt-1">
          Explicações personalizadas por IA estão disponíveis para membros VIP.
        </p>
      </div>
    )
  }

  if (limitReached) {
    return (
      <div className="rounded-lg border border-muted p-3 text-sm animate-fade-in">
        <p className="font-medium text-muted-foreground">🤖 Limite atingido</p>
        <p className="text-muted-foreground mt-1">
          Você usou todas as 5 explicações desta sessão.
        </p>
      </div>
    )
  }

  if (explanation) {
    return (
      <div className="rounded-lg border border-primary/20 bg-primary/5 p-3 text-sm space-y-1 animate-fade-in">
        <div className="flex items-center justify-between">
          <p className="font-medium text-primary">🤖 Explicação da IA</p>
          {remaining !== null && (
            <p className="text-xs text-muted-foreground">{remaining} restante{remaining !== 1 ? 's' : ''}</p>
          )}
        </div>
        <p className="text-muted-foreground whitespace-pre-line">{explanation}</p>
      </div>
    )
  }

  return (
    <div>
      {loading ? (
        <div className="space-y-2 p-3">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
          <p className="text-xs text-muted-foreground">Analisando seu erro...</p>
        </div>
      ) : (
        <>
          <Button
            variant="ghost"
            size="sm"
            onClick={fetchExplanation}
            className="text-primary hover:text-primary/80 text-xs"
          >
            🤖 Por que eu errei?
          </Button>
          {error && <p className="text-xs text-error mt-1">{error}</p>}
        </>
      )}
    </div>
  )
})
