import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { CEFR_LEVELS } from '@/lib/constants'

const FREE_FEATURES = [
  '10 questões de múltipla escolha por bloco',
  '3 blocos de dificuldade progressiva',
  'Feedback imediato com explicação',
  'Dicas de estudo por questão',
  'Histórico e gráfico de evolução',
]

const VIP_FEATURES = [
  'Tudo do plano grátis',
  '2 questões de redação por bloco',
  'Correção de redações por IA (GPT-4)',
  'Feedback personalizado por nível CEFR',
  'Badge ⭐ VIP exclusivo',
]

export default function HomePage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16 space-y-20">
      {/* Hero */}
      <div className="text-center">
        <Badge className="mb-4 bg-primary/10 text-primary hover:bg-primary/10">
          Avaliação por IA • CEFR A1–C2
        </Badge>
        <h1 className="text-4xl font-bold tracking-tight text-text-main sm:text-5xl">
          Aprenda inglês no seu nível
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-lg text-muted-foreground">
          Quiz de 30 questões com feedback educativo imediato. Membros VIP recebem correção de redações por inteligência artificial.
        </p>
        <div className="mt-8 flex justify-center gap-3">
          <Link href="/login">
            <Button size="lg" className="bg-primary hover:bg-primary/90">
              Começar agora — é grátis
            </Button>
          </Link>
        </div>
      </div>

      {/* Planos */}
      <div>
        <h2 className="mb-8 text-center text-2xl font-bold text-text-main">Planos</h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {/* Grátis */}
          <div className="rounded-2xl border bg-card p-6 shadow-sm flex flex-col">
            <div className="mb-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Grátis</p>
              <p className="mt-1 text-3xl font-bold text-text-main">R$ 0</p>
              <p className="text-sm text-muted-foreground mt-1">Para sempre</p>
            </div>
            <ul className="space-y-2 flex-1">
              {FREE_FEATURES.map(f => (
                <li key={f} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <span className="text-success mt-0.5">✓</span>
                  {f}
                </li>
              ))}
            </ul>
            <Link href="/login" className="mt-6">
              <Button variant="outline" className="w-full">Criar conta grátis</Button>
            </Link>
          </div>

          {/* VIP */}
          <div className="rounded-2xl border-2 border-amber-400 bg-card p-6 shadow-md flex flex-col relative overflow-hidden">
            <div className="absolute top-3 right-3">
              <Badge className="bg-amber-500/15 text-amber-500 border-amber-500/30 text-xs">⭐ Popular</Badge>
            </div>
            <div className="mb-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-amber-500">VIP</p>
              <p className="mt-1 text-3xl font-bold text-text-main">Sob consulta</p>
              <p className="text-sm text-muted-foreground mt-1">Entre em contato</p>
            </div>
            <ul className="space-y-2 flex-1">
              {VIP_FEATURES.map(f => (
                <li key={f} className="flex items-start gap-2 text-sm text-text-main">
                  <span className="text-amber-500 mt-0.5">⭐</span>
                  {f}
                </li>
              ))}
            </ul>
            <Link href="/login" className="mt-6">
              <Button className="w-full bg-amber-500 hover:bg-amber-500/90 text-white">
                Quero ser VIP
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Níveis CEFR */}
      <div>
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

      {/* Features */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        {[
          { icon: '🎯', title: '30 questões por quiz', desc: '3 blocos de dificuldade progressiva' },
          { icon: '⏱️', title: 'Timer por questão', desc: '60s para múltipla escolha, 120s para redações' },
          { icon: '🤖', title: 'IA avalia redações', desc: 'Feedback personalizado por GPT-4 (VIP)' },
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
