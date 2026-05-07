import { cn } from '../../utils/helpers'

export function Loader({ className, size = 'md', label = 'Loading...' }) {
  const sizes = {
    sm: 'h-4 w-4 border-2',
    md: 'h-8 w-8 border-2',
    lg: 'h-12 w-12 border-3',
    xl: 'h-16 w-16 border-4',
  }

  return (
    <div className={cn('flex flex-col items-center justify-center gap-3', className)}>
      <div
        className={cn(
          'rounded-full border-primary/30 border-t-primary animate-spin',
          sizes[size]
        )}
        role="status"
        aria-label={label}
      />
      {label && <p className="text-sm text-muted-foreground animate-pulse">{label}</p>}
    </div>
  )
}

export function PageLoader() {
  return (
    <div className="flex h-[60vh] w-full items-center justify-center">
      <Loader size="lg" label="Loading content..." />
    </div>
  )
}

export function SkeletonCard() {
  return (
    <div className="glass rounded-xl p-5 space-y-3 animate-pulse">
      <div className="h-4 w-3/4 shimmer rounded" />
      <div className="h-3 w-1/2 shimmer rounded" />
      <div className="h-32 shimmer rounded-lg" />
      <div className="flex gap-2">
        <div className="h-6 w-20 shimmer rounded-full" />
        <div className="h-6 w-16 shimmer rounded-full" />
      </div>
    </div>
  )
}

export function SkeletonTable({ rows = 5 }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex gap-4 items-center p-4 glass rounded-lg animate-pulse">
          <div className="h-10 w-10 shimmer rounded-lg flex-shrink-0" />
          <div className="flex-1 space-y-2">
            <div className="h-3 w-1/3 shimmer rounded" />
            <div className="h-3 w-1/4 shimmer rounded" />
          </div>
          <div className="h-6 w-20 shimmer rounded-full" />
        </div>
      ))}
    </div>
  )
}

export function SkeletonStatCard() {
  return (
    <div className="stat-card animate-pulse space-y-3">
      <div className="flex justify-between">
        <div className="h-4 w-24 shimmer rounded" />
        <div className="h-8 w-8 shimmer rounded-lg" />
      </div>
      <div className="h-8 w-16 shimmer rounded" />
      <div className="h-3 w-32 shimmer rounded" />
    </div>
  )
}
