import { useState, useEffect, useRef } from 'react';
import { toast } from 'sonner';
import { shallow as useShallow } from 'zustand/shallow';

import { useAuthStore } from '@/store/useAuthStore';
import { updateUserProfile, uploadAvatar, deleteAccount } from '@/api/users';
import type { AvatarUploadResponse } from '@/api/users';

const themes = ['system', 'light', 'dark'] as const;
type Theme = typeof themes[number];

type ProfileState = {
  username: string;
  email: string;
  bio: string;
  avatar_url: string;
};

export default function Settings() {
  const { user, setUser } = useAuthStore(
    useShallow((state) => ({ user: state.user, setUser: state.setUser }))
  );

  const [theme, setTheme] = useState<Theme>('system');
  const [bio, setBio] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [saving, setSaving] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [editingAvatar, setEditingAvatar] = useState(false);
  const [selectedAvatarFile, setSelectedAvatarFile] = useState<File | null>(null);
  const [initialProfile, setInitialProfile] = useState<ProfileState>({
    username: '',
    email: '',
    bio: '',
    avatar_url: ''
  });

  const bioRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem('theme') as Theme;
    setTheme(themes.includes(saved) ? saved : 'system');
    if (saved === 'dark') document.documentElement.classList.add('dark');
    else if (saved === 'light') document.documentElement.classList.remove('dark');

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
    const trimmedUsername = username.trim();
    const trimmedEmail = email.trim();
    const payload = { username: trimmedUsername, email: trimmedEmail, bio };

    const prevUser = { ...user! };
    setUser({ ...prevUser, ...payload });

    try {
      await updateUserProfile(payload);
      toast.success('✅ Profile updated');
      setInitialProfile({
        username: trimmedUsername,
        email: trimmedEmail,
        bio,
        avatar_url: user!.avatar_url || ''
      });
      setDirty(false);
    } catch (err) {
      console.error('[updateUserProfile] error', err);
      setUser(prevUser);
      toast.error('❌ Failed to save profile');
    } finally {
      setSaving(false);
    }
  };

  const handleAvatarSave = async () => {
    if (!selectedAvatarFile) {
      toast.error('❌ No file selected');
      return;
    }

    const validTypes = ['image/png', 'image/jpeg', 'image/webp'];
    if (!validTypes.includes(selectedAvatarFile.type)) {
      toast.error('❌ Unsupported file type. Use PNG, JPEG, or WEBP.');
      return;
    }

    if (selectedAvatarFile.size > 5 * 1024 * 1024) {
      toast.error('❌ File too large. Max 5MB.');
      return;
    }

    setUploadingAvatar(true);
    try {
      const res: AvatarUploadResponse | null = await uploadAvatar(selectedAvatarFile);
      if (res) {
        const newUser = { ...user!, avatar_url: res.avatar_url, thumbnail_url: res.thumbnail_url };
        setUser(newUser);
        try {
          localStorage.setItem('avatar_url', res.avatar_url);
        } catch (err) {
          console.warn('[localStorage] Failed to persist avatar_url', err);
        }
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
      setEditingAvatar(false);
      setSelectedAvatarFile(null);
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

  return (
    <div className="relative flex justify-center items-center min-h-screen px-4">
      <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-white/0 animate-pulse-slow" />
      <div className="glass-card w-full max-w-3xl space-y-8 p-8 bg-white/5 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/10 relative z-10">
        {/* ...retain all existing UI here as-is */}
      </div>
    </div>
  );
}
