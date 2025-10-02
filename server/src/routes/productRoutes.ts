import { Router } from 'express';
import {
  getAllProducts,
  getProductById,
  getFlashSaleProducts,
  getProductsByCategory,
  createProduct,
  updateProduct,
  deleteProduct
} from '../controllers/productController.js';
import { validateRequiredFields } from '../middlewares/validation.js';

const router = Router();

// Public routes
router.get('/', getAllProducts);
router.get('/flash-sale', getFlashSaleProducts);
router.get('/category/:category', getProductsByCategory);
router.get('/:id', getProductById);

// Admin routes (would typically require authentication middleware)
router.post('/', 
  validateRequiredFields(['name', 'price', 'category', 'description']),
  createProduct
);
router.put('/:id', updateProduct);
router.delete('/:id', deleteProduct);

export default router;