import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Smartphone, X } from 'lucide-react';

interface InstallSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const InstallSuccessModal: React.FC<InstallSuccessModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="bg-white rounded-3xl p-6 sm:p-7 max-w-sm w-full border border-slate-200/80 shadow-2xl relative text-center"
        >
          <button
            onClick={onClose}
            aria-label="Close"
            className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="w-14 h-14 rounded-2xl bg-teal-50 text-teal-700 border border-teal-100 flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-7 h-7 text-teal-700" />
          </div>

          <h3 className="text-lg font-extrabold text-slate-900 tracking-tight mb-2">
            SwiftScan is Installed!
          </h3>

          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-6">
            The scan &amp; go terminal has been added to your phone. To begin in-store checkout, please <strong>open the SwiftScan icon on your home screen</strong>.
          </p>

          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 mb-6 text-left flex items-start gap-3">
            <Smartphone className="w-5 h-5 text-teal-700 shrink-0 mt-0.5" />
            <p className="text-xs text-slate-500 leading-relaxed">
              The full shopping, barcode scanning, and 1-click exit experience runs inside the installed mobile app.
            </p>
          </div>

          <button
            onClick={onClose}
            className="w-full py-3.5 rounded-2xl bg-teal-700 hover:bg-teal-800 text-white text-xs sm:text-sm font-bold shadow-md shadow-teal-900/20 transition active:scale-98 cursor-pointer"
          >
            Got It, Thanks!
          </button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
