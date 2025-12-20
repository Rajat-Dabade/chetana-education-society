import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { prisma } from '../lib/db';
import { requireAuth, AuthRequest } from '../lib/auth';
import { generateUniqueFilename, validateFileType, formatError } from '../lib/utils';

const router = express.Router();

// Ensure uploads directory exists
// Use absolute path for production, relative for development
const uploadsDir = process.env.UPLOADS_DIR || path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = generateUniqueFilename(file.originalname);
    cb(null, uniqueName);
  }
});

const upload = multer({
  storage,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE || '5242880') // 5MB default
  },
  fileFilter: (req, file, cb) => {
    if (validateFileType(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only images are allowed.'));
    }
  }
});

// Upload file
router.post('/', requireAuth, upload.single('file'), async (req: AuthRequest, res) => {
  try {
    if (!req.file) {
      return res.status(400).json(formatError('No file provided', 'NO_FILE'));
    }

    const baseUrl = `${req.protocol}://${req.get('host')}`;
    const fileUrl = `${baseUrl}/uploads/${req.file.filename}`;

    // Save to media table
    const media = await prisma.media.create({
      data: {
        url: fileUrl,
        filename: req.file.filename
      }
    });

    res.json({
      url: fileUrl,
      filename: req.file.filename,
      id: media.id
    });
  } catch (error: any) {
    // Clean up file if database save fails
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    if (error.message === 'Invalid file type. Only images are allowed.') {
      return res.status(400).json(formatError(error.message, 'INVALID_FILE_TYPE'));
    }

    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json(formatError('File size too large', 'FILE_TOO_LARGE'));
    }

    console.error('Upload error:', error);
    res.status(500).json(formatError('Upload failed', 'UPLOAD_ERROR'));
  }
});

// Get all media (for admin media library)
router.get('/', requireAuth, async (req: AuthRequest, res) => {
  try {
    const media = await prisma.media.findMany({
      orderBy: { createdAt: 'desc' }
    });

    res.json(media);
  } catch (error: any) {
    console.error('Get media error:', error);
    res.status(500).json(formatError('Internal server error', 'INTERNAL_ERROR'));
  }
});

// Delete media
router.delete('/:id', requireAuth, async (req: AuthRequest, res) => {
  try {
    const media = await prisma.media.findUnique({
      where: { id: req.params.id }
    });

    if (!media) {
      return res.status(404).json(formatError('Media not found', 'NOT_FOUND'));
    }

    // Delete file from filesystem
    const filePath = path.join(uploadsDir, media.filename);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    // Delete from database
    await prisma.media.delete({
      where: { id: req.params.id }
    });

    res.json({ message: 'Media deleted successfully' });
  } catch (error: any) {
    console.error('Delete media error:', error);
    res.status(500).json(formatError('Internal server error', 'INTERNAL_ERROR'));
  }
});

export default router;
