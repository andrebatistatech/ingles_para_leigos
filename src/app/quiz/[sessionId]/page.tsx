'use client'

import { useParams, useSearchParams } from 'next/navigation'
import { useQuizEngine } from '@/hooks/useQuizEngine'
import { ProgressBar } from '@/components/quiz/ProgressBar'
import { Timer } from '@/components/quiz/Timer'
import { QuestionCard } from '@/components/quiz/QuestionCard'
import { FeedbackPanel } from '@/components/quiz/FeedbackPanel'
import { BlockResult } from '@/components/quiz/BlockResult'
import { Skeleton } from '@/components/ui/skeleton'
import type { CEFRLevel } from '@/types'

export default function QuizPage() {
  const { sessionId } = useParams<{ sessionId: string }>()
  const searchParams = useSearchParams()
  const level = searchParams.get('level') as CEFRLevel

  const {
    phase,
    currentBlock,
    block,
    question,
    currentFeedback,
    answered,
    loadError,
    blockElapsed,
    blockScore,
    loadBlock,
    handleAnswer,
    handleNext,
    handleContinueBlock,
  } = useQuizEngine({ sessionId, level })

  if (phase === 'loading' && !loadError) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-10 space-y-4 animate-fade-in">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-40 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>
    )
  }

  if (loadError) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 text-center space-y-4 animate-fade-in">
        <p className="text-2xl font-bold text-text-main">Erro ao carregar quiz</p>
        <p className="text-sm text-muted-foreground max-w-sm mx-auto">{loadError}</p>
        <div className="flex justify-center gap-3">
          <button
            onClick={() => loadBlock(currentBlock)}
            className="rounded-lg border px-4 py-2 text-sm font-medium hover:bg-muted"
          >
            Tentar novamente
          </button>
          <a
            href="/dashboard"
            className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90"
          >
            Voltar ao Dashboard
          </a>
        </div>
      </div>
    )
  }

  if (phase === 'block_result' && block) {
    return (
      <div className="mx-auto max-w-2xl px-4">
        <BlockResult
          blockNumber={currentBlock}
          score={blockScore}
          feedbacks={block.feedbacks}
          timeSeconds={blockElapsed}
          onContinue={handleContinueBlock}
        />
      </div>
    )
  }

  if (!block || !question) return null

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 space-y-6">
      <div className="flex items-center justify-between gap-4">
        <ProgressBar
          current={block.currentIndex + 1}
          total={block.questions.length}
          blockNumber={currentBlock}
        />
        <Timer
          key={`${currentBlock}-${block.currentIndex}`}
          timeLimit={question.time_limit_seconds}
          onExpire={() => handleAnswer(null)}
          paused={answered}
        />
      </div>

      {phase === 'answering' && (
        <div className="animate-slide-up" key={`q-${currentBlock}-${block.currentIndex}`}>
          <QuestionCard
            question={question}
            onAnswer={handleAnswer}
            disabled={answered}
          />
        </div>
      )}

      {phase === 'feedback' && currentFeedback && (
        <div className="animate-slide-up">
          <FeedbackPanel
            feedback={currentFeedback}
            onNext={handleNext}
            nextLabel={
              block.currentIndex + 1 >= block.questions.length
                ? `Ver resultado do Bloco ${currentBlock}`
                : 'Próxima questão'
            }
          />
        </div>
      )}
    </div>
  )
}
