import PageLayout from '@/components/layout/PageLayout';
import { useSignIn } from '@/hooks/useSignIn';

const SignIn = () => {
  const {
    emailOrUsername,
    setEmailOrUsername,
    password,
    setPassword,
    loading,
    error,
    handleSubmit,
  } = useSignIn();

  return (
    <PageLayout title="Sign In">
      <form
        className="glass-card p-8 flex flex-col gap-4 max-w-sm mx-auto"
        onSubmit={handleSubmit}
        noValidate
      >
        <h1 className="text-2xl font-semibold text-center">Sign In</h1>

        {error && (
          <p
            className="text-red-500 text-sm text-center bg-red-100 border border-red-300 p-2 rounded"
            role="alert"
          >
            {error}
          </p>
        )}

        <div className="flex flex-col gap-1">
          <label htmlFor="emailOrUsername" className="text-sm font-medium">
            Email or Username
          </label>
          <input
            id="emailOrUsername"
            className="input"
            placeholder="you@example.com or yourusername"
            value={emailOrUsername}
            onChange={(e) => setEmailOrUsername(e.target.value)}
            autoComplete="username"
            required
          />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="password" className="text-sm font-medium">
            Password
          </label>
          <input
            id="password"
            className="input"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            required
          />
        </div>

        <button
          className="btn btn-primary mt-4"
          type="submit"
          disabled={loading}
        >
          {loading ? 'Signing in…' : 'Sign In'}
        </button>
      </form>
    </PageLayout>
  );
};

export default SignIn;
