import { Response, NextFunction } from 'express';
import User from '../models/User';
import Product from '../models/Product';
import { AuthenticatedRequest } from '../types/auth';

// Middleware to check if user is a seller
export const requireSeller = async (
  req: AuthenticatedRequest, 
  res: Response, 
  next: NextFunction
): Promise<void> => {
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
      res.status(403).json({ 
        error: 'Seller access required. Please register as a seller first.' 
      });
      return;
    }

    // Add seller info to request
    req.seller = {
      id: user._id?.toString() || user.id,
      storeName: user.sellerProfile?.storeName || '',
      isVerified: user.sellerProfile?.isVerified || false
    };

    next();
  } catch (error) {
    console.error('Require seller middleware error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Middleware to check if user is a verified seller
export const requireVerifiedSeller = async (
  req: AuthenticatedRequest, 
  res: Response, 
  next: NextFunction
): Promise<void> => {
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
      res.status(403).json({ 
        error: 'Seller access required. Please register as a seller first.' 
      });
      return;
    }

    if (!user.sellerProfile?.isVerified) {
      res.status(403).json({ 
        error: 'Verified seller access required. Your seller account is pending verification.' 
      });
      return;
    }

    // Add seller info to request
    req.seller = {
      id: user._id?.toString() || user.id,
      storeName: user.sellerProfile.storeName,
      isVerified: true
    };

    next();
  } catch (error) {
    console.error('Require verified seller middleware error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Middleware to validate product ownership
export const validateProductOwnership = async (
  req: AuthenticatedRequest, 
  res: Response, 
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user?.id;
    const { productId } = req.params;

    if (!userId) {
      res.status(401).json({ error: 'Authentication required' });
      return;
    }

    if (!productId) {
      res.status(400).json({ error: 'Product ID is required' });
      return;
    }

    const product = await Product.findById(productId);
    if (!product) {
      res.status(404).json({ error: 'Product not found' });
      return;
    }

    // Check if the product belongs to the current user
    if (product.user.toString() !== userId) {
      res.status(403).json({ 
        error: 'Access denied. You can only manage your own products.' 
      });
      return;
    }

    // Add product to request for use in the controller
    req.product = product;

    next();
  } catch (error) {
    console.error('Validate product ownership middleware error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Middleware to check if user is admin
export const requireAdmin = async (
  req: AuthenticatedRequest, 
  res: Response, 
  next: NextFunction
): Promise<void> => {
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

    if (user.role !== 'admin') {
      res.status(403).json({ 
        error: 'Admin access required.' 
      });
      return;
    }

    next();
  } catch (error) {
    console.error('Require admin middleware error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Middleware to check if user can access seller or admin features
export const requireSellerOrAdmin = async (
  req: AuthenticatedRequest, 
  res: Response, 
  next: NextFunction
): Promise<void> => {
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

    if (!user.isSeller && user.role !== 'admin') {
      res.status(403).json({ 
        error: 'Seller or admin access required.' 
      });
      return;
    }

    next();
  } catch (error) {
    console.error('Require seller or admin middleware error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};