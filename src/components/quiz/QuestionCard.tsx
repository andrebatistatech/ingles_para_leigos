'use client'

import { memo, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import type { Question } from '@/types'

interface Props {
  question: Question
  onAnswer: (answer: string | null) => void
  disabled?: boolean
}

export const QuestionCard = memo(function QuestionCard({ question, onAnswer, disabled = false }: Props) {
  const [essay, setEssay] = useState('')

  if (question.type === 'multiple_choice') {
    const options: string[] = question.options ?? []
    return (
      <div className="space-y-3">
        <p className="text-lg font-medium text-text-main leading-relaxed">
          {question.question_text}
        </p>
        <div className="grid gap-2" role="radiogroup" aria-label="Opções de resposta">
          {options.map((opt, i) => (
            <button
              key={i}
              disabled={disabled}
              onClick={() => onAnswer(opt)}
              role="radio"
              aria-checked={false}
              aria-label={`Opção ${String.fromCharCode(65 + i)}: ${opt}`}
              className={`w-full rounded-lg border border-border bg-card px-4 py-3 text-left text-sm font-medium text-text-main transition-all hover:border-primary hover:bg-primary/5 hover:shadow-sm disabled:cursor-not-allowed disabled:opacity-50 animate-slide-up animate-option-${i + 1}`}
            >
              <span className="mr-2 inline-flex h-6 w-6 items-center justify-center rounded-full border border-border text-xs font-bold">
                {String.fromCharCode(65 + i)}
              </span>
              {opt}
            </button>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <p className="text-lg font-medium text-text-main leading-relaxed">
        {question.question_text}
      </p>
      <Textarea
        value={essay}
        onChange={e => setEssay(e.target.value)}
        disabled={disabled}
        placeholder="Escreva sua resposta em inglês..."
        className="min-h-32 resize-none"
        maxLength={2000}
        aria-label="Sua resposta em inglês"
      />
      <div className="flex items-center justify-between">
        <span className="text-xs text-muted-foreground">{essay.length}/2000</span>
        <Button
          onClick={() => onAnswer(essay.trim() || null)}
          disabled={disabled || essay.trim().length === 0}
          className="bg-primary hover:bg-primary/90"
        >
          Enviar resposta
        </Button>
      </div>
    </div>
  )
})
