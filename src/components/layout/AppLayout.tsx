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
    return <Navigate to="/onboarding" replace />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-[#F9FAFB] flex flex-col relative text-slate-800 selection:bg-[#F2A68D]/30">
      <OfflineBanner />
      <Header />
      <main className="flex-1 w-full">
        <Outlet />
      </main>
      <BottomNav />
    </div>
  );
};
