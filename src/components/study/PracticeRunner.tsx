'use client'

import { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { QuestionCard } from '@/components/quiz/QuestionCard'
import { FeedbackPanel } from '@/components/quiz/FeedbackPanel'
import type { AnswerFeedback, Question } from '@/types'

interface Props {
  slug: string
  title: string
}

export function PracticeRunner({ slug, title }: Props) {
  const [questions, setQuestions] = useState<Question[]>([])
  const [topicId, setTopicId] = useState<string>('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [index, setIndex] = useState(0)
  const [feedback, setFeedback] = useState<AnswerFeedback | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [correctCount, setCorrectCount] = useState(0)
  const [done, setDone] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    setIndex(0)
    setFeedback(null)
    setCorrectCount(0)
    setDone(false)
    try {
      const res = await fetch('/api/study/practice/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error ?? 'Erro ao carregar exercícios.')
        return
      }
      setTopicId(data.topicId)
      setQuestions(data.questions ?? [])
    } catch {
      setError('Erro de conexão.')
    } finally {
      setLoading(false)
    }
  }, [slug])

  useEffect(() => { load() }, [load])

  async function handleAnswer(answer: string | null) {
    if (submitting || feedback) return
    setSubmitting(true)
    try {
      const res = await fetch('/api/study/practice/answer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topicId, questionId: questions[index].id, userAnswer: answer }),
      })
      const data: AnswerFeedback = await res.json()
      if (data.is_correct) setCorrectCount(c => c + 1)
      setFeedback(data)
    } finally {
      setSubmitting(false)
    }
  }

  function next() {
    setFeedback(null)
    if (index + 1 >= questions.length) {
      setDone(true)
    } else {
      setIndex(i => i + 1)
    }
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-6 w-1/2" />
        <Skeleton className="h-32 w-full" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-xl border bg-card p-6 text-center space-y-3">
        <p className="text-sm text-error">{error}</p>
        <Link href="/estudar"><Button variant="outline">Voltar</Button></Link>
      </div>
    )
  }

  if (questions.length === 0) {
    return (
      <div className="rounded-xl border bg-card p-6 text-center space-y-3">
        <p className="text-sm text-muted-foreground">Nenhum exercício disponível para este tópico ainda.</p>
        <Link href={`/estudar/${slug}`}><Button variant="outline">Voltar à lição</Button></Link>
      </div>
    )
  }

  if (done) {
    const pct = Math.round((correctCount / questions.length) * 100)
    return (
      <div className="rounded-xl border bg-card p-6 text-center space-y-4">
        <p className="text-4xl">{pct >= 70 ? '🎉' : '💪'}</p>
        <div>
          <p className="text-2xl font-bold text-text-main">{correctCount}/{questions.length}</p>
          <p className="text-sm text-muted-foreground">{pct}% de acerto</p>
        </div>
        <div className="grid gap-2 sm:grid-cols-2">
          <Button variant="outline" onClick={load}>Repetir</Button>
          <Link href={`/estudar/${slug}`}><Button className="w-full bg-primary hover:bg-primary/90">Voltar à lição</Button></Link>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span className="font-medium text-text-main">{title}</span>
        <span>{index + 1}/{questions.length}</span>
      </div>

      {!feedback ? (
        <QuestionCard question={questions[index]} onAnswer={handleAnswer} disabled={submitting} />
      ) : (
        <FeedbackPanel
          feedback={feedback}
          onNext={next}
          nextLabel={index + 1 >= questions.length ? 'Ver resultado' : 'Próxima'}
        />
      )}
    </div>
  )
}
