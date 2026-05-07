import { useState } from 'react'
import { useQuery, keepPreviousData } from '@tanstack/react-query'
import { Search } from 'lucide-react'
import { contentService } from '../../services/content.service'
import { QUERY_KEYS, CONTENT_STATUS, DEFAULT_PAGE_SIZE } from '../../utils/constants'
import { useDebounce } from '../../hooks/useDebounce'
import { ContentTable } from '../../components/content/ContentTable'
import { EmptyState } from '../../components/common/EmptyState'
import { ErrorState } from '../../components/common/ErrorState'
import { SkeletonTable } from '../../components/common/Loader'
import { cn } from '../../utils/helpers'

const STATUS_FILTERS = [
  { value: 'all', label: 'All Content' },
  { value: CONTENT_STATUS.PENDING, label: 'Pending' },
  { value: CONTENT_STATUS.APPROVED, label: 'Approved' },
  { value: CONTENT_STATUS.REJECTED, label: 'Rejected' },
]

export default function AllContent() {
  const [statusFilter, setStatusFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const debouncedSearch = useDebounce(search, 400)

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: [QUERY_KEYS.ALL_CONTENT, statusFilter, debouncedSearch, page],
    queryFn: () =>
      contentService.getAllContent({
        status: statusFilter,
        search: debouncedSearch,
        page,
        pageSize: DEFAULT_PAGE_SIZE,
      }),
    placeholderData: keepPreviousData,
    staleTime: 30000,
  })

  const handleSearch = (value) => {
    setSearch(value)
    setPage(1)
  }

  const handleStatusFilter = (value) => {
    setStatusFilter(value)
    setPage(1)
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">All Content</h1>
        <p className="text-muted-foreground text-sm mt-1">
          {data?.total ?? '—'} total items across all teachers.
        </p>
      </div>

      {/* Filters */}
      <div className="flex gap-3 flex-wrap items-center">
        {/* Search */}
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            id="all-content-search"
            type="text"
            placeholder="Search by title, subject, or teacher..."
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            className="input-field pl-9"
          />
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-1 glass rounded-lg p-1">
          {STATUS_FILTERS.map((f) => (
            <button
              key={f.value}
              onClick={() => handleStatusFilter(f.value)}
              className={cn(
                'px-3 py-1.5 rounded-md text-xs font-medium transition-all whitespace-nowrap',
                statusFilter === f.value
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
              )}
              type="button"
              id={`all-content-filter-${f.value}`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Record count */}
        {data && (
          <p className="text-xs text-muted-foreground ml-auto whitespace-nowrap">
            Showing {Math.min((page - 1) * DEFAULT_PAGE_SIZE + 1, data.total)}–
            {Math.min(page * DEFAULT_PAGE_SIZE, data.total)} of {data.total}
          </p>
        )}
      </div>

      {/* Table */}
      {error ? (
        <ErrorState message={error.message} onRetry={refetch} />
      ) : isLoading ? (
        <SkeletonTable rows={DEFAULT_PAGE_SIZE} />
      ) : !data?.data?.length ? (
        <EmptyState
          icon={debouncedSearch || statusFilter !== 'all' ? 'search' : 'empty'}
          title="No content found"
          description="Try adjusting your search or filter criteria."
        />
      ) : (
        <ContentTable
          items={data.data}
          showTeacher
          page={page}
          totalPages={data.totalPages}
          onPageChange={setPage}
        />
      )}
    </div>
  )
}
