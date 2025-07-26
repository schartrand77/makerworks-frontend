// src/pages/Settings.tsx
import { useState } from 'react'
import AvatarSection from '@/components/settings/AvatarSection'
import ProfileSection from '@/components/settings/ProfileSection'
import AccountSection from '@/components/settings/AccountSection'
import ThemeSection from '@/components/settings/ThemeSection'

export default function Settings() {
  const [activeTab, setActiveTab] = useState<'profile' | 'account' | 'avatar' | 'theme'>('profile')

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setActiveTab('profile')}
          className={`px-4 py-2 rounded-lg ${activeTab === 'profile' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
        >
          Profile
        </button>
        <button
          onClick={() => setActiveTab('account')}
          className={`px-4 py-2 rounded-lg ${activeTab === 'account' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
        >
          Account
        </button>
        <button
          onClick={() => setActiveTab('avatar')}
          className={`px-4 py-2 rounded-lg ${activeTab === 'avatar' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
        >
          Avatar
        </button>
        <button
          onClick={() => setActiveTab('theme')}
          className={`px-4 py-2 rounded-lg ${activeTab === 'theme' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
        >
          Theme
        </button>
      </div>

      {activeTab === 'profile' && <ProfileSection />}
      {activeTab === 'account' && <AccountSection />}
      {activeTab === 'avatar' && <AvatarSection />}
      {activeTab === 'theme' && <ThemeSection />}
    </div>
  )
}
