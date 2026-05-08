import { generateId } from '../utils/helpers'

export const mockUsers = [
  {
    id: 'teacher-001',
    name: 'Sarah Johnson',
    email: 'teacher@example.com',
    password: 'password123',
    role: 'teacher',
    avatar: null,
    department: 'Science Department',
    joinedAt: '2023-08-15T09:00:00Z',
  },
  {
    id: 'principal-001',
    name: 'Dr. Michael Chen',
    email: 'principal@example.com',
    password: 'password123',
    role: 'principal',
    avatar: null,
    department: 'Administration',
    joinedAt: '2020-01-10T08:00:00Z',
  },
]

const subjects = [
  'mathematics', 'science', 'english', 'history', 'geography',
  'physics', 'chemistry', 'biology', 'computer_science', 'art',
]

const statuses = ['pending', 'approved', 'rejected', 'approved', 'approved', 'approved']

const sampleImages = [
  'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=600&q=80',
  'https://images.unsplash.com/photo-1587620962725-abab7fe55159?w=600&q=80',
  'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=600&q=80',
  'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=600&q=80',
  'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&q=80',
  'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&q=80',
  'https://images.unsplash.com/photo-1574169208507-84376144848b?w=600&q=80',
  'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=600&q=80',
]

const titles = [
  'Introduction to Algebra',
  'Photosynthesis Explained',
  'Shakespeare and His Works',
  'World War II Timeline',
  'The Water Cycle',
  'Newton\'s Laws of Motion',
  'Periodic Table Basics',
  'Cell Biology 101',
  'Binary and Number Systems',
  'Color Theory in Art',
  'Music Theory Fundamentals',
  'The Solar System',
  'Economic Principles',
  'Constitutional Rights',
  'Pythagorean Theorem',
  'Chemical Reactions',
  'DNA & Genetics',
  'Literary Devices',
  'Climate Change Overview',
  'Trigonometry Basics',
]

function randomBetween(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function randomDate(start, end) {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime())).toISOString()
}

function generateContentItem(index, teacherId = 'teacher-001') {
  const status = statuses[index % statuses.length]
  const daysAgo = randomBetween(1, 60)
  const uploadedAt = randomDate(
    new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000),
    new Date()
  )

  const startOffset = randomBetween(-5, 10)
  const startTime = new Date(Date.now() + startOffset * 24 * 60 * 60 * 1000).toISOString()
  const endTime = new Date(Date.now() + (startOffset + randomBetween(1, 14)) * 24 * 60 * 60 * 1000).toISOString()

  return {
    id: generateId(),
    title: titles[index % titles.length],
    subject: subjects[index % subjects.length],
    description: `This is a comprehensive educational resource covering key concepts in ${subjects[index % subjects.length]}. Designed for students at all levels to enhance their understanding.`,
    fileUrl: sampleImages[index % sampleImages.length],
    fileName: `content_${index + 1}.jpg`,
    fileSize: randomBetween(200000, 8000000),
    teacherId,
    teacherName: 'Sarah Johnson',
    status,
    rejectionReason: status === 'rejected' ? 'Content does not meet curriculum guidelines. Please revise and resubmit.' : null,
    startTime,
    endTime,
    rotationDuration: randomBetween(5, 30),
    uploadedAt,
    approvedAt: status === 'approved' ? randomDate(new Date(uploadedAt), new Date()) : null,
    approvedBy: status === 'approved' ? 'Dr. Michael Chen' : null,
  }
}


const now = Date.now()
export const guaranteedLiveItems = [
  {
    id: 'live-pinned-001',
    title: 'Newton\'s Laws of Motion — Live Session',
    subject: 'physics',
    description: 'An interactive broadcast covering all three of Newton\'s laws with real-world examples and demonstrations. Perfect for Grade 9–11 students preparing for examinations.',
    fileUrl: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=600&q=80',
    fileName: 'newtons_laws.jpg',
    fileSize: 1800000,
    teacherId: 'teacher-001',
    teacherName: 'Sarah Johnson',
    status: 'approved',
    rejectionReason: null,
    startTime: new Date(now - 2 * 60 * 60 * 1000).toISOString(),   // started 2h ago
    endTime: new Date(now + 6 * 60 * 60 * 1000).toISOString(),     // ends in 6h
    rotationDuration: 15,
    uploadedAt: new Date(now - 3 * 24 * 60 * 60 * 1000).toISOString(),
    approvedAt: new Date(now - 2 * 24 * 60 * 60 * 1000).toISOString(),
    approvedBy: 'Dr. Michael Chen',
  },
  {
    id: 'live-pinned-002',
    title: 'Photosynthesis & the Carbon Cycle',
    subject: 'biology',
    description: 'A visual deep-dive into how plants convert sunlight into energy and how this process connects to the global carbon cycle. Includes animated diagrams.',
    fileUrl: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=600&q=80',
    fileName: 'photosynthesis.jpg',
    fileSize: 2400000,
    teacherId: 'teacher-001',
    teacherName: 'Sarah Johnson',
    status: 'approved',
    rejectionReason: null,
    startTime: new Date(now - 1 * 60 * 60 * 1000).toISOString(),   // started 1h ago
    endTime: new Date(now + 8 * 60 * 60 * 1000).toISOString(),     // ends in 8h
    rotationDuration: 20,
    uploadedAt: new Date(now - 5 * 24 * 60 * 60 * 1000).toISOString(),
    approvedAt: new Date(now - 4 * 24 * 60 * 60 * 1000).toISOString(),
    approvedBy: 'Dr. Michael Chen',
  },
  {
    id: 'live-pinned-003',
    title: 'Introduction to Algebra — Module 3',
    subject: 'mathematics',
    description: 'Solving linear equations and inequalities with step-by-step worked examples. Part of the ongoing algebra broadcast series for secondary school students.',
    fileUrl: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=600&q=80',
    fileName: 'algebra_module3.jpg',
    fileSize: 1200000,
    teacherId: 'teacher-001',
    teacherName: 'Sarah Johnson',
    status: 'approved',
    rejectionReason: null,
    startTime: new Date(now - 30 * 60 * 1000).toISOString(),       
    endTime: new Date(now + 4 * 60 * 60 * 1000).toISOString(),    
    rotationDuration: 10,
    uploadedAt: new Date(now - 2 * 24 * 60 * 60 * 1000).toISOString(),
    approvedAt: new Date(now - 1 * 24 * 60 * 60 * 1000).toISOString(),
    approvedBy: 'Dr. Michael Chen',
  },
]


export const mockTeacherContent = [
  ...guaranteedLiveItems,
  ...Array.from({ length: 47 }, (_, i) => generateContentItem(i, 'teacher-001')),
]


export const mockAllContent = [
  ...mockTeacherContent,
  ...Array.from({ length: 150 }, (_, i) => {
    const item = generateContentItem(i, `teacher-00${randomBetween(2, 9)}`)
    item.teacherName = ['Emily Rodriguez', 'James Wilson', 'Priya Sharma', 'Ahmed Hassan', 'Lisa Thompson'][i % 5]
    return item
  }),
]

export const mockPendingContent = mockAllContent.filter((c) => c.status === 'pending')

export const mockLiveContent = mockAllContent
  .filter((c) => c.status === 'approved')
  .filter((c) => {
    const now = new Date()
    const start = new Date(c.startTime)
    const end = new Date(c.endTime)
    return now >= start && now <= end
  })
  .slice(0, 3)

export const mockStats = {
  teacher: {
    total: mockTeacherContent.length,
    pending: mockTeacherContent.filter((c) => c.status === 'pending').length,
    approved: mockTeacherContent.filter((c) => c.status === 'approved').length,
    rejected: mockTeacherContent.filter((c) => c.status === 'rejected').length,
  },
  principal: {
    total: mockAllContent.length,
    pending: mockAllContent.filter((c) => c.status === 'pending').length,
    approved: mockAllContent.filter((c) => c.status === 'approved').length,
    rejected: mockAllContent.filter((c) => c.status === 'rejected').length,
  },
}
