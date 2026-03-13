type Props = {
  params: { username: string }
}

export default function GuestbookPage({ params }: Props) {
  return (
    <main>
      <h1>{params.username}의 방명록</h1>
      {/* Guestbook 컴포넌트 */}
    </main>
  )
}
