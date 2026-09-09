import React from 'react';
import { WifiOff } from 'lucide-react';
import { useOnlineStatus } from '../../hooks/useOnlineStatus';

export const OfflineBanner: React.FC = () => {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div
      id="offline-status-banner"
      className="fixed top-2 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-800 text-white text-xs font-medium shadow-md animate-bounce"
    >
      <WifiOff className="w-3.5 h-3.5 text-[#F2A68D]" />
      <span>Offline Mode — Scans saved locally</span>
    </div>
  );
};
