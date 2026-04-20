import Link from 'next/link'
import { headers } from 'next/headers'
import { createClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'
import { LogoutButton } from './LogoutButton'
import { ThemeToggle } from './ThemeToggle'

export async function Header() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const headersList = await headers()
  const pathname = headersList.get('x-pathname') ?? ''

  const isDashboard = pathname === '/dashboard'

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
