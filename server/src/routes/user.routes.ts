import { Router } from 'express';
import multer from 'multer';
import * as userController from '../controllers/user.controller.js';
import { verifyToken, isOwner } from '../middlewares/auth.js';

const router = Router();

// Configure multer for memory storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (_req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Allowed: JPEG, PNG, WebP, GIF'));
    }
  },
});

// GET /api/users/me - Get current user (must be before /:id to avoid conflict)
router.get('/me', verifyToken, userController.getMe);

// GET /api/users/:id - Get user by ID (public)
router.get('/:id', userController.getUser);

// PUT /api/users/:id - Update user (auth + owner only)
router.put('/:id', verifyToken, isOwner('id'), userController.updateUser);

// PUT /api/users/:id/avatar - Update avatar (auth + owner only)
router.put(
  '/:id/avatar',
  verifyToken,
  isOwner('id'),
  upload.single('avatar'),
  userController.updateAvatar
);

// DELETE /api/users/:id - Delete user (auth + owner only)
router.delete('/:id', verifyToken, isOwner('id'), userController.deleteUser);

export default router;
