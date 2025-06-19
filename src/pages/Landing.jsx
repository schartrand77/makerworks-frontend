import GlassCard from '@/components/ui/GlassCard'
import { Link } from 'react-router-dom'

export default function Landing() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-neutral-950 text-white px-4">
      <GlassCard
        theme="auto"
        size="expanded"
        elevation="glass"
        hoverEffect
        ripple
        className="max-w-md w-full text-center animate-fadeInSlow"
      >
        <h1 className="text-3xl font-bold mb-6">Welcome to MakerWorks</h1>
        <p className="text-gray-300 mb-8">
          Upload your models, estimate print time and cost, and bring your ideas to life.
        </p>
        <Link
          to="/auth/signin"
          className="glass-tab-pill min-w-[180px] px-10 py-2 text-base font-medium hover:scale-105 transition-transform inline-block"
        >
          Enter
        </Link>
      </GlassCard>
    </div>
  )
}