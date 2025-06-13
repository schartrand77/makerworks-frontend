// src/pages/Dashboard.jsx
import { useEffect, useState } from 'react'
import axios from '../api/axios'
import toast from 'react-hot-toast'
import ModelCard from '../components/Browse/ModelCard'
import { useAuthStore } from '../store/authStore'
import PaginationControls from '../components/Browse/PaginationControls'

export default function Dashboard() {
  const [myModels, setMyModels] = useState([])
  const [favorites, setFavorites] = useState([])
  const [loadingUploads, setLoadingUploads] = useState(true)
  const [loadingFavorites, setLoadingFavorites] = useState(true)
  const [favPage, setFavPage] = useState(1)
  const favPerPage = 8
  const { user } = useAuthStore()

  useEffect(() => {
    const fetchMyModels = async () => {
      try {
        const res = await axios.get('/models', {
          params: { mine: true },
        })
        setMyModels(res.data)
      } catch (err) {
        toast.error('Failed to load your models.')
      } finally {
        setLoadingUploads(false)
      }
    }

    const fetchFavorites = async () => {
      try {
        const res = await axios.get('/models')
        const favs = res.data.filter((m) => m.is_favorite)
        setFavorites(favs)
      } catch (err) {
        toast.error('Failed to load your favorites.')
      } finally {
        setLoadingFavorites(false)
      }
    }

    fetchMyModels()
    fetchFavorites()
  }, [])

  const pagedFavorites = favorites.slice(
    (favPage - 1) * favPerPage,
    favPage * favPerPage
  )

  const handleUnfavorite = (id) => {
    setFavorites((prev) => prev.filter((m) => m.id !== id))
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white/80 to-slate-100 dark:from-[#101010] dark:to-[#050505] px-4 py-10">
      <div className="max-w-6xl mx-auto space-y-12">

        {/* Uploaded models */}
        <section>
          <h1 className="text-4xl font-bold mb-6 text-center text-black dark:text-white">
            {user?.username}&apos;s Uploads
          </h1>

          {loadingUploads ? (
            <p className="text-center text-gray-400">Loading your uploads...</p>
          ) : myModels.length === 0 ? (
            <p className="text-center text-gray-500">You haven't uploaded any models yet.</p>
          ) : (
            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
              {myModels.map((model) => (
                <ModelCard key={model.id} model={model} />
              ))}
            </div>
          )}
        </section>

        {/* Favorited models */}
        <section>
          <h2 className="text-3xl font-bold mb-4 text-center text-black dark:text-white">
            Your Favorites
          </h2>

          {loadingFavorites ? (
            <p className="text-center text-gray-400">Loading favorites...</p>
          ) : favorites.length === 0 ? (
            <p className="text-center text-gray-500">No favorites yet.</p>
          ) : (
            <>
              <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
                {pagedFavorites.map((model) => (
                  <ModelCard
                    key={model.id}
                    model={model}
                    onFavoriteToggle={() => handleUnfavorite(model.id)}
                  />
                ))}
              </div>
              <PaginationControls
                total={favorites.length}
                page={favPage}
                setPage={setFavPage}
              />
            </>
          )}
        </section>
      </div>
    </div>
  )
}