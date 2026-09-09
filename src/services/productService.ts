import { apiClient } from './apiClient';
import { Product } from '../types';

/**
 * Queries the product catalog by barcode with GET /api/Products/{barcode}
 * Public endpoint - no authorization header required
 */
export async function getProductByBarcode(barcode: string): Promise<Product> {
  const cleanBarcode = encodeURIComponent(barcode.trim());
  const response = await apiClient.get<Product>(`/api/Products/${cleanBarcode}`);
  return response.data;
}
