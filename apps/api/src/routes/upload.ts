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
// In production (compiled), __dirname is apps/api/dist, so ../uploads = apps/api/uploads
// But we need absolute path to avoid issues with working directory
const getUploadsDir = () => {
  if (process.env.UPLOADS_DIR) {
    return path.resolve(process.env.UPLOADS_DIR);
  }
  // In production, resolve to absolute path
  if (process.env.NODE_ENV === 'production') {
    return path.resolve(__dirname, '../../uploads');
  }
  // In development, use relative path
  return path.resolve(__dirname, '../uploads');
};

const uploadsDir = getUploadsDir();

// Ensure directory exists
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
  console.log(`📁 Created uploads directory: ${uploadsDir}`);
} else {
  console.log(`📁 Using uploads directory: ${uploadsDir}`);
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

    // Log file details for debugging
    console.log(`📤 File uploaded: ${req.file.filename}`);
    console.log(`📁 Saved to: ${req.file.path}`);
    console.log(`📏 File size: ${req.file.size} bytes`);

    // Verify file actually exists
    if (!fs.existsSync(req.file.path)) {
      console.error(`❌ File not found at expected path: ${req.file.path}`);
      return res.status(500).json(formatError('File upload failed - file not saved', 'UPLOAD_ERROR'));
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

    console.log(`✅ File saved successfully: ${fileUrl}`);

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
