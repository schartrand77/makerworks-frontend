import GlassCard from "@/components/ui/GlassCard"
import { useSignUp } from "@/hooks/useSignUp"
import GlassInput from "@/components/ui/GlassInput"
import GlassButton from "@/components/ui/GlassButton"

const SignUp: React.FC = () => {
  const {
    email,
    setEmail,
    username,
    setUsername,
    password,
    setPassword,
    error,
    loading,
    handleSubmit,
  } = useSignUp()

  return (
    <div className="flex items-center justify-center min-h-screen">
      <GlassCard>
        <h1 className="text-2xl font-semibold mb-6 text-center">
          Create a MakerWorks Account
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <GlassInput
            id="email"
            type="email"
            label="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <GlassInput
            id="username"
            label="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <GlassInput
            id="password"
            type="password"
            label="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {error && (
            <p className="text-red-500 text-sm whitespace-pre-wrap text-center">
              {error}
            </p>
          )}

          <div className="text-center">
            <GlassButton loading={loading}>Sign Up</GlassButton>
          </div>
        </form>
      </GlassCard>
    </div>
  )
}

export default SignUp
