// src/pages/Settings.tsx

import { useState } from 'react'
import PageLayout from '@/components/layout/PageLayout'
import SettingsLayout from '@/components/settings/SettingsLayout'
import ProfileSection from '@/components/settings/ProfileSection'
import AvatarSection from '@/components/settings/AvatarSection'
import ThemeSection from '@/components/settings/ThemeSection'
import AccountSection from '@/components/settings/AccountSection'

type Tab = 'Profile' | 'Avatar' | 'Theme' | 'Account'

export default function Settings() {
  const [currentTab, setCurrentTab] = useState<Tab>('Profile')

  const renderContent = () => {
    switch (currentTab) {
      case 'Profile':
        return <ProfileSection />
      case 'Avatar':
        return <AvatarSection />
      case 'Theme':
        return <ThemeSection />
      case 'Account':
        return <AccountSection />
      default:
        return null
    }
  }

  return (
    <PageLayout title="Settings">
      <SettingsLayout activeTab={currentTab} onTabChange={setCurrentTab}>
        {renderContent()}
      </SettingsLayout>
    </PageLayout>
  )
}
