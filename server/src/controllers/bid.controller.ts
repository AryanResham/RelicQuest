import type { Response } from 'express';
import * as bidService from '../services/bid.service.js';
import type { AuthenticatedRequest, PlaceBidDTO } from '../types/types.js';

/**
 * Place a bid on an item
 * POST /api/bids
 */
export const placeBid = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ success: false, error: 'Authentication required' });
      return;
    }

    const { item_id, amount } = req.body as PlaceBidDTO;

    // Validate input
    if (!item_id || typeof item_id !== 'number') {
      res.status(400).json({ success: false, error: 'Valid item_id is required' });
      return;
    }

    if (!amount || typeof amount !== 'number' || amount <= 0) {
      res.status(400).json({ success: false, error: 'Valid bid amount is required' });
      return;
    }

    const result = await bidService.placeBid(userId, item_id, amount);

    if (!result.success) {
      res.status(400).json(result);
      return;
    }

    res.status(201).json(result);
  } catch (error) {
    console.error('placeBid controller error:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
};

/**
 * Get all bids placed by the authenticated user
 * GET /api/bids/user
 */
export const getUserBids = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ success: false, error: 'Authentication required' });
      return;
    }

    const result = await bidService.getBidsByUser(userId);

    if (!result.success) {
      res.status(500).json(result);
      return;
    }

    res.json(result);
  } catch (error) {
    console.error('getUserBids controller error:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
};

/**
 * Get bids for an item
 * GET /api/bids/item/:itemId
 */
export const getItemBids = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const itemIdParam = req.params.itemId;
    const itemId = parseInt(Array.isArray(itemIdParam) ? (itemIdParam[0] ?? '0') : (itemIdParam ?? '0'), 10);
    const limitStr = typeof req.query.limit === 'string' ? req.query.limit : '10';
    const limit = parseInt(limitStr, 10) || 10;

    if (isNaN(itemId)) {
      res.status(400).json({ success: false, error: 'Valid item ID is required' });
      return;
    }

    const result = await bidService.getBidsByItem(itemId, limit);

    if (!result.success) {
      res.status(500).json(result);
      return;
    }

    res.json(result);
  } catch (error) {
    console.error('getItemBids controller error:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
};

/**
 * Get bid count for an item
 * GET /api/bids/item/:itemId/count
 */
export const getItemBidCount = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const itemIdParam = req.params.itemId;
    const itemId = parseInt(Array.isArray(itemIdParam) ? (itemIdParam[0] ?? '0') : (itemIdParam ?? '0'), 10);

    if (isNaN(itemId)) {
      res.status(400).json({ success: false, error: 'Valid item ID is required' });
      return;
    }

    const result = await bidService.getBidCount(itemId);

    if (!result.success) {
      res.status(500).json(result);
      return;
    }

    res.json(result);
  } catch (error) {
    console.error('getItemBidCount controller error:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
};
