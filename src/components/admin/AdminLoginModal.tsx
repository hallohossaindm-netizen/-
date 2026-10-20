import React, { useState } from 'react';
import { Lock, Mail, Eye, EyeOff, ShieldCheck, AlertCircle, X, CheckCircle, Send, KeyRound } from 'lucide-react';
import { useMadrasah } from '../../context/MadrasahContext';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const { loginAdmin, sendPasswordReset } = useMadrasah();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resetMessage, setResetMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSendingReset, setIsSendingReset] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setResetMessage(null);

    const cleanEmail = email.trim();
    const cleanPassword = password.trim();

    if (!cleanEmail) {
      setError('অনুগ্রহ করে আপনার অনুমোদিত এডমিন ইমেইল লিখুন।');
      return;
    }

    if (!cleanPassword) {
      setError('অনুগ্রহ করে আপনার ফায়ারবেস পাসওয়ার্ড লিখুন।');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await loginAdmin(cleanEmail, cleanPassword);
      if (res.success) {
        setEmail('');
        setPassword('');
        setError(null);
        onSuccess();
      } else {
        setError(res.message || 'লগইন ব্যর্থ হয়েছে।');
      }
    } catch (err: any) {
      setError(err?.message || 'লগইনে অপ্রত্যাশিত সমস্যা হয়েছে।');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePasswordReset = async () => {
    setError(null);
    setResetMessage(null);

    const cleanEmail = email.trim();
    if (!cleanEmail) {
      setError('পাসওয়ার্ড রিসেট লিংক পাঠাতে অনুগ্রহ করে উপরে আপনার ইমেইলটি লিখুন।');
      return;
    }

    setIsSendingReset(true);
    try {
      const res = await sendPasswordReset(cleanEmail);
      if (res.success) {
        setResetMessage(res.message || `${cleanEmail} ঠিকানায় রিসেট লিংক পাঠানো হয়েছে।`);
      } else {
        setError(res.message || 'পাসওয়ার্ড রিসেট লিংক পাঠানো যায়নি।');
      }
    } catch (err: any) {
      setError(err?.message || 'পাসওয়ার্ড রিসেট লিংক পাঠাতে সমস্যা হয়েছে।');
    } finally {
      setIsSendingReset(false);
    }
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
            তালিমুল কুরআন মহিলা মাদ্রাসার Firebase Authentication দ্বারা সুরক্ষিত প্রশাসনিক নিয়ন্ত্রণ ড্যাশবোর্ড।
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

          {resetMessage && (
            <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60 rounded-lg flex items-start gap-2 text-xs text-emerald-800 dark:text-emerald-300 font-bangla">
              <CheckCircle className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600 dark:text-emerald-400" />
              <span>{resetMessage}</span>
            </div>
          )}

          {/* Admin Email Field */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 font-bangla mb-1.5">
              এডমিন ইমেইল (Firebase Email) <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-stone-400 dark:text-stone-500">
                <Mail className="w-4 h-4" />
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (error) setError(null);
                }}
                placeholder="admin@talimulquran-madrasah.edu.bd"
                autoFocus
                autoComplete="email"
                required
                className="w-full pl-9 pr-3 py-2.5 bg-white dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-lg text-sm text-stone-900 dark:text-stone-100 placeholder-stone-400 dark:placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-[#064E3B] focus:border-transparent font-sans"
              />
            </div>
          </div>

          {/* Admin Password Field */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 font-bangla">
                এডমিন পাসওয়ার্ড (Firebase Password) <span className="text-red-500">*</span>
              </label>
              <button
                type="button"
                onClick={handlePasswordReset}
                disabled={isSendingReset}
                className="text-[11px] text-[#064E3B] dark:text-emerald-400 hover:underline font-bangla cursor-pointer flex items-center gap-1 disabled:opacity-50"
              >
                <KeyRound className="w-3 h-3" />
                <span>{isSendingReset ? 'পাঠানো হচ্ছে...' : 'পাসওয়ার্ড রিসেট?'}</span>
              </button>
            </div>
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
                placeholder="আপনার পাসওয়ার্ড লিখুন..."
                autoComplete="current-password"
                required
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
          </div>

          {/* Security Notice (Zero pills, high contrast) */}
          <div className="p-3 rounded-lg bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200/80 dark:border-emerald-900/60 text-[11px] text-emerald-950 dark:text-emerald-300 font-bangla flex items-start gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-700 dark:text-emerald-400 shrink-0 mt-0.5" />
            <span className="leading-relaxed">
              Google Firebase Authentication দ্বারা সুরক্ষিত। শুধুমাত্র মাদ্রাসার অনুমোদিত অ্যাডমিন একাউন্ট দিয়ে ড্যাশবোর্ডে প্রবেশ করা যাবে।
            </span>
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
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>যাচাই হচ্ছে...</span>
                </div>
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
