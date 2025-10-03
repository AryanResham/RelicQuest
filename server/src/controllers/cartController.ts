import { Response } from 'express';
import User from '../models/User';
import Product from '../models/Product';
import { AuthenticatedRequest } from '../types/auth';

// Add item to cart
export const addToCart = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { productId, quantity = 1 } = req.body;
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

    // Find user and check if item already in cart
    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    // Check if product is already in cart
    const existingCartItem = user.cart.find(
      item => item.productId.toString() === productId
    );

    if (existingCartItem) {
      // Update quantity if item already exists
      existingCartItem.quantity += quantity;
    } else {
      // Add new item to cart
      user.cart.push({
        productId,
        quantity,
        addedAt: new Date()
      });
    }

    await user.save();

    // Return updated cart with populated product data
    const updatedUser = await User.findById(userId)
      .populate({
        path: 'cart.productId',
        select: 'name price image rating isAuction'
      });

    res.status(200).json({
      message: 'Item added to cart successfully',
      cart: updatedUser?.cart || []
    });

  } catch (error) {
    console.error('Add to cart error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Remove item from cart
export const removeFromCart = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
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

    // Remove item from cart
    user.cart = user.cart.filter(
      item => item.productId.toString() !== productId
    );

    await user.save();

    // Return updated cart with populated product data
    const updatedUser = await User.findById(userId)
      .populate({
        path: 'cart.productId',
        select: 'name price image rating isAuction'
      });

    res.status(200).json({
      message: 'Item removed from cart successfully',
      cart: updatedUser?.cart || []
    });

  } catch (error) {
    console.error('Remove from cart error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Update cart item quantity
export const updateCartQuantity = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { productId } = req.params;
    const { quantity } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({ error: 'Authentication required' });
      return;
    }

    if (!quantity || quantity < 1) {
      res.status(400).json({ error: 'Valid quantity is required' });
      return;
    }

    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    // Find and update cart item
    const cartItem = user.cart.find(
      item => item.productId.toString() === productId
    );

    if (!cartItem) {
      res.status(404).json({ error: 'Item not found in cart' });
      return;
    }

    cartItem.quantity = quantity;
    await user.save();

    // Return updated cart with populated product data
    const updatedUser = await User.findById(userId)
      .populate({
        path: 'cart.productId',
        select: 'name price image rating isAuction'
      });

    res.status(200).json({
      message: 'Cart updated successfully',
      cart: updatedUser?.cart || []
    });

  } catch (error) {
    console.error('Update cart error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get user's cart
export const getCart = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({ error: 'Authentication required' });
      return;
    }

    const user = await User.findById(userId)
      .populate({
        path: 'cart.productId',
        select: 'name price image rating isAuction user',
        populate: {
          path: 'user',
          select: 'firstName lastName sellerProfile.storeName'
        }
      });

    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    // Calculate cart totals
    const cartWithTotals = user.cart.map((item, index) => {
      const product = item.productId as any;
      return {
        _id: index, // Using index as ID since cart items don't have individual IDs
        product: product,
        quantity: item.quantity,
        addedAt: item.addedAt,
        subtotal: product.price * item.quantity
      };
    });

    const total = cartWithTotals.reduce((sum, item) => sum + item.subtotal, 0);

    res.status(200).json({
      cart: cartWithTotals,
      totalItems: user.cart.length,
      totalAmount: total
    });

  } catch (error) {
    console.error('Get cart error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Clear entire cart
export const clearCart = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
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

    user.cart = [];
    await user.save();

    res.status(200).json({
      message: 'Cart cleared successfully',
      cart: []
    });

  } catch (error) {
    console.error('Clear cart error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};