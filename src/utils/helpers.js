import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Merge Tailwind classes safely
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

/**
 * Get subject label from value
 */
export function getSubjectLabel(value, subjects) {
  return subjects?.find((s) => s.value === value)?.label ?? value ?? '—'
}

/**
 * Truncate text to a given length
 */
export function truncate(text, maxLen = 60) {
  if (!text) return '—'
  return text.length > maxLen ? `${text.slice(0, maxLen)}...` : text
}

/**
 * Get initials from a full name
 */
export function getInitials(name = '') {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

/**
 * File size formatter
 */
export function formatFileSize(bytes) {
  if (!bytes) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`
}

/**
 * Build query string from an object
 */
export function buildQueryString(params) {
  return Object.entries(params)
    .filter(([, v]) => v !== undefined && v !== '' && v !== null)
    .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
    .join('&')
}

/**
 * Safely access nested object properties
 */
export function safeGet(obj, path, fallback = null) {
  return path.split('.').reduce((acc, key) => acc?.[key], obj) ?? fallback
}

/**
 * Generate a random ID
 */
export function generateId() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36)
}

/**
 * Determine if content is currently active
 */
export function isContentActive(startTime, endTime) {
  const now = new Date()
  const start = new Date(startTime)
  const end = new Date(endTime)
  return now >= start && now <= end
}

/**
 * Determine content runtime status
 */
export function getRuntimeStatus(item) {
  const now = new Date()
  const start = new Date(item.startTime)
  const end = new Date(item.endTime)

  if (item.status === 'pending') return 'pending'
  if (item.status === 'rejected') return 'rejected'
  if (item.status !== 'approved') return item.status

  if (now < start) return 'scheduled'
  if (now > end) return 'expired'
  return 'active'
}
