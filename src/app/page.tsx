import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { CEFR_LEVELS } from '@/lib/constants'

export default function HomePage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16">
      <div className="text-center">
        <Badge className="mb-4 bg-primary/10 text-primary hover:bg-primary/10">
          Avaliação por IA • CEFR A1–C2
        </Badge>
        <h1 className="text-4xl font-bold tracking-tight text-text-main sm:text-5xl">
          Aprenda inglês no seu nível
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-lg text-muted-foreground">
          Quiz de 30 questões com feedback educativo imediato e avaliação de redações por inteligência artificial.
        </p>
        <div className="mt-8 flex justify-center gap-3">
          <Link href="/login">
            <Button size="lg" className="bg-primary hover:bg-primary/90">
              Começar agora — é grátis
            </Button>
          </Link>
        </div>
      </div>

      <div className="mt-16">
        <h2 className="mb-6 text-center text-xl font-semibold text-text-main">
          Escolha seu nível CEFR
        </h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          {CEFR_LEVELS.map(({ level, label, desc }) => (
            <div
              key={level}
              className="rounded-xl border bg-card p-4 shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="mb-2 flex items-center gap-2">
                <span className="text-2xl font-bold text-primary">{level}</span>
                <span className="text-sm font-medium text-text-main">{label}</span>
              </div>
              <p className="text-xs text-muted-foreground">{desc}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-3">
        {[
          { icon: '🎯', title: '30 questões por quiz', desc: '3 blocos de dificuldade progressiva' },
          { icon: '⏱️', title: 'Timer por questão', desc: '60s para múltipla escolha, 120s para redações' },
          { icon: '🤖', title: 'IA avalia redações', desc: 'Feedback educativo personalizado por Claude AI' },
        ].map(({ icon, title, desc }) => (
          <div key={title} className="rounded-xl border bg-card p-5 text-center shadow-sm">
            <div className="mb-2 text-3xl">{icon}</div>
            <h3 className="font-semibold text-text-main">{title}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{desc}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
