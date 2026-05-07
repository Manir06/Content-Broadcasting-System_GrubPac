import { contentService } from './content.service'

const delay = (ms = 800) => new Promise((resolve) => setTimeout(resolve, ms))

export const approvalService = {
  /**
   * Get all pending content items.
   */
  async getPendingContent() {
    await delay()
    const result = await contentService.getAllContent({ status: 'pending', pageSize: 9999 })
    return result.data
  },

  /**
   * Approve a content item.
   * Delegates directly to contentService which writes through to localStorage,
   * making the approval immediately visible in all tabs including the public live page.
   */
  async approveContent(contentId, approverName = 'Dr. Michael Chen') {
    return contentService.approveContentById(contentId, approverName)
  },

  /**
   * Reject a content item with a reason.
   */
  async rejectContent(contentId, reason) {
    if (!reason?.trim()) {
      throw new Error('Rejection reason is required.')
    }
    return contentService.rejectContentById(contentId, reason)
  },
}
