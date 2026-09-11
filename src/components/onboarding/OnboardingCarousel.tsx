import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Check } from 'lucide-react';
import { Logo } from '../common/Logo';

interface OnboardingCarouselProps {
  onComplete: () => void;
}

interface Slide {
  id: number;
  title: string;
  subtitle: string;
  badge: string;
  renderIllustration: () => React.ReactNode;
}

const slides: Slide[] = [
  {
    id: 0,
    badge: 'Scan in Aisle',
    title: 'Scan items straight into your bag',
    subtitle: 'Point your camera at any barcode while you shop. Watch your live tally update instantly without waiting in line.',
    renderIllustration: () => (
      <div className="relative w-64 h-64 mx-auto flex items-center justify-center">
        {/* Soft circle backdrop */}
        <div className="absolute inset-0 rounded-full bg-teal-500/15 blur-xl transform scale-90" />
        
        {/* Modern Smartphone Mockup */}
        <div className="relative w-44 h-56 rounded-3xl bg-white border-4 border-slate-800 shadow-xl overflow-hidden flex flex-col p-2.5">
          <div className="w-12 h-1 bg-slate-800 rounded-full mx-auto mb-2" />
          
          {/* Camera Viewfinder */}
          <div className="relative flex-1 rounded-2xl bg-slate-900 overflow-hidden flex items-center justify-center">
            {/* Viewfinder corners */}
            <div className="absolute top-3 left-3 w-4 h-4 border-t-2 border-l-2 border-teal-400 rounded-tl" />
            <div className="absolute top-3 right-3 w-4 h-4 border-t-2 border-r-2 border-teal-400 rounded-tr" />
            <div className="absolute bottom-3 left-3 w-4 h-4 border-b-2 border-l-2 border-teal-400 rounded-bl" />
            <div className="absolute bottom-3 right-3 w-4 h-4 border-b-2 border-r-2 border-teal-400 rounded-br" />
            
            {/* Grocery Box Item Inside Viewfinder */}
            <div className="w-16 h-20 rounded-xl bg-slate-800 border border-slate-700 flex flex-col items-center justify-center p-1.5 shadow-md">
              <div className="w-8 h-8 rounded-lg bg-teal-500/20 flex items-center justify-center mb-1">
                <div className="w-4 h-4 rounded-full bg-teal-400" />
              </div>
              <div className="flex gap-0.5 mt-1">
                <div className="w-1 h-4 bg-white/70 rounded" />
                <div className="w-1.5 h-4 bg-white/70 rounded" />
                <div className="w-0.5 h-4 bg-white/70 rounded" />
                <div className="w-1 h-4 bg-white/70 rounded" />
              </div>
            </div>

            {/* Glowing Scan Laser */}
            <motion.div
              animate={{ y: [-24, 24, -24] }}
              transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
              className="absolute inset-x-3 h-[2px] bg-orange-500 shadow-[0_0_10px_#FF6B6B]"
            />
          </div>

          <div className="mt-2 flex items-center justify-between px-1">
            <div className="w-14 h-2 bg-slate-200 rounded" />
            <div className="w-6 h-2 bg-teal-600 rounded" />
          </div>
        </div>

        {/* Floating detected pill */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="absolute -bottom-1 -right-2 bg-white px-3 py-1.5 rounded-full shadow-lg border border-slate-100 flex items-center gap-1.5 text-xs font-semibold text-teal-800"
        >
          <div className="w-2 h-2 rounded-full bg-teal-500 animate-ping" />
          <span>Scanned! $4.89</span>
        </motion.div>
      </div>
    ),
  },
  {
    id: 1,
    badge: 'Real-Time Budget',
    title: 'Bag as you go & track spending',
    subtitle: 'Put items directly into your tote. Real-time subtotal and taxes give you complete peace of mind before checkout.',
    renderIllustration: () => (
      <div className="relative w-64 h-64 mx-auto flex items-center justify-center">
        <div className="absolute inset-0 rounded-full bg-orange-500/15 blur-xl transform scale-90" />
        
        {/* Shopping Tote Illustration */}
        <div className="relative w-48 h-48 flex items-center justify-center">
          {/* Tote Bag Body */}
          <div className="w-40 h-36 rounded-b-3xl rounded-t-lg bg-gradient-to-b from-[#0F766E] to-teal-800 relative shadow-lg flex flex-col justify-end p-4 border border-teal-600/40">
            {/* Bag Handles */}
            <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-20 h-16 border-4 border-teal-950 rounded-t-full bg-transparent" />
            
            {/* Peeking Grocery Items */}
            <div className="absolute -top-6 left-6 w-8 h-12 rounded-t-lg bg-amber-200 border-2 border-amber-300 shadow-sm transform -rotate-6" />
            <div className="absolute -top-8 left-16 w-9 h-14 rounded-t-xl bg-red-300 border-2 border-red-400 shadow-sm transform rotate-3" />
            <div className="absolute -top-5 right-6 w-8 h-10 rounded-t-lg bg-emerald-200 border-2 border-emerald-300 shadow-sm transform rotate-12" />

            {/* Bag Front Pocket */}
            <div className="w-full bg-white/20 backdrop-blur-sm rounded-2xl p-2.5 flex items-center justify-between text-white">
              <span className="text-[11px] font-medium opacity-90">Bag Total</span>
              <span className="text-sm font-bold">$14.37</span>
            </div>
          </div>
        </div>

        {/* Item count chip */}
        <motion.div
          animate={{ y: [0, -4, 0] }}
          transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut' }}
          className="absolute top-2 right-4 bg-white px-3 py-1 rounded-full shadow-md text-xs font-bold text-teal-800 border border-slate-100"
        >
          3 Items in Tote
        </motion.div>
      </div>
    ),
  },
  {
    id: 2,
    badge: 'Bypass All Queues',
    title: 'One-tap checkout & walk right out',
    subtitle: 'Pay securely with Apple Pay or card. Flash your digital QR exit pass at the turnstile and glide out smoothly.',
    renderIllustration: () => (
      <div className="relative w-64 h-64 mx-auto flex items-center justify-center">
        <div className="absolute inset-0 rounded-full bg-teal-500/15 blur-xl transform scale-90" />

        {/* Digital Receipt Card */}
        <div className="relative w-44 rounded-2xl bg-white border border-slate-100 shadow-xl p-3 flex flex-col items-center">
          {/* Receipt Header */}
          <div className="w-7 h-7 rounded-full bg-teal-50 border border-teal-100 flex items-center justify-center text-teal-700 mb-2">
            <Check className="w-4 h-4 stroke-[3]" />
          </div>
          <span className="text-[11px] font-bold text-slate-800">SwiftScan Market</span>
          <span className="text-[9px] text-slate-400">Order #ORD-9428</span>

          <div className="w-full border-t border-dashed border-slate-200 my-2" />

          {/* Receipt Items preview */}
          <div className="w-full space-y-1 text-[10px] text-slate-600">
            <div className="flex justify-between">
              <span>Whole Milk</span>
              <span className="font-medium">$4.89</span>
            </div>
            <div className="flex justify-between">
              <span>Sourdough</span>
              <span className="font-medium">$5.49</span>
            </div>
            <div className="flex justify-between font-bold text-slate-900 pt-1 border-t border-slate-100">
              <span>Total Paid</span>
              <span className="text-teal-700 font-extrabold">$10.38</span>
            </div>
          </div>

          {/* Exit Gate Barcode */}
          <div className="mt-2.5 p-1.5 bg-slate-50 border border-slate-200/60 rounded-xl w-full flex flex-col items-center">
            <div className="flex gap-1 h-6 items-center">
              <div className="w-1 h-full bg-slate-800" />
              <div className="w-1.5 h-full bg-slate-800" />
              <div className="w-0.5 h-full bg-slate-800" />
              <div className="w-2 h-full bg-slate-800" />
              <div className="w-1 h-full bg-slate-800" />
              <div className="w-1.5 h-full bg-slate-800" />
            </div>
            <span className="text-[8px] font-mono tracking-widest text-slate-400 mt-1">GATE EXIT PASS</span>
          </div>
        </div>
      </div>
    ),
  },
];

export const OnboardingCarousel: React.FC<OnboardingCarouselProps> = ({ onComplete }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = () => {
    if (currentIndex < slides.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      handleFinish();
    }
  };

  const handleFinish = () => {
    localStorage.setItem('hasSeenIntro', 'true');
    onComplete();
  };

  const isLast = currentIndex === slides.length - 1;

  return (
    <div className="min-h-screen w-full bg-slate-50 flex flex-col justify-between p-6 max-w-md mx-auto relative overflow-hidden select-none">
      {/* Top Header with Skip */}
      <div className="flex items-center justify-between pt-2">
        <Logo size="sm" />
        {!isLast ? (
          <button
            onClick={handleFinish}
            className="text-xs font-semibold text-teal-800 hover:text-slate-900 transition-colors py-1 px-3 rounded-full hover:bg-slate-200/60 cursor-pointer"
          >
            Skip
          </button>
        ) : (
          <div className="w-8" />
        )}
      </div>

      {/* Main Slide Animated Container */}
      <div className="flex-1 flex flex-col items-center justify-center my-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="w-full flex flex-col items-center text-center"
          >
            {/* Visual Illustration */}
            <div className="mb-6">{slides[currentIndex].renderIllustration()}</div>

            {/* Pill Badge */}
            <span className="inline-flex items-center px-3.5 py-1.5 rounded-full text-xs font-semibold bg-teal-50 text-teal-800 border border-teal-200/60 mb-3 shadow-xs">
              {slides[currentIndex].badge}
            </span>

            {/* Title & Subtitle */}
            <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 leading-snug max-w-xs">
              {slides[currentIndex].title}
            </h2>
            <p className="mt-2 text-sm text-slate-600 leading-relaxed max-w-xs">
              {slides[currentIndex].subtitle}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom Controls */}
      <div className="pb-4 space-y-6">
        {/* Indicator Dots */}
        <div className="flex items-center justify-center gap-2">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              aria-label={`Go to slide ${idx + 1}`}
              className={`h-2 rounded-full transition-all duration-300 ${
                idx === currentIndex ? 'w-7 bg-teal-700' : 'w-2 bg-slate-200'
              }`}
            />
          ))}
        </div>

        {/* Action Button */}
        <button
          id={isLast ? 'onboarding-get-started-btn' : 'onboarding-next-btn'}
          onClick={handleNext}
          className="w-full py-4 px-6 rounded-3xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-sm shadow-md shadow-orange-500/25 transition-all duration-200 active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer"
        >
          <span>{isLast ? 'Get Started' : 'Next'}</span>
          <ArrowRight className="w-4 h-4 stroke-[2.5]" />
        </button>
      </div>
    </div>
  );
};
