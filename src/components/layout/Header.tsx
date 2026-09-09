import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin } from 'lucide-react';
import { Logo } from '../common/Logo';
import { PWAInstallButton } from '../common/PWAInstallButton';
import { useAuth } from '../../context/AuthContext';

export const Header: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-40 w-full bg-[#F9FAFB]/90 backdrop-blur-md border-b border-slate-200/50">
      <div className="max-w-md mx-auto px-4 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <div className="flex items-center gap-3">
          <Logo size="sm" />
          <div className="hidden min-[380px]:flex items-center gap-1 text-[11px] font-medium text-[#4A635B] bg-[#8BA89F]/15 px-2 py-0.5 rounded-full">
            <MapPin className="w-3 h-3 text-[#4A635B]" />
            <span className="truncate max-w-[90px]">Pine & 4th</span>
          </div>
        </div>

        {/* Right Action: PWA install + Avatar Greeting */}
        <div className="flex items-center gap-2">
          <PWAInstallButton />
          
          <button
            id="header-profile-btn"
            onClick={() => navigate('/profile')}
            className="flex items-center gap-1.5 p-1 pl-1.5 rounded-full bg-white hover:bg-slate-50 border border-slate-100 shadow-sm transition-all active:scale-95 group"
            title="View Profile & Settings"
          >
            <span className="text-xs font-medium text-slate-700 hidden sm:inline group-hover:text-slate-900">
              {user?.name?.split(' ')[0] || 'Member'}
            </span>
            <div className="w-8 h-8 rounded-full overflow-hidden bg-[#8BA89F]/20 border border-[#8BA89F]/30 flex items-center justify-center text-xs font-bold text-[#4A635B]">
              {user?.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.name || 'User'}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <span>{user?.name ? user.name[0].toUpperCase() : 'S'}</span>
              )}
            </div>
          </button>
        </div>
      </div>
    </header>
  );
};
