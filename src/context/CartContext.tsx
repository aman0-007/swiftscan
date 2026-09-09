import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Product, CartItem } from '../types';
import { toast } from 'sonner';

interface CartContextType {
  cartItems: CartItem[];
  recentScans: Product[];
  itemCount: number;
  subtotal: number;
  taxAmount: number;
  totalAmount: number;
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  getItemQuantity: (productId: string) => number;
  clearCart: () => void;
  playScanChime: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'swiftscan_cart';
const RECENT_STORAGE_KEY = 'swiftscan_recent_scans';

// Subtle Web Audio API chime for responsive retail feel
function triggerBeep() {
  try {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    // Two-tone pleasant high ping
    osc.frequency.setValueAtTime(880, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(1320, ctx.currentTime + 0.08);

    gain.gain.setValueAtTime(0.12, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.18);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.2);
  } catch {
    // AudioContext autoplay restrictions or unsupported
  }
}

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return [];
  });

  const [recentScans, setRecentScans] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem(RECENT_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return [];
  });

  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
    } catch {
      // ignore
    }
  }, [cartItems]);

  useEffect(() => {
    try {
      localStorage.setItem(RECENT_STORAGE_KEY, JSON.stringify(recentScans));
    } catch {
      // ignore
    }
  }, [recentScans]);

  const playScanChime = useCallback(() => {
    triggerBeep();
    if ('vibrate' in navigator) {
      try {
        navigator.vibrate(40);
      } catch {
        // ignore
      }
    }
  }, []);

  const addItem = useCallback((product: Product, quantity = 1) => {
    playScanChime();

    setCartItems((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [{ product, quantity }, ...prev];
    });

    // Update recent scans list (keep top 6 unique items)
    setRecentScans((prev) => {
      const filtered = prev.filter((p) => p.id !== product.id);
      return [product, ...filtered].slice(0, 6);
    });

    toast.success(`Scanned: ${product.name}`, {
      description: `$${product.price.toFixed(2)} added to cart`,
      duration: 2500,
      position: 'top-center',
    });
  }, [playScanChime]);

  const removeItem = useCallback((productId: string) => {
    setCartItems((prev) => prev.filter((item) => item.product.id !== productId));
    setRecentScans((prev) => prev.filter((p) => p.id !== productId));
  }, []);

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(productId);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  }, [removeItem]);

  const getItemQuantity = useCallback(
    (productId: string) => {
      const item = cartItems.find((i) => i.product.id === productId);
      return item ? item.quantity : 0;
    },
    [cartItems]
  );

  const clearCart = useCallback(() => {
    setCartItems([]);
    setRecentScans([]);
    localStorage.removeItem(CART_STORAGE_KEY);
    localStorage.removeItem(RECENT_STORAGE_KEY);
  }, []);

  const itemCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const subtotal = +cartItems
    .reduce((acc, item) => acc + item.product.price * item.quantity, 0)
    .toFixed(2);
  const taxAmount = +(subtotal * 0.0825).toFixed(2);
  const totalAmount = +(subtotal + taxAmount).toFixed(2);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        recentScans,
        itemCount,
        subtotal,
        taxAmount,
        totalAmount,
        addItem,
        removeItem,
        updateQuantity,
        getItemQuantity,
        clearCart,
        playScanChime,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
