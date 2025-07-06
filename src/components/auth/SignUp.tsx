import PageLayout from "@/components/layout/PageLayout"
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
    <PageLayout title="Sign Up">
      <div className="glass-card max-w-md mx-auto p-10 shadow-vision">
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
            <p className="text-red-500 text-sm whitespace-pre-wrap">{error}</p>
          )}

          <GlassButton loading={loading}>Sign Up</GlassButton>
        </form>
      </div>
    </PageLayout>
  )
}

export default SignUp
