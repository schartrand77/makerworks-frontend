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
      <form className="glass-card p-8 flex flex-col gap-4" onSubmit={handleSubmit}>
        <h1 className="text-xl font-semibold text-center">Create Account</h1>
        {error && <p className="text-red-500 text-center">{error}</p>}
        <input
          className="input"
          placeholder="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className="input"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          className="input"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className="btn btn-primary" type="submit" disabled={loading}>
          {loading ? 'Signing up…' : 'Sign Up'}
        </button>
      </form>
    </PageLayout>
  );
};

export default SignUp;
