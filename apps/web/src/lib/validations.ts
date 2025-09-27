import { z } from 'zod'

// Auth schemas
export const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

export const changePasswordSchema = z.object({
  oldPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string().min(6, 'New password must be at least 6 characters'),
  confirmPassword: z.string().min(1, 'Please confirm your new password'),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})

// Testimonial schemas
export const testimonialSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name is too long'),
  role: z.string().max(100, 'Role is too long').optional(),
  quote: z.string().min(1, 'Quote is required').max(280, 'Quote must be 280 characters or less'),
  rating: z.number().int().min(1, 'Please select at least 1 star').max(5, 'Maximum 5 stars allowed'),
  avatarUrl: z.string().url('Please enter a valid URL').optional().or(z.literal('')),
})

// Success Story schemas
export const successStorySchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title is too long'),
  slug: z.string().min(1, 'Slug is required').regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must contain only lowercase letters, numbers, and hyphens'),
  excerpt: z.string().min(1, 'Excerpt is required').max(200, 'Excerpt must be 200 characters or less'),
  content: z.string().min(1, 'Content is required'),
  coverUrl: z.string().url('Please enter a valid URL').optional().or(z.literal('')),
})

// Milestone schemas
export const milestoneSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title is too long'),
  description: z.string().max(500, 'Description is too long').optional(),
  achievedOn: z.string().min(1, 'Date is required'),
})

// News schemas
export const newsSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title is too long'),
  slug: z.string().min(1, 'Slug is required').regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must contain only lowercase letters, numbers, and hyphens'),
  type: z.enum(['NEWS', 'EVENT'], { required_error: 'Please select a type' }),
  date: z.string().min(1, 'Date is required'),
  body: z.string().min(1, 'Content is required'),
  heroUrl: z.string().url('Please enter a valid URL').optional().or(z.literal('')),
  gallery: z.array(z.string().url()).max(8, 'Maximum 8 gallery images allowed').optional(),
})

// Blog schemas
export const blogSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title is too long'),
  slug: z.string().min(1, 'Slug is required').regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must contain only lowercase letters, numbers, and hyphens'),
  author: z.string().min(1, 'Author is required').max(100, 'Author name is too long'),
  excerpt: z.string().min(1, 'Excerpt is required').max(200, 'Excerpt must be 200 characters or less'),
  content: z.string().min(1, 'Content is required'),
  coverUrl: z.string().url('Please enter a valid URL').optional().or(z.literal('')),
  order: z.number().int().min(0, 'Order must be non-negative').optional(),
})

// Settings schemas
export const settingsSchema = z.object({
  siteName: z.string().min(1, 'Site name is required').max(100, 'Site name is too long'),
  primaryHex: z.string().regex(/^#[0-9A-F]{6}$/i, 'Please enter a valid hex color (e.g., #0038B8)'),
  logoUrl: z.string().url('Please enter a valid URL').optional().or(z.literal('')),
})

// Contact form schema
export const contactSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name is too long'),
  email: z.string().email('Please enter a valid email address'),
  subject: z.string().min(1, 'Subject is required').max(200, 'Subject is too long'),
  message: z.string().min(1, 'Message is required').max(1000, 'Message is too long'),
})

export type LoginInput = z.infer<typeof loginSchema>
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>
export type TestimonialInput = z.infer<typeof testimonialSchema>
export type SuccessStoryInput = z.infer<typeof successStorySchema>
export type MilestoneInput = z.infer<typeof milestoneSchema>
export type NewsInput = z.infer<typeof newsSchema>
export type BlogInput = z.infer<typeof blogSchema>
export type SettingsInput = z.infer<typeof settingsSchema>
export type ContactInput = z.infer<typeof contactSchema>
