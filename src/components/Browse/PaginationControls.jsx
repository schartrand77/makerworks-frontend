// components/Browse/PaginationControls.jsx
import { useBrowseStore } from '../../store/browseStore'

export default function PaginationControls({ total }) {
  const { page, perPage, setPage } = useBrowseStore()
  const totalPages = Math.ceil(total / perPage)

  return (
    <div className="flex justify-center gap-4 mt-8 text-white">
      <button
        onClick={() => setPage(page - 1)}
        disabled={page <= 1}
        className="px-4 py-1 rounded bg-white/10 hover:bg-white/20 disabled:opacity-30"
      >
        Prev
      </button>
      <span className="px-2 py-1">Page {page} of {totalPages}</span>
      <button
        onClick={() => setPage(page + 1)}
        disabled={page >= totalPages}
        className="px-4 py-1 rounded bg-white/10 hover:bg-white/20 disabled:opacity-30"
      >
        Next
      </button>
    </div>
  )
}