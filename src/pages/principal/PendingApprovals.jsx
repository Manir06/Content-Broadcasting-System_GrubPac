import { useState, useCallback } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Check, ChevronDown, ImageIcon, MessageSquare, X } from 'lucide-react'
import { toast } from 'sonner'
import { approvalService } from '../../services/approval.service'
import { QUERY_KEYS } from '../../utils/constants'
import { Modal } from '../../components/content/ApprovalModal'
import { StatusBadge } from '../../components/common/StatusBadge'
import { EmptyState } from '../../components/common/EmptyState'
import { ErrorState } from '../../components/common/ErrorState'
import { SkeletonCard } from '../../components/common/Loader'
import { formatRelativeTime } from '../../utils/formatDate'
import { getSubjectLabel } from '../../utils/helpers'
import { SUBJECTS } from '../../utils/constants'

function ApprovalCard({ item, onApprove, onReject, isPending }) {
  const [imgError, setImgError] = useState(false)
  const [expanded, setExpanded] = useState(false)

  return (
    <div className="content-card animate-fade-in">
      {/* Image */}
      <div className="relative h-44 bg-muted overflow-hidden">
        {item.fileUrl && !imgError ? (
          <img
            src={item.fileUrl}
            alt={item.title}
            className="h-full w-full object-cover"
            onError={() => setImgError(true)}
            loading="lazy"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-secondary">
            <ImageIcon className="h-10 w-10 text-muted-foreground/40" />
          </div>
        )}
        <div className="absolute top-2 right-2">
          <StatusBadge status="pending" />
        </div>
      </div>

      <div className="p-4 space-y-3">
        <div>
          <h3 className="font-semibold text-foreground text-sm line-clamp-2 leading-snug">
            {item.title}
          </h3>
          <p className="text-xs text-primary mt-0.5 font-medium">
            {getSubjectLabel(item.subject, SUBJECTS)}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
          <span>By <strong className="text-foreground">{item.teacherName}</strong></span>
          <span>·</span>
          <span>{formatRelativeTime(item.uploadedAt)}</span>
        </div>

        {item.description && (
          <div>
            <p className={`text-xs text-muted-foreground ${expanded ? '' : 'line-clamp-2'}`}>
              {item.description}
            </p>
            {item.description.length > 80 && (
              <button
                type="button"
                onClick={() => setExpanded((v) => !v)}
                className="text-xs text-primary mt-1 flex items-center gap-1"
              >
                {expanded ? 'Show less' : 'Read more'}
                <ChevronDown className={`h-3 w-3 transition-transform ${expanded ? 'rotate-180' : ''}`} />
              </button>
            )}
          </div>
        )}

        <div className="flex gap-2 pt-1">
          <button
            type="button"
            onClick={() => onApprove(item)}
            disabled={isPending}
            id={`approve-btn-${item.id}`}
            className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-green-500/15 text-green-400 border border-green-500/20 hover:bg-green-500/25 transition-colors text-xs font-semibold disabled:opacity-50"
          >
            <Check className="h-3.5 w-3.5" />
            Approve
          </button>
          <button
            type="button"
            onClick={() => onReject(item)}
            disabled={isPending}
            id={`reject-btn-${item.id}`}
            className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-destructive/10 text-red-400 border border-destructive/20 hover:bg-destructive/20 transition-colors text-xs font-semibold disabled:opacity-50"
          >
            <X className="h-3.5 w-3.5" />
            Reject
          </button>
        </div>
      </div>
    </div>
  )
}

export default function PendingApprovals() {
  const queryClient = useQueryClient()
  const [rejectTarget, setRejectTarget] = useState(null)
  const [rejectReason, setRejectReason] = useState('')
  const [reasonError, setReasonError] = useState('')

  const { data: pending, isLoading, error, refetch } = useQuery({
    queryKey: [QUERY_KEYS.PENDING_CONTENT],
    queryFn: () => approvalService.getPendingContent(),
    refetchOnWindowFocus: true,
  })

  const approveMutation = useMutation({
    mutationFn: (item) => approvalService.approveContent(item.id),
    onSuccess: () => {
      toast.success('Content approved and scheduled for broadcasting.')
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.PENDING_CONTENT] })
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.PRINCIPAL_STATS] })
    },
    onError: (err) => toast.error(err?.message ?? 'Approval failed.'),
  })

  const rejectMutation = useMutation({
    mutationFn: ({ id, reason }) => approvalService.rejectContent(id, reason),
    onSuccess: () => {
      toast.success('Content rejected. Teacher will be notified.')
      setRejectTarget(null)
      setRejectReason('')
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.PENDING_CONTENT] })
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.PRINCIPAL_STATS] })
    },
    onError: (err) => toast.error(err?.message ?? 'Rejection failed.'),
  })

  const handleApprove = useCallback(
    (item) => approveMutation.mutate(item),
    [approveMutation]
  )

  const handleRejectOpen = useCallback((item) => {
    setRejectTarget(item)
    setRejectReason('')
    setReasonError('')
  }, [])

  const handleRejectSubmit = useCallback(() => {
    if (!rejectReason.trim()) {
      setReasonError('Please provide a reason for rejection.')
      return
    }
    rejectMutation.mutate({ id: rejectTarget.id, reason: rejectReason.trim() })
  }, [rejectReason, rejectTarget, rejectMutation])

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Pending Approvals</h1>
        <p className="text-muted-foreground text-sm mt-1">
          {pending?.length ?? 0} item{pending?.length !== 1 ? 's' : ''} awaiting your review.
        </p>
      </div>

      {/* Content */}
      {error ? (
        <ErrorState message={error.message} onRetry={refetch} />
      ) : isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : !pending?.length ? (
        <EmptyState
          title="All caught up!"
          description="There are no content items pending your review at the moment."
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {pending.map((item) => (
            <ApprovalCard
              key={item.id}
              item={item}
              onApprove={handleApprove}
              onReject={handleRejectOpen}
              isPending={approveMutation.isPending || rejectMutation.isPending}
            />
          ))}
        </div>
      )}

      {/* Rejection Modal */}
      <Modal
        isOpen={!!rejectTarget}
        onClose={() => setRejectTarget(null)}
        title="Reject Content"
        description={`Provide a reason for rejecting "${rejectTarget?.title ?? ''}"`}
        size="md"
        footer={
          <>
            <button
              type="button"
              onClick={() => setRejectTarget(null)}
              className="btn-ghost"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleRejectSubmit}
              disabled={rejectMutation.isPending}
              className="btn-destructive"
              id="confirm-reject-btn"
            >
              {rejectMutation.isPending ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 rounded-full border-2 border-red-400/30 border-t-red-400 animate-spin" />
                  Rejecting...
                </span>
              ) : (
                <>
                  <X className="h-4 w-4" />
                  Confirm Rejection
                </>
              )}
            </button>
          </>
        }
      >
        <div className="space-y-3">
          <label htmlFor="rejection-reason" className="text-sm font-medium text-foreground">
            Rejection Reason <span className="text-destructive">*</span>
          </label>
          <div className="relative">
            <MessageSquare className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <textarea
              id="rejection-reason"
              rows={4}
              placeholder="e.g. Content does not align with curriculum. Please revise and resubmit..."
              value={rejectReason}
              onChange={(e) => {
                setRejectReason(e.target.value)
                if (e.target.value.trim()) setReasonError('')
              }}
              className="input-field pl-9 resize-none"
            />
          </div>
          {reasonError && (
            <p className="text-xs text-destructive">{reasonError}</p>
          )}
        </div>
      </Modal>
    </div>
  )
}
