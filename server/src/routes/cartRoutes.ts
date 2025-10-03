import express from 'express';
import {
  addToCart,
  removeFromCart,
  updateCartQuantity,
  getCart,
  clearCart
} from '../controllers/cartController';

const router = express.Router();

// All cart routes require authentication
// Note: Authentication middleware should be applied before these routes

// GET /api/cart - Get user's cart
router.get('/', getCart);

// POST /api/cart - Add item to cart
router.post('/', addToCart);

// PUT /api/cart/:productId - Update quantity of item in cart
router.put('/:productId', updateCartQuantity);

// DELETE /api/cart/:productId - Remove item from cart
router.delete('/:productId', removeFromCart);

// DELETE /api/cart - Clear entire cart
router.delete('/', clearCart);

export default router;