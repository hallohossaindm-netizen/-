import React, { useState } from 'react';
import { Lock, Eye, EyeOff, ShieldCheck, AlertCircle, X, CheckCircle } from 'lucide-react';
import { useMadrasah } from '../../context/MadrasahContext';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const { loginAdmin, hasCustomPassword } = useMadrasah();
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!password.trim()) {
      setError('অনুগ্রহ করে এডমিন পাসওয়ার্ড লিখুন।');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      const res = loginAdmin(password);
      setIsSubmitting(false);
      if (res.success) {
        setPassword('');
        setError(null);
        onSuccess();
      } else {
        setError(res.message || 'ভুল পাসওয়ার্ড।');
      }
    }, 250);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="admin-login-title"
    >
      <div
        className="relative w-full max-w-md bg-[#FAF9F5] dark:bg-stone-900 rounded-xl shadow-2xl border border-stone-200 dark:border-stone-800 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header decoration */}
        <div className="bg-[#064E3B] text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 text-emerald-200 hover:text-white hover:bg-emerald-800 rounded-md transition-colors cursor-pointer"
            aria-label="বন্ধ করুন"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-emerald-900 border border-emerald-700/60 flex items-center justify-center text-amber-400 shadow-inner">
              <ShieldCheck className="w-6 h-6 text-amber-300" />
            </div>
            <div>
              <span className="text-xs uppercase tracking-wider text-amber-300 font-semibold">
                প্রশাসনিক প্রবেশদ্বার
              </span>
              <h3 id="admin-login-title" className="text-xl font-bold font-bangla text-white">
                এডমিন লগইন প্যানেল
              </h3>
            </div>
          </div>
          <p className="text-xs text-emerald-100/90 font-bangla mt-2">
            তালিমুল কুরআন মহিলা মাদ্রাসার নোটিশ প্রকাশ, পরীক্ষার ফলাফল আপলোড এবং অনলাইন ভর্তি আবেদন নিয়ন্ত্রণের সুরক্ষিত ড্যাশবোর্ড।
          </p>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 rounded-lg flex items-start gap-2 text-xs text-red-700 dark:text-red-300 font-bangla animate-shake">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-600 dark:text-red-400" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 font-bangla mb-1.5">
              এডমিন সিকিউরিটি পাসওয়ার্ড <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-stone-400 dark:text-stone-500">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (error) setError(null);
                }}
                placeholder="পাসওয়ার্ড লিখুন..."
                autoFocus
                className="w-full pl-9 pr-10 py-2.5 bg-white dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-lg text-sm text-stone-900 dark:text-stone-100 placeholder-stone-400 dark:placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-[#064E3B] focus:border-transparent font-sans"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 focus:outline-none cursor-pointer"
                aria-label={showPassword ? 'পাসওয়ার্ড লুকান' : 'পাসওয়ার্ড দেখুন'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <div className="mt-2 flex items-center justify-between text-[11px] font-bangla">
              {hasCustomPassword ? (
                <span className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400 font-medium">
                  <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
                  <span>আপনার পরিবর্তিত নতুন পাসওয়ার্ড লিখুন (ডিফল্ট পাসওয়ার্ড ওভাররাইট হয়েছে)</span>
                </span>
              ) : (
                <>
                  <span className="text-stone-500 dark:text-stone-400">ডিফল্ট মাস্টার পাসওয়ার্ড: <code className="bg-stone-200 dark:bg-stone-800 px-1.5 py-0.5 rounded text-stone-800 dark:text-amber-300 font-sans font-semibold border border-stone-300 dark:border-stone-700">admin1234</code></span>
                  <span className="text-[10px] text-stone-400 dark:text-stone-500">পরিবর্তনযোগ্য</span>
                </>
              )}
            </div>
          </div>

          <div className="pt-2 flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 px-4 border border-stone-300 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-lg text-sm font-medium transition-colors font-bangla cursor-pointer"
            >
              বাতিল
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 py-2.5 px-4 bg-[#064E3B] hover:bg-[#043d2e] text-white rounded-lg text-sm font-semibold transition-colors flex items-center justify-center gap-2 font-bangla shadow-sm disabled:opacity-50 cursor-pointer"
            >
              {isSubmitting ? (
                <span>যাচাই হচ্ছে...</span>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4 text-amber-300" />
                  <span>লগইন করুন</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
