import express from 'express';
import { prisma } from '../lib/db';
import { hashPassword, comparePassword, generateToken, requireAuth, AuthRequest } from '../lib/auth';
import { loginSchema, changePasswordSchema } from '../lib/validation';
import { formatError, formatValidationErrors } from '../lib/utils';

const router = express.Router();

// Login
router.post('/login', async (req, res) => {
  try {
    const result = loginSchema.safeParse(req.body);
    
    if (!result.success) {
      return res.status(400).json(formatValidationErrors(result.error.errors));
    }

    const { email, password } = result.data;

    const user = await prisma.adminUser.findUnique({
      where: { email }
    });

    if (!user) {
      return res.status(401).json(formatError('Invalid credentials', 'INVALID_CREDENTIALS'));
    }

    const isValidPassword = await comparePassword(password, user.password);

    if (!isValidPassword) {
      return res.status(401).json(formatError('Invalid credentials', 'INVALID_CREDENTIALS'));
    }

    const token = generateToken(user.id);

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email
      }
    });
  } catch (error: any) {
    console.error('Login error:', error);
    console.error('Error stack:', error?.stack);
    console.error('Error message:', error?.message);
    res.status(500).json(formatError(
      error?.message || 'Internal server error', 
      'INTERNAL_ERROR'
    ));
  }
});

// Change password
router.post('/change-password', requireAuth, async (req: AuthRequest, res) => {
  try {
    const result = changePasswordSchema.safeParse(req.body);
    
    if (!result.success) {
      return res.status(400).json(formatValidationErrors(result.error.errors));
    }

    const { oldPassword, newPassword } = result.data;

    const user = await prisma.adminUser.findUnique({
      where: { id: req.userId }
    });

    if (!user) {
      return res.status(404).json(formatError('User not found', 'USER_NOT_FOUND'));
    }

    const isValidPassword = await comparePassword(oldPassword, user.password);

    if (!isValidPassword) {
      return res.status(400).json(formatError('Current password is incorrect', 'INVALID_PASSWORD'));
    }

    const hashedNewPassword = await hashPassword(newPassword);

    await prisma.adminUser.update({
      where: { id: req.userId },
      data: { password: hashedNewPassword }
    });

    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json(formatError('Internal server error', 'INTERNAL_ERROR'));
  }
});

export default router;
