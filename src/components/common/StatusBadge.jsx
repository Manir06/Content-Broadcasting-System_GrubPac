import { memo } from 'react'
import { CONTENT_STATUS } from '../../utils/constants'
import { cn } from '../../utils/helpers'

const STATUS_CONFIG = {
  [CONTENT_STATUS.PENDING]: {
    label: 'Pending',
    className: 'badge-pending',
    dot: 'bg-yellow-400',
  },
  [CONTENT_STATUS.APPROVED]: {
    label: 'Approved',
    className: 'badge-approved',
    dot: 'bg-green-400',
  },
  [CONTENT_STATUS.REJECTED]: {
    label: 'Rejected',
    className: 'badge-rejected',
    dot: 'bg-red-400',
  },
  [CONTENT_STATUS.ACTIVE]: {
    label: 'Active',
    className: 'badge-active',
    dot: 'bg-blue-400 animate-pulse',
  },
  [CONTENT_STATUS.SCHEDULED]: {
    label: 'Scheduled',
    className: 'badge-scheduled',
    dot: 'bg-violet-400',
  },
  [CONTENT_STATUS.EXPIRED]: {
    label: 'Expired',
    className: 'badge-expired',
    dot: 'bg-muted-foreground',
  },
}

export const StatusBadge = memo(function StatusBadge({ status, className }) {
  const config = STATUS_CONFIG[status] ?? {
    label: status ?? 'Unknown',
    className: 'badge-expired',
    dot: 'bg-muted-foreground',
  }

  return (
    <span className={cn(config.className, className)}>
      <span className={cn('h-1.5 w-1.5 rounded-full flex-shrink-0', config.dot)} />
      {config.label}
    </span>
  )
})
