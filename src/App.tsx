import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { AppLayout } from './components/layout/AppLayout';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { OnboardingCarousel } from './components/onboarding/OnboardingCarousel';
import { LoginView } from './components/auth/LoginView';
import { BarcodeScanner } from './components/scanner/BarcodeScanner';
import { CartView } from './components/cart/CartView';
import { OrdersView } from './components/orders/OrdersView';
import { ProfileView } from './components/profile/ProfileView';

const RootRedirect: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const hasSeenIntro = localStorage.getItem('hasSeenIntro') === 'true';

  if (!hasSeenIntro) {
    return <Navigate to="/onboarding" replace />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Navigate to="/scanner" replace />;
};

const OnboardingRoute: React.FC = () => {
  const navigate = useNavigate();
  return (
    <OnboardingCarousel
      onComplete={() => {
        navigate('/login', { replace: true });
      }}
    />
  );
};

export default function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <CartProvider>
          <BrowserRouter>
            <Routes>
              {/* Root dispatcher */}
              <Route path="/" element={<RootRedirect />} />

              {/* Public Flow */}
              <Route path="/onboarding" element={<OnboardingRoute />} />
              <Route path="/login" element={<LoginView />} />

              {/* Protected Flow */}
              <Route element={<AppLayout />}>
                <Route path="/scanner" element={<BarcodeScanner />} />
                <Route path="/cart" element={<CartView />} />
                <Route path="/history" element={<OrdersView />} />
                <Route path="/profile" element={<ProfileView />} />
              </Route>

              {/* 404 Catch All */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </BrowserRouter>

          {/* Sonner Toaster */}
          <Toaster
            position="top-center"
            toastOptions={{
              style: {
                background: '#FFFFFF',
                color: '#1E293B',
                borderRadius: '20px',
                border: '1px solid #E2E8F0',
                boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.08)',
                fontFamily: "'Plus Jakarta Sans', sans-serif",
              },
            }}
          />
        </CartProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}
