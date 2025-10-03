import express from 'express';
import {
  registerAsSeller,
  updateSellerProfile,
  getSellerProfile,
  getSellerProducts,
  getSellerStats,
  getPublicSellerInfo
} from '../controllers/sellerController';

const router = express.Router();

// Public routes
// GET /api/seller/public/:sellerId - Get public seller information
router.get('/public/:sellerId', getPublicSellerInfo);

// Protected routes (require authentication)
// POST /api/seller/register - Register as seller
router.post('/register', registerAsSeller);

// GET /api/seller/profile - Get seller profile
router.get('/profile', getSellerProfile);

// PUT /api/seller/profile - Update seller profile
router.put('/profile', updateSellerProfile);

// GET /api/seller/products - Get seller's products
router.get('/products', getSellerProducts);

// GET /api/seller/stats - Get seller dashboard statistics
router.get('/stats', getSellerStats);

export default router;