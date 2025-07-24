import { useState } from 'react';
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

  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedEmail = email.trim();
    const trimmedUsername = username.trim();
    const trimmedPassword = password.trim();
    const trimmedConfirm = confirmPassword.trim();

    if (trimmedPassword !== trimmedConfirm) {
      setPasswordError('Passwords do not match');
      return;
    }

    // Normalize values
    setEmail(trimmedEmail);
    setUsername(trimmedUsername);
    setPassword(trimmedPassword);
    setConfirmPassword(trimmedConfirm);

    setPasswordError(null);
    handleSubmit(e);
  };

  return (
    <PageLayout title="Sign Up">
      <form
        className="glass-card p-8 flex flex-col gap-4 max-w-sm mx-auto"
        onSubmit={onSubmit}
        noValidate
      >
        <h1 className="text-2xl font-semibold text-center">
          Create Your Account
        </h1>

        {error && (
          <p
            className="text-red-500 text-sm text-center bg-red-100 border border-red-300 p-2 rounded-full"
            role="alert"
          >
            {error}
          </p>
        )}
        {passwordError && (
          <p
            className="text-red-500 text-sm text-center bg-red-100 border border-red-300 p-2 rounded-full"
            role="alert"
          >
            {passwordError}
          </p>
        )}

        <div className="flex flex-col gap-1">
          <label htmlFor="email" className="text-sm font-medium">
            Email
          </label>
          <input
            id="email"
            className="input rounded-full px-4 py-2"
            placeholder="you@example.com"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value.trimStart())}
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
            className="input rounded-full px-4 py-2"
            placeholder="yourusername"
            value={username}
            onChange={(e) => setUsername(e.target.value.trimStart())}
            required
            disabled={loading}
          />
        </div>

        <div className="flex flex-col gap-1 relative">
          <label htmlFor="password" className="text-sm font-medium">
            Password
          </label>
          <input
            id="password"
            className="input rounded-full px-4 py-2 pr-12"
            type={showPassword ? 'text' : 'password'}
            placeholder="••••••••"
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={loading}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-7 text-xs text-blue-600 hover:text-blue-800"
          >
            {showPassword ? 'Hide' : 'Show'}
          </button>
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="confirmPassword" className="text-sm font-medium">
            Confirm Password
          </label>
          <input
            id="confirmPassword"
            className="input rounded-full px-4 py-2"
            type={showPassword ? 'text' : 'password'}
            placeholder="Confirm your password"
            autoComplete="new-password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            disabled={loading}
          />
        </div>

        <button
          className="
            mt-4
            rounded-full
            px-6
            py-2
            backdrop-blur-md
            bg-blue-200/30
            border border-blue-300/30
            shadow-inner shadow-blue-100/20
            hover:bg-blue-200/50
            hover:shadow-blue-200/30
            text-blue-900
            dark:text-blue-100
            transition-all
            duration-200
          "
          type="submit"
          disabled={
            loading ||
            !email.trim() ||
            !username.trim() ||
            !password.trim() ||
            !confirmPassword.trim()
          }
        >
          {loading ? 'Signing up…' : 'Sign Up'}
        </button>
      </form>
    </PageLayout>
  );
};

export default SignUp;
