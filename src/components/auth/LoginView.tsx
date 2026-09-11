import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, Loader2, ShieldCheck } from 'lucide-react';
import { Logo } from '../common/Logo';
import { useAuth } from '../../context/AuthContext';

export const LoginView: React.FC = () => {
  const { login, isLoading, error, clearError } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('shopper@scanandgo.com');
  const [password, setPassword] = useState('hashed_pw_shopper');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    const success = await login(email, password);
    if (success) {
      navigate('/app/scanner', { replace: true });
    }
  };

  const fillDemoAccount = (demoEmail: string, demoPass: string) => {
    clearError();
    setEmail(demoEmail);
    setPassword(demoPass);
  };

  return (
    <div className="min-h-screen w-full bg-slate-50 flex flex-col justify-between p-6 max-w-md mx-auto">
      {/* Top Header */}
      <div className="pt-4 flex items-center justify-between">
        <Logo size="md" showSubtitle />
        <span className="text-[11px] font-semibold text-teal-800 bg-teal-50 border border-teal-200/60 px-2.5 py-1 rounded-full flex items-center gap-1 shadow-xs">
          <ShieldCheck className="w-3 h-3 text-teal-700" />
          <span>v2.4 Secure</span>
        </span>
      </div>

      {/* Main Login Card */}
      <div className="my-auto py-6">
        <div className="mb-6 text-left">
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">
            Welcome back
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Sign in to start scanning groceries at any partnered location.
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-4 p-3.5 rounded-2xl bg-rose-50 border border-rose-100 text-rose-700 text-xs font-medium flex items-start gap-2 animate-in fade-in">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5 shrink-0" />
            <div className="flex-1">{error}</div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email Input */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-700">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-teal-600 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                id="login-email-input"
                type="email"
                required
                value={email}
                onChange={(e) => {
                  clearError();
                  setEmail(e.target.value);
                }}
                placeholder="name@example.com"
                className="w-full pl-10 pr-4 py-3 rounded-2xl bg-white border border-slate-200 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-500/20 transition-all shadow-xs"
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-semibold text-slate-700">
                Password
              </label>
              <button
                type="button"
                onClick={() => fillDemoAccount('shopper@scanandgo.com', 'hashed_pw_shopper')}
                className="text-[11px] font-semibold text-teal-700 hover:text-teal-800 hover:underline cursor-pointer"
              >
                Reset default credentials
              </button>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-teal-600 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                id="login-password-input"
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => {
                  clearError();
                  setPassword(e.target.value);
                }}
                placeholder="••••••••"
                className="w-full pl-10 pr-10 py-3 rounded-2xl bg-white border border-slate-200 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-500/20 transition-all shadow-xs"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          {/* Sign In Submit Button */}
          <button
            id="login-submit-btn"
            type="submit"
            disabled={isLoading}
            className="w-full mt-2 py-4 px-6 rounded-3xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-sm shadow-md shadow-orange-500/25 transition-all duration-200 active:scale-[0.98] disabled:opacity-60 flex items-center justify-center gap-2 cursor-pointer"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Signing In...</span>
              </>
            ) : (
              <span>Sign In to SwiftScan</span>
            )}
          </button>
        </form>

        {/* Demo Credentials Helper Pill */}
        <div className="mt-6 p-4 rounded-2xl bg-teal-50/70 border border-teal-200/70 text-left shadow-2xs">
          <div className="flex items-center text-xs font-bold text-teal-900 mb-1.5">
            <span>1-Click Demo Login</span>
          </div>
          <p className="text-[11px] text-slate-600 mb-2.5 leading-relaxed">
            Pre-loaded with sample member account for immediate testing.
          </p>
          <div className="flex flex-wrap gap-1.5">
            <button
              type="button"
              onClick={() => fillDemoAccount('shopper@scanandgo.com', 'hashed_pw_shopper')}
              className="text-[11px] px-2.5 py-1 rounded-xl bg-white border border-teal-200 text-slate-800 hover:bg-teal-50 font-medium active:scale-95 transition shadow-2xs cursor-pointer"
            >
              Default Shopper
            </button>
            <button
              type="button"
              onClick={() => fillDemoAccount('sarah.miller@swiftscan.co', 'swiftpass2026')}
              className="text-[11px] px-2.5 py-1 rounded-xl bg-white border border-teal-200 text-slate-800 hover:bg-teal-50 font-medium active:scale-95 transition shadow-2xs cursor-pointer"
            >
              Sarah (Member)
            </button>
          </div>
        </div>
      </div>

      {/* Footer Disclaimer */}
      <div className="text-center pb-2 text-[11px] text-slate-400">
        By signing in you agree to SwiftScan Terms & In-Store Guidelines.
      </div>
    </div>
  );
};
