import { format, formatDistance, formatRelative, isValid } from 'date-fns'

/**
 * Format a date string to a human-readable format
 */
export function formatDate(date, fmt = 'MMM d, yyyy') {
  if (!date) return '—'
  const d = new Date(date)
  if (!isValid(d)) return '—'
  return format(d, fmt)
}

/**
 * Format a date to include time
 */
export function formatDateTime(date, fmt = 'MMM d, yyyy h:mm a') {
  if (!date) return '—'
  const d = new Date(date)
  if (!isValid(d)) return '—'
  return format(d, fmt)
}

/**
 * Format a date to a relative time (e.g. "2 hours ago")
 */
export function formatRelativeTime(date) {
  if (!date) return '—'
  const d = new Date(date)
  if (!isValid(d)) return '—'
  return formatDistance(d, new Date(), { addSuffix: true })
}

/**
 * Format for datetime-local input value
 */
export function toInputDateTime(date) {
  if (!date) return ''
  const d = new Date(date)
  if (!isValid(d)) return ''
  return format(d, "yyyy-MM-dd'T'HH:mm")
}
