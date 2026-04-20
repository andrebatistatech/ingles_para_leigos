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
  let fullName: string | null = null
  let avatarUrl: string | null = null
  if (user) {
    const serviceClient = createServiceClient()
    const { data: profile } = await serviceClient
      .from('profiles')
      .select('is_vip, is_admin, full_name, avatar_url')
      .eq('user_id', user.id)
      .single()
    isVip = profile?.is_vip === true
    isAdmin = profile?.is_admin === true
    fullName = profile?.full_name ?? null
    avatarUrl = profile?.avatar_url ?? null
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
              {/* Avatar + nome */}
              <div className="flex items-center gap-2 px-1">
                {avatarUrl ? (
                  <img src={avatarUrl} alt="" className="w-7 h-7 rounded-full object-cover" />
                ) : (
                  <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center text-primary text-xs font-semibold">
                    {(fullName ?? user.email ?? '?')[0].toUpperCase()}
                  </div>
                )}
                {fullName && (
                  <span className="hidden sm:block text-sm text-text-main font-medium max-w-[120px] truncate">
                    {fullName.split(' ')[0]}
                  </span>
                )}
              </div>

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
