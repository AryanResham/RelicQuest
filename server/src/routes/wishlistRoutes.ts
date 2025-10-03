import express from 'express';
import {
  addToWishlist,
  removeFromWishlist,
  getWishlist,
  clearWishlist,
  checkWishlistStatus
} from '../controllers/wishlistController';

const router = express.Router();

// All wishlist routes require authentication
// Note: Authentication middleware should be applied before these routes

// GET /api/wishlist - Get user's wishlist
router.get('/', getWishlist);

// POST /api/wishlist - Add item to wishlist
router.post('/', addToWishlist);

// DELETE /api/wishlist/:productId - Remove item from wishlist
router.delete('/:productId', removeFromWishlist);

// DELETE /api/wishlist - Clear entire wishlist
router.delete('/', clearWishlist);

// GET /api/wishlist/check/:productId - Check if product is in wishlist
router.get('/check/:productId', checkWishlistStatus);

export default router;