// Constants for the application
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500
} as const;

export const USER_ROLES = {
  CUSTOMER: 'customer',
  ADMIN: 'admin'
} as const;

export const AUTH_PROVIDERS = {
  LOCAL: 'local',
  GOOGLE: 'google'
} as const;

export const ORDER_STATUS = {
  PENDING: 'pending',
  PROCESSING: 'processing',
  SHIPPED: 'shipped',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled'
} as const;

export const PAYMENT_STATUS = {
  PENDING: 'pending',
  PAID: 'paid',
  FAILED: 'failed',
  REFUNDED: 'refunded'
} as const;

export const PRODUCT_CATEGORIES = {
  GAMING: 'Gaming',
  ELECTRONICS: 'Electronics',
  COLLECTIBLES: 'Collectibles',
  BOOKS: 'Books',
  TOYS: 'Toys',
  OTHER: 'Other'
} as const;

// API Messages
export const MESSAGES = {
  SUCCESS: {
    USER_REGISTERED: 'User registered successfully',
    LOGIN_SUCCESS: 'Login successful',
    PRODUCT_CREATED: 'Product created successfully',
    PRODUCT_UPDATED: 'Product updated successfully',
    PRODUCT_DELETED: 'Product deleted successfully'
  },
  ERROR: {
    USER_NOT_FOUND: 'User not found',
    PRODUCT_NOT_FOUND: 'Product not found',
    INVALID_CREDENTIALS: 'Invalid credentials',
    EMAIL_EXISTS: 'Email already exists',
    VALIDATION_ERROR: 'Validation error',
    INTERNAL_ERROR: 'Internal server error',
    UNAUTHORIZED: 'Unauthorized access'
  }
} as const;