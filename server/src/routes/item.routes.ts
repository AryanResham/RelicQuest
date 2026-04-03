import { Router } from 'express';
import multer from 'multer';
import * as itemController from '../controllers/item.controller.js';
import { verifyToken, isSeller } from '../middlewares/auth.js';

const router = Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024 } });

// POST /api/items - Create a new item listing (seller only)
router.post('/', verifyToken, isSeller, upload.array('images', 7), itemController.createItem);

// GET /api/items/live - Get live auction items (must be before /:id to avoid conflict)
router.get('/live', itemController.getLiveItems);

// GET /api/items/seller - Get authenticated seller's listings (must be before /:id)
router.get('/seller', verifyToken, itemController.getSellerItems);

// GET /api/items/won - Get items won by the authenticated user (must be before /:id)
router.get('/won', verifyToken, itemController.getWonItems);

// GET /api/items/:id - Get item by ID
router.get('/:id', itemController.getItem);

// GET /api/items/:id/related - Get related items
router.get('/:id/related', itemController.getRelatedItems);

export default router;
