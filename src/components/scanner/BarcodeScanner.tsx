import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Html5Qrcode, Html5QrcodeSupportedFormats } from 'html5-qrcode';
import {
  CameraOff,
  Zap,
  Plus,
  Minus,
  Trash2,
  ShoppingBag,
  Barcode as BarcodeIcon,
  Loader2,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../../context/CartContext';
import { getProductByBarcode } from '../../services/api';
import { toast } from 'sonner';

// Sample retail barcodes for quick 1-tap testing of GET /api/Products/{barcode}
const SAMPLE_TEST_BARCODES = [
  { barcode: '793573189240', label: 'Organic Milk' },
  { barcode: '041220275812', label: 'Hass Avocados' },
  { barcode: '011110853198', label: 'San Francisco Sourdough' },
  { barcode: '024100112456', label: 'Nitro Cold Brew' },
  { barcode: '048500018324', label: 'Honeycrisp Apples' },
  { barcode: '071430009210', label: 'Greek Yogurt' },
  { barcode: '034000004409', label: 'Dark Chocolate 72%' },
];

// Helper to inspect available video inputs and lock onto the primary rear camera lens
const getPrimaryRearCameraId = async (): Promise<string | null> => {
  if (!navigator.mediaDevices?.enumerateDevices) {
    return null;
  }
  try {
    const devices = await navigator.mediaDevices.enumerateDevices();
    const videoDevices = devices.filter((d) => d.kind === 'videoinput');
    if (videoDevices.length === 0) return null;
    if (videoDevices.length === 1) return videoDevices[0].deviceId;

    // Filter for rear-facing cameras
    const rearCameras = videoDevices.filter((d) => {
      const label = d.label.toLowerCase();
      return (
        label.includes('back') ||
        label.includes('rear') ||
        label.includes('environment') ||
        label.includes('facing back')
      );
    });

    if (rearCameras.length > 0) {
      // Exclude ultra-wide, macro, depth, telephoto auxiliary lenses
      const standardRearCameras = rearCameras.filter((d) => {
        const label = d.label.toLowerCase();
        return (
          !label.includes('ultra') &&
          !label.includes('macro') &&
          !label.includes('wide-angle') &&
          !label.includes('depth') &&
          !label.includes('tele')
        );
      });

      const candidates = standardRearCameras.length > 0 ? standardRearCameras : rearCameras;

      // Look for explicitly labeled primary / main / 0 camera
      const primaryCamera = candidates.find((d) => {
        const label = d.label.toLowerCase();
        return (
          label.includes('0') ||
          label.includes('main') ||
          label.includes('primary') ||
          label.includes('standard')
        );
      });

      if (primaryCamera) {
        return primaryCamera.deviceId;
      }

      // On Android devices, the main camera often defaults to the last 'environment' camera in the array
      return candidates[candidates.length - 1].deviceId;
    }

    return null;
  } catch (err) {
    console.warn('Error querying camera devices:', err);
    return null;
  }
};

export const BarcodeScanner: React.FC = () => {
  const {
    addItem,
    updateQuantity,
    getItemQuantity,
    removeItem,
    recentScans,
    itemCount,
    totalAmount,
  } = useCart();
  const navigate = useNavigate();

  const [isCameraActive, setIsCameraActive] = useState(true);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [torchOn, setTorchOn] = useState(false);
  const [isTorchSupported, setIsTorchSupported] = useState(false);
  const [manualBarcode, setManualBarcode] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  const scannerRef = useRef<Html5Qrcode | null>(null);
  const videoTrackRef = useRef<MediaStreamTrack | null>(null);
  const lastScannedTimeRef = useRef<number>(0);
  const isProcessingRef = useRef<boolean>(false);

  // Core handler: Calls GET /api/Products/{barcode} (No auth required)
  const handleBarcodeDetected = useCallback(
    async (barcode: string) => {
      const cleanBarcode = barcode.trim();
      if (!cleanBarcode) return;

      const now = Date.now();
      // Debounce detections to avoid rapid double-scans
      if (now - lastScannedTimeRef.current < 1500 || isProcessingRef.current) {
        return;
      }
      lastScannedTimeRef.current = now;
      isProcessingRef.current = true;
      setIsSearching(true);

      try {
        // Contract: GET /api/Products/{barcode} -> returns { id, barcode, name, price, stockQuantity }
        const product = await getProductByBarcode(cleanBarcode);
        addItem(product, 1);
        toast.success(`Scanned: ${product.name}`, {
          description: `$${product.price.toFixed(2)} added to tote`,
          duration: 2500,
        });
      } catch (err: unknown) {
        const msg =
          err instanceof Error
            ? err.message
            : `Product not found for barcode: ${cleanBarcode}`;
        toast.error(msg, {
          description: 'Check barcode or try another item.',
        });
      } finally {
        setIsSearching(false);
        setTimeout(() => {
          isProcessingRef.current = false;
        }, 800);
      }
    },
    [addItem]
  );

  // Safe helper to stop and clear Html5Qrcode
  const safeStopScanner = async (instance: Html5Qrcode | null) => {
    if (!instance) return;
    try {
      if (instance.isScanning) {
        await instance.stop();
      }
    } catch {
      // ignore
    }
    try {
      instance.clear();
    } catch {
      // ignore
    }
  };

  // Initialize live camera with auto-selected rear primary lens and fast 1D configuration
  useEffect(() => {
    let isMounted = true;
    const scannerId = 'swiftscan-reader';

    const startScanner = async () => {
      setCameraError(null);
      try {
        if (scannerRef.current) {
          await safeStopScanner(scannerRef.current);
          scannerRef.current = null;
        }

        if (!isMounted) return;

        const container = document.getElementById(scannerId);
        if (!container) return;

        // Auto-select primary rear camera without requiring user intervention
        const selectedCameraId = await getPrimaryRearCameraId();

        // Strictly restrict decoder formats to retail 1D only (eliminates QR & 2D overhead)
        const scanner = new Html5Qrcode(scannerId, {
          formatsToSupport: [
            Html5QrcodeSupportedFormats.UPC_A,
            Html5QrcodeSupportedFormats.UPC_E,
            Html5QrcodeSupportedFormats.EAN_13,
            Html5QrcodeSupportedFormats.EAN_8,
          ],
          verbose: false,
        });

        scannerRef.current = scanner;

        const cameraConfig = selectedCameraId
          ? selectedCameraId
          : { facingMode: 'environment' };

        await scanner.start(
          cameraConfig,
          {
            fps: 30, // 30 FPS for instant frame processing
            qrbox: (viewfinderWidth: number, viewfinderHeight: number) => {
              // Limit scan area strictly to the center reticle pixels for high-speed decoding
              const width = Math.min(280, Math.floor(viewfinderWidth * 0.78));
              const height = Math.min(160, Math.floor(viewfinderHeight * 0.55));
              return { width: Math.max(width, 100), height: Math.max(height, 80) };
            },
            aspectRatio: 1.333333,
            videoConstraints: {
              facingMode: { ideal: 'environment' },
              ...(selectedCameraId ? { deviceId: { ideal: selectedCameraId } } : {}),
              advanced: [{ focusMode: 'continuous' } as MediaTrackConstraintSet],
            },
          },
          (decodedText) => {
            if (isMounted) {
              handleBarcodeDetected(decodedText);
            }
          },
          () => {}
        );

        if (!isMounted) {
          await safeStopScanner(scanner);
          scannerRef.current = null;
          return;
        }

        setIsCameraActive(true);

        // Hide html5-qrcode's injected shaded region immediately in DOM if present
        const shadedRegion = document.getElementById('qr-shaded-region');
        if (shadedRegion) {
          shadedRegion.style.display = 'none';
        }

        // Extract active video track directly from media stream
        const extractVideoTrack = () => {
          const videoElement = container.querySelector('video') as HTMLVideoElement | null;
          const stream = (videoElement?.srcObject as MediaStream) || null;
          const track = stream?.getVideoTracks()?.[0] || null;
          videoTrackRef.current = track;

          if (track) {
            // Apply continuous focus mode on active track
            if (typeof track.applyConstraints === 'function') {
              try {
                track.applyConstraints({
                  advanced: [{ focusMode: 'continuous' } as MediaTrackConstraintSet],
                }).catch(() => {});
              } catch {
                // ignore
              }
            }

            // Check if hardware torch/flashlight is supported
            if (typeof track.getCapabilities === 'function') {
              try {
                const capabilities = track.getCapabilities() as { torch?: boolean };
                setIsTorchSupported(Boolean(capabilities?.torch));
              } catch (err) {
                console.warn('Track getCapabilities error:', err);
                setIsTorchSupported(false);
              }
            } else {
              setIsTorchSupported(false);
            }
          } else {
            setIsTorchSupported(false);
          }
        };

        extractVideoTrack();
        // Allow brief interval for devices where track capabilities resolve asynchronously
        setTimeout(() => {
          if (isMounted) {
            extractVideoTrack();
          }
        }, 200);
      } catch (err: unknown) {
        console.warn('Camera stream message:', err);
        if (isMounted) {
          setIsCameraActive(false);
          setCameraError(
            'Camera preview unavailable. Use manual barcode input or tap test barcodes below.'
          );
        }
      }
    };

    startScanner();

    return () => {
      isMounted = false;
      if (videoTrackRef.current) {
        try {
          videoTrackRef.current.applyConstraints({
            advanced: [{ torch: false } as MediaTrackConstraintSet],
          });
        } catch {
          // ignore
        }
        videoTrackRef.current = null;
      }
      const currentScanner = scannerRef.current;
      scannerRef.current = null;
      if (currentScanner) {
        safeStopScanner(currentScanner);
      }
    };
  }, [handleBarcodeDetected]);

  const toggleTorch = async () => {
    const track = videoTrackRef.current;
    if (!track) return;

    try {
      const nextTorch = !torchOn;
      await track.applyConstraints({
        advanced: [{ torch: nextTorch } as MediaTrackConstraintSet],
      });
      setTorchOn(nextTorch);
    } catch (err: unknown) {
      console.warn('Torch applyConstraints failed:', err);
      toast.info('Flash is not supported on this device.');
    }
  };

  const handleManualSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualBarcode.trim()) return;
    await handleBarcodeDetected(manualBarcode.trim());
    setManualBarcode('');
  };

  return (
    <div className={`max-w-md mx-auto px-4 pt-2 transition-[padding] duration-200 ${itemCount > 0 ? 'pb-52' : 'pb-28'}`}>
      {/* Store & Location Header */}
      <div className="flex items-center justify-between mb-2 px-1 text-xs">
        <div className="flex items-center gap-1.5 font-medium text-slate-600">
          <span className="font-semibold text-slate-800">SwiftScan Market</span>
          <span className="text-[10px] text-slate-400">• Store #104</span>
        </div>
        <div className="text-[11px] font-semibold text-teal-800 bg-teal-50 border border-teal-200/60 px-2.5 py-0.5 rounded-full shadow-2xs">
          Scan &amp; Go Active
        </div>
      </div>

      {/* Camera Viewport Container */}
      <div className="relative w-full rounded-3xl overflow-hidden bg-slate-950 shadow-md aspect-[4/3] flex flex-col items-center justify-center">
        {/* Scoped override to completely remove html5-qrcode's default border shaders / horizontal blocks */}
        <style>{`
          #qr-shaded-region,
          #qr-shaded-region > div,
          #qr-shaded-region * {
            display: none !important;
            opacity: 0 !important;
            visibility: hidden !important;
            pointer-events: none !important;
          }
        `}</style>

        {/* Html5Qrcode video container */}
        <div id="swiftscan-reader" className="w-full h-full object-cover" />

        {/* Reticle Overlay Layer */}
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
          <div className="w-64 h-44 rounded-2xl border-2 border-white/40 relative flex items-center justify-center shadow-[0_0_0_9999px_rgba(15,23,42,0.45)]">
            <div className="absolute -top-1 -left-1 w-6 h-6 border-t-4 border-l-4 border-teal-400 rounded-tl-xl" />
            <div className="absolute -top-1 -right-1 w-6 h-6 border-t-4 border-r-4 border-teal-400 rounded-tr-xl" />
            <div className="absolute -bottom-1 -left-1 w-6 h-6 border-b-4 border-l-4 border-teal-400 rounded-bl-xl" />
            <div className="absolute -bottom-1 -right-1 w-6 h-6 border-b-4 border-r-4 border-teal-400 rounded-br-xl" />

            <motion.div
              animate={{ y: [-65, 65, -65] }}
              transition={{ repeat: Infinity, duration: 2.2, ease: 'easeInOut' }}
              className="absolute inset-x-2 h-[2px] bg-orange-500 shadow-[0_0_12px_#FF6B6B]"
            />

            <span className="text-[10px] font-medium tracking-wider text-white/80 uppercase bg-slate-900/60 px-2 py-0.5 rounded-full backdrop-blur-sm">
              Align Barcode
            </span>
          </div>
        </div>

        {/* Floating Camera Controls */}
        <div className="absolute top-3 right-3 flex items-center gap-2 z-20">
          {isTorchSupported && (
            <button
              id="camera-torch-btn"
              type="button"
              onClick={toggleTorch}
              className={`w-9 h-9 rounded-full backdrop-blur-md flex items-center justify-center transition-all cursor-pointer ${
                torchOn
                  ? 'bg-amber-400 text-slate-900 shadow-md ring-2 ring-amber-300/50'
                  : 'bg-black/40 text-white hover:bg-black/60'
              }`}
              title={torchOn ? 'Turn off Flash' : 'Turn on Flash'}
              aria-label={torchOn ? 'Turn off Flash' : 'Turn on Flash'}
            >
              <Zap className={`w-4 h-4 ${torchOn ? 'fill-current' : ''}`} />
            </button>
          )}
        </div>

        {/* Bottom Left Camera Status pill */}
        <div className="absolute bottom-3 left-3 z-20 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/50 backdrop-blur-md text-white text-[11px]">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>Scanner Ready</span>
        </div>

        {/* Camera Permission / Fallback notification */}
        {cameraError && (
          <div className="absolute inset-0 bg-slate-900/90 backdrop-blur-sm p-5 flex flex-col items-center justify-center text-center z-30">
            <CameraOff className="w-10 h-10 text-orange-500 mb-2" />
            <h3 className="text-sm font-bold text-white mb-1">Camera Stream Inactive</h3>
            <p className="text-xs text-slate-300 max-w-xs leading-relaxed mb-4">
              Enter any barcode below or tap sample barcodes to trigger GET /api/Products/{'{barcode}'}.
            </p>
            <button
              onClick={() => setCameraError(null)}
              className="px-4 py-2 rounded-2xl bg-teal-700 text-white text-xs font-bold hover:bg-teal-800 transition"
            >
              Dismiss
            </button>
          </div>
        )}
      </div>

      {/* Manual / Barcode Search Input */}
      <div className="mt-3">
        <form onSubmit={handleManualSearch} className="relative flex items-center">
          <BarcodeIcon className="w-4 h-4 text-teal-600 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            id="manual-barcode-input"
            type="text"
            value={manualBarcode}
            onChange={(e) => setManualBarcode(e.target.value)}
            placeholder="Type barcode (e.g. 793573189240)"
            className="w-full pl-10 pr-24 py-2.5 rounded-2xl bg-white border border-slate-200 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-500/20 shadow-xs font-mono"
          />
          <button
            type="submit"
            disabled={isSearching || !manualBarcode.trim()}
            className="absolute right-1.5 px-3.5 py-1.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold disabled:opacity-50 transition cursor-pointer flex items-center gap-1 shadow-xs"
          >
            {isSearching ? <Loader2 className="w-3 h-3 animate-spin" /> : null}
            <span>{isSearching ? 'Looking up' : 'Scan'}</span>
          </button>
        </form>
      </div>

      {/* Test Barcode Pills (GET /api/Products/{barcode}) */}
      <div className="mt-3">
        <div className="flex items-center text-xs font-bold text-teal-900 mb-1.5 px-1">
          <span>Tap Barcode to Lookup:</span>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
          {SAMPLE_TEST_BARCODES.map((item) => (
            <button
              key={item.barcode}
              onClick={() => handleBarcodeDetected(item.barcode)}
              disabled={isSearching}
              className="shrink-0 px-3 py-1.5 rounded-xl bg-white border border-slate-200 hover:border-teal-600 hover:bg-teal-50/40 shadow-2xs active:scale-95 transition-all text-left flex flex-col cursor-pointer"
            >
              <span className="text-[11px] font-semibold text-slate-800">{item.label}</span>
              <span className="text-[10px] font-mono text-slate-400">{item.barcode}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Bagged Items List */}
      <div className="mt-5">
        <div className="flex items-center justify-between mb-2.5 px-1">
          <h3 className="text-sm font-bold text-slate-900">Scanned Items</h3>
          <span className="text-xs font-medium text-slate-400">
            {recentScans.length} item{recentScans.length === 1 ? '' : 's'}
          </span>
        </div>

        {recentScans.length === 0 ? (
          <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-md shadow-teal-900/5 text-center">
            <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-700 border border-teal-100 flex items-center justify-center mx-auto mb-2">
              <BarcodeIcon className="w-6 h-6" />
            </div>
            <h4 className="text-xs font-bold text-slate-900">Tote is currently empty</h4>
            <p className="text-[11px] text-slate-500 mt-1 max-w-xs mx-auto">
              Aim camera at a product barcode or enter a barcode above to query the database.
            </p>
          </div>
        ) : (
          <div className="space-y-2.5">
            <AnimatePresence>
              {recentScans.map((product) => {
                const qty = getItemQuantity(product.id);
                return (
                  <motion.div
                    key={product.id}
                    layout
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="p-3 rounded-2xl bg-white border border-slate-200/80 shadow-md shadow-teal-900/5 flex items-center justify-between"
                  >
                    {/* Item Image / Details */}
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-xl overflow-hidden bg-slate-100 shrink-0 flex items-center justify-center">
                        {product.imageUrl ? (
                          <img
                            src={product.imageUrl}
                            alt={product.name}
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                          />
                        ) : (
                          <ShoppingBag className="w-5 h-5 text-slate-400" />
                        )}
                      </div>
                      <div className="leading-tight">
                        <h4 className="text-xs font-bold text-slate-900 line-clamp-1">
                          {product.name}
                        </h4>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-xs font-bold text-teal-700">
                            ${product.price.toFixed(2)}
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono">
                            {product.barcode}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Actions: Stepper (+ / -) & Instant Item Removal Button */}
                    <div className="flex items-center gap-1.5 shrink-0">
                      <div className="flex items-center gap-1 bg-slate-50 p-1 rounded-xl border border-slate-200/70">
                        <button
                          type="button"
                          onClick={() => updateQuantity(product.id, qty - 1)}
                          className="w-7 h-7 rounded-lg bg-white hover:bg-slate-100 border border-slate-200/70 flex items-center justify-center text-slate-700 active:scale-95 transition cursor-pointer"
                          title="Decrease quantity"
                          aria-label={`Decrease quantity of ${product.name}`}
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-5 text-center text-xs font-bold text-slate-800">
                          {qty}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(product.id, qty + 1)}
                          className="w-7 h-7 rounded-lg bg-teal-700 hover:bg-teal-800 text-white flex items-center justify-center active:scale-95 transition cursor-pointer"
                          title="Increase quantity"
                          aria-label={`Increase quantity of ${product.name}`}
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      {/* Clean 'X' / Trash removal button */}
                      <button
                        type="button"
                        onClick={() => {
                          removeItem(product.id);
                          toast.info(`Removed ${product.name} from tote`, { duration: 1800 });
                        }}
                        className="w-7 h-7 rounded-lg bg-rose-50 hover:bg-rose-100/90 text-rose-500 border border-rose-100 flex items-center justify-center active:scale-90 transition cursor-pointer"
                        title="Remove item from tote"
                        aria-label={`Remove ${product.name} from cart`}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Docked Quick Cart Summary Bar (Cleanly docked above bottom nav without obscuring scrollable items) */}
      <AnimatePresence>
        {itemCount > 0 && (
          <motion.div
            initial={{ y: 24, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 24, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-[76px] inset-x-0 z-30 px-4 flex justify-center pointer-events-none"
          >
            <div className="pointer-events-auto w-full max-w-md p-3 rounded-2xl bg-slate-900/95 text-white shadow-xl shadow-slate-900/20 border border-slate-800 backdrop-blur-lg flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-teal-600 text-white flex items-center justify-center font-bold text-xs shadow-inner">
                  {itemCount}
                </div>
                <div className="leading-tight">
                  <span className="text-[11px] text-slate-400 font-medium">Total in tote</span>
                  <div className="text-sm font-bold text-white tracking-tight">
                    ${totalAmount.toFixed(2)}
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => navigate('/app/cart')}
                className="py-2.5 px-4 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold shadow-md shadow-orange-500/25 transition active:scale-95 flex items-center gap-1.5 cursor-pointer"
              >
                <span>View Cart</span>
                <ShoppingBag className="w-3.5 h-3.5 stroke-[2.5]" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
