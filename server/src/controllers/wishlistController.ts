import { Response } from 'express';
import User from '../models/User';
import Product from '../models/Product';
import { AuthenticatedRequest } from '../types/auth';

// Add item to wishlist
export const addToWishlist = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { productId } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({ error: 'Authentication required' });
      return;
    }

    if (!productId) {
      res.status(400).json({ error: 'Product ID is required' });
      return;
    }

    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      res.status(404).json({ error: 'Product not found' });
      return;
    }

    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    // Check if product is already in wishlist
    const isAlreadyInWishlist = user.wishlist.some(
      item => item.toString() === productId
    );

    if (isAlreadyInWishlist) {
      res.status(400).json({ error: 'Product already in wishlist' });
      return;
    }

    // Add to wishlist
    user.wishlist.push(productId);
    await user.save();

    res.status(200).json({
      message: 'Item added to wishlist successfully',
      wishlistCount: user.wishlist.length
    });

  } catch (error) {
    console.error('Add to wishlist error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Remove item from wishlist
export const removeFromWishlist = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { productId } = req.params;
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

    // Check if product is in wishlist
    const productIndex = user.wishlist.findIndex(
      item => item.toString() === productId
    );

    if (productIndex === -1) {
      res.status(404).json({ error: 'Product not found in wishlist' });
      return;
    }

    // Remove from wishlist
    user.wishlist.splice(productIndex, 1);
    await user.save();

    res.status(200).json({
      message: 'Item removed from wishlist successfully',
      wishlistCount: user.wishlist.length
    });

  } catch (error) {
    console.error('Remove from wishlist error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get user's wishlist
export const getWishlist = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({ error: 'Authentication required' });
      return;
    }

    const user = await User.findById(userId)
      .populate({
        path: 'wishlist',
        select: 'name price image rating isAuction user discount originalPrice',
        populate: {
          path: 'user',
          select: 'firstName lastName sellerProfile.storeName'
        }
      });

    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    res.status(200).json({
      wishlist: user.wishlist,
      totalItems: user.wishlist.length
    });

  } catch (error) {
    console.error('Get wishlist error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Clear entire wishlist
export const clearWishlist = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
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

    user.wishlist = [];
    await user.save();

    res.status(200).json({
      message: 'Wishlist cleared successfully',
      wishlist: []
    });

  } catch (error) {
    console.error('Clear wishlist error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Check if product is in user's wishlist
export const checkWishlistStatus = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { productId } = req.params;
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

    const isInWishlist = user.wishlist.some(
      item => item.toString() === productId
    );

    res.status(200).json({
      isInWishlist,
      productId
    });

  } catch (error) {
    console.error('Check wishlist status error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};