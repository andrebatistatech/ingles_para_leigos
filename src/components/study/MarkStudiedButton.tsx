'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'

interface Props {
  topicId: string
  alreadyStudied: boolean
}

export function MarkStudiedButton({ topicId, alreadyStudied }: Props) {
  const [studied, setStudied] = useState(alreadyStudied)
  const [loading, setLoading] = useState(false)

  async function mark() {
    setLoading(true)
    try {
      const res = await fetch('/api/study/studied', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topicId }),
      })
      if (res.ok) setStudied(true)
    } finally {
      setLoading(false)
    }
  }

  if (studied) {
    return (
      <Button variant="outline" disabled className="w-full">
        ✓ Estudado
      </Button>
    )
  }

  return (
    <Button variant="outline" className="w-full" onClick={mark} disabled={loading}>
      {loading ? 'Salvando...' : 'Marcar como estudado'}
    </Button>
  )
}
