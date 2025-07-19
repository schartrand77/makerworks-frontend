import PageLayout from '@/components/layout/PageLayout';
import { useSignUp } from '@/hooks/useSignUp';

const SignUp = () => {
  const {
    email,
    setEmail,
    username,
    setUsername,
    password,
    setPassword,
    loading,
    error,
    handleSubmit,
  } = useSignUp();

  return (
    <PageLayout title="Sign Up">
      <form
        className="glass-card p-8 flex flex-col gap-4 max-w-sm mx-auto"
        onSubmit={(e) => {
          e.preventDefault();

          // sanity: trim all fields here to match backend expectations
          setEmail(email.trim());
          setUsername(username.trim());
          setPassword(password.trim());

          handleSubmit(e);
        }}
        noValidate
      >
        <h1 className="text-2xl font-semibold text-center">Create Your Account</h1>

        {error && (
          <p
            className="text-red-500 text-sm text-center bg-red-100 border border-red-300 p-2 rounded"
            role="alert"
          >
            {error}
          </p>
        )}

        <div className="flex flex-col gap-1">
          <label htmlFor="email" className="text-sm font-medium">
            Email
          </label>
          <input
            id="email"
            className="input"
            placeholder="you@example.com"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading}
          />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="username" className="text-sm font-medium">
            Username
          </label>
          <input
            id="username"
            className="input"
            placeholder="yourusername"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            disabled={loading}
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
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={loading}
          />
        </div>

        <button
          className="btn btn-primary mt-4"
          type="submit"
          disabled={loading || !email.trim() || !username.trim() || !password.trim()}
        >
          {loading ? 'Signing up…' : 'Sign Up'}
        </button>
      </form>
    </PageLayout>
  );
};

export default SignUp;
