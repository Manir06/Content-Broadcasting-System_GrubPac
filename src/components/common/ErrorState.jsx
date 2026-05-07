import { AlertTriangle, RefreshCw } from 'lucide-react'

export function ErrorState({
  title = 'Something went wrong',
  message = 'An unexpected error occurred. Please try again.',
  onRetry = null,
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-destructive/10 border border-destructive/20 mb-4">
        <AlertTriangle className="h-8 w-8 text-destructive/80" />
      </div>
      <h3 className="text-lg font-semibold text-foreground mb-1">{title}</h3>
      <p className="text-sm text-muted-foreground max-w-sm mb-6">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="btn-secondary gap-2"
          type="button"
        >
          <RefreshCw className="h-4 w-4" />
          Try again
        </button>
      )}
    </div>
  )
}
