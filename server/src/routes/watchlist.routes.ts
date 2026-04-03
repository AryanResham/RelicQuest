import { Router } from 'express';
import * as watchlistController from '../controllers/watchlist.controller.js';
import { verifyToken } from '../middlewares/auth.js';

const router = Router();

router.get('/', verifyToken, watchlistController.getWatchlist);
router.post('/:itemId', verifyToken, watchlistController.addToWatchlist);
router.delete('/:itemId', verifyToken, watchlistController.removeFromWatchlist);

export default router;
