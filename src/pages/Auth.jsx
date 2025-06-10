import { useState } from 'react'
import AuthForm from '../components/AuthForm'
import GlassCard from '../components/GlassCard'
import GlassTransition from '../components/GlassTransition'

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true)

  return (
    <GlassCard className="w-full max-w-md mx-auto overflow-hidden">
      <div className="relative flex flex-col gap-6 transition-all duration-300 ease-in-out transform">
        <h2
          key={isLogin ? 'signin' : 'signup'}
          className="text-2xl sm:text-3xl font-semibold text-center tracking-tight transition-all duration-300 ease-in-out transform"
        >
          {isLogin ? 'Sign In' : 'Create Account'}
        </h2>

        <GlassTransition key={isLogin ? 'form-signin' : 'form-signup'}>
          <AuthForm isLogin={isLogin} />
        </GlassTransition>

        <button
          onClick={() => setIsLogin(!isLogin)}
          className="text-sm text-blue-300 hover:underline text-center w-full"
        >
          {isLogin
            ? "Don't have an account? Create one."
            : "Already have an account? Sign in instead."}
        </button>
      </div>
    </GlassCard>
  )
}