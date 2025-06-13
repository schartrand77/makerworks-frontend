import { useEffect, useState } from 'react'
import axios from '../api/axios'
import toast from 'react-hot-toast'
import ModelCard from '../components/Browse/ModelCard'
import FiltersBar from '../components/Browse/FiltersBar'
import PaginationControls from '../components/Browse/PaginationControls'
import { useBrowseStore } from '../store/browseStore'

function ShowFavoritesToggle() {
  const { showOnlyFavorites, toggleFavorites } = useBrowseStore()
  return (
    <div className="flex items-center justify-end mb-4">
      <label className="flex items-center gap-2 cursor-pointer text-sm text-white bg-white/10 border border-white/20 px-4 py-2 rounded-full backdrop-blur-md">
        <input
          type="checkbox"
          checked={showOnlyFavorites}
          onChange={toggleFavorites}
          className="form-checkbox accent-blue-500"
        />
        <span>Show Only Favorites</span>
      </label>
    </div>
  )
}

export default function Browse() {
  const [models, setModels] = useState([])
  const [loading, setLoading] = useState(true)
  const { query, filters, page, perPage, showOnlyFavorites } = useBrowseStore()
  const [suggestions, setSuggestions] = useState([])

  useEffect(() => {
    const fetchModels = async () => {
      try {
        const res = await axios.get('/models')
        setModels(res.data)

        const allTitles = res.data.map((m) => m.title)
        setSuggestions([...new Set(allTitles)])
      } catch (err) {
        toast.error('Failed to load models')
      } finally {
        setLoading(false)
      }
    }

    fetchModels()
  }, [])

  const filtered = models
    .filter((m) => {
      const matchesSearch = m.title.toLowerCase().includes(query.toLowerCase())
      const matchesFilament = filters.filament ? m.filament_type === filters.filament : true
      const matchesFavorite = showOnlyFavorites ? m.is_favorite : true
      return matchesSearch && matchesFilament && matchesFavorite
    })
    .sort((a, b) => {
      if (filters.sort === 'popular') return b.favorite_count - a.favorite_count
      return new Date(b.created_at) - new Date(a.created_at)
    })

  const paged = filtered.slice((page - 1) * perPage, page * perPage)

  return (
    <div className="min-h-screen bg-gradient-to-b from-white/80 to-slate-100 dark:from-[#101010] dark:to-[#050505] px-4 py-10">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center text-black dark:text-white">
          Browse Models
        </h1>

        <FiltersBar suggestions={suggestions} />
        <ShowFavoritesToggle />

        {loading ? (
          <p className="text-center text-gray-500 dark:text-gray-400">Loading...</p>
        ) : filtered.length === 0 ? (
          <p className="text-center text-gray-500 dark:text-gray-400">No matching models found.</p>
        ) : (
          <>
            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
              {paged.map((model) => (
                <ModelCard key={model.id} model={model} />
              ))}
            </div>
            <PaginationControls total={filtered.length} />
          </>
        )}
      </div>
    </div>
  )
}