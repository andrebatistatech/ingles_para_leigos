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
  password: z.string().min(6, 'Mínimo 6 caracteres'),
  confirmPassword: z.string(),
}).refine(d => d.password === d.confirmPassword, {
  message: 'As senhas não coincidem',
  path: ['confirmPassword'],
})

type FormData = z.infer<typeof schema>

export function ChangePasswordForm() {
  const supabase = createClient()
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  async function onSubmit(data: FormData) {
    setLoading(true)
    setError(null)
    setSuccess(false)
    const { error } = await supabase.auth.updateUser({ password: data.password })
    setLoading(false)
    if (error) {
      setError(error.message)
      return
    }
    setSuccess(true)
    reset()
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-1">
        <Label htmlFor="new-password">Nova senha</Label>
        <Input id="new-password" type="password" placeholder="••••••" {...register('password')} />
        {errors.password && <p className="text-xs text-error">{errors.password.message}</p>}
      </div>

      <div className="space-y-1">
        <Label htmlFor="confirm-password">Confirmar nova senha</Label>
        <Input id="confirm-password" type="password" placeholder="••••••" {...register('confirmPassword')} />
        {errors.confirmPassword && <p className="text-xs text-error">{errors.confirmPassword.message}</p>}
      </div>

      {error && <p className="text-sm text-error">{error}</p>}
      {success && <p className="text-sm text-success">Senha atualizada com sucesso.</p>}

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? 'Salvando...' : 'Atualizar senha'}
      </Button>
    </form>
  )
}
