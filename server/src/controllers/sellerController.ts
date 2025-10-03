import { Response } from 'express';
import User from '../models/User';
import Product from '../models/Product';
import { AuthenticatedRequest } from '../types/auth';

// Register as seller
export const registerAsSeller = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    const {
      storeName,
      storeDescription,
      businessEmail,
      businessPhone,
      businessAddress,
      taxId
    } = req.body;

    if (!userId) {
      res.status(401).json({ error: 'Authentication required' });
      return;
    }

    // Validate required fields
    if (!storeName || !storeDescription || !businessEmail || !businessPhone) {
      res.status(400).json({ 
        error: 'Store name, description, business email, and phone are required' 
      });
      return;
    }

    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    // Check if user is already a seller
    if (user.isSeller) {
      res.status(400).json({ error: 'User is already registered as a seller' });
      return;
    }

    // Update user to become a seller
    user.isSeller = true;
    user.role = 'seller';
    user.sellerProfile = {
      storeName,
      storeDescription,
      businessEmail,
      businessPhone,
      businessAddress: businessAddress || {},
      taxId,
      isVerified: false, // Admin needs to verify
      verificationDocuments: [],
      rating: 0,
      totalSales: 0,
      joinedAsSellerAt: new Date()
    };

    await user.save();

    res.status(200).json({
      message: 'Successfully registered as seller. Your account is pending verification.',
      seller: {
        id: user._id,
        storeName: user.sellerProfile.storeName,
        isVerified: user.sellerProfile.isVerified,
        joinedAt: user.sellerProfile.joinedAsSellerAt
      }
    });

  } catch (error) {
    console.error('Register seller error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Update seller profile
export const updateSellerProfile = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    const updates = req.body;

    if (!userId) {
      res.status(401).json({ error: 'Authentication required' });
      return;
    }

    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    if (!user.isSeller || !user.sellerProfile) {
      res.status(403).json({ error: 'User is not registered as a seller' });
      return;
    }

    // Update allowed fields
    const allowedUpdates = [
      'storeName', 'storeDescription', 'businessEmail', 
      'businessPhone', 'businessAddress', 'taxId'
    ];

    Object.keys(updates).forEach(key => {
      if (allowedUpdates.includes(key) && user.sellerProfile) {
        (user.sellerProfile as any)[key] = updates[key];
      }
    });

    await user.save();

    res.status(200).json({
      message: 'Seller profile updated successfully',
      sellerProfile: user.sellerProfile
    });

  } catch (error) {
    console.error('Update seller profile error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get seller profile
export const getSellerProfile = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({ error: 'Authentication required' });
      return;
    }

    const user = await User.findById(userId).select('-password');
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    if (!user.isSeller || !user.sellerProfile) {
      res.status(403).json({ error: 'User is not registered as a seller' });
      return;
    }

    res.status(200).json({
      seller: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        sellerProfile: user.sellerProfile
      }
    });

  } catch (error) {
    console.error('Get seller profile error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get seller's products
export const getSellerProducts = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    const { page = 1, limit = 10, category, search } = req.query;

    if (!userId) {
      res.status(401).json({ error: 'Authentication required' });
      return;
    }

    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    if (!user.isSeller) {
      res.status(403).json({ error: 'User is not registered as a seller' });
      return;
    }

    // Build query
    const query: any = { user: userId };
    
    if (category) {
      query.category = category;
    }
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);

    const [products, total] = await Promise.all([
      Product.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      Product.countDocuments(query)
    ]);

    res.status(200).json({
      products,
      pagination: {
        currentPage: Number(page),
        totalPages: Math.ceil(total / Number(limit)),
        totalProducts: total,
        hasMore: skip + products.length < total
      }
    });

  } catch (error) {
    console.error('Get seller products error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get seller dashboard stats
export const getSellerStats = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({ error: 'Authentication required' });
      return;
    }

    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    if (!user.isSeller) {
      res.status(403).json({ error: 'User is not registered as a seller' });
      return;
    }

    // Get product statistics
    const [totalProducts, totalViews, recentProducts] = await Promise.all([
      Product.countDocuments({ user: userId }),
      Product.aggregate([
        { $match: { user: userId } },
        { $group: { _id: null, totalViews: { $sum: '$views' } } }
      ]),
      Product.find({ user: userId })
        .sort({ createdAt: -1 })
        .limit(5)
        .select('name price image createdAt')
    ]);

    const stats = {
      totalProducts,
      totalViews: totalViews[0]?.totalViews || 0,
      totalSales: user.sellerProfile?.totalSales || 0,
      rating: user.sellerProfile?.rating || 0,
      isVerified: user.sellerProfile?.isVerified || false,
      recentProducts
    };

    res.status(200).json({ stats });

  } catch (error) {
    console.error('Get seller stats error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get public seller info (for customers viewing seller's store)
export const getPublicSellerInfo = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { sellerId } = req.params;

    const seller = await User.findById(sellerId)
      .select('firstName lastName sellerProfile.storeName sellerProfile.storeDescription sellerProfile.rating sellerProfile.totalSales sellerProfile.joinedAsSellerAt sellerProfile.isVerified');

    if (!seller || !seller.isSeller) {
      res.status(404).json({ error: 'Seller not found' });
      return;
    }

    // Get seller's products
    const products = await Product.find({ user: sellerId })
      .select('name price image rating reviews category isAuction')
      .sort({ createdAt: -1 })
      .limit(12);

    res.status(200).json({
      seller: {
        id: seller._id,
        name: `${seller.firstName} ${seller.lastName}`,
        storeName: seller.sellerProfile?.storeName,
        storeDescription: seller.sellerProfile?.storeDescription,
        rating: seller.sellerProfile?.rating,
        totalSales: seller.sellerProfile?.totalSales,
        joinedAt: seller.sellerProfile?.joinedAsSellerAt,
        isVerified: seller.sellerProfile?.isVerified
      },
      products,
      totalProducts: await Product.countDocuments({ user: sellerId })
    });

  } catch (error) {
    console.error('Get public seller info error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};