'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'

interface UserRow {
  id: string
  user_id: string
  full_name: string | null
  avatar_url: string | null
  is_vip: boolean
  is_admin: boolean
  created_at: string
}

interface Props {
  users: UserRow[]
}

export function AdminUsersTable({ users: initial }: Props) {
  const [users, setUsers] = useState(initial)
  const [loading, setLoading] = useState<string | null>(null)

  async function toggleVip(userId: string, current: boolean) {
    setLoading(userId)
    try {
      const res = await fetch('/api/admin/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, is_vip: !current }),
      })
      if (res.ok) {
        setUsers(prev =>
          prev.map(u => u.user_id === userId ? { ...u, is_vip: !current } : u)
        )
      }
    } finally {
      setLoading(null)
    }
  }

  return (
    <div className="rounded-xl border bg-card overflow-hidden">
      <table className="w-full text-sm">
        <thead className="border-b bg-muted/40">
          <tr>
            <th className="px-4 py-3 text-left font-medium text-muted-foreground">Usuário</th>
            <th className="px-4 py-3 text-left font-medium text-muted-foreground">Desde</th>
            <th className="px-4 py-3 text-center font-medium text-muted-foreground">Admin</th>
            <th className="px-4 py-3 text-center font-medium text-muted-foreground">VIP</th>
          </tr>
        </thead>
        <tbody>
          {users.map(u => (
            <tr key={u.user_id} className="border-b last:border-0 hover:bg-muted/20 transition-colors">
              <td className="px-4 py-3">
                <div className="flex items-center gap-3">
                  {u.avatar_url ? (
                    <img src={u.avatar_url} alt="" className="w-8 h-8 rounded-full object-cover" />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-semibold text-xs">
                      {(u.full_name ?? '?')[0].toUpperCase()}
                    </div>
                  )}
                  <span className="text-text-main">{u.full_name ?? '(sem nome)'}</span>
                </div>
              </td>
              <td className="px-4 py-3 text-muted-foreground">
                {new Date(u.created_at).toLocaleDateString('pt-BR')}
              </td>
              <td className="px-4 py-3 text-center">
                {u.is_admin ? (
                  <span className="text-xs font-semibold text-primary">✓</span>
                ) : (
                  <span className="text-muted-foreground">—</span>
                )}
              </td>
              <td className="px-4 py-3 text-center">
                <Button
                  size="sm"
                  variant={u.is_vip ? 'default' : 'outline'}
                  disabled={loading === u.user_id}
                  onClick={() => toggleVip(u.user_id, u.is_vip)}
                  className="w-16 text-xs"
                >
                  {loading === u.user_id ? '...' : u.is_vip ? 'VIP ✓' : 'Ativar'}
                </Button>
              </td>
            </tr>
          ))}
          {users.length === 0 && (
            <tr>
              <td colSpan={4} className="px-4 py-8 text-center text-muted-foreground">
                Nenhum usuário encontrado.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}
