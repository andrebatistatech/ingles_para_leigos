'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const schema = z.object({
  email: z.string().email('Email inválido'),
})

type FormData = z.infer<typeof schema>

export function ForgotPasswordForm() {
  const supabase = createClient()
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  async function onSubmit(data: FormData) {
    setLoading(true)
    setError(null)
    const { error } = await supabase.auth.resetPasswordForEmail(data.email, {
      redirectTo: `${window.location.origin}/api/auth/callback?next=/conta`,
    })
    setLoading(false)
    if (error) {
      setError(error.message)
      return
    }
    // Sempre mostra sucesso (não revela se o email existe — anti-enumeração)
    setSuccess(true)
  }

  if (success) {
    return (
      <div className="rounded-lg border border-success/30 bg-success/10 p-4 text-sm text-success">
        Se existir uma conta com esse email, enviamos um link para redefinir a senha. Verifique sua caixa de entrada.
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-1">
        <Label htmlFor="recover-email">Email</Label>
        <Input id="recover-email" type="email" placeholder="seu@email.com" {...register('email')} />
        {errors.email && <p className="text-xs text-error">{errors.email.message}</p>}
      </div>

      {error && <p className="text-sm text-error">{error}</p>}

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? 'Enviando...' : 'Enviar link de redefinição'}
      </Button>
    </form>
  )
}
