import Link from 'next/link'
import { headers } from 'next/headers'
import { createClient, createServiceClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { LogoutButton } from './LogoutButton'
import { ThemeToggle } from './ThemeToggle'

export async function Header() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const headersList = await headers()
  const pathname = headersList.get('x-pathname') ?? ''

  const isDashboard = pathname === '/dashboard'

  let isVip = false
  let isAdmin = false
  if (user) {
    const serviceClient = createServiceClient()
    const { data: profile } = await serviceClient
      .from('profiles')
      .select('is_vip, is_admin')
      .eq('user_id', user.id)
      .single()
    isVip = profile?.is_vip === true
    isAdmin = profile?.is_admin === true
  }

  return (
    <header className="border-b bg-background">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
        <Link href="/" className="font-bold text-primary text-lg">
          Inglês para Leigos
        </Link>

        <nav className="flex items-center gap-2">
          <ThemeToggle />
          {user ? (
            <>
              {isVip && (
                <Badge className="bg-amber-500/15 text-amber-500 border-amber-500/30 text-xs px-2 py-0.5">
                  ⭐ VIP
                </Badge>
              )}
              <Link href="/dashboard">
                <Button
                  variant={isDashboard ? 'default' : 'ghost'}
                  size="sm"
                  className={isDashboard ? 'bg-primary hover:bg-primary/90' : ''}
                >
                  Dashboard
                </Button>
              </Link>
              <Link href="/quiz/select">
                <Button
                  variant={isDashboard ? 'outline' : 'default'}
                  size="sm"
                  className={isDashboard ? '' : 'bg-primary hover:bg-primary/90'}
                >
                  Novo Quiz
                </Button>
              </Link>
              {isAdmin && (
                <Link href="/admin">
                  <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-text-main">
                    Admin
                  </Button>
                </Link>
              )}
              <LogoutButton />
            </>
          ) : (
            <Link href="/login">
              <Button size="sm">Entrar</Button>
            </Link>
          )}
        </nav>
      </div>
    </header>
  )
}
