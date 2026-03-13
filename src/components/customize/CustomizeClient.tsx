'use client'

import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

const THEMES = [
  {
    id: 'spring',
    label: '🌸 봄날',
    bg: '#fff8f2',
    accent: '#c17b3f',
    primary: '#f9c5d1',
  },
  {
    id: 'y2k',
    label: '💜 Y2K',
    bg: '#f8f0ff',
    accent: '#ff9cee',
    primary: '#b8a9f8',
  },
  {
    id: 'candy',
    label: '🍬 캔디',
    bg: '#fffbf5',
    accent: '#ffdd67',
    primary: '#ffb3c6',
  },
]

interface Props {
  profile: {
    id: string
    username: string
    display_name: string
    bio: string | null
    avatar_url: string | null
  } | null
  initialSettings: {
    theme: string
    bg_color: string
  } | null
}

export default function CustomizeClient({ profile, initialSettings }: Props) {
  const router = useRouter()
  const [theme, setTheme] = useState(initialSettings?.theme ?? 'spring')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const currentTheme = THEMES.find((t) => t.id === theme) ?? THEMES[0]

  // 진입 시 초기 테마를 html에 반영
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // 테마 변경 시 html data-theme도 같이 변경 → 헤더 포함 전체 반영
  const handleThemeChange = (newTheme: string) => {
    setTheme(newTheme)
    document.documentElement.setAttribute('data-theme', newTheme)
  }

  const handleSave = async () => {
    if (!profile) return
    setSaving(true)
    const supabase = createClient()

    const { data: existing } = await supabase
      .from('hompy_settings')
      .select('id')
      .eq('user_id', profile.id)
      .maybeSingle()

    if (existing) {
      await supabase
        .from('hompy_settings')
        .update({ theme, bg_color: currentTheme.bg })
        .eq('user_id', profile.id)
    } else {
      await supabase
        .from('hompy_settings')
        .insert({ user_id: profile.id, theme, bg_color: currentTheme.bg })
    }

    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
    router.refresh()
  }

  return (
    <div className="bg-bg min-h-screen p-6">
      <div className="mx-auto max-w-xl space-y-6">
        <div className="text-center">
          <h1 className="text-accent text-2xl font-bold">🎨 홈피 꾸미기</h1>
          <p className="text-muted mt-1 text-sm">
            나만의 홈피 테마를 골라보세요
          </p>
        </div>

        {/* 테마 선택 */}
        <div className="border-border rounded-2xl border bg-white p-5 shadow-sm">
          <h2 className="text-accent mb-4 font-bold">🌈 테마</h2>
          <div className="grid grid-cols-3 gap-3">
            {THEMES.map((t) => (
              <button
                key={t.id}
                onClick={() => handleThemeChange(t.id)}
                className="rounded-xl border-2 p-3 text-center text-sm font-medium transition-all"
                style={{
                  backgroundColor: t.bg,
                  borderColor: theme === t.id ? t.accent : '#e8d5c4',
                  color: t.accent,
                }}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* 미리보기 */}
        <div className="border-border rounded-2xl border bg-white p-5 shadow-sm">
          <h2 className="text-accent mb-4 font-bold">👀 미리보기</h2>
          <div
            className="rounded-xl p-4 text-center"
            style={{ backgroundColor: currentTheme.bg }}
          >
            <div
              className="mx-auto mb-2 flex h-14 w-14 items-center justify-center rounded-full text-2xl"
              style={{ backgroundColor: currentTheme.primary }}
            >
              🌰
            </div>
            <p className="font-bold" style={{ color: currentTheme.accent }}>
              {profile?.display_name ?? ''}
            </p>
            <p
              className="text-xs"
              style={{ color: currentTheme.accent, opacity: 0.7 }}
            >
              @{profile?.username ?? ''}
            </p>
          </div>
        </div>

        {/* 저장 버튼 */}
        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-accent w-full rounded-xl py-3 font-bold text-white disabled:opacity-50"
        >
          {saving ? '저장 중...' : saved ? '✅ 저장됐어요!' : '저장하기'}
        </button>

        {/* 내 홈피 보기 */}
        <button
          onClick={() => router.push(`/${profile?.username}`)}
          className="border-border text-muted w-full rounded-xl border py-3 text-sm font-medium"
        >
          내 홈피 보러가기 →
        </button>
      </div>
    </div>
  )
}
