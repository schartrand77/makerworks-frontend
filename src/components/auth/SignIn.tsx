import { useSignIn } from '@/hooks/useSignIn'
import GlassInput from '@/components/ui/GlassInput'
import GlassButton from '@/components/ui/GlassButton'
import GlassCard from '@/components/ui/GlassCard'

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
    <div className="flex items-center justify-center min-h-screen">
      <GlassCard>
        <form
          onSubmit={handleSubmit}
          className="space-y-4 w-full max-w-sm px-6 py-8"
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
      </GlassCard>
    </div>
  )
}

export default SignIn
