import React, { useState } from 'react';
import { Download, Share } from 'lucide-react';
import { usePWAInstall } from '../../hooks/usePWAInstall';
import { IOSInstallModal } from './IOSInstallModal';

export const PWAInstallButton: React.FC = () => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  // Suppress if already running in standalone mode
  if (isInstalled) {
    return null;
  }

  // Chromium / Desktop / Android flow
  if (isInstallable) {
    return (
      <button
        id="pwa-install-btn"
        onClick={install}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200/60 text-xs font-semibold tracking-tight shadow-xs transition-all active:scale-95 cursor-pointer"
        title="Install SwiftScan to your device"
      >
        <Download className="w-3.5 h-3.5 text-teal-700" />
        <span>Install App</span>
      </button>
    );
  }

  // iOS Safari flow
  if (isIOS) {
    return (
      <>
        <button
          id="pwa-install-ios-btn"
          onClick={() => setShowIOSGuide(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200/60 text-xs font-semibold tracking-tight shadow-xs transition-all active:scale-95 cursor-pointer"
        >
          <Share className="w-3.5 h-3.5 text-teal-700" />
          <span>Add to Home</span>
        </button>

        <IOSInstallModal isOpen={showIOSGuide} onClose={() => setShowIOSGuide(false)} />
      </>
    );
  }

  return null;
};
