import PageLayout from "@/components/layout/PageLayout"

const SignUp = () => {
  const registerUrl = import.meta.env.VITE_AUTHENTIK_REGISTER_URL

  const handleSignUp = () => {
    window.location.href = registerUrl
  }

  return (
    <PageLayout title="Sign Up">
      <div className="glass-card p-8 text-center">
        <h1 className="text-xl font-semibold mb-4">Join MakerWorks</h1>
        <p className="text-muted-foreground mb-6">
          Click below to create your account.
        </p>
        <button
          className="btn btn-primary"
          onClick={handleSignUp}
        >
          Sign up with Authentik
        </button>
      </div>
    </PageLayout>
  )
}

export default SignUp
