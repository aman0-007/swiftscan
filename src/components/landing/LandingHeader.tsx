import React from 'react';
import { Smartphone } from 'lucide-react';
import { Logo } from '../common/Logo';
import { usePWAInstall } from '../../hooks/usePWAInstall';

interface LandingHeaderProps {
  onInstallClick: () => void;
  isMobile: boolean;
  isInstalled?: boolean;
}

export const LandingHeader: React.FC<LandingHeaderProps> = ({ onInstallClick, isMobile, isInstalled: isInstalledProp }) => {
  const { isInstalled, isInstallable, isIOS } = usePWAInstall();
  const effectiveInstalled = isInstalledProp ?? isInstalled;
  const showInstall = isMobile && !effectiveInstalled && (isInstallable || isIOS);

  return (
    <header className="sticky top-0 z-40 w-full bg-white/90 backdrop-blur-md border-b border-slate-200/80 shadow-xs transition-all">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-18 flex items-center justify-between">
        {/* Brand Logo */}
        <div className="flex items-center gap-3">
          <Logo size="md" showSubtitle />
          <span className="hidden sm:inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-teal-50 text-teal-800 border border-teal-200/70">
            Scan &amp; Go
          </span>
        </div>

        {/* Right Action buttons: strictly mobile install prompt, no web launch button */}
        <div className="flex items-center gap-2.5">
          {showInstall ? (
            <button
              id="landing-header-install-btn"
              onClick={onInstallClick}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold tracking-tight shadow-md shadow-orange-500/25 transition active:scale-95 cursor-pointer"
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Install App</span>
            </button>
          ) : (
            <div className="hidden sm:flex items-center gap-2 text-xs font-medium text-slate-600 bg-white border border-slate-200/80 px-3 py-1.5 rounded-full shadow-xs">
              <span className="w-2 h-2 rounded-full bg-teal-500 inline-block animate-pulse" />
              <span>PWA-Ready In-Store Terminal</span>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
