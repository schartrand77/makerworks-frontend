// src/pages/Favorites.jsx
import FavoritesSection from '@/components/ui/FavoritesSection'
import GlassCard from '@/components/ui/GlassCard'

export default function Favorites() {
  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <h1 className="text-3xl font-semibold text-white">Your Favorites</h1>
      <GlassCard size="expanded" elevation="glass">
        <FavoritesSection />
      </GlassCard>
    </div>
  )
}