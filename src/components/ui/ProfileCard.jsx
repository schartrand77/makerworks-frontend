import GlassCard from '../ui/GlassCard'

export default function ProfileCard({ user }) {
  return (
    <GlassCard size="expanded" elevation="glass" className="text-center">
      
      <p className="text-white/70">
        View your uploads and saved favorites below.
      </p>
    </GlassCard>
  )
}