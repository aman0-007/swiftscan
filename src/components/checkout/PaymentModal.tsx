import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckCircle,
  Loader2,
  X,
  CreditCard,
  Receipt,
  Download,
  ArrowRight,
  ShieldCheck,
  Check,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Order, CartItem } from '../../types';
import { checkoutOrder } from '../../services/api';
import { useCart } from '../../context/CartContext';
import { toast } from 'sonner';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPaymentComplete: (order: Order) => void;
}

type PaymentStep = 'method' | 'processing' | 'success';

export const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  onPaymentComplete,
}) => {
  const { cartItems, totalAmount, subtotal, taxAmount, clearCart } = useCart();

  const [step, setStep] = useState<PaymentStep>('method');
  const [selectedMethod, setSelectedMethod] = useState<'apple_pay' | 'card' | 'google_pay'>('apple_pay');
  const [createdOrder, setCreatedOrder] = useState<Order | null>(null);

  useEffect(() => {
    if (isOpen) {
      setStep('method');
      setCreatedOrder(null);
    }
  }, [isOpen]);

  const handleStartPayment = async () => {
    setStep('processing');

    try {
      // Send real checkout payload to API Backend Contract
      const itemsPayload = cartItems.map((item) => ({
        productId: item.product.id,
        quantity: item.quantity,
      }));

      // Simulate 1.5 seconds secure payment gateway processing as requested
      const [orderResult] = await Promise.all([
        checkoutOrder(itemsPayload),
        new Promise((resolve) => setTimeout(resolve, 1500)),
      ]);

      setCreatedOrder(orderResult);
      setStep('success');

      // Trigger celebratory confetti burst
      try {
        confetti({
          particleCount: 70,
          spread: 60,
          origin: { y: 0.65 },
          colors: ['#8BA89F', '#F2A68D', '#4A635B'],
        });
      } catch {
        // ignore
      }

      clearCart();
      onPaymentComplete(orderResult);
      toast.success('Payment completed successfully!');
    } catch (err: unknown) {
      console.error('Checkout error:', err);
      toast.error('Payment processing failed. Please try again.');
      setStep('method');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        id="payment-bottom-sheet"
        className="w-full max-w-md bg-white rounded-t-3xl shadow-2xl max-h-[92vh] overflow-y-auto flex flex-col border-t border-slate-100"
      >
        {/* Grab Handle */}
        <div className="w-12 h-1.5 bg-slate-300 rounded-full mx-auto mt-3 mb-2 shrink-0" />

        {/* Modal Header */}
        <div className="px-6 py-3 flex items-center justify-between border-b border-slate-100">
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-slate-800">
              {step === 'method' && 'Choose Payment Method'}
              {step === 'processing' && 'Authorizing Payment...'}
              {step === 'success' && 'Store Receipt'}
            </span>
          </div>
          {step !== 'processing' && (
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Modal Body */}
        <div className="p-6">
          <AnimatePresence mode="wait">
            {/* STEP 1: Select Method */}
            {step === 'method' && (
              <motion.div
                key="method"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-4"
              >
                {/* Total pill */}
                <div className="p-4 rounded-2xl bg-[#F9FAFB] border border-slate-100 flex items-center justify-between">
                  <div className="text-xs text-slate-500">Order Balance</div>
                  <div className="text-xl font-bold text-slate-800">
                    ${totalAmount.toFixed(2)}
                  </div>
                </div>

                {/* Methods selection */}
                <div className="space-y-2.5">
                  <button
                    onClick={() => setSelectedMethod('apple_pay')}
                    className={`w-full p-3.5 rounded-2xl border flex items-center justify-between transition-all ${
                      selectedMethod === 'apple_pay'
                        ? 'border-[#8BA89F] bg-[#8BA89F]/10 ring-1 ring-[#8BA89F]'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-black text-white flex items-center justify-center font-semibold text-xs">
                        Pay
                      </div>
                      <div className="text-left leading-tight">
                        <span className="text-xs font-bold text-slate-800">Apple Pay</span>
                        <p className="text-[11px] text-slate-400">Default device wallet</p>
                      </div>
                    </div>
                    {selectedMethod === 'apple_pay' && (
                      <Check className="w-4 h-4 text-[#4A635B]" />
                    )}
                  </button>

                  <button
                    onClick={() => setSelectedMethod('card')}
                    className={`w-full p-3.5 rounded-2xl border flex items-center justify-between transition-all ${
                      selectedMethod === 'card'
                        ? 'border-[#8BA89F] bg-[#8BA89F]/10 ring-1 ring-[#8BA89F]'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-slate-800 text-white flex items-center justify-center">
                        <CreditCard className="w-4 h-4" />
                      </div>
                      <div className="text-left leading-tight">
                        <span className="text-xs font-bold text-slate-800">
                          Debit / Credit Card
                        </span>
                        <p className="text-[11px] text-slate-400">Visa ending in •••• 4092</p>
                      </div>
                    </div>
                    {selectedMethod === 'card' && (
                      <Check className="w-4 h-4 text-[#4A635B]" />
                    )}
                  </button>
                </div>

                <div className="pt-2">
                  <button
                    id="confirm-pay-btn"
                    onClick={handleStartPayment}
                    className="w-full py-3.5 px-6 rounded-3xl bg-[#F2A68D] hover:bg-[#e8957a] text-white font-semibold text-sm shadow-sm transition active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    <span>Authorize & Pay ${totalAmount.toFixed(2)}</span>
                  </button>
                </div>

                <div className="text-center text-[11px] text-slate-400">
                  Secured with 256-bit point-of-sale encryption
                </div>
              </motion.div>
            )}

            {/* STEP 2: Processing 1.5s Spinner */}
            {step === 'processing' && (
              <motion.div
                key="processing"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="py-12 flex flex-col items-center justify-center text-center"
              >
                <div className="w-16 h-16 rounded-full bg-[#8BA89F]/15 flex items-center justify-center text-[#4A635B] mb-4">
                  <Loader2 className="w-8 h-8 animate-spin" />
                </div>
                <h3 className="text-base font-bold text-slate-800">
                  Processing Secure Payment...
                </h3>
                <p className="text-xs text-slate-400 mt-1 max-w-xs">
                  Communicating with terminal and generating your instant digital exit pass.
                </p>
              </motion.div>
            )}

            {/* STEP 3: Payment Successful & Receipt Generation */}
            {step === 'success' && createdOrder && (
              <motion.div
                key="success"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-4"
              >
                {/* Green Checkmark Animation */}
                <div className="flex flex-col items-center text-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 260, damping: 20 }}
                    className="w-14 h-14 rounded-full bg-[#8BA89F] text-white flex items-center justify-center shadow-md mb-2"
                  >
                    <CheckCircle className="w-8 h-8 stroke-[2.5]" />
                  </motion.div>
                  <h3 className="text-lg font-bold text-slate-800">Payment Successful!</h3>
                  <p className="text-xs text-slate-500">
                    Order {createdOrder.id} • Saved to History
                  </p>
                </div>

                {/* Digital Receipt Card */}
                <div className="p-4 rounded-3xl bg-[#F9FAFB] border border-slate-200/80 shadow-sm relative overflow-hidden text-left">
                  {/* Jagged top line decorative */}
                  <div className="flex justify-between items-center pb-2 border-b border-dashed border-slate-300">
                    <div>
                      <span className="text-xs font-bold text-slate-800">
                        {createdOrder.storeName || 'SwiftScan Market'}
                      </span>
                      <p className="text-[10px] text-slate-400">
                        {new Date(createdOrder.createdAt).toLocaleString()}
                      </p>
                    </div>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#8BA89F]/20 text-[#4A635B]">
                      PAID
                    </span>
                  </div>

                  {/* Purchased Items list */}
                  <div className="py-3 space-y-2 text-xs">
                    {createdOrder.items.map((item, idx) => (
                      <div key={idx} className="flex justify-between text-slate-700">
                        <div className="flex items-center gap-1.5 truncate max-w-[210px]">
                          <span className="font-semibold text-slate-900">{item.quantity}x</span>
                          <span className="truncate">{item.productName}</span>
                        </div>
                        <span className="font-medium text-slate-900 shrink-0">
                          ${(item.quantity * item.unitPrice).toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Total Calculations */}
                  <div className="pt-2 border-t border-dashed border-slate-300 space-y-1 text-xs">
                    <div className="flex justify-between text-slate-500">
                      <span>Subtotal</span>
                      <span>${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-slate-500">
                      <span>Sales Tax (8.25%)</span>
                      <span>${taxAmount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between font-bold text-sm text-slate-800 pt-1 border-t border-slate-200">
                      <span>Total Paid</span>
                      <span className="text-[#4A635B]">${createdOrder.totalAmount.toFixed(2)}</span>
                    </div>
                  </div>

                  {/* Store Exit Barcode Pass */}
                  <div className="mt-4 p-3 bg-white rounded-2xl border border-slate-200/80 flex flex-col items-center justify-center">
                    <div className="flex gap-1 h-8 items-center justify-center">
                      <div className="w-1.5 h-full bg-slate-900" />
                      <div className="w-1 h-full bg-slate-900" />
                      <div className="w-2.5 h-full bg-slate-900" />
                      <div className="w-1 h-full bg-slate-900" />
                      <div className="w-3 h-full bg-slate-900" />
                      <div className="w-1.5 h-full bg-slate-900" />
                      <div className="w-2 h-full bg-slate-900" />
                      <div className="w-1 h-full bg-slate-900" />
                      <div className="w-2 h-full bg-slate-900" />
                    </div>
                    <span className="text-[9px] font-mono tracking-widest text-slate-500 mt-1 font-bold">
                      SCAN AT TURNSTILE GATE
                    </span>
                  </div>
                </div>

                {/* Done action */}
                <div className="pt-2">
                  <button
                    onClick={onClose}
                    className="w-full py-3.5 px-6 rounded-3xl bg-[#8BA89F] hover:bg-[#77948a] text-white font-semibold text-xs shadow-sm transition active:scale-[0.98]"
                  >
                    Done & Exit Store
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
