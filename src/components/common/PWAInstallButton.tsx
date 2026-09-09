import React, { useState } from 'react';
import { Download, Share, X } from 'lucide-react';
import { usePWAInstall } from '../../hooks/usePWAInstall';

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
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#8BA89F]/15 hover:bg-[#8BA89F]/25 text-[#4A635B] text-xs font-semibold tracking-tight transition-all active:scale-95"
        title="Install SwiftScan to your device"
      >
        <Download className="w-3.5 h-3.5 text-[#4A635B]" />
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
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#8BA89F]/15 hover:bg-[#8BA89F]/25 text-[#4A635B] text-xs font-semibold tracking-tight transition-all active:scale-95"
        >
          <Share className="w-3.5 h-3.5 text-[#4A635B]" />
          <span>Add to Home</span>
        </button>

        {showIOSGuide && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-xl border border-slate-100">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-bold text-slate-800">Install on iPhone</h3>
                <button
                  onClick={() => setShowIOSGuide(false)}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="space-y-3 text-xs text-slate-600 leading-relaxed">
                <div className="flex items-start gap-3 p-3 rounded-2xl bg-[#F9FAFB]">
                  <span className="w-6 h-6 rounded-full bg-[#8BA89F] text-white flex items-center justify-center font-bold text-[11px] shrink-0">
                    1
                  </span>
                  <p>
                    Tap the <strong>Share</strong> button (box with an arrow) in your Safari toolbar.
                  </p>
                </div>
                <div className="flex items-start gap-3 p-3 rounded-2xl bg-[#F9FAFB]">
                  <span className="w-6 h-6 rounded-full bg-[#8BA89F] text-white flex items-center justify-center font-bold text-[11px] shrink-0">
                    2
                  </span>
                  <p>
                    Scroll down and select <strong>&quot;Add to Home Screen&quot;</strong>.
                  </p>
                </div>
                <div className="flex items-start gap-3 p-3 rounded-2xl bg-[#F9FAFB]">
                  <span className="w-6 h-6 rounded-full bg-[#8BA89F] text-white flex items-center justify-center font-bold text-[11px] shrink-0">
                    3
                  </span>
                  <p>
                    Launch SwiftScan for an instantaneous, full-screen shopping experience!
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowIOSGuide(false)}
                className="mt-5 w-full py-2.5 rounded-2xl bg-[#8BA89F] text-white text-xs font-semibold hover:bg-[#78958c] transition-colors"
              >
                Got It
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  return null;
};
