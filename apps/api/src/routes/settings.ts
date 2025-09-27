import express from 'express';
import { prisma } from '../lib/db';
import { requireAuth, AuthRequest } from '../lib/auth';
import { updateSettingsSchema } from '../lib/validation';
import { formatError, formatValidationErrors } from '../lib/utils';

const router = express.Router();

// Get site settings
router.get('/', async (req, res) => {
  try {
    let settings = await prisma.siteSetting.findUnique({
      where: { id: 1 }
    });

    if (!settings) {
      // Create default settings if they don't exist
      settings = await prisma.siteSetting.create({
        data: {
          id: 1,
          siteName: 'Our NGO',
          primaryHex: '#0038B8'
        }
      });
    }

    res.json(settings);
  } catch (error) {
    console.error('Get settings error:', error);
    res.status(500).json(formatError('Internal server error', 'INTERNAL_ERROR'));
  }
});

// Update site settings
router.put('/', requireAuth, async (req: AuthRequest, res) => {
  try {
    const result = updateSettingsSchema.safeParse(req.body);
    
    if (!result.success) {
      return res.status(400).json(formatValidationErrors(result.error.errors));
    }

    const settings = await prisma.siteSetting.upsert({
      where: { id: 1 },
      update: result.data,
      create: {
        id: 1,
        siteName: result.data.siteName || 'Our NGO',
        primaryHex: result.data.primaryHex || '#0038B8',
        logoUrl: result.data.logoUrl
      }
    });

    res.json(settings);
  } catch (error) {
    console.error('Update settings error:', error);
    res.status(500).json(formatError('Internal server error', 'INTERNAL_ERROR'));
  }
});

export default router;
