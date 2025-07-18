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
      <form className="glass-card p-8 flex flex-col gap-4" onSubmit={handleSubmit}>
        <h1 className="text-xl font-semibold text-center">Sign In</h1>
        {error && <p className="text-red-500 text-center">{error}</p>}
        <input
          className="input"
          placeholder="Email or username"
          value={emailOrUsername}
          onChange={(e) => setEmailOrUsername(e.target.value)}
        />
        <input
          className="input"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className="btn btn-primary" type="submit" disabled={loading}>
          {loading ? 'Signing in…' : 'Sign In'}
        </button>
      </form>
    </PageLayout>
  );
};

export default SignIn;
