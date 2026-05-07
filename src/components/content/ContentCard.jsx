import { memo, useState } from 'react'
import { formatDateTime, formatRelativeTime } from '../../utils/formatDate'
import { getSubjectLabel, getRuntimeStatus, truncate, formatFileSize } from '../../utils/helpers'
import { SUBJECTS } from '../../utils/constants'
import { StatusBadge } from '../common/StatusBadge'
import { Calendar, Clock, Eye, ImageIcon } from 'lucide-react'

export const ContentCard = memo(function ContentCard({
  item,
  actions = null,
  showTeacher = false,
}) {
  const [imgError, setImgError] = useState(false)
  const runtimeStatus = getRuntimeStatus(item)

  return (
    <div className="content-card animate-fade-in">
      {/* Image Preview */}
      <div className="relative h-44 bg-muted overflow-hidden">
        {item.fileUrl && !imgError ? (
          <img
            src={item.fileUrl}
            alt={item.title}
            className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
            onError={() => setImgError(true)}
            loading="lazy"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-secondary">
            <ImageIcon className="h-12 w-12 text-muted-foreground/40" />
          </div>
        )}
        <div className="absolute top-2.5 right-2.5">
          <StatusBadge status={runtimeStatus} />
        </div>
        {item.rotationDuration && (
          <div className="absolute bottom-2.5 left-2.5 flex items-center gap-1 bg-black/60 backdrop-blur-sm rounded-md px-2 py-1 text-xs text-white">
            <Clock className="h-3 w-3" />
            {item.rotationDuration}s
          </div>
        )}
      </div>

      {/* Content Body */}
      <div className="p-4 space-y-3">
        <div>
          <h3 className="font-semibold text-foreground text-sm leading-snug line-clamp-2">
            {item.title}
          </h3>
          <p className="text-xs text-primary mt-0.5 font-medium">
            {getSubjectLabel(item.subject, SUBJECTS)}
          </p>
        </div>

        {showTeacher && (
          <p className="text-xs text-muted-foreground">
            By <span className="font-medium text-foreground">{item.teacherName}</span>
          </p>
        )}

        {item.description && (
          <p className="text-xs text-muted-foreground line-clamp-2">{item.description}</p>
        )}

        <div className="flex flex-col gap-1.5 text-xs text-muted-foreground border-t border-border pt-3">
          <div className="flex items-center gap-1.5">
            <Calendar className="h-3 w-3 text-primary/60" />
            <span>Start: {formatDateTime(item.startTime, 'MMM d, yyyy HH:mm')}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Calendar className="h-3 w-3 text-muted-foreground/60" />
            <span>End: {formatDateTime(item.endTime, 'MMM d, yyyy HH:mm')}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Eye className="h-3 w-3 text-muted-foreground/60" />
            <span>Uploaded {formatRelativeTime(item.uploadedAt)}</span>
          </div>
        </div>

        {item.rejectionReason && (
          <div className="rounded-lg bg-destructive/10 border border-destructive/20 p-2.5">
            <p className="text-xs font-medium text-destructive mb-0.5">Rejection reason:</p>
            <p className="text-xs text-muted-foreground">{item.rejectionReason}</p>
          </div>
        )}

        {actions && <div className="pt-1">{actions}</div>}
      </div>
    </div>
  )
})
