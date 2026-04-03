import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import userRoutes from './routes/user.routes.js';
import itemRoutes from './routes/item.routes.js';
import bidRoutes from './routes/bid.routes.js';
import sellerRoutes from './routes/seller.routes.js';
import watchlistRoutes from './routes/watchlist.routes.js';

const app = express();
const PORT = process.env.PORT || 3000;
const origins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(",").map(o => o.trim())
  : [];

// Middleware
app.use(cors({
  origin: origins,
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({extended:true}))

// API Routes
app.use('/api/users', userRoutes);
app.use('/api/items', itemRoutes);
app.use('/api/bids', bidRoutes);
app.use('/api/sellers', sellerRoutes);
app.use('/api/watchlist', watchlistRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the RelicQuest API!' });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

export default app;
