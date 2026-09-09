import React, { useState, useEffect } from 'react';
import {
  Clock,
  ChevronDown,
  ChevronUp,
  Receipt,
  CheckCircle2,
  Calendar,
  Store,
  CreditCard,
  Barcode as BarcodeIcon,
  RefreshCw,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Order } from '../../types';
import { getMyOrders } from '../../services/api';

export const OrdersView: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);

  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      const data = await getMyOrders();
      setOrders(data);
      if (data.length > 0) {
        // Expand the most recent order by default for immediate clarity
        setExpandedOrderId(data[0].id);
      }
    } catch (err) {
      console.error('Error fetching orders:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const toggleExpand = (orderId: string) => {
    setExpandedOrderId((prev) => (prev === orderId ? null : orderId));
  };

  return (
    <div className="pb-32 max-w-md mx-auto px-4 pt-3">
      {/* View Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-800">
            Order Receipts
          </h1>
          <p className="text-xs text-slate-500">
            Itemized digital receipts & gate passes
          </p>
        </div>

        <button
          onClick={fetchOrders}
          className="w-8 h-8 rounded-full bg-white hover:bg-slate-50 border border-slate-200/80 flex items-center justify-center text-slate-500 hover:text-slate-800 transition"
          title="Refresh orders"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Orders List */}
      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="p-4 rounded-3xl bg-white border border-slate-100 shadow-sm animate-pulse space-y-3"
            >
              <div className="flex justify-between items-center">
                <div className="w-24 h-4 bg-slate-200 rounded-md" />
                <div className="w-16 h-4 bg-slate-200 rounded-md" />
              </div>
              <div className="w-40 h-3 bg-slate-100 rounded-md" />
            </div>
          ))}
        </div>
      ) : orders.length === 0 ? (
        <div className="p-8 rounded-3xl bg-white border border-slate-100 shadow-sm text-center my-6">
          <div className="w-14 h-14 rounded-full bg-[#8BA89F]/15 text-[#4A635B] flex items-center justify-center mx-auto mb-3">
            <Receipt className="w-7 h-7 stroke-[1.8]" />
          </div>
          <h2 className="text-base font-bold text-slate-800">No Past Orders Yet</h2>
          <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
            Your completed grocery checkouts and itemized receipts will show up here.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {orders.map((order) => {
            const isExpanded = expandedOrderId === order.id;
            const formattedDate = new Date(order.createdAt).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            });
            const formattedTime = new Date(order.createdAt).toLocaleTimeString('en-US', {
              hour: '2-digit',
              minute: '2-digit',
            });

            const totalItemCount = order.items.reduce((sum, item) => sum + item.quantity, 0);

            return (
              <div
                key={order.id}
                className="rounded-3xl bg-white border border-slate-100 shadow-sm overflow-hidden transition-all"
              >
                {/* Collapsible Card Header */}
                <button
                  onClick={() => toggleExpand(order.id)}
                  className="w-full p-4 flex items-center justify-between text-left hover:bg-slate-50/70 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-[#8BA89F]/15 text-[#4A635B] flex items-center justify-center font-bold text-xs shrink-0">
                      <Receipt className="w-5 h-5 stroke-[2]" />
                    </div>
                    <div className="leading-tight">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-800">
                          {order.id}
                        </span>
                        <span className="px-2 py-0.5 rounded-full text-[9px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-100">
                          {order.status}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-400">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {formattedDate} • {formattedTime}
                        </span>
                        <span>•</span>
                        <span>{totalItemCount} items</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-[#4A635B]">
                      ${order.totalAmount.toFixed(2)}
                    </span>
                    <div className="text-slate-400">
                      {isExpanded ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                    </div>
                  </div>
                </button>

                {/* Expanded Itemized Receipt Drawer */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="border-t border-dashed border-slate-200 bg-[#F9FAFB]/70 px-4 py-3 text-xs"
                    >
                      {/* Store & Payment metadata */}
                      <div className="flex items-center justify-between pb-2.5 text-[11px] text-slate-500 border-b border-slate-200/60">
                        <span className="flex items-center gap-1">
                          <Store className="w-3 h-3 text-[#8BA89F]" />
                          {order.storeName || 'SwiftScan Market — Pine & 4th'}
                        </span>
                        <span className="flex items-center gap-1">
                          <CreditCard className="w-3 h-3 text-[#8BA89F]" />
                          {order.paymentMethod || 'Apple Pay'}
                        </span>
                      </div>

                      {/* Nested Itemized List */}
                      <div className="py-2.5 space-y-2">
                        <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
                          Itemized Purchases
                        </div>
                        {order.items.map((item, idx) => (
                          <div key={idx} className="flex justify-between items-center text-slate-700">
                            <div className="flex items-center gap-2 truncate max-w-[220px]">
                              <span className="font-bold text-slate-900 bg-white px-1.5 py-0.5 rounded border border-slate-200 text-[10px]">
                                {item.quantity}x
                              </span>
                              <span className="truncate">{item.productName}</span>
                            </div>
                            <div className="text-right">
                              <span className="font-semibold text-slate-900">
                                ${(item.quantity * item.unitPrice).toFixed(2)}
                              </span>
                              <div className="text-[10px] text-slate-400">
                                @ ${item.unitPrice.toFixed(2)}/ea
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Total Bar */}
                      <div className="pt-2 border-t border-dashed border-slate-200 flex justify-between items-center font-bold text-slate-800">
                        <span>Total Paid</span>
                        <span className="text-sm text-[#4A635B]">
                          ${order.totalAmount.toFixed(2)}
                        </span>
                      </div>

                      {/* Store Turnstile Gate Barcode */}
                      <div className="mt-3 p-2.5 bg-white rounded-2xl border border-slate-200/80 flex flex-col items-center">
                        <div className="flex gap-1 h-6 items-center">
                          <div className="w-1 h-full bg-slate-800" />
                          <div className="w-2 h-full bg-slate-800" />
                          <div className="w-1.5 h-full bg-slate-800" />
                          <div className="w-0.5 h-full bg-slate-800" />
                          <div className="w-2 h-full bg-slate-800" />
                          <div className="w-1.5 h-full bg-slate-800" />
                          <div className="w-1 h-full bg-slate-800" />
                        </div>
                        <span className="text-[8px] font-mono tracking-widest text-slate-400 mt-1">
                          STORE GATE VERIFICATION CODE
                        </span>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
