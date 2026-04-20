'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function QuizError({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => { console.error(error) }, [error])

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-4 text-center">
      <h1 className="text-2xl font-bold text-text-main">Erro no quiz</h1>
      <p className="text-sm text-muted-foreground max-w-sm">
        Não foi possível carregar o quiz. Seu progresso pode ter sido salvo parcialmente.
      </p>
      <div className="flex gap-3">
        <Button variant="outline" onClick={reset}>Tentar novamente</Button>
        <Link href="/dashboard"><Button>Voltar ao Dashboard</Button></Link>
      </div>
    </div>
  )
}
