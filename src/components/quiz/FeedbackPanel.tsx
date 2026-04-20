'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import type { AnswerFeedback } from '@/types'

interface Props {
  feedback: AnswerFeedback
  onNext: () => void
  nextLabel?: string
}

export function FeedbackPanel({ feedback, onNext, nextLabel = 'Próxima questão' }: Props) {
  const [aiFeedback, setAiFeedback] = useState<string | null>(feedback.ai_feedback ?? null)
  const [polling, setPolling] = useState(feedback.pending === true)

  useEffect(() => {
    if (!feedback.pending || !feedback.answerId) return

    let attempts = 0
    const maxAttempts = 10 // 10 × 2s = 20s

    const interval = setInterval(async () => {
      attempts++
      try {
        const res = await fetch(`/api/quiz/evaluate?answerId=${feedback.answerId}`)
        const data = await res.json()
        if (!data.pending && data.ai_feedback) {
          setAiFeedback(data.ai_feedback)
          setPolling(false)
          clearInterval(interval)
        }
      } catch { /* ignorar */ }

      if (attempts >= maxAttempts) {
        setPolling(false)
        clearInterval(interval)
      }
    }, 2000)

    return () => clearInterval(interval)
  }, [feedback.pending, feedback.answerId])

  const isCorrect = feedback.is_correct
  const isEssay = feedback.pending === true

  return (
    <div className="rounded-xl border bg-card p-5 shadow-sm space-y-4">
      {/* Resultado */}
      {!isEssay && (
        <div className={`flex items-center gap-2 font-semibold ${isCorrect ? 'text-success' : 'text-error'}`}>
          <span className="text-xl">{isCorrect ? '✓' : '✗'}</span>
          <span>{isCorrect ? 'Correto!' : 'Incorreto'}</span>
          {feedback.score !== null && (
            <span className="ml-auto text-sm font-normal text-muted-foreground">
              +{feedback.score} pts
            </span>
          )}
        </div>
      )}

      {isEssay && (
        <div className="flex items-center gap-2 font-semibold text-primary">
          <span className="text-xl">✍️</span>
          <span>Redação enviada</span>
        </div>
      )}

      {/* Resposta correta */}
      <div className="rounded-lg bg-muted p-3 text-sm">
        <p className="mb-1 font-medium text-muted-foreground">Resposta esperada:</p>
        <p className="text-text-main">{feedback.correct_answer}</p>
      </div>

      {/* Explicação */}
      <div className="text-sm space-y-1">
        <p className="font-medium text-text-main">Explicação</p>
        <p className="text-muted-foreground">{feedback.explanation}</p>
      </div>

      {/* Dica */}
      <div className="rounded-lg border border-warning/30 bg-warning/5 p-3 text-sm">
        <p className="font-medium text-warning">💡 Dica de estudo</p>
        <p className="mt-1 text-muted-foreground">{feedback.study_tip}</p>
      </div>

      {/* Feedback da IA (essays) */}
      {isEssay && (
        <div className="rounded-lg border border-primary/20 bg-primary/5 p-3 text-sm space-y-1">
          <p className="font-medium text-primary">🤖 Avaliação da IA</p>
          {polling ? (
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <p className="text-xs text-muted-foreground">Avaliando sua resposta...</p>
            </div>
          ) : aiFeedback ? (
            <p className="text-muted-foreground whitespace-pre-line">{aiFeedback}</p>
          ) : (
            <p className="text-muted-foreground">Avaliação indisponível no momento.</p>
          )}
        </div>
      )}

      <Button
        onClick={onNext}
        disabled={isEssay && polling}
        className="w-full bg-primary hover:bg-primary/90"
      >
        {nextLabel}
      </Button>
    </div>
  )
}
