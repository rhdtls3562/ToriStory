'use client'

import { createClient } from '@/lib/supabase/client'
import type { User } from '@supabase/supabase-js'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'

function BellIcon() {
  return (
    <svg
      width="17"
      height="17"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  )
}

function HomeIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
      <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
    </svg>
  )
}

export default function Header() {
  const [user, setUser] = useState<User | null>(null)
  const [username, setUsername] = useState<string | null>(null)
  const [notifCount] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  const supabaseRef = useRef(createClient())
  const supabase = supabaseRef.current

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      setUser(user)

      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('username')
          .eq('id', user.id)
          .maybeSingle()

        if (profile?.username) setUsername(profile.username)
      }
      setIsLoading(false)
    }

    getUser()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      if (!session?.user) setUsername(null)
    })

    return () => subscription.unsubscribe()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  return (
    <header className="z-50">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-3 px-5 py-2.5">
        {/* 로고 */}
        <div className="flex items-center gap-1.5">
          <span className="text-accent animate-pulse text-xs">✦</span>
          <Link
            href="/"
            className="font-gaegu text-text inline-block text-[1.6rem] font-black tracking-wide transition-transform hover:scale-105 hover:-rotate-1"
            style={{ textShadow: '2px 2px 0px var(--color-border)' }}
          >
            ★ Toristory
          </Link>
          <span className="text-accent animate-pulse text-xs [animation-delay:0.7s]">
            ✦
          </span>
        </div>

        {/* 네비게이션 */}
        <nav className="flex items-center gap-2">
          {isLoading ? (
            <>
              <div className="bg-surface h-8 w-24 animate-pulse rounded-full" />
              <div className="bg-surface h-8 w-8 animate-pulse rounded-full" />
              <div className="bg-surface h-8 w-16 animate-pulse rounded-full" />
            </>
          ) : user ? (
            <>
              {/* 유저 인사말 */}
              {username && (
                <span className="text-muted mr-1 hidden text-xs font-semibold sm:block">
                  <span className="text-text font-bold">{username}</span>님
                  반가워요!
                </span>
              )}

              {/* 내 홈피 */}
              {username && (
                <Link
                  href={`/${username}`}
                  className="text-text border-border hover:border-accent flex items-center gap-1.5 rounded-full border-2 bg-white px-4 py-1.5 text-sm font-bold shadow-[2px_2px_0_var(--color-border)] transition-all duration-150 hover:-translate-x-px hover:-translate-y-px hover:shadow-[3px_3px_0_var(--color-accent)] active:translate-x-px active:translate-y-px"
                >
                  <HomeIcon />내 홈피
                </Link>
              )}

              {/* 알림 */}
              <button
                aria-label="알림"
                className="text-text border-border hover:border-accent relative flex h-9 w-9 items-center justify-center rounded-full border-2 bg-white shadow-[2px_2px_0_var(--color-border)] transition-all duration-150 hover:-translate-x-px hover:-translate-y-px hover:shadow-[3px_3px_0_var(--color-accent)] active:translate-x-px active:translate-y-px"
              >
                <BellIcon />
                {notifCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4 animate-bounce items-center justify-center rounded-full border-2 border-white bg-red-500 text-[10px] font-black text-white">
                    {notifCount}
                  </span>
                )}
              </button>

              {/* 로그아웃 */}
              <button
                onClick={handleLogout}
                className="text-muted border-border hover:bg-surface hover:text-text rounded-full border-2 px-4 py-1.5 text-sm font-bold transition-all duration-150"
              >
                로그아웃
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="text-text border-border hover:border-accent rounded-full border-2 bg-white px-4 py-1.5 text-sm font-bold shadow-[2px_2px_0_var(--color-border)] transition-all duration-150 hover:-translate-x-px hover:-translate-y-px hover:shadow-[3px_3px_0_var(--color-accent)]"
              >
                로그인
              </Link>
              <Link
                href="/signup"
                className="bg-accent border-accent rounded-full border-2 px-4 py-1.5 text-sm font-bold text-white shadow-[2px_2px_0_rgba(0,0,0,0.15)] transition-all duration-150 hover:-translate-x-px hover:-translate-y-px hover:shadow-[3px_3px_0_rgba(0,0,0,0.2)] hover:brightness-105"
              >
                ✦ 회원가입
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  )
}
