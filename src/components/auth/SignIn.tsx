import PageLayout from '@/components/layout/PageLayout'
import { useSignIn } from '@/hooks/useSignIn'
import GlassInput from '@/components/ui/GlassInput'
import GlassButton from '@/components/ui/GlassButton'

const SignIn = () => {
  const {
    emailOrUsername,
    setEmailOrUsername,
    password,
    setPassword,
    error,
    loading,
    handleSubmit,
  } = useSignIn()

  return (
    <PageLayout title="Sign In">
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
        <form
          onSubmit={handleSubmit}
          className="bg-white/70 dark:bg-zinc-900/60 shadow-xl rounded-xl px-6 py-8 w-full max-w-sm backdrop-blur-md border border-zinc-200 dark:border-zinc-800 space-y-4"
        >
          <h1 className="text-2xl font-semibold mb-4 text-center">Sign In</h1>

          <GlassInput
            id="emailOrUsername"
            label="Username or Email"
            value={emailOrUsername}
            onChange={(e) => setEmailOrUsername(e.target.value)}
          />

          <GlassInput
            id="password"
            type="password"
            label="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {error && (
            <div className="text-red-500 text-sm mb-4 text-center">
              {error}
            </div>
          )}

          <GlassButton loading={loading}>Sign In</GlassButton>
        </form>
      </div>
    </PageLayout>
  )
}

export default SignIn