'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Badge } from '@/components/ui/badge'
import type { CEFRLevel } from '@/types'

interface LevelInfo {
  level: CEFRLevel
  label: string
  desc: string
}

interface Props {
  levels: LevelInfo[]
  countByLevel: Record<string, number>
}

const LEVEL_COLORS: Record<CEFRLevel, string> = {
  A1: 'border-green-200 hover:border-green-400',
  A2: 'border-emerald-200 hover:border-emerald-400',
  B1: 'border-blue-200 hover:border-blue-400',
  B2: 'border-indigo-200 hover:border-indigo-400',
  C1: 'border-violet-200 hover:border-violet-400',
  C2: 'border-purple-200 hover:border-purple-400',
}

export function LevelSelector({ levels, countByLevel }: Props) {
  const router = useRouter()
  const [loading, setLoading] = useState<CEFRLevel | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function startQuiz(level: CEFRLevel) {
    setLoading(level)
    setError(null)
    try {
      const res = await fetch('/api/quiz/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ level, block: 1 }),
      })
      if (!res.ok) throw new Error('Erro ao iniciar quiz')
      const data = await res.json()
      if (data.sessionId) {
        router.push(`/quiz/${data.sessionId}?level=${level}`)
      } else {
        throw new Error('Sessão não criada')
      }
    } catch {
      setError('Não foi possível iniciar o quiz. Tente novamente.')
      setLoading(null)
    }
  }

  return (
    <div className="space-y-4">
      {error && (
        <p className="rounded-lg border border-error/30 bg-error/5 px-4 py-2 text-sm text-error" role="alert">
          {error}
        </p>
      )}
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
      {levels.map(({ level, label, desc }) => {
        const count = countByLevel[level] ?? 0
        const isLoading = loading === level
        return (
          <button
            key={level}
            onClick={() => startQuiz(level)}
            disabled={loading !== null}
            className={`rounded-xl border-2 bg-card p-5 text-left shadow-sm transition-all hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60 ${LEVEL_COLORS[level]}`}
          >
            <div className="mb-2 flex items-center justify-between">
              <span className="text-2xl font-bold text-primary">{level}</span>
              {count > 0 && (
                <Badge variant="secondary" className="text-xs">{count}x</Badge>
              )}
            </div>
            <p className="font-medium text-text-main text-sm">{label}</p>
            <p className="mt-1 text-xs text-muted-foreground">{desc}</p>
            {isLoading && (
              <p className="mt-2 text-xs text-primary">Carregando...</p>
            )}
          </button>
        )
      })}
    </div>
    </div>
  )
}
