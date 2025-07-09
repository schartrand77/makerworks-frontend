import { useEffect, useState } from 'react'
import PageLayout from '@/components/layout/PageLayout'
import GlassInput from '@/components/ui/GlassInput'
import GlassButton from '@/components/ui/GlassButton'
import { useUser } from '@/hooks/useUser'
import {
  fetchAllUsers,
  banUser,
  fetchAllModels,
  updateModel,
  updateFilament,
  addFilament,
} from '@/api/admin'
import { fetchAvailableFilaments, Filament } from '@/api/filaments'
import type { AdminUser, Model } from '@/api/admin'

export default function Admin() {
  const { user, isAdmin, loading } = useUser()
  const [tab, setTab] = useState<'users' | 'filaments' | 'models'>('users')
  const [users, setUsers] = useState<AdminUser[]>([])
  const [filaments, setFilaments] = useState<Filament[]>([])
  const [models, setModels] = useState<Model[]>([])
  const [newFilament, setNewFilament] = useState<Omit<Filament, 'id'>>({
    type: '',
    color: '',
    hex: '',
  })

  useEffect(() => {
    if (!isAdmin) return
    if (tab === 'users') {
      fetchAllUsers().then(setUsers).catch(console.error)
    } else if (tab === 'filaments') {
      fetchAvailableFilaments().then(setFilaments).catch(console.error)
    } else if (tab === 'models') {
      fetchAllModels().then(setModels).catch(console.error)
    }
  }, [tab, isAdmin])

  if (loading) {
    return (
      <>
        <PageLayout title="Admin Panel">
          <p className="text-muted-foreground">Loading admin tools…</p>
        </PageLayout>
      </>
    )
  }

  if (!user || !isAdmin) {
    return (
      <>
        <PageLayout title="Access Denied">
          <p className="text-red-600 dark:text-red-400">Admin access required.</p>
        </PageLayout>
      </>
    )
  }

  const handleFilamentChange = (idx: number, key: keyof Filament, value: string) => {
    setFilaments(f => f.map((fil, i) => (i === idx ? { ...fil, [key]: value } : fil)))
  }

  const saveFilament = async (fil: Filament) => {
    await updateFilament(fil.id, fil)
  }

  const addNewFilament = async () => {
    if (!newFilament.type) return
    const created = await addFilament(newFilament)
    setFilaments(f => [...f, created])
    setNewFilament({ type: '', color: '', hex: '' })
  }

  const handleModelChange = (idx: number, key: keyof Model, value: string) => {
    setModels(m => m.map((model, i) => (i === idx ? { ...model, [key]: value } : model)))
  }

  const saveModel = async (model: Model) => {
    await updateModel(model.id, model)
  }

  return (
    <>
      <PageLayout title="Admin Panel" maxWidth="xl" padding="p-4">
        <div className="flex gap-3 mb-4">
          <GlassButton variant={tab === 'users' ? 'primary' : 'secondary'} onClick={() => setTab('users')}>
            Users
          </GlassButton>
          <GlassButton variant={tab === 'filaments' ? 'primary' : 'secondary'} onClick={() => setTab('filaments')}>
            Filaments
          </GlassButton>
          <GlassButton variant={tab === 'models' ? 'primary' : 'secondary'} onClick={() => setTab('models')}>
            Models
          </GlassButton>
        </div>

        {tab === 'users' && (
          <div className="space-y-3">
            {users.map(u => (
              <div key={u.id} className="flex justify-between items-center border-b pb-2">
                <div>
                  <div className="font-medium">{u.username}</div>
                  <div className="text-sm text-zinc-500">{u.email}</div>
                </div>
                <GlassButton size="sm" variant="secondary" onClick={() => banUser(u.id)}>
                  Ban
                </GlassButton>
              </div>
            ))}
          </div>
        )}

        {tab === 'filaments' && (
          <div className="space-y-4">
            {filaments.map((f, i) => (
              <div key={f.id} className="flex flex-wrap gap-2 items-end">
                <GlassInput id={`ft-${i}`} label="Type" value={f.type} onChange={e => handleFilamentChange(i, 'type', e.target.value)} />
                <GlassInput id={`fc-${i}`} label="Color" value={f.color} onChange={e => handleFilamentChange(i, 'color', e.target.value)} />
                <GlassInput id={`fh-${i}`} label="Hex" value={f.hex} onChange={e => handleFilamentChange(i, 'hex', e.target.value)} />
                <GlassButton size="sm" onClick={() => saveFilament(f)}>Save</GlassButton>
              </div>
            ))}

            <div className="pt-4 border-t mt-4">
              <h3 className="font-medium mb-2">Add Filament</h3>
              <div className="flex flex-wrap gap-2 items-end">
                <GlassInput id="new-type" label="Type" value={newFilament.type} onChange={e => setNewFilament({ ...newFilament, type: e.target.value })} />
                <GlassInput id="new-color" label="Color" value={newFilament.color} onChange={e => setNewFilament({ ...newFilament, color: e.target.value })} />
                <GlassInput id="new-hex" label="Hex" value={newFilament.hex} onChange={e => setNewFilament({ ...newFilament, hex: e.target.value })} />
                <GlassButton size="sm" onClick={addNewFilament}>Add</GlassButton>
              </div>
            </div>
          </div>
        )}

        {tab === 'models' && (
          <div className="space-y-4">
            {models.map((m, i) => (
              <div key={m.id} className="flex flex-wrap gap-2 items-end">
                <GlassInput id={`mn-${i}`} label="Name" value={m.name} onChange={e => handleModelChange(i, 'name', e.target.value)} />
                <GlassInput id={`md-${i}`} label="Description" value={m.description || ''} onChange={e => handleModelChange(i, 'description', e.target.value)} />
                <GlassButton size="sm" onClick={() => saveModel(m)}>Save</GlassButton>
              </div>
            ))}
          </div>
        )}
      </PageLayout>
    </>
  )
}