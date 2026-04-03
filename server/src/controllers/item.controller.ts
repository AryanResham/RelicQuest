import type { Request, Response } from 'express';
import * as itemService from '../services/item.service.js';
import type { AuthenticatedRequest } from '../types/types.js';

/**
 * Get item by ID
 * GET /api/items/:id
 */
export const getItem = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    if (!id) {
      res.status(400).json({ success: false, error: 'Item ID is required' });
      return;
    }

    const result = await itemService.getItemById(id);

    if (!result.success) {
      res.status(404).json(result);
      return;
    }

    res.json(result);
  } catch (error) {
    console.error('getItem error:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
};

/**
 * Get live auction items
 * GET /api/items/live
 */
export const getLiveItems = async (req: Request, res: Response): Promise<void> => {
  try {
    const limit = parseInt(req.query.limit as string) || 12;
    const page = parseInt(req.query.page as string) || 1;
    const result = await itemService.getLiveItems(page, limit);
    console.log(result);
    if (!result.success) {
      res.status(500).json(result);
      return;
    }

    res.json(result);
  } catch (error) {
    console.error('getLiveItems error:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
};

/**
 * Create a new item listing with image upload
 * POST /api/items
 */
export const createItem = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const sellerId = req.user?.id;
    if (!sellerId) {
      res.status(401).json({ success: false, error: 'Authentication required' });
      return;
    }

    const { title, description, start_price, min_price, bid_increment, end_time, category_id } = req.body;

    if (!title?.trim() || !description?.trim() || !start_price || !end_time) {
      res.status(400).json({ success: false, error: 'title, description, start_price and end_time are required' });
      return;
    }

    const files = req.files as Express.Multer.File[];
    if (!files || files.length === 0) {
      res.status(400).json({ success: false, error: 'At least one image is required' });
      return;
    }

    const result = await itemService.createItem(
      sellerId,
      {
        title: title.trim(),
        description: description.trim(),
        start_price: parseFloat(start_price),
        min_price: min_price ? parseFloat(min_price) : parseFloat(start_price),
        bid_increment: bid_increment ? parseFloat(bid_increment) : 1,
        end_time: new Date(end_time).toISOString(),
        category_id: category_id ? parseInt(category_id) : null,
      },
      files.map(f => ({ buffer: f.buffer, originalname: f.originalname, mimetype: f.mimetype }))
    );

    if (!result.success) {
      res.status(400).json(result);
      return;
    }

    res.status(201).json(result);
  } catch (error) {
    console.error('createItem controller error:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
};

/**
 * Get related items
 * GET /api/items/:id/related
 */
export const getRelatedItems = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    const categoryId = req.query.categoryId ? parseInt(req.query.categoryId as string) : null;
    const limit = parseInt(req.query.limit as string) || 5;

    const result = await itemService.getRelatedItems(id, categoryId, limit);

    if (!result.success) {
      res.status(500).json(result);
      return;
    }

    res.json(result);
  } catch (error) {
    console.error('getRelatedItems error:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
};
