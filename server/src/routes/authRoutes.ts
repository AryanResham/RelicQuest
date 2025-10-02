import { Router } from 'express';
import {
  register,
  login,
  googleAuth,
  getProfile
} from '../controllers/authController.js';
import { validateRequiredFields, validateEmail } from '../middlewares/validation.js';

const router = Router();

// Authentication routes
router.post('/register',
  validateRequiredFields(['email', 'password', 'firstName', 'lastName']),
  validateEmail,
  register
);

router.post('/login',
  validateRequiredFields(['email', 'password']),
  validateEmail,
  login
);

router.post('/google',
  validateRequiredFields(['email', 'googleId', 'firstName', 'lastName']),
  validateEmail,
  googleAuth
);

// User profile routes
router.get('/profile/:userId', getProfile);

export default router;