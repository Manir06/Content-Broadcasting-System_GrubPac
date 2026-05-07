import { memo } from 'react'
import { cn } from '../../utils/helpers'

export const StatsCard = memo(function StatsCard({
  title,
  value,
  icon: Icon,
  iconColor = 'text-primary',
  iconBg = 'bg-primary/10',
  trend = null,
  description = null,
  isLoading = false,
}) {
  if (isLoading) {
    return (
      <div className="stat-card animate-pulse space-y-3">
        <div className="flex justify-between">
          <div className="h-4 w-24 shimmer rounded" />
          <div className="h-9 w-9 shimmer rounded-lg" />
        </div>
        <div className="h-8 w-16 shimmer rounded" />
        <div className="h-3 w-32 shimmer rounded" />
      </div>
    )
  }

  return (
    <div className="stat-card animate-fade-in">
      <div className="flex items-start justify-between mb-4">
        <p className="text-sm font-medium text-muted-foreground">{title}</p>
        <div className={cn('flex h-9 w-9 items-center justify-center rounded-lg', iconBg)}>
          <Icon className={cn('h-4 w-4', iconColor)} />
        </div>
      </div>

      <div className="mb-2">
        <p className="text-3xl font-bold text-foreground tabular-nums">
          {typeof value === 'number' ? value.toLocaleString() : value}
        </p>
      </div>

      {(trend !== null || description) && (
        <div className="flex items-center gap-1.5">
          {trend !== null && (
            <span
              className={cn(
                'text-xs font-medium',
                trend > 0 ? 'text-green-400' : trend < 0 ? 'text-red-400' : 'text-muted-foreground'
              )}
            >
              {trend > 0 ? `↑ ${trend}%` : trend < 0 ? `↓ ${Math.abs(trend)}%` : '— No change'}
            </span>
          )}
          {description && (
            <span className="text-xs text-muted-foreground">{description}</span>
          )}
        </div>
      )}
    </div>
  )
})
