import PageLayout from "@/components/layout/PageLayout"

const SignIn = () => {
  const loginUrl = import.meta.env.VITE_AUTHENTIK_LOGIN_URL

  const handleSignIn = () => {
    window.location.href = loginUrl
  }

  return (
    <PageLayout title="Sign In">
      <div className="glass-card p-8 text-center">
        <h1 className="text-xl font-semibold mb-4">Welcome Back</h1>
        <p className="text-muted-foreground mb-6">
          Click below to sign in with Authentik.
        </p>
        <button
          className="btn btn-primary"
          onClick={handleSignIn}
        >
          Sign in with Authentik
        </button>
      </div>
    </PageLayout>
  )
}

export default SignIn
