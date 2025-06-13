import { useBrowseStore } from '../../store/browseStore'

export default function FiltersBar({ suggestions }) {
  const { query, setQuery, filters, setFilter, hoverPreviewEnabled, togglePreview } = useBrowseStore()

  return (
    <div className="flex flex-wrap gap-4 mb-6 items-center">
      <input
        type="text"
        placeholder="Search models..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        list="search-suggestions"
        className="flex-1 px-4 py-2 rounded bg-white/20 text-white placeholder-gray-400"
      />
      <datalist id="search-suggestions">
        {suggestions.map((s) => <option key={s} value={s} />)}
      </datalist>

      <select
        value={filters.filament}
        onChange={(e) => setFilter('filament', e.target.value)}
        className="px-3 py-2 rounded bg-white/20 text-white"
      >
        <option value="">All Filaments</option>
        <option value="PLA">PLA</option>
        <option value="PETG">PETG</option>
        <option value="ABS">ABS</option>
      </select>

      <select
        value={filters.sort}
        onChange={(e) => setFilter('sort', e.target.value)}
        className="px-3 py-2 rounded bg-white/20 text-white"
      >
        <option value="newest">Newest</option>
        <option value="popular">Most Favorited</option>
      </select>

      <label className="flex items-center gap-2 text-white text-sm bg-white/10 px-3 py-1 rounded-xl">
        <span>3D Preview</span>
        <input
          type="checkbox"
          checked={hoverPreviewEnabled}
          onChange={togglePreview}
          className="accent-blue-500 h-4 w-4"
        />
      </label>
    </div>
  )
}