import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import QRCode from 'qrcode';
import {
  Smartphone,
  QrCode as QrIcon,
  ShieldCheck,
  ScanLine,
  ShoppingBag,
  CheckCircle2,
} from 'lucide-react';
import { usePWAInstall } from '../../hooks/usePWAInstall';
import { IOSInstallModal } from '../common/IOSInstallModal';
import { InstallSuccessModal } from '../common/InstallSuccessModal';
import { LandingHeader } from './LandingHeader';
import { PhoneMockup } from './PhoneMockup';
import { ProblemVision } from './ProblemVision';
import { HowItWorks } from './HowItWorks';
import { CoreBenefits } from './CoreBenefits';
import { LandingFooter } from './LandingFooter';
import { toast } from 'sonner';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();

  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [showIOSModal, setShowIOSModal] = useState<boolean>(false);
  const [installSuccess, setInstallSuccess] = useState<boolean>(false);
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');

  // 1. Auto-redirect ONLY if opened in standalone mode (the installed PWA app on home screen)
  useEffect(() => {
    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as unknown as { standalone?: boolean }).standalone === true;
    if (isStandalone) {
      navigate('/app', { replace: true });
    }
  }, [navigate]);

  // 2. Detect mobile viewport & user agent
  useEffect(() => {
    const checkMobile = () => {
      const userAgent = navigator.userAgent || navigator.vendor || (window as unknown as { opera?: string }).opera || '';
      const isMobileDevice =
        /android|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent) ||
        window.innerWidth < 768;
      setIsMobile(isMobileDevice);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // 3. Generate QR code for mobile scanning on desktop
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const appUrl = `${window.location.origin}/app`;
      QRCode.toDataURL(appUrl, {
        margin: 1,
        width: 220,
        color: {
          dark: '#1E293B',
          light: '#FFFFFF',
        },
      })
        .then((url) => setQrCodeUrl(url))
        .catch((err) => console.error('QR code generation error:', err));
    }
  }, []);

  // Handle Mobile PWA install - keeps browser on website, never redirecting website to onboarding
  const handleInstallClick = async () => {
    if (isIOS) {
      setShowIOSModal(true);
      return;
    }

    if (isInstallable) {
      const outcome = await install();
      if (outcome) {
        setInstallSuccess(true);
        toast.success('SwiftScan installed! Open it from your phone’s home screen.');
      }
    } else {
      // Fallback for Android or other browsers if beforeinstallprompt is delayed
      toast.info('Tap your browser menu (⋮) and select "Add to Home screen"');
    }
  };

  const appIsInstalled = isInstalled || installSuccess;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col selection:bg-orange-500/20 scrollbar-none">
      {/* Sticky Minimal Header */}
      <LandingHeader onInstallClick={handleInstallClick} isMobile={isMobile} isInstalled={appIsInstalled} />

      {/* Hero Section */}
      <section className="relative pt-8 pb-16 sm:pt-16 sm:pb-24 overflow-hidden bg-gradient-to-br from-slate-50 via-teal-50/25 to-slate-50">
        {/* Soft background ambient gradient shapes */}
        <div className="absolute top-0 right-1/4 w-96 h-96 rounded-full bg-teal-500/10 blur-3xl pointer-events-none -z-10" />
        <div className="absolute bottom-10 left-1/4 w-96 h-96 rounded-full bg-orange-500/10 blur-3xl pointer-events-none -z-10" />

        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left Column: Hero Copy & Strict Mobile/Desktop Install Prompts */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className="lg:col-span-7 text-center lg:text-left"
            >
              {/* Feature Pill */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-teal-50 text-teal-800 border border-teal-200/70 mb-6 shadow-xs">
                <ScanLine className="w-3.5 h-3.5 text-teal-700" />
                <span>Next-Gen In-Store Self Checkout</span>
              </div>

              {/* Core Headline */}
              <h1 className="text-3xl sm:text-5xl lg:text-[52px] font-extrabold tracking-tight text-slate-900 leading-[1.15]">
                Skip the Checkout Line.{' '}
                <span className="text-[#0F766E] block sm:inline">Scan, Bag, and Walk Out.</span>
              </h1>

              {/* Sub-headline */}
              <p className="mt-5 text-base sm:text-lg text-slate-600 leading-relaxed max-w-xl mx-auto lg:mx-0">
                Self-scan groceries with your phone camera, watch your total calculate live with taxes and savings, and pay in one tap. No registers. No waiting.
              </p>

              {/* Strict Device-Aware Action System */}
              <div className="mt-8 pt-2">
                {isMobile ? (
                  /* Mobile CTA: If already installed, show clear notification to open from home screen; otherwise primary install button */
                  appIsInstalled ? (
                    <div className="w-full max-w-sm mx-auto lg:mx-0 p-5 rounded-3xl bg-white border border-teal-200/80 shadow-lg shadow-teal-900/5 text-left">
                      <div className="flex items-center gap-2.5 mb-2">
                        <div className="w-9 h-9 rounded-2xl bg-teal-50 text-teal-700 flex items-center justify-center shrink-0 border border-teal-100">
                          <CheckCircle2 className="w-5 h-5 text-teal-700" />
                        </div>
                        <div>
                          <h3 className="text-sm font-bold text-slate-900">SwiftScan is Installed</h3>
                          <p className="text-[11px] text-teal-700 font-semibold">Ready on your device</p>
                        </div>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        The scan &amp; go checkout app is installed. Close your browser and open the <strong>SwiftScan</strong> icon on your phone’s home screen to start shopping in-store.
                      </p>
                    </div>
                  ) : (
                    <div className="max-w-xs mx-auto lg:mx-0">
                      <button
                        id="hero-mobile-install-btn"
                        onClick={handleInstallClick}
                        className="w-full px-8 py-4 rounded-3xl bg-orange-500 hover:bg-orange-600 text-white text-base font-bold shadow-lg shadow-orange-500/25 hover:shadow-xl hover:shadow-orange-500/30 transition-all active:scale-[0.98] flex items-center justify-center gap-2.5 cursor-pointer"
                      >
                        <Smartphone className="w-5 h-5" />
                        <span>Install Mobile App</span>
                      </button>
                      <p className="text-[11px] text-center text-slate-400 mt-2 font-medium">
                        Fast 1-tap installation • No app store download needed
                      </p>
                    </div>
                  )
                ) : (
                  /* Desktop CTA: ONLY the QR code instruction card to scan with phone */
                  <div className="flex flex-col items-center lg:items-start">
                    <div className="p-4 sm:p-5 rounded-3xl bg-white border border-slate-200/80 shadow-lg shadow-teal-900/5 max-w-md flex items-center gap-5 text-left">
                      {qrCodeUrl ? (
                        <div className="relative shrink-0 p-1.5 rounded-2xl bg-slate-50 border border-slate-200/80 shadow-xs">
                          <img
                            src={qrCodeUrl}
                            alt="Scan QR code with phone"
                            className="w-24 h-24 rounded-xl"
                          />
                        </div>
                      ) : (
                        <div className="w-24 h-24 rounded-2xl bg-slate-100 flex items-center justify-center shrink-0">
                          <QrIcon className="w-8 h-8 text-slate-400" />
                        </div>
                      )}
                      <div>
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-teal-50 text-teal-800 border border-teal-200/60 mb-1.5">
                          <Smartphone className="w-3 h-3 text-teal-700" />
                          Mobile Only App
                        </div>
                        <h3 className="text-sm font-bold text-slate-900">
                          Scan to Install on Your Phone
                        </h3>
                        <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                          Open your phone camera and scan this code to launch and install SwiftScan directly for physical in-store checkout.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Trust Indicators */}
              <div className="mt-8 pt-6 border-t border-slate-200/60 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-slate-500 font-medium">
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-teal-600" />
                  <span>Encrypted Exit Passports</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <ShoppingBag className="w-4 h-4 text-teal-600" />
                  <span>Active Shelf Stock Lookup</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span>Instant Digital Wallet</span>
                </div>
              </div>
            </motion.div>

            {/* Right Column: Phone Frame Mockup Preview */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.1, ease: 'easeOut' }}
              className="lg:col-span-5 flex justify-center"
            >
              <PhoneMockup />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Narrative Section: The Problem & The Vision */}
      <ProblemVision />

      {/* 3-Step Micro-Interactive Cards Section */}
      <HowItWorks />

      {/* Core Benefits Section */}
      <CoreBenefits />

      {/* Minimal Footer */}
      <LandingFooter onInstallClick={handleInstallClick} isMobile={isMobile} isInstalled={appIsInstalled} />

      {/* Shared iOS Install Instruction Modal */}
      <IOSInstallModal isOpen={showIOSModal} onClose={() => setShowIOSModal(false)} />

      {/* Install Success Confirmation Modal (Keeps user on landing page) */}
      <InstallSuccessModal isOpen={installSuccess} onClose={() => setInstallSuccess(false)} />
    </div>
  );
};
