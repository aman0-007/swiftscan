import React from 'react';
import { NavLink } from 'react-router-dom';
import { ScanLine, ShoppingBag, Clock, User } from 'lucide-react';
import { useCart } from '../../context/CartContext';

export const BottomNav: React.FC = () => {
  const { itemCount, totalAmount } = useCart();

  const navItems = [
    {
      to: '/scanner',
      label: 'Scan',
      icon: ScanLine,
      id: 'nav-scan-btn',
    },
    {
      to: '/cart',
      label: 'Cart',
      icon: ShoppingBag,
      id: 'nav-cart-btn',
      badge: itemCount > 0 ? itemCount : null,
    },
    {
      to: '/history',
      label: 'History',
      icon: Clock,
      id: 'nav-history-btn',
    },
    {
      to: '/profile',
      label: 'Profile',
      icon: User,
      id: 'nav-profile-btn',
    },
  ];

  return (
    <nav className="fixed bottom-3 inset-x-0 z-40 px-4 pointer-events-none flex justify-center">
      <div
        id="floating-bottom-nav"
        className="pointer-events-auto w-full max-w-md bg-white/85 backdrop-blur-xl rounded-3xl p-1.5 shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-white/60 flex items-center justify-between"
      >
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              id={item.id}
              className={({ isActive }) =>
                `relative flex-1 flex flex-col items-center justify-center py-2 px-1 rounded-2xl transition-all duration-200 ${
                  isActive
                    ? 'text-[#4A635B] font-semibold bg-[#8BA89F]/15'
                    : 'text-slate-400 hover:text-slate-600'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <div className="relative">
                    <Icon
                      className={`w-5 h-5 transition-transform ${
                        isActive ? 'scale-110 stroke-[2.4]' : 'stroke-[1.8]'
                      }`}
                    />
                    {item.badge !== null && item.badge !== undefined && (
                      <span className="absolute -top-1.5 -right-2.5 min-w-[18px] h-[18px] px-1 bg-[#F2A68D] text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-sm animate-pulse">
                        {item.badge > 99 ? '99+' : item.badge}
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] mt-1 tracking-tight">{item.label}</span>
                </>
              )}
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
};
