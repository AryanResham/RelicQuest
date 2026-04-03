import { Router } from 'express';
import * as bidController from '../controllers/bid.controller.js';
import { verifyToken } from '../middlewares/auth.js';

const router = Router();

// POST /api/bids - Place a bid (requires authentication)
router.post('/', verifyToken, bidController.placeBid);

// GET /api/bids/user - Get authenticated user's bids with item data
router.get('/user', verifyToken, bidController.getUserBids);

// GET /api/bids/item/:itemId - Get bids for an item (public)
router.get('/item/:itemId', bidController.getItemBids);

// GET /api/bids/item/:itemId/count - Get bid count for an item (public)
router.get('/item/:itemId/count', bidController.getItemBidCount);

export default router;
