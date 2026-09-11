import React from 'react';
import { X, Share2, PlusSquare, Smartphone } from 'lucide-react';

interface IOSInstallModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const IOSInstallModal: React.FC<IOSInstallModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl border border-slate-100">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-teal-50 text-teal-700 border border-teal-100 flex items-center justify-center font-bold">
              <Smartphone className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-800">Install SwiftScan on iPhone</h3>
              <p className="text-[10px] text-slate-400">Full-screen scan &amp; go experience</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-2.5 text-xs text-slate-600 leading-relaxed">
          <div className="flex items-start gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-200/70">
            <div className="w-6 h-6 rounded-full bg-teal-700 text-white flex items-center justify-center font-bold text-[11px] shrink-0">
              <Share2 className="w-3.5 h-3.5" />
            </div>
            <div>
              <p className="font-semibold text-slate-800">1. Tap Share in Safari</p>
              <p className="text-[11px] text-slate-500">
                Look for the share icon (square with arrow pointing up) in Safari&apos;s bottom navigation bar.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-200/70">
            <div className="w-6 h-6 rounded-full bg-teal-700 text-white flex items-center justify-center font-bold text-[11px] shrink-0">
              <PlusSquare className="w-3.5 h-3.5" />
            </div>
            <div>
              <p className="font-semibold text-slate-800">2. Select &apos;Add to Home Screen&apos;</p>
              <p className="text-[11px] text-slate-500">
                Scroll down through the share actions sheet and tap &quot;Add to Home Screen&quot;.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-200/70">
            <div className="w-6 h-6 rounded-full bg-orange-500 text-white flex items-center justify-center font-bold text-[11px] shrink-0">
              ✓
            </div>
            <div>
              <p className="font-semibold text-slate-800">3. Instant Camera Launch</p>
              <p className="text-[11px] text-slate-500">
                Launch SwiftScan from your home screen for rapid offline-ready barcode scanning.
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={onClose}
          className="mt-5 w-full py-3 rounded-2xl bg-teal-700 hover:bg-teal-800 text-white text-xs font-semibold shadow-md shadow-teal-900/20 transition active:scale-[0.98]"
        >
          Got It, Thanks!
        </button>
      </div>
    </div>
  );
};
