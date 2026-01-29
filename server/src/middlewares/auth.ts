import type { Response, NextFunction } from 'express';
import { supabase } from '../config/supabase.js';
import type { AuthenticatedRequest } from '../types/types.js';

/**
 * Middleware to verify Supabase JWT token
 * Extracts Bearer token from Authorization header and verifies it
 * Attaches user info to req.user if valid
 */
export const verifyToken = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    // check if auth headers are present
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({
        success: false,
        error: 'No token provided. Authorization header must be: Bearer <token>',
      });
      return;
    }

    const token = authHeader.split(' ')[1];

    // Verify the token with Supabase
    const { data, error } = await supabase.auth.getUser(token);

    // check if user exists
    if (error || !data.user) {
      res.status(401).json({
        success: false,
        error: 'Invalid or expired token',
      });
      return;
    }

    // Attach user info to request
    req.user = {
      id: data.user.id,
      email: data.user.email || '',
    };

    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(500).json({
      success: false,
      error: 'Authentication failed',
    });
  }
};

// match parameter id to modify resource with id of authenticated user
export const isOwner = (paramName: string = 'id') => {
  return (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): void => {
    const resourceId = req.params[paramName];
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({
        success: false,
        error: 'Not authenticated',
      });
      return;
    }

    if (resourceId !== userId) {
      res.status(403).json({
        success: false,
        error: 'You can only modify your own resources',
      });
      return;
    }

    next();
  };
};
