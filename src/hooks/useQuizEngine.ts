'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import type { AnswerFeedback, CEFRLevel, Difficulty, Question } from '@/types'

type Phase = 'loading' | 'answering' | 'feedback' | 'block_result'

interface BlockState {
  questions: Question[]
  feedbacks: AnswerFeedback[]
  currentIndex: number
  startTime: number
  questionStartedAt: string
}

interface UseQuizEngineOptions {
  sessionId: string
  level: CEFRLevel
}

export function useQuizEngine({ sessionId, level }: UseQuizEngineOptions) {
  const router = useRouter()

  const [phase, setPhase] = useState<Phase>('loading')
  const [currentBlock, setCurrentBlock] = useState<Difficulty>(1)
  const [block, setBlock] = useState<BlockState | null>(null)
  const [currentFeedback, setCurrentFeedback] = useState<AnswerFeedback | null>(null)
  const [answered, setAnswered] = useState(false)
  const [loadError, setLoadError] = useState<string | null>(null)
  const blockStartRef = useRef<number>(Date.now())

  const loadBlock = useCallback(async (blockNum: Difficulty) => {
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
  }, [level, sessionId])

  // Load block 1 on mount
  useEffect(() => {
    loadBlock(1)
  }, [loadBlock])

  const handleAnswer = useCallback(async (answer: string | null) => {
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
  }, [block, answered, sessionId, currentBlock])

  const handleNext = useCallback(() => {
    if (!block) return
    const newFeedbacks = [...block.feedbacks, currentFeedback!]
    const nextIndex = block.currentIndex + 1

    if (nextIndex >= block.questions.length) {
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
  }, [block, currentFeedback])

  const handleContinueBlock = useCallback(() => {
    if (currentBlock === 3) {
      router.push(`/quiz/${sessionId}/result`)
    } else {
      loadBlock((currentBlock + 1) as Difficulty)
    }
  }, [currentBlock, router, sessionId, loadBlock])

  // Derived values
  const question = block?.questions[block.currentIndex] ?? null
  const blockElapsed = Math.round((Date.now() - blockStartRef.current) / 1000)
  const blockScore = block?.feedbacks.length
    ? block.feedbacks.reduce((sum, f) => sum + (f.score ?? 0), 0) / block.feedbacks.length
    : 0

  return {
    // State
    phase,
    currentBlock,
    block,
    question,
    currentFeedback,
    answered,
    loadError,
    blockElapsed,
    blockScore,

    // Actions
    loadBlock,
    handleAnswer,
    handleNext,
    handleContinueBlock,
  }
}
