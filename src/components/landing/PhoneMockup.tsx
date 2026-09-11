import React from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag, Check, Wifi, Battery } from 'lucide-react';

export const PhoneMockup: React.FC = () => {
  return (
    <div className="relative mx-auto w-full max-w-[320px] sm:max-w-[340px]">
      {/* Soft atmospheric ambient glow behind phone */}
      <div className="absolute -inset-4 rounded-[48px] bg-gradient-to-tr from-teal-500/30 via-orange-500/20 to-teal-500/15 blur-2xl -z-10" />

      {/* Modern Smartphone Hardware Enclosure */}
      <div className="relative rounded-[40px] bg-slate-900 p-3 shadow-2xl shadow-teal-950/40 border-4 border-slate-800 ring-1 ring-white/20">
        {/* Dynamic Island / Earpiece pill */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 w-24 h-4 bg-black rounded-full z-30 flex items-center justify-end px-2">
          <div className="w-2 h-2 rounded-full bg-slate-800/80 ring-1 ring-slate-700" />
        </div>

        {/* Screen Bezel Interior */}
        <div className="relative rounded-[32px] bg-[#0F172A] overflow-hidden text-white flex flex-col h-[520px] select-none">
          {/* Simulated Mobile Status Bar */}
          <div className="pt-2 px-5 pb-1 flex items-center justify-between text-[11px] font-medium text-slate-300 z-20">
            <span>9:41</span>
            <div className="flex items-center gap-1.5 text-slate-300">
              <Wifi className="w-3 h-3" />
              <Battery className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* In-App Header Bar */}
          <div className="px-4 py-2 border-b border-white/10 flex items-center justify-between bg-slate-900/60 backdrop-blur-sm z-20">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-teal-700 flex items-center justify-center font-bold text-xs text-white shadow-sm shadow-teal-900/30">
                S
              </div>
              <div className="leading-tight">
                <div className="text-[11px] font-bold text-white flex items-center gap-1">
                  SwiftScan Market
                </div>
                <span className="text-[9px] text-teal-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-teal-400 inline-block animate-pulse" />
                  Pine &amp; 4th In-Store
                </span>
              </div>
            </div>
            <div className="text-[10px] font-semibold bg-white/10 px-2 py-0.5 rounded-full text-slate-300">
              Aisle 4
            </div>
          </div>

          {/* Active Camera Viewfinder Area */}
          <div className="relative flex-1 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 flex flex-col items-center justify-center overflow-hidden p-4">
            {/* Viewfinder Target Reticle Frame */}
            <div className="relative w-52 h-52 rounded-2xl border-2 border-dashed border-white/30 flex items-center justify-center">
              {/* Four High-Contrast Reticle Corner Brackets */}
              <div className="absolute -top-1 -left-1 w-5 h-5 border-t-3 border-l-3 border-teal-400 rounded-tl-lg" />
              <div className="absolute -top-1 -right-1 w-5 h-5 border-t-3 border-r-3 border-teal-400 rounded-tr-lg" />
              <div className="absolute -bottom-1 -left-1 w-5 h-5 border-b-3 border-l-3 border-teal-400 rounded-bl-lg" />
              <div className="absolute -bottom-1 -right-1 w-5 h-5 border-b-3 border-r-3 border-teal-400 rounded-br-lg" />

              {/* Realistic Barcode graphic being scanned */}
              <div className="w-36 h-28 bg-white/95 rounded-xl p-3 shadow-lg flex flex-col items-center justify-between border border-white/20">
                <div className="text-[9px] font-bold text-slate-700 tracking-wider uppercase">
                  Organic Whole Milk
                </div>
                <div className="flex gap-1 items-center h-12 w-full justify-center">
                  <div className="w-1.5 h-full bg-slate-900" />
                  <div className="w-0.5 h-full bg-slate-900" />
                  <div className="w-2.5 h-full bg-slate-900" />
                  <div className="w-1 h-full bg-slate-900" />
                  <div className="w-0.5 h-full bg-slate-900" />
                  <div className="w-3 h-full bg-slate-900" />
                  <div className="w-1.5 h-full bg-slate-900" />
                  <div className="w-0.5 h-full bg-slate-900" />
                  <div className="w-2 h-full bg-slate-900" />
                  <div className="w-1 h-full bg-slate-900" />
                </div>
                <span className="font-mono text-[8px] tracking-widest text-slate-500">
                  793573189240
                </span>
              </div>

              {/* Sweeping Laser Beam */}
              <motion.div
                animate={{ y: [-70, 70, -70] }}
                transition={{ repeat: Infinity, duration: 2.2, ease: 'easeInOut' }}
                className="absolute inset-x-2 h-[2.5px] bg-orange-500 shadow-[0_0_14px_#FF6B6B]"
              />
            </div>

            {/* Simulated Live Detection Toast Pop-in */}
            <motion.div
              initial={{ y: 20, opacity: 0, scale: 0.9 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              transition={{ repeat: Infinity, repeatDelay: 3.5, duration: 0.4 }}
              className="absolute top-4 inset-x-4 bg-white text-slate-800 p-2.5 rounded-2xl shadow-xl border border-slate-100 flex items-center gap-2.5 z-20"
            >
              <div className="w-8 h-8 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center shrink-0">
                <Check className="w-4 h-4 stroke-[3]" />
              </div>
              <div className="flex-1 min-w-0 leading-tight">
                <div className="text-[11px] font-bold truncate">Organic Whole Milk (1 Gal)</div>
                <div className="text-[10px] text-slate-500 flex items-center gap-1">
                  <span className="font-semibold text-teal-700">$4.89</span>
                  <span>• Added to tote</span>
                </div>
              </div>
              <span className="text-[10px] font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-full">
                +1
              </span>
            </motion.div>
          </div>

          {/* Bottom Dock / Floating Tote Bar */}
          <div className="p-3 bg-slate-900/90 border-t border-white/10 backdrop-blur-md">
            <div className="p-2.5 rounded-2xl bg-white/10 border border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-teal-700 text-white flex items-center justify-center shadow-sm">
                  <ShoppingBag className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[11px] font-bold text-white">2 Items in Tote</div>
                  <div className="text-[10px] text-teal-300">Tax incl. • $10.38</div>
                </div>
              </div>
              <button className="px-3.5 py-1.5 rounded-xl bg-orange-500 text-white text-[11px] font-bold shadow-md shadow-orange-500/30">
                <span>Pay &amp; Exit</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
