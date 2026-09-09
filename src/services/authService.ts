import { apiClient } from './apiClient';

export interface LoginResponse {
  token: string;
  user?: {
    id: string;
    email: string;
    name: string;
    avatar?: string;
    loyaltyPoints?: number;
    memberSince?: string;
  };
}

/**
 * Authenticates user credentials with POST /api/Auth/login
 */
export async function loginUser(email: string, password: string): Promise<LoginResponse> {
  const response = await apiClient.post<LoginResponse>('/api/Auth/login', {
    email: email.trim(),
    password: password.trim(),
  });
  return response.data;
}
