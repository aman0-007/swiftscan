import { apiClient } from './apiClient';
import { Order } from '../types';

export interface CheckoutItemPayload {
  productId: string;
  quantity: number;
}

/**
 * Submits tote items for checkout via POST /api/Orders/checkout
 * Protected endpoint - requires Bearer token
 */
export async function checkoutOrder(items: CheckoutItemPayload[]): Promise<Order> {
  const response = await apiClient.post<Order>('/api/Orders/checkout', { items });
  return response.data;
}

/**
 * Retrieves the current customer's order history via GET /api/Orders/my-orders
 * Protected endpoint - requires Bearer token
 */
export async function getMyOrders(): Promise<Order[]> {
  const response = await apiClient.get<Order[]>('/api/Orders/my-orders');
  return response.data;
}
