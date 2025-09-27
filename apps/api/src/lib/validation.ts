import { z } from 'zod';

// Auth schemas
export const loginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(6, 'Password must be at least 6 characters')
});

export const changePasswordSchema = z.object({
  oldPassword: z.string().min(1, 'Old password is required'),
  newPassword: z.string().min(6, 'New password must be at least 6 characters')
});

// Testimonial schemas
export const createTestimonialSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name too long'),
  role: z.string().max(100, 'Role too long').optional(),
  quote: z.string().min(1, 'Quote is required').max(280, 'Quote must be 280 characters or less'),
  rating: z.number().int().min(1, 'Rating must be at least 1 star').max(5, 'Rating must be at most 5 stars'),
  avatarUrl: z.string().url('Invalid URL').optional().or(z.literal(''))
});

export const updateTestimonialSchema = createTestimonialSchema.partial();

// Success Story schemas
export const createSuccessStorySchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title too long'),
  slug: z.string().min(1, 'Slug is required').regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Invalid slug format'),
  excerpt: z.string().min(1, 'Excerpt is required').max(200, 'Excerpt must be 200 characters or less'),
  content: z.string().min(1, 'Content is required'),
  coverUrl: z.string().url('Invalid URL').optional().or(z.literal(''))
});

export const updateSuccessStorySchema = createSuccessStorySchema.partial();

// Milestone schemas
export const createMilestoneSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title too long'),
  description: z.string().max(500, 'Description too long').optional(),
  achievedOn: z.string().datetime('Invalid date format')
});

export const updateMilestoneSchema = createMilestoneSchema.partial();

// News schemas
export const createNewsSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title too long'),
  slug: z.string().min(1, 'Slug is required').regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Invalid slug format'),
  type: z.enum(['NEWS', 'EVENT'], { required_error: 'Type must be NEWS or EVENT' }),
  date: z.string().datetime('Invalid date format'),
  body: z.string().min(1, 'Body is required'),
  heroUrl: z.string().url('Invalid URL').optional().or(z.literal('')),
  gallery: z.array(z.string().url()).max(8, 'Maximum 8 gallery images').optional()
});

export const updateNewsSchema = createNewsSchema.partial();

// Blog schemas
export const createBlogSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title too long'),
  slug: z.string().min(1, 'Slug is required').regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Invalid slug format'),
  author: z.string().min(1, 'Author is required').max(100, 'Author name too long'),
  excerpt: z.string().min(1, 'Excerpt is required').max(200, 'Excerpt must be 200 characters or less'),
  content: z.string().min(1, 'Content is required'),
  coverUrl: z.string().url('Invalid URL').optional().or(z.literal('')),
  order: z.number().int().min(0, 'Order must be non-negative').optional()
});

export const updateBlogSchema = createBlogSchema.partial();

export const reorderBlogsSchema = z.array(z.object({
  id: z.string().cuid('Invalid ID format'),
  order: z.number().int().min(0, 'Order must be non-negative')
}));

// Settings schemas
export const updateSettingsSchema = z.object({
  siteName: z.string().min(1, 'Site name is required').max(100, 'Site name too long').optional(),
  primaryHex: z.string().regex(/^#[0-9A-F]{6}$/i, 'Invalid hex color format').optional(),
  logoUrl: z.string().url('Invalid URL').optional().or(z.literal(''))
});

// Query schemas
export const paginationSchema = z.object({
  page: z.string().optional().transform(val => parseInt(val || '1') || 1),
  limit: z.string().optional().transform(val => Math.min(parseInt(val || '10') || 10, 50))
});

export const newsQuerySchema = paginationSchema.extend({
  type: z.enum(['NEWS', 'EVENT']).optional(),
  q: z.string().optional()
});

export const blogQuerySchema = paginationSchema.extend({
  q: z.string().optional()
});
