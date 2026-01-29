import type { Response } from 'express';
import type { AuthenticatedRequest } from '../types/types.js';
import * as userService from '../services/user.service.js';
import * as avatarService from '../services/avatar.service.js';

/**
 * Get current authenticated user's profile
 * GET /api/users/me
 */
export const getMe = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ success: false, error: 'Not authenticated' });
      return;
    }

    const result = await userService.getUserById(userId);
    if (!result.success) {
      res.status(404).json(result);
      return;
    }

    res.json(result);
  } catch (error) {
    console.error('getMe error:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
};

/**
 * Get user by ID
 * GET /api/users/:id
 */
export const getUser = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const id = req.params.id as string;
    if (!id) {
      res.status(400).json({ success: false, error: 'User ID is required' });
      return;
    }

    const result = await userService.getUserById(id);

    if (!result.success) {
      res.status(404).json(result);
      return;
    }

    res.json(result);
  } catch (error) {
    console.error('getUser error:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
};

/**
 * Update user profile (username only)
 * PUT /api/users/:id
 */
export const updateUser = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const id = req.params.id as string;
    if (!id) {
      res.status(400).json({ success: false, error: 'User ID is required' });
      return;
    }

    const { username } = req.body;

    const result = await userService.updateUser(id, { username });

    if (!result.success) {
      res.status(400).json(result);
      return;
    }

    res.json(result);
  } catch (error) {
    console.error('updateUser error:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
};

/**
 * Update user avatar
 * PUT /api/users/:id/avatar
 */
export const updateAvatar = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  console.log('📸 updateAvatar called');
  console.log('User ID from params:', req.params.id);
  console.log('File received:', req.file ? { name: req.file.originalname, size: req.file.size, mimetype: req.file.mimetype } : 'NO FILE');
  
  try {
    const id = req.params.id as string;
    if (!id) {
      res.status(400).json({ success: false, error: 'User ID is required' });
      return;
    }

    if (!req.file) {
      res.status(400).json({ success: false, error: 'No file uploaded' });
      return;
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(req.file.mimetype)) {
      res.status(400).json({
        success: false,
        error: 'Invalid file type. Allowed: JPEG, PNG, WebP, GIF',
      });
      return;
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024;
    if (req.file.size > maxSize) {
      res.status(400).json({
        success: false,
        error: 'File too large. Maximum size is 5MB',
      });
      return;
    }

    console.log('📤 Uploading to Supabase...');
    // Upload avatar
    const uploadResult = await avatarService.uploadToSupabase(id, req.file);
    console.log('📤 Upload result:', uploadResult);

    if (!uploadResult.success || !uploadResult.data) {
      res.status(500).json(uploadResult);
      return;
    }

    console.log('💾 Updating user record with avatar URL...');
    // Update user record with new avatar URL
    const updateResult = await userService.updateUserAvatar(
      id,
      uploadResult.data.avatarUrl
    );
    console.log('💾 Update result:', updateResult);

    if (!updateResult.success) {
      res.status(500).json(updateResult);
      return;
    }

    res.json({
      success: true,
      data: updateResult.data,
      message: 'Avatar updated successfully',
    });
  } catch (error) {
    console.error('❌ updateAvatar error:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
};

/**
 * Delete user account
 * DELETE /api/users/:id
 */
export const deleteUser = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const id = req.params.id as string;
    if (!id) {
      res.status(400).json({ success: false, error: 'User ID is required' });
      return;
    }

    const result = await userService.deleteUser(id);

    if (!result.success) {
      res.status(400).json(result);
      return;
    }

    res.json(result);
  } catch (error) {
    console.error('deleteUser error:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
};
