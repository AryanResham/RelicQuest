import axios from 'axios';
import type { Product } from '@/types/product';

const API_BASE_URL = 'http://localhost:5000';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor for debugging
api.interceptors.request.use(
  (config) => {
    console.log(`Making API request to: ${config.baseURL}${config.url}`);
    return config;
  },
  (error) => {
    console.error('API request error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('API response error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// API service functions
export const productAPI = {
  // Get all products
  getAllProducts: async (): Promise<Product[]> => {
    try {
      const response = await api.get('/products');
      return response.data.data || [];
    } catch (error) {
      console.error('Error fetching all products:', error);
      throw new Error('Failed to fetch products');
    }
  },

  // Get product by ID
  getProductById: async (id: string): Promise<Product | null> => {
    try {
      const response = await api.get(`/product/${id}`);
      return response.data.data || null;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        return null;
      }
      console.error('Error fetching product by ID:', error);
      throw new Error(`Failed to fetch product with ID: ${id}`);
    }
  },

  // Get flash sale products (first 4 products)
  getFlashSaleProducts: async (): Promise<Product[]> => {
    try {
      const allProducts = await productAPI.getAllProducts();
      return allProducts.filter(product => ["1", "2", "3", "4"].includes(product.id));
    } catch (error) {
      console.error('Error fetching flash sale products:', error);
      throw new Error('Failed to fetch flash sale products');
    }
  },

  // Get collectible products (last 4 products)
  getCollectibleProducts: async (): Promise<Product[]> => {
    try {
      const allProducts = await productAPI.getAllProducts();
      return allProducts.filter(product => ["5", "6", "7", "8"].includes(product.id));
    } catch (error) {
      console.error('Error fetching collectible products:', error);
      throw new Error('Failed to fetch collectible products');
    }
  },

  // Get products by category
  getProductsByCategory: async (category: string): Promise<Product[]> => {
    try {
      const allProducts = await productAPI.getAllProducts();
      return allProducts.filter(product => 
        product.category.toLowerCase() === category.toLowerCase()
      );
    } catch (error) {
      console.error('Error fetching products by category:', error);
      throw new Error(`Failed to fetch products in category: ${category}`);
    }
  }
};

// Health check function
export const healthCheck = async (): Promise<boolean> => {
  try {
    const response = await api.get('/');
    return response.status === 200;
  } catch (error) {
    console.error('Server health check failed:', error);
    return false;
  }
};

export default api;