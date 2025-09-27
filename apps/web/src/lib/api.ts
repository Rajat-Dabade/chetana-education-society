import axios from 'axios'

console.log('🔍 Raw VITE_API_URL:', (import.meta as any).env.VITE_API_URL)
console.log('🔍 All environment variables:', (import.meta as any).env)

const API_BASE_URL = (import.meta as any).env.VITE_API_URL || '/api'

console.log('🔍 Final API_BASE_URL being used:', API_BASE_URL)
console.log('🔍 Is VITE_API_URL defined?', !!(import.meta as any).env.VITE_API_URL)

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Debug: Log all API requests
api.interceptors.request.use(
  (config) => {
    console.log('🚀 Making API request to:', config.baseURL + config.url)
    return config
  },
  (error) => {
    console.error('❌ API request error:', error)
    return Promise.reject(error)
  }
)

// Debug: Log all API responses
api.interceptors.response.use(
  (response) => {
    console.log('✅ API response from:', response.config.url, 'Status:', response.status)
    return response
  },
  (error) => {
    console.error('❌ API response error:', error.config?.url, 'Status:', error.response?.status)
    return Promise.reject(error)
  }
)

// Request interceptor to add auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('admin_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('admin_token')
      if (window.location.pathname.startsWith('/admin') && window.location.pathname !== '/admin/login') {
        window.location.href = '/admin/login'
      }
    }
    return Promise.reject(error)
  }
)

// Auth API
export const authApi = {
  login: (credentials: { email: string; password: string }) =>
    api.post('/auth/login', credentials),
  
  changePassword: (data: { oldPassword: string; newPassword: string }) =>
    api.post('/auth/change-password', data),
}

// Impact API
export const impactApi = {
  // Testimonials
  getTestimonials: () => api.get('/impact/testimonials'),
  createTestimonial: (data: any) => api.post('/impact/testimonials', data),
  updateTestimonial: (id: string, data: any) => api.put(`/impact/testimonials/${id}`, data),
  deleteTestimonial: (id: string) => api.delete(`/impact/testimonials/${id}`),

  // Success Stories
  getStories: () => api.get('/impact/stories'),
  getStory: (slug: string) => api.get(`/impact/stories/${slug}`),
  createStory: (data: any) => api.post('/impact/stories', data),
  updateStory: (id: string, data: any) => api.put(`/impact/stories/${id}`, data),
  deleteStory: (id: string) => api.delete(`/impact/stories/${id}`),

  // Milestones
  getMilestones: () => api.get('/impact/milestones'),
  createMilestone: (data: any) => api.post('/impact/milestones', data),
  updateMilestone: (id: string, data: any) => api.put(`/impact/milestones/${id}`, data),
  deleteMilestone: (id: string) => api.delete(`/impact/milestones/${id}`),
}

// News API
export const newsApi = {
  getNews: (params?: { type?: 'NEWS' | 'EVENT'; q?: string; page?: number; limit?: number }) =>
    api.get('/news', { params }),
  getNewsItem: (slug: string) => api.get(`/news/${slug}`),
  createNewsItem: (data: any) => api.post('/news', data),
  updateNewsItem: (id: string, data: any) => api.put(`/news/${id}`, data),
  deleteNewsItem: (id: string) => api.delete(`/news/${id}`),
}

// Blog API
export const blogApi = {
  getBlogs: (params?: { q?: string; page?: number; limit?: number }) =>
    api.get('/blogs', { params }),
  getBlog: (slug: string) => api.get(`/blogs/${slug}`),
  createBlog: (data: any) => api.post('/blogs', data),
  updateBlog: (id: string, data: any) => api.put(`/blogs/${id}`, data),
  deleteBlog: (id: string) => api.delete(`/blogs/${id}`),
  reorderBlogs: (data: { id: string; order: number }[]) => api.post('/blogs/reorder', data),
}

// Upload API
export const uploadApi = {
  uploadFile: (file: File) => {
    const formData = new FormData()
    formData.append('file', file)
    return api.post('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
  },
  getMedia: () => api.get('/upload'),
  deleteMedia: (id: string) => api.delete(`/upload/${id}`),
}

// Gallery API
export const galleryApi = {
  getGalleryImages: () => api.get('/gallery'),
  createGalleryImage: (data: any) => api.post('/gallery', data),
  updateGalleryImage: (id: string, data: any) => api.put(`/gallery/${id}`, data),
  deleteGalleryImage: (id: string) => api.delete(`/gallery/${id}`),
  reorderGalleryImages: (data: { id: string; order: number }[]) => api.post('/gallery/reorder', data),
}

// Settings API
export const settingsApi = {
  getSettings: () => api.get('/settings'),
  updateSettings: (data: any) => api.put('/settings', data),
}
