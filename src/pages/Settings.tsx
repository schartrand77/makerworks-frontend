// src/pages/Settings.tsx
import { useState, useEffect } from 'react';
import AvatarSection from '@/components/settings/AvatarSection';
import ProfileSection from '@/components/settings/ProfileSection';
import AccountSection from '@/components/settings/AccountSection';
import ThemeSection from '@/components/settings/ThemeSection';
import { useAuthStore } from '@/store/useAuthStore';

export default function Settings() {
  const [activeTab, setActiveTab] = useState<'profile' | 'account' | 'avatar' | 'theme'>('profile');
  const user = useAuthStore((s) => s.user);
  const setUser = useAuthStore((s) => s.setUser);

  // ✅ Safe URL builder with fallback to avoid undefined/uploads
  const getAbsoluteUrl = (path?: string | null): string | null => {
    if (!path) return null;
    const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:8000';
    return path.startsWith('http') ? path : `${apiBase}${path}`;
  };

  const cachedAvatar = localStorage.getItem('avatar_url');
  const avatarSrc =
    getAbsoluteUrl(user?.avatar_url) ||
    getAbsoluteUrl(user?.thumbnail_url) ||
    (cachedAvatar ? getAbsoluteUrl(cachedAvatar) : null) ||
    '/default-avatar.png';

  // ✅ Update Zustand user when avatar changes in AvatarSection
  const handleAvatarUpdate = (newUrl: string) => {
    const updatedUser = { ...user, avatar_url: newUrl };
    setUser(updatedUser as any);
    localStorage.setItem('avatar_url', newUrl);
  };

  useEffect(() => {
    // Sync avatar from localStorage on mount if missing
    if (!user?.avatar_url && cachedAvatar) {
      setUser({ ...(user as any), avatar_url: cachedAvatar });
    }
  }, []);

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setActiveTab('profile')}
          className={`px-4 py-2 rounded-lg ${
            activeTab === 'profile' ? 'bg-blue-600 text-white' : 'bg-gray-200'
          }`}
        >
          Profile
        </button>
        <button
          onClick={() => setActiveTab('account')}
          className={`px-4 py-2 rounded-lg ${
            activeTab === 'account' ? 'bg-blue-600 text-white' : 'bg-gray-200'
          }`}
        >
          Account
        </button>
        <button
          onClick={() => setActiveTab('avatar')}
          className={`px-4 py-2 rounded-lg ${
            activeTab === 'avatar' ? 'bg-blue-600 text-white' : 'bg-gray-200'
          }`}
        >
          Avatar
        </button>
        <button
          onClick={() => setActiveTab('theme')}
          className={`px-4 py-2 rounded-lg ${
            activeTab === 'theme' ? 'bg-blue-600 text-white' : 'bg-gray-200'
          }`}
        >
          Theme
        </button>
      </div>

      {activeTab === 'profile' && <ProfileSection />}
      {activeTab === 'account' && <AccountSection />}
      {activeTab === 'avatar' && (
        <AvatarSection
          currentAvatar={avatarSrc}
          onAvatarUpdate={handleAvatarUpdate}
        />
      )}
      {activeTab === 'theme' && <ThemeSection />}
    </div>
  );
}
