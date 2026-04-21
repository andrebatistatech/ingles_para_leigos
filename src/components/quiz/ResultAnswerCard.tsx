'use client'

import { useState } from 'react'

interface Props {
  index: number
  questionText: string
  questionType: string
  userAnswer: string | null
  correctAnswer: string
  explanation: string
  studyTip: string
  isCorrect: boolean | null
  score: number
  aiFeedback: string | null
}

export function ResultAnswerCard({
  index,
  questionText,
  questionType,
  userAnswer,
  correctAnswer,
  explanation,
  studyTip,
  isCorrect,
  score,
  aiFeedback,
}: Props) {
  const [open, setOpen] = useState(false)
  const isEssay = questionType === 'essay'

  const statusIcon = isCorrect ? '✓' : isCorrect === null ? '✍️' : '✗'
  const statusColor = isCorrect
    ? 'text-success border-success/20 bg-success/5'
    : isCorrect === null
    ? 'text-primary border-primary/20 bg-primary/5'
    : 'text-error border-error/20 bg-error/5'

  const isVipRequired = aiFeedback === 'vip_required'
  const isFailed = aiFeedback === 'evaluation_failed'
  const hasRealFeedback = aiFeedback && !isVipRequired && !isFailed

  return (
    <div className={`rounded-lg border bg-card transition-all ${open ? 'shadow-sm' : ''}`}>
      <button
        className="w-full flex items-center gap-3 p-3 text-left"
        onClick={() => setOpen(o => !o)}
        aria-expanded={open}
        aria-controls={`answer-detail-${index}`}
      >
        <span className={`text-base font-semibold ${statusColor.split(' ')[0]}`}>{statusIcon}</span>
        <div className="flex-1 min-w-0">
          <p className="text-sm text-text-main truncate">
            <span className="text-muted-foreground mr-1">Q{index}.</span>
            {questionText}
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-sm font-medium text-muted-foreground">{score} pts</span>
          <span className="text-muted-foreground text-xs">{open ? '▲' : '▼'}</span>
        </div>
      </button>

      {open && (
        <div id={`answer-detail-${index}`} className="px-3 pb-3 space-y-3 border-t pt-3 animate-fade-in">
          {/* Resposta do usuário */}
          {userAnswer && (
            <div className="text-sm">
              <p className="text-xs font-medium text-muted-foreground mb-1">Sua resposta</p>
              <p className={`${isCorrect === false ? 'text-error' : 'text-text-main'}`}>{userAnswer}</p>
            </div>
          )}
          {!userAnswer && (
            <p className="text-sm text-muted-foreground italic">Sem resposta (tempo esgotado)</p>
          )}

          {/* Resposta correta */}
          {!isCorrect && !isEssay && (
            <div className="rounded-md bg-success/10 border border-success/20 p-2 text-sm">
              <p className="text-xs font-medium text-success mb-1">Resposta correta</p>
              <p className="text-text-main">{correctAnswer}</p>
            </div>
          )}

          {/* Explicação */}
          <div className="text-sm space-y-1">
            <p className="text-xs font-medium text-muted-foreground">Explicação</p>
            <p className="text-text-main">{explanation}</p>
          </div>

          {/* Study tip */}
          <div className="rounded-md border border-warning/30 bg-warning/5 p-2 text-sm">
            <p className="text-xs font-medium text-warning">💡 Dica</p>
            <p className="mt-0.5 text-muted-foreground">{studyTip}</p>
          </div>

          {/* AI feedback (essays) */}
          {isEssay && (
            <div className={`rounded-md border p-2 text-sm ${isVipRequired ? 'border-amber-400/30 bg-amber-400/5' : 'border-primary/20 bg-primary/5'}`}>
              <p className={`text-xs font-medium mb-1 ${isVipRequired ? 'text-amber-500' : 'text-primary'}`}>
                {isVipRequired ? '⭐ Avaliação VIP' : '🤖 Feedback da IA'}
              </p>
              {isVipRequired && (
                <p className="text-muted-foreground">Disponível apenas para membros VIP.</p>
              )}
              {isFailed && (
                <p className="text-muted-foreground">Avaliação indisponível.</p>
              )}
              {hasRealFeedback && (
                <p className="text-muted-foreground whitespace-pre-line">{aiFeedback}</p>
              )}
              {!aiFeedback && !isVipRequired && !isFailed && (
                <p className="text-muted-foreground">Avaliação pendente.</p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
