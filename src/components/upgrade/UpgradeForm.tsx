'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

interface Props {
  defaultName: string
  defaultEmail: string
  alreadyRequested: boolean
}

export function UpgradeForm({ defaultName, defaultEmail, alreadyRequested }: Props) {
  const [name, setName] = useState(defaultName)
  const [email, setEmail] = useState(defaultEmail)
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(alreadyRequested)
  const [error, setError] = useState<string | null>(null)

  if (done) {
    return (
      <div className="rounded-xl border border-amber-400/40 bg-amber-400/5 p-6 text-center space-y-2">
        <p className="text-2xl">✅</p>
        <p className="font-semibold text-text-main">Pedido enviado!</p>
        <p className="text-sm text-muted-foreground">
          Recebemos seu interesse. Em breve entraremos em contato.
        </p>
      </div>
    )
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const res = await fetch('/api/upgrade', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ full_name: name, email, message }),
      })
      const data = await res.json()

      if (!res.ok) {
        if (data.error === 'already_requested') {
          setDone(true)
        } else {
          setError(data.error ?? 'Erro ao enviar pedido.')
        }
        return
      }

      setDone(true)
    } catch {
      setError('Erro de conexão. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="name">Nome completo</Label>
        <Input
          id="name"
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="Seu nome"
          required
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="seu@email.com"
          required
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="message">Mensagem (opcional)</Label>
        <Textarea
          id="message"
          value={message}
          onChange={e => setMessage(e.target.value)}
          placeholder="Conte um pouco sobre você e por que quer ser VIP..."
          rows={3}
        />
      </div>

      {error && (
        <p className="text-sm text-error">{error}</p>
      )}

      <Button
        type="submit"
        disabled={loading}
        className="w-full bg-amber-500 hover:bg-amber-500/90 text-white"
      >
        {loading ? 'Enviando...' : '⭐ Solicitar acesso VIP'}
      </Button>
    </form>
  )
}
