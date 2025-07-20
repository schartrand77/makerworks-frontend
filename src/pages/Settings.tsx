import { useState, useEffect, useRef, ChangeEvent } from 'react';
import { toast } from 'sonner';
import { Box } from 'lucide-react';

import { useAuthStore } from '@/store/useAuthStore';
import { cn } from '@/lib/utils';
import { updateUserProfile, uploadAvatar, deleteAccount } from '@/api/users';
import type { AvatarUploadResponse } from '@/api/users';

const themes = ['system', 'light', 'dark'] as const;
type Theme = typeof themes[number];

export default function Settings() {
  const user = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser);
  const loading = false;

  const [theme, setTheme] = useState<Theme>('system');
  const [bio, setBio] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [saving, setSaving] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [initialProfile, setInitialProfile] = useState({
    username: '',
    email: '',
    bio: '',
    avatar_url: '',
  });

  const bioRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const saved = (localStorage.getItem('theme') as Theme) || 'system';
    setTheme(saved);

    if (user) {
      setBio(user.bio || '');
      setUsername(user.username || '');
      setEmail(user.email || '');
      setInitialProfile({
        username: user.username || '',
        email: user.email || '',
        bio: user.bio || '',
        avatar_url: user.avatar_url || '',
      });
    }

    if (!user?.bio && bioRef.current) {
      bioRef.current.focus();
    }
  }, [user]);

  useEffect(() => {
    if (!user) return;

    const changed =
      username !== initialProfile.username ||
      email !== initialProfile.email ||
      bio !== initialProfile.bio;

    setDirty(changed);
  }, [username, email, bio, initialProfile]);

  const handleThemeChange = (val: Theme) => {
    setTheme(val);
    localStorage.setItem('theme', val);
    document.documentElement.classList.remove('light', 'dark');
    if (val === 'light') document.documentElement.classList.add('light');
    if (val === 'dark') document.documentElement.classList.add('dark');
  };

  const handleSave = async () => {
    if (saving || !dirty) return;

    setSaving(true);

    const payload = { username, email, bio };
    const prevUser = { ...user! };
    setUser({ ...prevUser, ...payload });

    try {
      console.log('🔷 Sending payload:', payload);
      await updateUserProfile(payload);
      toast.success('✅ Profile updated');
      setInitialProfile({
        username,
        email,
        bio,
        avatar_url: user!.avatar_url || '',
      });
      setDirty(false);
    } catch (err) {
      console.error('[updateUserProfile] error', err);
      setUser(prevUser); // rollback
      toast.error('❌ Failed to save profile');
    } finally {
      setSaving(false);
    }
  };

  const handleAvatarUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      toast.error('❌ No file selected');
      return;
    }

    setUploadingAvatar(true);
    try {
      const res: AvatarUploadResponse | null = await uploadAvatar(file);
      if (res) {
        setUser({
          ...user!,
          avatar_url: res.avatar_url,
          thumbnail_url: res.thumbnail_url,
        });
        setDirty(true);
        toast.success('✅ Avatar updated successfully');
      } else {
        toast.error('❌ Failed to upload avatar — no response from server');
      }
    } catch (err) {
      console.error(err);
      toast.error('❌ Failed to upload avatar — unexpected error');
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleDelete = async () => {
    if (!confirmDelete || deleting) return;

    setDeleting(true);
    try {
      await deleteAccount();
      toast.success('✅ Account deleted');
      window.location.href = '/';
    } catch {
      toast.error('❌ Failed to delete account');
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen animate-pulse">
        <div className="h-8 bg-white/10 rounded w-1/3"></div>
      </div>
    );
  }

  return (
    <div className="relative flex justify-center items-center min-h-screen px-4">
      <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-white/0 animate-pulse-slow" />
      <div className="glass-card w-full max-w-3xl space-y-8 p-8 bg-white/5 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/10 relative z-10">
        <h1 className="text-4xl font-bold flex items-center gap-2 text-zinc-400 tracking-tight drop-shadow">
          <Box className="w-8 h-8 text-zinc-400" />
          User Settings
        </h1>

        {/* Avatar */}
        <section className="space-y-4 p-4 rounded-xl bg-white/5 backdrop-blur border border-white/10 shadow">
          <h2 className="text-xl font-semibold text-zinc-400">Profile Picture</h2>
          <div className="flex items-center gap-4">
            {uploadingAvatar ? (
              <div className="w-20 h-20 rounded-xl bg-white/20 backdrop-blur-sm shadow-inner animate-pulse border border-white/10" />
            ) : user?.avatar_url ? (
              <img
                src={user.avatar_url}
                alt="avatar"
                className="w-20 h-20 rounded-xl object-cover border border-white/10 shadow-lg bg-white/10 backdrop-blur"
              />
            ) : (
              <div className="w-20 h-20 rounded-xl bg-white/10 backdrop-blur flex items-center justify-center text-zinc-400 text-2xl shadow-inner border border-white/10">
                {user?.username?.[0] ?? '?'}
              </div>
            )}
            <label
              className="
                cursor-pointer
                px-3 py-1
                rounded-xl
                text-sm text-zinc-400
                shadow
                backdrop-blur
                bg-white/10
                border border-white/20
                hover:bg-white/20
                transition
              "
            >
              Change…
              <input type="file" accept="image/*" hidden onChange={handleAvatarUpload} />
            </label>
          </div>
        </section>

        {/* Profile Info */}
        <section className="space-y-4 p-4 rounded-xl bg-white/5 backdrop-blur border border-white/10 shadow">
          <h2 className="text-xl font-semibold text-zinc-400">Profile Info</h2>
          <div className="grid gap-4">
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username"
              className="w-full p-3 rounded-xl border border-white/20 bg-white/10 backdrop-blur shadow-inner focus:ring-2 focus:ring-white/30 focus:outline-none text-zinc-400 placeholder:text-zinc-400"
            />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="w-full p-3 rounded-xl border border-white/20 bg-white/10 backdrop-blur shadow-inner focus:ring-2 focus:ring-white/30 focus:outline-none text-zinc-400 placeholder:text-zinc-400"
            />
            <textarea
              ref={bioRef}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full p-3 rounded-xl border border-white/20 bg-white/10 backdrop-blur shadow-inner focus:ring-2 focus:ring-white/30 focus:outline-none text-zinc-400 placeholder:text-zinc-400"
              rows={3}
              maxLength={140}
              placeholder="Tell others about your maker vibe…"
            />
            <div className="flex justify-between">
              <div className="text-xs text-zinc-400">{bio.length}/140</div>
              <button
                disabled={saving || !dirty}
                onClick={handleSave}
                className="px-4 py-2 rounded-xl text-sm text-zinc-400 bg-white/10 backdrop-blur shadow border border-white/20 hover:bg-white/20 transition disabled:opacity-50"
              >
                {saving ? 'Saving…' : 'Save Profile'}
              </button>
            </div>
          </div>
        </section>

        {/* Theme */}
        <section className="space-y-4 p-4 rounded-xl bg-white/5 backdrop-blur border border-white/10 shadow">
          <h2 className="text-xl font-semibold text-zinc-400">Theme</h2>
          <div className="flex gap-3">
            {themes.map((t) => (
              <button
                key={t}
                onClick={() => handleThemeChange(t)}
                className={cn(
                  'px-4 py-2 rounded-xl border text-sm transition backdrop-blur shadow hover:scale-105 text-zinc-400',
                  theme === t
                    ? 'bg-white/20 border-white/30'
                    : 'bg-transparent border-white/20 hover:bg-white/10'
                )}
                aria-pressed={theme === t}
              >
                {t}
              </button>
            ))}
          </div>
        </section>

        {/* Danger Zone */}
        <section className="space-y-4 p-4 rounded-xl bg-red-900/10 backdrop-blur border border-red-500/30 shadow">
          <h2 className="text-xl font-semibold text-red-300">Danger Zone</h2>
          {!confirmDelete ? (
            <button
              onClick={() => setConfirmDelete(true)}
              className="px-4 py-2 rounded-xl backdrop-blur bg-red-500/20 text-red-300 border border-red-500/30 shadow hover:bg-red-500/30 transition"
            >
              Delete Account
            </button>
          ) : (
            <div className="space-y-2">
              <p className="text-red-300">⚠️ This action is irreversible.</p>
              <div className="flex gap-3">
                <button
                  onClick={handleDelete}
                  disabled={deleting}
                  className="px-4 py-2 rounded-xl backdrop-blur bg-red-600/20 text-red-300 border border-red-600/30 shadow hover:bg-red-600/30 disabled:opacity-50"
                >
                  {deleting ? 'Deleting…' : 'Confirm Deletion'}
                </button>
                <button
                  onClick={() => setConfirmDelete(false)}
                  className="px-4 py-2 rounded-xl backdrop-blur bg-white/10 text-zinc-400 border border-white/20 shadow hover:bg-white/20"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
