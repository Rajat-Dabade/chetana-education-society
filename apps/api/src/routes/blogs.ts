import express from 'express';
import { prisma } from '../lib/db';
import { requireAuth, AuthRequest } from '../lib/auth';
import { createBlogSchema, updateBlogSchema, blogQuerySchema, reorderBlogsSchema } from '../lib/validation';
import { formatError, formatValidationErrors, sanitizeHtml } from '../lib/utils';

const router = express.Router();

// Get blogs with pagination and search
router.get('/', async (req, res) => {
  try {
    const result = blogQuerySchema.safeParse(req.query);
    
    if (!result.success) {
      return res.status(400).json(formatValidationErrors(result.error.errors));
    }

    const { page, limit, q } = result.data;
    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = {};
    
    if (q) {
      where.OR = [
        { title: { contains: q } },
        { excerpt: { contains: q } },
        { author: { contains: q } }
      ];
    }

    const [items, total] = await Promise.all([
      prisma.blogPost.findMany({
        where,
        orderBy: [
          { order: 'desc' },
          { publishedAt: 'desc' }
        ],
        skip,
        take: limit
      }),
      prisma.blogPost.count({ where })
    ]);

    res.json({
      items,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error: any) {
    console.error('Get blogs error:', error);
    res.status(500).json(formatError('Internal server error', 'INTERNAL_ERROR'));
  }
});

// Get single blog by slug
router.get('/:slug', async (req, res) => {
  try {
    const blog = await prisma.blogPost.findUnique({
      where: { slug: req.params.slug }
    });

    if (!blog) {
      return res.status(404).json(formatError('Blog post not found', 'NOT_FOUND'));
    }

    res.json(blog);
  } catch (error: any) {
    console.error('Get blog error:', error);
    res.status(500).json(formatError('Internal server error', 'INTERNAL_ERROR'));
  }
});

// Create blog post
router.post('/', requireAuth, async (req: AuthRequest, res) => {
  try {
    const result = createBlogSchema.safeParse(req.body);
    
    if (!result.success) {
      return res.status(400).json(formatValidationErrors(result.error.errors));
    }

    // Check if slug already exists
    const existingBlog = await prisma.blogPost.findUnique({
      where: { slug: result.data.slug }
    });

    if (existingBlog) {
      return res.status(400).json(formatError('Slug already exists', 'SLUG_EXISTS'));
    }

    const blog = await prisma.blogPost.create({
      data: {
        ...result.data,
        content: sanitizeHtml(result.data.content),
        order: result.data.order || 0
      }
    });

    res.status(201).json(blog);
  } catch (error: any) {
    console.error('Create blog error:', error);
    res.status(500).json(formatError('Internal server error', 'INTERNAL_ERROR'));
  }
});

// Update blog post
router.put('/:id', requireAuth, async (req: AuthRequest, res) => {
  try {
    const result = updateBlogSchema.safeParse(req.body);
    
    if (!result.success) {
      return res.status(400).json(formatValidationErrors(result.error.errors));
    }

    const updateData = { ...result.data };
    if (updateData.content) {
      updateData.content = sanitizeHtml(updateData.content);
    }

    const blog = await prisma.blogPost.update({
      where: { id: req.params.id },
      data: updateData
    });

    res.json(blog);
  } catch (error: any) {
    if (error.code === 'P2025') {
      return res.status(404).json(formatError('Blog post not found', 'NOT_FOUND'));
    }
    if (error.code === 'P2002') {
      return res.status(400).json(formatError('Slug already exists', 'SLUG_EXISTS'));
    }
    console.error('Update blog error:', error);
    res.status(500).json(formatError('Internal server error', 'INTERNAL_ERROR'));
  }
});

// Delete blog post
router.delete('/:id', requireAuth, async (req: AuthRequest, res) => {
  try {
    await prisma.blogPost.delete({
      where: { id: req.params.id }
    });

    res.json({ message: 'Blog post deleted successfully' });
  } catch (error: any) {
    if (error.code === 'P2025') {
      return res.status(404).json(formatError('Blog post not found', 'NOT_FOUND'));
    }
    console.error('Delete blog error:', error);
    res.status(500).json(formatError('Internal server error', 'INTERNAL_ERROR'));
  }
});

// Reorder blog posts
router.post('/reorder', requireAuth, async (req: AuthRequest, res) => {
  try {
    const result = reorderBlogsSchema.safeParse(req.body);
    
    if (!result.success) {
      return res.status(400).json(formatValidationErrors(result.error.errors));
    }

    // Update all blog orders in a transaction
    await prisma.$transaction(
      result.data.map(({ id, order }) =>
        prisma.blogPost.update({
          where: { id },
          data: { order }
        })
      )
    );

    res.json({ message: 'Blog order updated successfully' });
  } catch (error: any) {
    console.error('Reorder blogs error:', error);
    res.status(500).json(formatError('Internal server error', 'INTERNAL_ERROR'));
  }
});

export default router;
