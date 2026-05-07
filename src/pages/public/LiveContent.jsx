import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Clock, ImageIcon, Radio, RefreshCw, Tv, Zap } from 'lucide-react'
import { contentService } from '../../services/content.service'
import { QUERY_KEYS, POLLING_INTERVAL } from '../../utils/constants'
import { getSubjectLabel } from '../../utils/helpers'
import { SUBJECTS } from '../../utils/constants'
import { formatDateTime } from '../../utils/formatDate'
import { EmptyState } from '../../components/common/EmptyState'
import { ErrorState } from '../../components/common/ErrorState'

function LiveContentItem({ item, index }) {
  return (
    <div
      className="content-card animate-fade-in group"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      {/* Image */}
      <div className="relative h-56 bg-muted overflow-hidden rounded-t-xl">
        {item.fileUrl ? (
          <img
            src={item.fileUrl}
            alt={item.title}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
            loading="eager"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <ImageIcon className="h-12 w-12 text-muted-foreground/40" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
        {/* Live badge */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-red-500/90 backdrop-blur-sm rounded-full px-3 py-1 text-white text-xs font-bold">
          <span className="h-2 w-2 rounded-full bg-white animate-pulse" />
          LIVE
        </div>
        {item.rotationDuration && (
          <div className="absolute bottom-3 right-3 flex items-center gap-1 bg-black/60 backdrop-blur-sm rounded-md px-2 py-1 text-xs text-white">
            <Clock className="h-3 w-3" />
            {item.rotationDuration}s rotation
          </div>
        )}
      </div>

      <div className="p-5 space-y-3">
        <div>
          <h2 className="text-lg font-bold text-foreground leading-snug">{item.title}</h2>
          <p className="text-sm text-primary font-medium mt-1">
            {getSubjectLabel(item.subject, SUBJECTS)}
          </p>
        </div>
        {item.description && (
          <p className="text-sm text-muted-foreground line-clamp-3">{item.description}</p>
        )}
        <div className="flex flex-col gap-1 text-xs text-muted-foreground border-t border-border pt-3">
          <div className="flex items-center gap-2">
            <Clock className="h-3.5 w-3.5 text-primary/60" />
            <span>
              {formatDateTime(item.startTime, 'h:mm a')} – {formatDateTime(item.endTime, 'h:mm a, MMM d')}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Tv className="h-3.5 w-3.5 text-muted-foreground/60" />
            <span>Presented by {item.teacherName}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function LiveContent() {
  const { teacherId } = useParams()

  const { data: liveItems, isLoading, error, refetch, dataUpdatedAt } = useQuery({
    queryKey: [QUERY_KEYS.LIVE_CONTENT, teacherId],
    queryFn: () => contentService.getLiveContent(teacherId ?? 'teacher-001'),
    // Poll every 10s so approvals appear quickly (localStorage is synced on each call)
    refetchInterval: 10_000,
    refetchIntervalInBackground: true,
    // Never serve stale data on this page — always re-run the query
    staleTime: 0,
    gcTime: 0,
  })

  const lastUpdated = dataUpdatedAt
    ? new Date(dataUpdatedAt).toLocaleTimeString()
    : null

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 bg-card/80 backdrop-blur-sm">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary shadow-lg shadow-primary/30">
              <Zap className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-foreground">EduCast Live</h1>
              <p className="text-xs text-muted-foreground">Public Broadcast Channel</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {lastUpdated && (
              <p className="text-xs text-muted-foreground hidden sm:block">
                Updated at {lastUpdated}
              </p>
            )}
            <button
              onClick={() => refetch()}
              className="btn-ghost p-2"
              type="button"
              aria-label="Refresh content"
              title="Refresh"
            >
              <RefreshCw className="h-4 w-4" />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8">
        {/* Polling indicator */}
        <div className="flex items-center gap-2 mb-6 flex-wrap">
          <div className="flex items-center gap-1.5 bg-green-500/10 border border-green-500/20 rounded-full px-3 py-1.5">
            <Radio className="h-3.5 w-3.5 text-green-400 animate-pulse" />
            <span className="text-xs font-medium text-green-400">
              Live — auto-refreshes every 10 seconds
            </span>
          </div>
          <p className="text-xs text-muted-foreground">
            Approved content appears here once its broadcast window is active.
          </p>
        </div>

        {error ? (
          <ErrorState
            message="Failed to load live content. Please check your connection."
            onRetry={refetch}
          />
        ) : isLoading ? (
          <div className="flex h-64 items-center justify-center">
            <div className="text-center space-y-3">
              <div className="flex justify-center">
                <div className="h-10 w-10 rounded-full border-2 border-primary/30 border-t-primary animate-spin" />
              </div>
              <p className="text-sm text-muted-foreground">Loading live content...</p>
            </div>
          </div>
        ) : !liveItems?.length ? (
          <EmptyState
            icon={Radio}
            title="No content currently airing"
            description="There is no active content scheduled for broadcast at this time. Check back later."
          />
        ) : (
          <div>
            <h2 className="text-lg font-semibold text-foreground mb-5">
              Currently On Air ({liveItems.length} item{liveItems.length !== 1 ? 's' : ''})
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {liveItems.map((item, i) => (
                <LiveContentItem key={item.id} item={item} index={i} />
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
