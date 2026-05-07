import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import {
  CheckCircle2,
  Clock,
  ExternalLink,
  FileText,
  Radio,
  Upload,
  XCircle,
} from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'
import { contentService } from '../../services/content.service'
import { QUERY_KEYS } from '../../utils/constants'
import { StatsCard } from '../../components/dashboard/StatsCard'
import { ContentTable } from '../../components/content/ContentTable'
import { ErrorState } from '../../components/common/ErrorState'
import { EmptyState } from '../../components/common/EmptyState'
import { formatRelativeTime } from '../../utils/formatDate'

export default function TeacherDashboard() {
  const { user } = useAuth()

  const {
    data: stats,
    isLoading: statsLoading,
    error: statsError,
    refetch: refetchStats,
  } = useQuery({
    queryKey: [QUERY_KEYS.TEACHER_STATS, user?.id],
    queryFn: () => contentService.getTeacherStats(user?.id),
    enabled: !!user?.id,
  })

  const {
    data: recentContent,
    isLoading: contentLoading,
    error: contentError,
    refetch: refetchContent,
  } = useQuery({
    queryKey: [QUERY_KEYS.TEACHER_CONTENT, user?.id],
    queryFn: () => contentService.getTeacherContent(user?.id),
    enabled: !!user?.id,
    select: (data) => data.slice(0, 5),
  })

  const statCards = [
    {
      title: 'Total Uploaded',
      value: stats?.total ?? 0,
      icon: FileText,
      iconColor: 'text-primary',
      iconBg: 'bg-primary/15',
      description: 'all time',
    },
    {
      title: 'Pending Review',
      value: stats?.pending ?? 0,
      icon: Clock,
      iconColor: 'text-yellow-400',
      iconBg: 'bg-yellow-400/15',
      description: 'awaiting approval',
    },
    {
      title: 'Approved',
      value: stats?.approved ?? 0,
      icon: CheckCircle2,
      iconColor: 'text-green-400',
      iconBg: 'bg-green-400/15',
      description: 'published content',
    },
    {
      title: 'Rejected',
      value: stats?.rejected ?? 0,
      icon: XCircle,
      iconColor: 'text-red-400',
      iconBg: 'bg-red-400/15',
      description: 'needs revision',
    },
  ]

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Good {getGreeting()}, {user?.name?.split(' ')[0]}
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Here's a summary of your broadcasting activity.
          </p>
        </div>
        <Link to="/teacher/upload" className="btn-primary" id="dashboard-upload-btn">
          <Upload className="h-4 w-4" />
          Upload Content
        </Link>
      </div>

      {/* Live Broadcast Banner */}
      <div
        className="flex items-center justify-between gap-4 rounded-xl p-4 flex-wrap"
        style={{
          background: 'linear-gradient(135deg, rgba(239,68,68,0.12) 0%, rgba(239,68,68,0.05) 100%)',
          border: '1px solid rgba(239,68,68,0.2)',
        }}
      >
        <div className="flex items-center gap-3">
          <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-red-500/20 flex-shrink-0">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-xl bg-red-400 opacity-20" />
            <Radio className="relative h-5 w-5 text-red-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-foreground">Live Broadcast Channel</span>
              <span className="flex items-center gap-1 rounded-full bg-red-500/20 px-2 py-0.5 text-[10px] font-bold text-red-400 border border-red-500/20">
                <span className="h-1.5 w-1.5 rounded-full bg-red-400 animate-pulse" />
                LIVE
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              Your public page — no login needed. Share this with students.
            </p>
          </div>
        </div>
        <a
          href={`/live/${user?.id}`}
          target="_blank"
          rel="noopener noreferrer"
          id="dashboard-live-btn"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500/15 border border-red-500/25 text-red-400 hover:bg-red-500/25 transition-colors text-sm font-semibold flex-shrink-0"
        >
          <ExternalLink className="h-4 w-4" />
          Open Live Page
        </a>
      </div>

      {/* Stats Grid */}
      {statsError ? (
        <ErrorState message={statsError.message} onRetry={refetchStats} />
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {statCards.map((card) => (
            <StatsCard key={card.title} {...card} isLoading={statsLoading} />
          ))}
        </div>
      )}

      {/* Recent Content */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold text-foreground">Recent Uploads</h2>
          <Link to="/teacher/my-content" className="btn-ghost text-xs px-3 py-1.5">
            View all
          </Link>
        </div>

        {contentError ? (
          <ErrorState message={contentError.message} onRetry={refetchContent} />
        ) : contentLoading ? (
          <div className="glass rounded-xl p-8 text-center">
            <div className="flex justify-center">
              <div className="h-6 w-6 rounded-full border-2 border-primary/30 border-t-primary animate-spin" />
            </div>
          </div>
        ) : !recentContent?.length ? (
          <EmptyState
            title="No content yet"
            description="Start broadcasting by uploading your first content item."
            action={
              <Link to="/teacher/upload" className="btn-primary" id="empty-upload-btn">
                <Upload className="h-4 w-4" />
                Upload your first content
              </Link>
            }
          />
        ) : (
          <ContentTable items={recentContent} />
        )}
      </div>
    </div>
  )
}

function getGreeting() {
  const h = new Date().getHours()
  if (h < 12) return 'morning'
  if (h < 17) return 'afternoon'
  return 'evening'
}
