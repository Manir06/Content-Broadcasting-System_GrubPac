// Application-wide constants

export const ROLES = {
  TEACHER: 'teacher',
  PRINCIPAL: 'principal',
}

export const CONTENT_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  SCHEDULED: 'scheduled',
  ACTIVE: 'active',
  EXPIRED: 'expired',
}

export const SUBJECTS = [
  { value: 'mathematics', label: 'Mathematics' },
  { value: 'science', label: 'Science' },
  { value: 'english', label: 'English' },
  { value: 'history', label: 'History' },
  { value: 'geography', label: 'Geography' },
  { value: 'physics', label: 'Physics' },
  { value: 'chemistry', label: 'Chemistry' },
  { value: 'biology', label: 'Biology' },
  { value: 'computer_science', label: 'Computer Science' },
  { value: 'art', label: 'Art & Design' },
  { value: 'music', label: 'Music' },
  { value: 'physical_education', label: 'Physical Education' },
  { value: 'economics', label: 'Economics' },
  { value: 'civics', label: 'Civics' },
]

export const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png', 'image/gif']
export const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB

export const ROUTES = {
  LOGIN: '/login',
  TEACHER_DASHBOARD: '/teacher/dashboard',
  TEACHER_UPLOAD: '/teacher/upload',
  TEACHER_CONTENT: '/teacher/my-content',
  PRINCIPAL_DASHBOARD: '/principal/dashboard',
  PRINCIPAL_APPROVALS: '/principal/approvals',
  PRINCIPAL_ALL_CONTENT: '/principal/all-content',
  LIVE_CONTENT: '/live/:teacherId',
}

export const QUERY_KEYS = {
  TEACHER_CONTENT: 'teacher-content',
  ALL_CONTENT: 'all-content',
  PENDING_CONTENT: 'pending-content',
  LIVE_CONTENT: 'live-content',
  TEACHER_STATS: 'teacher-stats',
  PRINCIPAL_STATS: 'principal-stats',
  CURRENT_USER: 'current-user',
}

export const POLLING_INTERVAL = 30000 // 30 seconds

export const PAGINATION_SIZES = [10, 25, 50, 100]
export const DEFAULT_PAGE_SIZE = 10
