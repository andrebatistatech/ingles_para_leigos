'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function GlobalError({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => { console.error(error) }, [error])

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-4 text-center">
      <h1 className="text-2xl font-bold text-text-main">Algo deu errado</h1>
      <p className="text-sm text-muted-foreground max-w-sm">
        Ocorreu um erro inesperado. Tente novamente ou volte ao início.
      </p>
      <div className="flex gap-3">
        <Button variant="outline" onClick={reset}>Tentar novamente</Button>
        <Link href="/dashboard"><Button>Ir ao Dashboard</Button></Link>
      </div>
    </div>
  )
}
