import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showSubtitle?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ size = 'md', showSubtitle = false }) => {
  const iconSizes = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-10 h-10',
    xl: 'w-14 h-14',
  };

  const textSizes = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl',
    xl: 'text-3xl sm:text-4xl',
  };

  return (
    <div className="flex items-center gap-2.5 select-none" id="swiftscan-logo">
      <div
        className={`${iconSizes[size]} rounded-2xl bg-gradient-to-br from-[#0F766E] to-teal-800 p-1.5 flex items-center justify-center shadow-md shadow-teal-900/15 relative overflow-hidden group`}
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          className="w-full h-full text-white"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {/* Subtle Corner Reticle */}
          <path d="M4 8V5a1 1 0 0 1 1-1h3" />
          <path d="M16 4h3a1 1 0 0 1 1 1v3" />
          <path d="M4 16v3a1 1 0 0 0 1 1h3" />
          <path d="M16 20h3a1 1 0 0 0 1-1v-3" />
          {/* Barcode Lines */}
          <path d="M8 8v8" strokeWidth="2.4" />
          <path d="M11 8v8" strokeWidth="1.6" />
          <path d="M14 8v8" strokeWidth="2.4" />
          <path d="M16.5 8v8" strokeWidth="1.6" />
        </svg>
        {/* Vibrant coral scan beam shimmer */}
        <div className="absolute inset-x-0 h-[2px] bg-orange-500 top-1/2 -translate-y-1/2 opacity-95 shadow-[0_0_10px_#FF6B6B]" />
      </div>

      <div className="flex flex-col leading-tight">
        <div className={`font-bold tracking-tight ${textSizes[size]} text-slate-900`}>
          <span>Swift</span>
          <span className="text-[#0F766E]">Scan</span>
        </div>
        {showSubtitle && (
          <span className="text-[11px] font-semibold tracking-wider text-teal-800/80 uppercase -mt-0.5">
            Scan & Go Grocery
          </span>
        )}
      </div>
    </div>
  );
};
