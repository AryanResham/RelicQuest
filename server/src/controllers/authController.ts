import { Request, Response } from 'express';
import { User } from '../models/index.js';

// Register user
export const register = async (req: Request, res: Response) => {
  try {
    const { email, password, firstName, lastName, authProvider = 'local' } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: `Email already registered with ${existingUser.authProvider} auth`
      });
    }

    // Create new user
    const user = new User({
      email,
      password,
      firstName,
      lastName,
      authProvider
    });

    await user.save();

    // Remove password from response
    const userResponse = user.toObject();
    delete userResponse.password;

    return res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: userResponse
    });
  } catch (error) {
    console.error('Error registering user:', error);
    return res.status(500).json({
      success: false,
      message: 'Error registering user'
    });
  }
};

// Login user
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check auth provider
    if (user.authProvider !== 'local') {
      return res.status(400).json({
        success: false,
        message: `This email is registered with ${user.authProvider} auth. Please use ${user.authProvider} login.`
      });
    }

    // Verify password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Remove password from response
    const userResponse = user.toObject();
    delete userResponse.password;

    return res.json({
      success: true,
      message: 'Login successful',
      data: userResponse
    });
  } catch (error) {
    console.error('Error logging in user:', error);
    return res.status(500).json({
      success: false,
      message: 'Error logging in user'
    });
  }
};

// Google OAuth handler
export const googleAuth = async (req: Request, res: Response) => {
  try {
    const { email, googleId, firstName, lastName } = req.body;

    // Check if user exists with local auth
    const existingUser = await User.findOne({ email });
    if (existingUser && existingUser.authProvider === 'local') {
      return res.status(400).json({
        success: false,
        message: 'This email is already registered with local auth. Please use email/password login.'
      });
    }

    // Find or create Google user
    let user = await User.findOne({ email, authProvider: 'google' });
    
    if (!user) {
      user = new User({
        email,
        googleId,
        firstName,
        lastName,
        authProvider: 'google',
        isVerified: true // Google emails are pre-verified
      });
      await user.save();
    }

    return res.json({
      success: true,
      message: 'Google authentication successful',
      data: user
    });
  } catch (error) {
    console.error('Error with Google auth:', error);
    return res.status(500).json({
      success: false,
      message: 'Error with Google authentication'
    });
  }
};

// Get user profile
export const getProfile = async (req: Request, res: Response) => {
  try {
    // This would typically use authentication middleware to get user ID
    const { userId } = req.params;
    
    const user = await User.findById(userId).select('-password');
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    return res.json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return res.status(500).json({
      success: false,
      message: 'Error fetching user profile'
    });
  }
};