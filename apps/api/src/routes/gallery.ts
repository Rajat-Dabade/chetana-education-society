import express from 'express';
import { prisma } from '../lib/db';
import { requireAuth, AuthRequest } from '../lib/auth';
import { formatError, formatValidationErrors } from '../lib/utils';
import { z } from 'zod';

const router = express.Router();

// Gallery validation schemas
const createGalleryImageSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title too long'),
  description: z.string().max(500, 'Description too long').optional(),
  imageUrl: z.string().url('Invalid image URL'),
  order: z.number().int().min(0, 'Order must be non-negative').optional(),
  featured: z.boolean().optional()
});

const updateGalleryImageSchema = createGalleryImageSchema.partial();

const reorderGallerySchema = z.array(z.object({
  id: z.string().cuid('Invalid ID format'),
  order: z.number().int().min(0, 'Order must be non-negative')
}));

// Get all gallery images
router.get('/', async (req, res) => {
  try {
    const images = await prisma.galleryImage.findMany({
      orderBy: [
        { featured: 'desc' },
        { order: 'desc' },
        { createdAt: 'desc' }
      ]
    });
    res.json(images);
  } catch (error: any) {
    console.error('Get gallery images error:', error);
    res.status(500).json(formatError('Internal server error', 'INTERNAL_ERROR'));
  }
});

// Create gallery image
router.post('/', requireAuth, async (req: AuthRequest, res) => {
  try {
    const result = createGalleryImageSchema.safeParse(req.body);
    
    if (!result.success) {
      return res.status(400).json(formatValidationErrors(result.error.errors));
    }

    const image = await prisma.galleryImage.create({
      data: {
        ...result.data,
        order: result.data.order || 0,
        featured: result.data.featured || false
      }
    });

    res.status(201).json(image);
  } catch (error: any) {
    console.error('Create gallery image error:', error);
    res.status(500).json(formatError('Internal server error', 'INTERNAL_ERROR'));
  }
});

// Update gallery image
router.put('/:id', requireAuth, async (req: AuthRequest, res) => {
  try {
    const result = updateGalleryImageSchema.safeParse(req.body);
    
    if (!result.success) {
      return res.status(400).json(formatValidationErrors(result.error.errors));
    }

    const image = await prisma.galleryImage.update({
      where: { id: req.params.id },
      data: result.data
    });

    res.json(image);
  } catch (error: any) {
    if (error.code === 'P2025') {
      return res.status(404).json(formatError('Gallery image not found', 'NOT_FOUND'));
    }
    console.error('Update gallery image error:', error);
    res.status(500).json(formatError('Internal server error', 'INTERNAL_ERROR'));
  }
});

// Delete gallery image
router.delete('/:id', requireAuth, async (req: AuthRequest, res) => {
  try {
    await prisma.galleryImage.delete({
      where: { id: req.params.id }
    });

    res.json({ message: 'Gallery image deleted successfully' });
  } catch (error: any) {
    if (error.code === 'P2025') {
      return res.status(404).json(formatError('Gallery image not found', 'NOT_FOUND'));
    }
    console.error('Delete gallery image error:', error);
    res.status(500).json(formatError('Internal server error', 'INTERNAL_ERROR'));
  }
});

// Reorder gallery images
router.post('/reorder', requireAuth, async (req: AuthRequest, res) => {
  try {
    const result = reorderGallerySchema.safeParse(req.body);
    
    if (!result.success) {
      return res.status(400).json(formatValidationErrors(result.error.errors));
    }

    // Update all gallery image orders in a transaction
    await prisma.$transaction(
      result.data.map(({ id, order }) =>
        prisma.galleryImage.update({
          where: { id },
          data: { order }
        })
      )
    );

    res.json({ message: 'Gallery order updated successfully' });
  } catch (error: any) {
    console.error('Reorder gallery error:', error);
    res.status(500).json(formatError('Internal server error', 'INTERNAL_ERROR'));
  }
});

export default router;
