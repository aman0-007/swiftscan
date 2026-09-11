import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Header } from './Header';
import { BottomNav } from './BottomNav';
import { OfflineBanner } from '../common/OfflineBanner';

export const AppLayout: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const hasSeenIntro = localStorage.getItem('hasSeenIntro') === 'true';

  if (!hasSeenIntro) {
    return <Navigate to="/app/onboarding" replace />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/app/login" replace />;
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col relative text-slate-900 selection:bg-orange-500/20">
      <OfflineBanner />
      <Header />
      <main className="flex-1 w-full">
        <Outlet />
      </main>
      <BottomNav />
    </div>
  );
};
