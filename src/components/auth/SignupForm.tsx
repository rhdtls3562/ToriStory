'use client'

import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function SignupForm() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [username, setUsername] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSignup = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const supabase = createClient()

    const { data: existing } = await supabase
      .from('profiles')
      .select('username')
      .eq('username', username)
      .maybeSingle()

    if (existing) {
      setError('이미 사용 중인 아이디예요')
      setLoading(false)
      return
    }

    const { data, error: signupError } = await supabase.auth.signUp({
      email,
      password,
    })

    if (signupError || !data.user) {
      setError(signupError?.message ?? '회원가입에 실패했어요')
      setLoading(false)
      return
    }

    // 세션 직접 설정
    if (data.session) {
      await supabase.auth.setSession(data.session)
    } else {
      // 세션 없으면 로그인 먼저
      await supabase.auth.signInWithPassword({ email, password })
    }

    const { error: profileError } = await supabase.from('profiles').insert({
      id: data.user.id,
      username,
      display_name: username,
    })

    if (profileError) {
      setError(profileError.message)
      setLoading(false)
      return
    }

    router.push('/')
    router.refresh()
  }

  return (
    <form onSubmit={handleSignup} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <label htmlFor="username" className="text-sm font-medium">
          홈피 아이디
        </label>
        <input
          id="username"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="toristory"
          required
          className="rounded-lg border border-(--color-border) bg-white px-4 py-2 text-sm outline-none focus:border-(--color-accent)"
        />
        <span className="text-xs text-(--color-muted)">
          홈피 주소로 사용돼요 → toristory.com/toristory
        </span>
      </div>

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
          minLength={6}
          className="rounded-lg border border-(--color-border) bg-white px-4 py-2 text-sm outline-none focus:border-(--color-accent)"
        />
        <span className="text-xs text-(--color-muted)">
          6자 이상 입력해주세요
        </span>
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="rounded-lg bg-(--color-accent) py-2 text-sm font-bold text-white disabled:opacity-50"
      >
        {loading ? '가입 중...' : '회원가입'}
      </button>

      <p className="text-center text-sm text-(--color-muted)">
        이미 계정이 있나요?{' '}
        <Link href="/login" className="font-bold text-(--color-accent)">
          로그인
        </Link>
      </p>
    </form>
  )
}
