import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';

// Base URL: empty string forces same-origin requests through the Express server
const API_BASE_URL = '';

/**
 * Axios client instance configured with defaults and interceptors
 */
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Request Interceptor:
 * Attaches the JWT Bearer token from localStorage to every outgoing request
 */
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    try {
      const token = localStorage.getItem('swiftscan_token');
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch {
      // Ignore localStorage read errors in restricted contexts
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Response Interceptor:
 * Standardizes API error messages for clear UI presentation
 */
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ message?: string; error?: string }>) => {
    if (error.response) {
      const data = error.response.data;
      const serverMessage = data?.message || data?.error;
      const status = error.response.status;

      if (status === 401) {
        const customError = new Error(serverMessage || 'Invalid credentials or unauthorized');
        return Promise.reject(customError);
      }
      if (status === 404) {
        const customError = new Error(serverMessage || 'Requested item or record not found');
        return Promise.reject(customError);
      }
      const customError = new Error(
        serverMessage || `Server responded with status code ${status}`
      );
      return Promise.reject(customError);
    } else if (error.request) {
      return Promise.reject(
        new Error('Unable to connect to the store network. Please verify connection.')
      );
    }
    return Promise.reject(error);
  }
);
