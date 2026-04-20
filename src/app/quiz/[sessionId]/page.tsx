'use client'

import { useEffect, useRef, useState } from 'react'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import { ProgressBar } from '@/components/quiz/ProgressBar'
import { Timer } from '@/components/quiz/Timer'
import { QuestionCard } from '@/components/quiz/QuestionCard'
import { FeedbackPanel } from '@/components/quiz/FeedbackPanel'
import { BlockResult } from '@/components/quiz/BlockResult'
import { Skeleton } from '@/components/ui/skeleton'
import type { AnswerFeedback, CEFRLevel, Difficulty, Question } from '@/types'

type Phase = 'loading' | 'answering' | 'feedback' | 'block_result'

interface BlockState {
  questions: Question[]
  feedbacks: AnswerFeedback[]
  currentIndex: number
  startTime: number    // timestamp do início do bloco
  questionStartedAt: string  // ISO do início da questão atual
}

export default function QuizPage() {
  const { sessionId } = useParams<{ sessionId: string }>()
  const searchParams = useSearchParams()
  const router = useRouter()
  const level = searchParams.get('level') as CEFRLevel

  const [phase, setPhase] = useState<Phase>('loading')
  const [currentBlock, setCurrentBlock] = useState<Difficulty>(1)
  const [block, setBlock] = useState<BlockState | null>(null)
  const [currentFeedback, setCurrentFeedback] = useState<AnswerFeedback | null>(null)
  const [answered, setAnswered] = useState(false)
  const [loadError, setLoadError] = useState<string | null>(null)
  const blockStartRef = useRef<number>(Date.now())

  async function loadBlock(blockNum: Difficulty) {
    setPhase('loading')
    setLoadError(null)
    try {
      const res = await fetch('/api/quiz/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ level, block: blockNum, sessionId }),
      })
      const data = await res.json()

      if (!res.ok) {
        setLoadError(data.error ?? 'Erro ao carregar o quiz.')
        return
      }

      if (!Array.isArray(data.questions) || data.questions.length === 0) {
        setLoadError('Nenhuma questão encontrada para este nível. O banco de questões pode estar vazio.')
        return
      }

      blockStartRef.current = Date.now()
      setBlock({
        questions: data.questions,
        feedbacks: [],
        currentIndex: 0,
        startTime: Date.now(),
        questionStartedAt: new Date().toISOString(),
      })
      setCurrentBlock(blockNum)
      setAnswered(false)
      setPhase('answering')
    } catch {
      setLoadError('Erro de conexão ao carregar o quiz. Tente novamente.')
    }
  }

  // Bloco 1 já foi carregado por /quiz/select — as questões chegam via query param não disponível,
  // então recarregamos o bloco 1 aqui ao montar
  useEffect(() => {
    loadBlock(1)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function handleAnswer(answer: string | null) {
    if (!block || answered) return
    setAnswered(true)

    const question = block.questions[block.currentIndex]
    const res = await fetch('/api/quiz/answer', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sessionId,
        questionId: question.id,
        blockNumber: currentBlock,
        userAnswer: answer,
        questionStartedAt: block.questionStartedAt,
      }),
    })

    const feedback: AnswerFeedback & { answerId?: string } = await res.json()
    setCurrentFeedback(feedback)
    setPhase('feedback')
  }

  function handleNext() {
    if (!block) return
    const newFeedbacks = [...block.feedbacks, currentFeedback!]
    const nextIndex = block.currentIndex + 1

    if (nextIndex >= block.questions.length) {
      // Fim do bloco
      setBlock({ ...block, feedbacks: newFeedbacks, currentIndex: nextIndex })
      setPhase('block_result')
    } else {
      setBlock({
        ...block,
        feedbacks: newFeedbacks,
        currentIndex: nextIndex,
        questionStartedAt: new Date().toISOString(),
      })
      setAnswered(false)
      setCurrentFeedback(null)
      setPhase('answering')
    }
  }

  function handleContinueBlock() {
    if (currentBlock === 3) {
      router.push(`/quiz/${sessionId}/result`)
    } else {
      loadBlock((currentBlock + 1) as Difficulty)
    }
  }

  if (phase === 'loading' && !loadError) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-10 space-y-4">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-40 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>
    )
  }

  if (loadError) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 text-center space-y-4">
        <p className="text-2xl font-bold text-text-main">Erro ao carregar quiz</p>
        <p className="text-sm text-muted-foreground max-w-sm mx-auto">{loadError}</p>
        <div className="flex justify-center gap-3">
          <button
            onClick={() => loadBlock(currentBlock)}
            className="rounded-lg border px-4 py-2 text-sm font-medium hover:bg-muted"
          >
            Tentar novamente
          </button>
          <button
            onClick={() => router.push('/dashboard')}
            className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90"
          >
            Voltar ao Dashboard
          </button>
        </div>
      </div>
    )
  }

  if (phase === 'block_result' && block) {
    const elapsed = Math.round((Date.now() - blockStartRef.current) / 1000)
    const blockScore = block.feedbacks.reduce((sum, f) => sum + (f.score ?? 0), 0) / block.feedbacks.length
    return (
      <div className="mx-auto max-w-2xl px-4">
        <BlockResult
          blockNumber={currentBlock}
          score={blockScore}
          feedbacks={block.feedbacks}
          timeSeconds={elapsed}
          onContinue={handleContinueBlock}
        />
      </div>
    )
  }

  if (!block) return null

  const question = block.questions[block.currentIndex]

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
        <QuestionCard
          question={question}
          onAnswer={handleAnswer}
          disabled={answered}
        />
      )}

      {phase === 'feedback' && currentFeedback && (
        <FeedbackPanel
          feedback={currentFeedback}
          onNext={handleNext}
          nextLabel={
            block.currentIndex + 1 >= block.questions.length
              ? `Ver resultado do Bloco ${currentBlock}`
              : 'Próxima questão'
          }
        />
      )}
    </div>
  )
}
