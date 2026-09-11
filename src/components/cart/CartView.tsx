import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  ArrowRight,
  ShieldCheck,
  ScanLine,
  Tag,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../../context/CartContext';
import { PaymentModal } from '../checkout/PaymentModal';
import { Order } from '../../types';

export const CartView: React.FC = () => {
  const {
    cartItems,
    updateQuantity,
    removeItem,
    clearCart,
    subtotal,
    taxAmount,
    totalAmount,
    itemCount,
  } = useCart();
  const navigate = useNavigate();

  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);

  const discount = promoApplied ? +(subtotal * 0.1).toFixed(2) : 0;
  const finalTotal = Math.max(0, +(totalAmount - discount).toFixed(2));

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (promoCode.trim().toLowerCase() === 'swift10' || promoCode.trim().toLowerCase() === 'fresh') {
      setPromoApplied(true);
    }
  };

  const handlePaymentSuccess = (order: Order) => {
    // modal handles closing or navigation
  };

  return (
    <div className="pb-32 max-w-md mx-auto px-4 pt-3">
      {/* View Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-800">
            Shopping Tote
          </h1>
          <p className="text-xs text-slate-500">
            {itemCount} item{itemCount === 1 ? '' : 's'} ready for self-checkout
          </p>
        </div>

        {cartItems.length > 0 && (
          <button
            onClick={clearCart}
            className="text-xs text-rose-500 hover:text-rose-700 font-medium py-1 px-2.5 rounded-full hover:bg-rose-50 transition"
          >
            Clear All
          </button>
        )}
      </div>

      {/* Cart Content */}
      {cartItems.length === 0 ? (
        <div className="p-8 rounded-3xl bg-white border border-slate-200/80 shadow-md shadow-teal-900/5 text-center my-6">
          <div className="w-16 h-16 rounded-2xl bg-teal-50 text-teal-700 border border-teal-100 flex items-center justify-center mx-auto mb-3">
            <ShoppingBag className="w-8 h-8 stroke-[1.8]" />
          </div>
          <h2 className="text-base font-bold text-slate-900">Your Tote is Empty</h2>
          <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto leading-relaxed">
            Scan grocery barcodes directly off the store shelves to build your cart.
          </p>
          <button
            onClick={() => navigate('/app/scanner')}
            className="mt-6 py-3 px-6 rounded-3xl bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs shadow-md shadow-teal-900/20 transition active:scale-95 inline-flex items-center gap-2 cursor-pointer"
          >
            <ScanLine className="w-4 h-4" />
            <span>Open Barcode Scanner</span>
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Itemized List */}
          <div className="space-y-2.5">
            <AnimatePresence>
              {cartItems.map(({ product, quantity }) => (
                <motion.div
                  key={product.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -30 }}
                  transition={{ duration: 0.2 }}
                  className="p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-md shadow-teal-900/5 flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="w-12 h-12 rounded-xl object-cover bg-slate-100 shrink-0"
                      referrerPolicy="no-referrer"
                    />
                    <div className="leading-tight">
                      <h3 className="text-xs font-bold text-slate-900 line-clamp-1">
                        {product.name}
                      </h3>
                      <div className="text-[11px] text-teal-700 font-bold mt-0.5">
                        ${product.price.toFixed(2)} each
                      </div>
                      <div className="text-[10px] text-slate-400">
                        Line: ${(product.price * quantity).toFixed(2)}
                      </div>
                    </div>
                  </div>

                  {/* Quantity Stepper */}
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1.5 bg-slate-50 p-1 rounded-xl border border-slate-200/70">
                      <button
                        onClick={() => updateQuantity(product.id, quantity - 1)}
                        className="w-7 h-7 rounded-lg bg-white hover:bg-slate-100 border border-slate-200/70 flex items-center justify-center text-slate-600 active:scale-95 transition cursor-pointer"
                        title="Decrease"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-5 text-center text-xs font-bold text-slate-800">
                        {quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(product.id, quantity + 1)}
                        className="w-7 h-7 rounded-lg bg-teal-700 hover:bg-teal-800 text-white flex items-center justify-center active:scale-95 transition cursor-pointer"
                        title="Increase"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <button
                      onClick={() => removeItem(product.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-500 transition cursor-pointer"
                      title="Remove item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Promo code field */}
          <div className="p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-md shadow-teal-900/5">
            <form onSubmit={handleApplyPromo} className="flex gap-2">
              <div className="relative flex-1">
                <Tag className="w-3.5 h-3.5 text-teal-600 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Promo Code (try SWIFT10)"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  className="w-full pl-8 pr-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 uppercase placeholder:normal-case focus:outline-none focus:border-teal-600 focus:ring-1 focus:ring-teal-500/20 shadow-2xs"
                />
              </div>
              <button
                type="submit"
                disabled={promoApplied}
                className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold disabled:opacity-50 transition cursor-pointer shadow-xs"
              >
                {promoApplied ? 'Applied' : 'Apply'}
              </button>
            </form>
            {promoApplied && (
              <div className="text-[10px] text-teal-700 font-bold mt-1 px-1">
                10% Member discount activated!
              </div>
            )}
          </div>

          {/* Order Summary Card */}
          <div className="p-4 rounded-3xl bg-white border border-slate-200/80 shadow-md shadow-teal-900/5 space-y-2.5 text-xs text-slate-600">
            <h3 className="font-extrabold text-slate-900 text-sm mb-2">Order Breakdown</h3>
            <div className="flex justify-between">
              <span>Items Subtotal</span>
              <span className="font-semibold text-slate-900">${subtotal.toFixed(2)}</span>
            </div>
            {promoApplied && (
              <div className="flex justify-between text-teal-700 font-semibold">
                <span>Member Promo (10%)</span>
                <span>-${discount.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Estimated Sales Tax (8.25%)</span>
              <span className="font-semibold text-slate-900">${taxAmount.toFixed(2)}</span>
            </div>
            <div className="pt-2.5 border-t border-slate-100 flex justify-between items-center text-sm font-bold text-slate-900">
              <span>Total Due</span>
              <span className="text-lg font-extrabold text-teal-700">${finalTotal.toFixed(2)}</span>
            </div>
          </div>

          {/* Checkout CTA */}
          <div className="pt-2">
            <button
              id="pay-now-btn"
              onClick={() => setIsPaymentModalOpen(true)}
              className="w-full py-4 px-6 rounded-3xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-sm shadow-md shadow-orange-500/25 transition-all duration-200 active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Pay Now • ${finalTotal.toFixed(2)}</span>
              <ArrowRight className="w-4 h-4 stroke-[2.5]" />
            </button>
          </div>

          <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-400 text-center">
            <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
            <span>Digital receipt & gate barcode generated instantaneously</span>
          </div>
        </div>
      )}

      {/* Payment Gateway Bottom Sheet */}
      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        onPaymentComplete={handlePaymentSuccess}
      />
    </div>
  );
};
