'use client'

import { memo } from 'react'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, ReferenceLine,
} from 'recharts'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

interface DataPoint {
  date: string
  score: number
  level: string
}

interface Props {
  data: DataPoint[]
}

export const ScoreChart = memo(function ScoreChart({ data }: Props) {
  if (data.length === 0) {
    return (
      <div className="flex h-48 items-center justify-center rounded-xl border bg-card text-sm text-muted-foreground">
        Complete um quiz para ver sua evolução
      </div>
    )
  }

  const formatted = data.map(d => ({
    ...d,
    label: format(new Date(d.date), 'dd/MM', { locale: ptBR }),
  }))

  return (
    <div className="rounded-xl border bg-card p-4 shadow-sm">
      <p className="mb-4 text-sm font-medium text-text-main">Evolução da nota</p>
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
            stroke="#2563EB"
            strokeWidth={2}
            dot={{ r: 4, fill: '#2563EB' }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
})
