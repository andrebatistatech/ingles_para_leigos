'use client'

import { useEffect, useRef, useState } from 'react'

interface Props {
  timeLimit: number
  onExpire: () => void
  paused?: boolean
}

export function Timer({ timeLimit, onExpire, paused = false }: Props) {
  const [seconds, setSeconds] = useState(timeLimit)
  const onExpireRef = useRef(onExpire)
  onExpireRef.current = onExpire

  useEffect(() => {
    setSeconds(timeLimit)
  }, [timeLimit])

  useEffect(() => {
    if (paused) return

    const interval = setInterval(() => {
      setSeconds(prev => {
        if (prev <= 1) {
          clearInterval(interval)
          onExpireRef.current()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [paused, timeLimit])

  const pct = seconds / timeLimit
  const color =
    pct > 0.5 ? 'text-success' :
    pct > 0.17 ? 'text-warning' :
    'text-error'

  const bg =
    pct > 0.5 ? 'bg-success/10' :
    pct > 0.17 ? 'bg-warning/10' :
    'bg-error/10'

  return (
    <div
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-semibold ${color} ${bg}`}
      aria-live="polite"
      aria-atomic="true"
      aria-label={`${seconds} segundos restantes`}
    >
      <span aria-hidden="true">⏱</span>
      <span>{seconds}s</span>
    </div>
  )
}
