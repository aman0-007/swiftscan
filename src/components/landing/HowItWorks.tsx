import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Calculator, CreditCard, Check, ShieldCheck, ArrowRight } from 'lucide-react';

export const HowItWorks: React.FC = () => {
  const [activeStep, setActiveStep] = useState<number>(0);

  const steps = [
    {
      id: 0,
      stepNumber: '01',
      badge: 'Scan in Aisle',
      title: 'Scan as You Shop',
      description:
        'Point your smartphone camera at barcodes as items go straight into your physical tote. Enjoy instant price lookup and real-time shelf stock confirmation.',
      icon: Camera,
      color: '#0F766E',
      interactiveLabel: 'Tap to see live scanner simulation',
    },
    {
      id: 1,
      stepNumber: '02',
      badge: 'Transparent Math',
      title: 'Know Your Total',
      description:
        'No surprise shocks at the register. Watch your cart total calculate live with local grocery taxes, active member discounts, and loyalty rewards points.',
      icon: Calculator,
      color: '#0F766E',
      interactiveLabel: 'Tap to inspect live budget tally',
    },
    {
      id: 2,
      stepNumber: '03',
      badge: 'Instant Exit',
      title: 'Tap & Stroll Out',
      description:
        'Pay with Apple Pay, Google Pay, or your saved credit card in 1 tap. Receive a certified digital receipt with an exit turnstile QR gate pass ready for inspection.',
      icon: CreditCard,
      color: '#FF6B6B',
      interactiveLabel: 'Tap to preview digital receipt',
    },
  ];

  return (
    <section className="py-16 sm:py-24 bg-white border-y border-slate-200/60">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <span className="inline-flex items-center px-3.5 py-1.5 rounded-full text-xs font-semibold bg-teal-50 text-teal-800 border border-teal-200/70 mb-3 shadow-xs">
            Three Seamless Steps
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
            How SwiftScan Works
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-600 leading-relaxed">
            The friction-free retail experience that turns your smartphone into a personal cashier.
          </p>
        </div>

        {/* 3 Step Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            const isSelected = activeStep === idx;

            return (
              <div
                key={step.id}
                onClick={() => setActiveStep(idx)}
                className={`group cursor-pointer rounded-3xl p-7 transition-all duration-300 border flex flex-col justify-between ${
                  isSelected
                    ? 'bg-white border-teal-600 shadow-xl shadow-teal-900/10 ring-2 ring-teal-600/20'
                    : 'bg-white border-slate-200/80 shadow-lg shadow-teal-900/5 hover:border-teal-200 hover:shadow-xl'
                }`}
              >
                <div>
                  {/* Top Row: Step Tag + Icon */}
                  <div className="flex items-center justify-between mb-5">
                    <span className="text-xs font-bold font-mono tracking-widest text-slate-400">
                      STEP {step.stepNumber}
                    </span>
                    <div
                      className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-all ${
                        isSelected
                          ? 'bg-teal-700 text-white shadow-md shadow-teal-900/25'
                          : 'bg-teal-50 text-teal-700 group-hover:bg-teal-100'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>

                  {/* Title & Description */}
                  <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-2.5">
                    {step.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {step.description}
                  </p>
                </div>

                {/* Step Preview Box */}
                <div className="mt-6 pt-5 border-t border-slate-100">
                  {idx === 0 && (
                    <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 shadow-2xs flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-slate-900 text-white flex items-center justify-center relative shrink-0">
                        <div className="w-4 h-4 border-t-2 border-l-2 border-teal-400 rounded-tl-xs absolute top-1 left-1" />
                        <span className="text-[10px] font-mono">|||</span>
                      </div>
                      <div className="flex-1 min-w-0 text-left">
                        <div className="text-xs font-bold text-slate-900 truncate">
                          Hass Avocados (2 pk)
                        </div>
                        <div className="text-[11px] text-teal-700 font-bold">
                          $2.99 • Ready to bag
                        </div>
                      </div>
                      <span className="text-[10px] bg-teal-50 text-teal-800 border border-teal-200/60 px-2 py-0.5 rounded-full font-bold">
                        Scanned
                      </span>
                    </div>
                  )}

                  {idx === 1 && (
                    <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 shadow-2xs space-y-1.5 text-xs">
                      <div className="flex justify-between text-slate-500 text-[11px]">
                        <span>Subtotal (3 items)</span>
                        <span className="font-semibold text-slate-700">$13.37</span>
                      </div>
                      <div className="flex justify-between text-slate-500 text-[11px]">
                        <span>Member Savings (10%)</span>
                        <span className="font-semibold text-teal-700">-$1.34</span>
                      </div>
                      <div className="flex justify-between font-bold text-slate-900 pt-1 border-t border-slate-200/60 text-xs">
                        <span>Cart Total</span>
                        <span className="text-teal-700 font-extrabold">$12.03</span>
                      </div>
                    </div>
                  )}

                  {idx === 2 && (
                    <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 shadow-2xs flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-xl bg-teal-50 text-teal-700 border border-teal-100 flex items-center justify-center font-bold">
                          <Check className="w-4 h-4 stroke-[3]" />
                        </div>
                        <div>
                          <div className="text-xs font-bold text-slate-900">Paid • Apple Pay</div>
                          <div className="text-[10px] text-slate-400">Exit Turnstile Pass #892</div>
                        </div>
                      </div>
                      <ShieldCheck className="w-4 h-4 text-teal-600" />
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
