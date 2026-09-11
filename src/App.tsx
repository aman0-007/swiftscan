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
import { LandingPage } from './components/landing/LandingPage';

const AppRootRedirect: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const hasSeenIntro = localStorage.getItem('hasSeenIntro') === 'true';

  if (!hasSeenIntro) {
    return <Navigate to="/app/onboarding" replace />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/app/login" replace />;
  }

  return <Navigate to="/app/scanner" replace />;
};

const AppOnboardingRoute: React.FC = () => {
  const navigate = useNavigate();
  return (
    <OnboardingCarousel
      onComplete={() => {
        navigate('/app/login', { replace: true });
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
              {/* Root Route: Landing / Marketing Page */}
              <Route path="/" element={<LandingPage />} />

              {/* App Route Namespace */}
              <Route path="/app">
                <Route index element={<AppRootRedirect />} />
                <Route path="onboarding" element={<AppOnboardingRoute />} />
                <Route path="login" element={<LoginView />} />

                {/* Authenticated In-Store Flow */}
                <Route element={<AppLayout />}>
                  <Route path="scanner" element={<BarcodeScanner />} />
                  <Route path="scan" element={<BarcodeScanner />} />
                  <Route path="cart" element={<CartView />} />
                  <Route path="history" element={<OrdersView />} />
                  <Route path="profile" element={<ProfileView />} />
                </Route>
              </Route>

              {/* Seamless Legacy Redirects */}
              <Route path="/scanner" element={<Navigate to="/app/scanner" replace />} />
              <Route path="/scan" element={<Navigate to="/app/scanner" replace />} />
              <Route path="/cart" element={<Navigate to="/app/cart" replace />} />
              <Route path="/history" element={<Navigate to="/app/history" replace />} />
              <Route path="/profile" element={<Navigate to="/app/profile" replace />} />
              <Route path="/login" element={<Navigate to="/app/login" replace />} />
              <Route path="/onboarding" element={<Navigate to="/app/onboarding" replace />} />

              {/* 404 Catch All */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </BrowserRouter>

          {/* Sonner Notification Toaster */}
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
