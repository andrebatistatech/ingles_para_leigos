import { createServerClient } from '@supabase/ssr'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')
  const token_hash = searchParams.get('token_hash')
  const type = searchParams.get('type') ?? 'signup'
  const raw = searchParams.get('next') ?? '/dashboard'
  const next = raw.startsWith('/') ? raw : '/dashboard'

  const redirectUrl = new URL(next, request.url)

  if (!code && !token_hash) {
    return NextResponse.redirect(redirectUrl)
  }

  const response = NextResponse.redirect(redirectUrl)

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  if (token_hash) {
    // Email confirmation flow (signup, recovery, etc.)
    await supabase.auth.verifyOtp({
      token_hash,
      type: type as 'signup' | 'recovery' | 'email',
    })
  } else if (code) {
    // OAuth flow (Google, etc.)
    await supabase.auth.exchangeCodeForSession(code)
  }

  return response
}

