import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Filter, Grid, List, Search, Upload } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'
import { contentService } from '../../services/content.service'
import { QUERY_KEYS, CONTENT_STATUS } from '../../utils/constants'
import { useDebounce } from '../../hooks/useDebounce'
import { ContentCard } from '../../components/content/ContentCard'
import { ContentTable } from '../../components/content/ContentTable'
import { EmptyState } from '../../components/common/EmptyState'
import { ErrorState } from '../../components/common/ErrorState'
import { SkeletonCard } from '../../components/common/Loader'
import { cn } from '../../utils/helpers'

const STATUS_FILTERS = [
  { value: 'all', label: 'All' },
  { value: CONTENT_STATUS.PENDING, label: 'Pending' },
  { value: CONTENT_STATUS.APPROVED, label: 'Approved' },
  { value: CONTENT_STATUS.REJECTED, label: 'Rejected' },
]

export default function MyContent() {
  const { user } = useAuth()
  const [view, setView] = useState('grid')
  const [statusFilter, setStatusFilter] = useState('all')
  const [search, setSearch] = useState('')
  const debouncedSearch = useDebounce(search, 400)

  const { data: content, isLoading, error, refetch } = useQuery({
    queryKey: [QUERY_KEYS.TEACHER_CONTENT, user?.id],
    queryFn: () => contentService.getTeacherContent(user?.id),
    enabled: !!user?.id,
  })

  const filtered = useMemo(() => {
    if (!content) return []
    return content
      .filter((c) => statusFilter === 'all' || c.status === statusFilter)
      .filter((c) => {
        if (!debouncedSearch) return true
        const q = debouncedSearch.toLowerCase()
        return (
          c.title?.toLowerCase().includes(q) ||
          c.subject?.toLowerCase().includes(q)
        )
      })
  }, [content, statusFilter, debouncedSearch])

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-foreground">My Content</h1>
          <p className="text-muted-foreground text-sm mt-1">
            {content?.length ?? 0} items total
          </p>
        </div>
        <Link to="/teacher/upload" className="btn-primary" id="my-content-upload-btn">
          <Upload className="h-4 w-4" />
          Upload New
        </Link>
      </div>

      {/* Toolbar */}
      <div className="flex gap-3 flex-wrap items-center">
        {/* Search */}
        <div className="relative flex-1 min-w-[200px] max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            id="my-content-search"
            type="text"
            placeholder="Search content..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-field pl-9"
          />
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-1 glass rounded-lg p-1">
          {STATUS_FILTERS.map((f) => (
            <button
              key={f.value}
              onClick={() => setStatusFilter(f.value)}
              className={cn(
                'px-3 py-1.5 rounded-md text-xs font-medium transition-all',
                statusFilter === f.value
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
              )}
              type="button"
              id={`filter-${f.value}`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* View Toggle */}
        <div className="flex items-center gap-1 glass rounded-lg p-1 ml-auto">
          <button
            onClick={() => setView('grid')}
            className={cn(
              'p-1.5 rounded-md transition-colors',
              view === 'grid' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'
            )}
            type="button"
            aria-label="Grid view"
          >
            <Grid className="h-4 w-4" />
          </button>
          <button
            onClick={() => setView('table')}
            className={cn(
              'p-1.5 rounded-md transition-colors',
              view === 'table' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'
            )}
            type="button"
            aria-label="Table view"
          >
            <List className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Content */}
      {error ? (
        <ErrorState message={error.message} onRetry={refetch} />
      ) : isLoading ? (
        view === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : (
          <div className="glass rounded-xl p-8 text-center">
            <div className="flex justify-center">
              <div className="h-6 w-6 rounded-full border-2 border-primary/30 border-t-primary animate-spin" />
            </div>
          </div>
        )
      ) : !filtered.length ? (
        <EmptyState
          icon={search || statusFilter !== 'all' ? 'search' : 'empty'}
          title={search || statusFilter !== 'all' ? 'No results found' : 'No content yet'}
          description={
            search || statusFilter !== 'all'
              ? 'Try adjusting your search or filter criteria.'
              : 'Upload your first content to start broadcasting.'
          }
          action={
            !search && statusFilter === 'all' ? (
              <Link to="/teacher/upload" className="btn-primary">
                <Upload className="h-4 w-4" />
                Upload Content
              </Link>
            ) : null
          }
        />
      ) : view === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map((item) => (
            <ContentCard key={item.id} item={item} />
          ))}
        </div>
      ) : (
        <ContentTable items={filtered} />
      )}
    </div>
  )
}
