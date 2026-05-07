import { memo, useMemo } from 'react'
import { formatDateTime, formatRelativeTime } from '../../utils/formatDate'
import { getSubjectLabel, getRuntimeStatus, truncate } from '../../utils/helpers'
import { SUBJECTS } from '../../utils/constants'
import { StatusBadge } from '../common/StatusBadge'
import { ChevronLeft, ChevronRight, ImageIcon } from 'lucide-react'
import { cn } from '../../utils/helpers'

export const ContentTable = memo(function ContentTable({
  items = [],
  actions = null,
  page = 1,
  totalPages = 1,
  onPageChange = null,
  showTeacher = false,
  isLoading = false,
}) {
  return (
    <div className="space-y-3">
      <div className="glass rounded-xl overflow-hidden">
        <div className="overflow-x-auto scrollbar-thin">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border/50">
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Content
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Subject
                </th>
                {showTeacher && (
                  <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Teacher
                  </th>
                )}
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden lg:table-cell">
                  Schedule
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden md:table-cell">
                  Uploaded
                </th>
                {actions && (
                  <th className="px-4 py-3 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Actions
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-border/30">
              {items.map((item) => {
                const runtimeStatus = getRuntimeStatus(item)
                return (
                  <tr
                    key={item.id}
                    className="hover:bg-secondary/30 transition-colors duration-150 group"
                  >
                    {/* Title + Preview */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-14 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                          {item.fileUrl ? (
                            <img
                              src={item.fileUrl}
                              alt={item.title}
                              className="h-full w-full object-cover"
                              loading="lazy"
                            />
                          ) : (
                            <div className="flex h-full items-center justify-center">
                              <ImageIcon className="h-4 w-4 text-muted-foreground/40" />
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-foreground text-sm leading-tight">
                            {truncate(item.title, 45)}
                          </p>
                          {item.rejectionReason && (
                            <p className="text-xs text-destructive/80 mt-0.5 line-clamp-1">
                              {truncate(item.rejectionReason, 40)}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Subject */}
                    <td className="px-4 py-3">
                      <span className="text-sm text-muted-foreground">
                        {getSubjectLabel(item.subject, SUBJECTS)}
                      </span>
                    </td>

                    {/* Teacher */}
                    {showTeacher && (
                      <td className="px-4 py-3">
                        <span className="text-sm text-muted-foreground">{item.teacherName ?? '—'}</span>
                      </td>
                    )}

                    {/* Status */}
                    <td className="px-4 py-3">
                      <StatusBadge status={runtimeStatus} />
                    </td>

                    {/* Schedule */}
                    <td className="px-4 py-3 hidden lg:table-cell">
                      <div className="text-xs text-muted-foreground space-y-0.5">
                        <p>From {formatDateTime(item.startTime, 'MMM d, HH:mm')}</p>
                        <p className="text-muted-foreground/60">To {formatDateTime(item.endTime, 'MMM d, HH:mm')}</p>
                      </div>
                    </td>

                    {/* Uploaded */}
                    <td className="px-4 py-3 hidden md:table-cell">
                      <span className="text-xs text-muted-foreground">
                        {formatRelativeTime(item.uploadedAt)}
                      </span>
                    </td>

                    {/* Actions */}
                    {actions && (
                      <td className="px-4 py-3 text-right">
                        {typeof actions === 'function' ? actions(item) : actions}
                      </td>
                    )}
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && onPageChange && (
        <div className="flex items-center justify-between px-1">
          <p className="text-xs text-muted-foreground">
            Page {page} of {totalPages}
          </p>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => onPageChange(page - 1)}
              disabled={page <= 1}
              className="btn-ghost p-2 disabled:opacity-40"
              type="button"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const pageNum = Math.max(1, Math.min(page - 2, totalPages - 4)) + i
              return (
                <button
                  key={pageNum}
                  onClick={() => onPageChange(pageNum)}
                  className={cn(
                    'h-8 w-8 rounded-lg text-xs font-medium transition-colors',
                    pageNum === page
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                  )}
                  type="button"
                >
                  {pageNum}
                </button>
              )
            })}
            <button
              onClick={() => onPageChange(page + 1)}
              disabled={page >= totalPages}
              className="btn-ghost p-2 disabled:opacity-40"
              type="button"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  )
})
