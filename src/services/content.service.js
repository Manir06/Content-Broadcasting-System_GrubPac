import { mockAllContent } from '../mock/mockData'
import { generateId } from '../utils/helpers'

const STORAGE_KEY = 'educast_content_store'
const STORE_VERSION = 'v1'

// Sample images used when a real file can't be persisted cross-tab
const SAMPLE_IMAGES = [
  'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=600&q=80',
  'https://images.unsplash.com/photo-1587620962725-abab7fe55159?w=600&q=80',
  'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=600&q=80',
  'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=600&q=80',
  'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&q=80',
  'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&q=80',
  'https://images.unsplash.com/photo-1574169208507-84376144848b?w=600&q=80',
  'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=600&q=80',
]

function randomSampleImage() {
  return SAMPLE_IMAGES[Math.floor(Math.random() * SAMPLE_IMAGES.length)]
}

// ─── Persistence helpers ───────────────────────────────────────────────────

function loadStore() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const { version, data } = JSON.parse(raw)
      if (version === STORE_VERSION && Array.isArray(data) && data.length > 0) {
        return data
      }
    }
  } catch {
    // ignore parse errors — fall through to defaults
  }
  // First load: seed with mock data and persist it
  const initial = [...mockAllContent]
  saveStore(initial)
  return initial
}

function saveStore(store) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ version: STORE_VERSION, data: store }))
  } catch {
    // storage quota exceeded or unavailable — degrade silently
  }
}

// ─── Shared in-memory + localStorage store ────────────────────────────────

let contentStore = loadStore()

// Listen for mutations made in OTHER tabs and sync this tab's store
window.addEventListener('storage', (e) => {
  if (e.key === STORAGE_KEY) {
    contentStore = loadStore()
  }
})

// ─── Internal helpers ─────────────────────────────────────────────────────

const delay = (ms = 800) => new Promise((resolve) => setTimeout(resolve, ms))

/**
 * Find an item by ID and apply updates, then persist.
 * Returns the updated item or null if not found.
 */
function patchItem(id, updates) {
  const idx = contentStore.findIndex((c) => c.id === id)
  if (idx === -1) return null
  contentStore[idx] = { ...contentStore[idx], ...updates }
  saveStore(contentStore)
  return contentStore[idx]
}

// ─── Service ──────────────────────────────────────────────────────────────

export const contentService = {
  /**
   * Get content uploaded by a specific teacher
   */
  async getTeacherContent(teacherId) {
    await delay()
    contentStore = loadStore() // always read fresh from storage
    return contentStore
      .filter((c) => c.teacherId === teacherId)
      .sort((a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt))
  },

  /**
   * Get teacher stats
   */
  async getTeacherStats(teacherId) {
    await delay(500)
    contentStore = loadStore()
    const items = contentStore.filter((c) => c.teacherId === teacherId)
    return {
      total: items.length,
      pending: items.filter((c) => c.status === 'pending').length,
      approved: items.filter((c) => c.status === 'approved').length,
      rejected: items.filter((c) => c.status === 'rejected').length,
    }
  },

  /**
   * Upload new content.
   * Blob URLs (from URL.createObjectURL) are replaced with a persistent
   * sample image so the URL works in any tab.
   */
  async uploadContent(payload) {
    await delay(1500)

    if (Math.random() < 0.05) {
      throw new Error('Upload failed due to server error. Please try again.')
    }

    // Blob URLs only live in the creating tab — swap for a persistent URL
    const fileUrl =
      payload.fileUrl && !payload.fileUrl.startsWith('blob:')
        ? payload.fileUrl
        : randomSampleImage()

    const newItem = {
      id: generateId(),
      ...payload,
      fileUrl,
      status: 'pending',
      uploadedAt: new Date().toISOString(),
      approvedAt: null,
      approvedBy: null,
      rejectionReason: null,
    }

    contentStore = [newItem, ...contentStore]
    saveStore(contentStore)
    return newItem
  },

  /**
   * Approve a content item (used by approvalService).
   */
  async approveContentById(contentId, approverName = 'Dr. Michael Chen') {
    await delay(700)
    contentStore = loadStore()

    const updated = patchItem(contentId, {
      status: 'approved',
      approvedAt: new Date().toISOString(),
      approvedBy: approverName,
      rejectionReason: null,
    })

    if (!updated) throw new Error(`Content item not found: ${contentId}`)
    return { ...updated }
  },

  /**
   * Reject a content item (used by approvalService).
   */
  async rejectContentById(contentId, reason) {
    await delay(700)
    if (!reason?.trim()) throw new Error('Rejection reason is required.')

    contentStore = loadStore()

    const updated = patchItem(contentId, {
      status: 'rejected',
      rejectionReason: reason.trim(),
      approvedAt: null,
      approvedBy: null,
    })

    if (!updated) throw new Error(`Content item not found: ${contentId}`)
    return { ...updated }
  },

  /**
   * Get all content (for principal view) with optional filters + pagination.
   */
  async getAllContent({ status, search, page = 1, pageSize = 10 } = {}) {
    await delay()
    contentStore = loadStore()

    let results = [...contentStore]

    if (status && status !== 'all') {
      results = results.filter((c) => c.status === status)
    }

    if (search) {
      const q = search.toLowerCase()
      results = results.filter(
        (c) =>
          c.title?.toLowerCase().includes(q) ||
          c.subject?.toLowerCase().includes(q) ||
          c.teacherName?.toLowerCase().includes(q)
      )
    }

    results.sort((a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt))

    const total = results.length
    const totalPages = Math.ceil(total / pageSize)
    const start = (page - 1) * pageSize
    const data = results.slice(start, start + pageSize)

    return { data, total, page, pageSize, totalPages }
  },

  /**
   * Get currently live/active content for a teacher's public page.
   * Always reads from localStorage so it reflects approvals from any tab.
   */
  async getLiveContent(teacherId) {
    await delay(600)
    contentStore = loadStore() // always sync from storage

    const now = new Date()
    return contentStore.filter((c) => {
      if (c.teacherId !== teacherId) return false
      if (c.status !== 'approved') return false
      const start = new Date(c.startTime)
      const end = new Date(c.endTime)
      return now >= start && now <= end
    })
  },

  /**
   * Get principal stats.
   */
  async getPrincipalStats() {
    await delay(500)
    contentStore = loadStore()
    return {
      total: contentStore.length,
      pending: contentStore.filter((c) => c.status === 'pending').length,
      approved: contentStore.filter((c) => c.status === 'approved').length,
      rejected: contentStore.filter((c) => c.status === 'rejected').length,
    }
  },

  /**
   * Get recent uploads for the principal dashboard.
   */
  async getRecentUploads(limit = 10) {
    await delay(600)
    contentStore = loadStore()
    return [...contentStore]
      .sort((a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt))
      .slice(0, limit)
  },

  /**
   * Utility: reset the store back to the initial mock state (dev/test helper).
   */
  resetStore() {
    localStorage.removeItem(STORAGE_KEY)
    contentStore = loadStore()
  },
}
