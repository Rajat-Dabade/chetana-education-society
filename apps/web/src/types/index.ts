// Common types for the application

export interface Testimonial {
  id: string
  name: string
  role?: string
  quote: string
  rating: number
  avatarUrl?: string
  createdAt: string
}

export interface SuccessStory {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  coverUrl?: string
  createdAt: string
}

export interface Milestone {
  id: string
  title: string
  description?: string
  achievedOn: string
  order?: number
  createdAt: string
}

export interface NewsItem {
  id: string
  title: string
  slug: string
  type: 'NEWS' | 'EVENT'
  date: string
  body: string
  heroUrl?: string
  gallery: string[]
  createdAt: string
}

export interface BlogPost {
  id: string
  title: string
  slug: string
  author: string
  coverUrl?: string
  excerpt: string
  content: string
  order: number
  publishedAt: string
  createdAt: string
}

export interface Media {
  id: string
  url: string
  filename: string
  createdAt: string
}

export interface SiteSettings {
  id: number
  siteName: string
  primaryHex: string
  logoUrl?: string
}

export interface ApiResponse<T> {
  data: T
}

export interface PaginatedResponse<T> {
  items: T[]
  pagination: {
    page: number
    limit: number
    total: number
    pages: number
  }
}

export interface ApiError {
  error: {
    message: string
    code: string
    details?: unknown[]
  }
}

export interface ErrorWithResponse {
  response?: {
    data?: {
      error?: {
        message?: string
      }
    }
  }
}
