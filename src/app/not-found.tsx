import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-4 text-center">
      <p className="text-6xl font-bold text-primary">404</p>
      <h1 className="text-2xl font-bold text-text-main">Página não encontrada</h1>
      <p className="text-sm text-muted-foreground">A página que você procura não existe.</p>
      <Link href="/dashboard"><Button>Ir ao Dashboard</Button></Link>
    </div>
  )
}
