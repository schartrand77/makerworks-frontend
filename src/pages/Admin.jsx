// src/pages/Admin.jsx
import UserList from '../components/Admin/UserList'
import FilamentEditor from '../components/Admin/FilamentEditor'
import PricingFormula from '../components/Admin/PricingFormula'

export default function Admin() {
  return (
    <div className="min-h-screen p-6 bg-gradient-to-b from-black to-gray-900 text-white">
      <h1 className="text-4xl font-bold mb-8 text-center">Admin Panel</h1>
      
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Users</h2>
        <UserList />
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Filament Library</h2>
        <FilamentEditor />
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4">Pricing Formula</h2>
        <PricingFormula />
      </section>
    </div>
  )
}