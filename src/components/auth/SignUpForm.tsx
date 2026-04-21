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
  fullName: z.string().min(2, 'Nome muito curto'),
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Mínimo 6 caracteres'),
  confirmPassword: z.string(),
}).refine(d => d.password === d.confirmPassword, {
  message: 'As senhas não coincidem',
  path: ['confirmPassword'],
})

type FormData = z.infer<typeof schema>

export function SignUpForm() {
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
    const { error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: { full_name: data.fullName },
        emailRedirectTo: `${window.location.origin}/api/auth/callback`,
      },
    })
    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      setSuccess(true)
    }
  }

  if (success) {
    return (
      <div className="rounded-lg border border-success/30 bg-success/10 p-4 text-sm text-success">
        Cadastro realizado! Verifique seu email para confirmar a conta.
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-1">
        <Label htmlFor="fullName">Nome completo</Label>
        <Input id="fullName" placeholder="Seu nome" {...register('fullName')} />
        {errors.fullName && <p className="text-xs text-error">{errors.fullName.message}</p>}
      </div>

      <div className="space-y-1">
        <Label htmlFor="signup-email">Email</Label>
        <Input id="signup-email" type="email" placeholder="seu@email.com" {...register('email')} />
        {errors.email && <p className="text-xs text-error">{errors.email.message}</p>}
      </div>

      <div className="space-y-1">
        <Label htmlFor="signup-password">Senha</Label>
        <Input id="signup-password" type="password" placeholder="••••••" {...register('password')} />
        {errors.password && <p className="text-xs text-error">{errors.password.message}</p>}
      </div>

      <div className="space-y-1">
        <Label htmlFor="confirmPassword">Confirmar senha</Label>
        <Input id="confirmPassword" type="password" placeholder="••••••" {...register('confirmPassword')} />
        {errors.confirmPassword && <p className="text-xs text-error">{errors.confirmPassword.message}</p>}
      </div>

      {error && <p className="text-sm text-error">{error}</p>}

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? 'Criando conta...' : 'Criar conta'}
      </Button>
    </form>
  )
}
