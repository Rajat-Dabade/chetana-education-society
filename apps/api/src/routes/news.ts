import express from 'express';
import { prisma } from '../lib/db';
import { requireAuth, AuthRequest } from '../lib/auth';
import { createNewsSchema, updateNewsSchema, newsQuerySchema } from '../lib/validation';
import { formatError, formatValidationErrors, sanitizeHtml } from '../lib/utils';

const router = express.Router();

// Get news/events with filtering and pagination
router.get('/', async (req, res) => {
  try {
    const result = newsQuerySchema.safeParse(req.query);
    
    if (!result.success) {
      return res.status(400).json(formatValidationErrors(result.error.errors));
    }

    const { page, limit, type, q } = result.data;
    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = {};
    
    if (type) {
      where.type = type;
    }
    
    if (q) {
      where.OR = [
        { title: { contains: q } },
        { body: { contains: q } }
      ];
    }

    const [items, total] = await Promise.all([
      prisma.newsItem.findMany({
        where,
        orderBy: { date: 'desc' },
        skip,
        take: limit
      }),
      prisma.newsItem.count({ where })
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
    console.error('Get news error:', error);
    res.status(500).json(formatError('Internal server error', 'INTERNAL_ERROR'));
  }
});

// Get single news/event by slug
router.get('/:slug', async (req, res) => {
  try {
    const newsItem = await prisma.newsItem.findUnique({
      where: { slug: req.params.slug }
    });

    if (!newsItem) {
      return res.status(404).json(formatError('News item not found', 'NOT_FOUND'));
    }

    // Parse gallery JSON
    const item = {
      ...newsItem,
      gallery: newsItem.gallery ? JSON.parse(newsItem.gallery) : []
    };

    res.json(item);
  } catch (error: any) {
    console.error('Get news item error:', error);
    res.status(500).json(formatError('Internal server error', 'INTERNAL_ERROR'));
  }
});

// Create news/event
router.post('/', requireAuth, async (req: AuthRequest, res) => {
  try {
    const result = createNewsSchema.safeParse(req.body);
    
    if (!result.success) {
      return res.status(400).json(formatValidationErrors(result.error.errors));
    }

    // Check if slug already exists
    const existingItem = await prisma.newsItem.findUnique({
      where: { slug: result.data.slug }
    });

    if (existingItem) {
      return res.status(400).json(formatError('Slug already exists', 'SLUG_EXISTS'));
    }

    const newsItem = await prisma.newsItem.create({
      data: {
        ...result.data,
        date: new Date(result.data.date),
        body: sanitizeHtml(result.data.body),
        gallery: JSON.stringify(result.data.gallery || [])
      }
    });

    res.status(201).json({
      ...newsItem,
      gallery: JSON.parse(newsItem.gallery)
    });
  } catch (error: any) {
    console.error('Create news error:', error);
    res.status(500).json(formatError('Internal server error', 'INTERNAL_ERROR'));
  }
});

// Update news/event
router.put('/:id', requireAuth, async (req: AuthRequest, res) => {
  try {
    const result = updateNewsSchema.safeParse(req.body);
    
    if (!result.success) {
      return res.status(400).json(formatValidationErrors(result.error.errors));
    }

    const updateData: Record<string, unknown> = { ...result.data };
    
    if (updateData.date) {
      updateData.date = new Date(updateData.date as string);
    }
    
    if (updateData.body) {
      updateData.body = sanitizeHtml(updateData.body as string);
    }
    
    if (updateData.gallery) {
      updateData.gallery = JSON.stringify(updateData.gallery);
    }

    const newsItem = await prisma.newsItem.update({
      where: { id: req.params.id },
      data: updateData
    });

    res.json({
      ...newsItem,
      gallery: JSON.parse(newsItem.gallery)
    });
  } catch (error: any) {
    if (error.code === 'P2025') {
      return res.status(404).json(formatError('News item not found', 'NOT_FOUND'));
    }
    if (error.code === 'P2002') {
      return res.status(400).json(formatError('Slug already exists', 'SLUG_EXISTS'));
    }
    console.error('Update news error:', error);
    res.status(500).json(formatError('Internal server error', 'INTERNAL_ERROR'));
  }
});

// Delete news/event
router.delete('/:id', requireAuth, async (req: AuthRequest, res) => {
  try {
    await prisma.newsItem.delete({
      where: { id: req.params.id }
    });

    res.json({ message: 'News item deleted successfully' });
  } catch (error: any) {
    if (error.code === 'P2025') {
      return res.status(404).json(formatError('News item not found', 'NOT_FOUND'));
    }
    console.error('Delete news error:', error);
    res.status(500).json(formatError('Internal server error', 'INTERNAL_ERROR'));
  }
});

export default router;
