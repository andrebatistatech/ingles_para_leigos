import Link from 'next/link'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { ForgotPasswordForm } from '@/components/auth/ForgotPasswordForm'

export default function RecoverPasswordPage() {
  return (
    <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-text-main">Redefinir senha</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Informe seu email para receber o link de redefinição
          </p>
        </div>

        <Card>
          <CardHeader className="pb-0" />
          <CardContent className="pt-6 space-y-4">
            <ForgotPasswordForm />
            <p className="text-center text-sm">
              <Link href="/login" className="text-primary hover:underline">
                Voltar para o login
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
