import React, { createContext, useContext, useState, useCallback } from 'react';
import { User } from '../types';
import { loginUser } from '../services/api';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const TOKEN_KEY = 'swiftscan_token';
const USER_KEY = 'swiftscan_user';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem(TOKEN_KEY));
  const [user, setUser] = useState<User | null>(() => {
    try {
      const savedUser = localStorage.getItem(USER_KEY);
      if (savedUser) return JSON.parse(savedUser);
    } catch {
      // ignore
    }
    return null;
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    try {
      // POST /api/Auth/login -> returns { token }
      const data = await loginUser(email, password);
      setToken(data.token);
      localStorage.setItem(TOKEN_KEY, data.token);

      // Prefer server-returned user profile, or derive fallback user state
      const cleanEmail = email.trim();
      const displayName = cleanEmail
        .split('@')[0]
        .replace(/[._]/g, ' ')
        .replace(/\b\w/g, (char) => char.toUpperCase());

      const activeUser: User = data.user
        ? {
            id: data.user.id,
            email: data.user.email,
            name: data.user.name,
            avatar: data.user.avatar,
            loyaltyPoints: data.user.loyaltyPoints ?? 250,
            memberSince: data.user.memberSince ?? 'Member',
          }
        : {
            id: `usr_${cleanEmail.replace(/[^a-zA-Z0-9]/g, '_')}`,
            email: cleanEmail,
            name: displayName,
            loyaltyPoints: 120,
            memberSince: 'Member',
          };

      setUser(activeUser);
      localStorage.setItem(USER_KEY, JSON.stringify(activeUser));
      setIsLoading(false);
      return true;
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : 'Invalid credentials. Please check your email and password.';
      setError(message);
      setIsLoading(false);
      return false;
    }
  };

  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token,
        isLoading,
        error,
        login,
        logout,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
