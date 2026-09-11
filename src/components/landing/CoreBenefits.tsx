import React from 'react';
import { Clock, ShieldCheck, Leaf, CheckCircle2, Zap } from 'lucide-react';

export const CoreBenefits: React.FC = () => {
  const benefits = [
    {
      icon: Clock,
      stat: '15–25 min',
      statLabel: 'Saved Every Trip',
      title: 'Zero Waiting in Line',
      description:
        'Skip the dread of rush-hour checkout queues. Bag your items directly in the aisle, tap to pay on your phone, and walk out freely.',
      badge: 'Time Saved',
      accentColor: '#0F766E',
    },
    {
      icon: ShieldCheck,
      stat: '100% Exact',
      statLabel: 'Real-Time Tally',
      title: 'Total Budget Transparency',
      description:
        'Know your exact total—including sales tax, member savings, and discounts—as you put each product in your cart. No surprises.',
      badge: 'Peace of Mind',
      accentColor: '#14B8A6',
    },
    {
      icon: Leaf,
      stat: '0 Paper',
      statLabel: 'Digital Passports',
      title: 'Contactless & Eco-Friendly',
      description:
        'Every itemized receipt is instantly backed up to your digital wallet with an encrypted turnstile gate pass for store exit audits.',
      badge: 'Sustainable',
      accentColor: '#FF6B6B',
    },
  ];

  return (
    <section className="py-16 sm:py-24 bg-slate-50 border-t border-slate-200/60">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <span className="inline-flex items-center px-3.5 py-1.5 rounded-full text-xs font-semibold bg-teal-50 text-teal-800 border border-teal-200/70 mb-3 shadow-xs">
            Why Shoppers Love SwiftScan
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
            Engineered for Effortless Everyday Groceries
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-600 leading-relaxed">
            Designed to bring the speed of modern digital commerce directly into physical supermarket aisles.
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {benefits.map((benefit, idx) => {
            const Icon = benefit.icon;
            return (
              <div
                key={idx}
                className="rounded-3xl bg-white p-7 border border-slate-200/80 shadow-lg shadow-teal-900/5 hover:shadow-xl hover:shadow-teal-900/10 transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Top Badge & Metric */}
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[11px] font-semibold text-teal-800 bg-teal-50 border border-teal-200/60 px-2.5 py-1 rounded-full">
                      {benefit.badge}
                    </span>
                    <div className="w-10 h-10 rounded-2xl bg-teal-50 text-teal-700 flex items-center justify-center border border-teal-100">
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>

                  {/* Primary Metric Stat */}
                  <div className="mb-4">
                    <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                      {benefit.stat}
                    </div>
                    <div className="text-xs font-semibold text-slate-400 mt-0.5">
                      {benefit.statLabel}
                    </div>
                  </div>

                  {/* Headline & Description */}
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-2">
                    {benefit.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {benefit.description}
                  </p>
                </div>

                {/* Micro-benefit check */}
                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center gap-2 text-xs font-semibold text-teal-800">
                  <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
                  <span>Verified across participating grocery partners</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
