import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/database.js';
import productRoutes from './routes/productRoutes.js';
import authRoutes from './routes/authRoutes.js';
import cartRoutes from './routes/cartRoutes.js';
import wishlistRoutes from './routes/wishlistRoutes.js';
import sellerRoutes from './routes/sellerRoutes.js';
import {notFound, errorHandler} from './middlewares/errorHandler.js';

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Hardcoded products data (from client)
// const products = [
//   // Flash Sales Products
//   {
//     id: "1",
//     name: "HAVIT HV-G92 Gamepad",
//     price: 120,
//     originalPrice: 160,
//     image: "/red-gaming-controller.jpg",
//     rating: 4.8,
//     reviews: 88,
//     discount: 40,
//     category: "Gaming",
//     description: "Professional gaming controller with RGB lighting and wireless connectivity. Features ergonomic design, precise analog sticks, and customizable button mapping for competitive gaming.",
//     isAuction: false,
//     specifications: {
//       'Connectivity': 'Wireless/USB',
//       'Battery Life': '20 hours',
//       'Compatibility': 'PC, Xbox, PlayStation',
//       'Weight': '280g',
//       'Warranty': '1 Year'
//     }
//   },
//   {
//     id: "2",
//     name: "AK-900 Wired Keyboard",
//     price: 960,
//     originalPrice: 1160,
//     image: "/mechanical-gaming-keyboard-with-rgb.jpg",
//     rating: 4.7,
//     reviews: 75,
//     discount: 35,
//     category: "Gaming",
//     description: "Mechanical gaming keyboard with RGB backlighting and custom switches. Premium build quality with aluminum frame and detachable cable.",
//     isAuction: false,
//     specifications: {
//       'Switch Type': 'Cherry MX Red',
//       'Backlighting': 'RGB Per-Key',
//       'Layout': 'Full Size',
//       'Build Material': 'Aluminum',
//       'Cable': 'Detachable USB-C'
//     }
//   },
//   {
//     id: "3",
//     name: "IPS LCD Gaming Monitor",
//     price: 370,
//     originalPrice: 400,
//     image: "/curved-gaming-monitor-with-red-accents.jpg",
//     rating: 4.9,
//     reviews: 99,
//     discount: 30,
//     category: "Gaming",
//     description: "27-inch IPS gaming monitor with 144Hz refresh rate and curved display. Features HDR support and ultra-low input lag for competitive gaming.",
//     isAuction: false,
//     specifications: {
//       'Screen Size': '27 inches',
//       'Resolution': '2560x1440',
//       'Refresh Rate': '144Hz',
//       'Panel Type': 'IPS',
//       'Response Time': '1ms'
//     }
//   },
//   {
//     id: "4",
//     name: "S-Series Comfort Chair",
//     price: 375,
//     originalPrice: 400,
//     image: "/modern-office-chair-beige-color.jpg",
//     rating: 4.6,
//     reviews: 65,
//     discount: 25,
//     category: "Furniture",
//     description: "Ergonomic office chair with premium comfort and adjustable features. Perfect for long gaming or work sessions.",
//     isAuction: false,
//     specifications: {
//       'Material': 'Premium Fabric',
//       'Adjustability': 'Height, Armrests, Tilt',
//       'Weight Capacity': '150kg',
//       'Warranty': '3 Years',
//       'Assembly': 'Required'
//     }
//   },
//   // Product Grid (Collectibles)
//   {
//     id: "5",
//     name: "Vintage Pokemon Card Collection",
//     price: 850,
//     originalPrice: 1200,
//     image: "/vintage-pokemon-cards-holographic.jpg",
//     rating: 4.9,
//     reviews: 156,
//     discount: 30,
//     category: "Trading Cards",
//     description: "Rare holographic Pokemon cards from the original series. Includes first edition Charizard, Blastoise, and Venusaur in mint condition with PSA grading.",
//     currentBid: 850,
//     auctionEndTime: new Date(Date.now() + 48 * 60 * 60 * 1000),
//     isAuction: true,
//     startingBid: 500,
//     minBidIncrement: 25,
//     specifications: {
//       'Card Count': '25 cards',
//       'Condition': 'Mint/Near Mint',
//       'Series': 'Base Set 1st Edition',
//       'Year': '1998',
//       'Authenticity': 'PSA Graded'
//     },
//     bidHistory: [
//       { id: '1', userId: 'user1', userName: 'CardCollector92', amount: 750, timestamp: new Date(Date.now() - 120000) },
//       { id: '2', userId: 'user2', userName: 'PokemonMaster', amount: 800, timestamp: new Date(Date.now() - 60000) },
//       { id: '3', userId: 'user3', userName: 'RetroGamer', amount: 850, timestamp: new Date(Date.now() - 30000) }
//     ]
//   },
//   {
//     id: "6",
//     name: "Limited Edition Funko Pop",
//     price: 125,
//     originalPrice: 150,
//     image: "/limited-edition-funko-pop-figure.jpg",
//     rating: 4.7,
//     reviews: 89,
//     discount: 17,
//     category: "Figures",
//     description: "Exclusive convention limited edition Funko Pop figure. Only 500 pieces worldwide with numbered certificate of authenticity.",
//     isAuction: false,
//     specifications: {
//       'Edition': 'Limited (500 pieces)',
//       'Condition': 'Mint in Box',
//       'Size': '4 inches',
//       'Series': 'Convention Exclusive',
//       'Certificate': 'Numbered'
//     }
//   },
//   {
//     id: "7",
//     name: "Rare Comic Book Issue #1",
//     price: 2500,
//     originalPrice: 3000,
//     image: "/vintage-comic-book-first-issue.jpg",
//     rating: 5.0,
//     reviews: 23,
//     discount: 17,
//     category: "Comics",
//     description: "First issue of legendary comic series in mint condition. Extremely rare find for serious collectors with certificate of authenticity.",
//     currentBid: 2500,
//     auctionEndTime: new Date(Date.now() + 72 * 60 * 60 * 1000),
//     isAuction: true,
//     startingBid: 2000,
//     minBidIncrement: 100,
//     specifications: {
//       'Issue': '#1 First Print',
//       'Condition': 'Mint',
//       'Publisher': 'Marvel Comics',
//       'Year': '1963',
//       'Pages': '22 pages'
//     },
//     bidHistory: [
//       { id: '4', userId: 'user4', userName: 'ComicCollector', amount: 2200, timestamp: new Date(Date.now() - 180000) },
//       { id: '5', userId: 'user5', userName: 'VintageDealer', amount: 2400, timestamp: new Date(Date.now() - 90000) },
//       { id: '6', userId: 'user6', userName: 'MarvelFan', amount: 2500, timestamp: new Date(Date.now() - 45000) }
//     ]
//   },
//   {
//     id: "8",
//     name: "Vintage Action Figure Set",
//     price: 450,
//     originalPrice: 600,
//     image: "/vintage-action-figures-80s-toys.jpg",
//     rating: 4.6,
//     reviews: 67,
//     discount: 25,
//     category: "Figures",
//     description: "Complete set of 1980s action figures in original packaging. Includes all accessories and display stands.",
//     isAuction: false,
//     specifications: {
//       'Figure Count': '8 figures',
//       'Condition': 'Mint in Package',
//       'Series': '1980s Classic',
//       'Accessories': 'Complete',
//       'Packaging': 'Original Blister Cards'
//     }
//   }
// ];

// Routes
app.use('/api/products', productRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/seller', sellerRoutes);

app.get('/api/health', (_req, res) => {
  res.json({
    success: true,
    message: 'API is running',
    timestamp: new Date().toISOString()
  });
});



// 404 handler - this should be the last route
app.use(notFound);

// Error handler
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`� RelicQuest Server is running on port ${PORT}`);
  console.log(`📍 API available at: http://localhost:${PORT}`);
  console.log(`🏠 Home: http://localhost:${PORT}/`);
  console.log(`📦 Products: http://localhost:${PORT}/products`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
});