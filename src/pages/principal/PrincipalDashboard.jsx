import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import {
  BookOpen,
  CheckCircle2,
  Clock,
  ExternalLink,
  Radio,
  XCircle,
} from 'lucide-react'
import { contentService } from '../../services/content.service'
import { QUERY_KEYS } from '../../utils/constants'
import { StatsCard } from '../../components/dashboard/StatsCard'
import { ContentTable } from '../../components/content/ContentTable'
import { ErrorState } from '../../components/common/ErrorState'
import { EmptyState } from '../../components/common/EmptyState'

export default function PrincipalDashboard() {
  const { data: stats, isLoading: statsLoading, error: statsError, refetch: refetchStats } = useQuery({
    queryKey: [QUERY_KEYS.PRINCIPAL_STATS],
    queryFn: () => contentService.getPrincipalStats(),
  })

  const {
    data: recentData,
    isLoading: recentLoading,
    error: recentError,
    refetch: refetchRecent,
  } = useQuery({
    queryKey: ['recent-uploads'],
    queryFn: () => contentService.getRecentUploads(8),
  })

  const statCards = [
    {
      title: 'Total Content',
      value: stats?.total ?? 0,
      icon: BookOpen,
      iconColor: 'text-primary',
      iconBg: 'bg-primary/15',
      description: 'institution-wide',
    },
    {
      title: 'Pending Review',
      value: stats?.pending ?? 0,
      icon: Clock,
      iconColor: 'text-yellow-400',
      iconBg: 'bg-yellow-400/15',
      description: 'needs action',
    },
    {
      title: 'Approved',
      value: stats?.approved ?? 0,
      icon: CheckCircle2,
      iconColor: 'text-green-400',
      iconBg: 'bg-green-400/15',
      description: 'broadcasting',
    },
    {
      title: 'Rejected',
      value: stats?.rejected ?? 0,
      icon: XCircle,
      iconColor: 'text-red-400',
      iconBg: 'bg-red-400/15',
      description: 'returned to teacher',
    },
  ]

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Principal Dashboard</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Institution-wide content management overview.
          </p>
        </div>
        <Link
          to="/principal/approvals"
          className="btn-primary relative"
          id="principal-approvals-shortcut"
        >
          <Clock className="h-4 w-4" />
          Review Pending
          {stats?.pending > 0 && (
            <span className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-yellow-400 text-[10px] font-bold text-black">
              {stats.pending > 99 ? '99+' : stats.pending}
            </span>
          )}
        </Link>
      </div>

      {/* Stats */}
      {statsError ? (
        <ErrorState message={statsError.message} onRetry={refetchStats} />
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {statCards.map((card) => (
            <StatsCard key={card.title} {...card} isLoading={statsLoading} />
          ))}
        </div>
      )}

      {/* Live Page Quick Access */}
      <div
        className="flex items-center justify-between gap-4 rounded-xl p-4 flex-wrap"
        style={{
          background: 'linear-gradient(135deg, rgba(239,68,68,0.10) 0%, rgba(239,68,68,0.04) 100%)',
          border: '1px solid rgba(239,68,68,0.18)',
        }}
      >
        <div className="flex items-center gap-3">
          <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-red-500/15 flex-shrink-0">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-xl bg-red-400 opacity-15" />
            <Radio className="relative h-5 w-5 text-red-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-foreground">Student Live View</span>
              <span className="flex items-center gap-1 rounded-full bg-red-500/20 px-2 py-0.5 text-[10px] font-bold text-red-400 border border-red-500/20">
                <span className="h-1.5 w-1.5 rounded-full bg-red-400 animate-pulse" />
                PUBLIC
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              Public broadcast page — viewable by students without login.
            </p>
          </div>
        </div>
        <a
          href="/live/teacher-001"
          target="_blank"
          rel="noopener noreferrer"
          id="principal-live-btn"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500/15 border border-red-500/25 text-red-400 hover:bg-red-500/25 transition-colors text-sm font-semibold flex-shrink-0"
        >
          <ExternalLink className="h-4 w-4" />
          Preview Live Page
        </a>
      </div>

      {/* Recent Uploads Table */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold text-foreground">Recent Submissions</h2>
          <Link to="/principal/all-content" className="btn-ghost text-xs px-3 py-1.5">
            View all
          </Link>
        </div>

        {recentError ? (
          <ErrorState message={recentError.message} onRetry={refetchRecent} />
        ) : recentLoading ? (
          <div className="glass rounded-xl p-8 text-center">
            <div className="flex justify-center">
              <div className="h-6 w-6 rounded-full border-2 border-primary/30 border-t-primary animate-spin" />
            </div>
          </div>
        ) : !recentData?.length ? (
          <EmptyState title="No submissions yet" description="No content has been submitted by teachers." />
        ) : (
          <ContentTable items={recentData} showTeacher />
        )}
      </div>
    </div>
  )
}
