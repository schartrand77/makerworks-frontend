import { useEffect, useState } from 'react'
import PageLayout from '@/components/layout/PageLayout'
import GlassInput from '@/components/ui/GlassInput'
import GlassButton from '@/components/ui/GlassButton'
import { useUser } from '@/hooks/useUser'
import { useToast } from '@/hooks/useToast'
import { fetchAvailableFilaments, Filament } from '@/api/filaments'
import {
  fetchAllUsers,
  banUser,
  promoteUser,
  resetPassword,
  fetchAllModels,
  updateModel,
  updateFilament,
  addFilament,
  deleteFilament,
  AdminUser,
  Model,
} from '@/api/admin'

import { confirmAlert } from 'react-confirm-alert'
import 'react-confirm-alert/src/react-confirm-alert.css'

export default function Admin() {
  const { user, isAdmin, loading } = useUser()
  const { toast } = useToast()
  const [tab, setTab] = useState<'users' | 'filaments' | 'models'>('users')
  const [users, setUsers] = useState<AdminUser[]>([])
  const [filaments, setFilaments] = useState<Filament[]>([])
  const [models, setModels] = useState<Model[]>([])
  const [newFilament, setNewFilament] = useState<Omit<Filament, 'id'>>({ type: '', color: '', hex: '' })
  const [editingFilamentId, setEditingFilamentId] = useState<string | null>(null)
  const [loadingId, setLoadingId] = useState<string | null>(null)

  const loadUsers = () => {
    fetchAllUsers()
      .then(setUsers)
      .catch(err => {
        console.error(err)
        toast('Failed to load users', 'error')
      })
  }

  const loadFilaments = () => {
    fetchAvailableFilaments()
      .then(setFilaments)
      .catch(err => {
        console.error(err)
        toast('Failed to load filaments', 'error')
      })
  }

  const loadModels = () => {
    fetchAllModels()
      .then(setModels)
      .catch(err => {
        console.error(err)
        toast('Failed to load models', 'error')
      })
  }

  useEffect(() => {
    if (!isAdmin) return
    if (tab === 'users') loadUsers()
    if (tab === 'filaments') loadFilaments()
    if (tab === 'models') loadModels()
  }, [tab, isAdmin])

  if (loading) {
    return (
      <PageLayout title="Admin Panel">
        <p>Loading admin tools…</p>
      </PageLayout>
    )
  }

  if (!user || !isAdmin) {
    return (
      <PageLayout title="Access Denied">
        <p>Admin access required.</p>
      </PageLayout>
    )
  }

  const handleFilamentChange = (idx: number, key: keyof Filament, value: string) => {
    setFilaments(f => f.map((fil, i) => (i === idx ? { ...fil, [key]: value } : fil)))
  }

  const saveFilament = async (fil: Filament) => {
    setLoadingId(fil.id)
    try {
      await updateFilament(fil.id, { type: fil.type, color: fil.color, hex: fil.hex })
      await loadFilaments()
      setEditingFilamentId(null)
      toast('✅ Filament updated', 'success')
    } catch (err) {
      console.error(err)
      toast('❌ Failed to save filament', 'error')
    } finally {
      setLoadingId(null)
    }
  }

  const handleAddNewFilament = async () => {
    if (!newFilament.type) return
    setLoadingId('new')
    try {
      await addFilament(newFilament)
      setNewFilament({ type: '', color: '', hex: '' })
      await loadFilaments()
      toast('✅ Filament added', 'success')
    } catch (err) {
      console.error(err)
      toast('❌ Failed to add filament', 'error')
    } finally {
      setLoadingId(null)
    }
  }

  const handleDeleteFilament = (id: string) => {
    confirmAlert({
      title: 'Confirm Delete',
      message: 'Are you sure you want to delete this filament?',
      buttons: [
        {
          label: 'Yes',
          onClick: async () => {
            setLoadingId(id)
            try {
              await deleteFilament(id)
              await loadFilaments()
              toast('✅ Filament deleted', 'success')
            } catch (err) {
              console.error(err)
              toast('❌ Failed to delete filament', 'error')
            } finally {
              setLoadingId(null)
            }
          }
        },
        { label: 'No' }
      ]
    })
  }

  const handleModelChange = (idx: number, key: keyof Model, value: string) => {
    setModels(m => m.map((model, i) => (i === idx ? { ...model, [key]: value } : model)))
  }

  const saveModel = async (model: Model) => {
    setLoadingId(model.id)
    try {
      await updateModel(model.id, model)
      toast('✅ Model updated', 'success')
    } catch (err) {
      console.error(err)
      toast('❌ Failed to save model', 'error')
    } finally {
      setLoadingId(null)
    }
  }

  const handleBanUser = (id: string, username: string) => {
    confirmAlert({
      title: 'Confirm Ban',
      message: `Are you sure you want to ban ${username}?`,
      buttons: [
        {
          label: 'Yes',
          onClick: async () => {
            setLoadingId(id)
            try {
              await banUser(id)
              toast('🚫 User banned', 'success')
              loadUsers()
            } catch (err) {
              console.error(err)
              toast('❌ Failed to ban user', 'error')
            } finally {
              setLoadingId(null)
            }
          }
        },
        { label: 'No' }
      ]
    })
  }

  return (
    <PageLayout title="Admin Panel" maxWidth="xl" padding="p-4">
      <div className="flex gap-3 mb-4">
        {['users', 'filaments', 'models'].map(t => (
          <GlassButton
            key={t}
            variant={tab === t ? 'primary' : 'secondary'}
            onClick={() => setTab(t as typeof tab)}
          >
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </GlassButton>
        ))}
      </div>

      {tab === 'users' && (
        <div className="space-y-4">
          <div className="glass-card p-4">
            {users.map(u => (
              <div
                key={u.id}
                className="flex justify-between items-center border-b last:border-0 py-2"
              >
                <div>
                  <div className="font-medium">{u.username}</div>
                  <div className="text-sm text-zinc-500">{u.email}</div>
                </div>

                <div className="flex gap-2">
                  <GlassButton
                    size="sm"
                    variant="primary"
                    disabled={loadingId === u.id}
                    onClick={async () => {
                      setLoadingId(u.id)
                      try {
                        await promoteUser(u.id)
                        toast('✅ User promoted', 'success')
                        loadUsers()
                      } catch (err) {
                        console.error(err)
                        toast('❌ Failed to promote user', 'error')
                      } finally {
                        setLoadingId(null)
                      }
                    }}
                    title="Promote user"
                  >
                    {loadingId === u.id ? 'Promoting…' : 'Promote'}
                  </GlassButton>

                  <GlassButton
                    size="sm"
                    variant="secondary"
                    disabled={loadingId === u.id}
                    onClick={async () => {
                      setLoadingId(u.id)
                      try {
                        await resetPassword(u.id)
                        toast('🔒 Password reset', 'success')
                      } catch (err) {
                        console.error(err)
                        toast('❌ Failed to reset password', 'error')
                      } finally {
                        setLoadingId(null)
                      }
                    }}
                    title="Reset password"
                  >
                    {loadingId === u.id ? 'Resetting…' : 'Reset'}
                  </GlassButton>

                  <GlassButton
                    size="sm"
                    variant="danger"
                    disabled={loadingId === u.id}
                    onClick={() => handleBanUser(u.id, u.username)}
                    title="Ban user"
                  >
                    {loadingId === u.id ? 'Banning…' : 'Ban'}
                  </GlassButton>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === 'filaments' && (
        <div className="space-y-4">
          <div className="glass-card p-4">
            <h3 className="font-medium mb-2">Add Filament</h3>
            <div className="flex flex-wrap gap-2 items-end">
              {['type', 'color', 'hex'].map(k => (
                <GlassInput
                  key={k}
                  id={`new-${k}`}
                  label={k.charAt(0).toUpperCase() + k.slice(1)}
                  value={(newFilament as any)[k] || ''}
                  onChange={e => setNewFilament({ ...newFilament, [k]: e.target.value })}
                />
              ))}
              <GlassButton size="sm" onClick={handleAddNewFilament} disabled={loadingId === 'new'}>
                {loadingId === 'new' ? 'Adding…' : 'Add'}
              </GlassButton>
            </div>
          </div>

          <div className="glass-card p-4 space-y-2">
            {filaments.map((f, i) => (
              <div
                key={f.id}
                className="flex flex-wrap gap-2 items-center border-b last:border-0 pb-2 justify-between"
              >
                {editingFilamentId !== f.id ? (
                  <>
                    <div className="flex flex-col">
                      <span className="font-medium">{f.type}</span>
                      <span className="text-sm">
                        {f.color}{' '}
                        <span style={{ color: f.hex, marginLeft: '0.5rem' }}>●</span>
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <GlassButton
                        size="sm"
                        variant="secondary"
                        onClick={() => setEditingFilamentId(f.id)}
                      >
                        Edit
                      </GlassButton>
                      <GlassButton
                        size="sm"
                        variant="danger"
                        onClick={() => handleDeleteFilament(f.id)}
                        disabled={loadingId === f.id}
                      >
                        {loadingId === f.id ? 'Deleting…' : 'Delete'}
                      </GlassButton>
                    </div>
                  </>
                ) : (
                  <>
                    {['type', 'color', 'hex'].map(k => (
                      <GlassInput
                        key={k}
                        id={`${k}-${i}`}
                        label={k}
                        value={(f as any)[k] || ''}
                        onChange={e => handleFilamentChange(i, k as keyof Filament, e.target.value)}
                      />
                    ))}
                    <GlassButton size="sm" onClick={() => saveFilament(f)} disabled={loadingId === f.id}>
                      {loadingId === f.id ? 'Saving…' : 'Save'}
                    </GlassButton>
                    <GlassButton
                      size="sm"
                      variant="secondary"
                      onClick={() => setEditingFilamentId(null)}
                    >
                      Cancel
                    </GlassButton>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === 'models' && (
        <div className="space-y-4">
          <div className="glass-card p-4 space-y-2">
            {models.map((m, i) => (
              <div
                key={m.id}
                className="flex flex-wrap gap-2 items-end border-b last:border-0 pb-2"
              >
                <GlassInput
                  id={`mn-${i}`}
                  label="Name"
                  value={m.name || ''}
                  onChange={e => handleModelChange(i, 'name', e.target.value)}
                />
                <GlassInput
                  id={`md-${i}`}
                  label="Description"
                  value={m.description || ''}
                  onChange={e => handleModelChange(i, 'description', e.target.value)}
                />
                <GlassButton
                  size="sm"
                  onClick={() => saveModel(m)}
                  disabled={loadingId === m.id}
                >
                  {loadingId === m.id ? 'Saving…' : 'Save'}
                </GlassButton>
              </div>
            ))}
          </div>
        </div>
      )}
    </PageLayout>
  )
}
