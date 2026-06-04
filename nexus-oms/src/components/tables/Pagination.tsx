interface PaginationProps {
  currentPage: number
  totalItems: number
  pageSize: number
  onPageChange: (page: number) => void
}

export default function Pagination({ currentPage, totalItems, pageSize, onPageChange }: PaginationProps) {
  const totalPages = Math.ceil(totalItems / pageSize)
  const startItem = (currentPage - 1) * pageSize + 1
  const endItem = Math.min(currentPage * pageSize, totalItems)

  return (
    <div className="px-8 py-6 bg-surface-container-lowest flex items-center justify-between border-t border-outline-variant/10">
      <p className="text-label-md text-on-surface-variant">
        Showing <span className="font-semibold text-on-surface">{startItem} - {endItem}</span> of {totalItems.toLocaleString()}
      </p>
      <div className="flex items-center gap-2">
        <button
          className="w-10 h-10 rounded-xl border border-outline-variant/30 flex items-center justify-center hover:bg-surface-container transition-colors disabled:opacity-30"
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
        >
          <span className="material-symbols-outlined text-[18px]">chevron_left</span>
        </button>
        {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
          const page = i + 1
          return (
            <button
              key={page}
              className={`w-10 h-10 rounded-xl flex items-center justify-center font-semibold ${
                page === currentPage
                  ? 'bg-primary text-on-primary'
                  : 'border border-outline-variant/30 hover:bg-surface-container transition-colors'
              }`}
              onClick={() => onPageChange(page)}
            >
              {page}
            </button>
          )
        })}
        {totalPages > 5 && <span className="px-2">...</span>}
        {totalPages > 5 && (
          <button className="w-10 h-10 rounded-xl border border-outline-variant/30 flex items-center justify-center hover:bg-surface-container transition-colors">
            {totalPages}
          </button>
        )}
        <button
          className="w-10 h-10 rounded-xl border border-outline-variant/30 flex items-center justify-center hover:bg-surface-container transition-colors disabled:opacity-30"
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(currentPage + 1)}
        >
          <span className="material-symbols-outlined text-[18px]">chevron_right</span>
        </button>
      </div>
    </div>
  )
}
