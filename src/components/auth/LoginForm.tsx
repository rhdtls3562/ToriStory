'use client'

import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function LoginForm() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      setError('이메일 또는 비밀번호가 올바르지 않아요')
      setLoading(false)
      return
    }

    router.push('/')
    router.refresh()
  }

  return (
    <form onSubmit={handleLogin} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <label htmlFor="email" className="text-sm font-medium">
          이메일
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="tori@example.com"
          required
          className="rounded-lg border border-(--color-border) bg-white px-4 py-2 text-sm outline-none focus:border-(--color-accent)"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="password" className="text-sm font-medium">
          비밀번호
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          required
          className="rounded-lg border border-(--color-border) bg-white px-4 py-2 text-sm outline-none focus:border-(--color-accent)"
        />
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="rounded-lg bg-(--color-accent) py-2 text-sm font-bold text-white disabled:opacity-50"
      >
        {loading ? '로그인 중...' : '로그인'}
      </button>

      <p className="text-center text-sm text-(--color-muted)">
        아직 계정이 없나요?{' '}
        <Link href="/signup" className="font-bold text-(--color-accent)">
          회원가입
        </Link>
      </p>
    </form>
  )
}