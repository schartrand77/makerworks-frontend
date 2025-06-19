// src/pages/Admin.jsx
import UserList from '../components/Admin/UserList'
import FilamentEditor from '../components/Admin/FilamentEditor'
import PricingFormula from '../components/Admin/PricingFormula'
import GlassCard from '@/components/ui/GlassCard'

export default function Admin() {
  return (
    <div className="min-h-screen px-4 py-12 bg-gradient-to-b from-black via-gray-950 to-gray-900 text-white">
      <h1 className="text-4xl font-bold mb-10 text-center">Admin Panel</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <GlassCard className="col-span-1">
          <h2 className="text-2xl font-semibold mb-4">Users</h2>
          <UserList />
        </GlassCard>

        <GlassCard className="col-span-1">
          <h2 className="text-2xl font-semibold mb-4">Filament Library</h2>
          <FilamentEditor />
        </GlassCard>

        <GlassCard className="md:col-span-2">
          <h2 className="text-2xl font-semibold mb-4">Pricing Formula</h2>
          <PricingFormula />
        </GlassCard>
      </div>
    </div>
  )
}