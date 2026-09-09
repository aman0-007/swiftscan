export interface Product {
  id: string;
  barcode: string;
  name: string;
  price: number;
  stockQuantity: number;
  category?: string;
  imageUrl?: string;
  weightOrVolume?: string;
  description?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
}

export interface Order {
  id: string;
  totalAmount: number;
  status: 'Completed' | 'Processing' | 'Cancelled';
  createdAt: string;
  items: OrderItem[];
  storeName?: string;
  paymentMethod?: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  loyaltyPoints?: number;
  memberSince?: string;
}

export interface AuthResponse {
  token: string;
  user?: User;
}
