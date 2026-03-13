import SignupForm from '@/components/auth/SignupForm'

export default function SignupPage() {
  return (
    <main className="bg-(--color-bg)] flex min-h-screen items-center justify-center">
      <div className="border-(--color-border)] w-full max-w-sm rounded-2xl border bg-white p-8 shadow-sm">
        <div className="mb-6 text-center">
          <h1 className="text-(--color-accent)] text-2xl font-bold">
            🌰 토리스토리
          </h1>
          <p className="text-(--color-muted)] mt-1 text-sm">
            나만의 홈피를 만들어요
          </p>
        </div>
        <SignupForm />
      </div>
    </main>
  )
}
