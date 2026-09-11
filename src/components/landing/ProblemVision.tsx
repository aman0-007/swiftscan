import React from 'react';
import { motion } from 'framer-motion';
import { Clock, RefreshCw, AlertCircle, Check, ArrowRight, ShoppingCart, Zap } from 'lucide-react';

export const ProblemVision: React.FC = () => {
  return (
    <section className="py-16 sm:py-24 bg-white border-t border-slate-100/80">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Section Pill & Headline */}
        <div className="max-w-3xl mx-auto text-center mb-14 sm:mb-20">
          <span className="inline-flex items-center px-3.5 py-1.5 rounded-full text-xs font-semibold bg-teal-50 text-teal-800 border border-teal-200/70 mb-4 shadow-xs">
            The Story Behind SwiftScan
          </span>
          <h2 className="text-2xl sm:text-4xl lg:text-[40px] font-extrabold tracking-tight text-slate-900 leading-[1.2]">
            Physical grocery shopping hasn’t evolved in 40 years.
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">
            While digital commerce conquered 1-click convenience, buying an apple in a supermarket still involves 1980s-era checkout friction. We built SwiftScan to change that.
          </p>
        </div>

        {/* The Problem vs The Vision Comparative Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch mb-14">
          {/* Left: The Problem Card (Crisp White Card with soft layered shadow) */}
          <div className="lg:col-span-6 rounded-3xl bg-white p-7 sm:p-9 border border-slate-200/80 flex flex-col justify-between shadow-lg shadow-teal-900/5">
            <div>
              <div className="flex items-center justify-between mb-6">
                <span className="text-xs font-bold font-mono tracking-wider text-rose-500 uppercase bg-rose-50 px-3 py-1 rounded-full border border-rose-100">
                  The Problem
                </span>
                <span className="text-xs text-slate-400 font-medium">The Conventional Supermarket</span>
              </div>

              <h3 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight mb-4">
                The exhausting routine of registers &amp; waiting lines.
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed mb-6">
                Every week, shoppers endure an unnecessary obstacle course at the exit of their local grocery store:
              </p>

              {/* Specific Friction Points */}
              <div className="space-y-4">
                <div className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-slate-50 border border-slate-200/70 shadow-2xs">
                  <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0 mt-0.5">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-800">20-Minute Line Stalls</h4>
                    <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                      Peak hours bring serpentine queues where valuable personal time is lost standing idle behind full shopping carts.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-slate-50 border border-slate-200/70 shadow-2xs">
                  <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0 mt-0.5">
                    <RefreshCw className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-800">Tedious Double-Handling</h4>
                    <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                      You pack your cart in the aisles, unload every single item onto a conveyor belt, and reload them into bags all over again.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-slate-50 border border-slate-200/70 shadow-2xs">
                  <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0 mt-0.5">
                    <AlertCircle className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-800">The Register Anxiety Shock</h4>
                    <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                      Shopping without knowing your running total creates mental friction until the cashier announces the final bill with surprise taxes.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-5 border-t border-slate-200/60 flex items-center justify-between text-xs text-slate-500">
              <span>Average American grocery trip:</span>
              <span className="font-semibold text-rose-600">41 mins (24% spent in lines)</span>
            </div>
          </div>

          {/* Right: The Vision Card (Rich Deep Emerald & Teal Panel with layered depth) */}
          <div className="lg:col-span-6 rounded-3xl bg-gradient-to-br from-teal-800 via-teal-700 to-teal-900 text-white p-7 sm:p-9 border border-teal-600/30 flex flex-col justify-between shadow-xl shadow-teal-950/20 relative overflow-hidden">
            {/* Ambient subtle glow */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-teal-400/20 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10">
              <div className="flex items-center justify-between mb-6">
                <span className="text-xs font-bold font-mono tracking-wider text-white uppercase bg-white/15 px-3 py-1 rounded-full border border-white/20">
                  The Vision
                </span>
                <span className="text-xs text-teal-200 font-medium">The SwiftScan Paradigm</span>
              </div>

              <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight mb-4">
                Bring 1-click digital checkout into physical aisles.
              </h3>
              <p className="text-sm text-slate-200 leading-relaxed mb-6">
                We imagined a world where your phone transforms into your personal in-store checkout terminal:
              </p>

              {/* Vision Pillars */}
              <div className="space-y-4">
                <div className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-white/10 border border-white/15 backdrop-blur-xs">
                  <div className="w-9 h-9 rounded-xl bg-teal-600/40 text-teal-100 flex items-center justify-center shrink-0 mt-0.5">
                    <ShoppingCart className="w-4 h-4 text-teal-200" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">Scan Straight Into Your Bag</h4>
                    <p className="text-xs text-slate-200 mt-0.5 leading-relaxed">
                      Barcodes are scanned once as products leave the shelf. When you finish your shopping route, your tote is already packed.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-white/10 border border-white/15 backdrop-blur-xs">
                  <div className="w-9 h-9 rounded-xl bg-teal-600/40 text-teal-100 flex items-center justify-center shrink-0 mt-0.5">
                    <Zap className="w-4 h-4 text-teal-200" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">Continuous Cent-by-Cent Budget</h4>
                    <p className="text-xs text-slate-200 mt-0.5 leading-relaxed">
                      Watch your basket subtotal, item discounts, and local grocery taxes update in real time with 100% price transparency.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-white/10 border border-white/15 backdrop-blur-xs">
                  <div className="w-9 h-9 rounded-xl bg-orange-500/30 text-orange-400 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-4 h-4 stroke-[3]" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">Tap to Settle &amp; Stroll Out</h4>
                    <p className="text-xs text-slate-200 mt-0.5 leading-relaxed">
                      Biometric 1-tap settlement via Apple Pay, Google Pay, or card. Get an encrypted turnstile barcode and walk straight to your car.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-5 border-t border-white/15 flex items-center justify-between text-xs text-slate-200 relative z-10">
              <span>Checkout line duration with SwiftScan:</span>
              <span className="font-extrabold text-orange-400 text-sm">
                0 seconds
              </span>
            </div>
          </div>
        </div>

        {/* Founder / Mission Quote Banner */}
        <div className="rounded-3xl bg-teal-50/80 border border-teal-200/60 p-6 sm:p-8 text-center max-w-4xl mx-auto shadow-xs">
          <p className="text-sm sm:text-base font-medium text-slate-700 italic leading-relaxed">
            “Your time in a grocery store should be spent discovering seasonal produce and cooking inspiration—never waiting in line behind ten people just to hand over your money.”
          </p>
          <div className="mt-3 text-xs font-bold tracking-wide text-teal-800 uppercase">
            — The SwiftScan Founding Principle
          </div>
        </div>
      </div>
    </section>
  );
};
