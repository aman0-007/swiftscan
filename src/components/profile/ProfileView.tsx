import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LogOut,
  Mail,
  Award,
  Sparkles,
  Shield,
  Smartphone,
  ChevronRight,
  Bell,
  Globe,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { PWAInstallButton } from '../common/PWAInstallButton';
import { toast } from 'sonner';

export const ProfileView: React.FC = () => {
  const { user, token, logout } = useAuth();
  const { clearCart } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    clearCart();
    toast.info('Signed out of SwiftScan');
    navigate('/login', { replace: true });
  };

  const memberBarcode = user?.id ? user.id.toUpperCase() : 'SWIFT-MEM-9842';
  const apiBase = '/api (Direct Express Engine)';

  return (
    <div className="pb-32 max-w-md mx-auto px-4 pt-3">
      {/* Page Title */}
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-bold tracking-tight text-slate-800">
          Member Account
        </h1>
        <div className="flex items-center gap-1.5 text-[11px] font-semibold text-[#4A635B] bg-[#8BA89F]/15 px-2.5 py-1 rounded-full">
          <Globe className="w-3 h-3" />
          <span>Active Session</span>
        </div>
      </div>

      {/* User Info Card */}
      <div className="p-5 rounded-3xl bg-white border border-slate-100 shadow-sm flex items-center gap-4">
        <div className="w-16 h-16 rounded-full overflow-hidden bg-[#8BA89F]/20 border-2 border-[#8BA89F]/30 flex items-center justify-center shrink-0">
          {user?.avatar ? (
            <img
              src={user.avatar}
              alt={user.name}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          ) : (
            <span className="text-xl font-bold text-[#4A635B]">
              {user?.name ? user.name[0] : 'S'}
            </span>
          )}
        </div>
        <div className="leading-tight flex-1">
          <h2 className="text-base font-bold text-slate-800">{user?.name || 'SwiftScan Member'}</h2>
          <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1">
            <Mail className="w-3.5 h-3.5 text-[#8BA89F]" />
            <span className="truncate">{user?.email || 'member@swiftscan.co'}</span>
          </div>
          <div className="flex items-center gap-1.5 mt-2">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#8BA89F]/15 text-[#4A635B]">
              <Award className="w-3 h-3" />
              {user?.loyaltyPoints ?? 120} SwiftPoints
            </span>
          </div>
        </div>
      </div>

      {/* In-Store Digital Member Card with Barcode */}
      <div className="mt-4 p-4 rounded-3xl bg-gradient-to-br from-[#4A635B] to-[#2E413B] text-white shadow-sm">
        <div className="flex justify-between items-start mb-3">
          <div>
            <span className="text-[10px] tracking-wider uppercase font-semibold text-[#8BA89F]">
              In-Store Membership
            </span>
            <div className="text-sm font-bold">Fast-Lane Pass</div>
          </div>
          <Sparkles className="w-4 h-4 text-[#F2A68D]" />
        </div>

        {/* Member Barcode */}
        <div className="bg-white p-2.5 rounded-2xl flex flex-col items-center">
          <div className="flex gap-1 h-8 items-center justify-center">
            <div className="w-1 h-full bg-slate-900" />
            <div className="w-2 h-full bg-slate-900" />
            <div className="w-0.5 h-full bg-slate-900" />
            <div className="w-2.5 h-full bg-slate-900" />
            <div className="w-1 h-full bg-slate-900" />
            <div className="w-1.5 h-full bg-slate-900" />
            <div className="w-3 h-full bg-slate-900" />
            <div className="w-1 h-full bg-slate-900" />
          </div>
          <span className="text-[9px] font-mono font-bold text-slate-500 tracking-widest mt-1">
            {memberBarcode}
          </span>
        </div>
      </div>

      {/* API Configuration Info Card */}
      <div className="mt-4 p-4 rounded-3xl bg-white border border-slate-100 shadow-sm text-xs">
        <div className="flex items-center justify-between mb-2">
          <span className="font-bold text-slate-800">Backend API Configuration</span>
          <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            Contract Configured
          </span>
        </div>

        <div className="space-y-1.5 text-[11px] text-slate-600 bg-slate-50 p-2.5 rounded-2xl border border-slate-100 font-mono">
          <div className="flex justify-between">
            <span className="text-slate-400">Base URL:</span>
            <span className="font-semibold text-slate-700 truncate max-w-[200px]" title={apiBase}>
              {apiBase}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Auth Token:</span>
            <span className="font-semibold text-slate-700 truncate max-w-[200px]">
              {token ? `Bearer ${token.substring(0, 16)}...` : 'None'}
            </span>
          </div>
        </div>
      </div>

      {/* App Settings Group */}
      <div className="mt-4 rounded-3xl bg-white border border-slate-100 shadow-sm overflow-hidden text-xs">
        <div className="p-3.5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600">
              <Smartphone className="w-4 h-4" />
            </div>
            <div>
              <span className="font-semibold text-slate-800">PWA Offline &amp; Home Screen</span>
              <p className="text-[10px] text-slate-400">Install for 1-tap instant launch</p>
            </div>
          </div>
          <PWAInstallButton />
        </div>

        <button
          onClick={() => toast.success('Audio chime active on scan')}
          className="w-full p-3.5 border-b border-slate-100 flex items-center justify-between hover:bg-slate-50 transition text-left"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <span className="font-semibold text-slate-800">Scan Sounds &amp; Haptics</span>
              <p className="text-[10px] text-slate-400">Audio chime on barcode read</p>
            </div>
          </div>
          <span className="text-[11px] font-medium text-emerald-600">Enabled</span>
        </button>

        <button
          onClick={() => toast.info('Current store: SwiftScan Market — Pine & 4th')}
          className="w-full p-3.5 flex items-center justify-between hover:bg-slate-50 transition text-left"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <span className="font-semibold text-slate-800">Payment Security</span>
              <p className="text-[10px] text-slate-400">Tokenized payment &amp; digital gate pass</p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400" />
        </button>
      </div>

      {/* Log Out Button */}
      <div className="mt-6">
        <button
          id="profile-logout-btn"
          onClick={handleLogout}
          className="w-full py-3.5 px-6 rounded-3xl bg-rose-50 hover:bg-rose-100/80 text-rose-600 font-semibold text-xs shadow-sm transition active:scale-[0.98] flex items-center justify-center gap-2"
        >
          <LogOut className="w-4 h-4" />
          <span>Log Out of SwiftScan</span>
        </button>
      </div>

      <div className="text-center text-[11px] text-slate-400 mt-4">
        SwiftScan v2.4.0 • Scan &amp; Go Retail Engine
      </div>
    </div>
  );
};
