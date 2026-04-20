import type { CEFRLevel } from '@/types'

export const CEFR_LEVELS: { level: CEFRLevel; label: string; desc: string }[] = [
  { level: 'A1', label: 'Iniciante', desc: 'Cumprimentos, família, números e rotinas básicas' },
  { level: 'A2', label: 'Elementar', desc: 'Compras, clima, hobbies e descrições simples' },
  { level: 'B1', label: 'Intermediário', desc: 'Viagens, trabalho, opiniões e experiências' },
  { level: 'B2', label: 'Int. Superior', desc: 'Notícias, debates, tecnologia e cultura' },
  { level: 'C1', label: 'Avançado', desc: 'Negócios, ciência, política e linguagem formal' },
  { level: 'C2', label: 'Proficiência', desc: 'Nuances, ironia, literatura e registro avançado' },
]

export function scoreColor(score: number) {
  if (score >= 75) return 'text-success'
  if (score >= 50) return 'text-warning'
  return 'text-error'
}

export function formatDuration(start: string, end: string | null) {
  if (!end) return '—'
  const s = Math.round((new Date(end).getTime() - new Date(start).getTime()) / 1000)
  const m = Math.floor(s / 60)
  return `${m}m ${s % 60}s`
}
