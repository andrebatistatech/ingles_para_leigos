'use client'

import { useState } from 'react'
import { parseEssayFeedback } from '@/lib/quiz/essayFeedback'

export function EssayFeedbackContent({ raw }: { raw: string }) {
  const [showPt, setShowPt] = useState(false)
  const parsed = parseEssayFeedback(raw)

  // Feedback legado (texto puro)
  if (!parsed.structured) {
    return <p className="text-muted-foreground whitespace-pre-line">{parsed.text}</p>
  }

  const { correction, explanation_en, explanation_pt } = parsed.data
  const hasPt = explanation_pt.trim().length > 0
  const explanation = showPt && hasPt ? explanation_pt : explanation_en

  return (
    <div className="space-y-3">
      {correction && (
        <div className="rounded-md bg-success/10 border border-success/20 p-2">
          <p className="text-xs font-medium text-success mb-1">✅ Versão corrigida</p>
          <p className="text-text-main">{correction}</p>
        </div>
      )}

      {explanation && (
        <div className="space-y-1">
          <div className="flex items-center justify-between gap-2">
            <p className="text-xs font-medium text-muted-foreground">
              {showPt && hasPt ? 'O que melhorar' : "What to improve"}
            </p>
            {hasPt && (
              <button
                type="button"
                onClick={() => setShowPt(p => !p)}
                className="text-xs text-primary hover:underline"
              >
                {showPt ? '🇺🇸 View in English' : '🇧🇷 Ver em português'}
              </button>
            )}
          </div>
          <p className="text-muted-foreground">{explanation}</p>
        </div>
      )}
    </div>
  )
}
