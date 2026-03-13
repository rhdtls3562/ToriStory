type Props = {
  params: { username: string }
}

export default function GalleryPage({ params }: Props) {
  return (
    <main>
      <h1>{params.username}의 갤러리</h1>
      {/* GalleryGrid 컴포넌트 */}
    </main>
  )
}
