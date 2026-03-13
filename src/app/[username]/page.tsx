import ThemeProvider from '@/components/layout/ThemeProvider'
import { createClient } from '@/lib/supabase/server'
import Image from 'next/image'
import { notFound } from 'next/navigation'

interface Props {
  params: Promise<{ username: string }>
}

export default async function HompyPage({ params }: Props) {
  const { username } = await params
  const supabase = await createClient()

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('username', username)
    .single()

  if (!profile) notFound()

  const { data: settings } = await supabase
    .from('hompy_settings')
    .select('*')
    .eq('user_id', profile.id)
    .maybeSingle()

  const { data: guestbook } = await supabase
    .from('guestbook')
    .select('*')
    .eq('hompy_owner_id', profile.id)
    .order('created_at', { ascending: false })
    .limit(3)

  const { count: visitorCount } = await supabase
    .from('visitor_logs')
    .select('*', { count: 'exact', head: true })
    .eq('hompy_owner_id', profile.id)

  const theme = settings?.theme ?? 'spring'

  const bookmarks = [
    { icon: '🏠', label: '홈' },
    { icon: '📝', label: '방명록' },
    { icon: '🖼️', label: '갤러리' },
    { icon: '🎨', label: '꾸미기' },
  ]

  return (
    <main className="bg-bg min-h-screen px-4 py-8">
      <ThemeProvider theme={theme} />
      <div className="relative mx-auto max-w-6xl">
        {/* ── 책갈피 탭 (오른쪽으로 튀어나옴) ── */}
        <div className="absolute top-12 -right-13 z-20 flex flex-col">
          {bookmarks.map((item, i) => (
            <div
              key={item.label}
              className={`flex w-12 cursor-pointer flex-col items-center justify-center gap-1 rounded-r-xl py-4 transition-all duration-200 hover:-translate-x-1 ${
                i === 0
                  ? 'bg-accent text-white shadow-[3px_3px_8px_rgba(0,0,0,0.12)]'
                  : 'bg-primary text-text border-border border-t shadow-[3px_3px_8px_rgba(0,0,0,0.12)]'
              } `}
            >
              <span className="text-lg leading-none">{item.icon}</span>
              <span className="writing-vertical text-[10px] leading-none font-black tracking-wide">
                {item.label}
              </span>
            </div>
          ))}
        </div>

        {/* ── 다이어리 외곽 프레임 ── */}
        <div className="from-primary to-surface overflow-hidden rounded-3xl bg-linear-to-br p-1.5 shadow-[0_20px_60px_rgba(0,0,0,0.15)]">
          <div className="flex min-h-150 overflow-hidden rounded-[20px] bg-white">
            {/* ── 바인더 링 ── */}
            <div className="from-surface via-primary to-surface border-border flex w-7 shrink-0 flex-col items-center justify-center gap-5 border-r bg-linear-to-b px-1 py-8">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="border-border h-4.5 w-4.5 shrink-0 rounded-full border-2 bg-white shadow-[inset_0_1px_3px_rgba(0,0,0,0.1)]"
                />
              ))}
            </div>

            {/* ── 왼쪽 사이드바 ── */}
            <div className="border-border from-surface/60 flex w-47.5 shrink-0 flex-col gap-4 border-r-2 border-dashed bg-linear-to-b to-white p-5">
              {/* 프로필 */}
              <div className="pt-2 text-center">
                <div className="from-primary to-surface border-border mx-auto mb-3 flex h-20 w-20 items-center justify-center overflow-hidden rounded-full border-[3px] bg-linear-to-br text-4xl shadow-[0_4px_12px_rgba(0,0,0,0.1)]">
                  {profile.avatar_url ? (
                    <Image
                      src={profile.avatar_url}
                      alt={profile.display_name}
                      width={80}
                      height={80}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    '🌰'
                  )}
                </div>
                <h1 className="text-text text-base leading-tight font-black">
                  {profile.display_name}
                </h1>
                <p className="text-muted mt-0.5 text-xs">@{profile.username}</p>
                {profile.bio && (
                  <p className="text-text mt-2 px-1 text-xs leading-relaxed opacity-80">
                    {profile.bio}
                  </p>
                )}
              </div>

              <div className="border-border border-t border-dashed" />

              {/* 방문자 수 */}
              <div className="bg-surface rounded-xl p-3 text-center">
                <p className="text-muted text-xs font-bold">👣 방문자</p>
                <p className="text-accent mt-0.5 text-2xl font-black">
                  {visitorCount ?? 0}
                </p>
                <p className="text-muted text-xs">명</p>
              </div>

              <div className="border-border border-t border-dashed" />

              {/* 하단 장식 */}
              <div className="text-primary mt-auto text-center text-lg">
                ✦ ✿ ✦
              </div>
            </div>

            {/* ── 오른쪽 메인 콘텐츠 ── */}
            <div className="flex-1 overflow-y-auto p-6">
              {/* 페이지 제목 */}
              <div className="border-border mb-5 border-b-2 border-dashed pb-3">
                <h2
                  className="text-accent text-xl font-black"
                  style={{ fontFamily: 'var(--font-gaegu)' }}
                >
                  ★ {profile.display_name}의 홈피
                </h2>
                <p className="text-muted mt-0.5 text-xs">
                  반짝반짝 나만의 공간 ✨
                </p>
              </div>

              {/* 방명록 섹션 */}
              <section className="mb-6">
                <div className="mb-3 flex items-center gap-2">
                  <span className="bg-primary text-text rounded-full px-3 py-1 text-xs font-black">
                    📝 방명록
                  </span>
                  <div className="border-border flex-1 border-t border-dashed" />
                </div>

                {guestbook && guestbook.length > 0 ? (
                  <ul className="space-y-2">
                    {guestbook.map((entry) => (
                      <li
                        key={entry.id}
                        className="bg-surface border-border rounded-2xl border p-3 text-sm"
                      >
                        <span className="text-accent font-black">
                          {entry.author_name}
                        </span>
                        <span className="text-muted mx-1">✦</span>
                        <span className="text-text">{entry.content}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="bg-surface border-border rounded-2xl border border-dashed p-4 text-center">
                    <p className="text-muted text-sm">
                      아직 방명록이 없어요 🌸
                    </p>
                    <p className="text-muted mt-1 text-xs opacity-70">
                      첫 방명록을 남겨보세요!
                    </p>
                  </div>
                )}
              </section>

              {/* 갤러리 섹션 */}
              <section>
                <div className="mb-3 flex items-center gap-2">
                  <span className="bg-primary text-text rounded-full px-3 py-1 text-xs font-black">
                    🖼️ 갤러리
                  </span>
                  <div className="border-border flex-1 border-t border-dashed" />
                </div>

                <div className="grid grid-cols-3 gap-2">
                  {[...Array(6)].map((_, i) => (
                    <div
                      key={i}
                      className="bg-surface border-border flex aspect-square items-center justify-center rounded-xl border border-dashed text-2xl"
                    >
                      📷
                    </div>
                  ))}
                </div>
              </section>

              <div className="text-muted mt-6 text-center text-xs">
                ✦ ✿ ✦ ✿ ✦
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
