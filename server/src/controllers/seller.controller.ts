import type { Response } from 'express';
import * as sellerService from '../services/seller.service.js';
import type { AuthenticatedRequest } from '../types/types.js';

/**
 * Register as a seller
 * POST /api/sellers
 */
export const becomeSeller = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ success: false, error: 'Authentication required' });
      return;
    }

    const { store_name, phone_no } = req.body;

    if (!store_name || typeof store_name !== 'string' || !store_name.trim()) {
      res.status(400).json({ success: false, error: 'Store name is required' });
      return;
    }

    const result = await sellerService.becomeSeller(
      userId,
      store_name.trim(),
      phone_no?.trim() || null
    );

    if (!result.success) {
      res.status(400).json(result);
      return;
    }

    res.status(201).json(result);
  } catch (error) {
    console.error('becomeSeller controller error:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
};
