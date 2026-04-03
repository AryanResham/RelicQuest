import { Router } from 'express';
import * as sellerController from '../controllers/seller.controller.js';
import { verifyToken } from '../middlewares/auth.js';

const router = Router();

// POST /api/sellers - Register as a seller (requires authentication)
router.post('/', verifyToken, sellerController.becomeSeller);

export default router;
