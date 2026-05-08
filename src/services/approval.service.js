import { contentService } from './content.service'

const delay = (ms = 800) => new Promise((resolve) => setTimeout(resolve, ms))

export const approvalService = {
 
  async getPendingContent() {
    await delay()
    const result = await contentService.getAllContent({ status: 'pending', pageSize: 9999 })
    return result.data
  },


  async approveContent(contentId, approverName = 'Dr. Michael Chen') {
    return contentService.approveContentById(contentId, approverName)
  },

  async rejectContent(contentId, reason) {
    if (!reason?.trim()) {
      throw new Error('Rejection reason is required.')
    }
    return contentService.rejectContentById(contentId, reason)
  },
}
