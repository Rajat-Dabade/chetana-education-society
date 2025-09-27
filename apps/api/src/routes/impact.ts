import express from 'express';
import { prisma } from '../lib/db';
import { requireAuth, AuthRequest } from '../lib/auth';
import {
  createTestimonialSchema,
  updateTestimonialSchema,
  createSuccessStorySchema,
  updateSuccessStorySchema,
  createMilestoneSchema,
  updateMilestoneSchema
} from '../lib/validation';
import { formatError, formatValidationErrors, sanitizeHtml } from '../lib/utils';

const router = express.Router();

// Testimonials
router.get('/testimonials', async (req, res) => {
  try {
    const testimonials = await prisma.testimonial.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.json(testimonials);
  } catch (error: any) {
    console.error('Get testimonials error:', error);
    res.status(500).json(formatError('Internal server error', 'INTERNAL_ERROR'));
  }
});

router.post('/testimonials', requireAuth, async (req: AuthRequest, res) => {
  try {
    const result = createTestimonialSchema.safeParse(req.body);
    
    if (!result.success) {
      return res.status(400).json(formatValidationErrors(result.error.errors));
    }

    const testimonial = await prisma.testimonial.create({
      data: result.data
    });

    res.status(201).json(testimonial);
  } catch (error: any) {
    console.error('Create testimonial error:', error);
    res.status(500).json(formatError('Internal server error', 'INTERNAL_ERROR'));
  }
});

router.put('/testimonials/:id', requireAuth, async (req: AuthRequest, res) => {
  try {
    const result = updateTestimonialSchema.safeParse(req.body);
    
    if (!result.success) {
      return res.status(400).json(formatValidationErrors(result.error.errors));
    }

    const testimonial = await prisma.testimonial.update({
      where: { id: req.params.id },
      data: result.data
    });

    res.json(testimonial);
  } catch (error: any) {
    if (error.code === 'P2025') {
      return res.status(404).json(formatError('Testimonial not found', 'NOT_FOUND'));
    }
    console.error('Update testimonial error:', error);
    res.status(500).json(formatError('Internal server error', 'INTERNAL_ERROR'));
  }
});

router.delete('/testimonials/:id', requireAuth, async (req: AuthRequest, res) => {
  try {
    await prisma.testimonial.delete({
      where: { id: req.params.id }
    });

    res.json({ message: 'Testimonial deleted successfully' });
  } catch (error: any) {
    if (error.code === 'P2025') {
      return res.status(404).json(formatError('Testimonial not found', 'NOT_FOUND'));
    }
    console.error('Delete testimonial error:', error);
    res.status(500).json(formatError('Internal server error', 'INTERNAL_ERROR'));
  }
});

// Success Stories
router.get('/stories', async (req, res) => {
  try {
    const stories = await prisma.successStory.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.json(stories);
  } catch (error: any) {
    console.error('Get stories error:', error);
    res.status(500).json(formatError('Internal server error', 'INTERNAL_ERROR'));
  }
});

router.get('/stories/:slug', async (req, res) => {
  try {
    const story = await prisma.successStory.findUnique({
      where: { slug: req.params.slug }
    });

    if (!story) {
      return res.status(404).json(formatError('Story not found', 'NOT_FOUND'));
    }

    res.json(story);
  } catch (error: any) {
    console.error('Get story error:', error);
    res.status(500).json(formatError('Internal server error', 'INTERNAL_ERROR'));
  }
});

router.post('/stories', requireAuth, async (req: AuthRequest, res) => {
  try {
    const result = createSuccessStorySchema.safeParse(req.body);
    
    if (!result.success) {
      return res.status(400).json(formatValidationErrors(result.error.errors));
    }

    // Check if slug already exists
    const existingStory = await prisma.successStory.findUnique({
      where: { slug: result.data.slug }
    });

    if (existingStory) {
      return res.status(400).json(formatError('Slug already exists', 'SLUG_EXISTS'));
    }

    const story = await prisma.successStory.create({
      data: {
        ...result.data,
        content: sanitizeHtml(result.data.content)
      }
    });

    res.status(201).json(story);
  } catch (error: any) {
    console.error('Create story error:', error);
    res.status(500).json(formatError('Internal server error', 'INTERNAL_ERROR'));
  }
});

router.put('/stories/:id', requireAuth, async (req: AuthRequest, res) => {
  try {
    const result = updateSuccessStorySchema.safeParse(req.body);
    
    if (!result.success) {
      return res.status(400).json(formatValidationErrors(result.error.errors));
    }

    const updateData = { ...result.data };
    if (updateData.content) {
      updateData.content = sanitizeHtml(updateData.content);
    }

    const story = await prisma.successStory.update({
      where: { id: req.params.id },
      data: updateData
    });

    res.json(story);
  } catch (error: any) {
    if (error.code === 'P2025') {
      return res.status(404).json(formatError('Story not found', 'NOT_FOUND'));
    }
    if (error.code === 'P2002') {
      return res.status(400).json(formatError('Slug already exists', 'SLUG_EXISTS'));
    }
    console.error('Update story error:', error);
    res.status(500).json(formatError('Internal server error', 'INTERNAL_ERROR'));
  }
});

router.delete('/stories/:id', requireAuth, async (req: AuthRequest, res) => {
  try {
    await prisma.successStory.delete({
      where: { id: req.params.id }
    });

    res.json({ message: 'Story deleted successfully' });
  } catch (error: any) {
    if (error.code === 'P2025') {
      return res.status(404).json(formatError('Story not found', 'NOT_FOUND'));
    }
    console.error('Delete story error:', error);
    res.status(500).json(formatError('Internal server error', 'INTERNAL_ERROR'));
  }
});

// Milestones
router.get('/milestones', async (req, res) => {
  try {
    const milestones = await prisma.milestone.findMany({
      orderBy: { achievedOn: 'desc' }
    });
    res.json(milestones);
  } catch (error: any) {
    console.error('Get milestones error:', error);
    res.status(500).json(formatError('Internal server error', 'INTERNAL_ERROR'));
  }
});

router.post('/milestones', requireAuth, async (req: AuthRequest, res) => {
  try {
    const result = createMilestoneSchema.safeParse(req.body);
    
    if (!result.success) {
      return res.status(400).json(formatValidationErrors(result.error.errors));
    }

    const milestone = await prisma.milestone.create({
      data: {
        ...result.data,
        achievedOn: new Date(result.data.achievedOn)
      }
    });

    res.status(201).json(milestone);
  } catch (error: any) {
    console.error('Create milestone error:', error);
    res.status(500).json(formatError('Internal server error', 'INTERNAL_ERROR'));
  }
});

router.put('/milestones/:id', requireAuth, async (req: AuthRequest, res) => {
  try {
    const result = updateMilestoneSchema.safeParse(req.body);
    
    if (!result.success) {
      return res.status(400).json(formatValidationErrors(result.error.errors));
    }

    const updateData: any = { ...result.data };
    if (updateData.achievedOn) {
      updateData.achievedOn = new Date(updateData.achievedOn).toISOString();
    }

    const milestone = await prisma.milestone.update({
      where: { id: req.params.id },
      data: updateData
    });

    res.json(milestone);
  } catch (error: any) {
    if (error.code === 'P2025') {
      return res.status(404).json(formatError('Milestone not found', 'NOT_FOUND'));
    }
    console.error('Update milestone error:', error);
    res.status(500).json(formatError('Internal server error', 'INTERNAL_ERROR'));
  }
});

router.delete('/milestones/:id', requireAuth, async (req: AuthRequest, res) => {
  try {
    await prisma.milestone.delete({
      where: { id: req.params.id }
    });

    res.json({ message: 'Milestone deleted successfully' });
  } catch (error: any) {
    if (error.code === 'P2025') {
      return res.status(404).json(formatError('Milestone not found', 'NOT_FOUND'));
    }
    console.error('Delete milestone error:', error);
    res.status(500).json(formatError('Internal server error', 'INTERNAL_ERROR'));
  }
});

export default router;
