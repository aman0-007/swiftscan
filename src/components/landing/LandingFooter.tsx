import React from 'react';
import { Logo } from '../common/Logo';
import { ShieldCheck, Smartphone, QrCode } from 'lucide-react';

interface LandingFooterProps {
  onInstallClick?: () => void;
  isMobile?: boolean;
  isInstalled?: boolean;
}

export const LandingFooter: React.FC<LandingFooterProps> = ({ onInstallClick, isMobile, isInstalled }) => {
  return (
    <footer className="bg-white border-t border-slate-200/80 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pb-8 border-b border-slate-100">
          <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
            <Logo size="sm" showSubtitle />
            <span className="hidden sm:inline text-slate-300">|</span>
            <p className="text-xs text-slate-500">
              Smart scan &amp; go checkout platform for modern physical supermarkets.
            </p>
          </div>

          {/* Device-aware action in footer (No direct web app link) */}
          <div>
            {isMobile ? (
              isInstalled ? (
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-teal-50 text-teal-800 text-xs font-semibold border border-teal-200/60 shadow-xs">
                  <Smartphone className="w-4 h-4 text-teal-700" />
                  <span>SwiftScan Installed • Ready on Home Screen</span>
                </div>
              ) : (
                <button
                  id="footer-install-app-btn"
                  onClick={onInstallClick}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-orange-500 hover:bg-orange-600 text-white text-xs sm:text-sm font-bold shadow-md shadow-orange-500/25 transition active:scale-95 cursor-pointer"
                >
                  <Smartphone className="w-4 h-4" />
                  <span>Install Mobile App</span>
                </button>
              )
            ) : (
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-slate-50 text-slate-600 text-xs font-medium border border-slate-200/60">
                <QrCode className="w-4 h-4 text-teal-700" />
                <span>Scan QR code above to install on phone</span>
              </div>
            )}
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-400">
          <div className="flex items-center gap-4">
            <span>© {new Date().getFullYear()} SwiftScan Technologies.</span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
              PCI-DSS Compliant Payments
            </span>
          </div>

          <div className="flex items-center gap-1">
            <span>Crafted for frictionless in-store grocery shopping</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
