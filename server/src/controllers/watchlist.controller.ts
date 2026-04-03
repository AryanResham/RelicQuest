import type { Response } from 'express';
import * as watchlistService from '../services/watchlist.service.js';
import type { AuthenticatedRequest } from '../types/types.js';

export const getWatchlist = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) { res.status(401).json({ success: false, error: 'Authentication required' }); return; }

    const result = await watchlistService.getWatchlist(userId);
    if (!result.success) { res.status(500).json(result); return; }
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
};

export const addToWatchlist = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) { res.status(401).json({ success: false, error: 'Authentication required' }); return; }

    const itemId = parseInt(Array.isArray(req.params.itemId) ? (req.params.itemId[0] ?? '') : (req.params.itemId ?? ''));
    if (isNaN(itemId)) { res.status(400).json({ success: false, error: 'Invalid item ID' }); return; }

    const result = await watchlistService.addToWatchlist(userId, itemId);
    if (!result.success) { res.status(500).json(result); return; }
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
};

export const removeFromWatchlist = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) { res.status(401).json({ success: false, error: 'Authentication required' }); return; }

    const itemId = parseInt(Array.isArray(req.params.itemId) ? (req.params.itemId[0] ?? '') : (req.params.itemId ?? ''));
    if (isNaN(itemId)) { res.status(400).json({ success: false, error: 'Invalid item ID' }); return; }

    const result = await watchlistService.removeFromWatchlist(userId, itemId);
    if (!result.success) { res.status(500).json(result); return; }
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
};
