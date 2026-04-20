'use client'

import { memo, useState } from 'react'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, ReferenceLine,
} from 'recharts'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

const LEVEL_COLORS: Record<string, string> = {
  A1: '#10B981', A2: '#3B82F6', B1: '#8B5CF6',
  B2: '#F59E0B', C1: '#EF4444', C2: '#EC4899',
}

const ALL_LEVELS = ['Todos', 'A1', 'A2', 'B1', 'B2', 'C1', 'C2']

interface DataPoint {
  date: string
  score: number
  level: string
}

interface Props {
  data: DataPoint[]
}

export const ScoreChart = memo(function ScoreChart({ data }: Props) {
  const [filter, setFilter] = useState('Todos')

  if (data.length === 0) {
    return (
      <div className="flex h-48 items-center justify-center rounded-xl border bg-card text-sm text-muted-foreground">
        Complete um quiz para ver sua evolução
      </div>
    )
  }

  const filtered = filter === 'Todos' ? data : data.filter(d => d.level === filter)
  const activeColor = filter === 'Todos' ? '#2563EB' : (LEVEL_COLORS[filter] ?? '#2563EB')

  const formatted = filtered.map(d => ({
    ...d,
    label: format(new Date(d.date), 'dd/MM', { locale: ptBR }),
  }))

  return (
    <div className="rounded-xl border bg-card p-4 shadow-sm space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <p className="text-sm font-medium text-text-main">Evolução da nota</p>
        <div className="flex flex-wrap gap-1">
          {ALL_LEVELS.map(l => (
            <button
              key={l}
              onClick={() => setFilter(l)}
              className={`px-2 py-0.5 rounded text-xs font-medium transition-colors ${
                filter === l
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
            >
              {l}
            </button>
          ))}
        </div>
      </div>

      {formatted.length === 0 ? (
        <div className="flex h-40 items-center justify-center text-sm text-muted-foreground">
          Nenhum quiz completado para nível {filter}
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={formatted} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="label" tick={{ fontSize: 11 }} />
            <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} />
            <Tooltip
              formatter={(value, _name, props) => [
                `${Number(value).toFixed(0)} pts`,
                (props.payload as DataPoint | undefined)?.level ?? '',
              ]}
            />
            <ReferenceLine y={75} stroke="#16A34A" strokeDasharray="4 4" strokeOpacity={0.4} />
            <ReferenceLine y={50} stroke="#F59E0B" strokeDasharray="4 4" strokeOpacity={0.4} />
            <Line
              type="monotone"
              dataKey="score"
              stroke={activeColor}
              strokeWidth={2}
              dot={{ r: 4, fill: activeColor }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  )
})
