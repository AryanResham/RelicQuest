import { productAPI } from "@/services/api"
import type { Product } from "@/types/product"

// Re-export API functions for backward compatibility
export const getAllProducts = productAPI.getAllProducts
export const getProductById = productAPI.getProductById
export const getFlashSaleProducts = productAPI.getFlashSaleProducts
export const getCollectibleProducts = productAPI.getCollectibleProducts
export const getProductsByCategory = productAPI.getProductsByCategory

// Legacy exports - these functions now use the API
export { getAllProducts as allProducts }

// Backward compatible sync functions with fallback (will be replaced by async calls)
export function getProductByIdSync(_id: string): Product | undefined {
  console.warn('getProductByIdSync is deprecated. Use getProductById (async) instead.');
  return undefined;
}